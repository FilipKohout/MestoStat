using API.Models.Stats.Data;

namespace API.Models.Stats.Responses;

public class GetMunicipalityDataResponse
{
    public List<Dictionary<string, object>> Population { get; private set; }
    
    public GetMunicipalityDataResponse(List<Dictionary<string, object>> population)
    {
        Population = population;
    }
}