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
    public class DashboardController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<ApplicationRole> roleManager;

        private readonly IMaintenanceService _maintenanceService;

        public DashboardController(
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

        [Authorize]
        [HttpGet("get-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var result = await _maintenanceService.GetDashboardStatsAsync();
            return Ok(result);
        }

    }
}
