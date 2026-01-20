using API.Models.Stats.Data;

namespace API.Models.Stats.Responses;

public class GetMunicipalityDataResponse
{
    public List<Dictionary<string, object>> Population { get; private set; }
    public List<Dictionary<string, object>> Budget { get; private set; }
    
    public GetMunicipalityDataResponse(List<Dictionary<string, object>> population, List<Dictionary<string, object>> budget)
    {
        Population = population;
        Budget = budget;
    }
}