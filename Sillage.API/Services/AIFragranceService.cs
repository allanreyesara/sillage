using Sillage.API.Data;
using Sillage.API.DTOs;
using Sillage.API.Infraestructure.AI;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Sillage.API.Models;



namespace Sillage.API.Services;
public class AIFragranceService : IAIFragranceService
{
    private readonly AppDbContext _db;
    private readonly ILLMClient _llmClient;

    public AIFragranceService(AppDbContext db, ILLMClient llmClient)
    {
        _db = db;
        _llmClient = llmClient;
    }

    public async Task<FragranceEnrichmentResponse> EnrichAsync(FragranceAIDTO dto)
    {
        var prompt =
            $"Research the fragrance \"{dto.Name}\" by \"{dto.Brand}\" and return the following details in JSON format:\n" +
            "{\n" +
            "  \"Name\": \"string\",\n" +
            "  \"Brand\": \"string\",\n" +
            "  \"Gender\": \"string (Unisex, Masculine, or Feminine)\",\n" +
            "  \"OilType\": \"string (EauDeParfum, EauDeToilette, EauDeCologne, or Parfum)\",\n" +
            "  \"GeneralNotes\": [\"string\"],\n" +
            "  \"MainAccords\": [\"string\"],\n" +
            "  \"Description\": \"string\",\n" +
            "  \"SeasonRanking\": [{\"name\": \"string\", \"score\": number}],\n" +
            "  \"OccasionRanking\": [{\"name\": \"string\", \"score\": number}]\n" +
            "}\n" +
            "For SeasonRanking use exactly these names: spring, summer, fall, winter. Score range is 0.0 to 2.0.\n" +
            "For OccasionRanking use exactly these names: daily, night out, business, sport, leisure, evening. Score range is 0.0 to 2.0.\n" +
            "Analyze the fragrance profile and assign scores based on its notes and accords.\n" +
            "If you are not confident about any field, return an empty string or empty array.\n" +
            "Do not invent information.";
        var aiResponse = await _llmClient.GenerateAsync(prompt);
        try
        {
            var fragranceData = JsonSerializer.Deserialize<FragranceEnrichmentResponse>(aiResponse);
            return fragranceData ?? throw new InvalidOperationException("AI response was null or empty");
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException("Failed to parse AI response", ex);
        }
    }

    public async Task<SmartRecommendResponse> SmartRecommendAsync(SmartRecommendRequest dto, Guid userId)
    {
        var userFragrances = await _db.Fragrances.Where(f => f.UserId == userId).ToListAsync();
        if(!userFragrances.Any())
        {
            throw new InvalidOperationException("User has no fragrances in their collection");
        }
        var fragranceList = string.Join("\n", userFragrances.Select(f => $"- {f.Name} by {f.House} : {f.Description}. Notes: {f.GeneralNotes}. Accords: {f.MainAccords}. SeasonRanking: {f.SeasonRanking}. OccasionRanking: {f.OccasionRanking}"));
        
        var prompt = $"You are a fragrance expert. Based on the user's current conditions and their collection, recommend the TOP 3 fragrances.\n" +
            $"Current conditions:\n" +
            $"- Occasion: {dto.Occasion}\n" +
            $"- Temperature: {dto.Temperature}°C\n" +
            $"- Weather: {dto.WeatherCondition}\n" +
            $"- Time of day: {(dto.IsDay ? "daytime" : "nighttime")}\n\n" +
            $"User's collection:\n{fragranceList}\n\n" +
            "You MUST recommend only fragrances from the list above. Do not invent fragrances.\n" +
            "Prioritize season scores and occasion scores when making your decision.\n" +
            "Return ONLY this JSON:\n" +
            "{\n" +
            "  \"TopFragranceName\": \"exact name of the #1 recommendation from the list\",\n" +
            "  \"Reason\": \"2-3 sentence explanation mentioning the conditions and why this fragrance fits best\",\n" +
            "  \"OtherSuggestions\": [\"exact name of #2 from the list\", \"exact name of #3 from the list\"]\n" +
            "}";
        var aiResponse = await _llmClient.GenerateAsync(prompt);
        try
        {
            var recommendation = JsonSerializer.Deserialize<SmartRecommendResponse>(aiResponse);
            if (recommendation == null || string.IsNullOrEmpty(recommendation.TopFragranceName))
            {
                throw new InvalidOperationException("AI did not return a valid recommendation");
            }
            return recommendation;
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException("Failed to parse AI response for recommendation", ex);
        }
    }

    public async Task AddAIFragranceAsync(Guid userId, FragranceEnrichmentResponse dto)
    {
        var fragrance = new Models.Fragrance
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = dto.Name,
            House = dto.Brand,
            Description = dto.Description,
            Gender = Enum.Parse<Gender>(dto.Gender, ignoreCase: true),
            Concentration = Enum.Parse<Concentration>(dto.OilType, ignoreCase: true),
            GeneralNotes = JsonSerializer.Serialize(dto.GeneralNotes),
            MainAccords = JsonSerializer.Serialize(dto.MainAccords),
            MainAccordsPercentage = "",
            SeasonRanking = JsonSerializer.Serialize(dto.SeasonRanking),
            OccasionRanking = JsonSerializer.Serialize(dto.OccasionRanking),
            Notes = "",
            ImageUrl = null,
            DateAdded = DateTime.UtcNow,
            IsManual = true,
        };

        _db.Fragrances.Add(fragrance);
        await _db.SaveChangesAsync();
    }
}