using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RezilensMVP.Api.Models
{
    public class PolicyMaster
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string PolicyTitle { get; set; }

        public string PolicyDescription { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Required]
        public DateTime UpdatedDate { get; set; } = DateTime.Now;

        [Required]
        public bool IsEnabled { get; set; } = true;

        [Required]
        [ForeignKey("AspNetUsers")]
        public Guid CreatedBy { get; set; }
        // 🔹 New Column

        public bool IsAcknowledged { get; set; } = false;
        // ✅ New field
        public bool IsPublished { get; set; } = false;
        public virtual ApplicationUser User { get; set; }  // Navigation property
                                                           // New fields
        public DateTime? AcknowledgedDate { get; set; }
        public Guid? AcknowledgedBy { get; set; }
    }
}
