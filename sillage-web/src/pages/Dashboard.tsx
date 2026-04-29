import { useState, useEffect } from 'react'
import { getFragrances } from '../lib/api'
import FragranceCard from '../components/ui/FragranceCard'
import type { Fragrance } from '../types/fragrance'
import Layout from '../components/layout/layout'

export default function Dashboard() {
    const [fragrances, setFragrances] = useState<Fragrance[]>([])
    const [selectedFragrance, setSelectedFragrance] = useState<Fragrance | null>(null)

    const handleSelectFragrance = (fragrance: Fragrance) => {
        setSelectedFragrance(prev => prev?.id === fragrance.id ? null : fragrance)
    }

    useEffect(() => {
        const loadFragrances = async () => {
            const data = await getFragrances()
            setFragrances(data)
        }
        loadFragrances()
    }, [])

    return (
        <Layout>
            <h2 className="text-2xl font-semibold mb-6">My Collection</h2>

            {Array.from({ length: Math.ceil(fragrances.length / 4) }, (_, rowIndex) => {
                const rowFragrances = fragrances.slice(rowIndex * 4, rowIndex * 4 + 4)
                const selectedInThisRow = selectedFragrance && rowFragrances.some(f => f.id === selectedFragrance.id)

                return (
                    <div key={rowIndex}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {rowFragrances.map((fragrance) => (
                                <FragranceCard
                                    key={fragrance.id}
                                    fragrance={fragrance}
                                    onSelect={handleSelectFragrance}
                                    isSelected={selectedFragrance?.id === fragrance.id}
                                />
                            ))}
                        </div>

                        {selectedInThisRow && (
                            <div className="mb-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div>
                                        <h4 className="text-amber-500/70 uppercase tracking-widest text-xs mb-3">Main Accords</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {JSON.parse(selectedFragrance.mainAccords || '[]').map((accord: string) => (
                                                <span key={accord} className="px-3 py-1 rounded-full bg-white/10 text-white text-xs">{accord}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-amber-500/70 uppercase tracking-widest text-xs mb-3">Best Seasons</h4>
                                        <div className="flex flex-col gap-2">
                                            {JSON.parse(selectedFragrance.seasonRanking || '[]').map((s: { name: string, score: number }) => (
                                                <div key={s.name} className="flex items-center gap-3">
                                                    <span className="text-white/70 text-sm capitalize w-16">{s.name}</span>
                                                    <div className="flex-1 bg-white/10 rounded-full h-1.5">
                                                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${Math.min(s.score / 2 * 100, 100)}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-amber-500/70 uppercase tracking-widest text-xs mb-3">Best Occasions</h4>
                                        <div className="flex flex-col gap-2">
                                            {JSON.parse(selectedFragrance.occasionRanking || '[]').map((o: { name: string, score: number }) => (
                                                <div key={o.name} className="flex items-center gap-3">
                                                    <span className="text-white/70 text-sm capitalize w-24">{o.name}</span>
                                                    <div className="flex-1 bg-white/10 rounded-full h-1.5">
                                                        <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${Math.min(o.score / 2 * 100, 100)}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </Layout>
    )
}