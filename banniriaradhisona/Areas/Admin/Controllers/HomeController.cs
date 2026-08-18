using banniriaradhisona.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace banniriaradhisona.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class HomeController : Controller
    {
        private readonly ISongRepository _songRepository;

        public HomeController(ISongRepository songRepository)
        {
            _songRepository = songRepository;
        }


        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var songsList = await _songRepository.GetAllSongsWithIndex();
            return View(songsList);
        }

        [HttpGet]
        public async Task<IActionResult> Create()
        {
            return View();
        }
    }
}
