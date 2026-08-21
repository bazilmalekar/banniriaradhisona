using banniriaradhisona.Core.Models;
using banniriaradhisona.Data;
using banniriaradhisona.Infrastructure.Implementations;
using banniriaradhisona.Infrastructure.Interfaces;
using banniriaradhisona.Services;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

if (!builder.Environment.IsDevelopment())
{
    builder.WebHost.ConfigureKestrel(options =>
    {
        options.ListenAnyIP(5000);
    });
}
;

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddIdentity<Users, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedAccount = false;
    options.SignIn.RequireConfirmedEmail = false;
    options.SignIn.RequireConfirmedPhoneNumber = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultUI()
.AddDefaultTokenProviders();

//Register repositories for dependency injection
builder.Services.AddScoped<ISongRepository, SongRepository>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<IAuth, Auth>();

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 52428800; // 50 MB
});

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(60);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Auth/Login";
    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.SlidingExpiration = true;
    options.Cookie.HttpOnly = true;
});

builder.Services.AddAntiforgery(options =>
{
    options.Cookie.Expiration = TimeSpan.FromDays(7);
});

var app = builder.Build();

//calls the seed method once, when the application starts
await SeedService.SeedDatabase(app.Services);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto
});

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "areas",
    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.MapRazorPages()
   .WithStaticAssets();

app.Run();
