'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import EventsSection from '@/app/components/ProfileComponents/EventsSection'
import { useAuth } from '@/app/context/AuthContext'

function EventsPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAuthenticated, loading, selectedTournamentCategory } = useAuth()
  const categoryFromUrl = searchParams.get('category')
  const [initialFilter, setInitialFilter] = useState('all')

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
      <div className="min-h-screen bg-[#0a0a14]">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading...</div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      <Header />
      <main className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Events</h1>
            <p className="text-gray-400">
              {initialFilter === 'all' 
                ? 'Explore all events and competitions' 
                : `Browse ${initialFilter} events`}
            </p>
          </div>
          
          <EventsSection user={user} initialFilter={initialFilter} />
        </div>
      </main>
      <Footer />
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
