namespace API.Models.Structure.Requests;

public class GetDistrictsResponse
{
    public IEnumerable<DistrictDTO> Districts { get; private set; }
    
    public GetDistrictsResponse(IEnumerable<DistrictDTO> districts)
    {
        Districts = districts;
    }
}