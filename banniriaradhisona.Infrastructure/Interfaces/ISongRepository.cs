using banniriaradhisona.Core.ViewModels;
using banniriaradhisona.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace banniriaradhisona.Infrastructure.Interfaces
{
    public interface ISongRepository
    {
        Task<SongVM?> GetFirstOrSongByIdAsync(int? songId);

        Task<IEnumerable<Song>> GetAllSongs();

        Task<IEnumerable<SongVM>> GetAllSongsWithIndex();
    }
}
