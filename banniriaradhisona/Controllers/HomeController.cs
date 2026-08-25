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

            if (song != null)
            {
                return View(song);
            }

            // Requested song no longer exists.
            if (songId.HasValue)
            {
                var firstSong = await _songRepository.GetFirstOrSongByIdAsync(null);

                if (firstSong != null)
                {
                    return RedirectToAction(
                        nameof(Index),
                        new { songId = firstSong.Song.SongId });
                }
            }

            // No songs exist at all.
            return View("NoSongs");
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
