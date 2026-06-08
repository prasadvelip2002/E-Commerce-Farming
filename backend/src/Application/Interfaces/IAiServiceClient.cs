using System.Threading.Tasks;

namespace AgriEcommerce.Application.Interfaces
{
    public interface IAiServiceClient
    {
        Task<string> GetCropRecommendationAsync(object request);
        Task<string> GetPricingSuggestionAsync(object request);
        Task<string> GetDiseaseDetectionAsync(object request);
    }
}
