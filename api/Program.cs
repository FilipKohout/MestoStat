using System;
using API.db;
using API.db.Stats;
using API.DB.Stats;
using API.db.Structure;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL");

if (!string.IsNullOrEmpty(frontendUrl))
{
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

    Console.WriteLine($"Frontend URL set to: {frontendUrl}");
}
else
    throw new Exception("Frontend URL ENV is not provided");

builder.Services.AddScoped<DBConnection>();
builder.Services.AddScoped<MunicipalityService>();
builder.Services.AddScoped<DistrictService>();
builder.Services.AddScoped<RegionService>();
builder.Services.AddScoped<StatsQueryService>();
builder.Services.AddScoped<StatsDefinitionsService>();
builder.Services.AddScoped<DataAggregationService>();

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
    finally
    {
        Console.WriteLine("Database connected");
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