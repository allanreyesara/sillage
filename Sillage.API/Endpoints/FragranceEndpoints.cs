using Sillage.API.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Sillage.API.Infraestructure.AI;
using Sillage.API.Models;


using Sillage.API.DTOs;

namespace Sillage.API.Endpoints;

public static class FragranceEndpoints
{
    public static void MapFragranceEndpoints(this WebApplication app)
    {
        app.MapGet("/fragrances", async (AppDbContext db, ClaimsPrincipal user) =>
        {
            var claims = user.Claims.Select(c => $"{c.Type}: {c.Value}");
            Console.WriteLine(string.Join("\n", claims));
            var userId = Guid.Parse(user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
            var fragrances = await db.Fragrances.Where(f => f.UserId == userId).ToListAsync();
            return Results.Ok(fragrances);
        }).RequireAuthorization();

        app.MapPost("/fragrances", async (AppDbContext db, ClaimsPrincipal user, CreateFragranceDto dto) =>
        {
            var userId = Guid.Parse(user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
            var fragrance = new Models.Fragrance
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = dto.Name,
                House = dto.House,
                Concentration = dto.Concentration,
                DateAdded = DateTime.UtcNow
            };

            db.Fragrances.Add(fragrance);
            await db.SaveChangesAsync();

            return Results.Created($"/fragrances/{fragrance.Id}", fragrance);
        }).RequireAuthorization();

        app.MapGet("/fragrances/{id}", async (AppDbContext db, ClaimsPrincipal user, Guid id) =>
        {
            var userId = Guid.Parse(user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
            var fragrance = await db.Fragrances.FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);

            if (fragrance == null)
                return Results.NotFound();

            return Results.Ok(fragrance);
        }).RequireAuthorization();

        app.MapPut("/fragrances/{id}", async (AppDbContext db, ClaimsPrincipal user, Guid id, CreateFragranceDto dto) =>
        {
            var userId = Guid.Parse(user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
            var fragrance = await db.Fragrances.FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);

            if (fragrance == null)
                return Results.NotFound();

            fragrance.Name = dto.Name;
            fragrance.House = dto.House;
            fragrance.Concentration = dto.Concentration;

            await db.SaveChangesAsync();
            return Results.Ok(fragrance);
        }).RequireAuthorization();

        app.MapDelete("/fragrances/{id}", async (AppDbContext db, ClaimsPrincipal user, Guid id) =>
        {
            var userId = Guid.Parse(user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
            var fragrance = await db.Fragrances.FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);

            if (fragrance == null)
            {
                return Results.NotFound();
            }
            db.Fragrances.Remove(fragrance);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }).RequireAuthorization();

        app.MapGet("fragrances/search", async (IHttpClientFactory httpClientFactory, ClaimsPrincipal user, string query) =>
        {
            var client = httpClientFactory.CreateClient("Fragella");
            var response = await client.GetAsync($"/api/v1/fragrances?search={Uri.EscapeDataString(query)}");

            if (!response.IsSuccessStatusCode)
            {
                return Results.Problem("Error fetching data from Fragella API");
            }

            var fragrances = await response.Content.ReadFromJsonAsync<List<FragellaFragranceDto>>();
            return Results.Ok(fragrances);
        }).RequireAuthorization();

        app.MapPost("/fragrances/fragella", async (AppDbContext db, ClaimsPrincipal user, AddFragellaFragranceDto dto) =>
        {
            var userId = Guid.Parse(user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
            var fragrance = new Models.Fragrance
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = dto.Name,
                House = dto.House,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                GeneralNotes = dto.GeneralNotes,
                MainAccords = dto.MainAccords,
                MainAccordsPercentage = dto.MainAccordsPercentage,
                SeasonRanking = dto.SeasonRanking,
                OccasionRanking = dto.OccasionRanking,
                Notes = dto.Notes,
                Gender = dto.Gender,
                Concentration = dto.Concentration,
                DateAdded = DateTime.UtcNow,
                IsManual = false
            };

            db.Fragrances.Add(fragrance);
            await db.SaveChangesAsync();

            return Results.Created($"/fragrances/{fragrance.Id}", fragrance);
        }).RequireAuthorization();

        app.MapPost("/fragrances/ai/add", async (AppDbContext db, ClaimsPrincipal user, FragranceEnrichmentResponse dto) =>
        {
            var userId = Guid.Parse(user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
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
                SeasonRanking = "",
                OccasionRanking = "",
                Notes = "",
                ImageUrl = null,
                DateAdded = DateTime.UtcNow,
                IsManual = true,
            };

            db.Fragrances.Add(fragrance);
            await db.SaveChangesAsync();

            return Results.Created($"/fragrances/{fragrance.Id}", fragrance);
        }).RequireAuthorization();

        app.MapPost("/fragrances/ai-search", async (ILLMClient llmClient, ClaimsPrincipal user, FragranceAIDTO dto) =>
        {
            Console.WriteLine($"DTO received: {dto.Name} / {dto.Brand}");

            var prompt = 
                $"Research the fragrance \"{dto.Name}\" by \"{dto.Brand}\" and return the following details in JSON format:\n" +
                "{\n" +
                "  \"Name\": \"string\",\n" +
                "  \"Brand\": \"string\",\n" +
                "\"Gender\": \"string (Unisex, Masculine, or Feminine)\",\n" +
                "\"OilType\": \"string (EauDeParfum, EauDeToilette, EauDeCologne, or Parfum)\",\n" +
                "  \"GeneralNotes\": [\"string\"],\n" +
                "  \"MainAccords\": [\"string\"]\n" +
                "  \"Description\": \"string\"\n" +
                "}\n" +
                "If you are not confident about any field, return an empty string or empty array.\n" +
                "Do not invent information.";
            var aiResponse = await llmClient.GenerateAsync(prompt);
            Console.WriteLine("AI RAW RESPONSE: " + aiResponse);


            try
            {
                var fragrances = JsonSerializer.Deserialize<FragranceEnrichmentResponse>(aiResponse);
                return Results.Ok(fragrances);
            }
            catch (JsonException)
            {
                Console.WriteLine("AI RAW RESPONSE: " + aiResponse);

                return Results.Problem("Failed to parse AI response");
            }
        }).RequireAuthorization();
    }


}