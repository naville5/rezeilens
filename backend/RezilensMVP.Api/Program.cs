using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RezilensMVP.Api.Data;
using RezilensMVP.Api.Infrastructure;
using RezilensMVP.Api.Models;
using RezilensMVP.Api.Repositories.Maintenance;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
    
// --------------------
// 1️⃣ Configure DbContext
// --------------------
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// --------------------
// 2️⃣ Configure Identity
// --------------------
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// --------------------
// 3️⃣ Configure JWT Authentication
// --------------------
var jwtSettings = builder.Configuration.GetSection("JWT");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["ValidIssuer"],
        ValidAudience = jwtSettings["ValidAudience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]))
    };
});

// --------------------
// 4️⃣ Add Controllers & Swagger
// --------------------
builder.Services.AddControllers();

//register services
builder.Services.AddTransient<IMaintenanceService, MaintenanceService>();
builder.Services.AddHttpClient();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --------------------
// 5️⃣ Register SeedData for DI
// --------------------
builder.Services.AddScoped<Seed>();

var app = builder.Build();

// --------------------
// 6️⃣ Apply Migrations and Seed Data
// --------------------
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDbContext>();
    try
    {
        context.Database.Migrate();  // Applies pending migrations safely
    }
    catch (Microsoft.Data.SqlClient.SqlException ex) when (ex.Number == 1801)
    {
        // Database already exists, safe to ignore
        Console.WriteLine("Database already exists. Skipping creation.");
    }
    await Seed.InitializeAsync(services); // Seed roles, users, and UserDetails
}

// --------------------
// 7️⃣ Configure Middleware
// --------------------
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}
// Swagger available at root
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "RezilensMVP API V1");
    c.RoutePrefix = ""; // Swagger at https://localhost:44308/
});

if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DOTNET_ENV_DOCKER")))
{
    app.UseHttpsRedirection();
}
app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.UseAuthentication(); // JWT
app.UseAuthorization();

app.MapControllers();

// --------------------
// Optional: Example endpoint
// --------------------
app.MapGet("/weatherforecast", () =>
{
    var summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

// --------------------
// Record for weather forecast
// --------------------
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
