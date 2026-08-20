using banniriaradhisona.Core.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace banniriaradhisona.Infrastructure.Interfaces
{
    public interface IAdminRepository
    {
        Task<IEnumerable<UserWithRoleVM>> GetUsersAsync();
    }
}
