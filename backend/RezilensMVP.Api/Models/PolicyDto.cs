using System.ComponentModel.DataAnnotations;

namespace RezilensMVP.Api.Models
{
    public class PolicyDto
    {
        [Required]
        [MaxLength(200)]
        public string PolicyTitle { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        [Required]
        public Guid CreatedBy { get; set; }
    }

}
