using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieTracker.Api.Data;
using MovieTracker.Api.Models;

namespace MovieTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(MovieDbContext context) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User _user)
    {
        var userExisting = context.Users.Any(u => u.Email == _user.Email);

        if (userExisting)
        {
            return BadRequest("This email is already used!");
        }

        context.Users.Add(_user);
        await context.SaveChangesAsync();

        return Ok("The account has been created succesfully!");
    }
}
