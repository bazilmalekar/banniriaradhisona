using banniriaradhisona.Core.ViewModels;
using banniriaradhisona.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace banniriaradhisona.Areas.Auth.Controllers
{
    [Area("Auth")]
    public class LoginController : Controller
    {
        private readonly IAuth _auth;

        public LoginController(IAuth auth)
        {
            _auth = auth;
        }

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

            if (result.Succeeded)
            {
                if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                {
                    return Redirect(returnUrl);
                }

                return RedirectToAction(
                    "Index",
                    "Home",
                    new { area = "Admin" });
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
    }
}
