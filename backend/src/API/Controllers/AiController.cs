using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;

namespace AgriEcommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly IAiServiceClient _aiClient;

        public AiController(IAiServiceClient aiClient)
        {
            _aiClient = aiClient;
        }

        public record CropRecommendRequest(
            string SoilType,
            double Temperature,
            double Humidity,
            double Rainfall,
            double Nitrogen,
            double Phosphorus,
            double Potassium);

        public record PricingRequest(
            string ProductName,
            double BasePrice,
            string Category,
            int StockQuantity,
            string Season,
            double DemandIndex);

        public record DiseaseRequest(string ImageUrl, string CropType);

        [HttpPost("crop-recommendation")]
        public async Task<IActionResult> GetCropRecommendation([FromBody] CropRecommendRequest request)
        {
            try
            {
                var result = await _aiClient.GetCropRecommendationAsync(new
                {
                    soil_type = request.SoilType,
                    temperature = request.Temperature,
                    humidity = request.Humidity,
                    rainfall = request.Rainfall,
                    nitrogen = request.Nitrogen,
                    phosphorus = request.Phosphorus,
                    potassium = request.Potassium
                });
                return Content(result, "application/json");
            }
            catch
            {
                return StatusCode(503, new { message = "AI service is currently unavailable." });
            }
        }

        [HttpPost("pricing-suggestion")]
        public async Task<IActionResult> GetPricingSuggestion([FromBody] PricingRequest request)
        {
            try
            {
                var result = await _aiClient.GetPricingSuggestionAsync(new
                {
                    product_name = request.ProductName,
                    base_price = request.BasePrice,
                    category = request.Category,
                    stock_quantity = request.StockQuantity,
                    season = request.Season,
                    demand_index = request.DemandIndex
                });
                return Content(result, "application/json");
            }
            catch
            {
                return StatusCode(503, new { message = "AI service is currently unavailable." });
            }
        }

        [HttpPost("disease-detection")]
        public async Task<IActionResult> DetectDisease([FromBody] DiseaseRequest request)
        {
            try
            {
                var result = await _aiClient.GetDiseaseDetectionAsync(new
                {
                    image_url = request.ImageUrl,
                    crop_type = request.CropType
                });
                return Content(result, "application/json");
            }
            catch
            {
                return StatusCode(503, new { message = "AI service is currently unavailable." });
            }
        }
    }
}
