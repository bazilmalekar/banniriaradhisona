using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace banniriaradhisona.Core.Models
{
    public class Song
    {
        [Key]
        public int SongId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        [Display(Name = "Song Number")]
        public int SongNumber { get; set; }

        [StringLength(50)]
        [Display(Name = "Song Scale")]
        public string? SongScale { get; set; }

        [Required]
        [Display(Name = "English Title")]
        [StringLength(200)]
        public string SongTitleEn { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Kannada Title")]
        [StringLength(200)]
        public string SongTitleKa { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Kannada Lyrics")]
        public string SongLyr { get; set; } = string.Empty;

        public string? AudioKey { get; set; }

        [NotMapped]
        [Display(Name = "Audio File")]
        public IFormFile? AudioFile { get; set; }

        [Display(Name = "Created Date")]
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        [Display(Name = "Recently Updated")]
        public DateTime? UpdateDate { get; set; }

        [NotMapped]
        public bool RemoveExistingAudio { get; set; }
    }
}
