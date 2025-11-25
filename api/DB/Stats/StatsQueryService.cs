using API.db;
using API.Models.Stats.Requests;
using Npgsql;
using System.Text;

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
                st.table_name,
                sl.identifier_column,
                GREATEST(p.interval_months,
                    (SELECT p1.interval_months
                    FROM periodicities p1
                    WHERE periodicity_id = @periodicityId)
                ) ""interval_months""
            FROM statistics st
                     JOIN periodicities p ON st.periodicity_id = p.periodicity_id
                     JOIN structure_levels sl ON st.structure_level_id = sl.structure_level_id
            WHERE st.table_id = @tableId
        ";
        metaCmd.Parameters.AddWithValue("tableId", tableId);
        metaCmd.Parameters.AddWithValue("periodicityId", request.PeriodicityId ?? 0);

        string tableName;
        string identifierColumn;
        int intervalMonths;

        await using (var metadata = await metaCmd.ExecuteReaderAsync())
        {
            if (!await metadata.ReadAsync()) return null;
            
            tableName = metadata.GetString(0);
            identifierColumn = metadata.GetString(1);
            intervalMonths = metadata.GetInt32(2);
        }

        var colsCmd = conn.CreateCommand();
        colsCmd.CommandText = @"
            SELECT column_name, alias, aggregation_method
            FROM statistic_columns
            WHERE table_id = @tableId
        ";
        colsCmd.Parameters.AddWithValue("tableId", tableId);

        var selectParts = new List<string>();
        
        await using (var colsReader = await colsCmd.ExecuteReaderAsync())
        {
            while (await colsReader.ReadAsync())
            {
                var colName = colsReader.GetString(0);
                var alias = colsReader.IsDBNull(1) ? colName : colsReader.GetString(1);
                var method = colsReader.GetString(2).ToUpper();

                selectParts.Add($"{method}(\"{colName}\") AS \"{alias}\"");
            }
        }

        if (selectParts.Count == 0)
            throw new Exception("No columns defined for aggregation in the specified table.");

        var aggregationSql = string.Join(",\n                ", selectParts);
        var sql = $@"
            SELECT
                ""{identifierColumn}"" AS group_id,
                DATE_TRUNC('month', date_recorded) -
                  ((EXTRACT(MONTH FROM date_recorded)::int - 1) % @intervalMonths) * INTERVAL '1 month'
                    AS period_start,
                {aggregationSql}
            FROM ""{tableName}""
            WHERE 
                ""{identifierColumn}"" = @identifierId AND
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
                if (r.GetName(i) != "group_id")
                    row[r.GetName(i)] = r.IsDBNull(i) ? null : r.GetValue(i);
            
            result.Add(row);
        }

        return result;
    }
}