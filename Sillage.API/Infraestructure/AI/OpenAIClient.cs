using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Sillage.API.Infraestructure.AI;

public sealed class OpenAIClient : ILLMClient
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public OpenAIClient(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _config = configuration;
    }
    
    public async Task<string> GenerateAsync(string prompt, CancellationToken ct = default)
    {
        var apiKey = _config["OpenAI:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))        {
            throw new InvalidOperationException("OpenAI API key is not configured.");
        }

        var req = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var requestBody = new
        {
            model = "gpt-4.1-mini",
            messages = new object[]
            {
                new 
                { 
                    role = "system", 
                    content = "You are a strict JSON generator. Output ONLY valid raw JSON. No markdown. No code fences. No extra text." 
                },
                new {role = "user", content = prompt }
            },
            response_format = new { type = "json_object" },
            max_tokens = 800,
            temperature = 0.1
        };
        req.Content = new StringContent(
            JsonSerializer.Serialize(requestBody), 
            Encoding.UTF8, 
            "application/json"
            );

        var res = await _httpClient.SendAsync(req, ct);
        var payload = await res.Content.ReadAsStringAsync(ct);

        if (!res.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"OpenAI API error: {res.StatusCode} - {payload}");
        }

        using var doc = JsonDocument.Parse(payload);
        var content = doc.RootElement
        .GetProperty("choices")[0]
        .GetProperty("message")
        .GetProperty("content")
        .GetString();

        return content ?? "";
    }
}   