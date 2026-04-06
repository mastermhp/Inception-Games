'use client'

import React from 'react'
import { motion } from 'framer-motion'
// import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SubscriptionsSection from '../components/ProfileComponents/SubscriptionsSection'
import { useAuth } from '../context/AuthContext'

export default function SubscriptionsPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, loading, router])

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-pink-500 rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-20">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition duration-300"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>

        {/* Subscriptions Section */}
        <SubscriptionsSection user={user} />
      </div>
      </main>
      <Footer />
    </div>
  )
}
