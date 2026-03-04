using System.Text.Json;
using API.db.Stats;
using API.DB.Stats;
using API.db.Structure;
using API.Models.Stats.Requests;
using API.Models.Stats.Responses;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Structure;

[ApiController]
[Route("stats/data/export")]
public class StatsExportController : ControllerBase
{
    private readonly StatsQueryService _statsQueryService;
    private readonly StatsExportService _statsExportService;

    public StatsExportController(StatsQueryService statsQueryService, StatsExportService statsExportService)
    {
        _statsQueryService = statsQueryService;
        _statsExportService = statsExportService;
    }

    [HttpGet("{tableId:int}")]
    public async Task<IActionResult> DownloadStatsQuery(int tableId, [FromQuery] RunStatsQueryRequest request)
    {
        var data = await _statsQueryService.RunQueryAsync(tableId, request);

        if (data == null)
            return NotFound(new { message = "Table ID not found" });

        var responseData = new RunStatsQueryResponse(data);
        var jsonString = JsonSerializer.Serialize(responseData, new JsonSerializerOptions { WriteIndented = true });
        var bytes = System.Text.Encoding.UTF8.GetBytes(jsonString);
        
        return File(bytes, "application/json", $"export_table_{tableId}.json");
    }

    [HttpGet("structure/{identifierId:int}/json")]
    public async Task<IActionResult> DownloadStructureJson(int identifierId, [FromQuery] DownloadStructureRequest request)
    {
        var data = await _statsExportService.ExportStructureStats(identifierId, request.StructureLevelId, request.ShouldAggregate, request.PeriodicityId);
        
        var jsonString = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
        var bytes = System.Text.Encoding.UTF8.GetBytes(jsonString);
        
        return File(bytes, "application/json", $"export_structure_{identifierId}.json");
    }
    
    [HttpGet("structure/{identifierId:int}/sheet")]
    public async Task<IActionResult> DownloadStructureSheet(int identifierId, [FromQuery] DownloadStructureRequest request)
    {
        var data = await _statsExportService.ExportStructureStats(identifierId, request.StructureLevelId, request.ShouldAggregate, request.PeriodicityId);

        using var workbook = new XLWorkbook();

        foreach (var (sheetName, sheetData) in data)
        {
            if (sheetData.Count == 0) continue;
            
            string safeSheetName = sheetName;
            if (sheetName.Length > 31) safeSheetName = safeSheetName.Substring(0, 31);

            var worksheet = workbook.Worksheets.Add(safeSheetName);
            var properties = sheetData[0].Keys.ToArray();
            
            for (int col = 0; col < properties.Length; col++)
            {
                var cell = worksheet.Cell(1, col + 1);
                cell.Value = properties[col];
                cell.Style.Font.Bold = true;
            }

            for (int row = 0; row < sheetData.Count; row++)
            {
                for (int col = 0; col < properties.Length; col++)
                {
                    var value = sheetData[row][properties[col]];
                    
                    if (double.TryParse(value.ToString(), out double num)) 
                        worksheet.Cell(row + 2, col + 1).Value = num; 
                    else if (DateTime.TryParse(value.ToString(), out DateTime date)) 
                        worksheet.Cell(row + 2, col + 1).Value = date.ToString("yyyy-MM-dd"); 
                    else 
                        worksheet.Cell(row + 2, col + 1).Value = value.ToString() ?? "";
                }
            }
            
            worksheet.Columns().AdjustToContents();
        }

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        var bytes = stream.ToArray();
        
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"export_structure_ID{identifierId}_ST{request.StructureLevelId}.xlsx");
    }
}