using API.db;
using API.Models.Structure;
using API.Models.Structure.Requests;
using Npgsql;
using static API.Utils.DBUtils;

namespace API.db.Structure;

public class RegionService
{
    private readonly DBConnection _dbConnection;

    public RegionService(DBConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<RegionDTO>> GetEnumerableAsync(GetRegionsRequest request)
    {
        await using var conn = await _dbConnection.GetOpenConnectionAsync();
        await using var cmd = conn.CreateCommand();

        cmd.CommandText = @"
            SELECT 
                region_id,
                region_name,
                region_code_ruian
            FROM regions
        ";

        cmd.ApplyPagination(request);

        var regions = new List<RegionDTO>();
        await using var reader = await cmd.ExecuteReaderAsync();

        while (await reader.ReadAsync())
            regions.Add(new RegionDTO(
                GetInt32Safe(reader, "region_id"),
                GetStringSafe(reader, "region_name"),
                GetStringSafe(reader, "region_code_ruian")
            ));

        return regions;
    }
}