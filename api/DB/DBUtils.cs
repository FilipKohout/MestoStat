using Npgsql;

namespace API.Utils;

public class DBUtils
{
    public static string GetStringSafe(NpgsqlDataReader reader, string columnName)
        => reader[columnName] as string ?? string.Empty;
    
    public static int GetInt32Safe(NpgsqlDataReader reader, string columnName)
        => reader[columnName] as int? ?? 0;
    
    public static DateTime GetDateTimeSafe(NpgsqlDataReader reader, string columnName)
        => reader.GetDateTime(reader.GetOrdinal(columnName)) as DateTime? ?? DateTime.MinValue;
}