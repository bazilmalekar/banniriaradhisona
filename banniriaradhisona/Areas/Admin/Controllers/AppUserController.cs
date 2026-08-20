using banniriaradhisona.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace banniriaradhisona.Areas.Admin.Controllers
{
    [Area("Admin")]
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
    }
}
