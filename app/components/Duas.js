'use client'

import { useState, useEffect } from 'react'
import { duas } from '../data/duas'
import { FaRegCopy } from "react-icons/fa"
import { useAuth } from '../context/Authcontext'
import { syncBookmarkToFirebase } from '../lib/userService'
import AuthRequiredModal from '../components/AuthRequiredModal'
import toast from 'react-hot-toast'

export default function Duas() {
    const { user } = useAuth()
    const [filter, setFilter] = useState('All')
    const [bookmarks, setBookmarks] = useState([])
    const [showAuthModal, setShowAuthModal] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('bookmarkedDuas')
        if (saved) setBookmarks(JSON.parse(saved))
    }, [])

    const toggleBookmark = async (id) => {
        // Check if user is logged in
        if (!user) {
            setShowAuthModal(true)
            return
        }

        let updated
        if (bookmarks.includes(id)) {
            updated = bookmarks.filter(b => b !== id)
            toast.success('Dua removed from bookmarks')
        } else {
            updated = [...bookmarks, id]
            toast.success('Dua bookmarked! 🔖')
        }
        
        setBookmarks(updated)
        localStorage.setItem('bookmarkedDuas', JSON.stringify(updated))
        
        // Sync to Firebase if user is logged in
        await syncBookmarkToFirebase(user.uid, updated)
    }

    const copyDua = (dua) => {
        const text = `${dua.arabic}\n\n${dua.englishTranslation}\n\n${dua.translation}`
        navigator.clipboard.writeText(text)
        toast.success('Dua copied to clipboard! 📋')
    }

    const shareDua = (dua) => {
        const text = `${dua.title}\n\n${dua.arabic}\n\n${dua.englishTranslation}\n\n${dua.translation}`
        
        if (navigator.share) {
            navigator.share({
                title: dua.title,
                text: text,
            }).then(() => {
                toast.success('Dua shared successfully!')
            }).catch(() => {
                // Fallback to copy if share fails
                copyDua(dua)
            })
        } else {
            copyDua(dua)
        }
    }

    const filtered = duas.filter((d) => {
        if (filter === 'All') return true
        if (filter === 'Bookmarked') return bookmarks.includes(d.id)
        return d.type === filter
    })

    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <section className="relative text-white bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 p-12 rounded-3xl overflow-hidden max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Duas & Hadith</h1>
                <p className="text-white/80 max-w-2xl">
                    Explore Quranic and Masnoon duas, bookmark your favorites, and share them with others.
                </p>

                {/* Decorative Crescent Moon & Stars */}
                <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-emerald-500/30 blur-3xl"></div>
                <svg className="absolute top-4 left-4 w-20 h-20 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a9 9 0 0 0 0 18 9 9 0 1 1 0-18z" />
                </svg>
            </section>

            {/* Filter Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
                {['All', 'Quranic', 'Masnoon', 'Bookmarked'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full font-semibold cursor-pointer transition ${filter === f
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-emerald-100 dark:hover:bg-emerald-800'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Duas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
                {filtered.length > 0 ? filtered.map((dua) => (
                    <div
                        key={dua.id}
                        className="p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:scale-105 transition-transform duration-200 relative"
                    >
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-3 ${
                            dua.type === 'Quranic'
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        }`}>
                            {dua.type}
                        </span>
                        
                        <h2 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-2">{dua.title}</h2>
                        <p className="mt-2 text-2xl text-right font-arabic leading-relaxed text-gray-800 dark:text-gray-100">{dua.arabic}</p>
                        <p className="mt-3 text-sm italic text-emerald-700 dark:text-emerald-300">
                            {dua.englishTranslation}
                        </p>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">{dua.translation}</p>

                        {/* Bookmark & Copy/Share */}
                        <div className="flex gap-2 mt-4 justify-end">
                            <button
                                onClick={() => toggleBookmark(dua.id)}
                                className={`px-3 py-1.5 rounded-lg cursor-pointer text-white transition-all ${bookmarks.includes(dua.id)
                                        ? 'bg-emerald-500 hover:bg-emerald-600'
                                        : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500'
                                    }`}
                                title={bookmarks.includes(dua.id) ? "Remove bookmark" : "Bookmark this dua"}
                            >
                                {bookmarks.includes(dua.id) ? '★' : '☆'}
                            </button>
                            <button
                                onClick={() => copyDua(dua)}
                                className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white cursor-pointer transition-all"
                                title="Copy Dua"
                            >
                                <FaRegCopy />
                            </button>
                            <button
                                onClick={() => shareDua(dua)}
                                className="px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white cursor-pointer transition-all"
                                title="Share Dua"
                            >
                                ↗
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-3 text-center py-16">
                        <p className="text-4xl mb-3">🔍</p>
                        <p className="text-gray-500 dark:text-gray-400">No duas found in this category</p>
                    </div>
                )}
            </div>

            {/* Auth Required Modal */}
            <AuthRequiredModal 
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                action="bookmark duas"
            />
        </div>
    )
}