using Npgsql;

namespace API.db;

public class DBConnection
{
    private static NpgsqlConnection? _connection;
    
    public static async Task<NpgsqlConnection> ConnectWithRetriesAsync(
            int maxAttempts = 10,
            double initialDelaySeconds = 1.0)
        {
            if (_connection != null && _connection.State == System.Data.ConnectionState.Open)
                return _connection;

            int attempt = 0;
            double delay = initialDelaySeconds;

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
                throw new InvalidOperationException("Missing ENV variables for database connection");

            var connString = $"Host={host};Port={port};Database={db};Username={user};Password={pass};Timeout=5";

            while (attempt < maxAttempts)
            {
                attempt++;
                
                try
                {
                    Console.WriteLine($"Connecting to DB (attempt {attempt}/{maxAttempts})...");
                    
                    var conn = new NpgsqlConnection(connString);
                    await conn.OpenAsync();
                    
                    Console.WriteLine("DB connection established");
                    
                    _connection = conn;
                    return _connection;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to connect to DB: {ex.Message}");
                    
                    if (attempt >= maxAttempts)
                    {
                        Console.WriteLine("Max connection attempts reached");
                        throw;
                    }

                    int delayMs = (int)(delay * 1000);
                    await Task.Delay(delayMs);
                    
                    delay = Math.Min(delay * 2, 30.0);
                }
            }

            throw new Exception("Unable to connect to the database");
        }
}