'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Settings, User, Bell, Lock, LogOut, ChevronRight, Loader, RefreshCw, Mail, Phone, Shield } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function SettingsPage() {
  const { user, isAuthenticated, logout, logoutAll, updateProfile, fetchProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, authLoading, router])

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

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock },
  ]

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      console.log('Settings - logging out...')
      await logout()
      router.push('/')
    }
  }

  const handleLogoutAll = async () => {
    if (confirm('This will logout from all devices. Are you sure?')) {
      console.log('Settings - logging out from all devices...')
      await logoutAll()
      router.push('/')
    }
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

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
              <Settings size={36} className="text-purple-400" />
              Settings
            </h1>
            <p className="text-gray-400 mt-2">Manage your account preferences</p>
          </motion.div>

          {/* Settings Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#171717] to-[#0a0a14] overflow-hidden">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-4 border-b border-white/10 last:border-b-0 transition duration-300 ${
                        activeTab === tab.id ? 'bg-purple-500/20 text-purple-300 border-l-2 border-l-purple-500' : 'text-gray-300 hover:bg-white/5'
                      }`}
                      whileHover={{ x: 5 }}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  )
                })}

                {/* Logout Button */}
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition duration-300 border-t border-white/10"
                  whileHover={{ x: 5 }}
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sign Out</span>
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-white/10 bg-gradient-to-br from-[#171717] to-[#0a0a14] p-6 sm:p-8"
              >
                {activeTab === 'profile' && (
                  <ProfileTab user={user} updateProfile={updateProfile} fetchProfile={fetchProfile} />
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white">Notification Preferences</h2>
                    <div className="space-y-4">
                      <NotificationToggle label="Tournament Updates" defaultChecked />
                      <NotificationToggle label="Scrim Invitations" defaultChecked />
                      <NotificationToggle label="Brand Partnerships" defaultChecked />
                      <NotificationToggle label="Job Offers" defaultChecked={false} />
                      <NotificationToggle label="Email Notifications" defaultChecked />
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white">Privacy & Security</h2>

                    {/* Auth Info */}
                    <div className="p-4 rounded-lg border border-white/10 bg-slate-800/30">
                      <h3 className="text-sm font-medium text-gray-300 mb-3">Current Session</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Mail size={14} className="text-purple-400" />
                          <span>Email: {user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Shield size={14} className="text-purple-400" />
                          <span>Auth: {user.authMethod === 'firebase' ? 'Google (Firebase)' : 'Email / OTP'}</span>
                        </div>
                        {user.id && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <User size={14} className="text-purple-400" />
                            <span className="font-mono text-xs">ID: {user.id}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <motion.button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between p-4 rounded-lg border border-red-500/30 hover:bg-red-500/10 transition"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-red-400 font-semibold">Logout Current Device</span>
                        <ChevronRight size={20} className="text-red-400" />
                      </motion.button>
                      <motion.button
                        onClick={handleLogoutAll}
                        className="w-full flex items-center justify-between p-4 rounded-lg border border-red-500/30 hover:bg-red-500/10 transition"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-red-400 font-semibold">Logout All Devices</span>
                        <ChevronRight size={20} className="text-red-400" />
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function ProfileTab({ user, updateProfile, fetchProfile }) {
  const [fullName, setFullName] = useState(user.fullName || '')
  const [phone, setPhone] = useState(user.phone || '')
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [message, setMessage] = useState('')
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    setFullName(user.fullName || '')
    setPhone(user.phone || '')
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setLocalError('Full name is required')
      return
    }
    setSaving(true)
    setLocalError('')
    setMessage('')
    try {
      console.log('Settings ProfileTab - saving:', { fullName, phone })
      await updateProfile({ fullName, phone: phone || undefined })
      console.log('Settings ProfileTab - saved successfully')
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Settings ProfileTab - save error:', err)
      setLocalError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const fresh = await fetchProfile()
      console.log('Settings ProfileTab - refreshed:', fresh)
      if (fresh) {
        setFullName(fresh.fullName || '')
        setPhone(fresh.phone || '')
        setMessage('Profile refreshed')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      console.error('Settings ProfileTab - refresh error:', err)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Profile Settings</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {message && (
        <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
          {message}
        </div>
      )}
      {localError && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
          {localError}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <SettingField label="Email" value={user.email} disabled />
        <SettingField
          label="Full Name"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value)
            setLocalError('')
          }}
        />
        <SettingField
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+8801XXXXXXXXX"
        />
        <SettingField label="Auth Method" value={user.authMethod === 'firebase' ? 'Google (Firebase)' : 'Email / OTP'} disabled />

        <motion.button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-purple-400 transition disabled:opacity-50 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {saving && <Loader size={16} className="animate-spin" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </form>
    </div>
  )
}

function SettingField({ label, value, disabled = false, isTextarea = false, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      {isTextarea ? (
        <textarea
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-purple-500"
          rows="4"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-purple-500"
        />
      )}
    </div>
  )
}

function NotificationToggle({ label, defaultChecked = false }) {
  const [isChecked, setIsChecked] = React.useState(defaultChecked)

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 hover:bg-white/5 transition">
      <span className="text-white font-medium">{label}</span>
      <motion.button
        onClick={() => setIsChecked(!isChecked)}
        className={`relative w-12 h-7 rounded-full transition-colors ${
          isChecked ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-white/10'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg"
          animate={{ x: isChecked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  )
}
