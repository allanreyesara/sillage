import { useEffect, useState } from 'react'
import Layout from '../components/layout/layout'
import { useWeather, weatherIcon } from '../hooks/useWeather'
import { getFragrances, getRecommendation } from '../lib/api'
import type { Fragrance } from '../types/fragrance'
import type { RecommendationResponse } from '../types/RecommendationResponse'

export default function Dashboard() {
  const occasions = ['Night Out', 'Casual', 'Professional', 'Date']
  const [loadingRecommendation, setLoadingRecommendation] = useState(false)
  const { weather, status } = useWeather()
  const [occasion, setOccasion] = useState<string | null>(null)
  const [fragrances, setFragrances] = useState<Fragrance[]>([])
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null)


  useEffect(() => {
    const loadFragrances = async () => {
      const data = await getFragrances()
      setFragrances(data)
    }
    loadFragrances()
  }, [])

  const handleRecommendation = async () => {
    if (!occasion || !weather) return
    setLoadingRecommendation(true)
    const data = await getRecommendation(occasion, weather.temperature, weather.condition, weather.isDay)
    setRecommendation(data) 
    setLoadingRecommendation(false)
  }

  const allAccords = fragrances.flatMap(f => {
    try {
      const parsed = JSON.parse(f.mainAccords || '[]')
      return Array.isArray(parsed) ? (parsed as string[]) : []
    } catch {
      return []
    }
  })
  const accordCounts = allAccords.reduce((acc: Record<string, number>, accord: string) => {
    acc[accord] = (acc[accord] || 0) + 1
    return acc
  }, {})
  const topAccord = Object.entries(accordCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const allSeasons = fragrances.flatMap(f => {
    try {
      const parsed = JSON.parse(f.seasonRanking || '[]')
      return Array.isArray(parsed) ? (parsed as { name: string; score: number }[]) : []
    } catch {
      return []
    }
  })
  const seasonCounts = allSeasons.reduce((acc: Record<string, number>,  { name, score }: { name: string, score: number }) => {
    acc[name] = (acc[name] || 0) + score
    return acc
  }, {})
  const topSeason = Object.entries(seasonCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const allOccasions = fragrances.flatMap(f => {
    try {
      const parsed = JSON.parse(f.occasionRanking || '[]')
      return Array.isArray(parsed) ? (parsed as { name: string; score: number }[]) : []
    } catch {
      return []
    }
  })
  const occasionCounts = allOccasions.reduce((acc: Record<string, number>,  { name, score }: { name: string, score: number }) => {
    acc[name] = (acc[name] || 0) + score
    return acc
  }, {})
  const topOccasion = Object.entries(occasionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const weatherWidget = {
    idle: null,
    requesting: <p className="text-sm text-white/40">Requesting location...</p>,
    loading: <p className="text-sm text-white/40">Loading weather...</p>,
    denied: <p className="text-sm text-white/40">Location denied</p>,
    error: <p className="text-sm text-white/40">Could not load weather data</p>,
    success: (
      <div
        className="rounded-3xl p-8 mb-8 backdrop-blur-sm grid grid-cols-1 md:grid-cols-2 gap-8"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
      >
        {/* Weather */}
        <div>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(245,158,11,0.7)', letterSpacing: '0.22em' }}>
            {weather?.city}
          </p>
          <p className="font-normal mb-1" style={{ fontFamily: "'Tenor Sans', serif", fontSize: 'clamp(48px, 6vw, 72px)', lineHeight: 1 }}>
            {weather?.temperature}°C
          </p>
          <div className="flex items-center gap-4 mt-2">
            <span style={{ fontSize: 52, lineHeight: 1 }}>
              {weather && weatherIcon(weather.weatherCode, weather.isDay)}
            </span>
            <span className="text-sm uppercase tracking-widest" style={{ color: '#9ca3af', letterSpacing: '0.18em' }}>
              {weather?.condition}
            </span>
          </div>
        </div>

        {/* Occasion */}
        <div className="flex flex-col justify-center gap-4">
          <p className="font-normal text-2xl" style={{ fontFamily: "'Tenor Sans', serif" }}>
            What's the occasion?
          </p>
          <div className="flex flex-wrap gap-2">
            {occasions.map(o => (
              <button
                key={o}
                onClick={() => setOccasion(prev => prev === o ? null : o)}
                className="px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all"
                style={{
                  background: occasion === o ? 'rgba(245,158,11,0.20)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${occasion === o ? 'rgba(245,158,11,0.50)' : 'rgba(255,255,255,0.10)'}`,
                  color: occasion === o ? '#f59e0b' : '#9ca3af',
                }}
              >
                {o}
              </button>
            ))}
          </div>
          <button
            onClick={handleRecommendation}
            disabled={!occasion}
            className="px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-widest transition-all"
            style={{
              background: occasion ? 'linear-gradient(to right, #f59e0b, #f43f5e)' : 'rgba(255,255,255,0.06)',
              border: 'none',
              color: occasion ? '#fff' : '#6b7280',
              cursor: occasion ? 'pointer' : 'not-allowed',
            }}
          >
            Get my recommendation
          </button>
        </div>
      </div>
    ),
  }[status]

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      {weatherWidget}
      {loadingRecommendation && (
          <div
              className="rounded-3xl p-8 mb-8 backdrop-blur-sm animate-pulse"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
              <div className="h-3 w-32 rounded-full mb-4" style={{ background: 'rgba(245,158,11,0.2)' }} />
              <div className="h-8 w-64 rounded-full mb-4" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="h-4 w-full rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.05)' }} />
              <div className="h-4 w-3/4 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.05)' }} />
              <div className="flex gap-2">
                  <div className="h-8 w-24 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <div className="h-8 w-24 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
              </div>
          </div>
      )}
      {recommendation && (
          <div
              className="rounded-3xl p-8 mb-8 backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(245,158,11,0.7)', letterSpacing: '0.22em' }}>
                  Today's Recommendation
              </p>
              <p className="text-3xl font-normal mb-4" style={{ fontFamily: "'Tenor Sans', serif" }}>
                  {recommendation.topFragranceName}
              </p>
              <p className="text-sm text-white/60 mb-6 leading-relaxed">
                  {recommendation.reason}
              </p>
              {recommendation.otherSuggestions.length > 0 && (
                  <div>
                      <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#6b7280', letterSpacing: '0.18em' }}>
                          Also works for this occasion
                      </p>
                      <div className="flex gap-2">
                          {recommendation.otherSuggestions.map((name: string) => (
                              <span
                                  key={name}
                                  className="px-4 py-2 rounded-full text-xs"
                                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: '#9ca3af' }}
                              >
                                  {name}
                              </span>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Bottles', value: fragrances.length },
          { label: 'Top Accord', value: topAccord },
          { label: 'Favorite Season', value: topSeason },
          { label: 'Favorite Occasion', value: topOccasion },
        ].map(stat => (
          <div
            key={stat.label}
            className="rounded-2xl p-5 backdrop-blur-sm"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(245,158,11,0.7)', letterSpacing: '0.18em', fontSize: 10 }}>
              {stat.label}
            </p>
            <p className="text-xl font-normal capitalize" style={{ fontFamily: "'Tenor Sans', serif" }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  )
}