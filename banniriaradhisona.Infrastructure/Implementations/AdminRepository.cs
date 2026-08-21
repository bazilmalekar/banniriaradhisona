using banniriaradhisona.Core.Models;
using banniriaradhisona.Core.ViewModels;
using banniriaradhisona.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace banniriaradhisona.Infrastructure.Implementations
{
    public class AdminRepository : IAdminRepository
    {
        private readonly SignInManager<Users> _signInManager;
        private readonly UserManager<Users> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AdminRepository(SignInManager<Users> signInManager, UserManager<Users> userManager, RoleManager<IdentityRole> roleManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<IEnumerable<UserWithRoleVM>> GetUsersAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            var result = new List<UserWithRoleVM>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                if (roles.Contains("Owner") || roles.Contains("Admin"))
                {
                    result.Add(new UserWithRoleVM
                    {
                        Id = user.Id,
                        Name = user.Name,
                        UserName = user.UserName,
                        Roles = roles.ToList()
                    });
                }
            }
            return result;
        }

        public async Task<IdentityResult> CreateUserAsync(RegisterVM model)
        {
            var user = new Users
            {
                Name = model.Name,
                UserName = model.Email,
                NormalizedUserName = model.Email.ToUpper(),
                Email = model.Email,
                NormalizedEmail = model.Email.ToUpper()
            };
            var result = await _userManager.CreateAsync(user, model.Password!);
            if (!result.Succeeded)
            {
                return result;
            }
            var roleName = model.Role.ToString();
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                await _userManager.DeleteAsync(user);
                return IdentityResult.Failed(
                    new IdentityError
                    {
                        Description = $"Role '{roleName}' does not exist."
                    });
            }
            var roleResult = await _userManager.AddToRoleAsync(user, roleName);
            if (!roleResult.Succeeded)
            {
                await _userManager.DeleteAsync(user);
                return roleResult;
            }
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> EditUserAsync(RegisterVM model)
        {
            var user = await _userManager.FindByIdAsync(model.Id!);
            if (user == null)
            {
                return IdentityResult.Failed(
                    new IdentityError
                    {
                        Description = "User details could not be found."
                    });
            }
            user.Name = model.Name;
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return updateResult;
            }
            var newRole = model.Role.ToString();
            if (!await _roleManager.RoleExistsAsync(newRole))
            {
                return IdentityResult.Failed(
                    new IdentityError
                    {
                        Description = $"Role '{newRole}' does not exist."
                    });
            }
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (!currentRoles.Contains(newRole))
            {
                if (currentRoles.Any())
                {
                    var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                    if (!removeResult.Succeeded)
                    {
                        return removeResult;
                    }
                }
                var addResult = await _userManager.AddToRoleAsync(user, newRole);
                if (!addResult.Succeeded)
                {
                    return addResult;
                }
            }
            return IdentityResult.Success;
        }

        public async Task<RegisterVM?> GetUserByIdAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return null;
            }
            var roles = await _userManager.GetRolesAsync(user);
            return new RegisterVM
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email ?? string.Empty,
                Role = Enum.Parse<UserRoles>(roles.First())
            };
        }
    }
}
