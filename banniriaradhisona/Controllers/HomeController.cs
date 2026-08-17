using banniriaradhisona.Infrastructure.Interfaces;
using banniriaradhisona.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Diagnostics;

namespace banniriaradhisona.Controllers
{
    public class HomeController : Controller
    {
        private readonly ISongRepository _songRepository;

        public HomeController(ISongRepository songRepository)
        {
            _songRepository = songRepository;
        }

        public async Task<IActionResult> Index(int? songId)
        {
            var song = await _songRepository.GetFirstOrSongByIdAsync(songId);
            if (song == null)
            {
                return NotFound();
            }
            return View(song);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
