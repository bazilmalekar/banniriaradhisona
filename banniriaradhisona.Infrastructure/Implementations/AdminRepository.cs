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
    }
}
