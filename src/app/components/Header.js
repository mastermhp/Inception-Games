'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Menu, X, User } from 'lucide-react'
import Link from 'next/link'
import LoginModal from './AuthModals/LoginModal'
import ProfileSettings from './ProfileSettings'
import { useAuth } from '@/app/context/AuthContext'

export default function Header() {
  const { user, isAuthenticated } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLinkClick = () => {
    setMobileMenuOpen(false)
  }

  const handleLoginClick = () => {
    setLoginModalOpen(true)
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
            <img src="/Logo/Logo.png" alt="Slice N Share" className="h-7 sm:h-8 md:h-14" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 w-full justify-center">
            <Link href="/" className="text-white text-[16px] font-medium hover:text-purple-400 transition">
              Home
            </Link>
            <Link href="#e-sports" className="text-white text-[16px] font-medium hover:text-purple-400 transition">
              E-Sports
            </Link>
            <Link href="#events" className="text-white text-[16px] font-medium hover:text-purple-400 transition">
              Events
            </Link>
            <Link href="#news" className="text-white text-[16px] font-medium hover:text-purple-400 transition">
              News
            </Link>
            <Link href="#career" className="text-white text-[16px] font-medium hover:text-purple-400 transition">
              Career
            </Link>
            <Link href="#contact" className="text-white text-[16px] font-medium hover:text-purple-400 transition">
              Contact Us
            </Link>
          </nav>

          {/* Auth Buttons */}
          {/* <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated && user ? (
              <button
                onClick={() => setProfileSettingsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <User size={16} />
                )}
                <span className="max-w-[100px] truncate">{user.fullName || user.email}</span>
              </button>
            ) : (
              <button
                onClick={handleLoginClick}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg font-semibold transition"
              >
                Login
              </button>
            )}
          </div> */}

          <button
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
              <Link href="#home" className="text-white text-base font-medium py-3 border-b border-purple-500/10 hover:text-purple-400 transition" onClick={handleLinkClick}>
                Home
              </Link>
              <Link href="#e-sports" className="text-white text-base font-medium py-3 border-b border-purple-500/10 hover:text-purple-400 transition" onClick={handleLinkClick}>
                E-Sports
              </Link>
              <Link href="#events" className="text-white text-base font-medium py-3 border-b border-purple-500/10 hover:text-purple-400 transition" onClick={handleLinkClick}>
                Events
              </Link>
              <Link href="#news" className="text-white text-base font-medium py-3 border-b border-purple-500/10 hover:text-purple-400 transition" onClick={handleLinkClick}>
                News
              </Link>
              <Link href="#career" className="text-white text-base font-medium py-3 border-b border-purple-500/10 hover:text-purple-400 transition" onClick={handleLinkClick}>
                Career
              </Link>
              <Link href="#contact" className="text-white text-base font-medium py-3 border-b border-purple-500/10 hover:text-purple-400 transition" onClick={handleLinkClick}>
                Contact Us
              </Link>

              {/* Mobile Auth Buttons */}
              {/* {!isAuthenticated && (
                <div className="flex flex-col gap-3 mt-4">
                  <button
                    onClick={() => { handleLoginClick(); setMobileMenuOpen(false) }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg font-semibold text-white transition"
                  >
                    Login
                  </button>
                </div>
              )} */}

              {isAuthenticated && user && (
                <button
                  onClick={() => { setProfileSettingsOpen(true); setMobileMenuOpen(false) }}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <User size={18} />
                  )}
                  {user.fullName || user.email}
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      <ProfileSettings isOpen={profileSettingsOpen} onClose={() => setProfileSettingsOpen(false)} />
    </>
  )
}
