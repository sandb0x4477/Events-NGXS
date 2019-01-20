using System;
using System.Collections.Generic;
using Backend.Data;

namespace Backend.Dtos
{
  public class UserForReturnDto
  {
    public string Id { get; set; }
    public string UserName { get; set; }
    public string FullName { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string Occupation { get; set; }
    public string Gender { get; set; }
    public string Status { get; set; }
    public string About { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public DateTime Created { get; set; }
//    public string PhotoUrl { get; set; }
    public ICollection<PhotoForReturnDto> Photos { get; set; }
  }
}
