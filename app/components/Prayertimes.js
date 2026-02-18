'use client'

import { usePrayers } from '../context/PrayerContext'

const prayerMeta = {
  Fajr: { icon: '🌅', urdu: 'فجر', desc: 'Before sunrise', color: 'from-indigo-500 to-blue-600' },
  Dhuhr: { icon: '☀️', urdu: 'ظہر', desc: 'Midday', color: 'from-yellow-400 to-orange-500' },
  Asr: { icon: '🌤️', urdu: 'عصر', desc: 'Afternoon', color: 'from-amber-400 to-yellow-500' },
  Maghrib: { icon: '🌇', urdu: 'مغرب', desc: 'After sunset', color: 'from-orange-500 to-rose-600' },
  Isha: { icon: '🌙', urdu: 'عشاء', desc: 'Night', color: 'from-indigo-600 to-purple-700' },
}

const funFacts = [
  'Fajr prayer is mentioned 3 times in the Quran as "Salat-ul-Fajr".',
  'Dhuhr has 4 Fard + 4 Sunnah — praying Sunnah before & after earns great reward.',
  'Asr prayer is called "Salat-ul-Wusta" — the middle prayer.',
  'Maghrib is the shortest Fard prayer with only 3 rakats.',
  'Isha prayer extends until midnight for maximum benefit.',
]

export default function PrayerTimes() {
  const { prayers, loading, city, showCitySelect, fallbackCities, handleManualCity } = usePrayers()

  const now = new Date()
  const timeString = now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
  const dateString = now.toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const nextPrayer = prayers.find((p) => p.isNext)

  return (
    <div className="space-y-10 pb-12">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl p-10 md:p-14 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white">
        <div className="relative z-10 max-w-3xl space-y-3">
          <p className="text-emerald-300 font-semibold uppercase tracking-widest text-sm">
            نماز کے اوقات
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Prayer Times</h1>
          <p className="text-white/75 text-lg">
            Accurate daily prayer times based on your location. Never miss a prayer.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-bold font-mono">{timeString}</p>
              <p className="text-xs text-white/60 uppercase tracking-wide">Current Time</p>
            </div>
            {nextPrayer && (
              <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
                <p className="text-2xl font-bold">{nextPrayer.name}</p>
                <p className="text-xs text-white/60 uppercase tracking-wide">Next Prayer</p>
              </div>
            )}
            {city && (
              <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-center">
                <p className="text-2xl font-bold">📍</p>
                <p className="text-xs text-white/60 uppercase tracking-wide">{city}</p>
              </div>
            )}
          </div>

          {showCitySelect && (
            <div className="mt-4">
              <label className="block mb-1 text-white/70 text-sm">Select your city:</label>
              <select
                className="p-2 rounded-xl text-gray-900 bg-white font-medium focus:outline-none"
                onChange={(e) => handleManualCity(fallbackCities.find((c) => c.name === e.target.value))}
                defaultValue=""
              >
                <option value="" disabled>-- Select City --</option>
                {fallbackCities.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/30 blur-3xl rounded-full" />
        <div className="absolute right-8 top-8 w-20 h-20 bg-yellow-300/10 blur-xl rounded-full" />
        {/* <svg className="absolute right-6 top-6 w-24 h-24 text-white/5" fill="currentColor" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" />
          <circle cx="62" cy="40" r="35" fill="#065f46" />
        </svg> */}
      </section>

      {/* ── Date Banner ── */}
      <div className="text-center text-gray-500 dark:text-gray-400 text-sm font-medium">
        📅 {dateString}
      </div>

      {/* ── Prayer Cards ── */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin text-5xl mb-4">🌙</div>
          <p className="text-gray-400">Loading prayer times...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {prayers.map((p) => {
            const meta = prayerMeta[p.name] || {}
            return (
              <div
                key={p.name}
                className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 ${
                  p.isNext
                    ? 'bg-gradient-to-br ' + meta.color + ' text-white shadow-xl scale-105'
                    : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {p.isNext && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs bg-white/25 px-2 py-0.5 rounded-full font-medium">Next</span>
                  </div>
                )}
                <p className="text-3xl mb-3">{meta.icon}</p>
                <p className={`font-arabic text-xl font-bold mb-0.5 ${p.isNext ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                  {meta.urdu}
                </p>
                <p className={`font-semibold text-sm mb-1 ${p.isNext ? 'text-white/80' : 'text-gray-600 dark:text-gray-300'}`}>
                  {p.name}
                </p>
                <p className={`text-2xl font-bold font-mono ${p.isNext ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {p.time}
                </p>
                <p className={`text-xs mt-1 ${p.isNext ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}`}>
                  {meta.desc}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Timeline View ── */}
      {!loading && prayers.length > 0 && (
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-lg mb-5 text-gray-800 dark:text-white">Prayer Timeline</h2>
          <div className="space-y-3">
            {prayers.map((p, i) => {
              const meta = prayerMeta[p.name] || {}
              return (
                <div key={p.name} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 bg-gradient-to-br ${meta.color || 'from-gray-400 to-gray-600'} shadow`}>
                    {meta.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-white">{p.name}</span>
                        <span className="ml-2 text-xs text-gray-400">({meta.urdu})</span>
                      </div>
                      <span className={`font-mono font-bold text-sm ${p.isNext ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300'}`}>
                        {p.time}
                      </span>
                    </div>
                    {i < prayers.length - 1 && (
                      <div className="mt-2 h-px bg-gray-100 dark:bg-gray-800" />
                    )}
                  </div>
                  {p.isNext && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Fun Facts ── */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          📚 Prayer Knowledge
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(prayerMeta).map(([name, meta], i) => (
            <div
              key={name}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-lg mb-3 shadow`}>
                {meta.icon}
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white">
                {name} <span className="font-arabic text-emerald-600 dark:text-emerald-400">({meta.urdu})</span>
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{funFacts[i]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quran Reminder Banner ── */}
      <section className="rounded-2xl p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
        <p className="font-arabic text-2xl text-emerald-700 dark:text-emerald-300 mb-2">
          إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {`"Indeed, prayer has been decreed upon the believers a decree of specified times." — Surah An-Nisa 4:103`}
        </p>
      </section>

    </div>
  )
}