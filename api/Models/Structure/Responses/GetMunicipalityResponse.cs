namespace API.Models.Structure.Requests;

public class GetMunicipalityResponse
{
    public MunicipalityDTO Municipality { get; private set; }
    
    public GetMunicipalityResponse(MunicipalityDTO municipality)
    {
        Municipality = municipality;
    }
}