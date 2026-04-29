import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getFragrances } from '../lib/api'
import FragranceCard from '../components/ui/FragranceCard'
import type { Fragrance } from '../types/fragrance'

export default function Dashboard() {
    const navigate = useNavigate()
    const [fragrances, setFragrances] = useState<Fragrance[]>([])
    const [selectedFragrance, setSelectedFragrance] = useState<Fragrance | null>(null)

    const handleSelectFragrance = (fragrance: Fragrance) => {
        setSelectedFragrance(prev => prev?.id === fragrance.id ? null : fragrance)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    useEffect(() => {
        const loadFragrances = async () => {
            const data = await getFragrances()
            setFragrances(data)
        }
        loadFragrances()
    }, [])

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex">
            {/* Animated blobs */}
            <div className="fixed top-[-10%] left-[10%] w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px] animate-blob pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[5%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] animate-blob pointer-events-none" style={{ animationDelay: '3s' }} />
            <div className="fixed top-[30%] left-[-5%] w-[400px] h-[400px] bg-rose-500/15 rounded-full blur-[100px] animate-blob pointer-events-none" style={{ animationDelay: '5s' }} />
            <div className="fixed top-[60%] right-[30%] w-[350px] h-[350px] bg-amber-600/15 rounded-full blur-[100px] animate-blob pointer-events-none" style={{ animationDelay: '2s' }} />
            <div className="fixed top-[10%] right-[20%] w-[300px] h-[300px] bg-fuchsia-500/15 rounded-full blur-[100px] animate-blob pointer-events-none" style={{ animationDelay: '4s' }} />
            {/* Sidebar */}
            <aside className="w-64 hidden lg:flex flex-col p-6 border-r border-white/5">
                <h1 className="text-2xl font-serif mb-10">Sillage</h1>
                <nav className="flex flex-col gap-2">
                    <span className="text-white px-4 py-2">Dashboard</span>
                    <span className="text-gray-500 px-4 py-2">Discover</span>
                    <span className="text-gray-500 px-4 py-2">Collection</span>
                    <span className="text-gray-500 px-4 py-2">Profile</span>
                </nav>
                <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-white px-4 py-2 mt-auto transition-colors text-left"
                >
                    Sign Out
                </button>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-8">
                <h2 className="text-2xl font-semibold mb-6">My Collection</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {fragrances.map((fragrance) => (
                        <FragranceCard key={fragrance.id} fragrance={fragrance} 
                        onSelect={handleSelectFragrance} isSelected={selectedFragrance?.id === fragrance.id}/>
                    ))}
                </div>
                {selectedFragrance && (
                    <div className="mt-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            
                            {/* Main Accords */}
                            <div>
                                <h4 className="text-amber-500/70 uppercase tracking-widest text-xs mb-3">Main Accords</h4>
                                <div className="flex flex-wrap gap-2">
                                    {JSON.parse(selectedFragrance.mainAccords || '[]').map((accord: string) => (
                                        <span key={accord} className="px-3 py-1 rounded-full bg-white/10 text-white text-xs">
                                            {accord}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Season Ranking */}
                            <div>
                                <h4 className="text-amber-500/70 uppercase tracking-widest text-xs mb-3">Best Seasons</h4>
                                <div className="flex flex-col gap-2">
                                    {JSON.parse(selectedFragrance.seasonRanking || '[]').map((s: { name: string, score: number }) => (
                                        <div key={s.name} className="flex items-center gap-3">
                                            <span className="text-white/70 text-sm capitalize w-16">{s.name}</span>
                                            <div className="flex-1 bg-white/10 rounded-full h-1.5">
                                                <div 
                                                    className="bg-amber-500 h-1.5 rounded-full" 
                                                    style={{ width: `${Math.min(s.score / 2 * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Occasion Ranking */}
                            <div>
                                <h4 className="text-amber-500/70 uppercase tracking-widest text-xs mb-3">Best Occasions</h4>
                                <div className="flex flex-col gap-2">
                                    {JSON.parse(selectedFragrance.occasionRanking || '[]').map((o: { name: string, score: number }) => (
                                        <div key={o.name} className="flex items-center gap-3">
                                            <span className="text-white/70 text-sm capitalize w-24">{o.name}</span>
                                            <div className="flex-1 bg-white/10 rounded-full h-1.5">
                                                <div 
                                                    className="bg-violet-500 h-1.5 rounded-full" 
                                                    style={{ width: `${Math.min(o.score / 2 * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}