using banniriaradhisona.Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace banniriaradhisona.Core.ViewModels
{
    public class UserWithRoleVM : Users
    {
        public List<string> Roles { get; set; } = new();
    }
}
