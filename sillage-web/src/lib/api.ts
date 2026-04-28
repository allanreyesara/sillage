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

