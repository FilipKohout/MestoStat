using Npgsql;

namespace API.Utils;

public class DBUtils
{
    public static string GetStringSafe(NpgsqlDataReader reader, string columnName)
        => reader[columnName] as string ?? string.Empty;
}