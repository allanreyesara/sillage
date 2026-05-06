export type FragranceEnrichmentResponse = {
    name: string
    brand: string
    gender: string
    oilType: string
    description: string
    generalNotes: string[]
    mainAccords: string[]
    seasonRanking: { name: string; score: number }[]
    occasionRanking: { name: string; score: number }[]
}