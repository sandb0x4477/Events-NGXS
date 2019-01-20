using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Backend.Data
{
  public class User : IdentityUser
  {
    public string FullName { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string Occupation { get; set; }
    public string Gender { get; set; }
    public string Status { get; set; }
    public string About { get; set; }
    
    [Column(TypeName="date")]
    public DateTime? DateOfBirth { get; set; } = null;
    public ICollection<Photo> Photos { get; set; }

    public DateTime Created { get; set; }

    public User()
    {
      Created = DateTime.Now;
    }
  }
}
