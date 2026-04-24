'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Loader, User, Gamepad2, Award, Globe, MapPin, MessageCircle, FileText, Check, ChevronRight, AtSign, Phone } from 'lucide-react'
// import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { REGION_DATA, CONTINENTS, parseRegionString } from '@/lib/regionData'
import { useAuth } from '@/app/context/AuthContext'

const GAMES = [
  'Valorant',
  'League of Legends',
  'CS2',
  'Dota 2',
  'Fortnite',
  'Apex Legends',
  'PUBG Mobile',
  'Free Fire',
  'MLBB',
  'Call of Duty Mobile',
  'PUBG PC',

  // NEW (from image)
  'Rainbow Six Siege',
  'CrossFire',
  'Overwatch 2',
  'Warzone',
  'EA Sports FC',
  'Rocket League',
  'Trackmania',
  'Fatal Fury: City of the Wolves',
  'Street Fighter 6',
  'Tekken 8',
  'Chess',
  'Teamfight Tactics',
  'Call of Duty Black Ops',
  'eFootball',
  'Clash of Clans',
  'Clash Royale',
  'FC Mobile',
  'Assetto Corsa',
  'Delta Force'
]
const ROLES = {
  Valorant: ['Duelist', 'Controller', 'Initiator', 'Sentinel'],
  'League of Legends': ['Top', 'Jungle', 'Mid', 'ADC', 'Support'],
  'CS2': ['Rifler', 'AWPer', 'Support', 'Entry', 'IGL'],
  'Dota 2': ['Carry', 'Mid', 'Off-lane', 'Support', 'Hard Support'],
  Fortnite: ['Solo', 'Team', 'Creative'],
  'Apex Legends': ['Assault', 'Tracker', 'Support', 'Recon'],
  'PUBG Mobile': ['Assaulter', 'Sniper', 'Support', 'IGL', 'Scout'],
  'Free Fire': ['Rusher', 'Sniper', 'Support', 'Leader'],
  MLBB: ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'],
  'Call of Duty Mobile': ['Slayer', 'Objective', 'Support', 'Anchor', 'Flex'],
  'PUBG PC': ['Assaulter', 'Sniper', 'Support', 'IGL', 'Scout'],

  // NEW
  'Rainbow Six Siege': ['Entry Fragger', 'Support', 'Anchor', 'Roamer', 'IGL'],
  'CrossFire': ['Sniper', 'Rifler', 'Support', 'Entry'],
  'Overwatch 2': ['Tank', 'Damage', 'Support'],
  'Warzone': ['Sniper', 'Assaulter', 'Support', 'Scout'],
  'Rocket League': ['Striker', 'Defender', 'Playmaker'],
  'Teamfight Tactics': ['Flex', 'Economy', 'Aggro'],
  'Call of Duty Black Ops': ['Slayer', 'Objective', 'Support', 'Anchor'],
  'eFootball': ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
  'Clash of Clans': ['Attacker', 'Defender', 'Strategist'],
  'Clash Royale': ['Cycle', 'Beatdown', 'Control'],
  'FC Mobile': ['Forward', 'Midfielder', 'Defender', 'Goalkeeper']
}
const RANKS = {
  Valorant: ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant'],
  'League of Legends': ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Challenger'],
  'CS2': ['Silver', 'Gold Nova', 'MG', 'DMG', 'LE', 'LEM', 'Supreme', 'Global'],
  'Dota 2': ['Herald', 'Guardian', 'Crusader', 'Archon', 'Legend', 'Ancient', 'Divine', 'Immortal'],
  Fortnite: ['Open', 'Contender', 'Champion'],
  'Apex Legends': ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Apex Predator'],
  'PUBG Mobile': ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crown', 'Ace', 'Conqueror'],
  'Free Fire': ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Heroic', 'Grandmaster'],
  MLBB: ['Warrior', 'Elite', 'Master', 'Grandmaster', 'Epic', 'Legend', 'Mythic', 'Mythical Glory'],
  'Call of Duty Mobile': ['Rookie', 'Veteran', 'Elite', 'Pro', 'Master', 'Grandmaster', 'Legendary'],
  'PUBG PC': ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Conqueror'],

  // NEW
  'Rainbow Six Siege': ['Copper', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Champion'],
  'Overwatch 2': ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Top 500'],
  'Warzone': ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crimson', 'Iridescent', 'Top 250'],
  'Rocket League': ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Champion', 'Grand Champion', 'Supersonic Legend'],
  'Teamfight Tactics': ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Challenger'],
  'eFootball': ['Division 10', 'Division 9', 'Division 8', 'Division 7', 'Division 6', 'Division 5', 'Division 4', 'Division 3', 'Division 2', 'Division 1'],
  'Clash Royale': ['Arena 1–15', 'Challenger', 'Master', 'Champion', 'Ultimate Champion'],
  'FC Mobile': ['Amateur', 'Pro', 'World Class', 'Legendary', 'FIFA Champion']
}

export default function UnifiedAuthModal({ isOpen, onClose, initialMode = 'login', tournamentCategory }) {
  const router = useRouter()
  const { 
    loginSendOTP, 
    loginVerifyOTP,
    registerSendOTP,
    registerVerifyOTP,
    registerPersonalInfo,
    registerGamingProfile,
    registerProfileImages,
    error: authError,
    setSelectedTournamentCategory
  } = useAuth()
  
  const [mode, setMode] = useState(initialMode)
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState('')
  const [selectedContinent, setSelectedContinent] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    username: '',
    fullName: '',
    game: '',
    role: '',
    rank: '',
    phone: '',
    discord: '',
    bio: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }
      // Clear dependent fields when game changes
      if (name === 'game') {
        updated.role = ''
        updated.rank = ''
      }
      return updated
    })
    setLocalError('')
    setMessage('')
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
    setMessage('')

    if (!formData.game || !formData.role || !formData.rank || !selectedContinent || !selectedCountry) {
      setLocalError('Please fill in all required fields')
      return
    }

    try {
      setIsLoading(true)
      const region = [selectedCity, selectedCountry, selectedContinent].filter(Boolean).join(', ')
      await registerGamingProfile(formData.email, {
        primary_game: formData.game,
        game_role: formData.role,
        rank: formData.rank,
        continent: selectedContinent,
        country: selectedCountry,
        region: region,
      })
      // Move to step 5 to finalize registration
      setStep(5)
    } catch (err) {
      setLocalError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterStep5Complete = async (e) => {
    e.preventDefault()
    setLocalError('')
    setMessage('')

    try {
      setIsLoading(true)
      // Complete registration - no image upload needed, images can be added later via edit profile
      await registerProfileImages(formData.email)
      setMessage('Registration successful! Redirecting...')
      
      // Store the selected tournament category if it exists
      if (tournamentCategory) {
        setSelectedTournamentCategory(tournamentCategory)
        // Redirect to events page filtered by category
        setTimeout(() => {
          router.push(`/profile/events?category=${tournamentCategory}`)
          onClose()
        }, 500)
      } else {
        // The AuthContext will handle the redirect to /profile automatically
        // Reset form state
        setFormData({ email: '', otp: '', username: '', fullName: '', game: '', role: '', rank: '', phone: '', discord: '', bio: '' })
        setSelectedContinent('')
        setSelectedCountry('')
        setSelectedCity('')
        setStep(1)
        setMode('login')
        // Close modal after a brief delay
        setTimeout(() => {
          onClose()
        }, 500)
      }
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
    if (step === 5) onSubmit = handleRegisterStep5Complete

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
      <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Gaming Profile</h4>
      <div className="space-y-3">
        <div className="relative">
          <Gamepad2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
          <select name="game" value={formData.game} onChange={handleChange} disabled={isLoading} className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition text-sm appearance-none cursor-pointer">
            <option value="" className="bg-[#1a1a24]">Select game</option>
            {GAMES.map(g => <option key={g} value={g} className="bg-[#1a1a24]">{g}</option>)}
          </select>
        </div>
        
        {formData.game && ROLES[formData.game] && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Role</p>
            <div className="flex flex-wrap gap-1.5">
              {ROLES[formData.game].map(r => (
                <button key={r} type="button" onClick={() => setFormData(prev => ({ ...prev, role: r }))} disabled={isLoading}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${formData.role === r ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:text-gray-300'}`}>{r}</button>
              ))}
            </div>
          </div>
        )}
        
        {formData.game && RANKS[formData.game] && (
          <div className="relative">
            <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
            <select name="rank" value={formData.rank} onChange={handleChange} disabled={isLoading} className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition text-sm appearance-none cursor-pointer">
              <option value="" className="bg-[#1a1a24]">Select rank</option>
              {RANKS[formData.game].map(rank => <option key={rank} value={rank} className="bg-[#1a1a24]">{rank}</option>)}
            </select>
          </div>
        )}
        
        <div className="relative">
          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
          <select value={selectedContinent} onChange={(e) => { setSelectedContinent(e.target.value); setSelectedCountry(''); setSelectedCity('') }} disabled={isLoading} className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition text-sm appearance-none cursor-pointer">
            <option value="" className="bg-[#1a1a24]">Select continent</option>
            {CONTINENTS.map(c => <option key={c} value={c} className="bg-[#1a1a24]">{c}</option>)}
          </select>
          <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 rotate-90 pointer-events-none" />
        </div>
        
        {selectedContinent && (
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
            <select value={selectedCountry} onChange={(e) => { setSelectedCountry(e.target.value); setSelectedCity('') }} disabled={isLoading} className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition text-sm appearance-none cursor-pointer">
              <option value="" className="bg-[#1a1a24]">Select country</option>
              {Object.keys(REGION_DATA[selectedContinent] || {}).map(country => (
                <option key={country} value={country} className="bg-[#1a1a24]">{country}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 rotate-90 pointer-events-none" />
          </div>
        )}
        
        {selectedCountry && REGION_DATA[selectedContinent]?.[selectedCountry]?.length > 0 && (
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={isLoading} className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition text-sm appearance-none cursor-pointer">
              <option value="" className="bg-[#1a1a24]">Select city / state</option>
              {REGION_DATA[selectedContinent][selectedCountry].map(city => (
                <option key={city} value={city} className="bg-[#1a1a24]">{city}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 rotate-90 pointer-events-none" />
          </div>
        )}
      </div>
    </motion.div>
    </>
  )}

  {/* Step 5: Confirmation - Complete Registration */}
  {step === 5 && (
    <motion.div variants={itemVariants} className="text-center py-4">
      <div className="mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="inline-block p-4 bg-purple-500/20 rounded-full"
        >
          <Check className="w-8 h-8 text-purple-400" />
        </motion.div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Almost there!</h3>
      <p className="text-gray-400 text-sm mb-6">Complete your registration to start your gaming journey on SliceNShare.</p>
      <div className="space-y-3">
        <motion.button
          variants={itemVariants}
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition disabled:opacity-50"
        >
          {isLoading ? (
            <><Loader size={16} className="animate-spin inline mr-2" /> Completing...</>
          ) : (
            <>Complete Registration</>
          )}
        </motion.button>
      </div>
    </motion.div>
  )}

      {/* Error & Success Messages */}
      <AnimatePresence>
        {message && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-300 text-sm">{message}</motion.div>}
        {(localError || authError) && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">{localError || authError}</motion.div>}
      </AnimatePresence>

      {/* Progress Indicator */}
      {mode === 'signup' && step > 1 && step < 5 && (
        <motion.div variants={itemVariants} className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition ${i <= step ? 'bg-purple-500' : 'bg-gray-700'}`} />
          ))}
        </motion.div>
      )}

      {/* Submit Button - Skip for step 5, it has its own */}
      {step !== 5 && (
        <motion.button
          variants={itemVariants}
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {isLoading ? (
            <><Loader size={16} className="animate-spin" /> {step === 1 ? 'Sending OTP...' : step === 2 ? 'Verifying...' : step === 3 ? 'Saving...' : 'Completing...'}</>
          ) : (
            <>{step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : step === 3 ? 'Next' : <>Complete Registration</>}</>
          )}
        </motion.button>
      )}

      {/* Back Button */}
      {step > 1 && step !== 5 && (
        <motion.button
          variants={itemVariants}
          type="button"
          onClick={() => setStep(step - 1)}
          disabled={isLoading}
          className="w-full py-3 border border-white/[0.08] text-gray-400 hover:text-white font-semibold rounded-xl transition disabled:opacity-50"
        >
          Back
        </motion.button>
      )}

      {/* Back Button for Step 5 */}
      {step === 5 && (
        <motion.button
          variants={itemVariants}
          type="button"
          onClick={() => setStep(4)}
          disabled={isLoading}
          className="w-full py-3 border border-white/[0.08] text-gray-400 hover:text-white font-semibold rounded-xl transition disabled:opacity-50"
        >
          Back
        </motion.button>
      )}

      {/* Divider - only show on step 1 */}
      {step === 1 && mode === 'signup' && (
        <>
          <motion.div variants={itemVariants} className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-b from-[#171717] to-[#0a0a14] text-gray-500">Already have an account?</span>
            </div>
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="button"
            onClick={() => {
              setMode('login')
              setStep(1)
              setLocalError('')
              setMessage('')
            }}
            className="w-full py-3 border border-white/[0.08] text-gray-400 hover:text-white font-semibold rounded-xl transition"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Sign In Instead
          </motion.button>
        </>
      )}

      {/* Divider for login - show switch to signup */}
      {step === 1 && mode === 'login' && (
        <>
          <motion.div variants={itemVariants} className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-b from-[#171717] to-[#0a0a14] text-gray-500">Don&apos;t have an account?</span>
            </div>
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="button"
            onClick={() => {
              setMode('signup')
              setStep(1)
              setLocalError('')
              setMessage('')
            }}
            className="w-full py-3 border border-white/[0.08] text-gray-400 hover:text-white font-semibold rounded-xl transition"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Create New Account
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
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 28 }}
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(168,85,247,0.3) transparent' }}
          >
            <div className="relative bg-[#111118] rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {mode === 'login' ? 'Welcome Back' : 'Join Inception Games'}
                  </h2>
                  <p className="text-gray-500 text-xs mt-1">
                    {mode === 'login' ? 'Sign in to your account' : 'Create your gaming profile'}
                  </p>
                </div>
                <motion.button
                  onClick={onClose}
                  className="text-gray-500 hover:text-white transition p-2 hover:bg-white/5 rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-5">
                {mode === 'login' ? renderLoginForm() : renderSignupForm()}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
