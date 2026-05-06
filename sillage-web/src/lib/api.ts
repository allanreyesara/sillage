import type { FragellaFragrance } from "../types/fragellaFragrance"
import type { FragranceEnrichmentResponse } from "../types/FragranceEnrichmentResponse"
import { getAuthHeaders } from "./auth"

export async function getFragrances(){

    const headers = await getAuthHeaders()
    const response = await fetch(`${import.meta.env.VITE_API_URL}/fragrances`, {
        headers: headers,
    })

    return response.json()
    
}

export async function getRecommendation(occasion: string, temperature: number, weatherCondition: string, isDay: boolean) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${import.meta.env.VITE_API_URL}/fragrances/smart-recommend`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            occasion,
            temperature,
            weatherCondition,
            isDay
        }),
    })
    return response.json()
}

export async function AISearchFragrances(Name: string, Brand: string) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${import.meta.env.VITE_API_URL}/fragrances/ai-search`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ Name, Brand }),
    })
    return response.json()
}

export async function searchFragrances(query: string) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${import.meta.env.VITE_API_URL}/fragrances/search?query=${encodeURIComponent(query)}`, {
        headers,
    })
    return response.json()
}

export async function addAIFragranceToCollection(fragrance: FragranceEnrichmentResponse) {
    const headers = await getAuthHeaders()

    const response = await fetch(`${import.meta.env.VITE_API_URL}/fragrances/ai/add`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(fragrance),
    })

    return response.json()
}

export async function deleteFragranceFromCollection(fragranceId: string) {
    const headers = await getAuthHeaders()

    await fetch(`${import.meta.env.VITE_API_URL}/fragrances/${fragranceId}`, {
        headers: headers,
        method: 'DELETE',
    })
}

export async function addFragranceToCollection(fragrance: FragellaFragrance) {
    const headers = await getAuthHeaders()

    const mapped = {
        name: fragrance.Name,
        house: fragrance.Brand,
        imageUrl: fragrance['Image URL'],
        generalNotes: JSON.stringify(fragrance['General Notes']),
        mainAccords: JSON.stringify(fragrance['Main Accords']),
        mainAccordsPercentage: JSON.stringify(fragrance['Main Accords Percentage']),
        seasonRanking: JSON.stringify(fragrance['Season Ranking']),
        occasionRanking: JSON.stringify(fragrance['Occasion Ranking']),
        notes: JSON.stringify(fragrance.Notes),
        genre: 0,
        concentration: 0
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/fragrances/fragella`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify( mapped ),
    })

    return response.json()          
}

