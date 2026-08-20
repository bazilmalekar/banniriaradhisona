using banniriaradhisona.Core.Models;
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
        public async Task<IActionResult> Upsert(int id = 0)
        {
            if (id == 0)
            {
                return View(new Song());
            }
            var song = await _songRepository.GetSongById(id);
            if (song == null)
            {
                TempData["errorMessage"] = "Song details not found.";
                return RedirectToAction(nameof(Index));
            }
            return View(song);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Upsert(Song model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            try
            {
                if (model.SongId == 0)
                {
                    await _songRepository.AddSong(model);
                    TempData["successMessage"] = "Song added successfully.";
                }
                else
                {
                    var existingSong = await _songRepository.GetSongById(model.SongId);
                    if (existingSong == null)
                    {
                        TempData["errorMessage"] = "Song details could not be found.";
                        return RedirectToAction(nameof(Index));
                    }
                    await _songRepository.EditSong(model);
                    TempData["successMessage"] = "Song details updated successfully.";
                }
                return RedirectToAction(nameof(Index));
            }
            catch (Exception)
            {
                TempData["errorMessage"] = "Something went wrong while saving the song.";
                return View(model);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var song = await _songRepository.GetSongById(id);
                if (song == null)
                {
                    TempData["errorMessage"] = "Song details not found.";
                    return RedirectToAction(nameof(Index));
                }
                await _songRepository.DeleteSong(id);
                TempData["successMessage"] = "Song deleted successfully.";
            }
            catch (Exception)
            {
                TempData["errorMessage"] = "Error while deleting the song.";
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
