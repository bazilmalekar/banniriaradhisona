using banniriaradhisona.Core.ViewModels;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace banniriaradhisona.Infrastructure.Interfaces
{
    public interface IAuth
    {
        Task<LoginResultVM> LoginAsync(LoginVM model);

        Task<AuthenticatorSetupVM?> GetAuthenticatorSetupAsync();

        Task<bool> VerifyAuthenticatorCodeAsync(string code);

        Task<VerifyTwoFactorVM?> GetTwoFactorUserAsync();

        Task<bool> VerifyTwoFactorAsync(VerifyTwoFactorVM model);

        Task LogoutAsync();
    }
}
