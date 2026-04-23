'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, AtSign, Gamepad2, Globe, Award, MessageCircle, FileText, Loader, Check, Camera, ImageIcon, Phone, MapPin, ChevronRight } from 'lucide-react'
// import { useAuth } from '@/hooks/useAuth.js'
import { REGION_DATA, CONTINENTS, parseRegionString } from '@/lib/regionData'
import { useAuth } from '@/app/context/AuthContext'

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



export default function EditProfileModal({ isOpen, onClose, user, gamingProfile, onProfileUpdate }) {
  const { updateProfile, user: contextUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    fullName: '', phone: '', username: '', bio: '', game: '', role: '', rank: '', discord: '',
  })
  
  // Use contextUser as fallback if user prop is not provided
  const currentUser = user || contextUser
  const [selectedContinent, setSelectedContinent] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [profileImagePreview, setProfileImagePreview] = useState(null)
  const [bannerImagePreview, setBannerImagePreview] = useState(null)
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [bannerImageFile, setBannerImageFile] = useState(null)
  const profileInputRef = useRef(null)
  const bannerInputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      console.log("[v0] EditProfileModal opened, current user:", currentUser?.id, currentUser?.email)
      const existingRegion = currentUser?.region || gamingProfile?.region || ''
      const { continent, country, city } = parseRegionString(existingRegion)
      setSelectedContinent(continent || currentUser?.continent || '')
      setSelectedCountry(country || currentUser?.country || '')
      setSelectedCity(city || '')
      setFormData({
        fullName: currentUser?.fullName || currentUser?.full_name || '',
        phone: currentUser?.phone || '',
        username: currentUser?.username || '',
        bio: currentUser?.bio || '',
        game: currentUser?.primaryGame || currentUser?.primary_game || '',
        role: currentUser?.gameRole || currentUser?.game_role || '',
        rank: currentUser?.rank || '',
        discord: currentUser?.discord || '',
      })
      setProfileImagePreview(currentUser?.avatar || currentUser?.avatar_url || null)
      setBannerImagePreview(currentUser?.banner || currentUser?.banner_url || null)
      setProfileImageFile(null)
      setBannerImageFile(null)
      setMessage(''); setError('')
    }
  }, [isOpen, currentUser, gamingProfile])

  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Image must be less than 5MB'); return }
    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'profile') {
        setProfileImagePreview(reader.result)
        setProfileImageFile(file)
      } else {
        setBannerImagePreview(reader.result)
        setBannerImageFile(file)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
    if (name === 'game') setFormData(prev => ({ ...prev, role: '', rank: '' }))
  }

  const getRegionString = () => {
    const parts = [selectedCity, selectedCountry, selectedContinent].filter(Boolean)
    return parts.join(', ')
  }

  // Separate continent, country, city from combined region string
  const extractRegionParts = (regionStr) => {
    if (!regionStr) return {}
    const parts = regionStr.split(', ')
    // Assuming format: "City, Country, Continent" when all present
    return {
      city: parts[0] || '',
      country: parts[1] || '',
      continent: parts[2] || ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentUser?.id) {
      const errorMsg = `User ID not found. CurrentUser: ${JSON.stringify(currentUser)}`
      console.error("[v0]", errorMsg)
      setError('User ID not found. Please log in again.')
      return
    }
    setLoading(true)
    setError('')
    setMessage('')
    try {
      console.log("[v0] Starting profile update for user:", currentUser.id)
      const formDataToSend = new FormData()
      
      // Append all text fields with their correct API field names
      formDataToSend.append('full_name', formData.fullName)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('username', formData.username)
      formDataToSend.append('bio', formData.bio)
      formDataToSend.append('primary_game', formData.game)
      formDataToSend.append('game_role', formData.role)
      formDataToSend.append('rank', formData.rank)
      formDataToSend.append('discord', formData.discord)
      
      // Add region/location info
      formDataToSend.append('continent', selectedContinent)
      formDataToSend.append('country', selectedCountry)
      if (selectedCity) {
        formDataToSend.append('city', selectedCity)
      }
      
      // Add region as combined string if any location is selected
      if (selectedContinent || selectedCountry || selectedCity) {
        const regionParts = [selectedCity, selectedCountry, selectedContinent].filter(Boolean)
        formDataToSend.append('region', regionParts.join(', '))
      }
      
      // Append image files only if they were selected
      if (profileImageFile) {
        console.log("[v0] Appending profile image file:", profileImageFile.name)
        formDataToSend.append('avatar', profileImageFile)
      }
      if (bannerImageFile) {
        console.log("[v0] Appending banner image file:", bannerImageFile.name)
        formDataToSend.append('banner', bannerImageFile)
      }
      
      console.log("[v0] Calling updateProfile with user ID:", currentUser.id)
      await updateProfile(currentUser.id, formDataToSend)
      setMessage('Profile updated successfully!')
      setTimeout(() => onClose(), 1000)
    } catch (err) { 
      console.error("[v0] Profile update error:", err)
      const errorMsg = err.message || 'Failed to update profile'
      setError(errorMsg)
    }
    finally { setLoading(false) }
  }

  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition text-sm"
  const selectClass = "w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition text-sm appearance-none cursor-pointer"

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
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
                  <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                  <p className="text-gray-500 text-xs mt-1">Update your personal and gaming information</p>
                </div>
                <motion.button onClick={onClose} className="text-gray-500 hover:text-white transition p-2 hover:bg-white/5 rounded-lg" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <X size={20} />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <AnimatePresence mode="wait">
                  {message && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-300 text-sm">{message}</motion.div>}
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
                      {error.includes('access token') ? (
                        <div>
                          <p className="font-semibold mb-1">Authentication Required</p>
                          <p className="text-xs opacity-90">Your session has expired. Please log out and log back in to update your profile.</p>
                        </div>
                      ) : (
                        error
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Images Section */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Images</h4>
                  {/* Banner */}
                  <div onClick={() => bannerInputRef.current?.click()} className="relative w-full h-28 rounded-xl border-2 border-dashed border-white/[0.1] hover:border-purple-500/30 bg-white/[0.02] cursor-pointer transition-all overflow-hidden group mb-3">
                    {bannerImagePreview ? (
                      <><img src={bannerImagePreview} alt="Banner" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={20} className="text-white" /></div></>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-1.5 text-gray-600"><ImageIcon size={22} /><span className="text-[10px]">Upload banner image</span></div>
                    )}
                    <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'banner')} />
                  </div>
                  {/* Profile pic */}
                  <div className="flex items-center gap-4">
                    <div onClick={() => profileInputRef.current?.click()} className="relative w-20 h-20 rounded-2xl border-2 border-dashed border-white/[0.1] hover:border-purple-500/30 bg-white/[0.02] cursor-pointer transition-all overflow-hidden group flex-shrink-0">
                      {profileImagePreview ? (
                        <><img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={16} className="text-white" /></div></>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-0.5 text-gray-600"><Camera size={18} /><span className="text-[9px]">Upload</span></div>
                      )}
                      <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'profile')} />
                    </div>
                    <div><p className="text-xs text-gray-400">Profile picture</p><p className="text-[10px] text-gray-600 mt-0.5">Square, max 5MB</p></div>
                  </div>
                </div>

                {/* Personal Section */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Personal</h4>
                  <div className="space-y-3">
                    <div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" /><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className={inputClass} /></div>
                    <div className="relative"><Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" /><input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" className={inputClass} /></div>
                    <div className="relative"><AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" /><input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Gamer Tag / Username" className={inputClass} /></div>
                    <div className="relative"><MessageCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" /><input type="text" name="discord" value={formData.discord} onChange={handleChange} placeholder="Discord username" className={inputClass} /></div>
                    <div className="relative"><FileText className="absolute left-3.5 top-3 text-gray-600 w-4 h-4" /><textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" rows={2} className={`${inputClass} resize-none`} /></div>
                  </div>
                </div>

                {/* Gaming Section */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Gaming</h4>
                  <div className="space-y-3">
                    <div className="relative">
                      <Gamepad2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                      <select name="game" value={formData.game} onChange={handleChange} className={selectClass}>
                        <option value="" className="bg-[#1a1a24]">Select game</option>
                        {GAMES.map(g => <option key={g} value={g} className="bg-[#1a1a24]">{g}</option>)}
                      </select>
                    </div>
                    {formData.game && ROLES[formData.game] && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Role</p>
                        <div className="flex flex-wrap gap-1.5">
                          {ROLES[formData.game].map(r => (
                            <button key={r} type="button" onClick={() => setFormData(prev => ({ ...prev, role: r }))}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${formData.role === r ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:text-gray-300'}`}>{r}</button>
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
                      </div>
                    )}
                    {/* Continent */}
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                      <select value={selectedContinent} onChange={(e) => { setSelectedContinent(e.target.value); setSelectedCountry(''); setSelectedCity('') }} className={selectClass}>
                        <option value="" className="bg-[#1a1a24]">Select continent</option>
                        {CONTINENTS.map(c => <option key={c} value={c} className="bg-[#1a1a24]">{c}</option>)}
                      </select>
                      <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 rotate-90 pointer-events-none" />
                    </div>
                    {/* Country */}
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
                    {/* City / State */}
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

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <motion.button type="submit" disabled={loading}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    {loading ? <><Loader size={16} className="animate-spin" /> Saving...</> : <><Check size={16} /> Save Changes</>}
                  </motion.button>
                  {error?.includes('access token') && (
                    <motion.button type="button" onClick={onClose}
                      className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 text-sm"
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      Close & Re-login
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
