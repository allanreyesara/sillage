using Sillage.API.Models;
 
namespace Sillage.API.DTOs;

public record CreateFragranceDto(
    string Name,
    string House,
    Concentration Concentration
);