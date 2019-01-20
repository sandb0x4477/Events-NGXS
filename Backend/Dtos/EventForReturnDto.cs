using System;
using System.Collections;
using System.Collections.Generic;
using Backend.Data;

namespace Backend.Dtos
{
  public class EventForReturnDto
  {
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Category { get; set; }
    public string Description { get; set; }
    public string City { get; set; }
    public string Venue { get; set; }
    public double VenueLat { get; set; }
    public double VenueLng { get; set; }
    public bool IsCancelled { get; set; }
    public DateTime Date { get; set; }
    public DateTime Created { get; set; }
    public ICollection<Attendee> EventUsers { get; set; }
  }

  public class Attendee
  {
    public string UserId { get; set; }
    public string UserName { get; set; }
    public bool IsHost { get; set; }
    public string PhotoUrl { get; set; }
  }
}
