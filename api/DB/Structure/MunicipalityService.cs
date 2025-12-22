using API.db;
using API.Models.Structure;
using API.Models.Structure.Requests;
using Npgsql;
using static API.Utils.DBUtils;

namespace API.db.Structure;

public class MunicipalityService
{
    private readonly DBConnection _dbConnection;

    public MunicipalityService(DBConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<MunicipalityDTO>> GetEnumerableAsync(GetMunicipalitiesRequest request, int? municipalityId = null)
    {
        await using var conn = await _dbConnection.GetOpenConnectionAsync();
        await using var cmd = conn.CreateCommand();

        cmd.CommandText = @"
            SELECT 
                m.municipality_id,
                m.municipality_name,
                m.municipality_status,
                d.district_id,
                d.district_name,
                r.region_id,
                r.region_name,
                m.zuj,
                m.municipality_image_url,
                m.ico,
                m.dic
            FROM municipalities m
            JOIN districts d ON m.district_id = d.district_id
            JOIN regions r ON m.region_id = r.region_id
            WHERE 1=1
        ";

        if (!string.IsNullOrEmpty(request.District))
        {
            cmd.CommandText += " AND d.district_name = @district";
            cmd.Parameters.AddWithValue("district", request.District);
        }

        if (!string.IsNullOrEmpty(request.Region))
        {
            cmd.CommandText += " AND r.region_name = @region";
            cmd.Parameters.AddWithValue("region", request.Region);
        }
        
        if (municipalityId != null)
        {
            cmd.CommandText += " AND m.municipality_id = @municipalityId";
            cmd.Parameters.AddWithValue("municipalityId", municipalityId);
        }

        cmd.ApplyPagination(request);

        var municipalities = new List<MunicipalityDTO>();
        await using var reader = await cmd.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            municipalities.Add(new MunicipalityDTO(
                GetInt32Safe(reader, "municipality_id"),
                GetStringSafe(reader, "municipality_name"),
                GetStringSafe(reader, "municipality_status"),
                GetInt32Safe(reader, "district_id"),
                GetStringSafe(reader, "district_name"),
                GetInt32Safe(reader, "region_id"),
                GetStringSafe(reader, "region_name"),
                GetInt32Safe(reader, "zuj"),
                GetStringSafe(reader, "municipality_image_url"),
                GetStringSafe(reader, "ico"),
                GetStringSafe(reader, "dic")
            ));
        }

        return municipalities;
    }
    
    public async Task<MunicipalityDTO?> GetObjectAsync(int municipalityId)
    {
        var enumerables = await GetEnumerableAsync(new(), municipalityId);

        if (enumerables.Count() == 0)
            return null;
        
        return enumerables.First();
    }
}