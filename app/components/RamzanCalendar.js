'use client'

import { useState, useEffect } from 'react'
import { usePrayers } from '../context/PrayerContext'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

// Pakistan cities with their coordinates
const PAKISTAN_CITIES = {
  'Karachi': { lat: 24.8607, lng: 67.0011 },
  'Lahore': { lat: 31.5204, lng: 74.3587 },
  'Islamabad': { lat: 33.6844, lng: 73.0479 },
  'Rawalpindi': { lat: 33.5651, lng: 73.0169 },
  'Faisalabad': { lat: 31.4504, lng: 73.1350 },
  'Multan': { lat: 30.1575, lng: 71.5249 },
  'Peshawar': { lat: 34.0151, lng: 71.5249 },
  'Quetta': { lat: 30.1798, lng: 66.9750 },
  'Sialkot': { lat: 32.4945, lng: 74.5229 },
  'Hyderabad': { lat: 25.3960, lng: 68.3578 },
  'Gujranwala': { lat: 32.1617, lng: 74.1883 },
  'Bahawalpur': { lat: 29.3956, lng: 71.6722 },
  'Sargodha': { lat: 32.0836, lng: 72.6711 },
  'Abbottabad': { lat: 34.1688, lng: 73.2215 },
  'Mardan': { lat: 34.1986, lng: 72.0404 },
  'Sukkur': { lat: 27.7052, lng: 68.8574 },
  'Larkana': { lat: 27.5584, lng: 68.2158 },
  'Gilgit': { lat: 35.9200, lng: 74.3000 },
  'Muzaffarabad': { lat: 34.3700, lng: 73.4700 },
  'Mirpur': { lat: 33.1500, lng: 73.7500 },
}

const RAMZAN_START_DATE = new Date(2026, 1, 19) // February 19, 2026

// Cache for API responses
const apiCache = new Map()

const HIGHLIGHTS = [
  { day: 1, label: '🌙 1st Night', type: 'special' },
  { day: 10, label: '🤲 End of Rahmat', type: 'phase' },
  { day: 11, label: '🔥 Maghfirat Begins', type: 'phase' },
  { day: 20, label: '⚡ Nijaat Begins', type: 'phase' },
  { day: 21, label: '🌟 Laylatul Qadr (21st Night)', type: 'qadr' },
  { day: 23, label: '🌟 Laylatul Qadr (23rd Night)', type: 'qadr' },
  { day: 25, label: '🌟 Laylatul Qadr (25th Night)', type: 'qadr' },
  { day: 27, label: '✨ Laylatul Qadr (Most Likely)', type: 'qadr' },
  { day: 29, label: '🌟 Laylatul Qadr (29th Night)', type: 'qadr' },
  { day: 30, label: '🎉 Last Day of Ramzan', type: 'special' },
]

const ASHRA = [
  { 
    days: '1–10', 
    name: 'Rahmat', 
    arabic: 'رحمت',
    meaning: 'Mercy of Allah',
    color: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-600 dark:text-blue-400',
    icon: '🤲',
    description: 'Allah showers His infinite mercy'
  },
  { 
    days: '11–20', 
    name: 'Maghfirat', 
    arabic: 'مغفرت',
    meaning: 'Forgiveness',
    color: 'from-purple-400 to-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-600 dark:text-purple-400',
    icon: '💜',
    description: 'Seek forgiveness abundantly'
  },
  { 
    days: '21–30', 
    name: 'Nijaat', 
    arabic: 'نجات',
    meaning: 'Salvation from Hellfire',
    color: 'from-emerald-400 to-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-600 dark:text-emerald-400',
    icon: '🌟',
    description: 'Liberation and Laylatul Qadr'
  },
]

// Pre-generated accurate data for major cities (to reduce API calls)
const PRECALCULATED_DATA = {
  'Lahore': {
    sehri: { start: '03:45', end: '04:45' },
    iftar: '18:15',
    variation: 0.5
  },
  'Karachi': {
    sehri: { start: '04:30', end: '05:30' },
    iftar: '18:45',
    variation: 0.4
  },
  'Islamabad': {
    sehri: { start: '04:00', end: '05:00' },
    iftar: '18:20',
    variation: 0.5
  }
}

export default function RamzanCalendar() {
  const { city: userCity } = usePrayers()
  const [selectedCity, setSelectedCity] = useState('Lahore')
  const [ramzanDays, setRamzanDays] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('all')
  const [selectedDay, setSelectedDay] = useState(null)
  const [showCitySelector, setShowCitySelector] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    if (userCity && PAKISTAN_CITIES[userCity]) {
      setSelectedCity(userCity)
    }
  }, [userCity])

  useEffect(() => {
    fetchRamzanTimes()
  }, [selectedCity])

  const fetchRamzanTimes = async () => {
    setLoading(true)
    setLoadProgress(0)
    setUsingFallback(false)
    const city = PAKISTAN_CITIES[selectedCity]
    
    try {
      const days = []
      const cacheKey = `${selectedCity}-ramzan-2026`
      
      // Check cache first
      if (apiCache.has(cacheKey)) {
        setRamzanDays(apiCache.get(cacheKey))
        setLoading(false)
        // toast.success(`Ramzan calendar loaded for ${selectedCity}`)
        return
      }
      
      // Try to fetch from API
      let successfulFetches = 0
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(RAMZAN_START_DATE)
        date.setDate(date.getDate() + i)
        const timestamp = Math.floor(date.getTime() / 1000)
        
        // Update progress
        setLoadProgress(Math.round(((i + 1) / 30) * 100))
        
        // Add delay to avoid rate limiting (max 3 requests per second)
        if (i > 0 && i % 3 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1200))
        }
        
        try {
          const response = await fetch(`/api/prayer-times?date=${timestamp}&lat=${city.lat}&lng=${city.lng}`)
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const data = await response.json()
          const timings = data.data.timings
          
          // Get Hijri date from API
          const hijriDate = data.data.date.hijri.date
          
          // Fajr is Sehri end time, Maghrib is Iftar time
          const sehriEnd = timings.Fajr
          const iftarTime = timings.Maghrib
          
          // Calculate Sehri start (1.5 hours before Fajr)
          const [fajrHour, fajrMin] = sehriEnd.split(':').map(Number)
          let sehriHour = fajrHour - 1
          let sehriMin = fajrMin - 30
          
          if (sehriMin < 0) {
            sehriMin += 60
            sehriHour -= 1
          }
          
          if (sehriHour < 0) {
            sehriHour += 24
          }
          
          const sehriStart = `${String(sehriHour).padStart(2, '0')}:${String(sehriMin).padStart(2, '0')}`
          
          days.push({
            day: i + 1,
            date: format(date, 'MMM dd, yyyy'),
            islamicDate: hijriDate,
            sehriStart,
            sehriEnd,
            iftar: iftarTime,
            fajr: timings.Fajr,
            dhuhr: timings.Dhuhr,
            asr: timings.Asr,
            maghrib: timings.Maghrib,
            isha: timings.Isha,
            weekday: format(date, 'EEEE'),
            isAccurate: true
          })
          
          successfulFetches++
        } catch (error) {
          console.warn(`Failed to fetch day ${i + 1}, using fallback`)
          
          // Use fallback data for this day
          const fallbackDay = generateFallbackDay(i + 1, date, selectedCity)
          days.push({
            ...fallbackDay,
            isAccurate: false
          })
        }
      }
      
      // Sort by day
      days.sort((a, b) => a.day - b.day)
      
      // Cache the results
      apiCache.set(cacheKey, days)
      setRamzanDays(days)
      
      // Show appropriate message
      if (successfulFetches === 30) {
        toast.success(`Complete Ramzan calendar loaded for ${selectedCity}`)
      } else if (successfulFetches > 0) {
        toast.success(`Loaded ${successfulFetches} accurate days for ${selectedCity}`)
        setUsingFallback(true)
      } else {
        setUsingFallback(true)
        toast.error('Using offline data. Connect to internet for accurate times.')
      }
      
    } catch (error) {
      console.error('Error fetching Ramzan times:', error)
      
      // Generate all days using fallback
      const fallbackDays = []
      for (let i = 0; i < 30; i++) {
        const date = new Date(RAMZAN_START_DATE)
        date.setDate(date.getDate() + i)
        fallbackDays.push(generateFallbackDay(i + 1, date, selectedCity))
      }
      
      setRamzanDays(fallbackDays)
      setUsingFallback(true)
      toast.error('Using offline data. Connect to internet for accurate times.')
      
    } finally {
      setLoading(false)
    }
  }

  // Generate a single fallback day
  const generateFallbackDay = (day, date, city) => {
    // Use precalculated data if available, otherwise generate
    const cityData = PRECALCULATED_DATA[city] || PRECALCULATED_DATA['Lahore']
    
    // Times change gradually over the month
    const variation = cityData.variation || 0.5
    const sehriMinuteOffset = Math.floor(day * variation)
    const iftarMinuteOffset = Math.floor(day * variation * 1.2)
    
    // Parse base times
    const [baseSehriHour, baseSehriMin] = cityData.sehri.end.split(':').map(Number)
    const [baseIftarHour, baseIftarMin] = cityData.iftar.split(':').map(Number)
    
    // Calculate adjusted times
    let sehriMin = baseSehriMin - sehriMinOffset
    let sehriHour = baseSehriHour
    if (sehriMin < 0) {
      sehriMin += 60
      sehriHour -= 1
    }
    
    let iftarMin = baseIftarMin + iftarMinOffset
    let iftarHour = baseIftarHour
    if (iftarMin >= 60) {
      iftarMin -= 60
      iftarHour += 1
    }
    
    const sehriEnd = `${String(sehriHour).padStart(2, '0')}:${String(sehriMin).padStart(2, '0')}`
    const iftarTime = `${String(iftarHour).padStart(2, '0')}:${String(iftarMin).padStart(2, '0')}`
    
    // Calculate Sehri start (1.5 hours before)
    let sehriStartHour = sehriHour - 1
    let sehriStartMin = sehriMin - 30
    if (sehriStartMin < 0) {
      sehriStartMin += 60
      sehriStartHour -= 1
    }
    if (sehriStartHour < 0) {
      sehriStartHour += 24
    }
    const sehriStart = `${String(sehriStartHour).padStart(2, '0')}:${String(sehriStartMin).padStart(2, '0')}`
    
    return {
      day,
      date: format(date, 'MMM dd, yyyy'),
      islamicDate: `${day} Ramzan 1447`,
      sehriStart,
      sehriEnd,
      iftar: iftarTime,
      fajr: sehriEnd,
      dhuhr: '12:30',
      asr: '15:45',
      maghrib: iftarTime,
      isha: '19:30',
      weekday: format(date, 'EEEE'),
      isAccurate: false
    }
  }

  const convertTo12Hour = (time) => {
    if (!time) return ''
    const [hour, minute] = time.split(':')
    const h = parseInt(hour)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${minute} ${ampm}`
  }

  const today = new Date()
  const currentRamzanDay = Math.floor(
    (today - RAMZAN_START_DATE) / (1000 * 60 * 60 * 24)
  ) + 1

  const displayedDays = view === 'odd' 
    ? ramzanDays.filter(d => d.day % 2 !== 0)
    : ramzanDays

  const getHighlight = (day) => HIGHLIGHTS.find(h => h.day === day)

  const getAshra = (day) => {
    if (day <= 10) return ASHRA[0]
    if (day <= 20) return ASHRA[1]
    return ASHRA[2]
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section with City Selector */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-900 text-white"
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl" />
          
          {/* Islamic Pattern */}
          <svg className="absolute right-10 top-10 w-32 h-32 text-white/5" viewBox="0 0 100 100">
            <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="relative z-10 p-8 md:p-12">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm mb-6"
            >
              <span>📅</span>
              <span>رمضان 1447 • Ramzan 2026</span>
              {usingFallback && (
                <span className="bg-yellow-500/30 text-yellow-200 px-2 py-0.5 rounded-full text-xs ml-2">
                  Offline Mode
                </span>
              )}
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold mb-4"
            >
              Ramzan Calendar
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-lg mb-8 max-w-xl"
            >
              Complete Sehri & Iftar timetable for {selectedCity} with accurate prayer times
            </motion.p>

            {/* City Selector and Status */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <div className="relative">
                <button
                  onClick={() => setShowCitySelector(!showCitySelector)}
                  className="flex items-center gap-3 bg-white/20 backdrop-blur hover:bg-white/30 px-5 py-3 rounded-xl transition-all border border-white/30"
                >
                  <span>📍</span>
                  <span className="font-semibold">{selectedCity}</span>
                  <svg className={`w-4 h-4 transition-transform ${showCitySelector ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {showCitySelector && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-64 max-h-96 overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                    >
                      <div className="p-2">
                        {Object.keys(PAKISTAN_CITIES).map((city) => (
                          <button
                            key={city}
                            onClick={() => {
                              setSelectedCity(city)
                              setShowCitySelector(false)
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl transition ${
                              city === selectedCity
                                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {currentRamzanDay >= 1 && currentRamzanDay <= 30 && (
                <div className="bg-emerald-500/30 backdrop-blur px-5 py-3 rounded-xl border border-emerald-400/30">
                  <span className="text-sm opacity-80">Today is</span>
                  <span className="font-bold ml-2">Day {currentRamzanDay} of Ramzan</span>
                </div>
              )}
            </motion.div>

            {/* Progress bar for loading */}
            {loading && loadProgress > 0 && (
              <div className="mt-6 max-w-md">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Loading calendar...</span>
                  <span>{loadProgress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${loadProgress}%` }}
                    className="bg-gradient-to-r from-emerald-400 to-emerald-300 h-2 rounded-full"
                  />
                </div>
                <p className="text-xs text-white/50 mt-2">
                  Fetching accurate prayer times for {selectedCity}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Ashra Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {ASHRA.map((ashra, index) => (
          <motion.div
            key={ashra.days}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`relative overflow-hidden rounded-2xl p-6 ${ashra.bg} border ${ashra.border}`}
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${ashra.color}`} />
            
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`text-sm font-semibold ${ashra.text}`}>Days {ashra.days}</span>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
                  {ashra.arabic}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{ashra.name}</p>
              </div>
              <span className="text-4xl">{ashra.icon}</span>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {ashra.meaning} — {ashra.description}
            </p>

            {/* Progress indicator */}
            {currentRamzanDay >= parseInt(ashra.days.split('–')[0]) && 
             currentRamzanDay <= parseInt(ashra.days.split('–')[1]) && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"
              />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex gap-3 flex-wrap items-center justify-between"
      >
        <div className="flex gap-3 flex-wrap">
          {[
            { key: 'all', label: '📅 All 30 Days', icon: '📅' },
            { key: 'odd', label: '⭐ Odd Nights (Last 10)', icon: '🌟' },
          ].map((tab) => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView(tab.key)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer ${
                view === tab.key
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-500'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Refresh button */}
        {ramzanDays.length > 0 && (
          <button
            onClick={() => {
              apiCache.delete(`${selectedCity}-ramzan-2026`)
              fetchRamzanTimes()
            }}
            className="px-4 py-2 bg-white/10 backdrop-blur rounded-xl text-sm hover:bg-white/20 transition border border-white/20"
            title="Refresh data"
          >
            🔄 Refresh
          </button>
        )}
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"
          />
          <p className="text-gray-500 dark:text-gray-400">
            Loading calendar for {selectedCity}...
          </p>
          <p className="text-xs text-gray-400 mt-2">
            This may take a few seconds
          </p>
        </div>
      ) : (
        <>
          {/* Calendar Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-1 gap-3"
          >
            {displayedDays.map((day, index) => {
              const highlight = getHighlight(day.day)
              const ashra = getAshra(day.day)
              const isToday = day.day === currentRamzanDay
              
              return (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedDay(selectedDay === day.day ? null : day)}
                  className={`relative overflow-hidden rounded-2xl border-2 cursor-pointer transition-all ${
                    isToday
                      ? 'border-emerald-500 shadow-xl shadow-emerald-500/20'
                      : 'border-gray-100 dark:border-gray-800 hover:border-emerald-300'
                  } ${
                    selectedDay === day.day ? 'ring-4 ring-emerald-500/20' : ''
                  }`}
                >
                  {/* Background indicator for Ashra */}
                  <div className={`absolute inset-0 ${ashra.bg} opacity-30`} />
                  
                  {/* Accuracy indicator */}
                  {!day.isAccurate && (
                    <div className="absolute top-2 right-2">
                      <span className="text-xs bg-yellow-500/80 text-white px-2 py-0.5 rounded-full">
                        Approx
                      </span>
                    </div>
                  )}
                  
                  <div className="relative p-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <div className="flex items-center gap-4 flex-wrap">
                      {/* Day Number */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                        isToday
                          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                      }`}>
                        {day.day}
                      </div>

                      {/* Date Info */}
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-800 dark:text-white">
                            {day.weekday}, {day.date}
                          </p>
                          <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                            {day.islamicDate}
                          </span>
                        </div>
                        
                        {/* Special Highlights */}
                        {highlight && (
                          <span className={`inline-block mt-1 text-sm font-medium ${
                            highlight.type === 'qadr' 
                              ? 'text-yellow-600 dark:text-yellow-400' 
                              : highlight.type === 'special'
                              ? 'text-purple-600 dark:text-purple-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}>
                            {highlight.label}
                          </span>
                        )}
                      </div>

                      {/* Sehri & Iftar Times */}
                      <div className="flex gap-6">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">🌅 Sehri Ends</p>
                          <p className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
                            {convertTo12Hour(day.sehriEnd)}
                          </p>
                          <p className="text-xs text-gray-400">
                            Start: {convertTo12Hour(day.sehriStart)}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">🌇 Iftar</p>
                          <p className="text-xl font-mono font-bold text-orange-500 dark:text-orange-400">
                            {convertTo12Hour(day.iftar)}
                          </p>
                          <p className="text-xs text-gray-400">
                            Maghrib
                          </p>
                        </div>
                      </div>

                      {/* Expand/Collapse Icon */}
                      <button className="text-gray-400 hover:text-emerald-500 transition">
                        <svg className={`w-5 h-5 transform transition-transform ${selectedDay === day.day ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {selectedDay === day.day && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Fajr</p>
                              <p className="font-mono font-bold text-gray-800 dark:text-white">
                                {convertTo12Hour(day.fajr)}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Dhuhr</p>
                              <p className="font-mono font-bold text-gray-800 dark:text-white">
                                {convertTo12Hour(day.dhuhr)}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Asr</p>
                              <p className="font-mono font-bold text-gray-800 dark:text-white">
                                {convertTo12Hour(day.asr)}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Maghrib</p>
                              <p className="font-mono font-bold text-gray-800 dark:text-white">
                                {convertTo12Hour(day.maghrib)}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Isha</p>
                              <p className="font-mono font-bold text-gray-800 dark:text-white">
                                {convertTo12Hour(day.isha)}
                              </p>
                            </div>
                          </div>
                          
                          {/* Accuracy note */}
                          {!day.isAccurate && (
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-3 text-center">
                              ⚠️ Approximate times - Connect to internet for exact prayer times
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Download Options */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center gap-4 mt-8"
          >
            <button 
              onClick={() => {
                toast.success('PDF download feature coming soon!')
              }}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/30"
            >
              <span>📥</span>
              Download PDF Calendar
            </button>
          </motion.div>
        </>
      )}

      {/* Hadith Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-900 text-white p-10"
      >
        <div className="absolute inset-0 bg-[url('/islamic-pattern.svg')] opacity-5" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-emerald-300 text-sm mb-4 tracking-widest">صحيح البخاري</p>
          <p className="text-3xl font-arabic mb-6 leading-relaxed">
            مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ
          </p>
          <p className="text-white/80 text-lg mb-4">
            "Whoever fasts in Ramzan with faith and seeking reward, all his previous sins will be forgiven."
          </p>
          <p className="text-emerald-300">— Bukhari & Muslim</p>
        </div>

        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl" />
      </motion.section>
    </div>
  )
}