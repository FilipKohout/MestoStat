using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace API.Controllers;

[ApiController]
[ApiExplorerSettings(IgnoreApi = true)] 
public class ErrorController : ControllerBase
{
    [Route("/error")]
    [HttpGet]
    public IActionResult HandleError()
    {
        var exception = HttpContext.Features.Get<IExceptionHandlerFeature>()?.Error;

        if (exception is NpgsqlException)
            return Problem(
                statusCode: 503,
                title: "Database unavailable",
                detail: exception.Message
            );

        if (exception is KeyNotFoundException)
            return Problem(
                statusCode: 404,
                title: "Not found",
                detail: exception.Message
            );

        return Problem(
            statusCode: 500,
            title: "Internal Server Error",
            detail: exception?.Message
        );
    }
}