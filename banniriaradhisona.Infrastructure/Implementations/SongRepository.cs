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
                song = await _context.Songs.FirstOrDefaultAsync(s => s.SongId == songId.Value);
            }
            else
            {
                song = await _context.Songs.OrderBy(s => s.SongNumber).FirstOrDefaultAsync();
            }

            if (song == null)
            {
                return null;
            }

            return new SongVM
            {
                Song = song,
                SongCount = song.SongNumber
            };
        }

        public async Task<IEnumerable<Song>> GetAllSongs()
        {
            return await _context.Songs.OrderBy(s => s.SongNumber).ToListAsync();
        }

        public async Task<IEnumerable<SongVM>> GetAllSongsWithIndex()
        {
            var songs = await _context.Songs.OrderBy(o => o.SongNumber).ToListAsync();
            return songs.Select(song => new SongVM
            {
                Song = song,
                SongCount = song.SongNumber
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
            if (song == null)
            {
                return;
            }

            int oldSongNumber = song.SongNumber;
            int newSongNumber = model.SongNumber;

            if (oldSongNumber != newSongNumber)
            {
                if (newSongNumber < oldSongNumber)
                {
                    // Moving UP
                    var songsToShift = await _context.Songs
                        .Where(s =>
                            s.SongNumber >= newSongNumber &&
                            s.SongNumber < oldSongNumber &&
                            s.SongId != song.SongId)
                        .ToListAsync();
                    foreach (var item in songsToShift)
                    {
                        item.SongNumber++;
                    }
                }
                else
                {
                    // Moving DOWN
                    var songsToShift = await _context.Songs
                        .Where(s =>
                            s.SongNumber > oldSongNumber &&
                            s.SongNumber <= newSongNumber &&
                            s.SongId != song.SongId)
                        .ToListAsync();
                    foreach (var item in songsToShift)
                    {
                        item.SongNumber--;
                    }
                }
                song.SongNumber = newSongNumber;
            }

            song.SongTitleEn = model.SongTitleEn;
            song.SongTitleKa = model.SongTitleKa;
            song.SongLyr = model.SongLyr;
            song.UpdateDate = DateTime.UtcNow;

            _context.Songs.Update(song);
            await Save();
        }

        public async Task DeleteSong(int id)
        {
            var song = await GetSongById(id);
            if (song == null)
            {
                return;
            }
            // Get songs after the deleted song
            var songsAfter = await _context.Songs
                .Where(s => s.SongNumber > song.SongNumber)
                .OrderBy(s => s.SongNumber)
                .ToListAsync();
            // Move each following song up by one
            foreach (var item in songsAfter)
            {
                item.SongNumber--;
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
