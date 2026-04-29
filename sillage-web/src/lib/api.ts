import type { FragellaFragrance } from "../types/fragellaFragrance"
import { supabase } from "./supabase"

export async function getFragrances(){

    const { data: { session }} = await supabase.auth.getSession()
    const token = session?.access_token

    const response = await fetch(`${import.meta.env.VITE_API_URL}/fragrances`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return response.json()
    
}

export async function searchFragrances(query: string){ {
    const { data: { session }} = await supabase.auth.getSession()
    const token = session?.access_token

    const response = await fetch(`${import.meta.env.VITE_API_URL}/fragrances/search?query=${encodeURIComponent(query)}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    
    return response.json()
}}

export async function addFragranceToCollection(fragrance: FragellaFragrance) {
    const { data: {session }} = await supabase.auth.getSession()    
    const token = session?.access_token

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
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        method: 'POST',
        body: JSON.stringify( mapped ),
    })

    return response.json()          
}

