using System;

namespace Backend.Dtos
{
  public class MessageForCreationDto
  {
    public string Message { get; set; }
    public Guid EventId { get; set; }
    public string UserId { get; set; }

  }
}
