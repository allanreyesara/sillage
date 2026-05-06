import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import BlobBackground from '../components/ui/BlobBackground'

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

        if (isLogIn) {
            const {error: authError} = await supabase.auth.signInWithPassword({ email, password })
            if (authError) {
                setError(authError.message)
                setLoading(false)
                toast.error(authError.message)
                return
            } else {
                navigate('/dashboard')
            }
        } else {
            const {data, error: authError} = await supabase.auth.signUp({ email, password })
             if (authError) {
                setError(authError.message)
                setLoading(false)
                toast.error(authError.message)
                return
            } else if (data.user?.identities?.length === 0) {
                toast.error((t) => (
                    <span>
                        Email already registered.{' '}
                        <button onClick={() => {
                            setIsLogIn(true)
                            toast.dismiss(t.id)
                        }}
                        className='underline font-semibold'>
                            Sign In instead
                        </button>
                    </span>
                ), {duration: 5000})
                
            } else {
                toast.success('Account created! Please check your email to confirm your account.')
                navigate('/auth')
                setIsLogIn(true)
            }
        }


        setLoading(false)
    }

    return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden relative">
        <Toaster position='top-center'toastOptions={{
      style: {
        fontSize: '18px',
        background: '#1a1a2e',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)'
      }
    }}/>
        <BlobBackground />
        <div className="relative z-10 w-full max-w-md p-8" >
            <a href="/" cursosr-pointer >
                <h1 className="text-5xl font-serif text-white mb-1 tracking-tight">Sillage</h1>
            </a>
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
                {loading && <p className="text-gray-400 text-sm">This is a beta version, it can take 30 seconds for the backend to wake up if the app was not used by any user in the last 15 minutes.</p>}
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
