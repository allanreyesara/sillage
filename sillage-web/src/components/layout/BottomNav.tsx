import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Search, BookMarked, User } from 'lucide-react'

const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Discover', path: '/discover', icon: Search },
    { label: 'Collection', path: '/collection', icon: BookMarked },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Quiniela', path: '/quiniela', icon: BookMarked },
]

export default function BottomNav() {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-20 lg:hidden flex items-center justify-around px-2 py-2 backdrop-blur-md"
            style={{ background: 'rgba(10,10,15,0.85)', borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
            {navItems.map(({ label, path, icon: Icon }) => {
                const active = location.pathname === path
                return (
                    <button
                        key={path}
                        onClick={() => navigate(path)}
                        className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all"
                        style={{ color: active ? '#f59e0b' : '#6b7280' }}
                    >
                        <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                        <span className="text-xs tracking-wide">{label}</span>
                    </button>
                )
            })}
        </nav>
    )
}