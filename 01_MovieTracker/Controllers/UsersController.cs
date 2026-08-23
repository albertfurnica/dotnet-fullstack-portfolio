using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieTracker.Api.Data;
using MovieTracker.Api.DTOs;
using MovieTracker.Api.Models;

namespace MovieTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(MovieDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await context.Users.ToListAsync();
        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> AdminRegister([FromBody] User _user)
    {
        var userExisting = await context.Users.AnyAsync(u => u.Email == _user.Email);

        if (userExisting)
        {
            return BadRequest("This email is already used!");
        }

        context.Users.Add(_user);
        await context.SaveChangesAsync();

        return Ok("The account has been created succesfully!");
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User _user)
    {
        var userExisting = await context.Users.AnyAsync(u => u.Email == _user.Email);

        if (userExisting)
        {
            return BadRequest("This email is already used!");
        }

        context.Users.Add(_user);
        await context.SaveChangesAsync();

        return Ok("The account has been created succesfully!");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody]LoginDto loginDto)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email && u.Password == loginDto.Password);

        if (user == null)
        {
            return Unauthorized("Incorrect email or password!");
        }


        return Ok(new
        {
            Message = "Login succesful!",
            IsAdmin = user.IsAdmin,
            UserId = user.Id,
            FirstName = user.FirstName 
    });
    }
}
