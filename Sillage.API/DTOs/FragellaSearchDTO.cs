public record FragellaFragranceDto(
    string Name,
    string Brand,
    string Gender,
    string OilType,
    string ImageUrl,
    List<string> GeneralNotes,
    List<string> MainAccords,
    Dictionary<string, string> MainAccordsPercentage,
    List<SeasonRankingDto> SeasonRanking,
    List<OccasionRankingDto> OccasionRanking,
    FragellaNotesDto Notes
);

public record SeasonRankingDto(string Name, double Score);
public record OccasionRankingDto(string Name, double Score);

public record FragellaNotesDto(
    List<FragellaNoteDto> Top,
    List<FragellaNoteDto> Middle,
    List<FragellaNoteDto> Base
);

public record FragellaNoteDto(string Name, string ImageUrl);