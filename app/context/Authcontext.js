'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import { createUserDocument, getUserData, syncLocalToFirebase, loadFirebaseToLocal, updateUserProfile } from '../lib/userService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Load user data from Firestore
        const result = await getUserData(user.uid)
        
        if (result.success) {
          setUserData(result.data)
          // Load Firebase data to local storage
          await loadFirebaseToLocal(user.uid)
        } else {
          // Create user document if doesn't exist
          await createUserDocument(user.uid, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            phoneNumber: '',
            location: '',
            bio: '',
          })
          // Sync any existing local data to Firebase
          await syncLocalToFirebase(user.uid)
          // Reload user data
          const newResult = await getUserData(user.uid)
          if (newResult.success) {
            setUserData(newResult.data)
          }
        }
      } else {
        setUserData(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName })
      }
      
      // Create user document in Firestore
      await createUserDocument(userCredential.user.uid, {
        displayName: displayName || '',
        email,
        photoURL: null,
        phoneNumber: '',
        location: '',
        bio: '',
      })
      
      // Sync local data
      await syncLocalToFirebase(userCredential.user.uid)
      
      return { success: true, user: userCredential.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Sync local data to Firebase
      await syncLocalToFirebase(userCredential.user.uid)
      
      return { success: true, user: userCredential.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      
      // Check if user document exists
      const result = await getUserData(userCredential.user.uid)
      
      if (!result.success) {
        // Create new user document
        await createUserDocument(userCredential.user.uid, {
          displayName: userCredential.user.displayName,
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
          phoneNumber: '',
          location: '',
          bio: '',
        })
      }
      
      // Sync local data
      await syncLocalToFirebase(userCredential.user.uid)
      
      return { success: true, user: userCredential.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Sign out
  const logout = async () => {
    try {
      // Sync data before logout
      if (user) {
        await syncLocalToFirebase(user.uid)
      }
      await signOut(auth)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Refresh user data
  const refreshUserData = async () => {
    if (user) {
      const result = await getUserData(user.uid)
      if (result.success) {
        setUserData(result.data)
      }
      // Also refresh the Firebase Auth user to get updated photoURL
      const currentUser = auth.currentUser
      if (currentUser) {
        await currentUser.reload()
        setUser({ ...currentUser })
      }
    }
  }

  const value = {
    user,
    userData,
    loading,
    signup,
    login,
    logout,
    signInWithGoogle,
    resetPassword,
    refreshUserData,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}