namespace API.Models.Structure;

public interface PaginationRequest
{
    public int? Page { get; set; }
    public int? PageSize { get; set; }
}