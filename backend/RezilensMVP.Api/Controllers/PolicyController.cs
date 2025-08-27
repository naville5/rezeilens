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
    public class PolicyController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<ApplicationRole> roleManager;

        private readonly IMaintenanceService _maintenanceService;

        public PolicyController(
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
        [HttpPost("create-policy")]
        public async Task<IActionResult> CreatePolicy([FromBody] PolicyDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var insertedPolicy = await _maintenanceService.AddPolicyAsync(
                model.PolicyTitle,
                model.Description,
                model.CreatedBy
            );

            if (insertedPolicy == null)
                return StatusCode(500, "Failed to create policy");

            return Ok(insertedPolicy);  // Return the inserted record
        }

        [Authorize]
        [HttpGet("get-policies")]
        public async Task<IActionResult> GetPolicies()
        {
            var policies = await _maintenanceService.GetAllPoliciesAsync();
            return Ok(policies);
        }

        [Authorize]
        [HttpGet("get-policies-for-user")]
        public async Task<IActionResult> GetPoliciesForUser()
        {
            var policies = await _maintenanceService.GetAllPoliciesForUserAsync();
            return Ok(policies);
        }


        [Authorize]
        [HttpGet("get-policy/{id:guid}")]
        public async Task<IActionResult> GetPolicyById(Guid id)
        {
            var policy = await _maintenanceService.GetPolicyByIdAsync(id);
            if (policy == null)
                return NotFound($"Policy with Id {id} not found.");

            return Ok(policy);
        }
        [Authorize]
        [HttpPut("update-policy")]
        public async Task<IActionResult> UpdatePolicy([FromBody] UpdatePolicyRequest request)
        {
            try
            {
                // Call the service to update the policy and get the updated policy data
                var updatedPolicy = await _maintenanceService.UpdatePolicyAsync(request.PolicyId, request.PolicyTitle, request.Description);

                // Return the updated policy in the response if the update was successful
                return Ok(updatedPolicy);
            }
            catch (Exception ex)
            {
                // Return the error message if update fails or throws an exception
                return StatusCode(500, new { Message = "An error occurred while updating the policy", Error = ex.Message });
            }
        }
        [Authorize]
        [HttpPut("acknowledge-policy")]
        public async Task<IActionResult> AcknowledgePolicy([FromBody] AcknowledgePolicyRequest request)
        {
            if (request.PolicyId == Guid.Empty || request.AcknowledgedBy == Guid.Empty)
                return BadRequest("Invalid PolicyId or AcknowledgedBy.");

            try
            {
                var acknowledgedPolicy = await _maintenanceService.AcknowledgePolicyAsync(request.PolicyId, request.AcknowledgedBy);
                return Ok(acknowledgedPolicy);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("publish-policy")]
        public async Task<IActionResult> PublishPolicy([FromBody] PublishPolicyDto model)
        {
            if (model.PolicyId == Guid.Empty)
                return BadRequest("Invalid PolicyId.");

            try
            {
                var publishedPolicy = await _maintenanceService.PublishPolicyAsync(model.PolicyId, model.Publish);
                return Ok(publishedPolicy);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }





    }

    public class AcknowledgePolicyRequest
    {
        public Guid PolicyId { get; set; }
        public Guid AcknowledgedBy { get; set; }
    }
    public class PublishPolicyDto
    {
        public Guid PolicyId { get; set; }
        public bool Publish { get; set; } // true = publish, false = unpublish
    }

}
