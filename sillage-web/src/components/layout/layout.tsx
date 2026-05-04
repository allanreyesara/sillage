import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

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
            {/* Blobs */}
            <div className="fixed top-[-10%] left-[10%] w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px] animate-blob pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[5%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] animate-blob pointer-events-none" style={{ animationDelay: '3s' }} />
            <div className="fixed top-[30%] left-[-5%] w-[400px] h-[400px] bg-rose-500/15 rounded-full blur-[100px] animate-blob pointer-events-none" style={{ animationDelay: '5s' }} />
            <div className="fixed top-[60%] right-[30%] w-[350px] h-[350px] bg-amber-600/15 rounded-full blur-[100px] animate-blob pointer-events-none" style={{ animationDelay: '2s' }} />
            <div className="fixed top-[10%] right-[20%] w-[300px] h-[300px] bg-fuchsia-500/15 rounded-full blur-[100px] animate-blob pointer-events-none" style={{ animationDelay: '4s' }} />

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
            <main className="flex-1 p-8 lg:ml-64">
                {children}
            </main>
        </div>
    )
}