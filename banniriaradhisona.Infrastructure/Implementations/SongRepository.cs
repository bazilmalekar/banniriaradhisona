using banniriaradhisona.Core.ViewModels;
using banniriaradhisona.Data;
using banniriaradhisona.Infrastructure.Interfaces;
using banniriaradhisona.Core.Models;
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

        public async Task<IEnumerable<SongVM>> GetAllSongsWithIndex()
        {
            var songs = await _context.Songs.OrderBy(o => o.SongTitleEn).ToListAsync();

            return songs.Select((song, index) => new SongVM
            {
                Song = song,
                SongCount = index + 1
            });
        }

        public async Task<Song> GetSongById(int id)
        {
            return await _context.Songs.FindAsync(id);
        }

        public async Task AddSong(Song model)
        {
            await _context.Songs.AddAsync(model);
            await Save();
        }

        public async Task EditSong(Song model)
        {
            var song = await GetSongById(model.SongId);
            if (song != null)
            {
                song.SongTitleEn = model.SongTitleEn;
                song.SongTitleKa = model.SongTitleKa;
                song.SongLyr = model.SongLyr;
                song.UpdateDate = DateTime.UtcNow;
                _context.Songs.Update(song);
                await Save();
            }
        }

        public async Task DeleteSong(int id)
        {
            var song = await GetSongById(id);
            if (song == null)
            {
                return;
            }
            _context.Songs.Remove(song);
            await Save();
        }

        private async Task Save()
        {
            await _context.SaveChangesAsync();
        }
    }
}
