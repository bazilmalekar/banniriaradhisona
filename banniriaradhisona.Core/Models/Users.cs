using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
namespace banniriaradhisona.Core.Models;


public class Users : IdentityUser
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
}
