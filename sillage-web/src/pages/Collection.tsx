import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFragrances } from '../lib/api'
import FragranceCard from '../components/ui/FragranceCard'
import type { Fragrance } from '../types/fragrance'
import Layout from '../components/layout/layout'

export default function Collection() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [fragrances, setFragrances] = useState<Fragrance[]>([])
    const [selectedFragrance, setSelectedFragrance] = useState<Fragrance | null>(null)

    const handleSelectFragrance = (fragrance: Fragrance) => {
        setSelectedFragrance(prev => prev?.id === fragrance.id ? null : fragrance)
    }

    useEffect(() => {
        const loadFragrances = async () => {
            const data = await getFragrances()
            setLoading(false)
            setFragrances(data)   
        }
        loadFragrances()
    }, [])

    const items = [...fragrances, null]
    const rows = Array.from({ length: Math.ceil(items.length / 4) }, (_, i) =>
        items.slice(i * 4, i * 4 + 4)
    )

    if (loading) {
        return (
          <Layout>
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
            </div>
          </Layout>
        )
      }

    return (
        <Layout>
            <h2 className="text-2xl font-semibold mb-6">My Collection</h2>

            {rows.map((rowItems, rowIndex) => {
                const rowFragrances = rowItems.filter(Boolean) as Fragrance[]
                const selectedInThisRow = selectedFragrance && rowFragrances.some(f => f.id === selectedFragrance.id)

                return (
                    <div key={rowIndex}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {rowItems.map((item, i) =>
                                item === null ? (
                                    // - Add fragrance card -
                                    <div
                                        key="add"
                                        onClick={() => navigate('/discover')}
                                        className="relative rounded-2xl overflow-hidden border border-dashed border-white/20 backdrop-blur-sm hover:border-amber-500/40 hover:bg-white/5 transition-all duration-300 cursor-pointer flex flex-col"
                                    >
                                        <div className="aspect-square flex flex-col items-center justify-center gap-3 p-6">
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl text-amber-500/70"
                                                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.20)' }}
                                            >
                                                +
                                            </div>
                                            <p className="text-sm text-white/40 text-center leading-tight">
                                                Add a fragrance
                                            </p>
                                        </div>
                                        <div className="p-4 border-t border-white/5">
                                            <p className="text-xs text-white/20 uppercase tracking-widest">Discover</p>
                                        </div>
                                    </div>
                                ) : (
                                    <FragranceCard
                                        key={item.id}
                                        fragrance={item}
                                        onSelect={handleSelectFragrance}
                                        isSelected={selectedFragrance?.id === item.id}
                                    />
                                )
                            )}
                        </div>

                        {selectedInThisRow && selectedFragrance && (
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