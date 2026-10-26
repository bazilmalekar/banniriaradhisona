using Amazon.S3.Model;
using banniriaradhisona.Core.Settings;
using banniriaradhisona.Core.ViewModels;
using banniriaradhisona.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace banniriaradhisona.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Songs : ControllerBase
    {
        public readonly ISongRepository _songRepository;
        private readonly R2Settings _r2Settings;

        public Songs(ISongRepository songRepository, IOptions<R2Settings> r2Options)
        {
            _songRepository = songRepository;
            _r2Settings = r2Options.Value;
        }

        [HttpGet("getSong")]
        public async Task<ActionResult<SongVM>> GetSong([FromQuery] int? songId)
        {
            try
            {
                var song = await _songRepository.GetFirstOrSongByIdAsync(songId);
                if (song == null)
                {
                    return NotFound(new
                    {
                        message = "No songs found."
                    });
                }
                if (!string.IsNullOrWhiteSpace(song.Song.AudioKey) && !string.IsNullOrWhiteSpace(_r2Settings.PublicUrl))
                {
                    song.AudioUrl = $"{_r2Settings.PublicUrl.TrimEnd('/')}/" + song.Song.AudioKey.TrimStart('/');
                }
                return Ok(song);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An unexpected error occurred while retrieving the song."
                });
            }
        }

        [HttpGet("GetAllSongs")]
        public async Task<ActionResult<List<SidebarVM>>> GetAllSongs()
        {
            try
            {
                var songs = await _songRepository.GetAllSongs();
                if (songs == null || !songs.Any())
                {
                    return NotFound(new
                    {
                        message = "No songs found."
                    });
                }

                var songTitleList = songs.Select(s => new SidebarVM
                {
                    SongId = s.SongId,
                    SongCount = s.SongNumber,
                    SongTitle = s.SongTitleKa,
                    SongTitleEn = s.SongTitleEn
                }).ToList();
                return Ok(songTitleList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An unexpected error occurred while retrieving songs."
                });
            }
        }
    }
}
