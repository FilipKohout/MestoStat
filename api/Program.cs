using API.db;
using API.db.Stats;
using API.db.Structure;

var builder = WebApplication.CreateBuilder(args);

var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL");

if (string.IsNullOrEmpty(frontendUrl))
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend",
            policy =>
            {
                policy.WithOrigins(frontendUrl)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
    });
else
    throw new Exception("Frontend URL ENV is not provided");

builder.Services.AddScoped<DBConnection>();
builder.Services.AddScoped<MunicipalityService>();
builder.Services.AddScoped<DistrictService>();
builder.Services.AddScoped<RegionService>();
builder.Services.AddScoped<StatsQueryService>();
builder.Services.AddScoped<StatsDefinitionsService>();

builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DBConnection>();
    try
    {
        await db.GetOpenConnectionAsync();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Cannot connect to DB: {ex.Message}");
        return;
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseCors("AllowFrontend");

app.UseExceptionHandler("/error");

app.MapControllers();

app.Run();