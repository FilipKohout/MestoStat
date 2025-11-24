using API.db.Structure;
using API.Models.Structure.Requests;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Structure;

[ApiController]
[Route("structure/municipalities")]
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
    
    [HttpGet("{municipalityId:int}")]
    public async Task<IActionResult> GetDistrict(int municipalityId)
    {
        return Ok();
    }
}