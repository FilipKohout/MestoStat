using API.db;

namespace API;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddAuthorization();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseAuthorization();

        await DBConnection.ConnectWithRetriesAsync();
        
        app.MapGet("/weatherforecast", (HttpContext httpContext) => {
            return "hello";
        })
        .WithName("GetWeatherForecast")
        .WithOpenApi();

        app.Run();
    }
}