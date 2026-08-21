using banniriaradhisona.Core.ViewModels;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace banniriaradhisona.Infrastructure.Interfaces
{
    public interface IAuth
    {
        Task<SignInResult> LoginAsync(LoginVM model);

        Task LogoutAsync();
    }
}
