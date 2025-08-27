using Azure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using RezilensMVP.Api.Models;
using RezilensMVP.Api.Repositories.Maintenance;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RezilensMVP.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<ApplicationRole> roleManager;

        private readonly IMaintenanceService maintenanceService;

        public AuthenticationController(
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            RoleManager<ApplicationRole> roleManager
            , IMaintenanceService maintenanceService
            )
        {
            this.userManager = userManager;
            _configuration = configuration;
            this.roleManager = roleManager;

            this.maintenanceService = maintenanceService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await userManager.FindByNameAsync(model.Username);
            if (user == null)
                return NotFound(new { message = "User not found" });

            if (user.LockoutEnabled)
                return Ok(new { Status = "Success", Message = "User is Locked. Kindly contact Admin." });

            if (await userManager.CheckPasswordAsync(user, model.Password))
            {
                var roles = await userManager.GetRolesAsync(user);
                var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
                foreach (var role in roles)
                    authClaims.Add(new Claim(ClaimTypes.Role, role));

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddHours(3),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
                );

                //var userDetails = await maintenanceService.GetUserDetails(user.Id);
                var fullname = "";//string.Join(' ', new[] { userDetails[0].FirstName, userDetails[0].MiddleName, userDetails[0].LastName });

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo,
                    id = user.Id,
                    userType = roles,
                    fullname,
                    email = user.Email,
                    username = user.UserName,
                    UserProfileImage = user.UserProfileImage
                });
            }

            return Unauthorized();
        }

        
    }
}
