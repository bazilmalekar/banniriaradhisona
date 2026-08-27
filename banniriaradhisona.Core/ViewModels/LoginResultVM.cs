using System;
using System.Collections.Generic;
using System.Text;

namespace banniriaradhisona.Core.ViewModels
{
    public class LoginResultVM
    {
        public bool Succeeded { get; set; }

        public bool RequiresTwoFactor { get; set; }

        public bool RequiresAuthenticatorSetup { get; set; }
    }
}
