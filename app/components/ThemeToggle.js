'use client'
import { useTheme } from "../context/ThemeContext.js"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`
        relative w-16 h-8 rounded-full cursor-pointer transition-all duration-500
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
        dark:focus:ring-offset-[#060d14]
        overflow-hidden
        ${isDark
          ? 'bg-gradient-to-r from-[#0d1b2a] to-[#1a3a4a] border border-emerald-900/60'
          : 'bg-gradient-to-r from-emerald-400 to-emerald-500 border border-emerald-300'
        }
      `}
    >
      {/* Stars (dark mode) */}
      {isDark && (
        <>
          <span className="absolute top-1 left-2 text-[8px] opacity-80">✦</span>
          <span className="absolute bottom-1 left-4 text-[6px] opacity-60">✦</span>
          <span className="absolute top-1 left-6 text-[5px] opacity-50">·</span>
        </>
      )}

      {/* Sun rays (light mode) */}
      {!isDark && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-200 text-xs opacity-80">
          ☀️
        </span>
      )}

      {/* Sliding Thumb */}
      <span
        className={`
          absolute top-1 w-6 h-6 rounded-full shadow-lg
          flex items-center justify-center text-sm
          transition-all duration-500 ease-in-out
          ${isDark
            ? 'translate-x-8 bg-gradient-to-br from-slate-700 to-slate-900 shadow-emerald-900/50'
            : 'translate-x-1 bg-white shadow-emerald-300/50'
          }
        `}
      >
        <span className={`transition-all duration-300 ${isDark ? 'text-emerald-300' : 'text-yellow-500'}`}>
          {isDark ? '🌙' : '☀️'}
        </span>
      </span>
    </button>
  )
}