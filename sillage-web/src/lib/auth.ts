import { supabase } from './supabase'

export async function getAuthHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession()
    return {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
    }
}