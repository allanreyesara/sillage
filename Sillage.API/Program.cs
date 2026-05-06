using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Sillage.API.Data;
using Microsoft.IdentityModel.Tokens;
using System.Text;

using Sillage.API.Endpoints;
using Sillage.API.Infraestructure.AI;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Auth
var jwtSecret = builder.Configuration["Supabase:JwtSecret"]!;
var supabaseUrl = builder.Configuration["Supabase:Url"]!;

// AI
builder.Services.AddHttpClient<ILLMClient, OpenAIClient>();



// CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy( "AllowFrontend" ,policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {

        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            ValidIssuer = $"{supabaseUrl}/auth/v1",
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            IssuerSigningKeyResolver = (token, securityToken, kid, parameters) =>
            {
                var client = new HttpClient();
                var json = client.GetStringAsync($"{supabaseUrl}/auth/v1/.well-known/jwks.json").Result;
                var keys = new Microsoft.IdentityModel.Tokens.JsonWebKeySet(json);
                return keys.GetSigningKeys();
            }
        };
    });

builder.Services.AddAuthorization();

// HTTPFactory
builder.Services.AddHttpClient("Fragella", client =>
{
    client.BaseAddress = new Uri("https://api.fragella.com");
    client.DefaultRequestHeaders.Add("x-api-key", builder.Configuration["Fragella:ApiKey"]);
});

//DB
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

//Force JWKS download on startup



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

//Endpoints
app.MapFragranceEndpoints();

    
app.Run();
