'use client'

import { useState, useEffect, useCallback } from 'react'
import { TASBEEHS } from '../data/tasbeehs'
import { useAuth } from '../context/Authcontext'
import { syncTasbeehToFirebase } from '../lib/userService'
import AuthRequiredModal from '../components/AuthRequiredModal'
import toast from 'react-hot-toast'

export default function Tasbeeh() {
  const { user } = useAuth()
  const [selected, setSelected] = useState(TASBEEHS[0])
  const [counts, setCounts] = useState({})
  const [totalToday, setTotalToday] = useState(0)
  const [ripple, setRipple] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Load data from localStorage first, then from Firebase if user is logged in
  useEffect(() => {
    const loadData = async () => {
      // First load from localStorage
      const saved = localStorage.getItem('tasbeehCounts')
      if (saved) {
        const parsed = JSON.parse(saved)
        setCounts(parsed.counts || {})
        setTotalToday(parsed.totalToday || 0)
      }

      // If user is logged in, load from Firebase and merge
      if (user) {
        try {
          // getUserData se Firebase data load hoga aur localStorage mein sync ho jayega
          // Authcontext already yeh handle kar raha hai
          const firebaseData = localStorage.getItem('tasbeehCounts')
          if (firebaseData) {
            const parsed = JSON.parse(firebaseData)
            setCounts(parsed.counts || {})
            setTotalToday(parsed.totalToday || 0)
          }
        } catch (error) {
          console.error('Error loading Firebase tasbeeh data:', error)
        }
      }
    }

    loadData()
  }, [user])

  const saveToStorage = (newCounts, total) => {
    localStorage.setItem(
      'tasbeehCounts',
      JSON.stringify({ counts: newCounts, totalToday: total })
    )
  }

  const syncToFirebase = async (newCounts, total) => {
    if (user) {
      await syncTasbeehToFirebase(user.uid, newCounts, total)
    }
  }

  const increment = useCallback(() => {
    // Check if user is logged in
    if (!user) {
      setShowAuthModal(true)
      return
    }

    const current = counts[selected.id] || 0
    const updated = { ...counts, [selected.id]: current + 1 }
    const newTotal = totalToday + 1
    setCounts(updated)
    setTotalToday(newTotal)
    
    // Save to localStorage
    saveToStorage(updated, newTotal)
    
    // Sync to Firebase
    syncToFirebase(updated, newTotal)

    // Ripple animation
    setRipple(true)
    setTimeout(() => setRipple(false), 150)
  }, [counts, selected, totalToday, user])

  // Keyboard support: spacebar
  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        increment()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [increment])

  const resetCurrent = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    const updated = { ...counts, [selected.id]: 0 }
    setCounts(updated)
    saveToStorage(updated, totalToday)
    syncToFirebase(updated, totalToday)
    toast.success(`${selected.transliteration} reset to 0`)
  }

  const resetAll = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setCounts({})
    setTotalToday(0)
    saveToStorage({}, 0)
    syncToFirebase({}, 0)
    toast.success('All counts reset')
  }

  const count = counts[selected.id] || 0
  const progress = Math.min((count / selected.target) * 100, 100)
  const laps = Math.floor(count / selected.target)

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-10 md:p-14 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white">
        <div className="relative z-10 max-w-3xl space-y-3">
          <p className="text-emerald-300 font-semibold uppercase tracking-widest text-sm">
            ذکرِ الٰہی
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Digital Tasbeeh
          </h1>
          <p className="text-white/75 text-lg">
            Count your Dhikr, track your daily Tasbeehat, and stay connected
            with Allah throughout Ramzan.
          </p>

          {/* Sign in required message if not logged in */}
          {!user && (
            <div className="mt-4 p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
              <p className="text-sm text-white/90">
                🔐 Sign in to save your counts and track progress across devices
              </p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-bold">{totalToday}</p>
              <p className="text-xs text-white/70 uppercase tracking-wide">
                Today's Total
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs text-white/70 uppercase tracking-wide">
                Current Count
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-bold">{laps}</p>
              <p className="text-xs text-white/70 uppercase tracking-wide">
                Rounds Done
              </p>
            </div>
          </div>
        </div>

        {/* Decorative */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-400/20 blur-3xl rounded-full" />
        <div className="absolute -left-6 top-0 w-32 h-32 bg-yellow-300/10 blur-2xl rounded-full" />
      </section>

      {/* Tasbeeh Selector */}
      <section>
        <h2 className="font-bold text-lg mb-4">Choose Tasbeeh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TASBEEHS.map((t) => {
            const c = counts[t.id] || 0
            const isActive = selected.id === t.id
            return (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? `border-emerald-500 shadow-lg shadow-emerald-500/20 ${t.bg}`
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-emerald-300'
                }`}
              >
                <p className={`text-xl font-bold font-arabic text-right ${t.accent}`}>
                  {t.arabic}
                </p>
                <p className="text-xs font-semibold mt-1 text-gray-700 dark:text-gray-300">
                  {t.transliteration}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t.translation}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-sm font-bold ${t.accent}`}>
                    {c} / {t.target}
                  </span>
                  {isActive && (
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                      Active ✓
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Main Counter */}
      <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 text-center">
        <p className="text-3xl font-arabic text-gray-800 dark:text-gray-100 mb-1">
          {selected.arabic}
        </p>
        <p className="text-sm text-gray-400 mb-6">{selected.translation}</p>

        {/* Progress Ring */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <svg className="w-48 h-48 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-100 dark:text-gray-800"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              stroke="url(#grad)"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
              className="transition-all duration-300"
            />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#6ee7b7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <p className="text-5xl font-bold text-gray-800 dark:text-gray-100">
              {count % selected.target === 0 && count > 0 ? selected.target : count % selected.target}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              of {selected.target}
            </p>
            {laps > 0 && (
              <p className="text-xs text-emerald-500 font-semibold mt-1">
                🔄 ×{laps} rounds
              </p>
            )}
          </div>
        </div>

        {/* Big Tap Button */}
        <button
          onClick={increment}
          className={`w-full max-w-xs mx-auto flex items-center justify-center gap-3 py-5 rounded-2xl text-white font-bold text-xl shadow-xl cursor-pointer transition-all duration-150 bg-gradient-to-r ${selected.color} ${
            ripple ? 'scale-95 shadow-inner' : 'hover:scale-105 hover:shadow-2xl'
          } active:scale-95`}
          aria-label="Count Tasbeeh"
        >
          <span className="text-2xl">📿</span>
          Tap to Count
          <span className="text-sm opacity-80">(or Space)</span>
        </button>

        {/* Controls */}
        <div className="flex gap-3 justify-center mt-5">
          <button
            onClick={resetCurrent}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-sm font-medium transition"
          >
            Reset Current
          </button>
          <button
            onClick={resetAll}
            className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 cursor-pointer text-sm font-medium transition"
          >
            Reset All
          </button>
        </div>

        {/* Auth note */}
        {!user && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            ⚠️ Counts are saved locally only. Sign in to sync across devices.
          </p>
        )}
      </section>

      {/* All Tasbeeh Summary */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800">
        <h2 className="font-bold text-lg mb-4">Today's Summary</h2>
        <div className="space-y-3">
          {TASBEEHS.map((t) => {
            const c = counts[t.id] || 0
            const p = Math.min((c / t.target) * 100, 100)
            return (
              <div key={t.id} className="flex items-center gap-3">
                <p className={`w-28 text-xs font-semibold truncate ${t.accent}`}>
                  {t.transliteration}
                </p>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full bg-gradient-to-r ${t.color} transition-all duration-500`}
                    style={{ width: `${p}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 w-14 text-right">
                  {c} / {t.target}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Auth Required Modal */}
      <AuthRequiredModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action="count tasbeeh and save your progress"
      />
    </div>
  )
}