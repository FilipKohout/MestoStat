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
        await using var conn = await _dbConnection.GetOpenConnectionAsync();

        var metaCmd = conn.CreateCommand();
        metaCmd.CommandText = @"
            SELECT 
                table_name,
                sl.identifier_column,
                p.interval_months
            FROM statistics st
            JOIN periodicities p ON st.periodicity_id = p.periodicity_id
            JOIN structure_levels sl ON st.structure_level_id = sl.structure_level_id
            WHERE st.table_id = @id
        ";
        metaCmd.Parameters.AddWithValue("id", tableId);

        await using var metadata = await metaCmd.ExecuteReaderAsync();
        if (!await metadata.ReadAsync())
            return null;

        var tableName = metadata.GetString(0);
        var identifierColumn = metadata.GetString(1);
        var intervalMonths = metadata.GetInt32(2);

        await metadata.DisposeAsync();

        var colsCmd = conn.CreateCommand();
        colsCmd.CommandText = @"
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = @table
        ";
        colsCmd.Parameters.AddWithValue("table", tableName);

        var numericColumns = new List<string>();

        await using (var colsReader = await colsCmd.ExecuteReaderAsync())
        {
            while (await colsReader.ReadAsync())
            {
                var col = colsReader.GetString(0);
                var type = colsReader.GetString(1).ToLower();

                if (type.Contains("int") || 
                    type.Contains("numeric") ||
                    type.Contains("double") ||
                    type.Contains("real"))
                {
                    if (col != identifierColumn && col != "date_recorded" && col != "data_id") // exclude identifier and date columns
                        numericColumns.Add(col);
                }
            }
        }

        var sumParts = numericColumns
            .Select(c => $"SUM({c}) AS {c}")
            .ToList();

        var sumSql = sumParts.Count > 0
            ? string.Join(",\n", sumParts)
            : "";

        
        // TODO define what can be summed and what not, otherwise the data won't make sense
        var sql = $@"
            SELECT
                {identifierColumn} AS group_id,
                DATE_TRUNC('month', date_recorded) -
                  ((EXTRACT(MONTH FROM date_recorded)::int - 1) % @intervalMonths) * INTERVAL '1 month'
                    AS period_start
                {(sumSql != "" ? ",\n" + sumSql : "")}
            FROM {tableName}
            WHERE 
                {identifierColumn} = @identifierId AND
                date_recorded BETWEEN @start AND @end
            GROUP BY group_id, period_start
            ORDER BY group_id, period_start;
        ";

        var cmd = conn.CreateCommand();
        cmd.CommandText = sql;
        cmd.Parameters.AddWithValue("start", request.StartDate);
        cmd.Parameters.AddWithValue("end", request.EndDate);
        cmd.Parameters.AddWithValue("intervalMonths", intervalMonths);
        cmd.Parameters.AddWithValue("identifierId", request.IdentifierId);

        var result = new List<Dictionary<string, object>>();

        await using var r = await cmd.ExecuteReaderAsync();
        while (await r.ReadAsync())
        {
            var row = new Dictionary<string, object>();
            for (int i = 0; i < r.FieldCount; i++)
            {
                row[r.GetName(i)] = r.IsDBNull(i) ? null : r.GetValue(i);
            }
            result.Add(row);
        }

        return result;
    }
}