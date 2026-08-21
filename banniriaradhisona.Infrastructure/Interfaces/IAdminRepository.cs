using banniriaradhisona.Core.Models;
using banniriaradhisona.Core.ViewModels;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace banniriaradhisona.Infrastructure.Interfaces
{
    public interface IAdminRepository
    {
        Task<IEnumerable<UserWithRoleVM>> GetUsersAsync();

        Task<IdentityResult> CreateUserAsync(RegisterVM model);

        Task<IdentityResult> EditUserAsync(RegisterVM model);

        Task<RegisterVM?> GetUserByIdAsync(string id);
    }
}
