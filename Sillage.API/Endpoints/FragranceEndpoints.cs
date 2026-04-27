using Sillage.API.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace Sillage.API.Endpoints;

public static class FragranceEndpoints
{
    public static void MapFragranceEndpoints(this WebApplication app)
    {
        app.MapGet("/FragranceEndpoints", async (AppDbContext db, ClaimsPrincipal user) =>
        {
            var userId = Guid.Parse(user.FindFirst("sub")?.Value!);
            var fragrances = await db.Fragrances.Where(f => f.UserId == userId).ToListAsync();
            return Results.Ok(fragrances);
        }).RequireAuthorization();
    }
}