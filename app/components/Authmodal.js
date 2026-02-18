'use client'

import { useState } from 'react'
import { useAuth } from '../context/Authcontext'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

// Validation schemas
const loginSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

const signupSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

const resetSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
})

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode)
  const { login, signup, signInWithGoogle, resetPassword } = useAuth()

  if (!isOpen) return null

  const handleGoogleSignIn = async () => {
    const toastId = toast.loading('Signing in with Google...')
    const result = await signInWithGoogle()
    
    if (result.success) {
      toast.success('Welcome! Signed in successfully 🎉', { id: toastId })
      onClose()
    } else {
      toast.error(result.error || 'Failed to sign in', { id: toastId })
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#0d1b2a] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-emerald-900/40 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">
              {mode === 'login' ? '🌙 Welcome Back' : mode === 'signup' ? '✨ Join NoorRamzan' : '🔑 Reset Password'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 cursor-pointer transition text-white text-lg font-bold flex-shrink-0"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <p className="text-white/80 text-sm">
            {mode === 'login'
              ? 'Sign in to sync your progress across devices'
              : mode === 'signup'
              ? 'Create an account to save your Ramzan journey'
              : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        <div className="p-6">
          {/* Login Form */}
          {mode === 'login' && (
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={async (values, { setSubmitting }) => {
                const toastId = toast.loading('Signing in...')
                const result = await login(values.email, values.password)
                
                if (result.success) {
                  toast.success('Welcome back! 🌙', { id: toastId })
                  onClose()
                } else {
                  toast.error(result.error || 'Failed to sign in', { id: toastId })
                }
                setSubmitting(false)
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-emerald-900/50 bg-gray-50 dark:bg-[#1a2535] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="your@email.com"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-emerald-900/50 bg-gray-50 dark:bg-[#1a2535] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="••••••••"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span> Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          {/* Signup Form */}
          {mode === 'signup' && (
            <Formik
              initialValues={{ name: '', email: '', password: '' }}
              validationSchema={signupSchema}
              onSubmit={async (values, { setSubmitting }) => {
                const toastId = toast.loading('Creating account...')
                const result = await signup(values.email, values.password, values.name)
                
                if (result.success) {
                  toast.success('Account created successfully! 🎉', { id: toastId })
                  onClose()
                } else {
                  toast.error(result.error || 'Failed to create account', { id: toastId })
                }
                setSubmitting(false)
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-emerald-900/50 bg-gray-50 dark:bg-[#1a2535] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ahmed Khan"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-emerald-900/50 bg-gray-50 dark:bg-[#1a2535] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="your@email.com"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-emerald-900/50 bg-gray-50 dark:bg-[#1a2535] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="••••••••"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span> Creating account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          {/* Reset Password Form */}
          {mode === 'reset' && (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={resetSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                const toastId = toast.loading('Sending reset link...')
                const result = await resetPassword(values.email)
                
                if (result.success) {
                  toast.success('Password reset email sent! Check your inbox 📧', { id: toastId })
                  resetForm()
                } else {
                  toast.error(result.error || 'Failed to send reset link', { id: toastId })
                }
                setSubmitting(false)
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-emerald-900/50 bg-gray-50 dark:bg-[#1a2535] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="your@email.com"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span> Sending...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          {/* Divider */}
          {mode !== 'reset' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-[#0d1b2a] px-3 text-gray-500 dark:text-gray-400">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Sign in with Google
                </span>
              </button>
            </>
          )}

          {/* Mode Toggle */}
          <div className="mt-6 text-center text-sm">
            {mode === 'login' ? (
              <>
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer mr-4"
                >
                  Forgot password?
                </button>
                <span className="text-gray-500 dark:text-gray-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    Sign up
                  </button>
                </span>
              </>
            ) : mode === 'signup' ? (
              <span className="text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                ← Back to login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}