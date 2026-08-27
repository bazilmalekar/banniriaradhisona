using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace banniriaradhisona.Core.ViewModels
{
    public class VerifyTwoFactorVM
    {
        [Required]
        [StringLength(6, MinimumLength = 6)]
        [RegularExpression(@"^\d{6}$", ErrorMessage = "Please enter a valid 6-digit code.")]
        public string Code { get; set; } = string.Empty;

        public bool RememberMe { get; set; }

        public bool RememberClient { get; set; }
    }
}
