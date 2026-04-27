using Sillage.API.Models;

namespace Sillage.API.DTOs;

public record AddFragellaFragranceDto(
    string Name,
    string House,
    string? Description,
    string? ImageUrl,
    string? GeneralNotes,
    string? MainAccords,
    string? MainAccordsPercentage,
    string? SeasonRanking,
    string? OccasionRanking,
    string? Notes,
    Gender Gender,
    Concentration Concentration
);