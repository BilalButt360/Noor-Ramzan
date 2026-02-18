'use client'

import { useAuth } from '../context/Authcontext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getUserData } from '../lib/userService'

export default function MyProgress() {
  const { user } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    loadUserProgress()
  }, [user, router])

  const loadUserProgress = async () => {
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

  const quranProgress = userData.quranProgress || {}
  const tasbeehCounts = userData.tasbeehCounts || {}
  const totalTasbeeh = userData.totalTasbeeh || 0

  // Calculate Quran stats
  const totalSipara = 30
  const readSipara = quranProgress.readSipara?.length || 0
  const quranPercentage = Math.round((readSipara / totalSipara) * 100)
  const bookmarkedSurahs = quranProgress.bookmarkedSurahs?.length || 0

  // Calculate Tasbeeh stats
  const tasbeehTypes = Object.keys(tasbeehCounts).length
  const mostCountedTasbeeh = Object.entries(tasbeehCounts).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white mb-8">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Progress</h1>
          <p className="text-white/75">Track your Ramzan journey and spiritual growth</p>
        </div>
        
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-400/20 blur-3xl rounded-full" />
        <div className="absolute -left-8 -top-8 w-48 h-48 bg-yellow-300/10 blur-2xl rounded-full" />
      </div>

      <div className="space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📖</span>
              <span className="text-2xl font-bold">{quranPercentage}%</span>
            </div>
            <p className="text-white/80 text-sm">Quran Progress</p>
            <p className="text-white/60 text-xs mt-1">{readSipara}/{totalSipara} Sipara completed</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📿</span>
              <span className="text-2xl font-bold">{totalTasbeeh}</span>
            </div>
            <p className="text-white/80 text-sm">Total Tasbeeh</p>
            <p className="text-white/60 text-xs mt-1">{tasbeehTypes} types counted</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">🔖</span>
              <span className="text-2xl font-bold">{bookmarkedSurahs}</span>
            </div>
            <p className="text-white/80 text-sm">Bookmarked Surahs</p>
            <p className="text-white/60 text-xs mt-1">Saved for quick access</p>
          </div>
        </div>

        {/* Quran Progress Details */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-white">📖 Quran Reading Progress</h2>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{quranPercentage}%</span>
          </div>
          
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 mb-4 overflow-hidden">
            <div
              className="h-4 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all duration-700"
              style={{ width: `${quranPercentage}%` }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{readSipara}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sipara Completed</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{totalSipara - readSipara}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Remaining</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{bookmarkedSurahs}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bookmarked</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {quranProgress.lastRead ? new Date(quranProgress.lastRead).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last Read</p>
            </div>
          </div>

          {readSipara > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>✓</span>
              <span>Completed Sipara: {quranProgress.readSipara?.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Tasbeeh Progress */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold dark:text-white mb-4">📿 Tasbeeh Counter Progress</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{totalTasbeeh}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Total Count</p>
            </div>
            
            {mostCountedTasbeeh && (
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  {mostCountedTasbeeh[1]}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Most Counted (ID: {mostCountedTasbeeh[0]})
                </p>
              </div>
            )}
          </div>

          {Object.keys(tasbeehCounts).length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Breakdown by Type:</p>
              {Object.entries(tasbeehCounts).map(([id, count]) => (
                <div key={id} className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${(count / totalTasbeeh) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-20 text-right">
                    ID {id}: {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Duas Bookmarks */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold dark:text-white mb-4">🤲 Bookmarked Duas</h2>
          
          {userData.bookmarkedDuas && userData.bookmarkedDuas.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {userData.bookmarkedDuas.map((duaId) => (
                <div
                  key={duaId}
                  className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 text-center"
                >
                  <p className="text-2xl mb-1">🤲</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Dua #{duaId}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 dark:text-gray-600">
              <p className="text-3xl mb-2">🔖</p>
              <p>No duas bookmarked yet</p>
              <p className="text-sm mt-1">Visit the Duas page to bookmark your favorites</p>
            </div>
          )}
        </div>

        {/* Motivational Section */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 text-white text-center">
          <p className="text-3xl mb-3">🌟</p>
          <p className="text-xl font-bold mb-2">Keep Going!</p>
          <p className="text-white/80 max-w-md mx-auto">
            {quranPercentage >= 50 
              ? "You're halfway through the Quran! May Allah reward your dedication."
              : "Every ayah you read brings you closer to Allah. Keep up the great work!"}
          </p>
        </div>
      </div>
    </div>
  )
}