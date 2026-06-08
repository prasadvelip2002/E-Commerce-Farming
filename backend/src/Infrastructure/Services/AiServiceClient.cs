using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;

namespace AgriEcommerce.Infrastructure.Services
{
    public class AiServiceClient : IAiServiceClient
    {
        private readonly HttpClient _httpClient;
        private static readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };

        public AiServiceClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> GetCropRecommendationAsync(object request)
        {
            var response = await _httpClient.PostAsJsonAsync("/crop/recommend", request, _jsonOptions);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> GetPricingSuggestionAsync(object request)
        {
            var response = await _httpClient.PostAsJsonAsync("/pricing/suggest", request, _jsonOptions);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> GetDiseaseDetectionAsync(object request)
        {
            var response = await _httpClient.PostAsJsonAsync("/disease/detect", request, _jsonOptions);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
    }
}
