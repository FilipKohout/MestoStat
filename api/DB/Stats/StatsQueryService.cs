using API.db;
using API.Models.Stats.Requests;
using API.Models.Structure;
using API.Models.Structure.Requests;
using Npgsql;
using static API.Utils.DBUtils;

namespace API.db.Structure;

public class StatsQueryService
{
    private readonly DBConnection _dbConnection;

    public StatsQueryService(DBConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<List<Dictionary<string, object>>?> RunQueryAsync(int tableId, RunStatsQueryRequest request)
    {
        // TODO remake this all to use parameters from request
        await using var conn = await _dbConnection.GetOpenConnectionAsync();

        var getTableCmd = conn.CreateCommand();
        getTableCmd.CommandText = "SELECT table_name FROM statistics WHERE table_id = @id";
        getTableCmd.Parameters.AddWithValue("id", tableId);

        var tableName = (string?)await getTableCmd.ExecuteScalarAsync();
        if (tableName == null)
            return null;

        var cmd = conn.CreateCommand();
        cmd.CommandText = $"SELECT * FROM {tableName}";

        await using var reader = await cmd.ExecuteReaderAsync();
        var results = new List<Dictionary<string, object>>();

        while (await reader.ReadAsync())
        {
            var row = new Dictionary<string, object>();

            for (int i = 0; i < reader.FieldCount; i++)
            {
                var column = reader.GetName(i);
                var value = reader.IsDBNull(i) ? null : reader.GetValue(i);
                row[column] = value!;
            }

            results.Add(row);
        }

        return results;
    }
}