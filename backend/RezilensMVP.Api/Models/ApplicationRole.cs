using Microsoft.AspNetCore.Identity;

namespace RezilensMVP.Api.Models
{
    public class ApplicationRole : IdentityRole
    {
        public bool IsEnabled { get; set; } = true;

    }

}
