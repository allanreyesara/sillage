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
      <div className="max-w-2xl mx-auto py-8 px-4">

        {/* - Header - */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(245,158,11,0.7)', letterSpacing: '0.22em' }}>
            Account
          </p>
          <h1
            className="text-3xl font-normal"
            style={{ fontFamily: "'Tenor Sans', serif", letterSpacing: '-0.005em' }}
          >
            Your Profile
          </h1>
        </div>

        {/* - Avatar + Name - */}
        <div
          className="rounded-3xl p-8 mb-4 backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <div className="flex items-center gap-6 mb-8">
            {/* Avatar */}
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover"
                style={{ border: '2px solid rgba(245,158,11,0.30)' }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold text-white"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.30), rgba(124,58,237,0.30))',
                  border: '2px solid rgba(245,158,11,0.20)',
                  fontFamily: "'Tenor Sans', serif",
                }}
              >
                {initials}
              </div>
            )}

            {/* Name + email */}
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="flex items-center gap-2 mb-1">
                  <input
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditing(false) }}
                    className="bg-white/10 rounded-xl px-4 py-2 text-white text-lg font-normal outline-none flex-1"
                    style={{ border: '1px solid rgba(245,158,11,0.40)', fontFamily: "'Tenor Sans', serif" }}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={saving}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all"
                    style={{ background: 'linear-gradient(to right, #f59e0b, #f43f5e)', border: 'none', opacity: saving ? 0.6 : 1 }}
                  >
                    {saving ? '...' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setNameInput(profile?.full_name ?? '') }}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: '#9ca3af' }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-1">
                  <h2
                    className="text-xl font-normal text-white truncate"
                    style={{ fontFamily: "'Tenor Sans', serif" }}
                  >
                    {profile?.full_name || 'No name set'}
                  </h2>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs px-3 py-1 rounded-full transition-all"
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

          {/* Meta row */}
          <div
            className="flex flex-wrap gap-6 pt-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(245,158,11,0.7)', letterSpacing: '0.18em', fontSize: 10 }}>Member since</p>
              <p className="text-sm text-white">{joinedDate}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(245,158,11,0.7)', letterSpacing: '0.18em', fontSize: 10 }}>Plan</p>
              <p className="text-sm text-white">Beta - Free</p>
            </div>
          </div>
        </div>

        {/* - Quick links - */}
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
              className="w-full flex items-center justify-between px-6 py-4 text-left transition-all"
              style={{
                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                background: 'transparent',
                border: i < arr.length - 1 ? undefined : 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{item.sub}</p>
              </div>
              <span style={{ color: '#6b7280' }}>→</span>
            </button>
          ))}
        </div>

      </div>
    </Layout>
  )
}