import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Layout from '../components/layout/layout'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/auth'); return }

      setProfile({
        id: user.id,
        email: user.email ?? '',
        full_name: user.user_metadata?.full_name ?? null,
        avatar_url: user.user_metadata?.avatar_url ?? null,
        created_at: user.created_at,
      })
      setNameInput(user.user_metadata?.full_name ?? '')
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleSaveName = async () => {
    if (!nameInput.trim()) return
    setSaving(true)
    setSaveError(null)

    const { error } = await supabase.auth.updateUser({
      data: { full_name: nameInput.trim() }
    })

    if (error) {
      setSaveError(error.message)
    } else {
      setProfile(prev => prev ? { ...prev, full_name: nameInput.trim() } : prev)
      setEditing(false)
    }

    setSaving(false)
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() ?? '?'

  const joinedDate = profile
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : ''

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-6 sm:py-8 px-4">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(245,158,11,0.7)', letterSpacing: '0.22em' }}>
            Account
          </p>
          <h1 className="text-2xl sm:text-3xl font-normal" style={{ fontFamily: "'Tenor Sans', serif" }}>
            Your Profile
          </h1>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-5 sm:p-8 mb-4 backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
        >

          {/* Avatar + Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">

            {/* Avatar */}
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="avatar"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                style={{ border: '2px solid rgba(245,158,11,0.30)' }}
              />
            ) : (
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-xl sm:text-2xl font-semibold text-white"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.30), rgba(124,58,237,0.30))',
                  border: '2px solid rgba(245,158,11,0.20)',
                  fontFamily: "'Tenor Sans', serif",
                }}
              >
                {initials}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 w-full text-center sm:text-left">

              {editing ? (
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSaveName()
                      if (e.key === 'Escape') setEditing(false)
                    }}
                    className="w-full bg-white/10 rounded-xl px-4 py-2 text-white text-lg outline-none"
                    style={{ border: '1px solid rgba(245,158,11,0.40)' }}
                    autoFocus
                  />

                  <button
                    onClick={handleSaveName}
                    disabled={saving}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm text-white active:scale-[0.98]"
                    style={{ background: 'linear-gradient(to right, #f59e0b, #f43f5e)', opacity: saving ? 0.6 : 1 }}
                  >
                    {saving ? '...' : 'Save'}
                  </button>

                  <button
                    onClick={() => {
                      setEditing(false)
                      setNameInput(profile?.full_name ?? '')
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-sm"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: '#9ca3af' }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-1">
                  <h2 className="text-lg sm:text-xl text-white truncate">
                    {profile?.full_name || 'No name set'}
                  </h2>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs px-3 py-1 rounded-full active:scale-[0.95]"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: '#9ca3af' }}
                  >
                    Edit
                  </button>
                </div>
              )}

              {saveError && <p className="text-xs text-red-400 mb-1">{saveError}</p>}
              <p className="text-sm truncate" style={{ color: '#9ca3af' }}>{profile?.email}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 border-t border-white/10">
            <div>
              <p className="text-xs uppercase tracking-widest mb-1 text-amber-400/70">Member since</p>
              <p className="text-sm text-white">{joinedDate}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest mb-1 text-amber-400/70">Plan</p>
              <p className="text-sm text-white">Beta - Free</p>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div
          className="rounded-3xl overflow-hidden backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          {[
            { label: 'My Collection', sub: 'View and manage your fragrances', path: '/collection' },
            { label: 'Discover', sub: 'Search and add new fragrances', path: '/discover' },
          ].map((item, i, arr) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-left active:scale-[0.99]"
              style={{
                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              <div>
                <p className="text-sm text-white">{item.label}</p>
                <p className="text-xs mt-0.5 text-gray-500">{item.sub}</p>
              </div>
              <span className="text-gray-500">→</span>
            </button>
          ))}
        </div>
          <button
          onClick={handleLogout}
          className="w-full mt-6 py-3 rounded-xl text-sm text-red-400 active:scale-[0.98]"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
  Log out
</button>
      </div>
    </Layout>
  )
}