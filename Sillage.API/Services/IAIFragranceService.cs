using Sillage.API.DTOs;

namespace Sillage.API.Services;

public interface IAIFragranceService
{
    Task<FragranceEnrichmentResponse> EnrichAsync(FragranceAIDTO dto);
    Task AddAIFragranceAsync(Guid userId, FragranceEnrichmentResponse dto);
    Task<SmartRecommendResponse> SmartRecommendAsync(SmartRecommendRequest dto, Guid userId);
}