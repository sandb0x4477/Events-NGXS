using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Data
{
  public class Event
  {
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Category { get; set; }
    public string Description { get; set; }
    public string City { get; set; }
    public string Venue { get; set; }
    public double VenueLat { get; set; }
    public double VenueLng { get; set; }
    public bool IsCancelled { get; set; } = false;
    
    [Column(TypeName="timestamptz")]

    public DateTime Date { get; set; }

    public DateTime Created { get; set; }
    public ICollection<EventUser> EventUsers { get; set; }

    public Event() { Created = DateTime.UtcNow; }
    
    //    public DateTime Date { get; set; }
//    public string Description { get; set; }
//    public string City { get; set; }
//    public string Venue { get; set; }
//    public double VenueLat { get; set; }
//    public double VenueLng { get; set; }
//    public bool IsCancelled { get; set; }
//    public string HostName { get; set; }
//    public Category Category { get; set; }
//    public int CategoryId { get; set; }
//    public User Host { get; set; }
//    public string HostId { get; set; }
  }
}
