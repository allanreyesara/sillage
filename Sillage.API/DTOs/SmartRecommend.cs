namespace Sillage.API.DTOs;

public record SmartRecommendRequest(
    string Occasion,
    double Temperature,
    string WeatherCondition,
    bool IsDay
);