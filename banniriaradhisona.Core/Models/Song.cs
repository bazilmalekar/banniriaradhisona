using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace banniriaradhisona.Models
{
    public class Song
    {
        [Key]
        public int SongId { get; set; }

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

        public string? AudioUrl { get; set; }

        [Display(Name = "Created Date")]
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        [Display(Name = "Recently Updated")]
        public DateTime? UpdateDate { get; set; }
    }
}
