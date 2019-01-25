using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Backend.Data;
using Backend.Dtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ActivityController : ControllerBase
  {
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;
    public ActivityController(DataContext context, UserManager<User> userManager,
      IMapper mapper)
    {
      _context = context;
      _userManager = userManager;
      _mapper = mapper;
    }

    // GET: api/activity
    [HttpGet]
    public async Task<IActionResult> GetActivity()
    {
      var activity = await _context.Activity
        .Include(u => u.User)
        .ThenInclude(p => p.Photos)
        .Include(e => e.Event)
        .OrderByDescending(a => a.Created)
        .Take(6)
        .ToListAsync();

      var activityForReturn = _mapper.Map<IEnumerable<ActivityForReturnDto>>(activity);

      return Ok(activityForReturn);
    }
  }
}
