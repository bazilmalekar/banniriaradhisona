using banniriaradhisona.Core.ViewModels;
using banniriaradhisona.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace banniriaradhisona.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Owner")]
    public class AppUserController : Controller
    {
        private readonly IAdminRepository _adminRepository;

        public AppUserController(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        public async Task<IActionResult> Index()
        {
            var users = await _adminRepository.GetUsersAsync();
            return View(users);
        }

        [HttpGet]
        public async Task<IActionResult> Register(string? id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return View(new RegisterVM());
            }
            var user = await _adminRepository.GetUserByIdAsync(id);
            if (user == null)
            {
                TempData["errorMessage"] = "User details not found.";
                return RedirectToAction(nameof(Index));
            }
            return View(user);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterVM model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var result = await _adminRepository.CreateUserAsync(model);

            if (result.Succeeded)
            {
                TempData["successMessage"] = "User created successfully.";
                return RedirectToAction(nameof(Index));
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(RegisterVM model)
        {
            if (!ModelState.IsValid)
            {
                return View("Register", model);
            }

            var result = await _adminRepository.EditUserAsync(model);

            if (result.Succeeded)
            {
                TempData["successMessage"] = "User details updated successfully.";
                return RedirectToAction(nameof(Index));
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return View("Register", model);
        }
    }
}
