'use client'

import { useState, useEffect } from 'react'
import { featuredSurahs, sipara } from '../data/quran'
import { useAuth } from '../context/Authcontext'
import { syncQuranToFirebase } from '../lib/userService'
import AuthRequiredModal from '../components/AuthRequiredModal'
import toast from 'react-hot-toast'

const READING_LOG_KEY = 'quranReadingLog'

export default function AlQuran() {
  const { user } = useAuth()
  const [view, setView] = useState('sipara') // 'sipara' | 'surahs' | 'bookmarks'
  const [readSipara, setReadSipara] = useState([])
  const [bookmarkedSurahs, setBookmarkedSurahs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSipara, setSelectedSipara] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      // Load from localStorage first
      const log = localStorage.getItem(READING_LOG_KEY)
      if (log) {
        const parsed = JSON.parse(log)
        setReadSipara(parsed.readSipara || [])
        setBookmarkedSurahs(parsed.bookmarkedSurahs || [])
      }

      // If user is logged in, Firebase data will be loaded via Authcontext
      // and synced to localStorage
    }

    loadData()
  }, [])

  const save = async (rs, bs, action = 'update') => {
    // Always save to localStorage
    localStorage.setItem(READING_LOG_KEY, JSON.stringify({ readSipara: rs, bookmarkedSurahs: bs }))
    
    // Sync to Firebase if user is logged in
    if (user) {
      await syncQuranToFirebase(user.uid, {
        readSipara: rs,
        bookmarkedSurahs: bs,
        lastRead: new Date().toISOString(),
      })
    }
  }

  const toggleSipara = async (id) => {
    // Check if user is logged in
    if (!user) {
      setPendingAction({ type: 'sipara', id })
      setShowAuthModal(true)
      return
    }

    const updated = readSipara.includes(id)
      ? readSipara.filter((s) => s !== id)
      : [...readSipara, id]
    
    setReadSipara(updated)
    await save(updated, bookmarkedSurahs)
    
    if (readSipara.includes(id)) {
      toast.success('Sipara unmarked')
    } else {
      toast.success('Sipara marked as read! 📖')
    }
  }

  const toggleBookmark = async (id) => {
    // Check if user is logged in
    if (!user) {
      setPendingAction({ type: 'bookmark', id })
      setShowAuthModal(true)
      return
    }

    const updated = bookmarkedSurahs.includes(id)
      ? bookmarkedSurahs.filter((s) => s !== id)
      : [...bookmarkedSurahs, id]
    
    setBookmarkedSurahs(updated)
    await save(readSipara, updated)
    
    if (bookmarkedSurahs.includes(id)) {
      toast.success('Bookmark removed')
    } else {
      toast.success('Surah bookmarked! 🔖')
    }
  }

  const handleAuthSuccess = async () => {
    // Perform pending action after successful sign-in
    if (pendingAction) {
      if (pendingAction.type === 'sipara') {
        await toggleSipara(pendingAction.id)
      } else if (pendingAction.type === 'bookmark') {
        await toggleBookmark(pendingAction.id)
      }
      setPendingAction(null)
    }
  }

  const resetProgress = async () => {
    if (!user) {
      setPendingAction({ type: 'reset' })
      setShowAuthModal(true)
      return
    }

    setReadSipara([])
    await save([], bookmarkedSurahs)
    toast.success('Progress reset')
  }

  const progress = Math.round((readSipara.length / 30) * 100)

  const filteredSipara = sipara.filter(
    (s) =>
      s.name.includes(searchQuery) ||
      s.urdu.includes(searchQuery) ||
      s.startSurah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.id).includes(searchQuery)
  )

  return (
    <div className="space-y-10 pb-12">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl p-10 md:p-16 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white">
        <div className="relative z-10 max-w-3xl space-y-4">
          <p className="text-emerald-300 font-semibold uppercase tracking-widest text-sm">
            کلامِ الٰہی
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Al-Quran
          </h1>
          <p className="text-white/75 text-lg max-w-xl">
            Explore all 30 Sipara, track your reading progress, and read the blessed words of Allah.
          </p>

          {/* Sign in required message if not logged in */}
          {!user && (
            <div className="mt-4 p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
              <p className="text-sm text-white/90">
                🔐 Sign in to save your reading progress and bookmarks across devices
              </p>
            </div>
          )}

          {/* Progress */}
          <div className="mt-6 bg-white/10 backdrop-blur rounded-2xl p-5 max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white/80">Reading Progress</span>
              <span className="text-emerald-300 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 bg-gradient-to-r from-emerald-300 to-yellow-300 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-white/60">
              <span>{readSipara.length} / 30 Sipara completed</span>
              <span>{30 - readSipara.length} remaining</span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-2 text-center">
              <p className="text-xl font-bold">114</p>
              <p className="text-xs text-white/60">Surahs</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-2 text-center">
              <p className="text-xl font-bold">30</p>
              <p className="text-xs text-white/60">Sipara</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-2 text-center">
              <p className="text-xl font-bold">6,236</p>
              <p className="text-xs text-white/60">Ayahs</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-2 text-center">
              <p className="text-xl font-bold">604</p>
              <p className="text-xs text-white/60">Pages</p>
            </div>
          </div>
        </div>

        {/* Decoratives */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-teal-400/20 blur-3xl rounded-full" />
        <div className="absolute right-4 top-4 w-32 h-32 bg-yellow-300/10 blur-2xl rounded-full" />
      </section>

      {/* ── View Tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'sipara', label: '📖 30 Sipara' },
          { key: 'surahs', label: '✨ Featured Surahs' },
          { key: 'bookmarks', label: `🔖 Bookmarks (${bookmarkedSurahs.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`px-5 py-2 rounded-full font-semibold cursor-pointer transition-all ${
              view === tab.key
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Search (visible in sipara view) ── */}
      {view === 'sipara' && (
        <div className="relative max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search Sipara by name or Surah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 dark:text-white placeholder-gray-400"
          />
        </div>
      )}

      {/* ── SIPARA VIEW ── */}
      {view === 'sipara' && (
        <div className="space-y-6">
          {/* Selected Sipara Detail */}
          {selectedSipara && (
            <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald-700 to-teal-800 text-white">
              <button
                onClick={() => setSelectedSipara(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white text-xl cursor-pointer"
              >
                ✕
              </button>
              <p className="text-xs uppercase tracking-widest text-emerald-300 mb-1">
                Para {selectedSipara.id} of 30
              </p>
              <h2 className="text-3xl font-bold font-arabic mb-1">{selectedSipara.name}</h2>
              <p className="text-white/70 text-lg">{selectedSipara.urdu}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                <div className="bg-white/15 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold">{selectedSipara.id}</p>
                  <p className="text-xs text-white/60">Para No.</p>
                </div>
                <div className="bg-white/15 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold">{selectedSipara.ayahs}</p>
                  <p className="text-xs text-white/60">Ayahs</p>
                </div>
                <div className="bg-white/15 rounded-xl p-3 text-center">
                  <p className="text-sm font-semibold">{selectedSipara.startSurah}</p>
                  <p className="text-xs text-white/60">Starts at</p>
                </div>
                <div className="bg-white/15 rounded-xl p-3 text-center">
                  <p className="text-sm font-semibold">{selectedSipara.endSurah}</p>
                  <p className="text-xs text-white/60">Ends at</p>
                </div>
              </div>
              <button
                onClick={() => toggleSipara(selectedSipara.id)}
                className={`mt-5 px-6 py-2.5 rounded-xl font-bold cursor-pointer transition-all ${
                  readSipara.includes(selectedSipara.id)
                    ? 'bg-white text-emerald-700'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                {readSipara.includes(selectedSipara.id) ? '✅ Marked as Read' : '📖 Mark as Read'}
              </button>
            </div>
          )}

          {/* Sipara Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {filteredSipara.map((s) => {
              const isRead = readSipara.includes(s.id)
              const isSelected = selectedSipara?.id === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSipara(isSelected ? null : s)}
                  className={`relative p-4 rounded-2xl text-left cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'ring-2 ring-emerald-500 scale-105 shadow-lg shadow-emerald-500/20'
                      : 'hover:scale-105 hover:shadow-md'
                  } ${
                    isRead
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-400 dark:border-emerald-600'
                      : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {/* Para number badge */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                    isRead
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}>
                    {s.id}
                  </div>

                  <p className="font-arabic text-lg font-bold text-gray-800 dark:text-white leading-tight">
                    {s.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{s.startSurah}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{s.ayahs} ayahs</p>

                  {isRead && (
                    <span className="absolute top-2 right-2 text-emerald-500 text-sm">✓</span>
                  )}
                </button>
              )
            })}
          </div>

          {filteredSipara.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">🔍</p>
              <p>No Sipara found for "{searchQuery}"</p>
            </div>
          )}

          {/* Progress Summary */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-white mb-3">Your Progress</h3>
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Completed ({readSipara.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Remaining ({30 - readSipara.length})
                </span>
              </div>
            </div>
            {readSipara.length > 0 && (
              <button
                onClick={resetProgress}
                className="mt-3 text-xs text-red-400 hover:text-red-600 cursor-pointer transition"
              >
                Reset Progress
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── FEATURED SURAHS VIEW ── */}
      {view === 'surahs' && (
        <div className="space-y-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Beloved and commonly-recited Surahs of the Quran
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredSurahs.map((s) => {
              const isBookmarked = bookmarkedSurahs.includes(s.id)
              return (
                <div
                  key={s.id}
                  className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Header gradient bar */}
                  <div className={`h-2 bg-gradient-to-r ${s.color}`} />

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${s.color} text-white`}>
                            #{s.id}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            s.type === 'Makki'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          }`}>
                            {s.type}
                          </span>
                        </div>

                        <p className="font-arabic text-2xl font-bold text-gray-800 dark:text-white">
                          {s.arabic}
                        </p>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">{s.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {s.urdu} • {s.meaning}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleBookmark(s.id)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                          isBookmarked
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-emerald-500'
                        }`}
                        title="Bookmark"
                      >
                        {isBookmarked ? '🔖' : '📌'}
                      </button>
                    </div>

                    {/* Opening Ayah */}
                    <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                      <p className="font-arabic text-xl text-right text-gray-800 dark:text-white mb-2 leading-relaxed">
                        {s.openingAyah}
                      </p>
                      <p className="text-xs italic text-gray-500 dark:text-gray-400">{s.translation}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>📜 {s.ayahs} Ayahs</span>
                      <span>📖 Juz {s.juz}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── BOOKMARKS VIEW ── */}
      {view === 'bookmarks' && (
        <div>
          {bookmarkedSurahs.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-600">
              <p className="text-5xl mb-3">📌</p>
              <p className="font-medium">No bookmarks yet</p>
              <p className="text-sm mt-1">Go to Featured Surahs and bookmark your favorites</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredSurahs
                .filter((s) => bookmarkedSurahs.includes(s.id))
                .map((s) => (
                  <div
                    key={s.id}
                    className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-5"
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${s.color}`} />
                    <div className="pl-3">
                      <p className="font-arabic text-2xl font-bold text-gray-800 dark:text-white">{s.arabic}</p>
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">{s.name} — {s.meaning}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{s.ayahs} Ayahs • {s.type} • Juz {s.juz}</p>
                    </div>
                    <button
                      onClick={() => toggleBookmark(s.id)}
                      className="absolute top-4 right-4 text-emerald-500 cursor-pointer hover:text-red-500 transition"
                      title="Remove bookmark"
                    >
                      🔖
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ── Bismillah Banner ── */}
      <section className="rounded-2xl p-8 bg-gradient-to-br from-emerald-700 to-teal-800 text-white text-center">
        <p className="font-arabic text-3xl md:text-4xl leading-relaxed mb-3">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <p className="text-white/75 text-sm">
          In the name of Allah, the Most Gracious, the Most Merciful
        </p>
        <p className="font-arabic text-xl mt-6 leading-loose text-white/80">
          الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ • الرَّحْمَٰنِ الرَّحِيمِ • مَالِكِ يَوْمِ الدِّينِ
        </p>
        <p className="text-emerald-300 text-xs mt-2">— Surah Al-Fatihah 1:1-4</p>
      </section>

      {/* Auth Required Modal */}
      <AuthRequiredModal 
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false)
          setPendingAction(null)
        }}
        onSuccess={handleAuthSuccess}
        action="save your Quran progress and bookmarks"
      />
    </div>
  )
}