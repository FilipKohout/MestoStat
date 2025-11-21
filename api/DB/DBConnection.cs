using Npgsql;

namespace API.db;

public class DBConnection
{
    private readonly string _connString;

    public DBConnection()
    {
        var host = Environment.GetEnvironmentVariable("DB_HOST");
        var port = Environment.GetEnvironmentVariable("DB_PORT");
        var db = Environment.GetEnvironmentVariable("DB_NAME");
        var user = Environment.GetEnvironmentVariable("DB_USER");
        var pass = Environment.GetEnvironmentVariable("DB_PASS");

        if (string.IsNullOrEmpty(host) ||
            string.IsNullOrEmpty(port) ||
            string.IsNullOrEmpty(db) ||
            string.IsNullOrEmpty(user) ||
            string.IsNullOrEmpty(pass))
        {
            throw new InvalidOperationException("Missing ENV variables for database connection");
        }

        _connString = $"Host={host};Port={port};Database={db};Username={user};Password={pass}";
    }

    public async Task<NpgsqlConnection> GetOpenConnectionAsync(int maxAttempts = 10, double initialDelaySeconds = 1.0) {
        int attempt = 0;
        double delay = initialDelaySeconds;

        while (attempt < maxAttempts)
        {
            attempt++;
            
            try
            {
                var conn = new NpgsqlConnection(_connString);
                await conn.OpenAsync();
                
                Console.WriteLine("DB connection established");
                return conn;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"DB connection attempt {attempt} failed: {ex.Message}");
                if (attempt >= maxAttempts) throw;

                await Task.Delay((int)(delay * 1000));
                delay = Math.Min(delay * 2, 30.0);
            }
        }

        throw new Exception("Unable to connect to the database after retries");
    }
}