using API.db.Structure;
using API.Models.Structure.Requests;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Structure;

[ApiController]
[Route("structure/district")]
public class DistrictController : ControllerBase
{
    private readonly DistrictService _service;

    public DistrictController(DistrictService service)
    {
        _service = service; 
    }

    [HttpGet]   
    public async Task<IActionResult> GetDistricts([FromQuery] GetDistrictsRequest request)
    {
        var data = await _service.GetEnumerableAsync(request);
        
        return Ok(
            new GetDistrictsResponse(data)
        );
    }
}