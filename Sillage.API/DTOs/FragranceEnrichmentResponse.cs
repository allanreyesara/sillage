using Sillage.API.Models;

namespace Sillage.API.DTOs;

public record FragranceEnrichmentResponse(
    string Name,
    string Brand,
    string Gender,
    string OilType,
    List<string> GeneralNotes,
    string Description,
    List<string> MainAccords,
    List<SeasonRankingDto> SeasonRanking,
    List<OccasionRankingDto> OccasionRanking
);