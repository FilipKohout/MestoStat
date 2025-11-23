using API.Models.Stats.Data;

namespace API.Models.Stats.Responses;

public class RunStatsQueryResponse
{
    public List<Dictionary<string, object>> Data { get; private set; }
    
    public RunStatsQueryResponse(List<Dictionary<string, object>> data)
    {
        Data = data;
    }
}