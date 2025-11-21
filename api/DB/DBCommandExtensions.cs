using API.Models.Structure;
using Npgsql;

public static class DbCommandExtensions
{
    public static void ApplyPagination(this NpgsqlCommand cmd, PaginationRequest? request)
    {
        if (request == null || !request.Page.HasValue || !request.PageSize.HasValue)
            return;

        var page = Math.Max(request.Page.Value, 1);
        var pageSize = Math.Max(request.PageSize.Value, 1);

        cmd.CommandText += " OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY";
        cmd.Parameters.AddWithValue("offset", (page - 1) * pageSize);
        cmd.Parameters.AddWithValue("pageSize", pageSize);
    }
}