import { useState } from "react";
import { addAIFragranceToCollection, AISearchFragrances } from "../../lib/api";
import type { FragranceEnrichmentResponse } from "../../types/FragranceEnrichmentResponse";
import { toast } from "react-hot-toast/headless";

interface AISearchModalProps {
    onClose: () => void;
    onAdded?: () => void;  
}

export default function AISearchModal({ onClose, onAdded }: AISearchModalProps) {
    const [response, setResponse] = useState<FragranceEnrichmentResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await AISearchFragrances(name, brand);
            setResponse(data);

        } catch (error) {
            console.error("Error during AI search:", error);
            setResponse(null);
        } finally {
            setLoading(false);
        }
    }

    const handleAddToCollection = async (fragrance: FragranceEnrichmentResponse) => {
        try {
            await addAIFragranceToCollection(fragrance)
            toast.success(`${fragrance.name} added to your collection!`)
            onAdded?.()
            onClose()
        } catch (err) {
            toast.error('Failed to add fragrance. Please try again.')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-2xl p-6">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white font-semibold text-lg">Add with AI</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
                </div>

                {/* Search state */}
                {!response && (
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Fragrance name"
                            className="bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none focus:border-amber-500/50 transition-all"
                        />
                        <input
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            placeholder="Brand"
                            className="bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none focus:border-amber-500/50 transition-all"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading || !name.trim() || !brand.trim()}
                            className="bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
                        >
                            {loading ? 'Searching...' : 'Search with AI'}
                        </button>
                    </div>
                )}

                {/* Result state */}
                {response && (
                    <div className="flex flex-col gap-4">
                        <p className="text-xs text-amber-500/70 uppercase tracking-widest">Review and edit</p>
                        {[
                            { label: 'Name', key: 'name' },
                            { label: 'Brand', key: 'brand' },
                            { label: 'Gender', key: 'gender' },
                            { label: 'Oil Type', key: 'oilType' },
                            { label: 'Description', key: 'description' },
                        ].map(({ label, key }) => (
                            <div key={key}>
                                <p className="text-xs text-gray-500 mb-1">{label}</p>
                                {key === 'description' ? (
                                    <textarea
                                        value={response[key as keyof FragranceEnrichmentResponse] as string}
                                        onChange={(e) => setResponse({ ...response, [key]: e.target.value })}
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-500/50 transition-all resize-none"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={response[key as keyof FragranceEnrichmentResponse] as string}
                                        onChange={(e) => setResponse({ ...response, [key]: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-500/50 transition-all"
                                    />
                                )}
                            </div>
                        ))}

                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={() => setResponse(null)}
                                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm py-3 rounded-xl transition-all"
                            >
                                Search again
                            </button>
                            <button
                                onClick={() => handleAddToCollection(response)}
                                className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm py-3 rounded-xl transition-all"
                            >
                                Add to Collection
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}