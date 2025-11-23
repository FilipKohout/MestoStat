using API.Models.Stats.Data;

namespace API.Models.Stats.Responses;

public class GetStructureLevelsResponse
{
    public IEnumerable<StructureLevelDTO> StructureLevels { get; private set; }
    
    public GetStructureLevelsResponse(IEnumerable<StructureLevelDTO> structureLevels)
    {
        StructureLevels = structureLevels;
    }
}