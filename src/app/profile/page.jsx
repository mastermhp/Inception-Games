'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProfileHeroBanner from '../components/ProfileComponents/ProfileHeroBanner'
import CareerStats from '../components/ProfileComponents/CareerStats'
import QuickInfo from '../components/ProfileComponents/QuickInfo'
import EventsSection from '../components/ProfileComponents/EventsSection'
import MatchHistory from '../components/ProfileComponents/MatchHistory'
import Availability from '../components/ProfileComponents/Availability'
import FeaturedCarousel from '../components/ProfileComponents/FeaturedCarousel'
import EditProfileModal from '../components/ProfileComponents/EditProfileModal'

export default function ProfilePage() {
  const { user, isAuthenticated, loading, fetchProfile } = useAuth()
  const router = useRouter()
  const [gamingProfile, setGamingProfile] = useState(null)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)

  // Fetch user profile data on component mount
  useEffect(() => {
    if (!loading && isAuthenticated && user?.id) {
      console.log("[v0] Profile page - fetching user profile for user ID:", user.id)
      setProfileLoading(true)
      fetchProfile()
        .then(() => {
          console.log("[v0] Profile page - profile fetch completed")
          setProfileLoading(false)
        })
        .catch((err) => {
          console.error("[v0] Profile page - profile fetch error:", err.message)
          setProfileLoading(false)
        })
    }
  }, [isAuthenticated, loading, user?.id, fetchProfile])

  // Load gaming profile from sessionStorage whenever user changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('sns_gaming_profile')
        if (stored) {
          setGamingProfile(JSON.parse(stored))
        } else {
          setGamingProfile(null)
        }
      } catch {
        setGamingProfile(null)
      }
    }
  }, [user])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, loading, router])

  if (!user || profileLoading) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-gray-500 text-sm">Loading profile...</p>
        </motion.div>
      </div>
    )
  }

  // Merge API user data with gaming profile
  // Sanitize game field -- it may be an object {id, name, image} from subscription flow
  const rawGame = gamingProfile?.game || ''
  const gameName = typeof rawGame === 'object' && rawGame !== null ? (rawGame.name || '') : String(rawGame)

  const mergedUser = {
    ...user,
    username: gamingProfile?.username || user.fullName || user.email?.split('@')[0] || 'Player',
    bio: gamingProfile?.bio || '',
    game: gameName,
    role: gamingProfile?.role || '',
    region: gamingProfile?.region || '',   
    rank: gamingProfile?.rank || '',
    discord: gamingProfile?.discord || '',
    games: gameName ? [gameName] : [],
    profileImagePreview: gamingProfile?.profileImagePreview || null,
    bannerImagePreview: gamingProfile?.bannerImagePreview || null,
  }

  return (
    <div className="min-h-screen bg-[#060608] flex flex-col">
      <Header />

      <main className="flex-1 pt-28 pb-20">
        {/* Subtle ambient glow */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-purple-600/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-600/[0.04] rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-gray-500 hover:text-purple-400 transition duration-300 text-sm"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </motion.button>

          {/* Hero Banner */}
          <div className="mb-8">
            <ProfileHeroBanner user={mergedUser} onEditProfile={() => setEditProfileOpen(true)} />
          </div>

          {/* Player Info (2/3) + Availability (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <QuickInfo user={mergedUser} />
            </div>
            <div className="lg:col-span-1">
              <Availability user={mergedUser} />
            </div>
          </div>

          {/* Featured Carousel - Jobs, Career, Merch */}
          <div className="mb-8">
            <FeaturedCarousel />
          </div>

          {/* Events Section */}
          <div className="space-y-6">
            <EventsSection user={mergedUser} />
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        user={mergedUser}
        gamingProfile={gamingProfile}
        onProfileUpdate={(updated) => {
          setGamingProfile(updated)
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('sns_gaming_profile', JSON.stringify(updated))
          }
        }}
      />
    </div>
  )
}
