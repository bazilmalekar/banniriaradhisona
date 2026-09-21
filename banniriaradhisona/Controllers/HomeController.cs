using banniriaradhisona.Core.Settings;
using banniriaradhisona.Infrastructure.Interfaces;
using banniriaradhisona.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Options;
using Rotativa.AspNetCore;
using System.Diagnostics;

namespace banniriaradhisona.Controllers
{
    public class HomeController : Controller
    {
        private readonly ISongRepository _songRepository;
        private readonly R2Settings _r2Settings;

        public HomeController(ISongRepository songRepository, IOptions<R2Settings> r2Options)
        {
            _songRepository = songRepository;
            _r2Settings = r2Options.Value;
        }

        public async Task<IActionResult> Index(int? songId)
        {
            var song = await _songRepository.GetFirstOrSongByIdAsync(songId);
            if (song != null)
            {
                if (!string.IsNullOrWhiteSpace(song.Song.AudioKey) && !string.IsNullOrWhiteSpace(_r2Settings.PublicUrl))
                {
                    song.AudioUrl = $"{_r2Settings.PublicUrl.TrimEnd('/')}/" + $"{song.Song.AudioKey.TrimStart('/')}";
                }
                return View(song);
            }

            if (songId.HasValue)
            {
                var firstSong = await _songRepository.GetFirstOrSongByIdAsync(null);
                if (firstSong != null)
                {
                    return RedirectToAction(nameof(Index), new
                    {
                        songId = firstSong.Song.SongId
                    });
                }
            }
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
