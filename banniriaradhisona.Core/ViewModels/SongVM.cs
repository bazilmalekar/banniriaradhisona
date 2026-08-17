using banniriaradhisona.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace banniriaradhisona.Core.ViewModels
{
    public class SongVM
    {
        public Song Song { get; set; } = null!;

        public int SongCount { get; set; }
    }
}
