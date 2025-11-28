    using API.db.Stats;
    using API.Models.Stats.Responses;
    using Microsoft.AspNetCore.Mvc;

    namespace API.Controllers.Stats;

    [ApiController]
    [Route("stats/definitions")]
    public class StatsDefinitionsController : ControllerBase
    {
        private readonly StatsDefinitionsService _service;

        public StatsDefinitionsController(StatsDefinitionsService service)
        {
            _service = service; 
        }

        [HttpGet("periodicities")]
        public async Task<IActionResult> GetPeriodicities()
        {
            var data = await _service.GetPeriodicityDefinitionsAsync();
            
            return Ok(
                new GetPeriodicitiesResponse(data)
            );
        }
        
        [HttpGet("structure_levels")]
        public async Task<IActionResult> GetStructureLevels()
        {
            var data = await _service.GetStructureLevelDefinitionsAsync();
            
            return Ok(
                new GetStructureLevelsResponse(data)
            );
        }
        
        [HttpGet("tables")]
        public async Task<IActionResult> GetTables()
        {
            var data = await _service.GetAllTablesAsync();
            
            return Ok(
                new GetTablesResponse(data)
            );
        }
        
        [HttpGet("tables/{tableId:int}")]
        public async Task<IActionResult> GetTableInfo(int tableId)
        {
            var data = await _service.GetTableByIdAsync(tableId);
            
            if (data == null)
                return NotFound(new { message = "Table ID not found" });
            
            return Ok(
                new GetTableResponse(data)
            );
        }
    }