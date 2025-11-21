namespace API.Models.Structure.Requests;

public class GetRegionsResponse
{
    public IEnumerable<RegionDTO> Regions { get; private set; }
    
    public GetRegionsResponse(IEnumerable<RegionDTO> regions)
    {
        Regions = regions;
    }
}