using Microsoft.AspNetCore.Mvc;
using banniriaradhisona.Core.ViewModels;
using banniriaradhisona.Infrastructure.Interfaces;

namespace banniriaradhisona.Components
{
    public class SidebarViewComponent: ViewComponent
    {
        private readonly ISongRepository _songRepository;

        public SidebarViewComponent(ISongRepository songRepository)
        {
            _songRepository = songRepository;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var songs = await _songRepository.GetAllSongs();
            var songTitleList = songs.Select((s, i) => new SidebarVM
            {
                SongId = s.SongId,
                SongCount = i + 1,
                SongTitle = s.SongTitleKa
            });
            return View(songTitleList);  
        }
    }
}
