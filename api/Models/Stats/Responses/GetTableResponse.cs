using API.Models.Stats.Data;

namespace API.Models.Stats.Responses;

public class GetTableResponse
{
    public TableDTO Table { get; private set; }
    
    public GetTableResponse(TableDTO table)
    {
        Table = table;
    }
}