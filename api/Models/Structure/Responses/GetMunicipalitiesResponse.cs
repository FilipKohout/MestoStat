namespace API.Models.Structure.Requests;

public class GetMunicipalitiesResponse
{
    public IEnumerable<MunicipalityDTO> Municipalities { get; private set; }
    
    public GetMunicipalitiesResponse(IEnumerable<MunicipalityDTO> municipalities)
    {
        Municipalities = municipalities;
    }
}