using banniriaradhisona.Core.Models;
using banniriaradhisona.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rotativa.AspNetCore;

namespace banniriaradhisona.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Owner, Admin")]
    public class HomeController : Controller
    {
        private readonly ISongRepository _songRepository;
        private readonly IR2StorageService _r2StorageService;

        public HomeController(ISongRepository songRepository, IR2StorageService r2StorageService)
        {
            _songRepository = songRepository;
            _r2StorageService = r2StorageService;
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

        //    [HttpPost]
        //    [ValidateAntiForgeryToken]
        //    public async Task<IActionResult> Upsert(Song model)
        //    {
        //        if (!ModelState.IsValid) return View(model);

        //        try
        //        {
        //            if (model.SongId == 0)
        //            {
        //                // ADD SONG
        //                string? uploadedObjectKey = null;
        //                try
        //                {
        //                    if (model.AudioFile != null)
        //                    {
        //                        var extension = Path.GetExtension(model.AudioFile.FileName);
        //                        var objectKey = $"audio/{Guid.NewGuid()}{extension}";
        //                        await using var stream = model.AudioFile.OpenReadStream();
        //                        await _r2StorageService.UploadAsync(stream, objectKey, model.AudioFile.ContentType);
        //                        uploadedObjectKey = objectKey;
        //                        model.AudioKey = objectKey;
        //                    }
        //                    await _songRepository.AddSong(model);
        //                    TempData["successMessage"] = "Song added successfully.";
        //                }
        //                catch (Exception ex)
        //                {
        //                    if (!string.IsNullOrWhiteSpace(uploadedObjectKey))
        //                    {
        //                        await _r2StorageService.DeleteAsync(uploadedObjectKey);
        //                    }
        //                    throw;
        //                }
        //            }
        //            else
        //            {
        //                // EDIT SONG
        //                var existingSong = await _songRepository.GetSongById(model.SongId);
        //                if (existingSong == null)
        //                {
        //                    TempData["errorMessage"] = "Song details could not be found.";
        //                    return RedirectToAction(nameof(Index));
        //                }
        //                string? newObjectKey = null;
        //                string? oldObjectKey = existingSong.AudioKey;
        //                try
        //                {
        //                    //// Upload replacement audio, if provided.
        //                    //if (model.AudioFile != null)
        //                    //{
        //                    //    var extension = Path.GetExtension(model.AudioFile.FileName);
        //                    //    newObjectKey = $"audio/{Guid.NewGuid()}{extension}";
        //                    //    await using var stream = model.AudioFile.OpenReadStream();
        //                    //    await _r2StorageService.UploadAsync(stream, newObjectKey, model.AudioFile.ContentType);
        //                    //    model.AudioKey = newObjectKey;
        //                    //}
        //                    //else
        //                    //{
        //                    //    // Keep the existing audio.
        //                    //    model.AudioKey = existingSong.AudioKey;
        //                    //}
        //                    // Handle audio changes.
        //                    if (model.AudioFile != null)
        //                    {
        //                        // Upload replacement audio.
        //                        var extension = Path.GetExtension(model.AudioFile.FileName);

        //                        newObjectKey = $"audio/{Guid.NewGuid()}{extension}";

        //                        await using var stream = model.AudioFile.OpenReadStream();

        //                        await _r2StorageService.UploadAsync(
        //                            stream,
        //                            newObjectKey,
        //                            model.AudioFile.ContentType);

        //                        model.AudioKey = newObjectKey;
        //                    }
        //                    else if (model.RemoveExistingAudio)
        //                    {
        //                        // Mark existing audio for removal.
        //                        model.AudioKey = null;
        //                    }
        //                    else
        //                    {
        //                        // Keep existing audio.
        //                        model.AudioKey = existingSong.AudioKey;
        //                    }
        //                    await _songRepository.EditSong(model);
        //                    // Delete old audio only after DB update succeeds.
        //                    bool shouldDeleteOldAudio =
        //(model.AudioFile != null || model.RemoveExistingAudio) &&
        //!string.IsNullOrWhiteSpace(oldObjectKey);

        //                    if (shouldDeleteOldAudio)
        //                    {
        //                        await _r2StorageService.DeleteAsync(oldObjectKey);
        //                    }
        //                    TempData["successMessage"] = "Song details updated successfully.";
        //                }
        //                catch
        //                {
        //                    // Delete the newly uploaded file if the update fails.
        //                    if (!string.IsNullOrWhiteSpace(newObjectKey))
        //                    {
        //                        await _r2StorageService.DeleteAsync(
        //                            newObjectKey);
        //                    }
        //                    throw;
        //                }
        //            }
        //            return RedirectToAction(nameof(Index));
        //        }
        //        catch (Exception)
        //        {
        //            TempData["errorMessage"] = "Something went wrong while saving the song.";
        //            return View(model);
        //        }
        //    }

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
                    // ADD SONG
                    string? uploadedObjectKey = null;
                    try
                    {
                        if (model.AudioFile != null)
                        {
                            var extension = Path.GetExtension(model.AudioFile.FileName);
                            var objectKey = $"audio/{Guid.NewGuid()}{extension}";
                            await using var stream = model.AudioFile.OpenReadStream();
                            await _r2StorageService.UploadAsync(stream, objectKey, model.AudioFile.ContentType);
                            uploadedObjectKey = objectKey;
                            model.AudioKey = objectKey;
                        }
                        await _songRepository.AddSong(model);
                        TempData["successMessage"] = "Song added successfully.";
                    }
                    catch
                    {
                        // Remove uploaded audio if database saving fails
                        if (!string.IsNullOrWhiteSpace(uploadedObjectKey))
                        {
                            try
                            {
                                await _r2StorageService.DeleteAsync(uploadedObjectKey);
                            }
                            catch (Exception cleanupException)
                            {
                                Console.WriteLine($"Uploaded audio cleanup failed: {cleanupException}");
                            }
                        }
                        throw;
                    }
                }
                else
                {
                    // EDIT SONG
                    var existingSong = await _songRepository.GetSongById(model.SongId);
                    if (existingSong == null)
                    {
                        TempData["errorMessage"] = "Song details could not be found.";
                        return RedirectToAction(nameof(Index));
                    }
                    string? newObjectKey = null;
                    // Keep the original key from the database.
                    string? oldObjectKey = existingSong.AudioKey;
                    try
                    {
                        // 1. HANDLE AUDIO
                        if (model.AudioFile != null)
                        {
                            // Upload replacement audio
                            var extension = Path.GetExtension(model.AudioFile.FileName);
                            newObjectKey = $"audio/{Guid.NewGuid()}{extension}";
                            await using var stream = model.AudioFile.OpenReadStream();
                            await _r2StorageService.UploadAsync(stream, newObjectKey, model.AudioFile.ContentType);
                            // Save the new key in the database
                            model.AudioKey = newObjectKey;
                        }
                        else if (model.RemoveExistingAudio)
                        {
                            // Remove existing audio reference
                            model.AudioKey = null;
                        }
                        else
                        {
                            // Keep the existing audio
                            model.AudioKey = existingSong.AudioKey;
                        }
                        // 2. UPDATE DATABASE
                        await _songRepository.EditSong(model);
                        // 3. DELETE OLD AUDIO FROM R2
                        bool shouldDeleteOldAudio = (model.AudioFile != null || model.RemoveExistingAudio) && !string.IsNullOrWhiteSpace(oldObjectKey);
                        if (shouldDeleteOldAudio)
                        {
                            try
                            {
                                await _r2StorageService.DeleteAsync(oldObjectKey!);
                            }
                            catch (Exception ex)
                            {
                                // Database update succeeded,
                                // but old R2 cleanup failed.
                                Console.WriteLine($"Old R2 audio deletion failed: {ex}");
                                TempData["warningMessage"] = "Song updated, but the old audio file could not be deleted.";
                            }
                        }
                        TempData["successMessage"] = "Song details updated successfully.";
                    }
                    catch
                    {
                        // 4. CLEAN UP NEW AUDIO IF UPDATE FAILED
                        if (!string.IsNullOrWhiteSpace(newObjectKey))
                        {
                            try
                            {
                                await _r2StorageService.DeleteAsync(newObjectKey);
                            }
                            catch (Exception cleanupException)
                            {
                                Console.WriteLine($"New audio cleanup failed: {cleanupException}");
                            }
                        }
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Song save failed: {ex}");
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
                // Store the audio key before deleting the database record
                var audioKey = song.AudioKey;
                // Delete song from the database
                await _songRepository.DeleteSong(id);
                // Delete associated audio from Cloudflare R2
                if (!string.IsNullOrWhiteSpace(audioKey))
                {
                    try
                    {
                        await _r2StorageService.DeleteAsync(audioKey);
                    }
                    catch (Exception ex)
                    {
                        // Log the error without preventing the delete confirmation
                        Console.WriteLine($"R2 audio deletion failed: {ex}");
                    }
                }
                TempData["successMessage"] = "Song deleted successfully.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Song deletion failed: {ex}");
                TempData["errorMessage"] = "Error while deleting the song.";
            }
            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> DownloadSongsPdf()
        {
            var songs = await _songRepository.GetAllSongs();
            return new ViewAsPdf("ExportPDF", songs)
            {
                FileName = "Banniriaradhisona_Songs.pdf",
                PageSize = Rotativa.AspNetCore.Options.Size.A4,
                PageOrientation = Rotativa.AspNetCore.Options.Orientation.Portrait,
                PageMargins = new Rotativa.AspNetCore.Options.Margins
                {
                    Top = 10,
                    Bottom = 10,
                    Left = 10,
                    Right = 10
                },
                CustomSwitches = "--enable-local-file-access"
            };
        }
    }
}
