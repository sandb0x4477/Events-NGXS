using System;

namespace Backend.Dtos
{
  public class UserForUpdateDto
  {
    public string FullName { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string Occupation { get; set; }
    public string Gender { get; set; }
    public string Status { get; set; }
    public string About { get; set; }
    public DateTime? DateOfBirth { get; set; }
  }
}