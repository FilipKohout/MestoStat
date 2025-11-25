using API.db.Structure;
using API.Models.Structure.Requests;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Structure;

[ApiController]
[Route("structure/districts")]
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
    
    [HttpGet("{districtId:int}")]
    public async Task<IActionResult> GetDistrict(int districtId)
    {
        var data = await _service.GetObjectAsync(districtId);
        
        if (data == null)
            return NotFound(new { message = "District ID not found" });
        
        return Ok(
            new GetDistrictResponse(data)
        );
    }
}