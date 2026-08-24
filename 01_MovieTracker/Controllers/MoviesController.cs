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

    [HttpPut("{id}")]
    public async Task<IActionResult> EditMovie(int id, Movie updatedMovie)
    {
        if (id != updatedMovie.Id)
        {
            return BadRequest();
        }

        var existingMovie = await context.Movies.FindAsync(id);
        if (existingMovie == null)
        {
            return NotFound();
        }

        existingMovie.Title = updatedMovie.Title;
        existingMovie.Genre = updatedMovie.Genre;
        existingMovie.ReleaseYear = updatedMovie.ReleaseYear;
        existingMovie.IsWatched = updatedMovie.IsWatched;
        existingMovie.Rating = updatedMovie.Rating;
        existingMovie.PosterUrl = updatedMovie.PosterUrl;

        await context.SaveChangesAsync();

        return NoContent();
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMovie(int id)
    {
        var movie = await context.Movies.FindAsync(id);

        if (movie == null)
        {
            return NotFound();
        }
            context.Movies.Remove(movie);
        await context.SaveChangesAsync();

        return NoContent();
    }

}
