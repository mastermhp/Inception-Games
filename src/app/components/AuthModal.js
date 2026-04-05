'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Loader, Phone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const TABS = {
  LOGIN: 'login',
  SIGNUP: 'signup',
};

export default function AuthModal({ isOpen, onClose }) {
  const {
    loginSendOTP,
    loginVerifyOTP,
    signupSendOTP,
    signupVerifyOTP,
    loginWithGoogle,
    error,
  } = useAuth();

  const [activeTab, setActiveTab] = useState(TABS.LOGIN);
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [localError, setLocalError] = useState('');

  const handleClose = () => {
    setActiveTab(TABS.LOGIN);
    setStep('email');
    setEmail('');
    setPhone('');
    setOtp('');
    setMessage('');
    setLocalError('');
    onClose();
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLocalError('');
    setMessage('');

    if (!email.trim()) {
      setLocalError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      if (activeTab === TABS.LOGIN) {
        const response = await loginSendOTP(email);
        setMessage(response.message || 'OTP sent to your email! Check your inbox.');
        console.log('AuthModal Login send OTP response:', response);
      } else {
        const response = await signupSendOTP(email, phone || undefined);
        setMessage(response.message || 'OTP sent to your email! Check your inbox.');
        console.log('AuthModal Signup send OTP response:', response);
      }
      setStep('otp');
    } catch (err) {
      const errorMsg = err.message || 'Failed to send OTP';
      setLocalError(errorMsg);
      console.error('AuthModal Send OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLocalError('');
    setMessage('');

    if (!otp.trim()) {
      setLocalError('Please enter the OTP');
      return;
    }

    if (otp.length < 4) {
      setLocalError('Please enter a valid OTP');
      return;
    }

    setLoading(true);
    try {
      if (activeTab === TABS.LOGIN) {
        const response = await loginVerifyOTP(email, otp);
        console.log('AuthModal Login verify response:', response);
        setMessage('Login successful!');
      } else {
        const response = await signupVerifyOTP(email, otp.trim());
        console.log('AuthModal Signup verify response:', response);
        setMessage('Account created successfully!');
      }
      setTimeout(() => handleClose(), 1200);
    } catch (err) {
      const errorMsg = err.message || 'Invalid OTP';
      setLocalError(errorMsg);
      console.error('AuthModal Verify OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError('');
    setMessage('');
    setGoogleLoading(true);
    try {
      const response = await loginWithGoogle();
      console.log('AuthModal Google login response:', response);
      setMessage(response.isNewUser ? 'Account created with Google!' : 'Signed in with Google!');
      setTimeout(() => handleClose(), 1200);
    } catch (err) {
      console.error('AuthModal Google login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setLocalError('Sign-in popup was closed');
      } else if (err.code === 'auth/popup-blocked') {
        setLocalError('Sign-in popup was blocked. Please allow popups for this site.');
      } else {
        setLocalError(err.message || 'Google sign-in failed');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setStep('email');
    setEmail('');
    setPhone('');
    setOtp('');
    setMessage('');
    setLocalError('');
  };

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
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-purple-500/20"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {activeTab === TABS.LOGIN ? 'Welcome Back' : 'Join Us'}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {step === 'otp'
                    ? `Enter the OTP sent to ${email}`
                    : activeTab === TABS.LOGIN
                    ? 'Sign in with email OTP or Google'
                    : 'Create your account'}
                </p>
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
            {step === 'email' && (
              <div className="flex border-b border-purple-500/20">
                <button
                  onClick={() => switchTab(TABS.LOGIN)}
                  className={`flex-1 py-3 font-semibold transition ${
                    activeTab === TABS.LOGIN
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => switchTab(TABS.SIGNUP)}
                  className={`flex-1 py-3 font-semibold transition ${
                    activeTab === TABS.SIGNUP
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

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

              <form onSubmit={step === 'email' ? handleSendOTP : handleVerifyOTP} className="space-y-4">
                {step === 'email' ? (
                  <>
                    {/* Email Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setLocalError('');
                          }}
                          placeholder="your@email.com"
                          className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                          required
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Phone Input (Signup only) */}
                    {activeTab === TABS.SIGNUP && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Phone <span className="text-gray-500">(Optional)</span>
                        </label>
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
                    )}
                  </>
                ) : (
                  /* OTP Step */
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Enter OTP
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                          setLocalError('');
                        }}
                        placeholder="000000"
                        maxLength="6"
                        className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-center text-2xl tracking-widest font-mono"
                        required
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setStep('email');
                          setOtp('');
                          setLocalError('');
                          setMessage('');
                        }}
                        className="text-xs text-purple-400 hover:text-purple-300 transition"
                      >
                        Change email
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setLocalError('');
                          setLoading(true);
                          try {
                            if (activeTab === TABS.LOGIN) {
                              await loginSendOTP(email);
                            } else {
                              await signupSendOTP(email, phone || undefined);
                            }
                            setMessage('New OTP sent!');
                          } catch (err) {
                            setLocalError(err.message || 'Failed to resend OTP');
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                        className="text-xs text-purple-400 hover:text-purple-300 transition disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader size={18} className="animate-spin" />}
                  {step === 'email'
                    ? 'Send OTP'
                    : `Verify & ${activeTab === TABS.LOGIN ? 'Login' : 'Sign Up'}`}
                </button>
              </form>

              {/* Divider - only show on email step */}
              {step === 'email' && (
                <>
                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-gradient-to-br from-slate-900 to-slate-800 text-gray-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Google Sign In Button */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {googleLoading ? (
                      <Loader size={20} className="animate-spin text-gray-600" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Sign in with Google
                      </>
                    )}
                  </button>
                </>
              )}

              {/* Info Text */}
              <p className="text-center text-gray-500 text-xs mt-4">
                {step === 'email'
                  ? "We'll send a one-time password to your email for secure authentication."
                  : 'Check your email inbox (and spam folder) for the OTP code.'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
