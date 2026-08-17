using banniriaradhisona.Core.ViewModels;
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

        public async Task<SongVM?> GetFirstOrSongByIdAsync(int? songId)
        {
            Song? song;

            if (songId.HasValue)
            {
                song = await _context.Songs
                    .FirstOrDefaultAsync(s => s.SongId == songId.Value);
            }
            else
            {
                song = await _context.Songs
                    .OrderBy(s => s.SongTitleEn)
                    .FirstOrDefaultAsync();
            }

            if (song == null)
            {
                return null;
            }

            var songCount = await _context.Songs
                .CountAsync(s =>
                    string.Compare(s.SongTitleEn, song.SongTitleEn) < 0);

            return new SongVM
            {
                Song = song,
                SongCount = songCount + 1
            };
        }

        public async Task<IEnumerable<Song>> GetAllSongs()
        {
            return await _context.Songs.OrderBy(s => s.SongTitleEn).ToListAsync();
        }
    }
}
