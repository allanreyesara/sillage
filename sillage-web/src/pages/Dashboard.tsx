import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getFragrances } from '../lib/api'
import FragranceCard from '../components/ui/FragranceCard'
import type { Fragrance } from '../types/fragrance'

export default function Dashboard() {
    const navigate = useNavigate()
    const [fragrances, setFragrances] = useState<Fragrance[]>([])

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
                        <FragranceCard key={fragrance.id} fragrance={fragrance} />
                    ))}
                </div>
            </main>
        </div>
    )
}