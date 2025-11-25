namespace API.Models.Structure.Requests;

public class GetRegionResponse
{
    public RegionDTO Region { get; private set; }
    
    public GetRegionResponse(RegionDTO region)
    {
        Region = region;
    }
}