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
            user.IsAdmin,
            UserId = user.Id,
            user.FirstName
    });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> EditUser(int id, [FromBody] User updatedUser)
    {
        if(id != updatedUser.Id)
        {
            return BadRequest("ID mismatch");
        }

        var existingUser = await context.Users.FindAsync(id);
        if (existingUser == null)
        {
            return NotFound();
        }

        existingUser.LastName = updatedUser.LastName;
        existingUser.FirstName = updatedUser.FirstName;
        existingUser.Email = updatedUser.Email;
        existingUser.Password = updatedUser.Password;
        existingUser.IsAdmin = updatedUser.IsAdmin;

        await context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }
        context.Users.Remove(user);
        await context.SaveChangesAsync();

        return NoContent();
    }


}
