
using API.Models.Stats.Data;
using Npgsql;
using static API.Utils.DBUtils;

namespace API.db.Stats;

public class StatsDefinitionsService
{
    private readonly DBConnection _dbConnection;

    public StatsDefinitionsService(DBConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<PeriodicityDTO>> GetPeriodicityDefinitionsAsync()
    {
        await using var conn = await _dbConnection.GetOpenConnectionAsync();
        await using var cmd = conn.CreateCommand();

        cmd.CommandText = @"
            SELECT 
                periodicity_id,
                periodicity_name
            FROM periodicities
        ";

        var periodicities = new List<PeriodicityDTO>();
        await using var reader = await cmd.ExecuteReaderAsync();

        while (await reader.ReadAsync())
            periodicities.Add(new PeriodicityDTO(
                GetInt32Safe(reader, "periodicity_id"),
                GetStringSafe(reader, "periodicity_name")
            ));

        return periodicities;
    }

    public async Task<IEnumerable<StructureLevelDTO>> GetStructureLevelDefinitionsAsync()
    {
        await using var conn = await _dbConnection.GetOpenConnectionAsync();
        await using var cmd = conn.CreateCommand();

        cmd.CommandText = @"
            SELECT 
                structure_level_id,
                structure_level_name
            FROM structure_levels
        ";
        
        var structureLevels = new List<StructureLevelDTO>();
        await using var reader = await cmd.ExecuteReaderAsync();
        
        while (await reader.ReadAsync())
            structureLevels.Add(new StructureLevelDTO(
                GetInt32Safe(reader, "structure_level_id"),
                GetStringSafe(reader, "structure_level_name")
            ));
        
        return structureLevels;
    }
    
    public async Task<IEnumerable<TableDTO>> GetAllTablesAsync()
    {
        await using var conn = await _dbConnection.GetOpenConnectionAsync();
        await using var cmd = conn.CreateCommand();

        cmd.CommandText = @"
            SELECT 
                s.table_id, s.table_name, s.last_updated, s.source_domain, s.periodicity_id, p.periodicity_name, s.structure_level_id, sl.structure_level_name
            FROM statistics s
            JOIN periodicities p ON s.periodicity_id = p.periodicity_id
            JOIN structure_levels sl ON s.structure_level_id = sl.structure_level_id
        ";
        
        var tables = new List<TableDTO>();
        await using var reader = await cmd.ExecuteReaderAsync();
        
        while (await reader.ReadAsync())
            tables.Add(new TableDTO(
                GetInt32Safe(reader, "table_id"),
                GetStringSafe(reader, "table_name"),
                GetDateTimeSafe(reader, "last_updated"),
                GetStringSafe(reader, "source_domain"),
                GetInt32Safe(reader, "periodicity_id"),
                GetStringSafe(reader, "periodicity_name"),
                GetInt32Safe(reader, "structure_level_id"),
                GetStringSafe(reader, "structure_level_name")
            ));
        
        return tables;
    }
    
    public async Task<TableDTO?> GetTableByIdAsync(int tableId)
    {
        await using var conn = await _dbConnection.GetOpenConnectionAsync();
        await using var cmd = conn.CreateCommand();

        cmd.CommandText = @"
            SELECT 
                s.table_id, s.table_name, s.last_updated, s.source_domain, s.periodicity_id, p.periodicity_name, s.structure_level_id, sl.structure_level_name
            FROM statistics s
            JOIN periodicities p ON s.periodicity_id = p.periodicity_id
            JOIN structure_levels sl ON s.structure_level_id = sl.structure_level_id
            WHERE s.table_id = @tableId
        ";
        
        cmd.Parameters.AddWithValue("tableId", tableId);
        
        await using var reader = await cmd.ExecuteReaderAsync();
        
        if (await reader.ReadAsync())
        {
            return new TableDTO(
                GetInt32Safe(reader, "table_id"),
                GetStringSafe(reader, "table_name"),
                GetDateTimeSafe(reader, "last_updated"),
                GetStringSafe(reader, "source_domain"),
                GetInt32Safe(reader, "periodicity_id"),
                GetStringSafe(reader, "periodicity_name"),
                GetInt32Safe(reader, "structure_level_id"),
                GetStringSafe(reader, "structure_level_name")
            );
        }

        return null;
    }
}