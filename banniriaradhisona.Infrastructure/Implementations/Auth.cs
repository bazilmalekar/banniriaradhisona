using banniriaradhisona.Core.Models;
using banniriaradhisona.Core.ViewModels;
using banniriaradhisona.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace banniriaradhisona.Infrastructure.Implementations
{
    public class Auth : IAuth
    {
        private readonly SignInManager<Users> _signInManager;
        private readonly UserManager<Users> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public Auth(SignInManager<Users> signInManager, UserManager<Users> userManager, IHttpContextAccessor httpContextAccessor)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<LoginResultVM> LoginAsync(LoginVM model)
        {
            var httpContext = _httpContextAccessor.HttpContext;

            if (httpContext == null)
            {
                return new LoginResultVM();
            }

            // Clear any previous MFA setup state from this browser session.
            httpContext.Session.Remove("MfaSetupUserId");
            httpContext.Session.Remove("MfaRememberMe");

            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null)
            {
                return new LoginResultVM();
            }

            // Validate the password without signing the user in.
            var passwordResult = await _signInManager.CheckPasswordSignInAsync(
                user,
                model.Password,
                lockoutOnFailure: false);

            if (!passwordResult.Succeeded)
            {
                return new LoginResultVM();
            }

            // MFA is already configured.
            if (user.TwoFactorEnabled)
            {
                // Let Identity establish the pending two-factor sign-in state.
                var signInResult = await _signInManager.PasswordSignInAsync(
                    user,
                    model.Password,
                    model.RememberMe,
                    lockoutOnFailure: false);

                if (signInResult.RequiresTwoFactor)
                {
                    httpContext.Session.SetString(
                        "MfaRememberMe",
                        model.RememberMe.ToString());

                    return new LoginResultVM
                    {
                        RequiresTwoFactor = true
                    };
                }

                if (signInResult.Succeeded)
                {
                    return new LoginResultVM
                    {
                        Succeeded = true
                    };
                }

                return new LoginResultVM();
            }

            // Password is valid, but MFA has not been configured.
            // Store the user information in Session without signing the user in.
            httpContext.Session.SetString(
                "MfaSetupUserId",
                user.Id);

            httpContext.Session.SetString(
                "MfaRememberMe",
                model.RememberMe.ToString());

            return new LoginResultVM
            {
                RequiresAuthenticatorSetup = true
            };
        }

        public async Task<AuthenticatorSetupVM?> GetAuthenticatorSetupAsync()
        {
            var httpContext = _httpContextAccessor.HttpContext;

            if (httpContext == null)
            {
                return null;
            }

            var userId = httpContext.Session.GetString("MfaSetupUserId");

            if (string.IsNullOrEmpty(userId))
            {
                return null;
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return null;
            }

            // MFA is already enabled.
            // This user should not enter the MFA setup flow.
            if (user.TwoFactorEnabled)
            {
                return null;
            }

            var key = await _userManager.GetAuthenticatorKeyAsync(user);

            if (string.IsNullOrEmpty(key))
            {
                await _userManager.ResetAuthenticatorKeyAsync(user);

                key = await _userManager.GetAuthenticatorKeyAsync(user);
            }

            if (string.IsNullOrEmpty(key))
            {
                return null;
            }

            var email = await _userManager.GetEmailAsync(user);

            if (string.IsNullOrEmpty(email))
            {
                return null;
            }

            var authenticatorUri = GenerateAuthenticatorUri(
                email,
                key);

            return new AuthenticatorSetupVM
            {
                SharedKey = key,
                AuthenticatorUri = authenticatorUri
            };
        }

        public async Task<bool> VerifyAuthenticatorCodeAsync(string code)
        {
            var httpContext = _httpContextAccessor.HttpContext;

            if (httpContext == null)
            {
                return false;
            }

            var userId = httpContext.Session.GetString("MfaSetupUserId");

            if (string.IsNullOrEmpty(userId))
            {
                return false;
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return false;
            }

            // MFA should not already be enabled during initial setup.
            if (user.TwoFactorEnabled)
            {
                return false;
            }

            var isValid = await _userManager.VerifyTwoFactorTokenAsync(
                user,
                TokenOptions.DefaultAuthenticatorProvider,
                code);

            if (!isValid)
            {
                return false;
            }

            var enableResult = await _userManager.SetTwoFactorEnabledAsync(
                user,
                true);

            if (!enableResult.Succeeded)
            {
                return false;
            }

            var rememberMeValue = httpContext.Session.GetString("MfaRememberMe");

            var rememberMe = bool.TryParse(
                rememberMeValue,
                out var parsedRememberMe) && parsedRememberMe;

            // MFA setup is complete, so create the normal authentication cookie.
            await _signInManager.SignInAsync(
                user,
                isPersistent: rememberMe);

            // Remove temporary MFA setup state.
            httpContext.Session.Remove("MfaSetupUserId");
            httpContext.Session.Remove("MfaRememberMe");

            return true;
        }

        public async Task<VerifyTwoFactorVM?> GetTwoFactorUserAsync()
        {
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();

            if (user == null)
            {
                return null;
            }

            var rememberMeValue = _httpContextAccessor.HttpContext?
                .Session.GetString("MfaRememberMe");

            var rememberMe = bool.TryParse(
                rememberMeValue,
                out var parsedRememberMe) && parsedRememberMe;

            return new VerifyTwoFactorVM
            {
                RememberMe = rememberMe
            };
        }

        public async Task<bool> VerifyTwoFactorAsync(VerifyTwoFactorVM model)
        {
            var result = await _signInManager.TwoFactorAuthenticatorSignInAsync(
                model.Code,
                model.RememberMe,
                model.RememberClient);

            if (!result.Succeeded)
            {
                return false;
            }

            _httpContextAccessor.HttpContext?
                .Session.Remove("MfaRememberMe");

            return true;
        }

        public async Task LogoutAsync()
        {
            await _signInManager.SignOutAsync();
        }

        private string GenerateAuthenticatorUri(string email, string key)
        {
            var issuer = "Aradhisuva";

            return $"otpauth://totp/{Uri.EscapeDataString(issuer)}:{Uri.EscapeDataString(email)}" +
                   $"?secret={Uri.EscapeDataString(key)}" +
                   $"&issuer={Uri.EscapeDataString(issuer)}";
        }
    }
}
