namespace Sillage.API.Infraestructure.AI;

public interface ILLMClient
{
    Task<string> GenerateAsync(string prompt, CancellationToken ct = default);
}