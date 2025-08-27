using Microsoft.AspNetCore.Identity;

namespace RezilensMVP.Api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? UserProfileImage { get; set; }
    }
}
