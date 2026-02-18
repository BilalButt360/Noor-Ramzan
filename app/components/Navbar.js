'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import UserProfile from './UserProfile'
import { useState } from 'react'
import AuthModal from './Authmodal'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/prayer-times', label: 'Prayer Times' },
  { href: '/al-quran', label: 'Al-Quran' },
  { href: '/ramzan-calendar', label: 'Ramzan Calendar' },
  { href: '/duas', label: 'Duas & Hadith' },
  { href: '/tasbeeh', label: 'Digital Tasbeeh' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md dark:bg-gray-950/90 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🌙</span>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
              Noor Ramzan
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="block h-0.5 bg-emerald-500 rounded-full mt-0.5 mx-auto w-full" />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <UserProfile setShowAuthModal = {setShowAuthModal}/>
            <ThemeToggle />
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-1 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        )}
      </nav>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}