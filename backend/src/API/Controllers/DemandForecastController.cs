using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Net.Http;

namespace AgriEcommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DemandForecastController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetDemandForecast([FromQuery] string region = "all", [FromQuery] string crop = "all")
        {
            try
            {
                using var client = new HttpClient();
                var response = await client.GetAsync($"http://localhost:8000/demand/forecast?region={region}&crop={crop}");
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return Content(content, "application/json");
                }
                return BadRequest(new { message = "Failed to fetch demand forecast from AI service." });
            }
            catch
            {
                return StatusCode(503, new { message = "AI service is currently unavailable." });
            }
        }
    }
}
