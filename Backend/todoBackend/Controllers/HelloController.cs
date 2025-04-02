using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class HelloController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { Message = "Hello from the backend!" });
    }
    [HttpPost]
    public IActionResult Post([FromBody] string name)
    {
    return Ok(new { Message = $"Hello, {name}!" });
    }
}