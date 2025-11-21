using API.Models.Structure.Requests;
using Microsoft.AspNetCore.Mvc;
using API.Services;

namespace API.Structure;

[ApiController]
[Route("structure/municipalities")]
public class MunicipalitiesController : ControllerBase
{
    private readonly MunicipalityService _service;

    public MunicipalitiesController(MunicipalityService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _service.GetAllAsync();
        
        return Ok(
            new GetMunicipalitiesResponse(data)
        );
    }
}