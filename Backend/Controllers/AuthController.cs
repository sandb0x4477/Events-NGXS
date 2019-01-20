using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers
{
  [AllowAnonymous]
  [Route("api/[controller]")]
  [ApiController]
  [SuppressMessage("ReSharper", "LoopCanBeConvertedToQuery")]
  public class AuthController : ControllerBase
  {
    private readonly DataContext _context;
    private readonly SignInManager<User> _signInManager;
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _config;

    public AuthController(DataContext context, SignInManager<User> signInManager,
      UserManager<User> userManager, IConfiguration config)
    {
      _context = context;
      _signInManager = signInManager;
      _userManager = userManager;
      _config = config;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
      var user = await _userManager.FindByEmailAsync(loginDto.Email);

      var result = await _signInManager
        .CheckPasswordSignInAsync(user, loginDto.Password, false);

      if (!result.Succeeded) return Unauthorized();

      var mainPhoto = await _context.Photos
        .Where(u => u.UserId == user.Id)
        .FirstOrDefaultAsync(p => p.IsMain);

      var mainPhotoUrl = mainPhoto == null ? "assets/user.png" : mainPhoto.PhotoUrl;

      var token = GenerateJwtToken(user).Result;
      
      var userToReturn = new {id = user.Id, username = user.UserName, mainPhotoUrl, token};

      return Ok(userToReturn);
    }

    // ! POST: api/Auth/ REGISTER
    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser(RegisterDto registerDto)
    {
      if (!ModelState.IsValid) return BadRequest();

      var user = new User {UserName = registerDto.UserName, Email = registerDto.Email};
      var result = await _userManager.CreateAsync(user, registerDto.Password);

      if (!result.Succeeded) return BadRequest(result.Errors);

      var userToReturn = new {id = user.Id, username = user.UserName};

      await _userManager.AddToRoleAsync(user, "User");

      return CreatedAtRoute("GetUser", new {controller = "Users", id = user.Id}, userToReturn);
    }

    private async Task<string> GenerateJwtToken(User user)
    {
      var claims = new List<Claim>
      {
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(ClaimTypes.NameIdentifier, user.Id)
      };

      var roles = await _userManager.GetRolesAsync(user);

      foreach (var role in roles)
      {
        claims.Add(new Claim(ClaimTypes.Role, role));
      }

      var secretKey = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(_config.GetSection("Token").Value));

      var signingCredentials =
        new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha512Signature);

      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.Now.AddDays(14),
        SigningCredentials = signingCredentials,
      };

      var tokenHandler = new JwtSecurityTokenHandler();

      var token = tokenHandler.CreateToken(tokenDescriptor);

      return tokenHandler.WriteToken(token);
    }
  }
}