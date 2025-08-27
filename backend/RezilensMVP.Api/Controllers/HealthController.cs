using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using RezilensMVP.Api.Models;
using RezilensMVP.Api.Repositories.Maintenance;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RezilensMVP.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<ApplicationRole> roleManager;

        private readonly IMaintenanceService _maintenanceService;

        public HealthController(
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            RoleManager<ApplicationRole> roleManager
            , IMaintenanceService maintenanceService
            )
        {
            this.userManager = userManager;
            _configuration = configuration;
            this.roleManager = roleManager;

            this._maintenanceService = maintenanceService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            string dbStatus;

            try
            {
                using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                await connection.OpenAsync();
                dbStatus = "Healthy";
            }
            catch (Exception ex)
            {
                dbStatus = $"Unhealthy - {ex.Message}";
            }

            var result = new
            {
                status = dbStatus == "Healthy" ? "Healthy" : "Degraded",
                database = dbStatus,
                uptime = (DateTime.UtcNow - System.Diagnostics.Process.GetCurrentProcess().StartTime.ToUniversalTime())
                            .ToString(@"dd\.hh\:mm\:ss"),
                timestamp = DateTime.UtcNow
            };

            return Ok(result);
        }

    }
}
