using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RezilensMVP.Api.Models;
using RezilensMVP.Api.Repositories.Maintenance;

namespace RezilensMVP.Api.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class RiskExceptionController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<ApplicationRole> roleManager;

        private readonly IMaintenanceService _maintenanceService;

        public RiskExceptionController(
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
        [HttpGet("published-policies-for-exception")]
        public async Task<IActionResult> GetPublishedPoliciesForException()
        {
            try
            {
                var policies = await _maintenanceService.GetPublishedPoliciesForExceptionAsync();
                return Ok(policies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("submit-risk-exception")]
        public async Task<IActionResult> SubmitRiskException([FromBody] SubmitRiskExceptionRequest dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var exception = await _maintenanceService.SubmitRiskExceptionAsync(
                    dto.PolicyId,
                    dto.SubmittedBy,
                    dto.Reason,
                    dto.DurationInDays,
                    dto.RiskRating
                );

                return Ok(exception);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("all-risk-exceptions")]
        public async Task<IActionResult> GetAllRiskExceptions()
        {
            try
            {
                var exceptions = await _maintenanceService.GetAllRiskExceptionsAsync();
                return Ok(exceptions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("update-risk-exception-status")]
        public async Task<IActionResult> UpdateRiskExceptionStatus([FromBody] UpdateRiskExceptionStatusRequest request)
        {
            try
            {
                var updatedException = await _maintenanceService.UpdateRiskExceptionStatusAsync(
                    request.RiskExceptionId,
                    request.IsApproved,
                    request.AdminComments,
                    request.ApprovedBy // logged-in admin
                );

                return Ok(updatedException);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }




    }

    public class UpdateRiskExceptionStatusRequest
    {
        public Guid RiskExceptionId { get; set; }
        public int IsApproved { get; set; } // 1 = Approve, 2 = Reject
        public string AdminComments { get; set; }
        public Guid ApprovedBy { get; set; }
    }

    public class SubmitRiskExceptionRequest
    {
        public Guid PolicyId { get; set; }
        public Guid SubmittedBy { get; set; }
        public string Reason { get; set; }
        public int DurationInDays { get; set; }
        public string RiskRating { get; set; }
    }

}