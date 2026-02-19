// components/Navbar.js - Complete redesign with dropdowns
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import UserProfile from './UserProfile'
import { useState, useEffect, useRef } from 'react'
import AuthModal from './Authmodal'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: '🏠',
  },
  {
    label: 'Prayer Times',
    href: '/prayer-times',
    icon: '🕌',
  },
  {
    label: 'Quran',
    href: '/al-quran',
    icon: '📖',
    // dropdown: [
    //   { label: 'Al-Quran', href: '/al-quran', desc: 'Read 30 Sipara with translation', icon: '📗' },
    //   { label: 'Quran Tracker', href: '/quran-tracker', desc: 'Track your reading progress', icon: '📊' },
    //   { label: 'Saved Surahs', href: '/saved-items', desc: 'Your bookmarked Surahs', icon: '🔖' },
    // ]
  },
  {
    label: 'Ramzan',
    href: '/ramzan-calendar',
    icon: '🌙',
    // dropdown: [
    //   { label: 'Ramzan Calendar', href: '/ramzan-calendar', desc: 'Sehri & Iftar timetable', icon: '📅' },
    //   { label: 'About Ramzan', href: '/resources/about-ramzan', desc: 'Learn about the holy month', icon: '📖' },
    //   { label: 'Ramzan Tips', href: '/resources/ramzan-tips', desc: 'Daily tips for Ramzan', icon: '💡' },
    //   { label: 'Fasting Guide', href: '/resources/fasting-guide', desc: 'Complete fasting rules', icon: '📋' },
    // ]
  },
  {
    label: 'Duas',
    href: '/duas',
    icon: '🤲',
    // dropdown: [
    //   { label: 'All Duas', href: '/duas', desc: 'Quranic & Masnoon duas', icon: '📜' },
    //   { label: 'Bookmarked Duas', href: '/saved-items', desc: 'Your saved duas', icon: '🔖' },
    // ]
  },
  {
    label: 'Tasbeeh',
    href: '/tasbeeh',
    icon: '📿',
  },
  // {
  //   label: 'Resources',
  //   icon: '📚',
  //   dropdown: [
  //     { label: 'Contact Us', href: '/resources/contact', desc: 'Get in touch with us', icon: '📞' },
  //     { label: 'My Progress', href: '/my-progress', desc: 'Track your spiritual journey', icon: '📈' },
  //     { label: 'Profile Settings', href: '/profile-settings', desc: 'Manage your account', icon: '⚙️' },
  //   ]
  // },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null)
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md dark:bg-gray-950/95 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div 
                className="w-8 h-8 rounded bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/30"
              >
                <span className="text-xl">🌙</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                Noor Ramzan
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
              {navItems.map((item) => (
                <div key={item.label} className="relative">
                  {item.dropdown ? (
                    // Dropdown button
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        openDropdown === item.label
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30'
                          : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                      }`}
                    >
                      {/* <span>{item.icon}</span> */}
                      <span>{item.label}</span>
                      <svg className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    // Regular link
                    <Link
                      href={item.href}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        pathname === item.href
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 font-semibold'
                          : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                      }`}
                    >
                      {/* <span>{item.icon}</span> */}
                      <span>{item.label}</span>
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {item.dropdown && openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                      >
                        <div className="p-2">
                          {item.dropdown.map((dropItem) => (
                            <Link
                              key={dropItem.href}
                              href={dropItem.href}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <span className="text-2xl">{dropItem.icon}</span>
                              <div>
                                <p className="font-semibold text-gray-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                  {dropItem.label}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {dropItem.desc}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-3">
              {/* <ThemeToggle /> */}
              <UserProfile setShowAuthModal={setShowAuthModal} />
              
              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-2">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.dropdown ? (
                      // Mobile dropdown
                      <div className="space-y-1">
                        <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        <div className="pl-6 space-y-1">
                          {item.dropdown.map((dropItem) => (
                            <Link
                              key={dropItem.href}
                              href={dropItem.href}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition"
                              onClick={() => setMenuOpen(false)}
                            >
                              <span className="text-xl">{dropItem.icon}</span>
                              <div>
                                <span className="text-sm font-medium">{dropItem.label}</span>
                                <p className="text-xs text-gray-400">{dropItem.desc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Mobile regular link
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                          pathname === item.href
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}