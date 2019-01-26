using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Backend.Data;
using Backend.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers
{
  [Route("apievents/[controller]")]
  [ApiController]
  public class UsersController : ControllerBase
  {
    private readonly DataContext _context;
    private readonly SignInManager<User> _signInManager;
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;

    public UsersController(DataContext context, SignInManager<User> signInManager,
      UserManager<User> userManager, IMapper mapper)
    {
      _context = context;
      _signInManager = signInManager;
      _userManager = userManager;
      _mapper = mapper;
    }

    // GET
    [HttpGet("{id}", Name = "GetUser")]
    public async Task<IActionResult> GetUser(string id)
    {
      var user = await _context.Users
        .Include(p => p.Photos)
        .FirstOrDefaultAsync(u => u.Id == id);

      if (user == null)
      {
        return NotFound();
      }

      var userToReturn = _mapper.Map<UserForReturnDto>(user);

      return Ok(userToReturn);
    }

    [Authorize(Policy = "Authenticated")]
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateUser(string id, UserForUpdateDto userForUpdateDto)
    {
      var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

      if (id != currentUserId)
        return Unauthorized();

//      var userForUpdate = _mapper.Map<User>(userForUpdateDto);
//
//      userForUpdate.Id = currentUserId;
      var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserId);

      _mapper.Map(userForUpdateDto, user);


      var result = await _context.SaveChangesAsync();

      if (result == 0) return BadRequest($"Updating user {id} failed on save.");

      return NoContent();
    }
  }
}
