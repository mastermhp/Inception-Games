'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Swords, Zap, Briefcase, Building2, Gamepad2, Check, Newspaper, Crown, Star, Users, Calendar, Gift, ChevronRight } from 'lucide-react'
import NewSignupModal from '../NewSignupModal'

const ALL_SUBSCRIPTIONS = [
  {
    id: 'newsletter-free',
    name: 'Free Newsletter',
    description: 'Daily gaming news, industry updates, and weekly tournament info.',
    icon: Newspaper,
    color: 'from-emerald-600 to-emerald-400',
    borderActive: 'border-emerald-500/40',
    bgActive: 'from-emerald-900/20 to-emerald-800/10',
    price: '0',
    currency: 'BDT',
    period: '',
    features: [
      'Daily Gaming News',
      'Industry Updates',
      'Weekly Tournament News globally',
      'Monthly Tournament Announcement',
      'Meetup Updates globally',
      'Jobs & Income Insights',
    ],
    flowProps: { showPlanSelection: true, initialPlan: 'free' },
  },
  {
    id: 'newsletter-premium',
    name: 'Premium Newsletter',
    description: 'Exclusive alerts, brand deals, and personalized gaming content.',
    icon: Crown,
    color: 'from-purple-600 to-purple-400',
    borderActive: 'border-purple-500/40',
    bgActive: 'from-purple-900/20 to-purple-800/10',
    price: '99',
    currency: 'BDT',
    period: '/month',
    features: [
      'Daily Gaming News based on your profile',
      'Exclusive Gaming Job Alerts',
      'Brand Deal Offer',
      'Weekly National & Global Tournament Info',
      'Monthly National Tournament Announcements',
      'Exclusive Meetup Opportunities',
    ],
    flowProps: { showPlanSelection: true, initialPlan: 'premium' },
  },
  {
    id: 'tournament',
    name: 'Tournament Pass',
    description: 'Monthly tournament access with guaranteed slots and prize pools.',
    icon: Trophy,
    color: 'from-amber-500 to-orange-400',
    borderActive: 'border-amber-500/40',
    bgActive: 'from-amber-900/20 to-orange-800/10',
    price: '499',
    currency: 'BDT',
    period: '/month',
    features: [
      'Unlimited monthly tournament access',
      'Guaranteed slots & priority registration',
      '1 Lacs+ BDT Prizepool Monthly',
      'MVP Gifts',
      'Rankings & competitive experience',
    ],
    flowProps: { flowType: 'tournament', eventType: 'Inception Games Monthly Tournament', showPayment: true },
  },
  {
    id: 'scrims-7',
    name: 'Scrims - 7 Days',
    description: 'Weekly scrims subscription with daily matches.',
    icon: Zap,
    color: 'from-green-500 to-teal-400',
    borderActive: 'border-green-500/40',
    bgActive: 'from-green-900/20 to-teal-800/10',
    price: '199',
    currency: 'BDT',
    period: '/week',
    features: [
      '7-day access',
      'Daily Scrims',
      '1 Mini Tournament with prizepool',
      'Gifts and Real Money',
    ],
    flowProps: { flowType: 'scrims', showScrimsDuration: true, showPayment: true, initialScrimsDuration: '7days' },
  },
  {
    id: 'scrims-15',
    name: 'Scrims - 15 Days',
    description: 'Bi-weekly scrims with priority access and brand deals.',
    icon: Swords,
    color: 'from-blue-500 to-cyan-400',
    borderActive: 'border-blue-500/40',
    bgActive: 'from-blue-900/20 to-cyan-800/10',
    price: '349',
    currency: 'BDT',
    period: '/15 days',
    features: [
      '15-day access',
      'Priority scrims',
      '2 Mini Tournaments',
      'Gift & Prizepool Tournament',
      'Free Meetup',
      'Brand Deal Offer Based on Skill',
    ],
    flowProps: { flowType: 'scrims', showScrimsDuration: true, showPayment: true, initialScrimsDuration: '15days' },
  },
  {
    id: 'scrims-30',
    name: 'Scrims - 1 Month',
    description: 'Full month of premium scrims with coaching and career support.',
    icon: Calendar,
    color: 'from-purple-500 to-pink-400',
    borderActive: 'border-purple-500/40',
    bgActive: 'from-purple-900/20 to-pink-800/10',
    price: '499',
    currency: 'BDT',
    period: '/month',
    badge: 'BEST VALUE',
    features: [
      'Full month access',
      'VIP scrims priority',
      '1 Mini Prizepool Scrims',
      'Larger Prizepool Tournament',
      'Exclusive Event Invitation',
      'Brand Deal offer',
      'Stable Earning Offer',
      'Studio Support',
      'Professional Player Coaching',
    ],
    flowProps: { flowType: 'scrims', showScrimsDuration: true, showPayment: true, initialScrimsDuration: '30days' },
  },
  {
    id: 'brand-solo',
    name: 'Brand Deal - Solo',
    description: 'Individual player sponsorship and personal brand building.',
    icon: Star,
    color: 'from-sky-500 to-blue-400',
    borderActive: 'border-sky-500/40',
    bgActive: 'from-sky-900/20 to-blue-800/10',
    price: '499',
    currency: 'BDT',
    period: '',
    features: [
      'Personal brand earning',
      'Individual brand deals',
      'Free tournament entries',
      'Exclusive invitations',
      'Device support (T&C)',
      'Content studio access',
      'Earning: 5,000 - few lakhs BDT',
    ],
    flowProps: { showBrandDealType: true, showPayment: true, initialBrandType: 'solo' },
  },
  {
    id: 'brand-team',
    name: 'Brand Deal - Team',
    description: 'Team or organization sponsorship pipeline.',
    icon: Users,
    color: 'from-pink-500 to-rose-400',
    borderActive: 'border-pink-500/40',
    bgActive: 'from-pink-900/20 to-rose-800/10',
    price: '999',
    currency: 'BDT',
    period: '',
    features: [
      'Team-based brand earning',
      'Guaranteed team brand deals',
      'Sponsorship pipeline (jersey, bootcamp, gear)',
      'Free team tournament access',
      'VIP event invites',
      'Multi-device/gear support',
      'Full team content studio access',
      'Earning: 15,000 - several lakhs/month',
    ],
    flowProps: { showBrandDealType: true, showPayment: true, initialBrandType: 'team' },
  },
]

export default function SubscriptionsSection({ user }) {
  const [activeModal, setActiveModal] = useState(null)
  const [localActive, setLocalActive] = useState(() => {
    // Load subscribed plans from sessionStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(sessionStorage.getItem('sns_subscriptions') || '{}')
        return { ...(user?.subscriptions || {}), ...stored }
      } catch {}
    }
    return user?.subscriptions || {}
  })

  // Refresh subscription status from sessionStorage
  const refreshSubscriptions = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(sessionStorage.getItem('sns_subscriptions') || '{}')
        setLocalActive(prev => ({ ...prev, ...stored }))
      } catch {}
    }
  }, [])

  // Re-read on mount and window focus (e.g. after redirect from subscription)
  useEffect(() => {
    refreshSubscriptions()
    const onFocus = () => refreshSubscriptions()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [refreshSubscriptions])

  const handleSubscribe = (sub) => {
    setActiveModal(sub)
  }

  const handleCloseModal = () => {
    setActiveModal(null)
    refreshSubscriptions()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const activeCount = Object.values(localActive).filter(Boolean).length

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Gamepad2 size={24} className="text-purple-400" />
            </div>
            My Subscriptions
          </h2>
          <p className="text-gray-500 mt-2 text-sm">All Inception Games offerings -- click to subscribe directly</p>
        </div>
        {activeCount > 0 && (
          <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold text-xs">
            {activeCount} Active
          </div>
        )}
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {ALL_SUBSCRIPTIONS.map((sub) => {
          const IconComponent = sub.icon
          const isActive = localActive[sub.id]

          return (
            <motion.div
              key={sub.id}
              variants={itemVariants}
              className="group relative"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                isActive
                  ? `${sub.borderActive} bg-gradient-to-br ${sub.bgActive}`
                  : 'border-white/[0.06] bg-gradient-to-br from-[#111115] to-[#0a0a10] hover:border-white/[0.12]'
              }`}>
                {/* Badge */}
                {sub.badge && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">{sub.badge}</span>
                  </div>
                )}

                {/* Hover glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${sub.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />

                <div className="relative p-5">
                  {/* Top row: icon + price */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${sub.color} shadow-lg`}>
                      {IconComponent && <IconComponent size={20} className="text-white" />}
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xs text-gray-500">{'BDT'}</span>
                        <span className="text-xl font-bold text-white">{sub.price}</span>
                      </div>
                      {sub.period && <span className="text-[10px] text-gray-500">{sub.period}</span>}
                    </div>
                  </div>

                  {/* Title + desc */}
                  <h3 className="text-base font-bold text-white mb-1">{sub.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{sub.description}</p>

                  {/* Features */}
                  <ul className="space-y-1.5 mb-5">
                    {sub.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                        <Check size={12} className={`flex-shrink-0 mt-0.5 ${isActive ? 'text-emerald-400' : 'text-gray-500'}`} />
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                    {sub.features.length > 4 && (
                      <li className="text-[10px] text-gray-600 pl-5">+{sub.features.length - 4} more features</li>
                    )}
                  </ul>

                  {/* Action Button */}
                  <motion.button
                    onClick={() => !isActive && handleSubscribe(sub)}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${sub.color} text-white shadow-lg cursor-default`
                        : 'bg-white/[0.04] text-gray-300 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
                    }`}
                    whileHover={isActive ? {} : { scale: 1.01 }}
                    whileTap={isActive ? {} : { scale: 0.99 }}
                  >
                    {isActive ? (
                      <><Check size={16} className="text-white" /> Subscribed</>
                    ) : (
                      <>Subscribe <ChevronRight size={14} /></>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Info */}
      <motion.div
        className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-sm font-bold text-white mb-2">About Subscriptions</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Click any subscription card to go directly to the signup process for that specific plan.
          Free options require no payment. Paid subscriptions use bKash for secure payment processing.
          All subscriptions include access to our Discord community and dedicated support channels.
        </p>
      </motion.div>

      {/* NewSignupModal -- key forces full remount so internal state resets per subscription */}
      {activeModal && (
        <NewSignupModal
          key={activeModal.id}
          isOpen={!!activeModal}
          onClose={handleCloseModal}
          subscriptionId={activeModal.id}
          {...activeModal.flowProps}
        />
      )}
    </motion.div>
  )
}
