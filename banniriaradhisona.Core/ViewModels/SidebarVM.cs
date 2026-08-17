using System;
using System.Collections.Generic;
using System.Text;

namespace banniriaradhisona.Core.ViewModels
{
    public class SidebarVM
    {
        public int SongId { get; set; }

        public int SongCount { get; set; }

        public string SongTitle { get; set; } = string.Empty;

        public string SongTitleEn { get; set; } = string.Empty;
    }
}
