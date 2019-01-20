using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Backend.Data;
using Backend.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class EventsController : ControllerBase
  {
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;

    public EventsController(DataContext context, UserManager<User> userManager,
       IMapper mapper)
    {
      _context = context;
      _userManager = userManager;
      _mapper = mapper;
    }
    
    // GET: api/Events
    [HttpGet]
    public async Task<IActionResult> GetEvents()
    {
      var events = await _context.Events
        .Include(eu => eu.EventUsers)
        .ThenInclude(u => u.User)
        .ThenInclude(p => p.Photos)
        .OrderBy(u => u.Date)
        .ToListAsync();

      var eventsForReturn = _mapper.Map<IEnumerable<EventForReturnDto>>(events);

      return Ok(eventsForReturn);
    }
    
    // GET: api/Events
    [HttpGet("{id}", Name = "GetEvent")]
    public async Task<IActionResult> GetEvent(Guid id)
    {
      var _event = await _context.Events
        .Include(eu => eu.EventUsers)
        .ThenInclude(u => u.User)
        .ThenInclude(p => p.Photos)
        .FirstOrDefaultAsync(e => e.Id == id);

      var eventForReturn = _mapper.Map<EventForReturnDto>(_event);

      return Ok(eventForReturn);
    }

    // POST: api/Events
    [Authorize(Policy = "Authenticated")]
    [HttpPost]
    public async Task<IActionResult> PostEvent(EventForCreationDto eventForCreationDto)
    {
      var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
      var user = await _userManager.FindByIdAsync(currentUserId);
      
      var _event = _mapper.Map<Event>(eventForCreationDto);

      await _context.Events.AddAsync(_event);

      var eventUser = new EventUser
      {
        Event = _event,
        User = user,
        IsHost = true
      };

      await _context.AddAsync(eventUser);
      var result = await _context.SaveChangesAsync();

      if (result != 2) return BadRequest("Error creating Event");

      var eventForReturn = _mapper.Map<EventForReturnDto>(_event);

      return CreatedAtAction("GetEvent", new {id = _event.Id}, eventForReturn);
    }
    
    [Authorize(Policy = "Authenticated")]
    [HttpPatch]
    public async Task<IActionResult> UpdateEvent(EventForUpdateDto eventForUpdateDto)
    {
      var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
      var _event = await _context.Events
        .Include(eu => eu.EventUsers)
        .FirstOrDefaultAsync(e => e.Id == eventForUpdateDto.Id);

      var eventHost = _event.EventUsers.FirstOrDefault(eu => eu.IsHost);

      if (eventHost != null && currentUserId != eventHost.UserId) return BadRequest();
      
      _mapper.Map(eventForUpdateDto, _event);

      var result = await _context.SaveChangesAsync();

      if (result == 0) return BadRequest($"Updating event {_event.Id} failed on save.");

      return NoContent();
    }

    [Authorize(Policy = "Authenticated")]
    [HttpPost("{eventId}")]
    public async Task<IActionResult> JoinEvent(Guid eventId)
    {
      var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
      var user = await _userManager.FindByIdAsync(currentUserId);
      var _event = await _context.Events.FindAsync(eventId);
      
      var eventUser = new EventUser
      {
        Event = _event,
        User = user,
        IsHost = false
      };
      
      await _context.AddAsync(eventUser);
      var result = await _context.SaveChangesAsync();
      
      if (result == 0) return BadRequest("Error joining Event");
      return Ok();
    }
    
    [Authorize(Policy = "Authenticated")]
    [HttpPost("{eventId}/cancel")]
    public async Task<IActionResult> CancelMyPlace(Guid eventId)
    {
      var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
      var user = await _userManager.FindByIdAsync(currentUserId);
      var _event = await _context.Events.FindAsync(eventId);

      var eventUser = await _context.EventUsers
        .Where(e => e.EventId == eventId)
        .FirstOrDefaultAsync(u => u.User == user);
      
      _context.Remove(eventUser);
      var result = await _context.SaveChangesAsync();
      
      if (result == 0) return BadRequest("Error joining Event");
      return Ok();
    }
  }
}