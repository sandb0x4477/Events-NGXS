using System;

namespace Backend.Data
{
  public class EventUser
  {
    public Guid EventId { get; set; }
    public string UserId { get; set; }
    public Event Event { get; set; }
    public User User { get; set; }
    public bool IsHost { get; set; }
  }
}
