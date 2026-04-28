import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
    const navigate = useNavigate()
    const [isLogIn, setIsLogIn] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit =  async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { error: authError } = isLogIn ? await supabase.auth.signInWithPassword({ email, password }) :
            await supabase.auth.signUp({ email, password })

        if (authError) {
            setError(authError.message)
        }else {
            navigate('/dashboard')
        }

        setLoading(false)
    }

    return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden relative">
        
        {/* Animated blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-amber-500/30 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-violet-600/30 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] right-[20%] w-64 h-64 bg-rose-500/20 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 w-full max-w-md p-8">
            <h1 className="text-5xl font-serif text-white mb-1 tracking-tight">Sillage</h1>
            <p className="text-gray-500 mb-8 text-sm tracking-widest uppercase">
                {isLogIn ? 'Welcome back' : 'Create your account'}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none focus:border-amber-500/50 transition-all"
                />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold py-3 rounded-xl transition-all hover:opacity-90 disabled:opacity-50 mt-2"
                >
                    {loading ? 'Loading...' : isLogIn ? 'Sign In' : 'Sign Up'}
                </button>
            </form>

            <p className="text-gray-600 text-sm mt-6 text-center">
                {isLogIn ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setIsLogIn(!isLogIn)} className="text-gray-400 hover:text-white transition-colors">
                    {isLogIn ? 'Sign Up' : 'Sign In'}
                </button>
            </p>
        </div>
    </div>
)

}
