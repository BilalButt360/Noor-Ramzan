'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getNextPrayer, fetchPrayerTimes } from '../lib/prayer'

const PrayerContext = createContext()

// ✅ Convert "15:30" → "3:30 PM" | "05:00" → "5:00 AM"
export function convertTo12Hour(time24) {
  if (!time24) return ''
  const [hourStr, minuteStr] = time24.split(':')
  let hour = parseInt(hourStr, 10)
  const minute = minuteStr || '00'
  const ampm = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12
  return `${hour}:${minute} ${ampm}`
}

// Comprehensive Pakistan cities list
export const pakistanCities = [
  { name: 'Karachi', lat: 24.8607, lng: 67.0011, province: 'Sindh' },
  { name: 'Lahore', lat: 31.5204, lng: 74.3587, province: 'Punjab' },
  { name: 'Islamabad', lat: 33.6844, lng: 73.0479, province: 'Federal' },
  { name: 'Rawalpindi', lat: 33.5651, lng: 73.0169, province: 'Punjab' },
  { name: 'Faisalabad', lat: 31.4504, lng: 73.1350, province: 'Punjab' },
  { name: 'Multan', lat: 30.1575, lng: 71.5249, province: 'Punjab' },
  { name: 'Gujranwala', lat: 32.1617, lng: 74.1883, province: 'Punjab' },
  { name: 'Peshawar', lat: 34.0151, lng: 71.5249, province: 'KPK' },
  { name: 'Quetta', lat: 30.1798, lng: 66.9750, province: 'Balochistan' },
  { name: 'Sialkot', lat: 32.4945, lng: 74.5229, province: 'Punjab' },
  { name: 'Bahawalpur', lat: 29.3956, lng: 71.6722, province: 'Punjab' },
  { name: 'Sargodha', lat: 32.0836, lng: 72.6711, province: 'Punjab' },
  { name: 'Hyderabad', lat: 25.3960, lng: 68.3578, province: 'Sindh' },
  { name: 'Sukkur', lat: 27.7052, lng: 68.8574, province: 'Sindh' },
  { name: 'Abbottabad', lat: 34.1688, lng: 73.2215, province: 'KPK' },
  { name: 'Mardan', lat: 34.1986, lng: 72.0404, province: 'KPK' },
  { name: 'Mirpur Khas', lat: 25.5276, lng: 69.0152, province: 'Sindh' },
  { name: 'Rahim Yar Khan', lat: 28.4212, lng: 70.2957, province: 'Punjab' },
  { name: 'Kasur', lat: 31.1167, lng: 74.4500, province: 'Punjab' },
  { name: 'Okara', lat: 30.8085, lng: 73.4504, province: 'Punjab' },
  { name: 'Sahiwal', lat: 30.6706, lng: 73.1064, province: 'Punjab' },
  { name: 'Nawabshah', lat: 26.2442, lng: 68.4100, province: 'Sindh' },
  { name: 'Mingora', lat: 34.7717, lng: 72.3600, province: 'KPK' },
  { name: 'Chiniot', lat: 31.7167, lng: 72.9833, province: 'Punjab' },
  { name: 'Kamoke', lat: 31.9735, lng: 74.2237, province: 'Punjab' },
  { name: 'Muzaffargarh', lat: 30.0706, lng: 71.1936, province: 'Punjab' },
  { name: 'Gujrat', lat: 32.5736, lng: 74.0783, province: 'Punjab' },
  { name: 'Sheikhupura', lat: 31.7167, lng: 73.9850, province: 'Punjab' },
  { name: 'Hafizabad', lat: 32.0710, lng: 73.6875, province: 'Punjab' },
  { name: 'Jacobabad', lat: 28.2769, lng: 68.4376, province: 'Sindh' },
  { name: 'Larkana', lat: 27.5584, lng: 68.2158, province: 'Sindh' },
  { name: 'Jhang', lat: 31.2681, lng: 72.3181, province: 'Punjab' },
  { name: 'Dera Ghazi Khan', lat: 30.0498, lng: 70.6346, province: 'Punjab' },
  { name: 'Mansehra', lat: 34.3330, lng: 73.1974, province: 'KPK' },
  { name: 'Kohat', lat: 33.5869, lng: 71.4414, province: 'KPK' },
  { name: 'Wah Cantt', lat: 33.7700, lng: 72.7100, province: 'Punjab' },
  { name: 'Turbat', lat: 26.0021, lng: 63.0442, province: 'Balochistan' },
  { name: 'Khuzdar', lat: 27.8000, lng: 66.6167, province: 'Balochistan' },
  { name: 'Hub', lat: 25.0544, lng: 66.8911, province: 'Balochistan' },
  { name: 'Muzaffarabad', lat: 34.3700, lng: 73.4700, province: 'AJK' },
  { name: 'Mirpur', lat: 33.1500, lng: 73.7500, province: 'AJK' },
  { name: 'Gilgit', lat: 35.9200, lng: 74.3000, province: 'GB' },
]

// Group cities by province for the dropdown
export const citiesByProvince = pakistanCities.reduce((acc, city) => {
  if (!acc[city.province]) acc[city.province] = []
  acc[city.province].push(city)
  return acc
}, {})

export function PrayerProvider({ children }) {
  const [prayers, setPrayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('')
  // 'forced' = first time, no city — cannot close
  // 'manual' = user clicked "Change City" — can close
  // 'hidden' = modal closed
  const [modalMode, setModalMode] = useState('hidden')
  const [locationStatus, setLocationStatus] = useState('idle')

  const showCitySelect = modalMode !== 'hidden'
  const canCloseModal = modalMode === 'manual'

  const fetchAndSetPrayers = async (latitude, longitude, cityName = '') => {
    try {
      const times = await fetchPrayerTimes({ latitude, longitude })
      // ✅ Step 1: getNextPrayer on RAW 24hr times (so time comparison works correctly)
      const withNext = getNextPrayer(times)
      // ✅ Step 2: Convert to 12hr AM/PM format AFTER next prayer is determined
      const converted = withNext.map((p) => ({
        ...p,
        time: convertTo12Hour(p.time),
      }))
      setPrayers(converted)
      if (cityName) setCity(cityName)
    } catch (e) {
      console.error('Prayer fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const storedCity = localStorage.getItem('manualCity')
    if (storedCity) {
      const cityObj = pakistanCities.find((c) => c.name === storedCity)
      if (cityObj) {
        fetchAndSetPrayers(cityObj.lat, cityObj.lng, cityObj.name)
        setModalMode('hidden')
        return
      }
    }

    if (!navigator.geolocation) {
      setModalMode('forced')
      setLoading(false)
      return
    }

    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          fetchByLocation()
        } else if (result.state === 'prompt') {
          fetchByLocation()
        } else {
          setLocationStatus('denied')
          setModalMode('forced')
          setLoading(false)
        }
        result.onchange = () => {
          if (result.state === 'granted') {
            fetchByLocation()
            setModalMode('hidden')
          }
        }
      })
    } else {
      fetchByLocation()
    }
  }, [])

  const fetchByLocation = () => {
    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          setLocationStatus('success')
          const nearest = pakistanCities.reduce((prev, curr) => {
            const prevDist = Math.hypot(prev.lat - latitude, prev.lng - longitude)
            const currDist = Math.hypot(curr.lat - latitude, curr.lng - longitude)
            return currDist < prevDist ? curr : prev
          })
          let cityName = nearest.name
          try {
            const res = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=69e65f29c06244fcb5e27d9a4a0a8a11`
            )
            const data = await res.json()
            const components = data.results?.[0]?.components
            cityName = components?.city || components?.town || components?.village || nearest.name
          } catch { /* silently use nearest */ }
          await fetchAndSetPrayers(latitude, longitude, cityName)
        } catch (error) {
          setModalMode('forced')
          setLoading(false)
        }
      },
      (err) => {
        setLocationStatus('denied')
        setModalMode('forced')
        setLoading(false)
      },
      { timeout: 10000, enableHighAccuracy: false }
    )
  }

  const handleManualCity = async (cityObj) => {
    if (!cityObj) return
    setLoading(true)
    await fetchAndSetPrayers(cityObj.lat, cityObj.lng, cityObj.name)
    localStorage.setItem('manualCity', cityObj.name)
    setModalMode('hidden')
  }

  // User manually clicks "Change City" — closeable
  const changeCity = () => setModalMode('manual')

  // Only closes in manual mode (not forced)
  const closeModal = () => { if (canCloseModal) setModalMode('hidden') }

  return (
    <PrayerContext.Provider
      value={{
        prayers, loading, city,
        showCitySelect, canCloseModal,
        fallbackCities: pakistanCities,
        pakistanCities, citiesByProvince,
        handleManualCity, changeCity, closeModal,
        locationStatus,
      }}
    >
      {children}
    </PrayerContext.Provider>
  )
}

export const usePrayers = () => useContext(PrayerContext)