namespace API.Models.Structure.Requests;

public class GetMunicipalitiesRequest : PaginationRequest
{
    public string? District { get; set; }
    public string? Region { get; set; }
    public int? Page { get; set; }
    public int? PageSize { get; set; }
}