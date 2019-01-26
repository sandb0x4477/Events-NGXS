using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Backend.Data;
using Backend.Dtos;
using Backend.Helpers;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Backend.Controllers
{
  [Route("apievents/[controller]")]
  [ApiController]
  public class PhotosController : ControllerBase
  {
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger _logger;
    private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
    private Cloudinary _cloudinary;
    private readonly UserManager<User> _userManager;

    public PhotosController(DataContext context, IMapper mapper, UserManager<User> userManager,
      IOptions<CloudinarySettings> cloudinaryConfig, ILogger<AuthController> logger)
    {
      _userManager = userManager;
      _cloudinaryConfig = cloudinaryConfig;
      _context = context;
      _mapper = mapper;
      _logger = logger;

      Account acc = new Account(
        _cloudinaryConfig.Value.CloudName,
        _cloudinaryConfig.Value.ApiKey,
        _cloudinaryConfig.Value.ApiSecret
      );

      _cloudinary = new Cloudinary(acc);
    }

    // GET: api/Photos
    [HttpGet]
    public async Task<IActionResult> GetPhotos()
    {
      var photos = await _context.Photos.ToListAsync();
      var photosToReturn = _mapper.Map<IEnumerable<PhotoForReturnDto>>(photos);
      return Ok(photosToReturn);
    }

    // GET: api/Photos/users/{id}
    [HttpGet("user/{id}")]
    public async Task<IActionResult> GetPhotosForUser(string id)
    {
      var photos = await _context.Photos
        .Where(u => u.UserId == id)
        .OrderBy(p => p.IsMain)
        .ToListAsync();

      var photosToReturn = _mapper.Map<IEnumerable<PhotoForReturnDto>>(photos);
      return Ok(photosToReturn);
    }

    // GET: api/Photos/5
    [HttpGet("{id}", Name = "GetPhoto")]
    public async Task<IActionResult> GetPhoto(Guid id)
    {
      var photo = await _context.Photos.FindAsync(id);
      if (photo == null)
      {
        return NotFound();
      }

      var photoForReturn = _mapper.Map<PhotoForReturnDto>(photo);

      return Ok(photoForReturn);
    }

    // POST: api/Photos/setMain
    [Authorize(Policy = "Authenticated")]
    [HttpPost("{id}/setMain")]
    public async Task<IActionResult> SetMainPhoto(Guid id)
    {
      var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
      var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);

      if (photo == null)
      {
        return BadRequest();
      }

      if (photo.UserId != currentUserId) return Unauthorized();

      if (photo.IsMain)
        return BadRequest("This is already the main photo");

      var currentMainPhoto = await _context.Photos
        .Where(u => u.UserId == currentUserId)
        .FirstOrDefaultAsync(p => p.IsMain);

      currentMainPhoto.IsMain = false;
      photo.IsMain = true;

      var result = await _context.SaveChangesAsync();

      if (result == 0) return BadRequest("Could not set photo to main");

      return NoContent();
    }

    // POST: api/Photos
    [Authorize(Policy = "Authenticated")]
    [HttpPost]
    public async Task<IActionResult> PostPhoto([FromForm] PhotoForCreationDto photoForCreationDto)
    {
      if (!ModelState.IsValid) return BadRequest();

      var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
      var user = await _context.Users
        .Include(p => p.Photos)
        .FirstOrDefaultAsync(u => u.Id == currentUserId);

      var file = photoForCreationDto.File;

      var uploadResult = new ImageUploadResult();

      if (file.Length > 0)
      {
        using(var stream = file.OpenReadStream())
        {
          var uploadParams = new ImageUploadParams()
          {
          File = new FileDescription(file.Name, stream),
          Transformation = new Transformation()
          .Width(160).Height(160).Crop("fill").Gravity("face")
          };

          uploadResult = _cloudinary.Upload(uploadParams);
        }
      }

      photoForCreationDto.photoUrl = uploadResult.SecureUri.ToString();
      photoForCreationDto.PublicId = uploadResult.PublicId;

      var photo = _mapper.Map<Photo>(photoForCreationDto);

      if (!user.Photos.Any(u => u.IsMain)) photo.IsMain = true;

      photo.UserId = currentUserId;

      _context.Photos.Add(photo);

      var result = await _context.SaveChangesAsync();

      if (result == 0) return BadRequest("Unable to add photo");

      var photoForReturn = _mapper.Map<PhotoForReturnDto>(photo);

      return CreatedAtRoute("GetPhoto", new { id = photo.Id }, photoForReturn);
    }

    // DELETE: api/Photos/5
    [Authorize(Policy = "Authenticated")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<Photo>> DeletePhoto(Guid id)
    {
      var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
      var photo = await _context.Photos.FindAsync(id);
      if (photo == null)
      {
        return NotFound();
      }

      if (photo.UserId != currentUserId) return Unauthorized();

      if (photo.IsMain) return BadRequest("Can not delete main photo");

      if (photo.PublicId != null)
      {
        var deleteParams = new DeletionParams(photo.PublicId);

        var resultClaudinary = _cloudinary.Destroy(deleteParams);

        if (resultClaudinary.Result == "ok") _context.Photos.Remove(photo);
      }

      if (photo.PublicId == null) _context.Photos.Remove(photo);

      var result = await _context.SaveChangesAsync();
      if (result != 0) return Ok();

      return BadRequest("Failed to delete the photo");
    }
  }
}
