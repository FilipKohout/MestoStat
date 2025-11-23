using API.db;
using API.Models.Structure;
using API.Models.Structure.Requests;
using Npgsql;
using static API.Utils.DBUtils;

namespace API.db.Structure;

public class DistrictService
{
    private readonly DBConnection _dbConnection;

    public DistrictService(DBConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<DistrictDTO>> GetEnumerableAsync(GetDistrictsRequest request)
    {
        await using var conn = await _dbConnection.GetOpenConnectionAsync();
        await using var cmd = conn.CreateCommand();

        cmd.CommandText = @"
            SELECT 
                d.district_id,
                d.district_name,
                d.district_code_ruian,
                r.region_id,
                r.region_name
            FROM districts d
            JOIN regions r ON d.region_id = r.region_id
            WHERE 1=1
        ";
        
        if (!string.IsNullOrEmpty(request.Region))
        {
            cmd.CommandText += " AND r.region_name = @region";
            cmd.Parameters.AddWithValue("region", request.Region);
        }

        cmd.ApplyPagination(request);

        var districts = new List<DistrictDTO>();
        await using var reader = await cmd.ExecuteReaderAsync();

        while (await reader.ReadAsync())
            districts.Add(new DistrictDTO(
                GetInt32Safe(reader, "district_id"),
                GetStringSafe(reader, "district_name"),
                GetStringSafe(reader, "district_code_ruian"),
                GetInt32Safe(reader, "region_id"),
                GetStringSafe(reader, "region_name")
            ));

        return districts;
    }
}