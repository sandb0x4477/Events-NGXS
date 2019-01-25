using System;

namespace Backend.Data
{
  public class Chat
  {
    public Guid Id { get; set; }
    public Guid EventId { get; set; }
    public Event Event { get; set; }
    public string UserId { get; set; }
    public User User { get; set; }
    public string Message { get; set; }
    public DateTime Created { get; set; }
    public Chat() { Created = DateTime.UtcNow; }

  }
}
