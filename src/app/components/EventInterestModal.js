"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { X } from "lucide-react"

export default function EventInterestModal({ isOpen, onClose, eventTitle, eventImage }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const baseURL = "https://inception-games.an.r.appspot.com"
      const response = await fetch(`${baseURL}/api/v1/auth/register/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to register interest. Please try again.")
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setFormData({
          fullName: "",
          email: "",
          phone: "",
        })
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setError("")
      setSuccess(false)
      setFormData({
        fullName: "",
        email: "",
        phone: "",
      })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#0a0a14", border: "2px solid rgba(129, 23, 241, 0.3)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Event Interest</h2>
                <p className="text-gray-400 text-sm">Register your interest for this event</p>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <X size={24} />
              </button>
            </div>

            {/* Event Info */}
            <div className="mb-6">
              <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                <img
                  src={eventImage || "/placeholder.svg?height=128&width=400"}
                  alt={eventTitle}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{
                  backgroundImage:
                    "linear-gradient(300deg, var(--token-dc9856fd-0400-432f-8bac-dca82295da25, rgb(255, 0, 64)) 0%, rgb(255, 145, 173) 19.91370160204264%, rgb(182, 214, 241) 36.19087837837838%, rgb(254, 221, 194) 52.43997912726201%, rgb(255, 195, 161) 65.35754504504504%, rgb(252, 161, 43) 82.6090811186774%, var(--token-8a3f945e-7097-47e8-ae48-c03cf8e5cf8b, rgb(129, 23, 241)) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {eventTitle}
              </h3>
            </div>

            {success ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Interest Registered!</h3>
                <p className="text-gray-400">We will contact you with event details soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-[#171717] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-[#171717] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+8801XXXXXXXXX"
                    className="w-full px-4 py-3 bg-[#171717] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Registering...</span>
                      </div>
                    ) : (
                      "Submit"
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
