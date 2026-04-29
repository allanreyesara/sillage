export type FragellaFragrance = {
    Name: string
    Brand: string
    Gender: string
    OilType: string
    'Image URL': string
    'General Notes': string[]
    'Main Accords': string[]
    'Main Accords Percentage': Record<string, string>
    'Season Ranking': { name: string; score: number }[]
    'Occasion Ranking': { name: string; score: number }[]
    Notes: {
        Top: { name: string; imageUrl: string }[]
        Middle: { name: string; imageUrl: string }[]
        Base: { name: string; imageUrl: string }[]
    }
}