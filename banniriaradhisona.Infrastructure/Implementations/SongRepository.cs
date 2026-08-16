using banniriaradhisona.Data;
using banniriaradhisona.Infrastructure.Interfaces;
using banniriaradhisona.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace banniriaradhisona.Infrastructure.Implementations
{
    public class SongRepository : ISongRepository
    {
        private readonly ApplicationDbContext _context;

        public SongRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Song?> GetFirstOrSongByIdAsync(int? songId)
        {
            if (songId.HasValue)
            {
                return await _context.Songs.FirstOrDefaultAsync(s => s.SongId == songId.Value); //Value => int == int (comparison)
            }
            else
            {
                return await _context.Songs.OrderBy(s => s.SongTitleEn).FirstOrDefaultAsync();
            }
        }

        public Task<Song?> GetSongByPositionAsync(int position)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Song>> SearchSongsByTitleAsync(string title)
        {
            throw new NotImplementedException();
        }
    }
}
