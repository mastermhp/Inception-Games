'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, ImageIcon, User, AtSign, Phone, MessageCircle, FileText, Gamepad2, Globe, Award, MapPin, ChevronRight, Loader2, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { REGION_DATA, CONTINENTS } from '@/lib/regionData'

const GAMES = ['Valorant', 'League of Legends', 'CS:GO', 'Dota 2', 'Fortnite', 'Apex Legends', 'PUBG Mobile', 'Free Fire', 'MLBB', 'Call of Duty Mobile', 'PUBG PC']

const ROLES = {
  Valorant: ['Duelist', 'Controller', 'Initiator', 'Sentinel'],
  'League of Legends': ['Top', 'Jungle', 'Mid', 'ADC', 'Support'],
  'CS:GO': ['Rifler', 'AWPer', 'Support', 'Entry', 'IGL'],
  'Dota 2': ['Carry', 'Mid', 'Off-lane', 'Support', 'Hard Support'],
  Fortnite: ['Solo', 'Team', 'Creative'],
  'Apex Legends': ['Assault', 'Tracker', 'Support', 'Recon'],
  'PUBG Mobile': ['Assaulter', 'Sniper', 'Support', 'IGL', 'Scout'],
  'Free Fire': ['Rusher', 'Sniper', 'Support', 'Leader'],
  'MLBB': ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'],
  'Call of Duty Mobile': ['Slayer', 'Objective', 'Support', 'Anchor', 'Flex'],
  'PUBG PC': ['Assaulter', 'Sniper', 'Support', 'IGL', 'Scout'],
}

const RANKS = {
  Valorant: ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant'],
  'League of Legends': ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Challenger'],
  'CS:GO': ['Silver 1', 'Silver 2', 'SEM', 'Gold Nova', 'GN2', 'GN3', 'MG', 'DMG', 'LE', 'LEM', 'SMFC', 'Global'],
  'Dota 2': ['Herald', 'Guardian', 'Crusader', 'Archon', 'Legend', 'Ancient', 'Divine', 'Immortal'],
  Fortnite: ['Open', 'Contender', 'Champion'],
  'Apex Legends': ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Apex Predator'],
  'PUBG Mobile': ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crown', 'Ace', 'Conqueror'],
  'Free Fire': ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Heroic', 'Grandmaster'],
  'MLBB': ['Warrior', 'Elite', 'Master', 'Grandmaster', 'Epic', 'Legend', 'Mythic', 'Mythical Glory'],
  'Call of Duty Mobile': ['Rookie', 'Veteran', 'Elite', 'Pro', 'Master', 'Grandmaster', 'Legendary'],
  'PUBG PC': ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Conqueror'],
}

export default function SignupModal({ isOpen, onClose, email, step: initialStep = 3, onComplete }) {
  const router = useRouter()
  const { updateProfile, error } = useAuth()
  const [step, setStep] = useState(initialStep)
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    fullName: '', username: '', phone: '', discord: '', bio: '', game: '', role: '', rank: '',
  })
  const [selectedContinent, setSelectedContinent] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [profileImagePreview, setProfileImagePreview] = useState(null)
  const [bannerImagePreview, setBannerImagePreview] = useState(null)
  const profileInputRef = useRef(null)
  const bannerInputRef = useRef(null)

  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setLocalError('Image must be less than 5MB')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'profile') setProfileImagePreview(reader.result)
      else setBannerImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      if (name === 'game') {
        updated.role = ''
        updated.rank = ''
      }
      return updated
    })
    setLocalError('')
  }

  const handleClose = () => {
    setStep(3)
    setFormData({ fullName: '', username: '', phone: '', discord: '', bio: '', game: '', role: '', rank: '' })
    setSelectedContinent(''); setSelectedCountry(''); setSelectedCity('')
    setProfileImagePreview(null); setBannerImagePreview(null)
    setLocalError(''); setMessage('')
    onClose()
  }

  const handleNextStep = () => {
    if (step === 3) {
      if (!formData.fullName.trim()) { setLocalError('Full name is required'); return }
      if (!formData.username.trim()) { setLocalError('Gamer tag is required'); return }
      setLocalError('')
      setStep(4)
    } else if (step === 4) {
      setLocalError('')
      setStep(5)
    }
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
    setLocalError('')
  }

  const getRegionString = () => {
    const parts = [selectedCity, selectedCountry, selectedContinent].filter(Boolean)
    return parts.join(', ')
  }

  const handleCompleteSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      console.log('[v0] Completing signup with email:', email)
      
      const region = getRegionString()
      const gamingProfile = {
        username: formData.username || formData.fullName,
        bio: formData.bio,
        game: formData.game,
        role: formData.role,
        region,
        rank: formData.rank,
        discord: formData.discord,
        profileImagePreview,
        bannerImagePreview,
      }

      console.log('[v0] Gaming profile:', gamingProfile)
      
      sessionStorage.setItem('sns_gaming_profile', JSON.stringify(gamingProfile))

      if (formData.fullName.trim()) {
        await updateProfile({ fullName: formData.fullName, phone: formData.phone || undefined })
      }

      setMessage('Welcome to SliceNShare!')
      setTimeout(() => {
        handleClose()
        router.push('/profile')
      }, 800)
    } catch (err) {
      console.error('[v0] Signup error:', err)
      setLocalError(err.message || 'Failed to complete signup')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition text-sm"
  const selectClass = "w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition text-sm appearance-none cursor-pointer"

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} />
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.92, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 28 }}
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(168,85,247,0.3) transparent' }}
          >
            <div className="relative bg-[#111118] rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-xl font-bold text-white">Complete Your Profile</h2>
                  <p className="text-gray-500 text-xs mt-1">
                    {step === 3 && 'Personal information'}
                    {step === 4 && 'Gaming information'}
                    {step === 5 && 'Profile images'}
                  </p>
                </div>
                <motion.button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-white transition p-2 hover:bg-white/5 rounded-lg disabled:opacity-50"
                  disabled={loading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <form className="p-6 space-y-5">
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-300 text-sm"
                  >
                    {message}
                  </motion.div>
                )}

                {localError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm"
                  >
                    {localError}
                  </motion.div>
                )}

                {/* STEP 3: Personal */}
                {step === 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Personal</h4>
                      <div className="space-y-3">
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name *" className={inputClass} />
                        </div>
                        <div className="relative">
                          <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Gamer Tag / Username *" className={inputClass} />
                        </div>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" className={inputClass} />
                        </div>
                        <div className="relative">
                          <MessageCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                          <input type="text" name="discord" value={formData.discord} onChange={handleChange} placeholder="Discord username" className={inputClass} />
                        </div>
                        <div className="relative">
                          <FileText className="absolute left-3.5 top-3 text-gray-600 w-4 h-4" />
                          <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" rows={2} className={`${inputClass} resize-none`} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Gaming */}
                {step === 4 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Gaming</h4>
                      <div className="space-y-3">
                        <div className="relative">
                          <Gamepad2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                          <select name="game" value={formData.game} onChange={handleChange} className={selectClass}>
                            <option value="" className="bg-[#1a1a24]">Select game</option>
                            {GAMES.map(g => <option key={g} value={g} className="bg-[#1a1a24]">{g}</option>)}
                          </select>
                          <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 rotate-90 pointer-events-none" />
                        </div>

                        {formData.game && ROLES[formData.game] && (
                          <div>
                            <p className="text-xs text-gray-500 mb-2">Role</p>
                            <div className="flex flex-wrap gap-1.5">
                              {ROLES[formData.game].map(r => (
                                <button
                                  key={r}
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, role: r }))}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                    formData.role === r
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                      : 'bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:text-gray-300'
                                  }`}
                                >
                                  {r}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {formData.game && RANKS[formData.game] && (
                          <div className="relative">
                            <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                            <select name="rank" value={formData.rank} onChange={handleChange} className={selectClass}>
                              <option value="" className="bg-[#1a1a24]">Select rank</option>
                              {RANKS[formData.game].map(rank => <option key={rank} value={rank} className="bg-[#1a1a24]">{rank}</option>)}
                            </select>
                            <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 rotate-90 pointer-events-none" />
                          </div>
                        )}

                        <div className="relative">
                          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                          <select value={selectedContinent} onChange={(e) => { setSelectedContinent(e.target.value); setSelectedCountry(''); setSelectedCity('') }} className={selectClass}>
                            <option value="" className="bg-[#1a1a24]">Select continent</option>
                            {CONTINENTS.map(c => <option key={c} value={c} className="bg-[#1a1a24]">{c}</option>)}
                          </select>
                          <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 rotate-90 pointer-events-none" />
                        </div>

                        {selectedContinent && (
                          <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                            <select value={selectedCountry} onChange={(e) => { setSelectedCountry(e.target.value); setSelectedCity('') }} className={selectClass}>
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
                            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className={selectClass}>
                              <option value="" className="bg-[#1a1a24]">Select city / state</option>
                              {REGION_DATA[selectedContinent][selectedCountry].map(city => (
                                <option key={city} value={city} className="bg-[#1a1a24]">{city}</option>
                              ))}
                            </select>
                            <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 rotate-90 pointer-events-none" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: Images */}
                {step === 5 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Images</h4>
                      <div onClick={() => bannerInputRef.current?.click()} className="relative w-full h-28 rounded-xl border-2 border-dashed border-white/[0.1] hover:border-purple-500/30 bg-white/[0.02] cursor-pointer transition-all overflow-hidden group mb-3">
                        {bannerImagePreview ? (
                          <>
                            <img src={bannerImagePreview} alt="Banner" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Camera size={20} className="text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full gap-1.5 text-gray-600">
                            <ImageIcon size={22} />
                            <span className="text-[10px]">Upload banner image</span>
                          </div>
                        )}
                        <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'banner')} />
                      </div>
                      <div className="flex items-center gap-4">
                        <div onClick={() => profileInputRef.current?.click()} className="relative w-20 h-20 rounded-2xl border-2 border-dashed border-white/[0.1] hover:border-purple-500/30 bg-white/[0.02] cursor-pointer transition-all overflow-hidden group flex-shrink-0">
                          {profileImagePreview ? (
                            <>
                              <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Camera size={16} className="text-white" />
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-0.5 text-gray-600">
                              <Camera size={18} />
                              <span className="text-[9px]">Upload</span>
                            </div>
                          )}
                          <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'profile')} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Profile picture</p>
                          <p className="text-[10px] text-gray-600 mt-0.5">Square, max 5MB</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 pt-6 border-t border-white/[0.06]">
                  {step > 3 && (
                    <motion.button
                      type="button"
                      onClick={handlePreviousStep}
                      disabled={loading}
                      className="flex-1 py-3 border border-white/[0.1] hover:border-white/[0.2] text-white font-semibold rounded-xl transition disabled:opacity-50"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Back
                    </motion.button>
                  )}
                  <motion.button
                    type="button"
                    onClick={step < 5 ? handleNextStep : handleCompleteSignup}
                    disabled={loading || (step === 3 && (!formData.fullName || !formData.username))}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Saving...
                      </>
                    ) : step < 5 ? (
                      <>Next <ChevronRight size={16} /></>
                    ) : (
                      <>Complete <Check size={16} /></>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
