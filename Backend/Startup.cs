using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Backend.Data;
using Backend.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Backend
{
  public class Startup
  {
    public Startup(IConfiguration configuration) { Configuration = configuration; }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
      services.AddDbContext<DataContext>(options =>
        options.UseNpgsql(Configuration.GetConnectionString("Postgres")));


      services.AddIdentity<User, IdentityRole>(options =>
        {
          options.Password.RequireDigit = false;
          options.Password.RequireLowercase = false;
          options.Password.RequireUppercase = false;
          options.Password.RequiredLength = 6;
          options.Password.RequireNonAlphanumeric = false;
          options.Password.RequiredUniqueChars = 3;
          options.User.RequireUniqueEmail = true;
        })
        .AddRoles<IdentityRole>()
        .AddRoleManager<RoleManager<IdentityRole>>()
        .AddRoleValidator<RoleValidator<IdentityRole>>()
        .AddEntityFrameworkStores<DataContext>()
        .AddDefaultTokenProviders();


      services.AddAuthentication(options =>
        {
          options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
          options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
          options.TokenValidationParameters = new TokenValidationParameters
          {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII
              .GetBytes(Configuration.GetSection("Token").Value)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true
          };
        });

      services.AddAuthorization(options =>
      {
        options.AddPolicy("Authenticated",
          policy => policy.RequireRole("User", "Admin"));
      });

      services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));

      // Register the Swagger services
      services.AddSwaggerDocument(
        configure =>
        {
          configure.PostProcess = document =>
          {
            document.Info.Version = "v1";
            document.Info.Title = "My API";
            document.Info.Description = "ASP.NET Core Web API";
          };
        });

      services.AddMvc()
        .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
        .AddJsonOptions(opt =>
        {
          opt.SerializerSettings.ReferenceLoopHandling =
            Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        });

      Mapper.Reset();
      services.AddAutoMapper();

      services.AddCors();
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env,
      IServiceProvider services)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseExceptionHandler(builder =>
        {
          builder.Run(async context =>
          {
            context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;

            var error = context.Features.Get<IExceptionHandlerFeature>();
            if (error != null)
            {
              context.Response.AddApplicationError(error.Error.Message);
              await context.Response.WriteAsync(error.Error.Message);
            }
          });
        });
      }

      // app.UseCors(x =>
      //   x.WithOrigins("http://localhost:4200")
      //     .AllowAnyHeader()
      //     .AllowAnyMethod());

      // Register the Swagger generator and the Swagger UI middlewares
      app.UseSwagger();
      app.UseSwaggerUi3();

      app.UsePathBase("/ngevents");
      app.UseDefaultFiles();
      app.UseStaticFiles();

      app.UseAuthentication();

      app.UseForwardedHeaders (new ForwardedHeadersOptions {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
      });

      app.UseMvc(routes =>
      {
        routes.MapSpaFallbackRoute(
          name: "spa-fallback",
          defaults : new { controller = "Fallback", action = "index" }
        );
      });
//      CreateUserRoles(services).Wait();
    }

    #region AddRoles And Admin


    private static async Task CreateUserRoles(IServiceProvider serviceProvider)
    {
      var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
      var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

      var roles = new List<IdentityRole>
      {
        new IdentityRole {Name = "User"},
        new IdentityRole {Name = "Admin"},
        new IdentityRole {Name = "SuperUser"}
      };
      foreach (var role in roles)
      {
        var roleExists = await roleManager.RoleExistsAsync(role.Name);

        if (!roleExists)
        {
          roleManager.CreateAsync(role).Wait();
        }
      }

      var adminUser = new User
      {
        UserName = "Admin",
        Email = "admin@test.com"
      };

      var user = await userManager.FindByEmailAsync(adminUser.Email);
      if (user == null)
      {
        var createAdminUser = await userManager.CreateAsync(adminUser, "password123");

        if (createAdminUser.Succeeded)
        {
          // here we assign the new user the "Admin" role
          await userManager.AddToRoleAsync(adminUser, "Admin");
        }
      }
    }
    #endregion
  }
}
