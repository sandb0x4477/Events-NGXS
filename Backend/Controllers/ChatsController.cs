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
  [Route("apievents/[controller]")]
  [ApiController]
  public class ChatsController : ControllerBase
  {
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;
    public ChatsController(DataContext context, UserManager<User> userManager,
      IMapper mapper)
    {
      _context = context;
      _userManager = userManager;
      _mapper = mapper;
    }

    // GET: api/chat/id
    [HttpGet("{id}", Name = "GetChat")]
    public async Task<IActionResult> GetChat(Guid id)
    {
      var chat = await _context.Chats
        .Where(e => e.EventId == id)
        .Include(u => u.User)
        .ThenInclude(p => p.Photos)
        .Include(e => e.Event)
        .OrderBy(d => d.Created)
        .ToListAsync();

      var chatForReturn = _mapper.Map<IEnumerable<ChatForReturnDto>>(chat);

      return Ok(chatForReturn);
    }

    // GET: api/chat/id
    [HttpGet("message/{id}", Name = "GetMessage")]
    public async Task<IActionResult> GetMessage(Guid id)
    {
      var message = await _context.Chats
        // .Where(m => m.Id == id)
        .Include(u => u.User)
        .ThenInclude(p => p.Photos)
        .Include(e => e.Event)
        .FirstOrDefaultAsync(u => u.Id == id);

      var messageForReturn = _mapper.Map<MessageForReturnDto>(message);

      return Ok(messageForReturn);
    }

    [Authorize(Policy = "Authenticated")]
    [HttpPost]
    public async Task<IActionResult> PostChatMessage(MessageForCreationDto messageForCreationDto)
    {
      var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
      var user = await _userManager.FindByIdAsync(currentUserId);

      messageForCreationDto.UserId = user.Id;

      var message = _mapper.Map<Chat>(messageForCreationDto);

      await _context.Chats.AddAsync(message);

      var result = await _context.SaveChangesAsync();

      if (result != 1) return BadRequest("Error creating Event");

      var messageForReturn = _mapper.Map<MessageForReturnDto>(message);

      var mainPhoto =  await _context.Photos
        .Where(u => u.UserId == currentUserId)
        .FirstOrDefaultAsync(p => p.IsMain);

      messageForReturn.PhotoUrl = mainPhoto.PhotoUrl;

      return CreatedAtRoute("GetMessage", new { id = messageForReturn.Id }, messageForReturn);
    }
  }
}
