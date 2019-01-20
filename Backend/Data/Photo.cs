using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Data
{
  public class Photo
  {
    public Guid Id { get; set; }
    [Required] public string PhotoUrl { get; set; }
    public DateTime DateAdded { get; set; }
    public bool IsMain { get; set; }
    public string PublicId { get; set; }
    public string UserId { get; set; }
    public User User { get; set; }
  }
}
