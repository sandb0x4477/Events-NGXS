using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
  public class DataContext : IdentityDbContext<User>
  {
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DbSet<Event> Events { get; set; }
    public DbSet<Photo> Photos { get; set; }
    public DbSet<EventUser> EventUsers { get; set; }
    public DbSet<Activity> Activity { get; set; }
    public DbSet<Chat> Chats { get; set; }


    protected override void OnModelCreating(ModelBuilder builder)
    {
      base.OnModelCreating(builder);

      builder.Entity<EventUser>()
        .HasKey(k => new { k.EventId, k.UserId});

//      builder.Entity<UserCategory>()
//        .HasKey(k => new { k.UserId, k.CategoryId});

//      builder.Entity<EventUser>()
//        .HasOne(e => e.Event)
//        .WithMany(u => u.EventUsers)
//        .HasForeignKey(k => k.EventId)
//        .OnDelete(DeleteBehavior.Restrict);
//
//      builder.Entity<EventUser>()
//        .HasOne(e => e.User)
//        .WithMany(u => u.Events)
//        .HasForeignKey(k => k.UserId)
//        .OnDelete(DeleteBehavior.Restrict);
    }
  }
}
