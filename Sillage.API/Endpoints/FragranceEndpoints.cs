using Sillage.API.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Sillage.API.Models;

using Sillage.API.DTOs;

namespace Sillage.API.Endpoints;


public static class FragranceEndpoints
{
    public static void MapFragranceEndpoints(this WebApplication app)
    {
        app.MapGet("/fragrances", async (AppDbContext db, ClaimsPrincipal user) =>
        {
            var userId = Guid.Parse(user.FindFirst("sub")?.Value!);
            var fragrances = await db.Fragrances.Where(f => f.UserId == userId).ToListAsync();
            return Results.Ok(fragrances);
        }).RequireAuthorization();

        app.MapPost("/fragrances", async (AppDbContext db, ClaimsPrincipal user, CreateFragranceDto dto) =>
        {
            var userId = Guid.Parse(user.FindFirst("sub")?.Value!);
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
            var userId = Guid.Parse(user.FindFirst("sub")?.Value!);
            var fragrance = await db.Fragrances.FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);

            if (fragrance == null)
                return Results.NotFound();

            return Results.Ok(fragrance);
        }).RequireAuthorization();

        app.MapPut("/fragrances/{id}", async (AppDbContext db, ClaimsPrincipal user, Guid id, CreateFragranceDto dto) =>
        {
            var userId = Guid.Parse(user.FindFirst("sub")?.Value!);
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
            var userId = Guid.Parse(user.FindFirst("sub")?.Value!);
            var fragrance = await db.Fragrances.FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);

            if (fragrance == null)
            {
                return Results.NotFound();
            }
            db.Fragrances.Remove(fragrance);
            await db.SaveChangesAsync();
            return Results.NoContent();
        }).RequireAuthorization();
    }
}