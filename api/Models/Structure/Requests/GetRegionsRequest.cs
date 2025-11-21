namespace API.Models.Structure.Requests;

public class GetRegionsRequest : PaginationRequest
{
    public int? Page { get; set; }
    public int? PageSize { get; set; }
}