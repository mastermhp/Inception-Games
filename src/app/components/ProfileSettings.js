'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Loader, LogOut, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfileSettings({ isOpen, onClose }) {
  const { user, updateProfile, logout, fetchProfile, error } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [localError, setLocalError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user && isOpen) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setMessage('');
      setLocalError('');
    }
  }, [user, isOpen]);

  const handleClose = () => {
    setMessage('');
    setLocalError('');
    onClose();
  };

  const handleRefreshProfile = async () => {
    setRefreshing(true);
    setLocalError('');
    try {
      const freshUser = await fetchProfile();
      console.log('ProfileSettings - refreshed profile:', freshUser);
      if (freshUser) {
        setFullName(freshUser.fullName || '');
        setPhone(freshUser.phone || '');
        setMessage('Profile refreshed from server');
      } else {
        setLocalError('Could not refresh profile');
      }
    } catch (err) {
      console.error('ProfileSettings - refresh error:', err);
      setLocalError(err.message || 'Failed to refresh profile');
    } finally {
      setRefreshing(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLocalError('');
    setMessage('');

    if (!fullName.trim()) {
      setLocalError('Full name is required');
      return;
    }

    setLoading(true);
    try {
      console.log('ProfileSettings - updating profile with:', { fullName, phone });
      const response = await updateProfile({ fullName, phone: phone || undefined });
      console.log('ProfileSettings - update response:', response);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      const errorMsg = err.message || 'Failed to update profile';
      setLocalError(errorMsg);
      console.error('ProfileSettings - update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await logout();
        console.log('ProfileSettings - logged out');
        handleClose();
        router.push('/');
      } catch (err) {
        console.error('ProfileSettings - logout error:', err);
        setLocalError('Logout failed');
      }
    }
  };

  const handleLogoutAll = async () => {
    if (confirm('This will logout. Are you sure?')) {
      try {
        await logout();
        console.log('ProfileSettings - logged out');
        handleClose();
        router.push('/');
      } catch (err) {
        console.error('ProfileSettings - logout error:', err);
        setLocalError('Logout failed');
      }
    }
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-purple-500/20 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
              <div>
                <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
                <p className="text-sm text-gray-400 mt-1">Manage your account</p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-purple-500/20">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-3 font-semibold transition flex items-center justify-center gap-2 ${
                  activeTab === 'profile'
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <User size={16} />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 py-3 font-semibold transition flex items-center justify-center gap-2 ${
                  activeTab === 'security'
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Shield size={16} />
                Security
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Status Messages */}
              <AnimatePresence mode="wait">
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm"
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {(localError || error) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm"
                  >
                    {localError || error}
                  </motion.div>
                )}
              </AnimatePresence>

              {activeTab === 'profile' ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {/* User Info Display */}
                  <div className="space-y-3 mb-6 p-4 bg-slate-700/30 rounded-lg border border-purple-500/10">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/30" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <User size={20} className="text-purple-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{user.fullName || 'Not set'}</p>
                        <p className="text-gray-400 text-sm truncate">{user.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRefreshProfile}
                        disabled={refreshing}
                        className="p-2 text-gray-400 hover:text-purple-400 transition disabled:opacity-50"
                        title="Refresh profile from server"
                      >
                        <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                      <Mail size={16} className="text-purple-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Auth Method</p>
                        <p className="text-white text-sm font-medium">
                          {user.authMethod === 'firebase' ? 'Google' : 'Email / OTP'}
                        </p>
                      </div>
                    </div>
                    {user.id && (
                      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                        <Shield size={16} className="text-purple-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">User ID</p>
                          <p className="text-white text-xs font-mono truncate">{user.id}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Full Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          setLocalError('');
                        }}
                        placeholder="Your full name"
                        className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+8801XXXXXXXXX"
                        className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Bangladesh format: +8801XXXXXXXXX</p>
                  </div>

                  {/* Update Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && <Loader size={18} className="animate-spin" />}
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>

                  {/* Navigate to full profile page */}
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      router.push('/profile');
                    }}
                    className="w-full text-center text-sm text-purple-400 hover:text-purple-300 transition py-2"
                  >
                    View Full Profile
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-300 text-sm mb-4">Manage your account security and sessions.</p>

                  {/* Session Info */}
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-purple-500/10 mb-4">
                    <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">Session Info</p>
                    <ul className="text-sm text-gray-300 space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Tokens stored securely in sessionStorage
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        All API requests use Bearer token auth
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Auto-refresh on token expiry (401)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Auth method: {user.authMethod === 'firebase' ? 'Google (Firebase)' : 'Email/OTP'}
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold py-2.5 rounded-lg transition border border-red-500/30"
                  >
                    <LogOut size={18} />
                    Logout Current Device
                  </button>

                  <button
                    onClick={handleLogoutAll}
                    className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 font-semibold py-2.5 rounded-lg transition border border-red-500/20"
                  >
                    <LogOut size={18} />
                    Logout All Devices
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
