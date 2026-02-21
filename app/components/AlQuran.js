'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/Authcontext'
import AuthRequiredModal from './AuthRequiredModal'
import QuranReader from './QuranReader'

export default function AlQuran() {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [siparaProgress, setSiparaProgress] = useState(0)
  const [pagesRead, setPagesRead] = useState(0)

  const handleProgressUpdate = (completedSipara, readPagesCount) => {
    const progress = Math.round((completedSipara.length / 30) * 100)
    setSiparaProgress(progress)
    setPagesRead(readPagesCount)
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Single Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl p-10 md:p-16 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white"
      >
        {/* Decorative Elements */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-400/20 blur-3xl rounded-full" />
        <div className="absolute -left-8 -top-8 w-48 h-48 bg-yellow-300/10 blur-2xl rounded-full" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Quran Icon Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 bg-white/20 backdrop-blur px-5 py-2.5 rounded-full cursor-default"
          >
            <span className="text-2xl">📖</span>
            <span className="text-emerald-200 font-semibold tracking-wide">القرآن الكريم</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold leading-tight"
          >
            Al-Quran
            <span className="block text-2xl md:text-3xl text-emerald-300 font-normal mt-2">
              The Holy Quran
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 text-lg max-w-2xl"
          >
            Read the complete Quran with beautiful Arabic text. Track your reading progress 
            page by page and bookmark your favorite verses for easy access.
          </motion.p>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
          >
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/20 cursor-default hover:bg-white/20 transition-all">
              <p className="text-3xl font-bold">114</p>
              <p className="text-xs text-white/70 uppercase tracking-wider mt-1">Surahs</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/20 cursor-default hover:bg-white/20 transition-all">
              <p className="text-3xl font-bold">30</p>
              <p className="text-xs text-white/70 uppercase tracking-wider mt-1">Sipara</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/20 cursor-default hover:bg-white/20 transition-all">
              <p className="text-3xl font-bold">6,236</p>
              <p className="text-xs text-white/70 uppercase tracking-wider mt-1">Ayahs</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/20 cursor-default hover:bg-white/20 transition-all">
              <p className="text-3xl font-bold">604</p>
              <p className="text-xs text-white/70 uppercase tracking-wider mt-1">Pages</p>
            </div>
          </motion.div>

          {/* Progress Stats for Logged-in Users */}
          {user && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
            >
              {/* Sipara Progress */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white/90 flex items-center gap-2">
                    <span>📚</span> Sipara Completion
                  </span>
                  <span className="text-emerald-300 font-bold">{siparaProgress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-emerald-300 to-yellow-300 rounded-full transition-all duration-700"
                    style={{ width: `${siparaProgress}%` }}
                  />
                </div>
                <p className="text-xs text-white/60 mt-2">
                  {Math.round((siparaProgress / 100) * 30)} of 30 Sipara completed
                </p>
              </div>

              {/* Pages Progress */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white/90 flex items-center gap-2">
                    <span>📄</span> Pages Read
                  </span>
                  <span className="text-emerald-300 font-bold">{Math.round((pagesRead / 604) * 100)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-emerald-300 to-yellow-300 rounded-full transition-all duration-700"
                    style={{ width: `${(pagesRead / 604) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-white/60 mt-2">
                  {pagesRead} of 604 pages read
                </p>
              </div>
            </motion.div>
          )}

          {/* Sign in message for guests */}
          {!user && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-5 bg-white/10 backdrop-blur rounded-2xl border border-white/20 max-w-md cursor-pointer hover:bg-white/20 transition-all"
              onClick={() => setShowAuthModal(true)}
            >
              <p className="text-sm text-white/90 flex items-center gap-3">
                <span className="text-2xl">🔐</span>
                <span>Sign in to save your reading progress and bookmarks across devices</span>
              </p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Main Content - Quran Reader */}
      <div className="mt-8">
        <QuranReader 
          onProgressUpdate={handleProgressUpdate}
          setShowAuthModal={setShowAuthModal}
          showAuthModal={showAuthModal}
        />
      </div>

      {/* Auth Required Modal */}
      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action="save your Quran reading progress"
      />
    </div>
  )
}