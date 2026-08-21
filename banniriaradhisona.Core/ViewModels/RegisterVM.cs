using banniriaradhisona.Core.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using banniriaradhisona.Core.ViewModels;

namespace banniriaradhisona.Core.ViewModels
{
    public class RegisterVM
    {
        public string? Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Role is required")]
        public UserRoles Role { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(40, MinimumLength = 8)]
        [DataType(DataType.Password)]
        public string? Password { get; set; }

        [Compare("Password", ErrorMessage = "Password does not match")]
        [DataType(DataType.Password)]
        [Display(Name = "Confirm Password")]
        public string? ConfirmPassword { get; set; }
    }
}
