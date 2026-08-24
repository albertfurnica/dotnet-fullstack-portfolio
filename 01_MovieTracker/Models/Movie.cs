namespace MovieTracker.Api.Models;

public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public int ReleaseYear { get; set; }
    public bool IsWatched { get; set; }
    public int? Rating { get; set; }

    public string? PosterUrl { get; set; }
}
