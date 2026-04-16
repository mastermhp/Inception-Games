'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Bell } from 'lucide-react'

export default function Availability({ user }) {
  const [isAvailable, setIsAvailable] = useState(true)

  return (
    <motion.div
      className="rounded-2xl border border-white/[0.06] bg-[#0c0c12] overflow-hidden relative h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />

      <div className="p-6 flex flex-col h-full">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock size={16} className="text-pink-400" />
          Availability
        </h3>

        {/* Toggle Section */}
        <motion.div
          className={`mb-6 pb-6 border-b border-white/[0.06] p-3.5 rounded-xl transition-all ${
            isAvailable
              ? 'bg-emerald-500/[0.12] border border-emerald-500/20'
              : 'bg-red-500/[0.08] border border-red-500/15'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-white font-medium">Status</p>
              <motion.p
                key={isAvailable ? 'available' : 'unavailable'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-xs font-medium ${
                  isAvailable ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {isAvailable ? '🟢 Currently available' : '🔴 Currently unavailable'}
              </motion.p>
            </div>
            {/* Toggle Button */}
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                isAvailable ? 'bg-emerald-500/30' : 'bg-red-500/30'
              }`}
            >
              <motion.div
                layout
                className={`h-6 w-6 rounded-full shadow-lg ${
                  isAvailable ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-red-500 shadow-red-500/50'
                }`}
                animate={{
                  x: isAvailable ? '24px' : '2px',
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="mb-4">
            <Bell size={48} className="text-gray-600 mx-auto opacity-60" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-2">No notifications yet</p>
          <p className="text-gray-600 text-xs">Stay sharp, action's coming.</p>
        </div>
      </div>
    </motion.div>
  )
}
