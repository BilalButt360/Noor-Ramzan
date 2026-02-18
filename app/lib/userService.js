// lib/userService.js
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

// Initialize user document on signup
export const createUserDocument = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId)
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      phoneNumber: userData.phoneNumber || '',
      location: userData.location || '',
      bio: userData.bio || '',
      // Quran Progress
      quranProgress: {
        readSipara: [],
        bookmarkedSurahs: [],
        lastRead: null,
      },
      // Tasbeeh Counts
      tasbeehCounts: {},
      totalTasbeeh: 0,
      // Duas Bookmarks
      bookmarkedDuas: [],
      // Prayer Tracking
      prayerLog: {},
      // User Settings
      settings: {
        city: null,
        notificationsEnabled: true,
        theme: 'light',
      },
    })
    return { success: true }
  } catch (error) {
    console.error('Error creating user document:', error)
    return { success: false, error: error.message }
  }
}

// Get user data
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() }
    } else {
      return { success: false, error: 'User not found' }
    }
  } catch (error) {
    console.error('Error getting user data:', error)
    return { success: false, error: error.message }
  }
}

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId)
    
    // Ensure all fields are properly merged
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    }
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    )
    
    await updateDoc(userRef, updateData)
    return { success: true }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: error.message }
  }
}

// Update Quran Progress
export const updateQuranProgress = async (userId, quranProgress) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      quranProgress,
      updatedAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating Quran progress:', error)
    return { success: false, error: error.message }
  }
}

// Update Tasbeeh Counts
export const updateTasbeehCounts = async (userId, tasbeehCounts, totalTasbeeh) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      tasbeehCounts,
      totalTasbeeh,
      updatedAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating Tasbeeh counts:', error)
    return { success: false, error: error.message }
  }
}

// Update Duas Bookmarks
export const updateDuasBookmarks = async (userId, bookmarkedDuas) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      bookmarkedDuas,
      updatedAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating Duas bookmarks:', error)
    return { success: false, error: error.message }
  }
}

// Sync local data to Firebase
export const syncLocalToFirebase = async (userId) => {
  try {
    // Get local storage data
    const quranLog = localStorage.getItem('quranReadingLog')
    const tasbeehLog = localStorage.getItem('tasbeehCounts')
    const duasLog = localStorage.getItem('bookmarkedDuas')

    const userRef = doc(db, 'users', userId)
    
    // First, get existing Firebase data
    const userSnap = await getDoc(userRef)
    const existingData = userSnap.exists() ? userSnap.data() : {}
    
    const updates = {}

    // Merge Quran progress
    if (quranLog) {
      const parsed = JSON.parse(quranLog)
      const existingReadSipara = existingData.quranProgress?.readSipara || []
      const existingBookmarks = existingData.quranProgress?.bookmarkedSurahs || []
      
      updates.quranProgress = {
        readSipara: [...new Set([...existingReadSipara, ...(parsed.readSipara || [])])],
        bookmarkedSurahs: [...new Set([...existingBookmarks, ...(parsed.bookmarkedSurahs || [])])],
        lastRead: new Date().toISOString(),
      }
    }

    // Merge Tasbeeh counts
    if (tasbeehLog) {
      const parsed = JSON.parse(tasbeehLog)
      const existingCounts = existingData.tasbeehCounts || {}
      
      // Merge counts
      const mergedCounts = { ...existingCounts }
      Object.entries(parsed.counts || {}).forEach(([id, count]) => {
        mergedCounts[id] = (mergedCounts[id] || 0) + count
      })
      
      updates.tasbeehCounts = mergedCounts
      updates.totalTasbeeh = Object.values(mergedCounts).reduce((a, b) => a + b, 0)
    }

    // Merge Duas bookmarks
    if (duasLog) {
      const parsedDuas = JSON.parse(duasLog)
      const existingDuas = existingData.bookmarkedDuas || []
      updates.bookmarkedDuas = [...new Set([...existingDuas, ...parsedDuas])]
    }

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = serverTimestamp()
      await updateDoc(userRef, updates)
    }

    return { success: true }
  } catch (error) {
    console.error('Error syncing local data:', error)
    return { success: false, error: error.message }
  }
}

// Load Firebase data to local storage
export const loadFirebaseToLocal = async (userId) => {
  try {
    const result = await getUserData(userId)
    
    if (result.success && result.data) {
      const { quranProgress, tasbeehCounts, totalTasbeeh, bookmarkedDuas } = result.data

      // Update Quran progress
      if (quranProgress) {
        localStorage.setItem('quranReadingLog', JSON.stringify({
          readSipara: quranProgress.readSipara || [],
          bookmarkedSurahs: quranProgress.bookmarkedSurahs || [],
        }))
      }

      // Update Tasbeeh counts
      if (tasbeehCounts) {
        localStorage.setItem('tasbeehCounts', JSON.stringify({
          counts: tasbeehCounts,
          totalToday: totalTasbeeh || 0,
        }))
      }

      // Update Duas bookmarks
      if (bookmarkedDuas) {
        localStorage.setItem('bookmarkedDuas', JSON.stringify(bookmarkedDuas))
      }

      return { success: true }
    }
    return { success: false }
  } catch (error) {
    console.error('Error loading Firebase data:', error)
    return { success: false, error: error.message }
  }
}

// Realtime sync function - call after user makes changes
export const syncBookmarkToFirebase = async (userId, bookmarkedDuas) => {
  if (!userId) return { success: false, error: 'Not authenticated' }
  
  try {
    await updateDuasBookmarks(userId, bookmarkedDuas)
    return { success: true }
  } catch (error) {
    console.error('Error syncing bookmark:', error)
    return { success: false, error: error.message }
  }
}

// Realtime sync for Quran
export const syncQuranToFirebase = async (userId, quranProgress) => {
  if (!userId) return { success: false, error: 'Not authenticated' }
  
  try {
    await updateQuranProgress(userId, quranProgress)
    return { success: true }
  } catch (error) {
    console.error('Error syncing Quran progress:', error)
    return { success: false, error: error.message }
  }
}

// Realtime sync for Tasbeeh
export const syncTasbeehToFirebase = async (userId, tasbeehCounts, totalTasbeeh) => {
  if (!userId) return { success: false, error: 'Not authenticated' }
  
  try {
    await updateTasbeehCounts(userId, tasbeehCounts, totalTasbeeh)
    return { success: true }
  } catch (error) {
    console.error('Error syncing Tasbeeh:', error)
    return { success: false, error: error.message }
  }
}