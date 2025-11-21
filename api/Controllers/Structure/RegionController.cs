using API.db.Structure;
using API.Models.Structure.Requests;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Structure;

[ApiController]
[Route("structure/region")]
public class RegionController : ControllerBase
{
    private readonly RegionService _service;

    public RegionController(RegionService service)
    {
        _service = service;
    }

    [HttpGet]   
    public async Task<IActionResult> GetRegions([FromQuery] GetRegionsRequest request)
    {
        var data = await _service.GetEnumerableAsync(request);
        
        return Ok(
            new GetRegionsResponse(data)
        );
    }
}