using banniriaradhisona.Core.Models;
using banniriaradhisona.Core.ViewModels;
using banniriaradhisona.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Security.Cryptography;

namespace banniriaradhisona.Infrastructure.Implementations
{
    public class Auth : IAuth
    {
        private readonly SignInManager<Users> _signInManager;
        private readonly UserManager<Users> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEmailService _emailService;

        public Auth(SignInManager<Users> signInManager, UserManager<Users> userManager, IHttpContextAccessor httpContextAccessor, IEmailService emailService)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
            _emailService = emailService;
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
                    httpContext.Session.SetString("MfaRememberMe", model.RememberMe.ToString());
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
            httpContext.Session.SetString("MfaSetupUserId", user.Id);
            httpContext.Session.SetString("MfaRememberMe", model.RememberMe.ToString());
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
            var authenticatorUri = GenerateAuthenticatorUri(email, key);
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
            var isValid = await _userManager.VerifyTwoFactorTokenAsync(user, TokenOptions.DefaultAuthenticatorProvider, code);
            if (!isValid)
            {
                return false;
            }
            var enableResult = await _userManager.SetTwoFactorEnabledAsync(user, true);
            if (!enableResult.Succeeded)
            {
                return false;
            }
            var rememberMeValue = httpContext.Session.GetString("MfaRememberMe");
            var rememberMe = bool.TryParse(rememberMeValue, out var parsedRememberMe) && parsedRememberMe;
            // MFA setup is complete, so create the normal authentication cookie.
            await _signInManager.SignInAsync(user, isPersistent: rememberMe);
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
            var rememberMeValue = _httpContextAccessor.HttpContext?.Session.GetString("MfaRememberMe");
            var rememberMe = bool.TryParse(rememberMeValue, out var parsedRememberMe) && parsedRememberMe;
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
            _httpContextAccessor.HttpContext?.Session.Remove("MfaRememberMe");
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

        public async Task<bool> StartAuthenticatorResetAsync()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                return false;
            }
            // The user has entered a valid password and is currently
            // in the pending two-factor authentication state.
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                return false;
            }
            var email = await _userManager.GetEmailAsync(user);
            if (string.IsNullOrEmpty(email))
            {
                return false;
            }
            // Generate a 6-digit email verification code.
            var otp = RandomNumberGenerator.GetInt32(100000, 1000000);
            // Store the OTP temporarily in Session.
            httpContext.Session.SetString("AuthenticatorResetOtp", otp.ToString());
            // OTP expires after 10 minutes.
            httpContext.Session.SetString("AuthenticatorResetOtpExpiry", DateTime.UtcNow.AddMinutes(10).ToString("O"));
            // Reset the verification state.
            httpContext.Session.Remove("AuthenticatorResetVerified");
            var subject = "Authenticator Reset Verification";
            var htmlBody = $"""
                    <p>Hello,</p>
                    <p>We received a request to reset the authenticator associated with your Aradhisuva account.</p>
                    <p>Your verification code is:</p>
                    <h2>{otp}</h2>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you did not request this reset, you can safely ignore this email.</p>
                    <p>
                        Regards,<br />
                        Aradhisuva.com
                    </p>
                    """;
            await _emailService.SendEmailAsync(email, subject, htmlBody);
            return true;
        }

        public async Task<bool> VerifyAuthenticatorResetOtpAsync(string code)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                return false;
            }
            var storedOtp = httpContext.Session.GetString("AuthenticatorResetOtp");
            var expiryValue = httpContext.Session.GetString("AuthenticatorResetOtpExpiry");
            if (string.IsNullOrEmpty(storedOtp) || string.IsNullOrEmpty(expiryValue))
            {
                return false;
            }
            if (!DateTime.TryParse(expiryValue, out var expiry))
            {
                return false;
            }
            if (DateTime.UtcNow > expiry)
            {
                httpContext.Session.Remove("AuthenticatorResetOtp");
                httpContext.Session.Remove("AuthenticatorResetOtpExpiry");
                return false;
            }
            code = code?.Trim() ?? string.Empty;
            if (code != storedOtp)
            {
                return false;
            }
            // Email OTP has been successfully verified.
            httpContext.Session.SetString("AuthenticatorResetVerified", "true");
            // OTP is single-use.
            httpContext.Session.Remove("AuthenticatorResetOtp");
            httpContext.Session.Remove("AuthenticatorResetOtpExpiry");
            return true;
        }

        public async Task<AuthenticatorSetupVM?> GetAuthenticatorResetSetupAsync()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                return null;
            }
            // Email OTP must have been successfully verified first.
            var resetVerified = httpContext.Session.GetString("AuthenticatorResetVerified");
            if (resetVerified != "true")
            {
                return null;
            }
            // Get the user who is currently in the pending 2FA state.
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                return null;
            }
            var email = await _userManager.GetEmailAsync(user);
            if (string.IsNullOrEmpty(email))
            {
                return null;
            }
            // Check whether a new authenticator key has already
            // been generated for this reset attempt.
            var resetKey = httpContext.Session.GetString("AuthenticatorResetKey");
            if (string.IsNullOrEmpty(resetKey))
            {
                var resetResult = await _userManager.ResetAuthenticatorKeyAsync(user);
                if (!resetResult.Succeeded)
                {
                    return null;
                }
                resetKey = await _userManager.GetAuthenticatorKeyAsync(user);
                if (string.IsNullOrEmpty(resetKey))
                {
                    return null;
                }
                // Keep the generated key in this reset session so
                // refreshing the page does not generate another key.
                httpContext.Session.SetString("AuthenticatorResetKey", resetKey);
            }
            var authenticatorUri = GenerateAuthenticatorUri(email, resetKey);
            return new AuthenticatorSetupVM
            {
                SharedKey = resetKey,
                AuthenticatorUri = authenticatorUri
            };
        }

        public async Task<bool> VerifyAuthenticatorResetCodeAsync(string code)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                return false;
            }
            // Email OTP must have been successfully verified first.
            var resetVerified = httpContext.Session.GetString("AuthenticatorResetVerified");
            if (resetVerified != "true")
            {
                return false;
            }
            // Get the user who is currently in the pending 2FA state.
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                return false;
            }
            code = code?.Trim() ?? string.Empty;
            if (code.Length != 6 || !code.All(char.IsDigit))
            {
                return false;
            }
            // Verify the OTP against the newly generated
            // authenticator key.
            var isValid = await _userManager.VerifyTwoFactorTokenAsync(user, TokenOptions.DefaultAuthenticatorProvider, code);
            if (!isValid)
            {
                return false;
            }
            // The new authenticator has been successfully verified.
            // Complete the pending Identity two-factor sign-in.
            var rememberMeValue = httpContext.Session.GetString("MfaRememberMe");
            var rememberMe = bool.TryParse(rememberMeValue, out var parsedRememberMe) && parsedRememberMe;
            var signInResult = await _signInManager.TwoFactorAuthenticatorSignInAsync(code, rememberMe, rememberClient: false);
            if (!signInResult.Succeeded)
            {
                return false;
            }
            // Send a security notification after the authenticator
            // reset has been successfully completed.
            var email = await _userManager.GetEmailAsync(user);
            if (!string.IsNullOrEmpty(email))
            {
                var subject = "Authenticator Reset Successful";
                var htmlBody = """
                        <p>Hello,</p>
                        <p>Your Aradhisuva authenticator has been successfully reset.</p>
                        <p>Your previous authenticator is no longer valid.</p>
                        <p>If you did not perform this action, please secure your account immediately.</p>
                        <p>
                            Regards,<br />
                            Aradhisuva.com
                        </p>
                        """;
                await _emailService.SendEmailAsync(email, subject, htmlBody);
            }
            // once reset flow is complete.
            httpContext.Session.Remove("AuthenticatorResetOtp");
            httpContext.Session.Remove("AuthenticatorResetOtpExpiry");
            httpContext.Session.Remove("AuthenticatorResetVerified");
            httpContext.Session.Remove("AuthenticatorResetKey");
            httpContext.Session.Remove("MfaRememberMe");
            return true;
        }
    }
}
