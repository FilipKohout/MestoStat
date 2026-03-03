using System.Text.Json;
using API.db.Stats;
using API.db.Structure;
using API.Models.Stats.Requests;
using API.Models.Stats.Responses;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Structure;

[ApiController]
[Route("stats/data/export")]
public class StatsExportController : ControllerBase
{
    private readonly StatsQueryService _statsQueryService;
    private readonly StatsDefinitionsService _statsDefinitionsService;

    public StatsExportController(StatsQueryService statsQueryService, StatsDefinitionsService statsDefinitionsService)
    {
        _statsQueryService = statsQueryService;
        _statsDefinitionsService = statsDefinitionsService;
    }

    [HttpGet("{tableId:int}")]
    public async Task<IActionResult> DownloadStatsQuery(int tableId, [FromHeader] RunStatsQueryRequest request)
    {
        var data = await _statsQueryService.RunQueryAsync(tableId, request);

        if (data == null)
            return NotFound(new { message = "Table ID not found" });

        var responseData = new RunStatsQueryResponse(data);
        var jsonString = JsonSerializer.Serialize(responseData, new JsonSerializerOptions { WriteIndented = true });
        var bytes = System.Text.Encoding.UTF8.GetBytes(jsonString);
        
        return File(bytes, "application/json", $"export_table_{tableId}.json");
    }

    [HttpGet("structure/{identifierId:int}")]
    public async Task<IActionResult> DownloadStructure(int identifierId, [FromHeader] DownloadStructureRequest request)
    {
        var allTables = await _statsDefinitionsService.GetAllTablesAsync();
        
        Dictionary<string, object> data = new();
        
        foreach (var table in allTables)
        {
            var tableData = await _statsDefinitionsService.GetTableByIdAsync(table.TableId);
            if (tableData == null) continue;
            
            if (tableData.StructureLevelId == request.StructureLevelId)
            {
                var queryData = await _statsQueryService.RunQueryAsync(table.TableId, new RunStatsQueryRequest()
                {
                    StartDate = new DateTime(),
                    EndDate = DateTime.Now,
                    StructureLevelId = request.StructureLevelId,
                    IdentifierId = identifierId,
                    PeriodicityId = request.PeriodicityId,
                    ShouldAggregate = false,
                });
                
                if (queryData != null) data.Add(table.Name, queryData);
            }
        }
        
        var jsonString = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
        var bytes = System.Text.Encoding.UTF8.GetBytes(jsonString);
        
        return File(bytes, "application/json", $"export_structure_{identifierId}.json");
    }
}