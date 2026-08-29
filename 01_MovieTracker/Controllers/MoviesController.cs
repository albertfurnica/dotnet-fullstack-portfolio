using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
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

    [HttpGet("tmdb/popular")]
    public async Task<IActionResult> GetTmdbPopular()
    {
        const string tmdbUrl = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
        using var client = new HttpClient();

        client.DefaultRequestHeaders.Add("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNmM4YTkxZTNlNDRiNWM2YjIxYTFkZmRiMWY2OGE3MSIsIm5iZiI6MTc4NzkzMTQ1MS4zMDU5OTk4LCJzdWIiOiI2YTkxYWIzYjM1ZDAyNjk3ZmM0YTI0ZmQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.2C2SIOu9y2Do7PrGT_d9ycwuRpgkDeTYb8GOtHl4wGM");
        client.DefaultRequestHeaders.Add("accept", "application/json");

        var response = await client.GetAsync(tmdbUrl);
        var content = await response.Content.ReadAsStringAsync();

        return Content(content, "application/json");
    }

    [HttpGet("tmdb/search/{query}")]
    public async Task<IActionResult> SearchTmdb(string query)
    {
        string tmdbUrl = $"https://api.themoviedb.org/3/search/movie?query={query}&language=en-US&page=1";
        using var client = new HttpClient();

        client.DefaultRequestHeaders.Add("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNmM4YTkxZTNlNDRiNWM2YjIxYTFkZmRiMWY2OGE3MSIsIm5iZiI6MTc4NzkzMTQ1MS4zMDU5OTk4LCJzdWIiOiI2YTkxYWIzYjM1ZDAyNjk3ZmM0YTI0ZmQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.2C2SIOu9y2Do7PrGT_d9ycwuRpgkDeTYb8GOtHl4wGM");
        client.DefaultRequestHeaders.Add("accept", "application/json");

        var response = await client.GetAsync(tmdbUrl);
        var content = await response.Content.ReadAsStringAsync();

        return Content(content, "application/json");
    }


}
