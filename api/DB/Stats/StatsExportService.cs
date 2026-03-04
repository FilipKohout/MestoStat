using System.Text.Json;
using API.db.Stats;
using API.db.Structure;
using API.Models.Stats.Requests;

namespace API.DB.Stats;

public class StatsExportService
{
    private readonly StatsQueryService _statsQueryService;
    private readonly StatsDefinitionsService _statsDefinitionsService;
    
    public StatsExportService(StatsQueryService statsQueryService, StatsDefinitionsService statsDefinitionsService)
    {
        _statsQueryService = statsQueryService;
        _statsDefinitionsService = statsDefinitionsService;
    }

    public async Task<Dictionary<string, List<Dictionary<string, object>>>> ExportStructureStats(int indentifierId, int structureLevelId, bool shouldAggregate = true, int? periodicityId = null)
    {
        var allTables = await _statsDefinitionsService.GetAllTablesAsync();
        Dictionary<string, List<Dictionary<string, object>>> data = new();
        
        foreach (var table in allTables)
        {
            var tableData = await _statsDefinitionsService.GetTableByIdAsync(table.TableId);
            if (tableData == null) continue;
            
            if (tableData.StructureLevelId == structureLevelId)
            {
                var queryData = await _statsQueryService.RunQueryAsync(table.TableId, new ()
                {
                    StartDate = new DateTime(),
                    EndDate = DateTime.Now,
                    StructureLevelId = structureLevelId,
                    IdentifierId = indentifierId,
                    PeriodicityId = periodicityId,
                    ShouldAggregate = shouldAggregate,
                });
                
                if (queryData != null) data.Add(table.Name, queryData);
            }
        }

        return data;
    }
}