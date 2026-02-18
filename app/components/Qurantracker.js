'use client'

import { useState, useEffect } from 'react'

const TOTAL_JUZ = 30
const TOTAL_PAGES = 604

export default function QuranTracker() {
  const [juzRead, setJuzRead] = useState([])
  const [pagesToday, setPagesToday] = useState(0)
  const [inputPages, setInputPages] = useState('')
  const [goal, setGoal] = useState(1) // juz per day goal

  useEffect(() => {
    const saved = localStorage.getItem('quranProgress')
    if (saved) {
      const parsed = JSON.parse(saved)
      setJuzRead(parsed.juzRead || [])
      setPagesToday(parsed.pagesToday || 0)
      setGoal(parsed.goal || 1)
    }
  }, [])

  const save = (newJuz, newPages, newGoal) => {
    localStorage.setItem(
      'quranProgress',
      JSON.stringify({ juzRead: newJuz, pagesToday: newPages, goal: newGoal })
    )
  }

  const toggleJuz = (num) => {
    let updated
    if (juzRead.includes(num)) {
      updated = juzRead.filter((j) => j !== num)
    } else {
      updated = [...juzRead, num]
    }
    setJuzRead(updated)
    save(updated, pagesToday, goal)
  }

  const addPages = () => {
    const n = parseInt(inputPages)
    if (!n || isNaN(n)) return
    const updated = pagesToday + n
    setPagesToday(updated)
    save(juzRead, updated, goal)
    setInputPages('')
  }

  const resetToday = () => {
    setPagesToday(0)
    save(juzRead, 0, goal)
  }

  const percent = Math.round((juzRead.length / TOTAL_JUZ) * 100)

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-10 md:p-14 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white">
        <div className="relative z-10 max-w-3xl space-y-3">
          <p className="text-emerald-300 font-semibold uppercase tracking-widest text-sm">
            رمضان کریم
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Quran Tracker
          </h1>
          <p className="text-white/75 text-lg">
            Track your daily Quran recitation, mark completed Juz, and stay
            consistent throughout Ramzan.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-bold">{juzRead.length}</p>
              <p className="text-xs text-white/70 uppercase tracking-wide">
                Juz Done
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-bold">{TOTAL_JUZ - juzRead.length}</p>
              <p className="text-xs text-white/70 uppercase tracking-wide">
                Remaining
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-bold">{pagesToday}</p>
              <p className="text-xs text-white/70 uppercase tracking-wide">
                Pages Today
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-bold">{percent}%</p>
              <p className="text-xs text-white/70 uppercase tracking-wide">
                Complete
              </p>
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-400/20 blur-3xl rounded-full" />
        <div className="absolute -left-6 -top-6 w-40 h-40 bg-yellow-300/10 blur-2xl rounded-full" />
        {/* Quran icon decorative */}
        <svg
          className="absolute right-8 top-8 w-16 h-16 text-white/10"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h12V4H6zm2 3h8v1H8V7zm0 3h8v1H8v-1zm0 3h5v1H8v-1z" />
        </svg>
      </section>

      {/* Overall Progress Bar */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Overall Progress</h2>
          <span className="text-emerald-600 font-bold">{percent}%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
          <div
            className="h-4 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {juzRead.length} of {TOTAL_JUZ} Juz completed
        </p>
      </section>

      {/* Pages Today */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800">
        <h2 className="font-bold text-lg mb-4">Pages Read Today</h2>
        <div className="flex gap-3 items-center flex-wrap">
          <input
            type="number"
            value={inputPages}
            onChange={(e) => setInputPages(e.target.value)}
            placeholder="e.g. 5"
            className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 w-32 bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={addPages}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-semibold transition"
          >
            + Add Pages
          </button>
          <button
            onClick={resetToday}
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl transition"
          >
            Reset
          </button>
        </div>
        <p className="mt-3 text-emerald-600 font-semibold">
          {pagesToday} pages read today 🌙
        </p>
      </section>

      {/* Juz Grid */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800">
        <h2 className="font-bold text-lg mb-4">Mark Completed Juz</h2>
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-3">
          {Array.from({ length: TOTAL_JUZ }, (_, i) => i + 1).map((num) => {
            const done = juzRead.includes(num)
            return (
              <button
                key={num}
                onClick={() => toggleJuz(num)}
                className={`aspect-square rounded-xl font-bold text-sm transition-all duration-200 shadow-sm cursor-pointer ${
                  done
                    ? 'bg-emerald-500 text-white shadow-emerald-200 dark:shadow-emerald-900 scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900'
                }`}
              >
                {num}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Tap a Juz number to mark it as completed ✓
        </p>
      </section>
    </div>
  )
}