using System;

namespace Backend.Data
{
  public class Activity
  {
    public Guid Id { get; set; }
    public Guid EventId { get; set; }
    public Event Event { get; set; }
    public string UserId { get; set; }
    public User User { get; set; }
    public string Type { get; set; }
    public DateTime Created { get; set; }
    public Activity() { Created = DateTime.UtcNow; }

  }
}
