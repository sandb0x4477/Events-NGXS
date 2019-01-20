using System;

namespace Backend.Dtos
{
  public class EventForUpdateDto
  {
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Category { get; set; }
    public string Description { get; set; }
    public string City { get; set; }
    public string Venue { get; set; }
    public double VenueLat { get; set; }
    public double VenueLng { get; set; }
    public DateTime Date { get; set; }
  }
}