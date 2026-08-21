using System.ComponentModel.DataAnnotations;

namespace MovieTracker.Api.DTOs;

public class LoginDto
{
    [Required(ErrorMessage = "Email is mandatory!")]
    [EmailAddress(ErrorMessage = "Introduce a valid email adress!")]
    public string Email { get; set; } = string.Empty;
    [Required(ErrorMessage = "Password is mandatory!")]
    public string Password { get; set; } = string.Empty;

}
