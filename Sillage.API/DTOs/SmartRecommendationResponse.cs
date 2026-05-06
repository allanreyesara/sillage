public record SmartRecommendResponse(
    string TopFragranceName,
    string Reason,
    List<string> OtherSuggestions
);