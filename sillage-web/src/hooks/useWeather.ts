import { useState, useEffect } from 'react'

type WeatherStatus = 'idle' | 'requesting' | 'loading' | 'success' | 'denied' | 'error'

export interface WeatherData {
  temperature: number
  weatherCode: number
  condition: string
  isDay: boolean
  city: string | null
}

function decodeWeatherCode(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? 'Clear sky' : 'Clear night'
  if (code <= 2) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if (code <= 49) return 'Foggy'
  if (code <= 59) return 'Drizzle'
  if (code <= 69) return 'Rain'
  if (code <= 79) return 'Snow'
  if (code <= 82) return 'Rain showers'
  if (code <= 84) return 'Snow showers'
  if (code <= 99) return 'Thunderstorm'
  return 'Unknown'
}

export function weatherIcon(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? '☀️' : '🌙'
  if (code <= 2) return isDay ? '⛅' : '🌙'
  if (code === 3) return '☁️'
  if (code <= 49) return '🌫️'
  if (code <= 69) return '🌧️'
  if (code <= 79) return '🌨️'
  if (code <= 82) return '🌦️'
  if (code <= 99) return '⛈️'
  return '🌡️'
}
async function getCityName(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    )
    const data = await res.json()
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      null
    )
  } catch {
    return null
  }
}

export function useWeather() {
  const [status, setStatus] = useState<WeatherStatus>('idle')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setStatus('requesting')

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setStatus('loading')
        const { latitude: lat, longitude: lon } = pos.coords

        try {
          const [weatherRes, city] = await Promise.all([
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,is_day&temperature_unit=celsius&timezone=auto`
            ),
            getCityName(lat, lon),
          ])

          const weatherJson = await weatherRes.json()
          const current = weatherJson.current

          setWeather({
            temperature: Math.round(current.temperature_2m),
            weatherCode: current.weathercode,
            condition: decodeWeatherCode(current.weathercode, current.is_day === 1),
            isDay: current.is_day === 1,
            city,
          })
          setStatus('success')
        } catch (e) {
          setError('Could not fetch weather data')
          setStatus('error')
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus('denied')
        } else {
          setError('Could not get location')
          setStatus('error')
        }
      },
      { timeout: 8000 }
    )
  }, [])

  return { weather, status, error }
}