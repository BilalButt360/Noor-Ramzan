'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/Authcontext'
import { updateProfile } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { updateUserProfile } from '../lib/userService'
import { compressImage, validateImageFile } from '../lib/imageUpload'
import { uploadToCloudinary } from '../lib/cloudinaryUpload'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

// Validation schema
const profileSchema = Yup.object({
  displayName: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  phoneNumber: Yup.string()
    .matches(/^[+]?[0-9\s-()]*$/, 'Invalid phone number'),
  location: Yup.string(),
  bio: Yup.string()
    .max(200, 'Bio must be 200 characters or less'),
})

export default function ProfileSettings() {
  const { user, userData, refreshUserData } = useAuth()
  const router = useRouter()
  
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [tempBase64, setTempBase64] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formValues, setFormValues] = useState({
    displayName: '',
    phoneNumber: '',
    location: '',
    bio: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    
    // Set initial values
    setImagePreview(user.photoURL || '')
    setFormValues({
      displayName: user.displayName || '',
      phoneNumber: userData?.phoneNumber || '',
      location: userData?.location || '',
      bio: userData?.bio || ''
    })
    setLoading(false)
  }, [user, userData, router])

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    try {
      setUploading(true)
      toast.loading('Compressing image...', { id: 'image-upload' })
      
      // Compress image
      const compressedDataUrl = await compressImage(file, 100)
      
      setImagePreview(compressedDataUrl)
      setTempBase64(compressedDataUrl)
      
      toast.success('Image ready to upload!', { id: 'image-upload' })
    } catch (error) {
      toast.error('Failed to process image', { id: 'image-upload' })
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (values) => {
    const toastId = toast.loading('Saving profile...')
    
    try {
      let finalPhotoURL = user.photoURL || ''
      
      // Upload new image to Cloudinary if selected
      if (tempBase64) {
        toast.loading('Uploading image to Cloudinary...', { id: toastId })
        
        const uploadResult = await uploadToCloudinary(tempBase64)
        
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload image')
        }
        
        finalPhotoURL = uploadResult.url
      }

      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: values.displayName,
        photoURL: finalPhotoURL,
      })

      // Update Firestore user document - ALL FIELDS included
      const updateData = {
        displayName: values.displayName,
        photoURL: finalPhotoURL,
        phoneNumber: values.phoneNumber || '',
        location: values.location || '',
        bio: values.bio || '',
      }
      
      await updateUserProfile(user.uid, updateData)

      // Refresh data and reload user
      await refreshUserData()
      
      // Force reload the current user to update navbar
      const currentUser = auth.currentUser
      if (currentUser) {
        await currentUser.reload()
      }
      
      toast.success('Profile updated successfully! ✅', { id: toastId })
      
      // Clear temporary data
      setTempBase64(null)
      
      // Small delay then redirect to home to see updated navbar
      setTimeout(() => {
        router.push('/')
      }, 1500)
      
    } catch (error) {
      console.error('Profile update error:', error)
      
      if (error.code === 'auth/invalid-profile-attribute') {
        toast.error('Image URL too long. Please try a smaller image.', { id: toastId })
      } else {
        toast.error(error.message || 'Failed to update profile', { id: toastId })
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-5xl">🌙</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile Settings</h1>
        <p className="text-white/75">Manage your account information and preferences</p>
        
        {/* Decorative element */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-400/20 blur-3xl rounded-full" />
        <div className="absolute -left-8 -top-8 w-48 h-48 bg-yellow-300/10 blur-2xl rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto">
        <Formik
          initialValues={formValues}
          validationSchema={profileSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-6">
              {/* Profile Picture Section */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-bold mb-4 dark:text-white">Profile Picture</h2>
                
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-3xl font-bold">
                        {values.displayName ? values.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-700 transition shadow-lg">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={uploading || isSubmitting}
                        className="hidden"
                      />
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </label>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Upload a new photo
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      JPG, PNG or GIF. Max size 10MB
                    </p>
                    {tempBase64 && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                        <span>✓</span> New image ready for upload
                      </p>
                    )}
                    {user?.photoURL && !tempBase64 && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Current profile picture is active
                      </p>
                    )}
                    {(uploading || isSubmitting) && (
                      <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                        <span className="animate-spin">⏳</span> Processing...
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-bold mb-4 dark:text-white">Personal Information</h2>
                
                <div className="space-y-4">
                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <Field
                      type="text"
                      name="displayName"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ahmed Khan"
                    />
                    <ErrorMessage name="displayName" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  {/* Email (Disabled) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <Field
                      type="tel"
                      name="phoneNumber"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="+92 300 1234567"
                    />
                    <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <Field
                      type="text"
                      name="location"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Lahore, Pakistan"
                    />
                    <ErrorMessage name="location" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <Field
                      as="textarea"
                      name="bio"
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                    <div className="flex justify-between mt-1">
                      <ErrorMessage name="bio" component="div" className="text-red-500 text-xs" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {values.bio.length}/200 characters
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}