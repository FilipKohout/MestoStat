namespace API.Models.Structure.Requests;

public class GetDistrictResponse
{
    public DistrictDTO District { get; private set; }
    
    public GetDistrictResponse(DistrictDTO district)
    {
        District = district;
    }
}