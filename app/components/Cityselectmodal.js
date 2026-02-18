'use client'

import { useState } from 'react'
import { usePrayers } from '../context/PrayerContext'

const provinceIcons = {
  Punjab: '🟡',
  Sindh: '🟢',
  KPK: '🔵',
  Balochistan: '🟤',
  Federal: '🔴',
  AJK: '🟣',
  GB: '⚪',
}

export default function CitySelectModal() {
  const {
    showCitySelect,
    canCloseModal,
    fallbackCities,
    citiesByProvince,
    handleManualCity,
    closeModal,
    locationStatus,
  } = usePrayers()

  const [search, setSearch] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('All')

  if (!showCitySelect) return null

  const provinces = ['All', ...Object.keys(citiesByProvince)]

  const filtered = fallbackCities.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchProvince = selectedProvince === 'All' || c.province === selectedProvince
    return matchSearch && matchProvince
  })

  return (
    // Backdrop — clicking outside only closes in manual mode
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={canCloseModal ? closeModal : undefined}
    >
      {/* Modal card — stop propagation so inner clicks don't close it */}
      <div
        className="bg-white dark:bg-[#0f1923] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-emerald-900/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 text-white">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">📍</span>
            <h2 className="text-xl font-bold">Select Your City</h2>
          </div>
          <p className="text-white/70 text-sm">
            {locationStatus === 'denied'
              ? 'Location access blocked. Please select your city manually.'
              : 'Choose your city to get accurate prayer times'}
          </p>

          {/* ✅ Cross only shown in manual/changeable mode */}
          {canCloseModal && (
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 cursor-pointer transition text-white text-lg font-bold"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>

        <div className="p-5 space-y-4">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-emerald-900/50 bg-gray-50 dark:bg-[#1a2535] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Province Filter */}
          <div className="flex gap-2 flex-wrap">
            {provinces.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedProvince(p)}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  selectedProvince === p
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                    : 'bg-gray-100 dark:bg-[#1a2535] text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                }`}
              >
                {p === 'All' ? '🗺️ All' : `${provinceIcons[p] || '📍'} ${p}`}
              </button>
            ))}
          </div>

          {/* Cities Grid */}
          <div className="max-h-64 overflow-y-auto rounded-xl border border-gray-100 dark:border-emerald-900/30">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-400 dark:text-gray-600">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-sm">No city found for "{search}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1 p-2">
                {filtered.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleManualCity(c)}
                    className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 cursor-pointer transition text-left group"
                  >
                    <span className="text-sm">{provinceIcons[c.province] || '📍'}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                        {c.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{c.province}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            {filtered.length} cities • Your selection will be saved automatically
          </p>
        </div>
      </div>
    </div>
  )
}