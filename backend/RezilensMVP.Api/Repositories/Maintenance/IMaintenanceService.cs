using RezilensMVP.Api.Models;

namespace RezilensMVP.Api.Repositories.Maintenance
{
    public interface IMaintenanceService
    {
        //Dashboard
        public Task<DashboardStatsDto> GetDashboardStatsAsync();

        //Policy Management
        public Task<PolicyMaster> AddPolicyAsync(string policyTitle, string description, Guid createdBy);
        public Task<List<PolicyMaster>> GetAllPoliciesAsync();
        public Task<List<PolicyMaster>> GetAllPoliciesForUserAsync();
        public Task<PolicyMaster> PublishPolicyAsync(Guid policyId, bool publish);

        public Task<PolicyMasterDto?> GetPolicyByIdAsync(Guid policyId);
        public Task<PolicyMaster> UpdatePolicyAsync(Guid policyId, string policyTitle, string description);
        public Task<PolicyMaster> AcknowledgePolicyAsync(Guid policyId, Guid acknowledgedBy);

        //Risk Exception
        public Task<List<PolicyMaster>> GetPublishedPoliciesForExceptionAsync();
        public Task<RiskExceptionMaster> SubmitRiskExceptionAsync(
      Guid policyId,
      Guid submittedBy,
      string reason,
      int durationInDays,
      string riskRating);
        public Task<List<RiskExceptionWithPolicy>> GetAllRiskExceptionsAsync();

        public Task<RiskExceptionMaster> UpdateRiskExceptionStatusAsync(
    Guid riskExceptionId,
    int isApproved,
    string adminComments,
    Guid approvedBy);

        //Reports
        public Task<List<PolicyWithExceptionDto>> GetPoliciesWithExceptionsAndAcknowledgementsAsync();

    }
}
