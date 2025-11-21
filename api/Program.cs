using API.db;
using API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<DBConnection>();
builder.Services.AddScoped<MunicipalityService>();

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

app.UseExceptionHandler("/error");

app.MapControllers();

app.Run();