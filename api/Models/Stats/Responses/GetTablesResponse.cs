using API.Models.Stats.Data;

namespace API.Models.Stats.Responses;

public class GetTablesResponse
{
    public IEnumerable<TableDTO> Tables { get; private set; }
    
    public GetTablesResponse(IEnumerable<TableDTO> table)
    {
        Tables = table;
    }
}