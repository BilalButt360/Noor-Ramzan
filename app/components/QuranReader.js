'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchJuz, PARA_INFO } from '../lib/quranApi'
import { useAuth } from '../context/Authcontext'
import { syncQuranToFirebase } from '../lib/userService'
import AuthRequiredModal from './AuthRequiredModal'
import toast from 'react-hot-toast'
import Loader from './Loader'

export default function QuranReader({ onProgressUpdate, setShowAuthModal, showAuthModal }) {
  const { user } = useAuth()
  
  // State
  const [currentPara, setCurrentPara] = useState(1)
  const [paraData, setParaData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Progress tracking
  const [readPages, setReadPages] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [showBookmarksList, setShowBookmarksList] = useState(false)
  
  // Settings
  const [fontSize, setFontSize] = useState(24)
  const [showJumpToPage, setShowJumpToPage] = useState(false)
  
  // View
  const [currentPage, setCurrentPage] = useState(1)
  
  // Refs
  const readerRef = useRef(null)

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quranReadingProgress')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setReadPages(parsed.readPages || [])
        setBookmarks(parsed.bookmarks || [])
      } catch (e) {
        console.error('Error parsing saved progress:', e)
      }
    }
  }, [])

  // Update parent with progress
  useEffect(() => {
    if (onProgressUpdate) {
      const completedSipara = calculateCompletedPara(readPages)
      onProgressUpdate(completedSipara, readPages.length)
    }
  }, [readPages])

  // Fetch Para data
  useEffect(() => {
    fetchParaData(currentPara)
  }, [currentPara])

  const fetchParaData = async (paraNumber) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await fetchJuz(paraNumber)
      if (data && data.ayahs && data.ayahs.length > 0) {
        setParaData(data)
        setCurrentPage(data.ayahs[0].page || 1)
      } else {
        setError('Failed to load Quran data. Please try again.')
      }
    } catch (err) {
      setError('Error loading Quran. Please check your connection.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const saveProgress = async (newReadPages, newBookmarks) => {
    try {
      localStorage.setItem('quranReadingProgress', JSON.stringify({
        readPages: newReadPages,
        bookmarks: newBookmarks
      }))

      if (user) {
        const completedSipara = calculateCompletedPara(newReadPages)
        await syncQuranToFirebase(user.uid, {
          readSipara: completedSipara,
          readPages: newReadPages,
          bookmarkedSurahs: newBookmarks,
          lastRead: new Date().toISOString()
        })
      }
    } catch (err) {
      console.error('Error saving progress:', err)
      toast.error('Failed to save progress')
    }
  }

  const calculateCompletedPara = (pages) => {
    const completed = []
    for (let para = 1; para <= 30; para++) {
      const paraInfo = PARA_INFO[para - 1]
      if (!paraInfo) continue
      
      const [startPage, endPage] = paraInfo.pages.split('-').map(Number)
      
      let allRead = true
      for (let page = startPage; page <= endPage; page++) {
        if (!pages.includes(page)) {
          allRead = false
          break
        }
      }
      
      if (allRead) {
        completed.push(para)
      }
    }
    return completed
  }

  const togglePageRead = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    let newReadPages
    if (readPages.includes(currentPage)) {
      newReadPages = readPages.filter(p => p !== currentPage)
      toast.success(`Page ${currentPage} unmarked`)
    } else {
      newReadPages = [...readPages, currentPage]
      toast.success(`Page ${currentPage} marked as read!`)
    }

    setReadPages(newReadPages)
    await saveProgress(newReadPages, bookmarks)
  }

  const toggleBookmark = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    let newBookmarks
    if (bookmarks.includes(currentPage)) {
      newBookmarks = bookmarks.filter(p => p !== currentPage)
      toast.success(`Bookmark removed from page ${currentPage}`)
    } else {
      newBookmarks = [...bookmarks, currentPage]
      toast.success(`Page ${currentPage} bookmarked!`)
    }

    setBookmarks(newBookmarks)
    await saveProgress(readPages, newBookmarks)
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= 604) {
      setCurrentPage(page)
      const paraIndex = PARA_INFO.findIndex(p => {
        const [start, end] = p.pages.split('-').map(Number)
        return page >= start && page <= end
      })
      if (paraIndex !== -1) {
        setCurrentPara(paraIndex + 1)
      }
      setShowJumpToPage(false)
    }
  }

  const getAyahsByPage = () => {
    if (!paraData?.ayahs) return {}
    
    return paraData.ayahs.reduce((acc, ayah) => {
      const page = ayah.page || 1
      if (!acc[page]) {
        acc[page] = []
      }
      acc[page].push(ayah)
      return acc
    }, {})
  }

  const ayahsByPage = getAyahsByPage()
  const pages = Object.keys(ayahsByPage).sort((a, b) => Number(a) - Number(b))
  const totalRead = readPages.length
  const pagesProgress = Math.round((totalRead / 604) * 100) || 0
  const siparaProgress = Math.round((calculateCompletedPara(readPages).length / 30) * 100) || 0

  if (loading) {
    return <Loader message="Loading Quran..." />
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-red-50 dark:bg-red-900/20 rounded-2xl">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        <button
          onClick={() => fetchParaData(currentPara)}
          className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition cursor-pointer"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6" ref={readerRef}>
      {/* Reader Controls - Floating Style */}
      <div className="sticky top-20 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-3 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Section - Page Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Page</span>
              <button
                onClick={() => setShowJumpToPage(!showJumpToPage)}
                className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition cursor-pointer"
                title="Click to jump to specific page"
              >
                {currentPage}/604
              </button>
            </div>
            
            <div className="hidden md:block text-sm text-gray-600 dark:text-gray-300 cursor-default">
              {PARA_INFO[currentPara - 1]?.description} • {PARA_INFO[currentPara - 1]?.arabicName}
            </div>
          </div>

          {/* Center - Pages Progress Bar (Desktop) */}
          <div className="hidden md:block flex-1 max-w-xs">
            <div className="flex items-center gap-2 group cursor-default">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${pagesProgress}%` }}
                />
              </div>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 transition-colors">
                {pagesProgress}%
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">
              Pages: {totalRead}/604
            </p>
          </div>

          {/* Right Section - Controls */}
          <div className="flex items-center gap-2">
            {/* Font Size */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setFontSize(Math.max(16, fontSize - 2))}
                className="w-7 h-7 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-lg font-bold transition cursor-pointer"
                title="Decrease font size"
              >
                −
              </button>
              <span className="text-xs font-mono w-7 text-center dark:text-gray-300 cursor-default">
                {fontSize}
              </span>
              <button
                onClick={() => setFontSize(Math.min(36, fontSize + 2))}
                className="w-7 h-7 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-lg font-bold transition cursor-pointer"
                title="Increase font size"
              >
                +
              </button>
            </div>

            {/* Show All Bookmarks */}
            <button
              onClick={() => setShowBookmarksList(!showBookmarksList)}
              className={`p-2 rounded-lg transition relative cursor-pointer ${
                bookmarks.length > 0
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 hover:bg-amber-200 dark:hover:bg-amber-900/50'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={bookmarks.length > 0 ? `Show ${bookmarks.length} bookmarks` : 'No bookmarks yet'}
            >
              <span className="text-lg">🔖</span>
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {bookmarks.length}
                </span>
              )}
            </button>

            {/* Bookmark Current Page */}
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-lg transition cursor-pointer ${
                bookmarks.includes(currentPage)
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={bookmarks.includes(currentPage) ? 'Remove bookmark from this page' : 'Bookmark this page'}
            >
              {bookmarks.includes(currentPage) ? '🔖' : '📌'}
            </button>

            {/* Mark as Read */}
            <button
              onClick={togglePageRead}
              className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer flex items-center gap-2 ${
                readPages.includes(currentPage)
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              title={readPages.includes(currentPage) ? 'Click to unmark this page' : 'Mark this page as read'}
            >
              {readPages.includes(currentPage) ? (
                <>
                  <span>✓</span> Read
                </>
              ) : (
                <>
                  <span>📖</span> Mark Read
                </>
              )}
            </button>
          </div>
        </div>

        {/* Jump to Page Input */}
        <AnimatePresence>
          {showJumpToPage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="604"
                  placeholder="Enter page number (1-604)"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const page = parseInt(e.target.value)
                      if (page >= 1 && page <= 604) {
                        goToPage(page)
                      } else {
                        toast.error('Please enter a valid page number (1-604)')
                      }
                    }
                  }}
                  autoFocus
                />
                <button
                  onClick={() => setShowJumpToPage(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Progress - Pages */}
        <div className="md:hidden mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <span>📄</span> Pages Progress
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {totalRead}/604 ({pagesProgress}%)
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${pagesProgress}%` }}
            />
          </div>
        </div>

        {/* Mobile Progress - Sipara */}
        <div className="md:hidden mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <span>📚</span> Sipara Progress
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {calculateCompletedPara(readPages).length}/30 ({siparaProgress}%)
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${siparaProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bookmarks List */}
      <AnimatePresence>
        {showBookmarksList && bookmarks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold dark:text-white flex items-center gap-2">
                <span>🔖</span> Your Bookmarks ({bookmarks.length})
              </h3>
              <button
                onClick={() => setShowBookmarksList(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition cursor-pointer"
                title="Close bookmarks list"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {bookmarks.sort((a, b) => a - b).map(page => (
                <button
                  key={page}
                  onClick={() => {
                    goToPage(page)
                    setShowBookmarksList(false)
                  }}
                  className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-sm hover:bg-amber-200 dark:hover:bg-amber-900/50 transition flex items-center gap-1 cursor-pointer"
                  title={`Go to page ${page}`}
                >
                  <span>📖</span> Page {page}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quran Text Display */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-4xl mx-auto">
          {pages.length > 0 ? pages.map(pageNum => (
            <div
              key={pageNum}
              className={`transition-opacity duration-300 ${Number(pageNum) === currentPage ? 'block' : 'hidden'}`}
            >
              {/* Page Header with Bismillah */}
              <div className="text-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700 relative">
                <div className="absolute left-0 top-1/2 w-12 h-px bg-gradient-to-r from-transparent to-emerald-500" />
                <div className="absolute right-0 top-1/2 w-12 h-px bg-gradient-to-l from-transparent to-emerald-500" />
                
                <p className="font-arabic text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2 cursor-default">
                  ﷽
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 cursor-default">
                  Page {pageNum} • {PARA_INFO[currentPara - 1]?.description}
                </p>
              </div>

              {/* Verses */}
              <div className="space-y-6">
                {ayahsByPage[pageNum]?.map((ayah, index) => {
                  const isBookmarked = bookmarks.includes(Number(pageNum))
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className={`p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative group ${
                        isBookmarked ? 'ring-1 ring-emerald-700' : ''
                      }`}
                    >
                      {/* Ayah Metadata */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full cursor-default">
                          {ayah.surah?.name}
                        </span>
                        <span className="text-xs text-gray-400 cursor-default">
                          Ayah {ayah.numberInSurah || index + 1}
                        </span>
                      </div>

                      {/* Arabic Text */}
                      <p
                        className="font-arabic text-right leading-loose"
                        style={{ fontSize: `${fontSize}px` }}
                        dir="rtl"
                      >
                        {ayah.arabic}
                      </p>

                      {/* Bookmark Indicator */}
                      {isBookmarked && (
                        <span className="absolute -top-1 -right-1 text-amber-500 text-sm animate-pulse">
                          🔖
                        </span>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Page Footer */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-400 cursor-default">
                  Page {pageNum} • {ayahsByPage[pageNum]?.length || 0} Ayahs
                </p>
              </div>
            </div>
          )) : (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400">No Quran data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition flex items-center justify-center gap-2 cursor-pointer"
          title="Previous page"
        >
          <span>←</span> Previous
        </button>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= 604}
          className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition flex items-center justify-center gap-2 cursor-pointer"
          title="Next page"
        >
          Next <span>→</span>
        </button>
      </div>

      {/* Para Navigation Grid */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold mb-3 dark:text-white flex items-center gap-2 cursor-default">
          <span>📚</span> Jump to Para
        </p>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {PARA_INFO.map((para) => {
            const [startPage] = para.pages.split('-').map(Number)
            const isActive = currentPara === para.id
            
            return (
              <button
                key={para.id}
                onClick={() => {
                  setCurrentPara(para.id)
                  setCurrentPage(startPage)
                }}
                className={`aspect-square rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-110 hover:bg-emerald-700'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:scale-105'
                }`}
                title={`${para.description} - ${para.arabicName} (Pages ${para.pages})`}
              >
                {para.id}
              </button>
            )
          })}
        </div>
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