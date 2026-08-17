using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace banniriaradhisona.Models
{
    public class Song
    {
        [Key]
        public int SongId { get; set; }

        [Required]
        [Display(Name = "Song Title")]
        [StringLength(200)]
        public string SongTitleEn { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Song Title")]
        [StringLength(200)]
        public string SongTitleKa { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Lyrics")]
        public string SongLyr { get; set; } = string.Empty;

        public string? AudioUrl { get; set; }
    }
}
