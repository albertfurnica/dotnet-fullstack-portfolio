using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieTracker.Api.Data;
using MovieTracker.Api.Models;

namespace MovieTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController(MovieDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMovies()
    {
        var movies = await context.Movies.ToListAsync();
        return Ok(movies);
    }

    [HttpPost]
    public async Task<IActionResult> AddMovie(Movie movie)
    {
        context.Movies.Add(movie);
        await context.SaveChangesAsync();
        return Ok(movie);
    }
}
