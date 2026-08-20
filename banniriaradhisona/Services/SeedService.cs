using banniriaradhisona.Data;
using Microsoft.AspNetCore.Identity;
using banniriaradhisona.Core.Models;

namespace banniriaradhisona.Services
{
    public class SeedService
    {
        public static async Task SeedDatabase(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<Users>>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<SeedService>>();

            try
            {
                //Ensure the database is ready.
                logger.LogInformation("Ensuring the database is created");
                await context.Database.EnsureCreatedAsync();

                //Add Roles
                logger.LogInformation("Seeding roles");
                await AddRoleAsync(roleManager, "Owner");
                await AddRoleAsync(roleManager, "Admin");

                //Add Super Admin User
                var OwnerEmail = "testUser@gmail.com";
                if (await userManager.FindByEmailAsync(OwnerEmail) == null)
                {
                    var Owner = new Users
                    {
                        Name = "Test Owner",
                        UserName = OwnerEmail,
                        NormalizedUserName = OwnerEmail.ToUpper(),
                        Email = OwnerEmail,
                        NormalizedEmail = OwnerEmail.ToUpper(),
                        EmailConfirmed = true,
                        SecurityStamp = Guid.NewGuid().ToString()
                    };

                    var result = await userManager.CreateAsync(Owner, "Owner@54321_dd");
                    if (result.Succeeded)
                    {
                        logger.LogInformation("Assigning role to admin");
                        await userManager.AddToRoleAsync(Owner, "Owner");
                    }
                    else
                    {
                        logger.LogInformation("Failed to create Admin user {Error}", string.Join(", ", result.Errors.Select(e => e.Description)));
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occured while seeding database");
            }
        }

        private static async Task AddRoleAsync(RoleManager<IdentityRole> roleManager, string roleName)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                var result = await roleManager.CreateAsync(new IdentityRole(roleName));
                if (!result.Succeeded)
                {
                    throw new Exception($"Failed to create role '{roleName}': {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }
        }
    }
}
