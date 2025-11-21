namespace API.Models.Structure.Requests;

public class GetDistrictsRequest : PaginationRequest
{
    public string? Region { get; set; }
    public int? Page { get; set; }
    public int? PageSize { get; set; }
}