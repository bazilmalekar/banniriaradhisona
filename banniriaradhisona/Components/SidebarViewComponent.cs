using Microsoft.AspNetCore.Mvc;

namespace banniriaradhisona.Components
{
    public class SidebarViewComponent: ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {
            return View();  
        }
    }
}
