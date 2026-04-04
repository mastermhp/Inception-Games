'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, LogOut, User, Settings, Wallet, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import UnifiedAuthModal from './AuthModals/UnifiedAuthModal'

export default function AuthToggleButton() {
  const { user, logout, isAuthenticated } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [authMode, setAuthMode] = useState(null) // null, 'login', 'signup'

  const closeAllModals = () => {
    setAuthMode(null)
  }

  if (!isAuthenticated) {
    return (
      <>
        {/* Desktop Auth Buttons */}
        <div className="hidden sm:flex items-center gap-3 w-80">
          <motion.button
            onClick={() => setAuthMode('login')}
            className="px-4 py-2 text-white font-semibold hover:text-purple-300 transition duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogIn size={18} />
            Sign In
          </motion.button>
          <motion.button
            onClick={() => setAuthMode('signup')}
            className="px-5 py-2 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 transition duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ fontSize: '14px' }}
          >
            Sign Up
          </motion.button>
        </div>

        {/* Mobile Auth Buttons */}
        <div className="sm:hidden flex items-center gap-2">
          <motion.button
            onClick={() => setAuthMode('login')}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogIn size={20} />
          </motion.button>
          <motion.button
            onClick={() => setAuthMode('signup')}
            className="px-3 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-purple-600 to-purple-500 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </div>

  {/* Auth Modals */}
  <AnimatePresence>
    {authMode === 'login' && <UnifiedAuthModal isOpen={true} onClose={closeAllModals} initialMode="login" />}
    {authMode === 'signup' && <UnifiedAuthModal isOpen={true} onClose={closeAllModals} initialMode="signup" />}
  </AnimatePresence>
      </>
    )
  }

  return (
    <>
      {/* User Profile Button */}
      <div className="relative">
        <motion.button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 px-3 py-2 sm:px-4 rounded-lg hover:bg-white/10 transition duration-300 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <p className="text-white font-semibold text-sm leading-tight">{user?.username}</p>
            <p className="text-gray-400 text-xs">{user?.game}</p>
          </div>
          <motion.div
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="hidden sm:block"
          >
            <ChevronDown size={18} className="text-gray-400 group-hover:text-white" />
          </motion.div>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-56 bg-gradient-to-b from-[#171717] to-[#0a0a14] rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* User Info */}
              <div className="p-4 border-b border-white/10 bg-white/5">
                <p className="text-white font-bold text-sm">{user?.username}</p>
                <p className="text-gray-400 text-xs mt-1">{user?.email}</p>
              </div>

              {/* Menu Items */}
              <div className="p-2 space-y-1">
                <Link href="/profile">
                  <motion.button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <User size={18} />
                    <span>View Profile</span>
                  </motion.button>
                </Link>

                <Link href="/subscriptions">
                  <motion.button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <Wallet size={18} />
                    <span>Subscriptions</span>
                  </motion.button>
                </Link>

                <Link href="/settings">
                  <motion.button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </motion.button>
                </Link>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10" />

              {/* Logout */}
              <div className="p-2">
                <motion.button
                  onClick={() => {
                    logout()
                    setIsDropdownOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition duration-300"
                  whileHover={{ x: 5 }}
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
