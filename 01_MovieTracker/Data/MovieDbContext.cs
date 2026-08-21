using Microsoft.EntityFrameworkCore;
using MovieTracker.Api.Models;

namespace MovieTracker.Api.Data;

public class MovieDbContext(DbContextOptions<MovieDbContext> options) : DbContext(options)
{
    public DbSet<Movie> Movies { get; set; }
    public DbSet<User> Users { get; set; }
}
