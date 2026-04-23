'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProfileHeroBanner from '../../components/ProfileComponents/ProfileHeroBanner'
import QuickInfo from '../../components/ProfileComponents/QuickInfo'
import NotificationsPanel from '../../components/ProfileComponents/NotificationsPanel'
import FeaturedCarousel from '../../components/ProfileComponents/FeaturedCarousel'
import EventsSection from '../../components/ProfileComponents/EventsSection'
import EditProfileModal from '../../components/ProfileComponents/EditProfileModal'
import { useAuth } from '../../context/AuthContext'

function EventsPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAuthenticated, loading, selectedTournamentCategory } = useAuth()
  const categoryFromUrl = searchParams.get('category')
  const [initialFilter, setInitialFilter] = useState('all')
  const [gamingProfile, setGamingProfile] = useState(null)
  const [editProfileOpen, setEditProfileOpen] = useState(false)

  // Load gaming profile from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('sns_gaming_profile')
        if (stored) {
          setGamingProfile(JSON.parse(stored))
        }
      } catch {
        setGamingProfile(null)
      }
    }
  }, [user])

  // Map tournament flowType to event type filter
  useEffect(() => {
    const category = categoryFromUrl || selectedTournamentCategory
    
    if (category === 'tournament') {
      setInitialFilter('Tournament')
    } else if (category === 'scrims') {
      setInitialFilter('Scrims')
    } else if (category === 'brand-deal') {
      setInitialFilter('Brand Deal')
    } else {
      setInitialFilter('all')
    }
  }, [categoryFromUrl, selectedTournamentCategory])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
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

  if (!isAuthenticated || !user) {
    return null
  }

  // Merge user data with gaming profile
  const mergedUser = {
    ...user,
    username:
      user?.username ||
      gamingProfile?.username ||
      user?.fullName ||
      user?.email?.split('@')[0] ||
      'Player',
    bio: user?.bio || gamingProfile?.bio || '',
    primaryGame: user?.primaryGame || gamingProfile?.game || '',
    gameRole: user?.gameRole || gamingProfile?.role || '',
    region: user?.region || gamingProfile?.region || '',
    rank: user?.rank || gamingProfile?.rank || '',
    discord: user?.discord || gamingProfile?.discord || '',
    game: user?.primaryGame || gamingProfile?.game || '',
    role: user?.gameRole || gamingProfile?.role || '',
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
          {/* Hero Banner */}
          <div className="mb-8">
            <ProfileHeroBanner
              user={mergedUser}
              onEditProfile={() => setEditProfileOpen(true)}
            />
          </div>

          {/* Player Info + Notifications */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <QuickInfo user={mergedUser} />
            </div>
            <div className="col-span-1">
              <NotificationsPanel />
            </div>
          </div>

          {/* Featured Carousel - Jobs, Career, Merch */}
          <div className="mb-8">
            <FeaturedCarousel />
          </div>

          {/* Events Section with Category Filter Context */}
          <div className="space-y-6">
            {initialFilter !== 'all' && (
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {initialFilter} Events
                </h2>
                <p className="text-gray-400">
                  Browse {initialFilter.toLowerCase()} opportunities available for you
                </p>
              </div>
            )}
            <EventsSection user={mergedUser} initialFilter={initialFilter} />
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
            sessionStorage.setItem(
              'sns_gaming_profile',
              JSON.stringify(updated)
            )
          }
        }}
      />
    </div>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a14]">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading...</div>
        </div>
        <Footer />
      </div>
    }>
      <EventsPageContent />
    </Suspense>
  )
}
