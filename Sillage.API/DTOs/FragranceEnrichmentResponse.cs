namespace Sillage.API.DTOs;

public record FragranceEnrichmentResponse(
    string Name,
    string Brand,
    string Gender,
    string OilType,
    List<string> GeneralNotes,
    List<string> MainAccords
);