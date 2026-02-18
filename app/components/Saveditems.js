'use client'

import { useAuth } from '../context/Authcontext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getUserData } from '../lib/userService'
import { featuredSurahs } from '../data/quran'
import { duas } from '../data/duas'
import Link from 'next/link'

export default function SavedItems() {
  const { user } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('surahs') // 'surahs' | 'duas'

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    loadUserData()
  }, [user, router])

  const loadUserData = async () => {
    const result = await getUserData(user.uid)
    if (result.success) {
      setUserData(result.data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-5xl">🌙</div>
      </div>
    )
  }

  if (!userData) return null

  const bookmarkedSurahs = userData.quranProgress?.bookmarkedSurahs || []
  const bookmarkedDuas = userData.bookmarkedDuas || []

  const savedSurahs = featuredSurahs.filter((surah) =>
    bookmarkedSurahs.includes(surah.id)
  )

  const savedDuas = duas.filter((dua) => bookmarkedDuas.includes(dua.id))

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white mb-8">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Saved Items</h1>
          <p className="text-white/75">Your bookmarked Surahs and Duas for quick access</p>
        </div>
        
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-400/20 blur-3xl rounded-full" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('surahs')}
          className={`px-6 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
            activeTab === 'surahs'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
          }`}
        >
          📖 Surahs ({bookmarkedSurahs.length})
        </button>
        <button
          onClick={() => setActiveTab('duas')}
          className={`px-6 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
            activeTab === 'duas'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
          }`}
        >
          🤲 Duas ({bookmarkedDuas.length})
        </button>
      </div>

      {/* Surahs Tab */}
      {activeTab === 'surahs' && (
        <div>
          {savedSurahs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {savedSurahs.map((surah) => (
                <div
                  key={surah.id}
                  className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Header gradient bar */}
                  <div className={`h-2 bg-gradient-to-r ${surah.color}`} />

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${surah.color} text-white`}>
                            #{surah.id}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            surah.type === 'Makki'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          }`}>
                            {surah.type}
                          </span>
                        </div>

                        <p className="font-arabic text-2xl font-bold text-gray-800 dark:text-white">
                          {surah.arabic}
                        </p>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">{surah.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {surah.urdu} • {surah.meaning}
                        </p>
                      </div>

                      <span className="text-2xl">🔖</span>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>📜 {surah.ayahs} Ayahs</span>
                      <span>📖 Juz {surah.juz}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <p className="text-5xl mb-3">📖</p>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">No saved Surahs yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Visit the Al-Quran page to bookmark your favorite Surahs
              </p>
              <Link
                href="/al-quran"
                className="inline-block px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition"
              >
                Browse Quran
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Duas Tab */}
      {activeTab === 'duas' && (
        <div>
          {savedDuas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedDuas.map((dua) => (
                <div
                  key={dua.id}
                  className="p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:scale-105 transition-transform duration-200 relative"
                >
                  <div className="absolute top-4 right-4">
                    <span className="text-2xl">🔖</span>
                  </div>

                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-3 ${
                    dua.type === 'Quranic'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                  }`}>
                    {dua.type}
                  </span>

                  <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                    {dua.title}
                  </h3>
                  
                  <p className="text-xl text-right font-arabic mb-3 text-gray-800 dark:text-gray-100">
                    {dua.arabic}
                  </p>
                  
                  <p className="text-sm italic text-emerald-700 dark:text-emerald-300 mb-2">
                    {dua.englishTranslation}
                  </p>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {dua.translation}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <p className="text-5xl mb-3">🤲</p>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">No saved Duas yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Visit the Duas & Hadith page to bookmark your favorite Duas
              </p>
              <Link
                href="/duas"
                className="inline-block px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition"
              >
                Browse Duas
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}