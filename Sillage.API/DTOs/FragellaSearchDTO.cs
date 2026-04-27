using System.Text.Json.Serialization;

namespace Sillage.API.DTOs;

public record FragellaFragranceDto(
    [property: JsonPropertyName("Name")] string Name,
    [property: JsonPropertyName("Brand")] string Brand,
    [property: JsonPropertyName("Gender")] string Gender,
    [property: JsonPropertyName("OilType")] string OilType,
    [property: JsonPropertyName("Image URL")] string ImageUrl,
    [property: JsonPropertyName("General Notes")] List<string> GeneralNotes,
    [property: JsonPropertyName("Main Accords")] List<string> MainAccords,
    [property: JsonPropertyName("Main Accords Percentage")] Dictionary<string, string> MainAccordsPercentage,
    [property: JsonPropertyName("Season Ranking")] List<SeasonRankingDto> SeasonRanking,
    [property: JsonPropertyName("Occasion Ranking")] List<OccasionRankingDto> OccasionRanking,
    [property: JsonPropertyName("Notes")] FragellaNotesDto Notes
);

public record SeasonRankingDto(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("score")] double Score
);

public record OccasionRankingDto(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("score")] double Score
);

public record FragellaNotesDto(
    [property: JsonPropertyName("Top")] List<FragellaNoteDto> Top,
    [property: JsonPropertyName("Middle")] List<FragellaNoteDto> Middle,
    [property: JsonPropertyName("Base")] List<FragellaNoteDto> Base
);

public record FragellaNoteDto(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("imageUrl")] string ImageUrl
);