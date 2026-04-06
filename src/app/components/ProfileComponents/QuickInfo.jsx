'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Users2, Award, MapPin, Mail, Hash, User, AtSign } from 'lucide-react'

export default function QuickInfo({ user }) {
  const infoItems = [
    { label: 'Full Name', value: user?.fullName, icon: User, accent: 'purple' },
    { label: 'Gamer Tag', value: user?.username, icon: AtSign, accent: 'pink' },
    { label: 'Primary Game', value: user?.primaryGame, icon: Gamepad2, accent: 'purple' },
    { label: 'Role', value: user?.gameRole, icon: Users2, accent: 'pink' },
    { label: 'Rank', value: user?.rank, icon: Award, accent: 'purple' },
    { label: 'Region', value: user?.region, icon: MapPin, accent: 'pink' },
    { label: 'Email', value: user?.email, icon: Mail, accent: 'purple' },
    { label: 'Discord', value: user?.discord, icon: Hash, accent: 'pink' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  const hasGamingInfo = user?.primaryGame || user?.gameRole || user?.rank || user?.region

  return (
    <motion.div
      className="rounded-2xl border border-white/[0.06] bg-[#0c0c12] overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-purple-500/30 via-transparent to-transparent" />

      <div className="p-6">
        <motion.h3
          className="text-lg font-semibold text-white mb-5"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          Player Info
        </motion.h3>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {infoItems.map((item, index) => {
            if (!item.value) return null
            const Icon = item.icon
            const accentColor = item.accent === 'purple' ? 'text-purple-400' : 'text-pink-400'
            const accentBg = item.accent === 'purple' ? 'bg-purple-500/10' : 'bg-pink-500/10'
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition duration-200 group"
              >
                <div className={`w-9 h-9 rounded-lg ${accentBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition`}>
                  <Icon size={15} className={accentColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">{item.label}</p>
                  <p className="text-sm text-white font-medium truncate">{item.value}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Empty state for gaming info */}
        {!hasGamingInfo && (
          <motion.div
            className="mt-4 p-4 rounded-xl bg-purple-500/[0.04] border border-purple-500/10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Gamepad2 size={24} className="mx-auto text-purple-500/40 mb-2" />
            <p className="text-gray-500 text-xs">Gaming profile not set up yet.</p>
            <p className="text-gray-600 text-[10px] mt-1">Edit your profile to add game info.</p>
          </motion.div>
        )}

        {/* Bio section */}
        {user?.bio && (
          <motion.div
            className="mt-4 pt-4 border-t border-white/[0.04]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-2">About</p>
            <p className="text-sm text-gray-300 leading-relaxed">{user.bio}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
