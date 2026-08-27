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

            return RedirectToAction(
                "Index",
                "Home",
                new { area = "" });
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
                ModelState.AddModelError(
                    "code",
                    "Please enter the verification code.");

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
                ModelState.AddModelError(
                    "code",
                    "Please enter a valid 6-digit verification code.");

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
                ModelState.AddModelError(
                    "code",
                    "The verification code is invalid or has expired.");

                var model = await _auth.GetAuthenticatorSetupAsync();

                if (model == null)
                {
                    return RedirectToAction(nameof(Index));
                }

                return View(model);
            }

            return RedirectToAction(
                "Index",
                "Home",
                new { area = "Admin" });
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
                ModelState.AddModelError(
                    "Code",
                    "The verification code is invalid or has expired.");

                return View(model);
            }

            return RedirectToAction(
                "Index",
                "Home",
                new { area = "Admin" });
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult RecoveryCodes()
        {
            return View();
        }
    }
}
