'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Edit3, Gamepad2, MapPin, Award, Check, Link2, Facebook, Twitter, Bell } from 'lucide-react'

export default function ProfileHeroBanner({ user, onEditProfile }) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareRef = useRef(null)

  // Close share menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) setShowShareMenu(false)
    }
    if (showShareMenu) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showShareMenu])
  const initials = (user?.fullName || user?.username || 'P')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.div
      className="relative w-full rounded-2xl overflow-hidden border border-white/[0.06]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Background: custom banner or mesh gradient */}
      {user?.bannerImagePreview ? (
        <div className="absolute inset-0">
          <img src={user.bannerImagePreview} alt="Profile banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] via-[#0c0c14]/60 to-transparent" />
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-[#0c0c14] to-pink-900/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(147,51,234,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.12),transparent_50%)]" />
        </>
      )}

      {/* Subtle animated shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"
        animate={{ x: [-800, 800] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
          {/* Avatar */}
          <motion.div
            className="relative flex-shrink-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-[2px] shadow-2xl shadow-purple-500/20">
              <div className="w-full h-full rounded-2xl bg-[#0c0c14] flex items-center justify-center overflow-hidden">
                {user?.profileImagePreview || user?.avatar ? (
                  <img src={user.profileImagePreview || user.avatar} alt={user.fullName || 'Avatar'} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {initials}
                  </span>
                )}
              </div>
            </div>
            {/* Online indicator */}
            <motion.div
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-[#0c0c14]"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  {user?.fullName || user?.username || 'Player'}
                </h1>
                {user?.username && user.username !== user.fullName && (
                  <span className="px-2.5 py-0.5 rounded-md bg-white/[0.06] text-gray-400 text-sm font-medium">
                    @{user.username}
                  </span>
                )}
              </div>

              {/* Tags row */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {user?.game && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    <Gamepad2 size={12} />
                    {user.game}
                  </span>
                )}
                {user?.rank && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-300 border border-pink-500/20">
                    <Award size={12} />
                    {user.rank}
                  </span>
                )}
                {user?.region && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.04] text-gray-400 border border-white/[0.08]">
                    <MapPin size={12} />
                    {user.region}
                  </span>
                )}
                {user?.role && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.04] text-gray-400 border border-white/[0.08]">
                    {user.role}
                  </span>
                )}
              </div>

              {user?.bio && (
                <p className="text-gray-400 text-sm mt-3 max-w-xl leading-relaxed line-clamp-2">
                  {user.bio}
                </p>
              )}
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            className="flex gap-2 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Share button with dropdown */}
            <div className="relative" ref={shareRef}>
              <motion.button
                className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08] transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                aria-label="Share profile"
              >
                {copied ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} />}
              </motion.button>
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -5 }}
                    className="absolute right-0 top-12 z-50 w-48 rounded-xl bg-[#1a1a24] border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/[0.06] hover:text-white transition"
                      onClick={async () => {
                        const url = typeof window !== 'undefined' ? window.location.href : ''
                        if (navigator.share) {
                          try { await navigator.share({ title: `${user?.fullName || 'Player'} - SNS Profile`, url }) } catch {}
                        } else {
                          await navigator.clipboard.writeText(url)
                          setCopied(true); setTimeout(() => setCopied(false), 2000)
                        }
                        setShowShareMenu(false)
                      }}
                    >
                      <Link2 size={14} /> Copy Link
                    </button>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/[0.06] hover:text-white transition"
                      onClick={() => {
                        const url = typeof window !== 'undefined' ? window.location.href : ''
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
                        setShowShareMenu(false)
                      }}
                    >
                      <Facebook size={14} /> Facebook
                    </button>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/[0.06] hover:text-white transition"
                      onClick={() => {
                        const url = typeof window !== 'undefined' ? window.location.href : ''
                        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Check out ${user?.fullName || 'this player'} on Inception Games!`)}`, '_blank', 'width=600,height=400')
                        setShowShareMenu(false)
                      }}
                    >
                      <Twitter size={14} /> Twitter / X
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Notification button */}
            
            {/* Edit Profile button */}
            {onEditProfile && (
              <motion.button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/15 hover:border-purple-500/30 text-sm font-medium transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEditProfile}
                aria-label="Edit Profile"
              >
                <Edit3 size={15} />
                <span className="hidden sm:inline">Edit Profile</span>
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Bottom stats row */}
        {/* <motion.div
          className="flex items-center gap-8 mt-8 pt-6 border-t border-white/[0.06]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div>
            <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest">Followers</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">--</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest">Following</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">--</p>
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest">Member Since</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-0.5">2025</p>
          </div>
        </motion.div> */}
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-pink-500/40" />
    </motion.div>
  )
}
