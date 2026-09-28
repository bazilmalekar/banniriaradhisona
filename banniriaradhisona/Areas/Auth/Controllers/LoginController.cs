using banniriaradhisona.Core.ViewModels;
using banniriaradhisona.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace banniriaradhisona.Areas.Auth.Controllers
{
    [Area("Auth")]
    [AllowAnonymous]
    public class LoginController : Controller
    {
        private readonly IAuth _auth;

        public LoginController(IAuth auth)
        {
            _auth = auth;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginVM model, string? returnUrl)
        {
            if (!ModelState.IsValid)
            {
                return View("Index", model);
            }
            var result = await _auth.LoginAsync(model);
            if (result.RequiresAuthenticatorSetup)
            {
                return RedirectToAction(nameof(SetupAuthenticator));
            }
            if (result.RequiresTwoFactor)
            {
                return RedirectToAction(nameof(VerifyTwoFactor));
            }
            if (result.Succeeded)
            {
                if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                {
                    return Redirect(returnUrl);
                }
                return RedirectToAction("Index", "Home", new { area = "Admin" });
            }
            TempData["errorMessage"] = "Invalid email or password.";
            return View("Index", model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _auth.LogoutAsync();
            return RedirectToAction("Index", "Home", new { area = "" });
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> SetupAuthenticator()
        {
            var model = await _auth.GetAuthenticatorSetupAsync();
            if (model == null)
            {
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public async Task<IActionResult> SetupAuthenticator(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                ModelState.AddModelError("code", "Please enter the verification code.");
                var model = await _auth.GetAuthenticatorSetupAsync();
                if (model == null)
                {
                    return RedirectToAction(nameof(Index));
                }
                return View(model);
            }
            code = code.Trim();
            if (code.Length != 6 || !code.All(char.IsDigit))
            {
                ModelState.AddModelError("code", "Please enter a valid 6-digit verification code.");
                var model = await _auth.GetAuthenticatorSetupAsync();
                if (model == null)
                {
                    return RedirectToAction(nameof(Index));
                }
                return View(model);
            }
            var verified = await _auth.VerifyAuthenticatorCodeAsync(code);
            if (!verified)
            {
                ModelState.AddModelError("code", "The verification code is invalid or has expired.");
                var model = await _auth.GetAuthenticatorSetupAsync();
                if (model == null)
                {
                    return RedirectToAction(nameof(Index));
                }
                return View(model);
            }
            return RedirectToAction("Index", "Home", new { area = "Admin" });
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyTwoFactor()
        {
            var model = await _auth.GetTwoFactorUserAsync();
            if (model == null)
            {
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyTwoFactor(VerifyTwoFactorVM model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var verified = await _auth.VerifyTwoFactorAsync(model);
            if (!verified)
            {
                ModelState.AddModelError("Code", "The verification code is invalid or has expired.");
                return View(model);
            }
            return RedirectToAction("Index", "Home", new { area = "Admin" });
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult RecoveryCodes()
        {
            return View();
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ResetAuthenticator()
        {
            var started = await _auth.StartAuthenticatorResetAsync();
            if (!started)
            {
                return RedirectToAction(nameof(Index));
            }
            return RedirectToAction(nameof(VerifyResetOtp));
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult VerifyResetOtp()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyResetOtp(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                ModelState.AddModelError("code", "Please enter the verification code.");
                return View();
            }
            code = code.Trim();
            if (code.Length != 6 || !code.All(char.IsDigit))
            {
                ModelState.AddModelError("code", "Please enter a valid 6-digit verification code.");
                return View();
            }
            var verified = await _auth.VerifyAuthenticatorResetOtpAsync(code);
            if (!verified)
            {
                ModelState.AddModelError("code", "The verification code is invalid or has expired.");
                return View();
            }
            return RedirectToAction(nameof(ResetAuthenticatorSetup));
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ResetAuthenticatorSetup()
        {
            var model = await _auth.GetAuthenticatorResetSetupAsync();
            if (model == null)
            {
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public async Task<IActionResult> ResetAuthenticatorSetup(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                ModelState.AddModelError("code", "Please enter the verification code.");
                var model = await _auth.GetAuthenticatorResetSetupAsync();
                if (model == null)
                {
                    return RedirectToAction(nameof(Index));
                }
                return View(model);
            }
            code = code.Trim();
            if (code.Length != 6 || !code.All(char.IsDigit))
            {
                ModelState.AddModelError("code", "Please enter a valid 6-digit verification code.");
                var model = await _auth.GetAuthenticatorResetSetupAsync();
                if (model == null)
                {
                    return RedirectToAction(nameof(Index));
                }
                return View(model);
            }
            var verified = await _auth.VerifyAuthenticatorResetCodeAsync(code);
            if (!verified)
            {
                ModelState.AddModelError("code", "The verification code is invalid or has expired.");
                var model = await _auth.GetAuthenticatorResetSetupAsync();
                if (model == null)
                {
                    return RedirectToAction(nameof(Index));
                }
                return View(model);
            }
            return RedirectToAction("Index", "Home", new { area = "Admin" });
        }

        //Forgot Password
        [HttpGet]
        [AllowAnonymous]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                ModelState.AddModelError("email", "Please enter your email address.");
                return View();
            }
            email = email.Trim();
            var started = await _auth.StartForgotPasswordAsync(email);
            if (!started)
            {
                ModelState.AddModelError("email", "We could not find an account with that email address.");
                return View();
            }
            return RedirectToAction(nameof(VerifyForgotPasswordOtp));
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult VerifyForgotPasswordOtp()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyForgotPasswordOtp(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                ModelState.AddModelError("code", "Please enter the verification code.");
                return View();
            }
            code = code.Trim();
            if (code.Length != 6 || !code.All(char.IsDigit))
            {
                ModelState.AddModelError("code", "Please enter a valid 6-digit verification code.");
                return View();
            }
            var verified = await _auth.VerifyForgotPasswordOtpAsync(code);
            if (!verified)
            {
                ModelState.AddModelError("code", "The verification code is invalid or has expired.");
                return View();
            }
            return RedirectToAction(nameof(ResetPassword));
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult ResetPassword()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword(string password, string confirmPassword)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                ModelState.AddModelError("password", "Please enter a new password.");
                return View();
            }
            if (string.IsNullOrWhiteSpace(confirmPassword))
            {
                ModelState.AddModelError("confirmPassword", "Please confirm your new password.");
                return View();
            }
            if (password != confirmPassword)
            {
                ModelState.AddModelError("confirmPassword", "The passwords do not match.");
                return View();
            }
            var reset = await _auth.ResetPasswordAsync(password);
            if (!reset)
            {
                ModelState.AddModelError("", "The password could not be reset.");
                return View();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
