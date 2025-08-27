namespace RezilensMVP.Api.Models
{
    public class UpdatePolicyRequest
    {
        public Guid PolicyId { get; set; }
        public string PolicyTitle { get; set; }
        public string Description { get; set; }
    }
}
