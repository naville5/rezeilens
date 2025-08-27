using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using RezilensMVP.Api.Data;
using RezilensMVP.Api.Models;
using System;
using System.Data;
using System.Net.Http;

namespace RezilensMVP.Api.Repositories.Maintenance
{
    public class MaintenanceService : IMaintenanceService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IConfiguration _configuration;
        public MaintenanceService(ApplicationDbContext dbContext, IConfiguration configuration, HttpClient httpClient)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }


        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var stats = new DashboardStatsDto();

            try
            {
                using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                using var command = new SqlCommand("sp_GetStats", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                await connection.OpenAsync();

                using var reader = await command.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    stats.TotalPublished = reader.GetInt32(reader.GetOrdinal("TotalPublishedPolicies"));
                    stats.TotalAcknowledged = reader.GetInt32(reader.GetOrdinal("TotalAcknowledged"));
                    stats.TotalExceptions = reader.GetInt32(reader.GetOrdinal("TotalExceptions"));
                    stats.ApprovedExceptions = reader.GetInt32(reader.GetOrdinal("ApprovedExceptions"));
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching stats.", ex);
            }

            return stats;
        }

        public async Task<PolicyMaster> AddPolicyAsync(string policyTitle, string description, Guid createdBy)
        {
            try
            {
                using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                using var command = new SqlCommand("sp_InsertPolicy", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.AddWithValue("@PolicyTitle", policyTitle);
                command.Parameters.AddWithValue("@Description", (object)description ?? DBNull.Value);
                command.Parameters.AddWithValue("@CreatedBy", createdBy);

                await connection.OpenAsync();

                using var reader = await command.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new PolicyMaster
                    {
                        Id = reader.GetGuid(reader.GetOrdinal("Id")),
                        PolicyTitle = reader.GetString(reader.GetOrdinal("PolicyTitle")),
                        PolicyDescription = reader["Description"] as string,
                        CreatedDate = reader.GetDateTime(reader.GetOrdinal("CreatedDate")),
                        UpdatedDate = reader.GetDateTime(reader.GetOrdinal("UpdatedDate")),
                        IsEnabled = reader.GetBoolean(reader.GetOrdinal("IsEnabled")),
                        CreatedBy = reader.GetGuid(reader.GetOrdinal("CreatedBy"))
                    };
                }

                return null;
            }
            catch (SqlException sqlEx)
            {
                throw new Exception("An error occurred while inserting the policy into the database.", sqlEx);
            }
            catch (Exception ex)
            {
                throw new Exception("An unexpected error occurred while creating the policy.", ex);
            }
        }

        public async Task<List<PolicyMaster>> GetAllPoliciesAsync()
        {
            var policies = new List<PolicyMaster>();

            try
            {
                using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                using var command = new SqlCommand("sp_GetAllPolicies", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                await connection.OpenAsync();

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    policies.Add(new PolicyMaster
                    {
                        Id = reader.GetGuid(reader.GetOrdinal("Id")),
                        PolicyTitle = reader.GetString(reader.GetOrdinal("PolicyTitle")),
                        PolicyDescription = reader["PolicyDescription"] as string,
                        CreatedDate = reader.GetDateTime(reader.GetOrdinal("CreatedDate")),
                        UpdatedDate = reader.GetDateTime(reader.GetOrdinal("UpdatedDate")),
                        IsEnabled = reader.GetBoolean(reader.GetOrdinal("IsEnabled")),
                        IsAcknowledged = reader.GetBoolean(reader.GetOrdinal("IsAcknowledged")),
                        IsPublished = reader.GetBoolean(reader.GetOrdinal("IsPublished")),
                        CreatedBy = reader.GetGuid(reader.GetOrdinal("CreatedBy"))
                    });
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching policies.", ex);
            }

            return policies;
        }

        public async Task<PolicyMasterDto?> GetPolicyByIdAsync(Guid policyId)
        {
            try
            {
                using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                using var command = new SqlCommand("sp_GetPolicyById", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.AddWithValue("@PolicyId", policyId);

                await connection.OpenAsync();
                using var reader = await command.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return new PolicyMasterDto
                    {
                        Id = reader.GetGuid(reader.GetOrdinal("Id")),
                        PolicyTitle = reader.GetString(reader.GetOrdinal("PolicyTitle")),
                        PolicyDescription = reader["PolicyDescription"] as string,
                        CreatedDate = reader.GetDateTime(reader.GetOrdinal("CreatedDate")),
                        UpdatedDate = reader.GetDateTime(reader.GetOrdinal("UpdatedDate")),
                        IsEnabled = reader.GetBoolean(reader.GetOrdinal("IsEnabled")),
                        CreatedBy = reader.GetGuid(reader.GetOrdinal("CreatedBy")),
                        AcknowledgedDate = reader.IsDBNull(reader.GetOrdinal("AcknowledgedDate"))
                                           ? (DateTime?)null
                                           : reader.GetDateTime(reader.GetOrdinal("AcknowledgedDate")),
                        AcknowledgedByName = reader.IsDBNull(reader.GetOrdinal("AcknowledgedByName"))
                                             ? null
                                             : reader.GetString(reader.GetOrdinal("AcknowledgedByName"))
                    };
                }

                return null;
            }
            catch
            {
                throw;
            }
        }



        public async Task<PolicyMaster> UpdatePolicyAsync(Guid policyId, string policyTitle, string description)
        {
            try
            {
                using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                using var command = new SqlCommand("sp_UpdatePolicy", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.AddWithValue("@PolicyId", policyId);
                command.Parameters.AddWithValue("@PolicyTitle", policyTitle);
                command.Parameters.AddWithValue("@Description", (object)description ?? DBNull.Value);

                await connection.OpenAsync();
                var rowsAffected = await command.ExecuteNonQueryAsync();

                if (rowsAffected == 0)
                {
                    throw new Exception("No rows were affected. The update failed.");
                }

                // If update is successful, fetch the updated record
                using var returnCommand = new SqlCommand("SELECT Id, PolicyTitle, PolicyDescription, CreatedDate, UpdatedDate FROM PolicyMasters WHERE Id = @PolicyId", connection);
                returnCommand.Parameters.AddWithValue("@PolicyId", policyId);

                using var reader = await returnCommand.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    var updatedPolicy = new PolicyMaster
                    {
                        Id = reader.GetGuid(reader.GetOrdinal("Id")),
                        PolicyTitle = reader.GetString(reader.GetOrdinal("PolicyTitle")),
                        PolicyDescription = reader.GetString(reader.GetOrdinal("PolicyDescription")),
                        CreatedDate = reader.GetDateTime(reader.GetOrdinal("CreatedDate")),
                        UpdatedDate = reader.GetDateTime(reader.GetOrdinal("UpdatedDate"))
                    };

                    return updatedPolicy; // Return the updated policy object
                }

                return null;
            }
            catch (Exception ex)
            {
                // Handle specific errors, and throw a general exception for others
                throw new Exception("Error updating policy: " + ex.Message);
            }
        }


        public async Task<PolicyMaster> AcknowledgePolicyAsync(Guid policyId, Guid acknowledgedBy)
        {
            try
            {
                using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                using var command = new SqlCommand("sp_AcknowledgePolicy", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.AddWithValue("@PolicyId", policyId);
                command.Parameters.AddWithValue("@AcknowledgedBy", acknowledgedBy);

                await connection.OpenAsync();

                using var reader = await command.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return new PolicyMaster
                    {
                        Id = reader.GetGuid(reader.GetOrdinal("Id")),
                        PolicyTitle = reader.GetString(reader.GetOrdinal("PolicyTitle")),
                        PolicyDescription = reader.IsDBNull(reader.GetOrdinal("PolicyDescription"))
                                            ? null
                                            : reader.GetString(reader.GetOrdinal("PolicyDescription")),
                        CreatedDate = reader.GetDateTime(reader.GetOrdinal("CreatedDate")),
                        UpdatedDate = reader.GetDateTime(reader.GetOrdinal("UpdatedDate")),
                        IsEnabled = reader.GetBoolean(reader.GetOrdinal("IsEnabled")),
                        IsAcknowledged = reader.GetBoolean(reader.GetOrdinal("IsAcknowledged")),
                        CreatedBy = reader.GetGuid(reader.GetOrdinal("CreatedBy")),
                        AcknowledgedDate = reader.IsDBNull(reader.GetOrdinal("AcknowledgedDate"))
                                           ? (DateTime?)null
                                           : reader.GetDateTime(reader.GetOrdinal("AcknowledgedDate")),
                        AcknowledgedBy = reader.IsDBNull(reader.GetOrdinal("AcknowledgedBy"))
                                         ? (Guid?)null
                                         : reader.GetGuid(reader.GetOrdinal("AcknowledgedBy"))
                    };
                }

                throw new Exception("Policy not found or update failed.");
            }
            catch (Exception ex)
            {
                throw new Exception("Error acknowledging policy: " + ex.Message, ex);
            }
        }


        public async Task<List<PolicyMaster>> GetAllPoliciesForUserAsync()
        {
            var policies = new List<PolicyMaster>();

            try
            {
                using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                using var command = new SqlCommand("sp_GetAllPoliciesForUser", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                await connection.OpenAsync();

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    policies.Add(new PolicyMaster
                    {
                        Id = reader.GetGuid(reader.GetOrdinal("Id")),
                        PolicyTitle = reader.GetString(reader.GetOrdinal("PolicyTitle")),
                        PolicyDescription = reader["PolicyDescription"] as string,
                        CreatedDate = reader.GetDateTime(reader.GetOrdinal("CreatedDate")),
                        UpdatedDate = reader.GetDateTime(reader.GetOrdinal("UpdatedDate")),
                        IsEnabled = reader.GetBoolean(reader.GetOrdinal("IsEnabled")),
                        IsAcknowledged = reader.GetBoolean(reader.GetOrdinal("IsAcknowledged")),
                        IsPublished = reader.GetBoolean(reader.GetOrdinal("IsPublished")),
                        CreatedBy = reader.GetGuid(reader.GetOrdinal("CreatedBy"))
                    });
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching policies.", ex);
            }

            return policies;
        }

        public async Task<PolicyMaster> PublishPolicyAsync(Guid policyId, bool publish)
        {
            try
            {
                using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                using var command = new SqlCommand("sp_PublishPolicy", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.AddWithValue("@PolicyId", policyId);
                command.Parameters.AddWithValue("@Publish", publish);

                await connection.OpenAsync();

                using var reader = await command.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new PolicyMaster
                    {
                        Id = reader.GetGuid(reader.GetOrdinal("Id")),
                        PolicyTitle = reader.GetString(reader.GetOrdinal("PolicyTitle")),
                        PolicyDescription = reader.IsDBNull(reader.GetOrdinal("PolicyDescription"))
                                            ? null
                                            : reader.GetString(reader.GetOrdinal("PolicyDescription")),
                        CreatedDate = reader.GetDateTime(reader.GetOrdinal("CreatedDate")),
                        UpdatedDate = reader.GetDateTime(reader.GetOrdinal("UpdatedDate")),
                        IsEnabled = reader.GetBoolean(reader.GetOrdinal("IsEnabled")),
                        IsAcknowledged = reader.GetBoolean(reader.GetOrdinal("IsAcknowledged")),
                        IsPublished = reader.GetBoolean(reader.GetOrdinal("IsPublished")),
                        CreatedBy = reader.GetGuid(reader.GetOrdinal("CreatedBy"))
                    };
                }

                throw new Exception("Policy not found or update failed.");
            }
            catch (Exception ex)
            {
                throw new Exception("Error publishing policy: " + ex.Message);
            }
        }

        public async Task<List<PolicyMaster>> GetPublishedPoliciesForExceptionAsync()
        {
            var policies = new List<PolicyMaster>();

            try
            {
                using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                using var command = new SqlCommand("sp_GetPublishedPoliciesForException", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                await connection.OpenAsync();

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    policies.Add(new PolicyMaster
                    {
                        Id = reader.GetGuid(reader.GetOrdinal("Id")),
                        PolicyTitle = reader.GetString(reader.GetOrdinal("PolicyTitle")),
                        PolicyDescription = reader.IsDBNull(reader.GetOrdinal("PolicyDescription"))
                                            ? null
                                            : reader.GetString(reader.GetOrdinal("PolicyDescription")),
                        CreatedDate = reader.GetDateTime(reader.GetOrdinal("CreatedDate")),
                        UpdatedDate = reader.GetDateTime(reader.GetOrdinal("UpdatedDate")),
                        IsEnabled = reader.GetBoolean(reader.GetOrdinal("IsEnabled")),
                        IsAcknowledged = reader.GetBoolean(reader.GetOrdinal("IsAcknowledged")),
                        IsPublished = reader.GetBoolean(reader.GetOrdinal("IsPublished")),
                        CreatedBy = reader.GetGuid(reader.GetOrdinal("CreatedBy"))
                    });
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching policies for exception: " + ex.Message);
            }

            return policies;
        }


        public async Task<RiskExceptionMaster> SubmitRiskExceptionAsync(
      Guid policyId,
      Guid submittedBy,
      string reason,
      int durationInDays,
      string riskRating)
        {
            try
            {
                using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                using var command = new SqlCommand("sp_InsertRiskException", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.AddWithValue("@PolicyId", policyId);
                command.Parameters.AddWithValue("@SubmittedBy", submittedBy);
                command.Parameters.AddWithValue("@Reason", reason);
                command.Parameters.AddWithValue("@DurationInDays", durationInDays);
                command.Parameters.AddWithValue("@RiskRating", riskRating);

                await connection.OpenAsync();

                using var reader = await command.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return new RiskExceptionMaster
                    {
                        Id = reader.GetGuid(reader.GetOrdinal("Id")),
                        PolicyId = reader.GetGuid(reader.GetOrdinal("PolicyId")),
                        SubmittedBy = reader.GetGuid(reader.GetOrdinal("SubmittedBy")),
                        Reason = reader.GetString(reader.GetOrdinal("Reason")),
                        DurationInDays = reader.GetInt32(reader.GetOrdinal("DurationInDays")),
                        RiskRating = reader.GetString(reader.GetOrdinal("RiskRating")),
                        SubmittedDate = reader.GetDateTime(reader.GetOrdinal("SubmittedDate")),
                        IsApproved = reader.GetInt32(reader.GetOrdinal("IsApproved")),
                        AdminComments = reader.IsDBNull(reader.GetOrdinal("AdminComments")) ? null : reader.GetString(reader.GetOrdinal("AdminComments")),
                        ApprovedBy = reader.IsDBNull(reader.GetOrdinal("ApprovedBy")) ? (Guid?)null : reader.GetGuid(reader.GetOrdinal("ApprovedBy")),
                        ApprovalDate = reader.IsDBNull(reader.GetOrdinal("ApprovalDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("ApprovalDate"))
                    };
                }

                throw new Exception("Risk exception submission failed.");
            }
            catch (Exception ex)
            {
                throw new Exception("Error submitting risk exception: " + ex.Message);
            }
        }

        public async Task<List<RiskExceptionWithPolicy>> GetAllRiskExceptionsAsync()
        {
            try
            {
                var result = new List<RiskExceptionWithPolicy>();

                using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                using var command = new SqlCommand("sp_GetAllRiskExceptionsWithPolicy", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                await connection.OpenAsync();

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    result.Add(new RiskExceptionWithPolicy
                    {
                        RiskExceptionId = reader.GetGuid(reader.GetOrdinal("RiskExceptionId")),
                        PolicyId = reader.GetGuid(reader.GetOrdinal("PolicyId")),
                        PolicyTitle = reader.GetString(reader.GetOrdinal("PolicyTitle")),
                        PolicyDescription = reader["PolicyDescription"] as string,
                        SubmittedBy = reader.GetGuid(reader.GetOrdinal("SubmittedBy")),
                        SubmittedByUserName = reader["SubmittedByUserName"] as string,
                        Reason = reader.GetString(reader.GetOrdinal("Reason")),
                        DurationInDays = reader.GetInt32(reader.GetOrdinal("DurationInDays")),
                        RiskRating = reader.GetString(reader.GetOrdinal("RiskRating")),
                        SubmittedDate = reader.GetDateTime(reader.GetOrdinal("SubmittedDate")),
                        IsApproved = reader.GetInt32(reader.GetOrdinal("IsApproved")),
                        AdminComments = reader.IsDBNull(reader.GetOrdinal("AdminComments")) ? null : reader.GetString(reader.GetOrdinal("AdminComments")),
                        ApprovedBy = reader.IsDBNull(reader.GetOrdinal("ApprovedBy")) ? (Guid?)null : reader.GetGuid(reader.GetOrdinal("ApprovedBy")),
                        ApprovalDate = reader.IsDBNull(reader.GetOrdinal("ApprovalDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("ApprovalDate"))
                    });
                }

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching risk exceptions: " + ex.Message);
            }
        }

        public async Task<RiskExceptionMaster> UpdateRiskExceptionStatusAsync(
    Guid riskExceptionId,
    int isApproved,
    string adminComments,
    Guid approvedBy)
        {
            using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            using var command = new SqlCommand("sp_UpdateRiskExceptionStatus", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@RiskExceptionId", riskExceptionId);
            command.Parameters.AddWithValue("@IsApproved", isApproved);
            command.Parameters.AddWithValue("@AdminComments", adminComments ?? string.Empty);
            command.Parameters.AddWithValue("@ApprovedBy", approvedBy);

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new RiskExceptionMaster
                {
                    Id = reader.GetGuid(reader.GetOrdinal("Id")),
                    PolicyId = reader.GetGuid(reader.GetOrdinal("PolicyId")),
                    SubmittedBy = reader.GetGuid(reader.GetOrdinal("SubmittedBy")),
                    Reason = reader.GetString(reader.GetOrdinal("Reason")),
                    DurationInDays = reader.GetInt32(reader.GetOrdinal("DurationInDays")),
                    RiskRating = reader.GetString(reader.GetOrdinal("RiskRating")),
                    SubmittedDate = reader.GetDateTime(reader.GetOrdinal("SubmittedDate")),
                    IsApproved = reader.GetInt32(reader.GetOrdinal("IsApproved")),
                    AdminComments = reader.IsDBNull(reader.GetOrdinal("AdminComments"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("AdminComments")),
                    ApprovedBy = reader.IsDBNull(reader.GetOrdinal("ApprovedBy"))
                                        ? (Guid?)null
                                        : reader.GetGuid(reader.GetOrdinal("ApprovedBy")),
                    ApprovalDate = reader.IsDBNull(reader.GetOrdinal("ApprovalDate"))
                                        ? (DateTime?)null
                                        : reader.GetDateTime(reader.GetOrdinal("ApprovalDate"))
                };
            }

            throw new Exception("Failed to update risk exception status.");
        }


        public async Task<List<PolicyWithExceptionDto>> GetPoliciesWithExceptionsAndAcknowledgementsAsync()
        {
            try
            {
                var result = new List<PolicyWithExceptionDto>();

                using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
                using var command = new SqlCommand("sp_GetPoliciesWithExceptionsAndAcknowledgements", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                await connection.OpenAsync();

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    result.Add(new PolicyWithExceptionDto
                    {
                        PolicyTitle = reader.IsDBNull(reader.GetOrdinal("PolicyTitle")) ? string.Empty : reader.GetString(reader.GetOrdinal("PolicyTitle")),
                        PolicyDescription = reader.IsDBNull(reader.GetOrdinal("PolicyDescription")) ? string.Empty : reader.GetString(reader.GetOrdinal("PolicyDescription")),
                        IsPublishedStatus = reader.IsDBNull(reader.GetOrdinal("IsPublishedStatus")) ? string.Empty : reader.GetString(reader.GetOrdinal("IsPublishedStatus")),
                        IsAcknowledgedStatus = reader.IsDBNull(reader.GetOrdinal("IsAcknowledgedStatus")) ? string.Empty : reader.GetString(reader.GetOrdinal("IsAcknowledgedStatus")),
                        AcknowledgedBy = reader.IsDBNull(reader.GetOrdinal("AcknowledgedBy")) ? "Unknown" : reader.GetString(reader.GetOrdinal("AcknowledgedBy")),
                        AcknowledgedDate = reader.IsDBNull(reader.GetOrdinal("AcknowledgedDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("AcknowledgedDate")),
                        Reason = reader.IsDBNull(reader.GetOrdinal("Reason")) ? string.Empty : reader.GetString(reader.GetOrdinal("Reason")),
                        DurationInDays = reader.IsDBNull(reader.GetOrdinal("DurationInDays")) ? 0 : reader.GetInt32(reader.GetOrdinal("DurationInDays")),
                        RiskRating = reader.IsDBNull(reader.GetOrdinal("RiskRating")) ? string.Empty : reader.GetString(reader.GetOrdinal("RiskRating")),
                        ExceptionSubmissionDate = reader.IsDBNull(reader.GetOrdinal("ExceptionSubmissionDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("ExceptionSubmissionDate")),
                        ExceptionApprovalStatus = reader.IsDBNull(reader.GetOrdinal("ExceptionApprovalStatus")) ? string.Empty : reader.GetString(reader.GetOrdinal("ExceptionApprovalStatus")),
                        ExceptionApprovedBy = reader.IsDBNull(reader.GetOrdinal("ExceptionApprovedBy")) ? "Unknown" : reader.GetString(reader.GetOrdinal("ExceptionApprovedBy")),
                        ApprovalDate = reader.IsDBNull(reader.GetOrdinal("ApprovalDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("ApprovalDate")),
                        AdminComments = reader.IsDBNull(reader.GetOrdinal("AdminComments")) ? "N/A" : reader.GetString(reader.GetOrdinal("AdminComments"))
                    });
                }

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching policies with exceptions and acknowledgements: " + ex.Message);
            }
        }




    }

    public class PolicyMasterDto
    {
        public Guid Id { get; set; }
        public string PolicyTitle { get; set; }
        public string? PolicyDescription { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool IsEnabled { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime? AcknowledgedDate { get; set; }

        // This is not a DB column, only for response
        public string? AcknowledgedByName { get; set; }
    }

    public class RiskExceptionWithPolicy
    {
        public Guid RiskExceptionId { get; set; }
        public Guid PolicyId { get; set; }
        public string PolicyTitle { get; set; }
        public string PolicyDescription { get; set; }
        public Guid SubmittedBy { get; set; }
        public string SubmittedByUserName { get; set; }
        public string Reason { get; set; }
        public int DurationInDays { get; set; }
        public string RiskRating { get; set; }
        public DateTime SubmittedDate { get; set; }
        public int IsApproved { get; set; }
        public string AdminComments { get; set; }
        public Guid? ApprovedBy { get; set; }
        public DateTime? ApprovalDate { get; set; }
    }

    public class DashboardStatsDto
    {
        public int TotalPublished { get; set; }
        public int TotalAcknowledged { get; set; }
        public int TotalExceptions { get; set; }
        public int ApprovedExceptions { get; set; }
    }
    public class PolicyWithExceptionDto
    {
        public string PolicyTitle { get; set; }
        public string PolicyDescription { get; set; }
        public string IsPublishedStatus { get; set; }
        public string IsAcknowledgedStatus { get; set; }
        public string AcknowledgedBy { get; set; }
        public DateTime? AcknowledgedDate { get; set; }
        public string Reason { get; set; }
        public int DurationInDays { get; set; }
        public string RiskRating { get; set; }
        public DateTime? ExceptionSubmissionDate { get; set; }
        public string ExceptionApprovalStatus { get; set; }
        public string ExceptionApprovedBy { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public string AdminComments { get; set; }
    }

}
