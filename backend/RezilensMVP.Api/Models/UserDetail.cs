using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RezilensMVP.Api.Models
{
    public class UserDetail
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string LoginId { get; set; }  // FK -> AspNetUsers

        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Mobile { get; set; }

        public string? CreatedBy { get; set; } // FK -> AspNetUsers
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime UpdateDate { get; set; } = DateTime.Now;
        public int IsEnabled { get; set; } = 1;

        [ForeignKey("LoginId")]
        public ApplicationUser LoginUser { get; set; }  // required

        [ForeignKey("CreatedBy")]
        public ApplicationUser? CreatedByUser { get; set; }  // nullable
    }
}
