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
    public class ReportsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<ApplicationRole> roleManager;

        private readonly IMaintenanceService _maintenanceService;

        public ReportsController(
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

        [HttpGet("GetPoliciesWithExceptionsAndAcknowledgements")]
        public async Task<IActionResult> GetPoliciesWithExceptionsAndAcknowledgements()
        {
            var policies = await _maintenanceService.GetPoliciesWithExceptionsAndAcknowledgementsAsync();

            if (policies == null || !policies.Any())
            {
                return NotFound("No policies found.");
            }

            return Ok(policies);
        }


    }
}
