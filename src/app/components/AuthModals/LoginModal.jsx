'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, Loader } from 'lucide-react'
import { useAuth } from '@/app/context/AuthContext'

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter()
  const { loginSendOTP, loginVerifyOTP, loginWithGoogle, error } = useAuth()
  const [step, setStep] = useState('email') // 'email' or 'otp'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [localError, setLocalError] = useState('')
  const [message, setMessage] = useState('')

  const handleClose = () => {
    setStep('email')
    setEmail('')
    setOtp('')
    setLocalError('')
    setMessage('')
    onClose()
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLocalError('')
    setMessage('')

    if (!email.trim()) {
      setLocalError('Email is required')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Please enter a valid email')
      return
    }

    setLoading(true)
    try {
      const response = await loginSendOTP(email)
      console.log('LoginModal send OTP response:', response)
      setMessage(response.message || 'OTP sent to your email!')
      setStep('otp')
    } catch (err) {
      setLocalError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLocalError('')
    setMessage('')

    if (!otp.trim() || otp.length < 4) {
      setLocalError('Please enter a valid OTP')
      return
    }

    setLoading(true)
    try {
      const response = await loginVerifyOTP(email, otp)
      console.log('LoginModal verify OTP response:', response)
      setMessage('Login successful!')
      setTimeout(() => {
        handleClose()
        router.push('/profile')
      }, 1000)
    } catch (err) {
      setLocalError(err.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLocalError('')
    setMessage('')
    setGoogleLoading(true)
    try {
      const response = await loginWithGoogle()
      console.log('LoginModal Google login response:', response)
      setMessage(response.isNewUser ? 'Account created with Google!' : 'Signed in with Google!')
      setTimeout(() => {
        handleClose()
        router.push('/profile')
      }, 1000)
    } catch (err) {
      console.error('LoginModal Google login error:', err)
      if (err.code === 'auth/popup-closed-by-user') {
        setLocalError('Sign-in popup was closed')
      } else if (err.code === 'auth/popup-blocked') {
        setLocalError('Sign-in popup was blocked. Please allow popups.')
      } else {
        setLocalError(err.message || 'Google sign-in failed')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            transition={{ duration: 0.3 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="relative bg-gradient-to-b from-[#171717] to-[#0a0a14] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                      Welcome Back
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {step === 'otp' ? `Enter the OTP sent to ${email}` : 'Sign in with email OTP or Google'}
                    </p>
                  </motion.div>
                  <motion.button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                {/* Status Messages */}
                <AnimatePresence mode="wait">
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm"
                    >
                      {message}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <motion.form
                  onSubmit={step === 'email' ? handleSendOTP : handleVerifyOTP}
                  className="space-y-5"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  key={step}
                >
                  {step === 'email' ? (
                    <>
                      {/* Email Field */}
                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setLocalError('') }}
                            placeholder="you@email.com"
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition duration-300"
                            autoFocus
                          />
                        </div>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      {/* OTP Field */}
                      <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Enter OTP</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setLocalError('') }}
                            placeholder="000000"
                            maxLength="6"
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition duration-300 text-center text-2xl tracking-widest font-mono"
                            autoFocus
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <button
                            type="button"
                            onClick={() => { setStep('email'); setOtp(''); setLocalError(''); setMessage('') }}
                            className="text-xs text-purple-400 hover:text-purple-300 transition"
                          >
                            Change email
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              setLoading(true)
                              try { await loginSendOTP(email); setMessage('New OTP sent!') }
                              catch (err) { setLocalError(err.message || 'Failed to resend') }
                              finally { setLoading(false) }
                            }}
                            disabled={loading}
                            className="text-xs text-purple-400 hover:text-purple-300 transition disabled:opacity-50"
                          >
                            Resend OTP
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}

                  {/* Error Message */}
                  <AnimatePresence>
                    {(localError || error) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
                      >
                        {localError || error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.button
                    variants={itemVariants}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        {step === 'email' ? 'Sending OTP...' : 'Verifying...'}
                      </>
                    ) : (
                      step === 'email' ? 'Send OTP' : 'Verify & Sign In'
                    )}
                  </motion.button>

                  {/* Divider - only on email step */}
                  {step === 'email' && (
                    <>
                      <motion.div variants={itemVariants} className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-gradient-to-b from-[#171717] to-[#0a0a14] text-gray-400">Or continue with</span>
                        </div>
                      </motion.div>

                      {/* Google Button */}
                      <motion.button
                        variants={itemVariants}
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 py-2.5 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg transition duration-300 disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {googleLoading ? (
                          <Loader size={20} className="animate-spin text-gray-600" />
                        ) : (
                          <>
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign in with Google
                          </>
                        )}
                      </motion.button>

                      {/* Sign Up Info */}
                      <motion.div variants={itemVariants} className="text-center">
                        <p className="text-gray-500 text-sm">
                          {"Don't have an account? Sign up through our Tournament, Scrims, or Brand Deal options below."}
                        </p>
                      </motion.div>
                    </>
                  )}

                  {/* Info Text */}
                  <motion.p variants={itemVariants} className="text-center text-gray-500 text-xs">
                    {step === 'email'
                      ? "We'll send a one-time password to your email for secure authentication."
                      : 'Check your email inbox (and spam folder) for the OTP code.'}
                  </motion.p>
                </motion.form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
