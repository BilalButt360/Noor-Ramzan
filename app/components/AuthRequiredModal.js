'use client'

import { useState } from 'react'
import AuthModal from './Authmodal'

export default function AuthRequiredModal({ isOpen, onClose, action = 'bookmark this', onSuccess }) {
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (!isOpen && !showAuthModal) return null

  const handleSignIn = () => {
    onClose() // Close AuthRequired modal
    setShowAuthModal(true) // Open Auth modal
  }

  const handleAuthClose = () => {
    setShowAuthModal(false)
    // Don't reopen AuthRequired modal
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    if (onSuccess) {
      onSuccess() // Call success callback
    }
  }

  // If AuthModal is open, show only that
  if (showAuthModal) {
    return <AuthModal isOpen={true} onClose={handleAuthClose} />
  }

  // Show AuthRequired modal
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#0d1b2a] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-emerald-900/40 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 text-white text-center">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-4xl">
              🔐
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-white/80 text-sm">
            Please sign in to {action}
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 cursor-pointer transition text-white text-lg font-bold"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create an account or sign in to save your progress and sync across all devices.
            </p>
            <div className="space-y-2 text-sm text-left bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-emerald-500">✓</span> Save bookmarks
              </p>
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-emerald-500">✓</span> Track Quran progress
              </p>
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-emerald-500">✓</span> Sync Tasbeeh counts
              </p>
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-emerald-500">✓</span> Access from any device
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSignIn}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 cursor-pointer"
            >
              Sign In to Continue
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}