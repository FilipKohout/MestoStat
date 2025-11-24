using API.db.Structure;
using API.Models.Stats.Requests;
using API.Models.Stats.Responses;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Structure;

[ApiController]
[Route("stats/data")]
public class StatsDataController : ControllerBase
{
    private readonly StatsQueryService _service;

    public StatsDataController(StatsQueryService service)
    {
        _service = service; 
    }

    [HttpPost("{tableId:int}")]
    public async Task<IActionResult> RunStatsQuery(int tableId, [FromBody] RunStatsQueryRequest request)
    {
        var data = await _service.RunQueryAsync(tableId, request);
        
        if (data == null)
            return NotFound(new { message = "Table ID not found" });
        
        return Ok(
            new RunStatsQueryResponse(data)
        ); 
    }
}