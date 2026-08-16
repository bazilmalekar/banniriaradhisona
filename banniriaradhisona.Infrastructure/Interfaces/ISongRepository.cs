using banniriaradhisona.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace banniriaradhisona.Infrastructure.Interfaces
{
    public interface ISongRepository
    {
        Task<Song?> GetFirstOrSongByIdAsync(int? songId);

        Task<IEnumerable<Song>> SearchSongsByTitleAsync(string title);

        Task<Song?> GetSongByPositionAsync(int position);
    }
}
