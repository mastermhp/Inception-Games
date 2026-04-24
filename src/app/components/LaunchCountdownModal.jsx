'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function LaunchCountdownModal({ isOpen, onClose, onCountdownComplete }) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    isComplete: false,
  })

  useEffect(() => {
    if (!isOpen) return

    const calculateTime = () => {
      // Set target date to Saturday 12:00 PM
      const now = new Date()
      let target = new Date()
      
      // Get current day of week (0 = Sunday, 6 = Saturday)
      const currentDay = now.getDay()
      const daysUntilSaturday = (6 - currentDay + 7) % 7
      
      // If today is Saturday and time hasn't passed, use today; otherwise use next Saturday
      target.setDate(target.getDate() + (daysUntilSaturday === 0 && now.getHours() >= 12 ? 7 : daysUntilSaturday))
      target.setHours(12, 0, 0, 0)

      const diff = target - now
      
      if (diff <= 0) {
        setTimeRemaining({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          isComplete: true,
        })
        onCountdownComplete?.()
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeRemaining({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        isComplete: false,
      })
    }

    calculateTime()
    const interval = setInterval(calculateTime, 1000)
    return () => clearInterval(interval)
  }, [isOpen, onCountdownComplete])

  const CountdownDigit = ({ value }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg blur-md" />
        
        {/* Number container */}
        <div className="relative bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-md border border-purple-500/30 rounded-lg px-6 py-8 min-w-24">
          <span className="text-5xl md:text-6xl font-bold text-white font-mono tracking-wider">
            {value}
          </span>
        </div>
      </div>
    </div>
  )

  const TimeLabel = ({ label }) => (
    <p className="text-white/60 text-xs md:text-sm font-semibold uppercase tracking-widest mt-3">
      {label}
    </p>
  )

  return (
    <AnimatePresence>
      {isOpen && !timeRemaining.isComplete && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-4xl mx-auto px-4"
          >
            {/* Gradient border wrapper */}
            <div
              className="relative rounded-3xl p-1 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #8117F1 0%, #FF0040 25%, #FF91AD 50%, #B6D6F1 75%, #8117F1 100%)',
                backgroundSize: '300% 300%',
              }}
            >
              {/* Main content */}
              <div className="relative bg-black/95 backdrop-blur-2xl rounded-3xl px-6 md:px-12 py-12 md:py-16">
                {/* Animated background elements */}
                <motion.div
                  className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-600/20 to-pink-500/20 rounded-full blur-3xl -z-10"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                <motion.div
                  className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-600/20 to-purple-500/20 rounded-full blur-3xl -z-10"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                />

                {/* Close button */}
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
                >
                  <X size={24} className="text-white/70 hover:text-white" />
                </motion.button>

                {/* Content */}
                <div className="text-center space-y-10">
                  {/* Title section */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="space-y-3"
                  >
                    <h1 className="text-4xl md:text-6xl font-black text-white">
                      🚀 Are You Guys Ready??
                    </h1>
                    <p className="text-lg md:text-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-bold">
                      Launching Saturday 12:00 PM
                    </p>
                  </motion.div>

                  {/* Divider */}
                  <motion.div
                    className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  />

                  {/* Countdown display */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col items-center gap-8"
                  >
                    {/* Time display: DD:HH:MM:SS */}
                    <div className="flex items-center justify-center gap-2 md:gap-4">
                      <CountdownDigit value={timeRemaining.days} />
                      <span className="text-4xl md:text-5xl font-bold text-purple-400 font-mono">:</span>
                      <CountdownDigit value={timeRemaining.hours} />
                      <span className="text-4xl md:text-5xl font-bold text-purple-400 font-mono">:</span>
                      <CountdownDigit value={timeRemaining.minutes} />
                      <span className="text-4xl md:text-5xl font-bold text-purple-400 font-mono">:</span>
                      <CountdownDigit value={timeRemaining.seconds} />
                    </div>

                    {/* Labels */}
                    <div className="flex justify-center gap-6 md:gap-12">
                      <TimeLabel label="Days" />
                      <TimeLabel label="Hours" />
                      <TimeLabel label="Minutes" />
                      <TimeLabel label="Seconds" />
                    </div>
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="space-y-3 pt-4"
                  >
                    <p className="text-white/80 text-base md:text-lg font-medium">
                      Registration and login opening soon
                    </p>
                    <p className="text-white/50 text-sm md:text-base">
                      Sign up as soon as we launch to get started on your esports journey
                    </p>
                  </motion.div>

                  {/* Close button CTA */}
                  <motion.button
                    onClick={onClose}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group px-8 md:px-12 py-3 md:py-4 rounded-full font-bold text-white text-lg overflow-hidden transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #8117F1, #FF0040)',
                    }}
                  >
                    <span className="relative z-10">Got It</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 rounded-full"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
