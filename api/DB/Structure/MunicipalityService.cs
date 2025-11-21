using API.db;
using API.Models.Structure;
using Npgsql;
using static API.Utils.DBUtils;

namespace API.Services;

public class MunicipalityService
{
    private readonly DBConnection _dbConnection;

    public MunicipalityService(DBConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<MunicipalityDTO>> GetAllAsync()
    {
        await using var conn = await _dbConnection.GetOpenConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = @"
            SELECT 
                m.municipality_name,
                m.municipality_status,
                d.district_name,
                r.region_name
            FROM municipalities m
            JOIN districts d ON m.district_id = d.district_id
            JOIN regions r ON m.region_id = r.region_id;
        ";

        var municipalities = new List<MunicipalityDTO>();

        try
        {
            await using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                municipalities.Add(new MunicipalityDTO(
                    GetStringSafe(reader, "municipality_name"),
                    GetStringSafe(reader, "municipality_status"),
                    GetStringSafe(reader, "district_name"),
                    GetStringSafe(reader, "region_name")
                ));
            }
        }
        catch (NpgsqlException ex)
        {
            throw new Exception("Database query failed", ex);
        }

        return municipalities;
    }
}