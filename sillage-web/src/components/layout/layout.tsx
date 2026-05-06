import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Toaster } from 'react-hot-toast'
import BlobBackground from '../ui/BlobBackground'
import BottomNav from './BottomNav'

interface Props {
    children: React.ReactNode
}

export default function Layout({ children }: Props) {
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    const navItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Discover', path: '/discover' },
        { label: 'Collection', path: '/collection' },
        { label: 'Profile', path: '/profile' },
    ]

    return (

        <div className="min-h-screen bg-[#0a0a0f] text-white flex">
            <Toaster position="top-center" />

            {/* Blobs */}
            <BlobBackground />

            {/* Sidebar */}
            <aside className="w-64 hidden lg:flex flex-col p-6 border-r border-white/5 fixed h-full z-10">

                <a href="/">
                    <img src="/logo.png" alt="Sillage Logo" className="h-14 w-auto cursor-pointer" />
                </a>
                <nav className="flex flex-col gap-2 mt-4">
                    {navItems.map((item) => (
                        <span
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                                location.pathname === item.path
                                    ? 'text-white bg-white/10'
                                    : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            {item.label}
                        </span>
                    ))}
                </nav>
                <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-white px-4 py-2 mt-auto transition-colors text-left"
                >
                    Sign Out
                </button>
            </aside>

            {/* Content */}
            <main className="flex-1 p-8 lg:ml-64 pb-24 lg:pb-8">
                {children}
            </main>
            <BottomNav />
        </div>
    )
}