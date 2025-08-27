using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RezilensMVP.Api.Data;
using RezilensMVP.Api.Models;

namespace RezilensMVP.Api.Infrastructure
{
    public class Seed
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var services = scope.ServiceProvider;

            var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();
            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            var context = services.GetRequiredService<ApplicationDbContext>();

            // 1️⃣ Seed Roles
            string[] roles = { "Admin", "User" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new ApplicationRole { Name = role, NormalizedName = role.ToUpper() });
                }
            }

            // 2️⃣ Seed Users
            var adminUser = await userManager.FindByEmailAsync("admin@gmail.com");
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = "sam",
                    NormalizedUserName = "SAM",
                    Email = "admin@gmail.com",
                    NormalizedEmail = "ADMIN@GMAIL.COM",
                    EmailConfirmed = true,
                    UserProfileImage = "assets/media/avatars/sam.png",
                    LockoutEnabled = false
                };
                await userManager.CreateAsync(adminUser, "Admin@123");
                adminUser.LockoutEnabled = false; // 👈 Set again
                await userManager.UpdateAsync(adminUser);
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }

            var normalUser = await userManager.FindByEmailAsync("nawal.muhammad1@gmail.com");
            if (normalUser == null)
            {
                normalUser = new ApplicationUser
                {
                    UserName = "nawal",
                    NormalizedUserName = "NAWAL",
                    Email = "nawal.muhammad1@gmail.com",
                    NormalizedEmail = "NAWAL.MUHAMMAD1@GMAIL.COM",
                    EmailConfirmed = true,
                    UserProfileImage = "assets/media/avatars/nawal.jpeg",
                    LockoutEnabled = false
                };
                await userManager.CreateAsync(normalUser, "User@123");
                normalUser.LockoutEnabled = false;
                await userManager.UpdateAsync(normalUser);
                await userManager.AddToRoleAsync(normalUser, "User");
            }

            // 3️⃣ Seed UserDetails
            if (!await context.UserDetails.AnyAsync())
            {
                var userDetails = new List<UserDetail>
                {
                    new UserDetail
                    {
                        Id = Guid.NewGuid(),
                        LoginId = adminUser.Id,
                        FirstName = "Sam",
                        MiddleName = "",
                        LastName = "Mokhtari",
                        Email = "admin@gmail.com",
                        Mobile = "0528421455",
                        CreatedBy = null,
                        CreatedDate = DateTime.Now,
                        UpdateDate = DateTime.Now,
                        IsEnabled = 1
                    },
                    new UserDetail
                    {
                        Id = Guid.NewGuid(),
                        LoginId = normalUser.Id,
                        FirstName = "Nawal",
                        MiddleName = "",
                        LastName = "Khan",
                        Email = "nawal.muhammad1@gmail.com",
                        Mobile = "123456778",
                        CreatedBy = null,
                        CreatedDate = DateTime.Now,
                        UpdateDate = DateTime.Now,
                        IsEnabled = 1
                    }
                };

                context.UserDetails.AddRange(userDetails);
                await context.SaveChangesAsync();
            }
        }
    }
}

