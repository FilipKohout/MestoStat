using API.Models.Structure.Requests;
using Microsoft.AspNetCore.Mvc;
using API.Services;

namespace API.Structure;

[ApiController]
[Route("structure/municipality")]
public class MunicipalityController : ControllerBase
{
    private readonly MunicipalityService _service;

    public MunicipalityController(MunicipalityService service)
    {
        _service = service;
    }

    [HttpGet]   
    public async Task<IActionResult> GetMunicipalities([FromQuery] GetMunicipalitiesRequest request)
    {
        var data = await _service.GetEnumerableAsync(request);
        
        return Ok(
            new GetMunicipalitiesResponse(data)
        );
    }
}