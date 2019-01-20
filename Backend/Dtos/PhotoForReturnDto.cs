using System;

namespace Backend.Dtos
{
  public class PhotoForReturnDto
  {
    public Guid Id { get; set; }
    public string PhotoUrl { get; set; }
    public bool IsMain { get; set; }
    public DateTime DateAdded { get; set; }
    public string UserId { get; set; }
    public string PublicId { get; set; }
  }
}
