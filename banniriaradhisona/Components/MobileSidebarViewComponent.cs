using banniriaradhisona.Core.ViewModels;
using banniriaradhisona.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace banniriaradhisona.Components
{
    public class MobileSidebarViewComponent : ViewComponent
    {
        private readonly ISongRepository _songRepository;

        public MobileSidebarViewComponent(ISongRepository songRepository)
        {
            _songRepository = songRepository;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var songs = await _songRepository.GetAllSongs();
            var currentSongId = HttpContext.Request.Query["songId"].ToString();
            var songTitleList = songs.Select(s => new SidebarVM
            {
                SongId = s.SongId,
                SongCount = s.SongNumber,
                SongTitle = s.SongTitleKa,
                SongTitleEn = s.SongTitleEn
            }).ToList();
            ViewData["CurrentSongId"] = currentSongId;
            return View(songTitleList);
        }
    }
}
