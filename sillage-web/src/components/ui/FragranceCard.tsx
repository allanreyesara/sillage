import type { Fragrance } from "../../types/fragrance"

interface Props {
    fragrance: Fragrance
}

export default function FragranceCard({ fragrance }: Props) {
    return (
        <div className="relative group rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm hover:border-amber-500/30 transition-all duration-300 cursor-pointer">
            <div className="aspect-square p-6 flex items-center justify-center">
                <img
                    src={fragrance.imageUrl}
                    alt={fragrance.name}
                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => (e.currentTarget.src = '/placeholder-bottle.png')}
                />
            </div>
            <div className="p-4 border-t border-white/5">
                <p className="text-xs text-amber-500/70 uppercase tracking-widest mb-1">{fragrance.house}</p>
                <h3 className="text-white font-semibold text-sm leading-tight">{fragrance.name}</h3>
            </div>
        </div>
    )
}