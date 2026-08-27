using System;
using System.Collections.Generic;
using System.Text;

namespace banniriaradhisona.Core.ViewModels
{
    public class AuthenticatorSetupVM
    {
        public string SharedKey { get; set; } = string.Empty;

        public string AuthenticatorUri { get; set; } = string.Empty;
    }
}
