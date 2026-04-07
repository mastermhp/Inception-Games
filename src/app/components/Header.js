'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Menu, X, User, ChevronDown, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import UnifiedAuthModal from './AuthModals/UnifiedAuthModal'
import { useAuth } from '../../hooks/useAuth'

// Animated Gradient Profile Ring Component
function AnimatedProfileRing({ children, size = 44 }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Animated gradient ring */}
      <div 
        className="absolute inset-0 rounded-full animate-spin-slow"
        style={{
          background: 'conic-gradient(from 0deg, #8117F1, #FF0040, #FF91AD, #B6D6F1, #FEDDC2, #FCA12B, #FFC3A1, #8117F1)',
          padding: '3px',
        }}
      >
        <div className="w-full h-full rounded-full bg-[#0a0a14]" />
      </div>
      {/* Inner content */}
      <div className="absolute inset-[3px] rounded-full overflow-hidden">
        {children}
      </div>
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full animate-pulse-glow opacity-50"
        style={{
          background: 'conic-gradient(from 0deg, #8117F1, #FF0040, #FF91AD, #B6D6F1, #8117F1)',
          filter: 'blur(10px)',
          zIndex: -1,
        }}
      />
    </div>
  )
}

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileDropdownOpen && !e.target.closest('.profile-dropdown-container')) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [profileDropdownOpen])

  const handleLinkClick = () => {
    setMobileMenuOpen(false)
  }

  const handleLoginClick = () => {
    setLoginModalOpen(true)
  }

  const handleLogout = () => {
    logout()
    setProfileDropdownOpen(false)
  }

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 md:px-6 py-3 md:py-4 transition-all duration-300 ${
          isScrolled ? "bg-black/80 backdrop-blur-md rounded-b-[8px]" : "bg-transparent"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <img src="/Logo/Logo.png" alt="Inceptions Logo" className="h-7 sm:h-8 md:h-14" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link href="/" className="text-white text-[16px] font-medium hover:text-purple-400 transition-colors">
              Home
            </Link>
            <Link href="#e-sports" className="text-white text-[16px] font-medium hover:text-purple-400 transition-colors">
              E-Sports
            </Link>
            {/* <Link href="#events" className="text-white text-[16px] font-medium hover:text-purple-400 transition-colors">
              Events
            </Link> */}
            <Link href="#news" className="text-white text-[16px] font-medium hover:text-purple-400 transition-colors">
              News
            </Link>
            <Link href="#career" className="text-white text-[16px] font-medium hover:text-purple-400 transition-colors">
              Career
            </Link>
            <Link href="#contact" className="text-white text-[16px] font-medium hover:text-purple-400 transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Auth Section - Desktop */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated && user ? (
              <div className="relative profile-dropdown-container">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 group"
                >
                  <AnimatedProfileRing size={44}>
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.fullName || user.username || 'Profile'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                    )}
                  </AnimatedProfileRing>
                  <ChevronDown 
                    size={16} 
                    className={`text-white/70 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                    >
                      {/* User Info */}
                      <div className="p-4 border-b border-white/10">
                        <p className="text-white font-semibold truncate">
                          {user.fullName || user.username || 'Gamer'}
                        </p>
                        <p className="text-white/50 text-sm truncate">{user.email}</p>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-2">
                        <Link 
                          href="/profile" 
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <User size={18} />
                          <span>My Profile</span>
                        </Link>
                        <Link 
                          href="/settings" 
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Settings size={18} />
                          <span>Settings</span>
                        </Link>
                      </div>
                      
                      {/* Logout */}
                      <div className="border-t border-white/10 py-2">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="relative group px-6 py-2.5 rounded-full font-semibold text-white overflow-hidden"
              >
                {/* Animated gradient background */}
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%] animate-gradient-x" />
                {/* Glow effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%] animate-gradient-x blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                {/* Button content */}
                <span className="relative flex items-center gap-2">
                  <User size={18} />
                  Login
                </span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button + Auth */}
          <div className="flex lg:hidden items-center gap-3">
            {isAuthenticated && user ? (
              <Link href="/profile" className="flex-shrink-0">
                <AnimatedProfileRing size={38}>
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.fullName || user.username || 'Profile'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                </AnimatedProfileRing>
              </Link>
            ) : (
              <button
                onClick={handleLoginClick}
                className="relative px-4 py-2 rounded-full font-medium text-white text-sm overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%] animate-gradient-x" />
                <span className="relative">Login</span>
              </button>
            )}
            
            <button
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed top-[60px] sm:top-[64px] md:top-[72px] left-0 right-0 z-40 bg-black/95 backdrop-blur-lg border-b border-purple-500/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col p-4 sm:p-6">
              <Link href="#home" className="text-white text-base font-medium py-3 border-b border-purple-500/10 hover:text-purple-400 transition-colors" onClick={handleLinkClick}>
                Home
              </Link>
              <Link href="#e-sports" className="text-white text-base font-medium py-3 border-b border-purple-500/10 hover:text-purple-400 transition-colors" onClick={handleLinkClick}>
                E-Sports
              </Link>
              <Link href="#events" className="text-white text-base font-medium py-3 border-b border-purple-500/10 hover:text-purple-400 transition-colors" onClick={handleLinkClick}>
                Events
              </Link>
              <Link href="#news" className="text-white text-base font-medium py-3 border-b border-purple-500/10 hover:text-purple-400 transition-colors" onClick={handleLinkClick}>
                News
              </Link>
              <Link href="#career" className="text-white text-base font-medium py-3 border-b border-purple-500/10 hover:text-purple-400 transition-colors" onClick={handleLinkClick}>
                Career
              </Link>
              <Link href="#contact" className="text-white text-base font-medium py-3 border-b border-purple-500/10 hover:text-purple-400 transition-colors" onClick={handleLinkClick}>
                Contact Us
              </Link>

              {/* Mobile Auth Section */}
              {isAuthenticated && user ? (
                <>
                  <Link
                    href="/profile"
                    className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 text-white rounded-lg font-semibold transition-colors"
                    onClick={handleLinkClick}
                  >
                    <User size={18} />
                    My Profile
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                    className="mt-2 w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 rounded-lg font-semibold transition-colors"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { handleLoginClick(); setMobileMenuOpen(false) }}
                  className="mt-4 w-full relative px-6 py-3 rounded-lg font-semibold text-white overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%] animate-gradient-x" />
                  <span className="relative flex items-center justify-center gap-2">
                    <User size={18} />
                    Login / Sign Up
                  </span>
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modals */}
      <UnifiedAuthModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        initialMode="login"
      />
    </>
  )
}
