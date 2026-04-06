'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink, Briefcase, TrendingUp, ShoppingBag, Trophy, Sparkles, ArrowRight } from 'lucide-react'

const CAROUSEL_ITEMS = [
  {
    id: 1,
    type: 'career',
    badge: 'Hiring',
    badgeColor: 'from-orange-500 to-red-500',
    title: 'Head Coach - Esports Team',
    subtitle: 'Full-time position available now',
    description: 'Join a leading esports organization as Head Coach. Remote friendly, competitive salary with performance bonuses.',
    cta: 'Apply Now',
    link: '#',
    icon: Briefcase,
    gradient: 'from-orange-600/20 via-red-600/10 to-transparent',
    accentColor: 'text-orange-400',
    borderColor: 'border-orange-500/20',
    image: process.env.NEXT_PUBLIC_FEATURED_IMAGE_1,
  },
  {
    id: 2,
    type: 'career',
    badge: 'Career Stats',
    badgeColor: 'from-emerald-500 to-teal-500',
    title: 'Submit Your Career Stats',
    subtitle: 'Help us build your competitive profile',
    description: 'Fill out your career stats form so we can match you with teams, tournaments, and opportunities tailored to your skill level.',
    cta: 'Fill Career Form',
    link: process.env.NEXT_PUBLIC_FEATURED_FORM_URL,
    icon: TrendingUp,
    gradient: 'from-emerald-600/20 via-teal-600/10 to-transparent',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
    image: process.env.NEXT_PUBLIC_FEATURED_IMAGE_2,
  },
  {
    id: 3,
    type: 'merch',
    badge: 'New Drop',
    badgeColor: 'from-purple-500 to-pink-500',
    title: 'SNS Merch Store',
    subtitle: 'Rep your favorite gaming brand',
    description: 'Exclusive hoodies, jerseys, and accessories. Limited edition designs available now at slicenshare.com/shop.',
    cta: 'Shop Now',
    link: '#',
    icon: ShoppingBag,
    gradient: 'from-purple-600/20 via-pink-600/10 to-transparent',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/20',
    image: process.env.NEXT_PUBLIC_FEATURED_IMAGE_3,
  },
  {
    id: 4,
    type: 'tournament',
    badge: 'Upcoming',
    badgeColor: 'from-cyan-500 to-blue-500',
    title: 'PMSL Bangladesh Season 4',
    subtitle: 'Register before slots fill up',
    description: 'The biggest PUBG Mobile tournament in South Asia returns. Prize pool of 10 Lacs BDT. Open qualifiers start soon.',
    cta: 'Register',
    link: '#',
    icon: Trophy,
    gradient: 'from-cyan-600/20 via-blue-600/10 to-transparent',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
    image: process.env.NEXT_PUBLIC_FEATURED_IMAGE_4,
  },
  {
    id: 5,
    type: 'career',
    badge: 'Opportunity',
    badgeColor: 'from-amber-500 to-yellow-500',
    title: 'Content Creator Program',
    subtitle: 'Get sponsored to stream and create',
    description: 'Apply for the SNS Creator Fund. Monthly stipends, gear sponsorships, and exclusive event access for qualified streamers.',
    cta: 'Join Program',
    link: '#',
    icon: Sparkles,
    gradient: 'from-amber-600/20 via-yellow-600/10 to-transparent',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/20',
    image: process.env.NEXT_PUBLIC_FEATURED_IMAGE_5,
  },
]

export default function FeaturedCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const total = CAROUSEL_ITEMS.length

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + total) % total)
  }, [total])

  // Auto-advance
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, isPaused])

  const item = CAROUSEL_ITEMS[current]
  const Icon = item.icon

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
  }

  return (
    <motion.div
      className="relative rounded-2xl border border-white/[0.06] bg-[#0c0c12] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-pink-500/40 z-10" />

      {/* Section header */}
      <div className="relative z-10 px-6 sm:px-8 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Sparkles size={16} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">For You</h3>
            <p className="text-xs text-gray-500">Jobs, updates & more</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={prev}
            className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.08] transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={16} />
          </motion.button>
          <motion.button
            onClick={next}
            className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.08] transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </div>

      {/* Carousel Content */}
      <div className="relative px-6 sm:px-8 pb-6 pt-4 min-h-[280px] sm:min-h-[260px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={item.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full"
          >
            <div className={`relative rounded-xl border ${item.borderColor} bg-white/[0.02] overflow-hidden`}>
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient}`} />

              {/* Animated shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
                animate={{ x: [-500, 500] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />

              <div className="relative flex flex-col sm:flex-row gap-5 p-5 sm:p-6">
                {/* Image */}
                <div className="relative w-full sm:w-48 h-36 sm:h-auto rounded-lg overflow-hidden flex-shrink-0 group">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Badge on image */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${item.badgeColor} shadow-lg`}>
                      <Icon size={10} />
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h4 className="text-xl font-bold text-white leading-tight">{item.title}</h4>
                    <p className={`text-sm font-medium ${item.accentColor} mt-1`}>{item.subtitle}</p>
                    <p className="text-sm text-gray-400 mt-2.5 leading-relaxed line-clamp-2">{item.description}</p>
                  </div>
                  <div className="mt-4">
                    <motion.a
                      href={item.link}
                      target={item.link.startsWith('http') ? '_blank' : undefined}
                      rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${item.badgeColor} hover:shadow-lg transition-all duration-300`}
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {item.cta}
                      {item.link.startsWith('http') ? <ExternalLink size={14} /> : <ArrowRight size={14} />}
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="relative z-10 flex items-center justify-center gap-2 pb-5">
        {CAROUSEL_ITEMS.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => { setDirection(idx > current ? 1 : -1); setCurrent(idx) }}
            className="relative"
            whileHover={{ scale: 1.3 }}
          >
            <div className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? 'w-8 bg-gradient-to-r from-purple-400 to-pink-400' : 'w-1.5 bg-white/10 hover:bg-white/20'}`} />
          </motion.button>
        ))}
      </div>

      {/* Auto-progress bar */}
      {!isPaused && (
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
          key={current}
        />
      )}
    </motion.div>
  )
}
