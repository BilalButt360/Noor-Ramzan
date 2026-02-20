// app/page.js
'use client'

import Countdown from './components/Countdown'
import { usePrayers } from './context/PrayerContext'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const features = [
  {
    icon: '🕌',
    title: 'Prayer Times',
    desc: 'Accurate daily Fajr, Dhuhr, Asr, Maghrib & Isha based on your location.',
    href: '/prayer-times',
    color: 'from-sky-500 to-sky-700',
  },
  {
    icon: '📖',
    title: 'Al-Quran',
    desc: 'Read all 30 Sipara with Arabic text, translations and bookmarks.',
    href: '/al-quran',
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    icon: '📅',
    title: 'Ramzan Calendar',
    desc: 'Full 30-day Sehri & Iftar timetable with special nights highlighted.',
    href: '/ramzan-calendar',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: '🤲',
    title: 'Duas & Hadith',
    desc: 'Quranic and Masnoon duas with Urdu/English translation and bookmarks.',
    href: '/duas',
    color: 'from-purple-500 to-purple-700',
  },
  {
    icon: '📿',
    title: 'Digital Tasbeeh',
    desc: 'Count your Dhikr digitally — SubhanAllah, Alhamdulillah, Allahu Akbar.',
    href: '/tasbeeh',
    color: 'from-rose-500 to-rose-700',
  },
  // ✅ NEW: Bayanat Library Feature
  {
    icon: '🎙️',
    title: 'Bayanat Library',
    desc: 'Listen to lectures by Dr. Israr, Molana Tariq Jameel, Dr. Zakir Naik & more.',
    href: '/bayanat-library',
    color: 'from-indigo-500 to-indigo-700',
    // badge: 'New',
  },
]

const dailyTips = [
  'Make dua at the time of Iftar — it is never rejected.',
  'Recite Durood Ibrahim after every Fajr prayer.',
  'Give in charity (Sadaqah) every day of Ramzan, even a little.',
  'Read at least one page of the Quran after every prayer.',
  'Make Istighfar 100 times daily — especially in the last 10 nights.',
  'Pray Tarawih with full focus — each night brings immense reward.',
  'Observe Itikaf in the last 10 nights if possible.',
]

const ramzanPhases = [
  {
    days: '1–10',
    arabic: 'رحمت',
    english: 'Days of Mercy',
    desc: 'Allah showers His infinite mercy upon believers.',
    color: 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800',
    accent: 'text-sky-600 dark:text-sky-400',
    icon: '💙',
  },
  {
    days: '11–20',
    arabic: 'مغفرت',
    english: 'Days of Forgiveness',
    desc: 'Seek forgiveness — Allah forgives abundantly.',
    color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    accent: 'text-purple-600 dark:text-purple-400',
    icon: '💜',
  },
  {
    days: '21–30',
    arabic: 'نجات',
    english: 'Days of Salvation',
    desc: 'Liberation from hellfire — seek Laylatul Qadr.',
    color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
    accent: 'text-emerald-600 dark:text-emerald-400',
    icon: '🌟',
  },
]

export default function HomePage() {
  const { prayers, loading, city, changeCity } = usePrayers()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('🌅 Subah Bakhair')
    else if (hour < 17) setGreeting('☀️ Do Pehar Bakhair')
    else if (hour < 20) setGreeting('🌇 Sham Bakhair')
    else setGreeting('🌙 Raat Bakhair')
  }, [])

  const randomTip = dailyTips[new Date().getDate() % dailyTips.length]
  const currentRamzanDay = Math.floor((new Date() - new Date(2026, 1, 19)) / (1000 * 60 * 60 * 24)) + 1

  return (
    <div className="space-y-12 pb-12">

      {/* ── Hero Section ── */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8 md:p-14 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white"
      >
        <div className="relative z-10 max-w-3xl space-y-5">
          
          {/* Greeting Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium"
          >
            <span>{greeting}</span>
            <span>•</span>
            <span>🌙 رمضان 1447</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold leading-tight"
          >
            Your Ramzan<br />
            <span className="text-emerald-300">Companion</span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/75 text-lg max-w-xl"
          >
            Prayer times, Al-Quran, Duas, Tasbeeh counter, Bayanat Library and Ibadah tracker — everything you need for a blessed Ramzan.
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-sm text-white/60 mb-2 uppercase tracking-widest font-medium">
              Ramzan Countdown
            </p>
            <Countdown />
          </motion.div>

          {/* City Display with Change Option */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3"
          >
            {city ? (
              <>
                <div className="flex items-center gap-2 text-white/80 text-sm bg-white/10 px-3 py-1.5 rounded-full">
                  <span>📍</span> {city}
                </div>
                <button
                  onClick={changeCity}
                  className="text-xs text-white/60 hover:text-white underline underline-offset-2 cursor-pointer transition"
                >
                  Change City
                </button>
              </>
            ) : !loading && (
              <button
                onClick={changeCity}
                className="flex items-center gap-2 text-white/80 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full cursor-pointer transition"
              >
                <span>📍</span> Select Your City
              </button>
            )}
          </motion.div>

          {/* Quick Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 pt-2"
          >
            <Link
              href="/al-quran"
              className="bg-white text-emerald-700 font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow-lg"
            >
              📖 Read Quran
            </Link>
            <Link
              href="/prayer-times"
              className="bg-white/20 backdrop-blur text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-white/30 transition border border-white/30"
            >
              🕌 Prayer Times
            </Link>
            <Link
              href="/bayanat-library"
              className="bg-white/10 backdrop-blur text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-white/20 transition border border-white/20"
            >
              🎙️ Bayanat
            </Link>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-400/20 blur-3xl rounded-full" />
        <div className="absolute right-0 top-0 w-48 h-48 bg-yellow-300/10 blur-2xl rounded-full" />
        
      </motion.section>

      {/* ── Prayer Times Quick View ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold dark:text-white">Today's Prayer Times</h2>
          <Link href="/prayer-times" className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline flex items-center gap-1">
            View all <span>→</span>
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse h-24" />
            ))}
          </div>
        )}

        {!loading && prayers.length === 0 && (
          <div className="text-center py-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 mb-3">Prayer times not loaded yet</p>
            <button
              onClick={changeCity}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition cursor-pointer"
            >
              📍 Select City to Load Prayer Times
            </button>
          </div>
        )}

        {!loading && prayers.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {prayers.map((p, index) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`p-4 rounded-2xl transition-all duration-200 ${
                  p.isNext
                    ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 scale-105'
                    : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md'
                }`}
              >
                <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                  p.isNext ? 'text-emerald-200' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {p.name}
                </p>
                <p className="text-xl font-bold dark:text-white">
                  {p.time}
                </p>
                {p.isNext && (
                  <span className="mt-2 inline-block text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    Next ▶
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Current Ramzan Day Info */}
        {currentRamzanDay >= 1 && currentRamzanDay <= 30 && (
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              🌙 Ramzan ka {currentRamzanDay} wa din • {currentRamzanDay <= 10 ? 'Rahmat' : currentRamzanDay <= 20 ? 'Maghfirat' : 'Nijaat'} ka ashra
            </p>
          </div>
        )}
      </motion.section>

      {/* ── Daily Tip ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800"
      >
        <div className="flex gap-4 items-start">
          <span className="text-3xl">💡</span>
          <div>
            <p className="text-xs uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400 mb-1">
              Daily Ramzan Tip
            </p>
            <p className="text-gray-800 dark:text-gray-100 font-medium text-base">{randomTip}</p>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-300/20 blur-2xl rounded-full" />
      </motion.section>

      {/* ── Features Grid ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-bold dark:text-white mb-5">Explore Noor Ramzan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, index) => (
            <motion.div
              key={f.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative"
            >
              <Link
                href={f.href}
                className="group relative overflow-hidden p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300 block"
              >
                {/* Badge for new feature */}
                {f.badge && (
                  <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
                    {f.badge}
                  </span>
                )}
                
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} text-white text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="font-bold dark:text-white mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                <span className="absolute bottom-4 right-4 text-gray-300 dark:text-gray-700 group-hover:text-emerald-500 transition-colors text-lg">→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Ramzan Phases ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-xl font-bold dark:text-white mb-5">
          🌙 The Three Ashras of Ramzan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ramzanPhases.map((phase, index) => (
            <motion.div
              key={phase.days}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`rounded-2xl p-6 border ${phase.color} transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{phase.icon}</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white/60 dark:bg-black/20 ${phase.accent}`}>
                  Days {phase.days}
                </span>
              </div>
              <p className={`text-2xl font-bold ${phase.accent}`}>{phase.arabic}</p>
              <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{phase.english}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{phase.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Hadith Banner ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-emerald-700 to-emerald-900 text-white text-center"
      >
        <p className="text-sm uppercase tracking-widest text-emerald-300 mb-3 font-medium">
          Hadith of Ramzan
        </p>
        <p className="text-2xl font-arabic mb-3 leading-relaxed">
          مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ
        </p>
        <p className="text-white/80 max-w-xl mx-auto text-sm leading-relaxed">
          {`"Whoever fasts in Ramzan with faith and seeking reward, all his previous sins will be forgiven."`}
        </p>
        <p className="text-emerald-300 text-xs mt-3 font-medium">— Bukhari & Muslim</p>
        
        {/* Decorative elements */}
        <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full" />
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-yellow-300/10 blur-2xl rounded-full" />
      </motion.section>
    </div>
  )
}