'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/Authcontext'
import { useRouter } from 'next/navigation'
import { FaRegUser } from "react-icons/fa";

import AuthModal from './Authmodal'
import Image from 'next/image'

export default function UserProfile({setShowAuthModal}) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const [profileImage, setProfileImage] = useState('')
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Update profile image when user changes
    if (user?.photoURL) {
      // Add cache-busting parameter
      const imageUrl = user.photoURL.includes('googleusercontent.com') 
        ? `${user.photoURL}?sz=200`  // Google specific
        : user.photoURL;
      setProfileImage(imageUrl);
      setImageError(false);
    } else {
      setProfileImage('')
    }
  }, [user])

  const handleImageError = () => {
    setImageError(true);
    console.log('Image failed to load:', profileImage);
  }

  const handleLogout = async () => {
    await logout()
    setShowDropdown(false)
    router.push('/')
  }

  const navigateTo = (path) => {
    setShowDropdown(false)
    router.push(path)
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowAuthModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md shadow-emerald-500/30 hover:shadow-emerald-500/50 cursor-pointer"
        >
          <FaRegUser />
          <span className="hidden sm:inline">Sign In</span>
        </button>
      </>
    )
  }

  const displayName = user.displayName || user.email.split('@')[0]
  const displayInitial = displayName[0].toUpperCase()

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all cursor-pointer border border-emerald-200 dark:border-emerald-800"
      >
        {profileImage && !imageError ? (
          <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900/50">
            <img
              src={profileImage}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={handleImageError}
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-sm">
            {displayInitial}
          </div>
        )}
        <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
          {displayName}
        </span>
        <svg
          className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
            showDropdown ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-20">
            {/* User Info */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                {profileImage && !imageError ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900/50">
                    <img
                      src={profileImage}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg">
                    {displayInitial}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 dark:text-white truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button 
                onClick={() => navigateTo('/profile-settings')}
                className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm text-gray-700 dark:text-gray-300 flex items-center gap-3 cursor-pointer"
              >
                <span>⚙️</span> Profile Settings
              </button>
              <button 
                onClick={() => navigateTo('/my-progress')}
                className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm text-gray-700 dark:text-gray-300 flex items-center gap-3 cursor-pointer"
              >
                <span>📊</span> My Progress
              </button>
              <button 
                onClick={() => navigateTo('/saved-items')}
                className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm text-gray-700 dark:text-gray-300 flex items-center gap-3 cursor-pointer"
              >
                <span>🔖</span> Saved Items
              </button>
              <div className="my-2 border-t border-gray-200 dark:border-gray-800" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm text-red-600 dark:text-red-400 flex items-center gap-3 cursor-pointer"
              >
                <span>🚪</span> Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}