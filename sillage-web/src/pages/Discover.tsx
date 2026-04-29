import { useState } from 'react'
import { searchFragrances, addFragranceToCollection } from '../lib/api'
import type { FragellaFragrance } from '../types/fragellaFragrance'
import Layout from '../components/layout/layout'
import toast from 'react-hot-toast'

export default function Discover() {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<FragellaFragrance[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = async () => {
        setIsLoading(true)
        setError('')
        setHasSearched(true)
        try {
            const result = await searchFragrances(searchQuery)
            setSearchResults(result)
        } catch (err) {
            setError('Failed to search fragrances. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddToCollection = async (fragrance: FragellaFragrance) => {
        try {
            await addFragranceToCollection(fragrance)
            toast.success(`${fragrance.Name} added to your collection!`)
        } catch (err) {
            toast.error('Failed to add fragrance. Please try again.')
        }
    }

    return (
        <Layout>
            <h2 className="text-2xl font-semibold mb-2">Discover</h2>
            <p className="text-gray-500 mb-6 text-sm">Search for fragrances to add to your collection</p>

            <div className="flex gap-3 mb-8">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search fragrances, brands, notes..."
                    className="flex-1 bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none focus:border-amber-500/50 transition-all"
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading || !searchQuery.trim()}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50"
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            {searchResults.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {searchResults.map((fragrance, index) => (
                        <div key={index} className="relative group rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm hover:border-amber-500/30 transition-all duration-300">
                            <div className="aspect-square p-6 flex items-center justify-center">
                                <img
                                    src={fragrance['Image URL']}
                                    alt={fragrance.Name}
                                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => (e.currentTarget.src = '/placeholder-bottle.png')}
                                />
                            </div>
                            <div className="p-4 border-t border-white/5">
                                <p className="text-xs text-amber-500/70 uppercase tracking-widest mb-1">{fragrance.Brand}</p>
                                <h3 className="text-white font-semibold text-sm leading-tight mb-3">{fragrance.Name}</h3>
                                <button
                                    onClick={() => handleAddToCollection(fragrance)}
                                    className="w-full bg-white/10 hover:bg-amber-500/20 hover:border-amber-500/50 border border-white/10 text-white text-xs py-2 rounded-lg transition-all"
                                >
                                    + Add to Collection
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {hasSearched && searchResults.length === 0 && !isLoading && (
                <p className="text-gray-600 text-center mt-12">No results found for "{searchQuery}"</p>
            )}
        </Layout>
    )
}