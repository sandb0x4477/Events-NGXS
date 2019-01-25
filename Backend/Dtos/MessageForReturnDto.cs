using System;

namespace Backend.Dtos
{
  public class MessageForReturnDto
  {
    public Guid Id { get; set; }
    public Guid EventId { get; set; }
    public string UserId { get; set; }
    public string Message { get; set; }
    public DateTime Created { get; set; }
    public string PhotoUrl { get; set; }
    // public string EventTitle { get; set; }
    public string UserUserName { get; set; }
  }
}
