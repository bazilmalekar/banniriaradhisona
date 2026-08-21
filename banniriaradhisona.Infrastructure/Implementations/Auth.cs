using banniriaradhisona.Core.Models;
using banniriaradhisona.Core.ViewModels;
using banniriaradhisona.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace banniriaradhisona.Infrastructure.Implementations
{
    public class Auth : IAuth
    {
        private readonly SignInManager<Users> _signInManager;

        public Auth(SignInManager<Users> signInManager)
        {
            _signInManager = signInManager;
        }

        public async Task<SignInResult> LoginAsync(LoginVM model)
        {
            return await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);
        }

        public async Task LogoutAsync()
        {
            await _signInManager.SignOutAsync();
        }
    }
}
