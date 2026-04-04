'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, Eye, EyeOff, Loader, User, Gamepad2, Building2 } from 'lucide-react'
import { useAuth } from '@/app/context/AuthContext'

export default function UnifiedAuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const { 
    loginSendOTP, 
    loginVerifyOTP,
    registerSendOTP,
    registerVerifyOTP,
    registerPersonalInfo,
    registerGamingProfile,
    error: authError
  } = useAuth()
  
  const [mode, setMode] = useState(initialMode) // 'login' or 'signup'
  const [step, setStep] = useState(1) // For multi-step signup
  const [userType, setUserType] = useState('player') // 'player' or 'company'
  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    username: '',
    fullName: '',
    game: '',
    role: '',
    rank: '',
    continent: '',
    country: '',
    phone: '',
    discord: '',
    bio: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setLocalError('')
  }

  const handleLoginSendOTP = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!formData.email) {
      setLocalError('Please enter your email')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError('Please enter a valid email')
      return
    }

    try {
      setIsLoading(true)
      await loginSendOTP(formData.email)
      setStep(2) // Move to OTP verification
    } catch (err) {
      setLocalError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginVerifyOTP = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!formData.otp) {
      setLocalError('Please enter the OTP')
      return
    }

    try {
      setIsLoading(true)
      await loginVerifyOTP(formData.email, formData.otp)
      onClose()
      setFormData({ email: '', otp: '', username: '', fullName: '', game: '', role: '', rank: '', continent: '', country: '', phone: '', discord: '', bio: '' })
      setStep(1)
      setMode('login')
    } catch (err) {
      setLocalError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterStep1SendOTP = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!formData.email) {
      setLocalError('Please enter your email')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError('Please enter a valid email')
      return
    }

    try {
      setIsLoading(true)
      await registerSendOTP(formData.email, formData.phone)
      setStep(2) // Move to OTP verification
    } catch (err) {
      setLocalError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterStep2VerifyOTP = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!formData.otp) {
      setLocalError('Please enter the OTP')
      return
    }

    try {
      setIsLoading(true)
      await registerVerifyOTP(formData.email, formData.otp)
      setStep(3) // Move to personal info
    } catch (err) {
      setLocalError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterStep3PersonalInfo = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!formData.fullName || !formData.username) {
      setLocalError('Please fill in all required fields')
      return
    }

    try {
      setIsLoading(true)
      await registerPersonalInfo(formData.email, formData.fullName, formData.username)
      setStep(4) // Move to gaming profile
    } catch (err) {
      setLocalError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterStep4GamingProfile = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!formData.game || !formData.role || !formData.rank || !formData.continent || !formData.country) {
      setLocalError('Please fill in all required fields')
      return
    }

    try {
      setIsLoading(true)
      await registerGamingProfile(formData.email, {
        primary_game: formData.game,
        game_role: formData.role,
        rank: formData.rank,
        continent: formData.continent,
        country: formData.country,
      })
      onClose()
      setFormData({ email: '', otp: '', username: '', fullName: '', game: '', role: '', rank: '', continent: '', country: '', phone: '', discord: '', bio: '' })
      setStep(1)
      setMode('login')
    } catch (err) {
      setLocalError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const renderLoginForm = () => (
    <motion.form
      onSubmit={step === 1 ? handleLoginSendOTP : handleLoginVerifyOTP}
      className="space-y-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {step === 1 ? (
        <>
          {/* Step 1: Email */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition duration-300 disabled:opacity-50"
              />
            </div>
          </motion.div>
        </>
      ) : (
        <>
          {/* Step 2: OTP */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Verification Code</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition duration-300 disabled:opacity-50"
            />
            <p className="text-xs text-gray-400 mt-2">Check your email for the OTP</p>
          </motion.div>
        </>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {(localError || authError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
          >
            {localError || authError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <motion.button
        variants={itemVariants}
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <>
            <Loader size={20} className="animate-spin" />
            {step === 1 ? 'Sending OTP...' : 'Verifying...'}
          </>
        ) : (
          step === 1 ? 'Send OTP' : 'Verify OTP'
        )}
      </motion.button>

      {/* Back button for step 2 */}
      {step === 2 && (
        <motion.button
          variants={itemVariants}
          type="button"
          onClick={() => setStep(1)}
          className="w-full py-3 border-2 border-purple-500/50 hover:border-purple-400 text-purple-300 font-semibold rounded-lg transition duration-300"
        >
          Back
        </motion.button>
      )}

      {/* Divider */}
      {step === 1 && (
        <>
          <motion.div variants={itemVariants} className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-b from-[#171717] to-[#0a0a14] text-gray-500">Don&apos;t have an account?</span>
            </div>
          </motion.div>

          {/* Switch to Signup */}
          <motion.button
            variants={itemVariants}
            type="button"
            onClick={() => {
              setMode('signup')
              setStep(1)
              setLocalError('')
            }}
            className="w-full py-3 border-2 border-purple-500/50 hover:border-purple-400 text-purple-300 font-semibold rounded-lg transition duration-300 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create New Account
          </motion.button>
        </>
      )}
    </motion.form>
  )

  const renderSignupForm = () => {
    let onSubmit = handleRegisterStep1SendOTP
    if (step === 2) onSubmit = handleRegisterStep2VerifyOTP
    if (step === 3) onSubmit = handleRegisterStep3PersonalInfo
    if (step === 4) onSubmit = handleRegisterStep4GamingProfile

    return (
    <motion.form
      onSubmit={onSubmit}
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Step 1: Email & Phone */}
      {step === 1 && (
        <>
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition duration-300 disabled:opacity-50"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone (Optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1234567890"
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition duration-300 disabled:opacity-50"
            />
          </motion.div>
        </>
      )}

      {/* Step 2: OTP Verification */}
      {step === 2 && (
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-300 mb-2">Verification Code *</label>
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            placeholder="Enter OTP from email"
            disabled={isLoading}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition duration-300 disabled:opacity-50"
          />
          <p className="text-xs text-gray-400 mt-2">Check your email for the verification code</p>
        </motion.div>
      )}

      {/* Step 3: Personal Info */}
      {step === 3 && (
        <>
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition duration-300 disabled:opacity-50"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Gaming Username *</label>
            <div className="relative">
              <Gamepad2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Your gaming username"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition duration-300 disabled:opacity-50"
              />
            </div>
          </motion.div>
        </>
      )}

  {/* Step 4: Gaming Profile */}
  {step === 4 && (
    <>
    <motion.div variants={itemVariants}>
    <label className="block text-sm font-medium text-gray-300 mb-2">Primary Game *</label>
    <select
    name="game"
    value={formData.game}
    onChange={handleChange}
    disabled={isLoading}
    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition duration-300 disabled:opacity-50"
    >
    <option value="">Select a game</option>
    <option value="Valorant">Valorant</option>
    <option value="CS2">CS2</option>
    <option value="Dota 2">Dota 2</option>
    <option value="League of Legends">League of Legends</option>
    <option value="Apex Legends">Apex Legends</option>
    <option value="Fortnite">Fortnite</option>
    <option value="Minecraft">Minecraft</option>
    <option value="Overwatch 2">Overwatch 2</option>
    <option value="Other">Other</option>
    </select>
    </motion.div>
    
    <motion.div variants={itemVariants}>
    <label className="block text-sm font-medium text-gray-300 mb-2">Role *</label>
    <select
    name="role"
    value={formData.role}
    onChange={handleChange}
    disabled={isLoading}
    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition duration-300 disabled:opacity-50"
    >
    <option value="">Select a role</option>
    <option value="Duelist">Duelist</option>
    <option value="Initiator">Initiator</option>
    <option value="Sentinel">Sentinel</option>
    <option value="Controller">Controller</option>
    <option value="Carry">Carry</option>
    <option value="Mid">Mid</option>
    <option value="Support">Support</option>
    <option value="Tank">Tank</option>
    <option value="Jungler">Jungler</option>
    <option value="Other">Other</option>
    </select>
    </motion.div>
    
    <motion.div variants={itemVariants}>
    <label className="block text-sm font-medium text-gray-300 mb-2">Rank *</label>
    <select
    name="rank"
    value={formData.rank}
    onChange={handleChange}
    disabled={isLoading}
    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition duration-300 disabled:opacity-50"
    >
    <option value="">Select a rank</option>
    <option value="Iron">Iron</option>
    <option value="Bronze">Bronze</option>
    <option value="Silver">Silver</option>
    <option value="Gold">Gold</option>
    <option value="Platinum">Platinum</option>
    <option value="Diamond">Diamond</option>
    <option value="Immortal">Immortal</option>
    <option value="Radiant">Radiant</option>
    <option value="Pro">Pro</option>
    </select>
    </motion.div>
    
    <motion.div variants={itemVariants}>
    <label className="block text-sm font-medium text-gray-300 mb-2">Continent *</label>
    <select
    name="continent"
    value={formData.continent}
    onChange={handleChange}
    disabled={isLoading}
    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition duration-300 disabled:opacity-50"
    >
    <option value="">Select a continent</option>
    <option value="North America">North America</option>
    <option value="South America">South America</option>
    <option value="Europe">Europe</option>
    <option value="Africa">Africa</option>
    <option value="Asia">Asia</option>
    <option value="Oceania">Oceania</option>
    </select>
    </motion.div>
    
    <motion.div variants={itemVariants}>
    <label className="block text-sm font-medium text-gray-300 mb-2">Country *</label>
    <select
    name="country"
    value={formData.country}
    onChange={handleChange}
    disabled={isLoading}
    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:bg-white/10 transition duration-300 disabled:opacity-50"
    >
    <option value="">Select a country</option>
    <option value="Bangladesh">Bangladesh</option>
    <option value="India">India</option>
    <option value="Pakistan">Pakistan</option>
    <option value="United States">United States</option>
    <option value="Canada">Canada</option>
    <option value="United Kingdom">United Kingdom</option>
    <option value="Germany">Germany</option>
    <option value="France">France</option>
    <option value="Japan">Japan</option>
    <option value="South Korea">South Korea</option>
    <option value="China">China</option>
    <option value="Brazil">Brazil</option>
    <option value="Australia">Australia</option>
    <option value="Other">Other</option>
    </select>
    </motion.div>
    </>
  )}

      {/* Error Message */}
      <AnimatePresence>
        {(localError || authError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
          >
            {localError || authError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      {step > 1 && (
        <motion.div variants={itemVariants} className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition ${
                i <= step ? 'bg-purple-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        variants={itemVariants}
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <>
            <Loader size={20} className="animate-spin" />
            {step === 1 ? 'Sending OTP...' : step === 2 ? 'Verifying...' : step === 3 ? 'Saving...' : 'Completing...'}
          </>
        ) : (
          step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : step === 3 ? 'Next' : 'Complete Registration'
        )}
      </motion.button>

      {/* Back Button */}
      {step > 1 && (
        <motion.button
          variants={itemVariants}
          type="button"
          onClick={() => setStep(step - 1)}
          disabled={isLoading}
          className="w-full py-3 border-2 border-purple-500/50 hover:border-purple-400 text-purple-300 font-semibold rounded-lg transition duration-300 disabled:opacity-50"
        >
          Back
        </motion.button>
      )}

      {/* Divider - only show on step 1 */}
      {step === 1 && (
        <>
          <motion.div variants={itemVariants} className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-b from-[#171717] to-[#0a0a14] text-gray-500">Already have an account?</span>
            </div>
          </motion.div>

          {/* Switch to Login */}
          <motion.button
            variants={itemVariants}
            type="button"
            onClick={() => {
              setMode('login')
              setStep(1)
              setLocalError('')
            }}
            className="w-full py-3 border-2 border-purple-500/50 hover:border-purple-400 text-purple-300 font-semibold rounded-lg transition duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign In Instead
          </motion.button>
        </>
      )}
    </motion.form>
    )
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
            onClick={onClose}
            transition={{ duration: 0.3 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.85, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="relative bg-gradient-to-b from-[#171717] to-[#0a0a14] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />

              {/* Content */}
              <div className="relative p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                      {mode === 'login' ? 'Welcome Back' : 'Join SliceNShare'}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">{mode === 'login' ? 'Sign in to your account' : 'Create your gaming profile'}</p>
                  </motion.div>
                  <motion.button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                {/* Form */}
                {mode === 'login' ? renderLoginForm() : renderSignupForm()}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
