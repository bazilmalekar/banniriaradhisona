using banniriaradhisona.Core.Models;
using banniriaradhisona.Core.Settings;
using banniriaradhisona.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis.Options;
using Microsoft.Extensions.Options;

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
            var seedUserSettings = scope.ServiceProvider.GetRequiredService<IOptions<SeedUserSettings>>().Value;

            try
            {

                //Ensure the database is ready.
                logger.LogInformation("Ensuring the database is created");
                await context.Database.EnsureCreatedAsync();

                //Add Roles
                logger.LogInformation("Seeding roles");
                await AddRoleAsync(roleManager, "Owner");
                await AddRoleAsync(roleManager, "Admin");

                // Get Owner details from User Secrets
                var ownerEmail = seedUserSettings.OwnerEmail;
                var ownerPassword = seedUserSettings.OwnerPassword;
                var ownerName = seedUserSettings.OwnerName;

                //Add Super Admin User
                var OwnerEmail = ownerEmail;
                if (await userManager.FindByEmailAsync(OwnerEmail) == null)
                {
                    var Owner = new Users
                    {
                        Name = ownerName,
                        UserName = OwnerEmail,
                        NormalizedUserName = OwnerEmail.ToUpper(),
                        Email = OwnerEmail,
                        NormalizedEmail = OwnerEmail.ToUpper(),
                        EmailConfirmed = true,
                        SecurityStamp = Guid.NewGuid().ToString()
                    };

                    var result = await userManager.CreateAsync(Owner, ownerPassword);
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
