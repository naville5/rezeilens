using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RezilensMVP.Api.Models;

namespace RezilensMVP.Api.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<UserDetail> UserDetails { get; set; }
        public DbSet<PolicyMaster> PolicyMasters { get; set; }
        public DbSet<RiskExceptionMaster> RiskExceptions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationRole>()
                   .Property(r => r.IsEnabled)
                   .HasDefaultValue(true);

            builder.Entity<UserDetail>()
                   .Property(u => u.CreatedDate)
                   .HasDefaultValueSql("getdate()");
            builder.Entity<UserDetail>()
                   .Property(u => u.UpdateDate)
                   .HasDefaultValueSql("getdate()");
            builder.Entity<UserDetail>()
                   .Property(u => u.IsEnabled)
                   .HasDefaultValue(1);

            builder.Entity<UserDetail>()
                   .HasOne(u => u.LoginUser)
                   .WithMany()
                   .HasForeignKey(u => u.LoginId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<UserDetail>()
                   .HasOne(u => u.CreatedByUser)
                   .WithMany()
                   .HasForeignKey(u => u.CreatedBy)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
