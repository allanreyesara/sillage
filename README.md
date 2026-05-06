# Sillage — Your Fragrance Wardrobe

> A luxury fragrance collection PWA that tells you what to wear before you even open the drawer.

![Sillage Dashboard](https://via.placeholder.com/1200x630/0a0a0f/f59e0b?text=Sillage)

---

## Overview

Sillage is a full-stack Progressive Web App that catalogs your fragrance collection, breaks down every accord and note, and recommends the right bottle for the day — based on real-time weather, occasion, and what you already own.

Built as a portfolio project to demonstrate end-to-end product thinking: from auth and data modeling to AI integration and mobile UX.

---

## Features

### Smart Recommend
Real-time weather (Open-Meteo) + occasion input → AI recommendation from your own collection. The engine analyzes season scores, occasion scores, accords, and notes to surface the most contextually appropriate fragrance.

### Smart Add with AI
Can't find a fragrance in the catalog? Type the name and brand — the AI enriches it automatically with notes, accords, season rankings, and occasion rankings in the same schema as catalog fragrances.

### Fragrance Discovery
Search thousands of fragrances powered by the Fragella API. Add to your collection in one tap with full metadata: notes pyramid, main accords with percentages, season and occasion rankings.

### Collection Management
Grid view with expandable detail panels showing main accords, best seasons and occasions with visual score bars. Full CRUD — add from catalog, add manually via AI, or remove.

### PWA — Installable
Works as a native-feeling app on iOS and Android. Installable from browser, offline-ready via service worker, portrait-optimized with a bottom navigation bar on mobile.

---

## Tech Stack

### Frontend
- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS** — utility-first styling
- **Supabase JS** — auth client with session management
- **React Router v7** — client-side routing
- **Lucide React** — icon system
- **React Hot Toast** — notifications
- **vite-plugin-pwa** — PWA manifest, service worker, install support

### Backend
- **.NET 8 Minimal APIs** — lightweight REST endpoints
- **PostgreSQL** via **Supabase** — hosted database
- **Entity Framework Core** — ORM and migrations
- **Supabase Auth** — JWT authentication with ES256/JWKS validation
- **OpenAI API** (gpt-4.1-mini) — fragrance enrichment and smart recommendations
- **Fragella API** — fragrance catalog search

### Architecture Decisions
- JWT validation uses `IssuerSigningKeyResolver` to fetch JWKS dynamically from Supabase — supports ES256 (ECC), not just HS256
- AI logic isolated in `AIFragranceService` behind `IAIFragranceService` interface — swappable LLM provider
- Prompts constructed server-side only — users send `{ name, brand }` or `{ occasion, temperature, weatherCondition, isDay }`, never raw prompt text
- Season and occasion scores use 0.0–2.0 scale consistent with Fragella — AI-enriched fragrances are comparable to catalog fragrances in the recommendation engine
- Weather data fetched client-side (Open-Meteo + Nominatim) and passed to backend — avoids redundant server-side geolocation calls

---

## Project Structure

```
sillage/
├── Sillage.API/
│   ├── Endpoints/
│   │   └── FragranceEndpoints.cs
│   ├── Infrastructure/
│   │   └── AI/
│   │       ├── ILLMClient.cs
│   │       └── OpenAiClient.cs
│   ├── Services/
│   │   ├── IAIFragranceService.cs
│   │   └── AIFragranceService.cs
│   ├── DTOs/
│   ├── Models/
│   └── Program.cs
└── sillage-web/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── layout.tsx
    │   │   │   └── BottomNav.tsx
    │   │   └── ui/
    │   │       ├── FragranceCard.tsx
    │   │       ├── AISearchModal.tsx
    │   │       └── BlobBackground.tsx
    │   ├── hooks/
    │   │   └── useWeather.ts
    │   ├── lib/
    │   │   ├── api.ts
    │   │   ├── auth.ts
    │   │   └── supabase.ts
    │   ├── pages/
    │   │   ├── Landing.tsx
    │   │   ├── Auth.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── Discover.tsx
    │   │   ├── Collection.tsx
    │   │   └── Profile.tsx
    │   └── types/
    └── public/
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- .NET 8 SDK
- PostgreSQL (via Supabase project)
- OpenAI API key
- Fragella API key

### Backend

```bash
cd Sillage.API
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "your-connection-string"
dotnet user-secrets set "Supabase:Url" "https://your-project.supabase.co"
dotnet user-secrets set "Supabase:JwtSecret" "your-jwt-secret"
dotnet user-secrets set "Fragella:ApiKey" "your-fragella-key"
dotnet user-secrets set "OpenAI:ApiKey" "sk-..."
dotnet ef database update
dotnet run
```

### Frontend

```bash
cd sillage-web
cp .env.example .env
# set VITE_API_URL and VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/fragrances` | Get user's collection |
| POST | `/fragrances/fragella` | Add fragrance from Fragella catalog |
| POST | `/fragrances/ai-search` | Enrich fragrance with AI |
| POST | `/fragrances/ai/add` | Save AI-enriched fragrance |
| POST | `/fragrances/smart-recommend` | Get weather+occasion recommendation |
| GET | `/fragrances/search` | Search Fragella catalog |
| DELETE | `/fragrances/{id}` | Remove from collection |

All endpoints require a valid Supabase JWT Bearer token.

---

## Environment Variables

### Backend (User Secrets)
```
ConnectionStrings:DefaultConnection
Supabase:Url
Supabase:JwtSecret
Fragella:ApiKey
OpenAI:ApiKey
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5190
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Author

**Allan Araya Reyes**  
Full Stack Developer — Costa Rica  
[GitHub](https://github.com/allanreyesara) · [LinkedIn](https://linkedin.com/in/allanreyesara)
