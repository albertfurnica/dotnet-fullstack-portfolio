using System.ComponentModel.DataAnnotations;

namespace MovieTracker.Api.Models;

public class User
{
    public int Id { get; set; }

    [Required(ErrorMessage = "First name is mandatory!")]
    [RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "First name must contains only letters!")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "First name must have between 2 and 50 letters")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is mandatory!")]
    [RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "Last name must contains only letters!")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is mandatory!")]
    [EmailAddress(ErrorMessage = "Introduce a valid email adress!")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is mandatory!")]
    [MinLength(8, ErrorMessage = "Password must have at least 8 characters!")]
    public string Password { get; set; } = string.Empty;

    public bool IsAdmin { get; set; }
}
