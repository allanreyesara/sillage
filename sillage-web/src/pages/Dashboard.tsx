import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getFragrances } from '../lib/api'

export default function Dashboard() {
    const [fragrances, setFragrances] = useState([])
    
    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = '/auth'
    }

    useEffect(() => {
        const loadFragrances = async () => {
            const data = await getFragrances()
            console.log('Fragrances:', data)
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
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6">
                <p className="text-gray-500">Dashboard coming soon</p>
                <ul>
                    {fragrances.map((fragrance: any) => (
                        <li key={fragrance.id}>{fragrance.name}</li>
                    ))}
                </ul>
            </main>

            <button 
            onClick={handleLogout}
            className="text-gray-500 hover:text-white px-4 py-2 mt-auto transition-colors"
            >
                Sign Out
            </button>
        </div>

        
    )
}