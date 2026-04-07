'use client'

import React, { useState, useEffect, useRef, useContext } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, Calendar, MapPin, Monitor, Users, DollarSign, Flag,
  Bell, Heart, Share2, CheckCircle2, ArrowLeft, ExternalLink, Clock,
  CheckCircle, AlertCircle, X, Loader2, Shield, ArrowRight
} from 'lucide-react'
import Image from 'next/image'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { API } from '@/lib/api'
import { AuthContext } from '@/app/context/AuthContext'

// Games data (from NewSignupModal)
const games = [
  { id: "apex", name: "Apex Legends", image: "/games/apex.png" },
  { id: "cod-bo7", name: "Call of Duty: Black Ops 7", image: "/games/codm.png" },
  { id: "cod-warzone", name: "Call of Duty: Warzone", image: "/games/codm.png" },
  { id: "chess", name: "Chess", image: "/games/chess.png" },
  { id: "cs2", name: "Counter-Strike 2", image: "/games/csgo.png" },
  { id: "crossfire", name: "Crossfire", image: "/games/cf.jpeg" },
  { id: "dota2", name: "Dota 2", image: "/games/dota2.png" },
  { id: "fc26-pc", name: "FC26 - PC", image: "/games/fifapc.png" },
  { id: "fc26-consoles", name: "FC26 - Consoles", image: "/games/fcconsole.png" },
  { id: "fc26-mobile", name: "FC26 - Mobile", image: "/games/fcmobile.png" },
  { id: "efootball-pc", name: "eFootball - PC", image: "/games/efootballpc.png" },
  { id: "efootball-consoles", name: "eFootball - Consoles", image: "/games/efootballconsole.png" },
  { id: "efootball-mobile", name: "eFootball - Mobile", image: "/games/efootballmobile.png" },
  { id: "fatal-fury", name: "Fatal Fury: City of the Wolves", image: "/games/ff.jpeg" },
  { id: "freefire", name: "Free Fire", image: "/games/freefire.png" },
  { id: "hok", name: "Honor of Kings", image: "/games/hk.jpeg" },
  { id: "lol", name: "League of Legends", image: "/games/lol.png" },
  { id: "mlbb", name: "Mobile Legends: Bang Bang", image: "/games/mlbb.png" },
  { id: "overwatch2", name: "Overwatch 2", image: "/games/overwatch.png" },
  { id: "pubg", name: "PUBG / PUBG: Battlegrounds", image: "/games/pubg.png" },
  { id: "pubg-mobile", name: "PUBG Mobile", image: "/games/pubg.png" },
  { id: "r6x", name: "Rainbow Six Siege X", image: "/games/r6.jpeg" },
  { id: "sf6", name: "Street Fighter 6", image: "/games/sf6.png" },
  { id: "tft", name: "Teamfight Tactics", image: "/games/tt.jpeg" },
  { id: "valorant", name: "VALORANT", image: "/games/valorant.png" },
  { id: "valorant-mobile", name: "VALORANT Mobile", image: "/games/valorant.png" },
  { id: "coc", name: "Clash of Clans", image: "/games/coc.png" },
  { id: "tekken8", name: "Tekken 8", image: "/games/tekken.jpeg" },
  { id: "mk11", name: "Mortal Kombat 11", image: "/games/mk11.png" },
  { id: "brawlstars", name: "Brawl Stars", image: "/games/brawlstars.png" },
]

// Helper to get game image from title or game name
function getGameImage(eventTitle, gameName) {
  // Try to find a matching game from the games list
  const searchTerm = (gameName || eventTitle || '').toLowerCase()
  const matchedGame = games.find(g => 
    searchTerm.includes(g.name.toLowerCase()) || 
    g.name.toLowerCase().includes(searchTerm.split(' ')[0])
  )
  return matchedGame?.image || '/games/pubg.png' // Default fallback
}

// Helper to determine event type from title
function getEventType(title, organizer) {
  const lowerTitle = (title || '').toLowerCase()
  const lowerOrg = (organizer || '').toLowerCase()
  
  if (lowerTitle.includes('brand') || lowerTitle.includes('deal') || lowerTitle.includes('sponsor')) {
    return 'Brand Deal'
  }
  if (lowerTitle.includes('scrim')) {
    return 'Scrims'
  }
  return 'Tournament'
}

// Generate sample events (same logic as EventsSection)
const generateSampleEvents = () => {
  const eventTypes = ['Tournament', 'Scrims', 'Brand Deal']
  const statuses = ['Upcoming', 'Ongoing', 'Completed']
  const platforms = ['PC', 'Mobile', 'Console']
  const teamTypes = ['Solo', 'Duo', 'Squad']
  const locations = ['Bangladesh', 'India', 'Southeast Asia', 'Global']
  
  const events = []   // need to be fix 
  let eventId = 0  
  
  games.forEach((game, gameIdx) => {
    eventTypes.forEach((eventType, typeIdx) => {
      const idx = eventId
      const status = statuses[idx % 3]
      const platform = platforms[gameIdx % 3]
      const teamType = teamTypes[gameIdx % 3]
      
      const baseDate = new Date()
      baseDate.setDate(baseDate.getDate() + (idx * 2) - 30)
      
      events.push({
        id: `event-${eventId}`,
        title: `SNS ${game.name} ${eventType} ${eventType === 'Brand Deal' ? 'Opportunity' : 'Championship'}`,
        game: game,
        eventType: eventType,
        status: status,
        date: baseDate.toISOString(),
        endDate: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: locations[gameIdx % 4],
        platform: platform,
        teamType: teamType,
        prizePool: eventType === 'Brand Deal' ? 0 : (gameIdx + 1) * 5000,
        currency: 'BDT',
        totalSlots: 64,
        filledSlots: Math.floor(Math.random() * 64),
        registrationStart: new Date(baseDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        registrationEnd: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        tournamentStart: baseDate.toISOString(),
        tournamentEnd: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        host: 'Inception Games',
        description: `Join the ${game.name} ${eventType.toLowerCase()} and compete against the best players in ${locations[gameIdx % 4]}!`,
        rules: [
          'All participants must be registered before the deadline',
          'Fair play policy strictly enforced',
          'All matches will be streamed on official channels',
          'Prizes will be distributed within 7 days of event completion',
        ],
        address: eventType !== 'Brand Deal' ? 'Online Event' : 'Contact for Details',
      })
      eventId++
    })
  })
  
  return events
}

const SAMPLE_EVENTS = generateSampleEvents()

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${days[date.getDay()]} ${date.getDate()}${getOrdinalSuffix(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()}`
}

function formatDateTime(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function formatTime(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'Upcoming': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    case 'Ongoing': return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    case 'Completed': return 'text-red-400 bg-red-500/10 border-red-500/30'
    default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
  }
}

function getStatusText(status) {
  switch (status) {
    case 'Upcoming': return 'Registration Open'
    case 'Ongoing': return 'In Progress'
    case 'Completed': return 'Tournament Ended'
    default: return status
  }
}

// Animated Input Component
function AnimatedInput({ label, type = 'text', name, value, onChange, required, options, placeholder }) {
  if (type === 'select') {
    return (
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full p-4 pt-6 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all appearance-none cursor-pointer"
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <label className="absolute left-4 top-2 text-xs text-gray-400">{label}</label>
      </div>
    )
  }
  
  if (type === 'textarea') {
    return (
      <div className="relative">
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={3}
          placeholder=" "
          className="w-full p-4 pt-6 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all peer resize-none"
        />
        <label className={`absolute left-4 transition-all pointer-events-none ${value ? 'top-2 text-xs text-purple-400' : 'top-4 text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400'}`}>
          {label}
        </label>
      </div>
    )
  }

  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        className="w-full p-4 pt-6 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all peer"
      />
      <label className={`absolute left-4 transition-all pointer-events-none ${value ? 'top-2 text-xs text-purple-400' : 'top-4 text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400'}`}>
        {label}
      </label>
    </div>
  )
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useContext(AuthContext) || {}
  const [event, setEvent] = useState(null)
  const [activeTab, setActiveTab] = useState('result')
  const [showSignupForm, setShowSignupForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })
  const [qrImageError, setQrImageError] = useState(false)
  const [otpStep, setOtpStep] = useState(null)
  const [otpValue, setOtpValue] = useState('')
  const [otpError, setOtpError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const otpInputRefs = useRef([])
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inGameName: '',
    inGameId: '',
    teamName: '',
    discordId: '',
    region: '',
    experience: '',
    transactionId: '',
    socialMedia: '',
    portfolio: '',
    teamMembers: '',
    brandDealType: 'solo',
  })

  // Auto-fill form with user data when signup form is shown
  useEffect(() => {
    if (showSignupForm && user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }))
    }
  }, [showSignupForm, user])

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const url = API.EVENTS_GET_BY_ID.replace(':eventId', params.eventId)
        console.log("[v0] Fetching event from URL:", url)
        const response = await fetch(url)
        const data = await response.json()
        
        console.log("[v0] Event API response status:", response.status)
        console.log("[v0] Event API response data:", data)
        
        if (response.ok && data) {
          // Handle nested API response format - unwrap tournament object
          let eventData = data.tournament || (data.success && data.data ? data.data : data)
          
          console.log("[v0] Unwrapped event data:", eventData)
          
          // Transform API data to component format
          const transformedEvent = {
            ...eventData,
            id: eventData.id,
            title: eventData.title,
            game: {
              name: eventData.game || 'Gaming Event',
              image: getGameImage(eventData.title, eventData.game),
            },
            gameName: eventData.game || 'Gaming Event',
            gameImage: getGameImage(eventData.title, eventData.game),
            date: eventData.event_date || eventData.date,
            endDate: eventData.tournament_end_at || eventData.endDate,
            location: eventData.region || eventData.location,
            platform: eventData.platform || 'All Platforms',
            teamType: eventData.game_mode || 'Open',
            prizePool: parseFloat(eventData.prize_pool) || 0,
            currency: eventData.currency || 'BDT',
            totalSlots: eventData.max_slots || 64,
            filledSlots: eventData.filled_slots || 0,
            registrationStart: eventData.reg_start_at,
            registration_start: eventData.reg_start_at,
            registrationEnd: eventData.reg_end_at,
            registration_end: eventData.reg_end_at,
            tournamentStart: eventData.tournament_start_at,
            tournamentEnd: eventData.tournament_end_at,
            host: eventData.hosted_by || 'Inception Games',
            organizer: eventData.hosted_by || 'Inception Games',
            banner_image: eventData.banner_image,
          }
          
          console.log("[v0] Setting transformed event:", transformedEvent)
          setEvent(transformedEvent)
        } else {
          console.log("[v0] API response not ok or no data, status:", response.status)
          // Fallback to sample events if API fails
          const foundEvent = SAMPLE_EVENTS.find(e => e.id === `event-${params.eventId}`)
          if (foundEvent) {
            console.log("[v0] Using fallback sample event")
            setEvent(foundEvent)
          } else {
            console.log("[v0] No fallback event found for ID:", params.eventId)
          }
        }
      } catch (error) {
        console.log("[v0] Error fetching event:", error)
        // Fallback to sample events if API fails
        const foundEvent = SAMPLE_EVENTS.find(e => e.id === `event-${params.eventId}`)
        if (foundEvent) {
          console.log("[v0] Using fallback sample event after error")
          setEvent(foundEvent)
        } else {
          console.log("[v0] No fallback event found after error for ID:", params.eventId)
        }
      }
    }
    
    if (params.eventId) {
      fetchEvent()
    }
  }, [params.eventId])

  const showNotificationMessage = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 4000)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const getPrice = () => {
    if (!event) return 0
    switch (event.eventType) {
      case 'Tournament': return 499
      case 'Scrims': return 199
      case 'Brand Deal': return formData.brandDealType === 'team' ? 999 : 499
      default: return 0
    }
  }


  const handleSubmit = async (e) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/tournaments/${params.eventId}/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      showNotificationMessage('error', data.message || 'Registration failed. Please try again.')
      setIsSubmitting(false)
      return
    }


    // success modal
    setShowSuccessModal(true)


    
  } catch (error) {
    // console.error('[registration] Error:', error)
    showNotificationMessage('error', 'Network error. Please check your connection and try again.')
  } finally {
    setIsSubmitting(false)
  }
}


  const handleOtpVerify = async () => {
    if (otpValue.length < 4) return
    setOtpStep('verifying')
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulate success
    setOtpStep('success')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    showNotificationMessage('success', 'Registration successful!')
    setOtpStep(null)
    setShowSignupForm(false)
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      inGameName: '',
      inGameId: '',
      teamName: '',
      discordId: '',
      region: '',
      experience: '',
      transactionId: '',
      socialMedia: '',
      portfolio: '',
      teamMembers: '',
      brandDealType: 'solo',
    })
    setOtpValue('')
  }

  const handleResendOtp = async () => {
    setOtpError('OTP resent successfully!')
    setTimeout(() => setOtpError(''), 3000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out this ${event.eventType}: ${event.title}`,
          url: window.location.href,
        })
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href)
      showNotificationMessage('success', 'Link copied to clipboard!')
    }
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#030305] to-black text-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4" size={48} />
            <p>Loading event details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Ensure event has required properties
  const gameImage = event.banner_image || event.game?.image || event.gameImage || '/images/default-game.jpg'
  const gameName = event.game?.name || event.gameName || 'Unknown Game'

  const tabs = [
    { id: 'result', label: 'Result' },
    { id: 'brackets', label: 'Brackets' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'participants', label: 'Participants' },
    { id: 'rules', label: 'Rules' },
    { id: 'support', label: 'Contact Support' }
  ]

  const progressionSteps = [
    { label: 'Registration Start at', date: event.registrationStart },
    { label: 'Registration End at', date: event.registrationEnd },
    { label: 'Tournament Start at', date: event.tournamentStart },
    { label: 'Tournament End at', date: event.tournamentEnd },
  ]

  const price = getPrice()

  return (
    <div className="min-h-screen bg-[#030305]">
      <Header />
      
      <main className="pt-20">
        {/* Notification */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${
                notification.type === 'success' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                  : 'bg-gradient-to-r from-red-500 to-pink-600'
              }`}>
                {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <p className="font-semibold text-sm text-white">{notification.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Button */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Events</span>
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Banner */}
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={gameImage}
                  alt={gameName}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-black/50 to-transparent" />
                
                {/* Date Badge */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="px-6 py-3 bg-amber-500 text-black font-bold rounded-lg flex items-center gap-2 shadow-lg">
                    <Calendar size={18} />
                    {new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                  </div>
                </div>

                {/* Address */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                  <p className="text-red-400 text-sm font-medium mb-1">Address</p>
                  <p className="text-white text-sm max-w-md px-4">{event.address}</p>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-6">{event.title}</h1>

              {/* Game + Actions Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800">
                    <Image
                      src={gameImage}
                      alt={gameName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white font-semibold text-lg">{gameName}</span>
                  {/* <button className="px-4 py-2 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-colors">
                    <Users size={14} />
                    Follow
                  </button> */}
                </div>
                <div className="flex items-center gap-2">
                
                  
                  <button 
                    onClick={handleShare}
                    className="px-4 py-2.5 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>

              {/* Host + Status */}
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                <Trophy size={16} />
                <span>Hosted by {event.host}</span>
                <span>·</span>
                <span className={event.status === 'Completed' ? 'text-gray-500' : 'text-emerald-400'}>
                  {event.status === 'Completed' ? 'Past' : event.status}
                </span>
              </div>

              {/* Date + Status */}
              <div className="flex items-center gap-2 text-red-400 mb-4">
                <Calendar size={16} />
                <span className="font-semibold">{formatDate(event.date)} 6:00 PM</span>
                <span>·</span>
                <span>{getStatusText(event.status)}</span>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8">
                <div className="flex items-center gap-2">
                  <Flag size={16} />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor size={16} />
                  <span>{event.platform}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{event.teamType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{event.filledSlots} Participants</span>
                </div>
              </div>

              {/* Description */}
              <div className="text-sm text-gray-400 mb-8 space-y-2 p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                <p>Date: {new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                <p>Game: {gameName} ({event.teamType})</p>
                <p>
                  Location: {event.address}. 
                  <a href="#" className="text-blue-400 hover:underline ml-1">(Map Link)</a>
                </p>
              </div>

              {/* Tournament Progression */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-6">Tournament Progression</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {progressionSteps.map((step, index) => {
                    const stepDate = new Date(step.date)
                    const isCompleted = new Date() > stepDate
                    const isCurrent = index === 2 && event.status === 'Ongoing'
                    
                    return (
                      <div 
                        key={index}
                        className={`p-4 rounded-xl border ${
                          isCurrent 
                            ? 'bg-purple-500/10 border-purple-500/30' 
                            : isCompleted 
                              ? 'bg-gray-800/50 border-gray-700/50' 
                              : 'bg-gray-800/30 border-gray-700/30'
                        }`}
                      >
                        <div className="flex justify-center mb-3">
                          <CheckCircle2 
                            size={24} 
                            className={isCompleted ? 'text-emerald-400' : 'text-gray-600'} 
                          />
                        </div>
                        <p className="text-sm text-gray-400 text-center mb-2">{step.label}</p>
                        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                          <Calendar size={12} />
                          <span>{formatDateTime(step.date)}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mt-1">
                          <Clock size={12} />
                          <span>{formatTime(step.date)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>












{/* Tabs */}
<div className="border-b border-gray-800 mb-6">
  <div className="flex gap-1 overflow-x-auto pb-px">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
          activeTab === tab.id
            ? 'text-purple-400'
            : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        {tab.label}
        {activeTab === tab.id && (
          <motion.div
            layoutId="activeEventTab"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
          />
        )}
      </button>
    ))}
  </div>
</div>

{/* Tab Content */}
{/* <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-6">
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 mb-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center">
      <Clock size={28} className="text-purple-400" />
    </div>
    <h4 className="text-lg font-bold text-white mb-2">Coming Soon</h4>
 
    <p className="text-gray-500 text-sm max-w-xs">
  {activeTab === 'result' && 'Tournament results will be posted here once the event concludes.'}
  {activeTab === 'brackets' && 'Brackets will be revealed once the tournament begins.'}
  {activeTab === 'schedule' && 'The full schedule will be published closer to the event date.'}
  {activeTab === 'participants' && 'Participant list will be visible after registration closes.'}
  {activeTab === 'rules' && 'Rules & guidelines will be available before the event starts.'}

  {activeTab === 'support' && (
    <>
      For any kind of update, contact our Facebook page.{' '}
      <a
        href="https://www.facebook.com/profile.php?id=61562495805179"
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-400 underline hover:text-purple-300 transition-colors"
      >
        Visit Page
      </a>
    </>
  )}
</p>
    <div className="mt-5 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
      <span className="text-purple-400 text-xs font-medium tracking-wide uppercase">Stay Tuned</span>
    </div>
  </div>
</div> */}


{/* Tab Content */}
{activeTab === 'support' ? (
  <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-6">
    <div className="flex flex-col items-center justify-center py-16 text-center">
      
      <h4 className="text-lg font-bold text-white mb-2">
        Contact Support
      </h4>

      <p className="text-gray-500 text-sm max-w-xs">
        For any kind of update, contact our Facebook page.
      </p>

      <a
        href="https://www.facebook.com/profile.php?id=61562495805179"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition"
      >
        Visit Facebook Page
      </a>

    </div>
  </div>
) : (
  <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-6">
    <div className="flex flex-col items-center justify-center py-16 text-center">
      
      <div className="w-16 h-16 mb-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center">
        <Clock size={28} className="text-purple-400" />
      </div>

      <h4 className="text-lg font-bold text-white mb-2">Coming Soon</h4>

      <p className="text-gray-500 text-sm max-w-xs">
        {activeTab === 'result' && 'Tournament results will be posted here once the event concludes.'}
        {activeTab === 'brackets' && 'Brackets will be revealed once the tournament begins.'}
        {activeTab === 'schedule' && 'The full schedule will be published closer to the event date.'}
        {activeTab === 'participants' && 'Participant list will be visible after registration closes.'}
        {activeTab === 'rules' && 'Rules & guidelines will be available before the event starts.'}
      </p>

      <div className="mt-5 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
        <span className="text-purple-400 text-xs font-medium tracking-wide uppercase">
          Stay Tuned
        </span>
      </div>

    </div>
  </div>
)}


{/* successful modal  */}



<AnimatePresence>
  {showSuccessModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      onClick={(e) => { if (e.target === e.currentTarget) setShowSuccessModal(false) }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-emerald-400" />
        </div>

        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-4">
          Phase 1 Complete
        </span>

        <h2 className="text-2xl font-bold text-white mb-2">
          Registration Successful!
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          You&apos;re locked in for Phase 1. Check your email for the next steps to complete your payment.
        </p>

      
        <button
          onClick={() => setShowSuccessModal(false)}
          className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
        >
          Got it!
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Notifications Panel */}
                <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] overflow-hidden">
                  <div className="flex border-b border-white/[0.06]">
                    <button className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gray-800/50">
                      Notifications
                    </button>
                    <button className="flex-1 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                      Socials
                    </button>
                  </div>
                  <div className="p-8 text-center">
                    <Bell size={32} className="mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-400 text-sm">No notifications yet</p>
                    <p className="text-purple-400 text-xs mt-1">Stay sharp, action's coming.</p>
                  </div>
                </div>

                {/* Sign Up Button */}
                {event.status !== 'Completed' && !showSignupForm && (
                  <motion.button
                    onClick={() => setShowSignupForm(true)}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Users size={20} />
                    Sign Up
                  </motion.button>
                )}

                {/* Signup Form */}
                <AnimatePresence>
                  {showSignupForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-gray-900 rounded-xl border border-purple-500/30 p-6">
                        {/* OTP Verification */}
                        {otpStep && (
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                              {otpStep === 'success' ? <CheckCircle size={32} className="text-white" /> : <Shield size={32} className="text-white" />}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                              {otpStep === 'success' ? 'Registration Complete!' : otpStep === 'sending' || otpStep === 'verifying' ? 'Please Wait...' : 'Verify Your Email'}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                              {otpStep === 'success' ? 'You have been registered successfully' : otpStep === 'sending' ? 'Sending verification code...' : otpStep === 'verifying' ? 'Verifying your code...' : `We sent a code to ${formData.email}`}
                            </p>

                            {(otpStep === 'sending' || otpStep === 'verifying') && (
                              <div className="py-8">
                                <Loader2 className="animate-spin text-purple-400 mx-auto" size={40} />
                              </div>
                            )}

                            {otpStep === 'success' && (
                              <div className="py-6">
                                <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                                  <CheckCircle className="text-green-400" size={40} />
                                </div>
                              </div>
                            )}

                            {otpStep === 'input' && (
                              <div className="space-y-4">
                                <div className="flex justify-center gap-2">
                                  {Array.from({ length: 6 }).map((_, i) => (
                                    <input
                                      key={i}
                                      ref={(el) => { otpInputRefs.current[i] = el }}
                                      type="text"
                                      inputMode="numeric"
                                      maxLength={1}
                                      className="w-10 h-12 rounded-lg bg-gray-800 border border-gray-700 text-center text-xl font-bold text-white focus:border-purple-500 outline-none transition-all"
                                      value={otpValue[i] || ''}
                                      onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '')
                                        const newOtp = otpValue.slice(0, i) + val + otpValue.slice(i + 1)
                                        setOtpValue(newOtp.slice(0, 6))
                                        if (val && i < 5) otpInputRefs.current[i + 1]?.focus()
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Backspace' && !otpValue[i] && i > 0) {
                                          otpInputRefs.current[i - 1]?.focus()
                                        }
                                      }}
                                    />
                                  ))}
                                </div>

                                {otpError && (
                                  <p className={`text-sm ${otpError.includes('resent') ? 'text-green-400' : 'text-red-400'}`}>
                                    {otpError}
                                  </p>
                                )}

                                <button
                                  onClick={handleOtpVerify}
                                  disabled={otpValue.length < 4}
                                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                  Verify & Complete <ArrowRight size={16} />
                                </button>

                                <div className="flex items-center justify-between text-sm">
                                  <button onClick={handleResendOtp} className="text-purple-400 hover:text-purple-300 transition">
                                    Resend OTP
                                  </button>
                                  <button onClick={() => { setOtpStep(null); setShowSignupForm(false) }} className="text-gray-500 hover:text-gray-300 transition">
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Registration Form */}
                        {!otpStep && (
                          <>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xl font-bold text-white">
                                {event.eventType} Registration
                              </h3>
                              <button
                                onClick={() => setShowSignupForm(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                <X size={20} />
                              </button>
                            </div>

                            {/* Game Info */}
                            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800 rounded-lg">
                              <Image
                                src={gameImage}
                                alt={gameName}
                                width={48}
                                height={48}
                                className="rounded-lg"
                              />
                              <div>
                                <p className="text-white font-semibold">{gameName}</p>
                                <p className="text-gray-400 text-sm">{event.eventType}</p>
                              </div>
                            </div>

                            {/* Price Badge */}
                            {price > 0 && (
                              <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 text-center">
                                <p className="text-gray-400 text-sm">Registration Fee</p>
                                <p className="text-2xl font-bold text-white">BDT {price}</p>
                              </div>
                            )}

                            {/* Brand Deal Type Selection */}
                            {event.eventType === 'Brand Deal' && (
                              <div className="mb-4 grid grid-cols-2 gap-3">
                                <button
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, brandDealType: 'solo' }))}
                                  className={`p-3 rounded-lg border-2 transition-all ${
                                    formData.brandDealType === 'solo' 
                                      ? 'border-purple-500 bg-purple-500/10' 
                                      : 'border-gray-700 hover:border-gray-600'
                                  }`}
                                >
                                  <p className="text-white font-semibold">Solo</p>
                                  <p className="text-gray-400 text-xs">BDT 499</p>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, brandDealType: 'team' }))}
                                  className={`p-3 rounded-lg border-2 transition-all ${
                                    formData.brandDealType === 'team' 
                                      ? 'border-purple-500 bg-purple-500/10' 
                                      : 'border-gray-700 hover:border-gray-600'
                                  }`}
                                >
                                  <p className="text-white font-semibold">Team</p>
                                  <p className="text-gray-400 text-xs">BDT 999</p>
                                </button>
                              </div>
                            )}



                            <form onSubmit={handleSubmit} className="space-y-3">
                              <AnimatedInput
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                              />
                              <AnimatedInput
                                label="Email Address"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                              />
                              <AnimatedInput
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                              />

                              {/* Tournament/Scrims specific fields */}
                              {(event.eventType === 'Tournament' || event.eventType === 'Scrims') && (
                                <>
                                  <AnimatedInput
                                    label="In-Game Name"
                                    name="inGameName"
                                    value={formData.inGameName}
                                    onChange={handleInputChange}
                                    required
                                  />
                                  <AnimatedInput
                                    label="In-Game ID"
                                    name="inGameId"
                                    value={formData.inGameId}
                                    onChange={handleInputChange}
                                    required
                                  />
                                  {event.teamType !== 'Solo' && (
                                    <AnimatedInput
                                      label="Team Name"
                                      name="teamName"
                                      value={formData.teamName}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  )}
                                  <AnimatedInput
                                    label="Discord ID (optional)"
                                    name="discordId"
                                    value={formData.discordId}
                                    onChange={handleInputChange}
                                  />
                                </>
                              )}

                              {/* Brand Deal specific fields */}
                              {event.eventType === 'Brand Deal' && (
                                <>
                                  <AnimatedInput
                                    label="Social Media Links"
                                    name="socialMedia"
                                    value={formData.socialMedia}
                                    onChange={handleInputChange}
                                    required
                                  />
                                  <AnimatedInput
                                    label="Portfolio/Content Links"
                                    name="portfolio"
                                    value={formData.portfolio}
                                    onChange={handleInputChange}
                                  />
                                  {formData.brandDealType === 'team' && (
                                    <AnimatedInput
                                      label="Team Members"
                                      type="textarea"
                                      name="teamMembers"
                                      value={formData.teamMembers}
                                      onChange={handleInputChange}
                                    />
                                  )}
                                </>
                              )}



                              <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    Submit Registration
                                    <ArrowRight size={16} />
                                  </>
                                )}
                              </motion.button>
                            </form>


                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Prize Pool Card */}
                {event.prizePool > 0 && (
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign size={24} className="text-amber-400" />
                      <span className="text-gray-400 text-sm">Prize Pool</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                      {event.currency} {event.prizePool.toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Slots Info */}
                {/* <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm">Registration Slots</span>
                    <span className="text-white font-semibold">
                      {event.filledSlots}/{event.totalSlots}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${(event.filledSlots / event.totalSlots) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {event.totalSlots - event.filledSlots} slots remaining
                  </p>
                </div> */}

                {/* Event Type Badge */}
                {/* <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-4 text-center">
                  <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(event.status)}`}>
                    {event.eventType}
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
