using API.Models.Stats.Data;

namespace API.Models.Stats.Responses;

public class GetPeriodicitiesResponse
{
    public IEnumerable<PeriodicityDTO> Periodicities { get; private set; }
    
    public GetPeriodicitiesResponse(IEnumerable<PeriodicityDTO> periodicities)
    {
        Periodicities = periodicities;
    }
}