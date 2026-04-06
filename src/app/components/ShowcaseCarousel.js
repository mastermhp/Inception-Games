"use client"
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'

// Data for the three sections
const showcaseData = {
  partners: {
    title: "Our Partners",
    subtitle: "Trusted collaborations that power our ecosystem",
    items: [
      { id: 1, name: "Ifarmer", logo: "/partners/ifarmer.png", smallLogo: "/partners/ifarmer.png", link: "#" },
      { id: 2, name: "Mime", logo: "/partners/mime.png", smallLogo: "/partners/mime.png", link: "#" },
      { id: 3, name: "Moar", logo: "/partners/moarbanner.png", smallLogo: "/partners/moar.png", link: "#" },
    ]
  },
  games: {
    title: "Our Games",
    subtitle: "Compete in your favorite titles",
    items: [
      { id: 1, name: "PUBG Mobile", logo: "/games/pubg.png", link: "https://pubgmobile.com" },
      { id: 2, name: "Valorant", logo: "/games/valorant.png", link: "https://playvalorant.com" },
      { id: 3, name: "CS:GO", logo: "/games/csgo.png", link: "https://counter-strike.net" },
      { id: 4, name: "Free Fire", logo: "/games/freefire.png", link: "https://ff.garena.com" },
      { id: 5, name: "Mobile Legends", logo: "/games/mlbb.png", link: "https://m.mobilelegends.com" },
      { id: 6, name: "FC Mobile", logo: "/games/fcmobile.png", link: "https://ea.com/games/fc" },
      { id: 7, name: "eFootball", logo: "/games/efootball.png", link: "https://efootball.konami.net" },
      { id: 8, name: "Dota 2", logo: "/games/dota2.png", link: "https://dota2.com" },
      { id: 9, name: "League of Legends", logo: "/games/lol.png", link: "https://leagueoflegends.com" },
      { id: 10, name: "Call of Duty Mobile", logo: "/games/codm.png", link: "https://callofdutymobile.com" },
      { id: 11, name: "Apex Legends", logo: "/games/apex.png", link: "https://ea.com/games/apex-legends" },
      { id: 12, name: "Fortnite", logo: "/games/fortnite.png", link: "https://fortnite.com" },
    ]
  },
  community: {
    title: "Our Community",
    subtitle: "Join thousands of passionate gamers",
    items: [
      { id: 1, name: "", description: "", stat: "", color: "#" },
      { id: 2, name: "", description: "", stat: "", color: "#" },
      { id: 3, name: "", description: "", stat: "", color: "#" },
      { id: 4, name: "", description: "", stat: "", color: "#" },
      { id: 5, name: "", description: "", stat: "", color: "#" },
      { id: 6, name: "", description: "", stat: "", color: "#" },
    //   { id: 1, name: "", description: "", stat: "", color: "#5865F2" },
    //   { id: 2, name: "", description: "", stat: "", color: "#FF0000" },
    //   { id: 3, name: "", description: "", stat: "", color: "#1877F2" },
    //   { id: 4, name: "", description: "", stat: "", color: "#8117F1" },
    //   { id: 5, name: "", description: "", stat: "", color: "#FF91AD" },
    //   { id: 6, name: "", description: "", stat: "", color: "#FCA12B" },
    ]
  }
}

// Tab indicator styles
const tabs = [
  { key: 'partners', label: 'Partners' },
  { key: 'games', label: 'Games' },
  { key: 'community', label: 'Community' },
]

export default function ShowcaseCarousel() {
  const [activeTab, setActiveTab] = useState('partners')
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const containerRef = useRef(null)
  
  const currentData = showcaseData[activeTab]
  const items = currentData.items

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, items.length, activeTab])

  // Reset index when tab changes
  useEffect(() => {
    setActiveIndex(0)
  }, [activeTab])

  const goToPrev = useCallback(() => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  const goToNext = useCallback(() => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const goToIndex = useCallback((index) => {
    setIsAutoPlaying(false)
    setActiveIndex(index)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrev, goToNext])

  return (
    <section className="py-20 overflow-hidden bg-gradient-to-b from-[#0a0a14] via-[#120820] to-[#0a0a14]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Discover Our Ecosystem
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mx-auto rounded-full" />
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-black/40 backdrop-blur-md rounded-full p-1.5 border border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {currentData.title}
            </h3>
            <p className="text-white/60">{currentData.subtitle}</p>
          </motion.div>
        </AnimatePresence>

        {/* Main Carousel Area */}
        <div className="relative" ref={containerRef}>
          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-black/80 hover:scale-110 transition-all duration-200"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-black/80 hover:scale-110 transition-all duration-200"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>

          {/* Cards Container - Apple Style */}
          <div className="flex items-center justify-center gap-4 py-8 px-16">
            {/* Left Preview Card */}
            <motion.div
              className="hidden lg:block w-[340px] h-[340px] flex-shrink-0 opacity-40 scale-90"
              initial={false}
              animate={{ opacity: 0.4, scale: 0.9 }}
            >
              <ShowcaseCard 
                item={items[(activeIndex - 1 + items.length) % items.length]} 
                type={activeTab}
                isPreview
              />
            </motion.div>

            {/* Main Featured Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${activeIndex}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[500px] h-[650px] md:h-[500px] flex-shrink-0"
              >
                <ShowcaseCard 
                  item={items[activeIndex]} 
                  type={activeTab}
                  isFeatured
                />
              </motion.div>
            </AnimatePresence>

            {/* Right Preview Card */}
            <motion.div
              className="hidden lg:block w-[340px] h-[340px] flex-shrink-0 opacity-40 scale-90"
              initial={false}
              animate={{ opacity: 0.4, scale: 0.9 }}
            >
              <ShowcaseCard 
                item={items[(activeIndex + 1) % items.length]} 
                type={activeTab}
                isPreview
              />
            </motion.div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Items Grid - Small Cards */}
        <div className="mt-12 flex items-center justify-center">
          <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide snap-x snap-mandatory">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                onClick={() => goToIndex(idx)}
                className={`flex-shrink-0 w-[160px] md:w-[180px] cursor-pointer snap-center ${
                  idx === activeIndex ? '' : ''
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <SmallCard item={item} type={activeTab} isActive={idx === activeIndex} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}

// Featured/Preview Card Component
function ShowcaseCard({ item, type, isFeatured = false, isPreview = false }) {
  if (type === 'partners') {
    return (
      <div className={`relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 ${isFeatured ? 'shadow-2xl shadow-purple-500/20' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="relative h-full flex flex-col items-center justify- p-2">
          <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <img 
              src={item.logo} 
              alt={item.name}
              className="w-full h-full object-cover filter brightness-110"
            />
          </div>
          {/* <h4 className="text-xl md:text-2xl font-bold text-white text-center mb-2">{item.name}</h4> */}
          {/* {isFeatured && (
            <a 
              href={item.link}
              className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/80 text-sm font-medium flex items-center gap-2 transition-all"
            >
              Visit Partner <ExternalLink size={14} />
            </a>
          )} */}
        </div>
      </div>
    )
  }

  if (type === 'games') {
    return (
      <div className={`relative h-full rounded-3xl overflow-hidden ${isFeatured ? 'shadow-2xl shadow-purple-500/20' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-gray-900 to-pink-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="relative h-full flex flex-col items-center justify-center p-1">
          <div className="w-full h-full md:w-full md:h-full rounded-2xl overflow-hidden shadow-lg shadow-black/50">
            <Link href={item.link}>
            <img 
              src={item.logo} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'community') {
    return (
      <div className={`relative h-full rounded-3xl overflow-hidden ${isFeatured ? 'shadow-2xl shadow-purple-500/20' : ''}`}>
        <div 
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${item.color}40, transparent, ${item.color}20)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative h-full flex flex-col items-center justify-center p-8">
          <div 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full mb-6 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}80)` }}
          >
            <span className="text-3xl md:text-4xl font-bold text-white">{item.stat}</span>
          </div>
          <h4 className="text-xl md:text-2xl font-bold text-white text-center mb-2">{item.name}</h4>
          <p className="text-white/60 text-center">{item.description}</p>
          {isFeatured && (
            <button className="mt-6 px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-all border border-white/20">
              Join Now
            </button>
          )}
        </div>
      </div>
    )
  }

  return null
}

// Small Bottom Card Component
function SmallCard({ item, type, isActive }) {
  if (type === 'partners') {
    return (
      <div className={`h-[100px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border transition-all ${isActive ? 'border-purple-500' : 'border-white/10'}`}>
        <div className="h-full flex items-center justify-center p-4">
          <img 
            src={item.smallLogo} 
            alt={item.name}
            className="max-w-full max-h-full object-contain filter brightness-90"
          />
        </div>
      </div>
    )
  }

  if (type === 'games') {
    return (
      <div className={`h-[100px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border transition-all ${isActive ? 'border-purple-500' : 'border-white/10'}`}>
        <div className="h-full flex items-center gap-3 p-3">
          <img 
            src={item.logo} 
            alt={item.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{item.name}</p>
            <p className="text-white/50 text-xs">Play now</p>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'community') {
    return (
      <div className={`h-[100px] rounded-xl overflow-hidden border transition-all ${isActive ? 'border-purple-500' : 'border-white/10'}`}
        style={{ background: `linear-gradient(135deg, ${item.color}30, transparent)` }}
      >
        <div className="h-full flex flex-col items-center justify-center p-3">
          <span className="text-2xl font-bold text-white">{item.stat}</span>
          <p className="text-white/70 text-xs text-center mt-1">{item.name}</p>
        </div>
      </div>
    )
  }

  return null
}
