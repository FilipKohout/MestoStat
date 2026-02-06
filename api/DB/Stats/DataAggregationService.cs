using API.db;

namespace API.DB.Stats;

public class DataAggregationService
{
    private readonly DBConnection _dbConnection;
    
    public DataAggregationService(DBConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }
    
    public async Task<List<int>> GetIdentifierIds(int identifierId, int sourceLevelId, int targetLevelId)
    {
        await using var conn = await _dbConnection.GetOpenConnectionAsync();
        var metaCmd = conn.CreateCommand();
        
        metaCmd.CommandText = @"
            SELECT 
                s_target.identifier_column AS source_col,
                s_target.table_name AS source_table,
                s_source.identifier_column AS target_col
            FROM structure_levels s_source
            CROSS JOIN structure_levels s_target
            WHERE s_source.structure_level_id = @sourceId 
              AND s_target.structure_level_id = @targetId";
        
        metaCmd.Parameters.AddWithValue("sourceId", sourceLevelId);
        metaCmd.Parameters.AddWithValue("targetId", targetLevelId);

        string sourceCol, sourceTable, targetCol;

        await using (var reader = await metaCmd.ExecuteReaderAsync())
        {
            if (!await reader.ReadAsync())
                throw new Exception("Structure levels configuration not found");

            sourceCol = reader.GetString(0);
            sourceTable = reader.GetString(1);
            targetCol = reader.GetString(2);
        }

        if (string.IsNullOrEmpty(sourceTable))
            throw new InvalidOperationException("Source structure level does not have a mapped table");
        
        var ids = new List<int>();
        var dataCmd = conn.CreateCommand();
        dataCmd.CommandText = $@"SELECT ""{sourceCol}"" FROM ""{sourceTable}"" WHERE ""{targetCol}"" = @id";
        dataCmd.Parameters.AddWithValue("id", identifierId);

        await using (var reader = await dataCmd.ExecuteReaderAsync())
        {
            while (await reader.ReadAsync())
            {
                ids.Add(reader.GetInt32(0));
            }
        }

        return ids;
    }
}