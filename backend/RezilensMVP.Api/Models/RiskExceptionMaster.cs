using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RezilensMVP.Api.Models
{
    public class RiskExceptionMaster
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [ForeignKey("PolicyMaster")]
        public Guid PolicyId { get; set; }

        public virtual PolicyMaster Policy { get; set; }  // Navigation property

        [Required]
        [ForeignKey("AspNetUsers")]
        public Guid SubmittedBy { get; set; }

        public virtual ApplicationUser User { get; set; }  // Navigation property

        [Required]
        [MaxLength(500)]
        public string Reason { get; set; }

        [Required]
        public int DurationInDays { get; set; }  // Duration of exception

        [Required]
        [MaxLength(50)]
        public string RiskRating { get; set; }  // Low, Medium, High

        [Required]
        public DateTime SubmittedDate { get; set; } = DateTime.Now;

        [Required]
        public int IsApproved { get; set; } = 0; // 0 = pending, 1 = approved, 2 = rejected

        // Admin approval/denial
        [MaxLength(1000)]
        public string? AdminComments { get; set; }  // Optional comments by admin

        public Guid? ApprovedBy { get; set; }  // Admin user who approved/denied
        public DateTime? ApprovalDate { get; set; }  // Date of approval/denial
    }
}
