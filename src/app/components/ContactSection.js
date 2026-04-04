
"use client"
import { motion } from "framer-motion"
import { useState } from "react"

const floatingIcons = [
  {
    icon: "/Contact/1x/Chat.png",
    x: 58,
    y: 30,
    size: "w-8 h-8 sm:w-10 sm:h-10",
  },
  {
    icon: "/Contact/1x/Arrow.png",
    x: 44,
    y: 53,
    size: "w-8 h-8 sm:w-10 sm:h-10",
    rotate: -45,
  },
  {
    icon: "/Contact/1x/Main.png",
    x: 45,
    y: 40,
    size: "w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56",
  },
  {
    icon: "/Contact/1x/Check.png",
    x: 75,
    y: 65,
    size: "w-8 h-8 sm:w-10 sm:h-10",
  },
  {
    icon: "/Contact/1x/Doc.png",
    x: 56,
    y: 83,
    size: "w-8 h-8 sm:w-10 sm:h-10",
  },
]

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

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
      // Just show success state for now - contact form will be implemented later
      // Show success state
      setSuccess(true)

      // Reset form after 3 seconds and hide success message
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          message: "",
        })
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 sm:py-32 lg:py-40 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h3
            className="font-bold text-base sm:text-lg tracking-wider"
            style={{
              backgroundImage:
                "linear-gradient(300deg, var(--token-dc9856fd-0400-432f-8bac-dca82295da25, rgb(255, 0, 64)) 0%, rgb(255, 145, 173) 19.91370160204264%, rgb(182, 214, 241) 36.19087837837838%, rgb(254, 221, 194) 52.43997912726201%, rgb(255, 195, 161) 65.35754504504504%, rgb(252, 161, 43) 82.6090811186774%, var(--token-8a3f945e-7097-47e8-ae48-c03cf8e5cf8b, rgb(129, 23, 241)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Contact Us
          </h3>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">STAY IN THE LOOP</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center max-w-7xl mx-auto">
          {/* Left Side - Animated Icons (Hidden on mobile, shown on lg+) */}
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] hidden lg:block">
            {/* Floating Icons */}
            {floatingIcons.map((item, index) => (
              <motion.div
                key={index}
                className="absolute"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: item.rotate ? `rotate(${item.rotate}deg)` : "none",
                }}
                initial={{ opacity: 1, scale: 1, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                animate={{
                  y: [-8, 8],
                  rotate: item.rotate ? [item.rotate - 5, item.rotate + 5] : [-2, 2],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 },
                }}
              >
                <img
                  src={item.icon || "/placeholder.svg"}
                  alt={`Contact icon ${index + 1}`}
                  className={`${item.size} object-contain`}
                  style={{
                    filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.3))",
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md mx-auto lg:mx-0 bg-[#0D0D0D] p-6 sm:p-8 lg:p-10 rounded-2xl relative"
          >
            {/* Success State Overlay */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-[#0D0D0D] rounded-2xl flex flex-col items-center justify-center z-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6"
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent Successfully!</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>

                  {/* Animated progress bar */}
                  <div className="w-full bg-gray-700 rounded-full h-1 mb-2">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.6, duration: 3 }}
                      className="bg-green-500 h-1 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Form will reset automatically</p>
                </motion.div>
              </motion.div>
            )}

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-white text-sm font-medium mb-2 ml-4 sm:ml-6">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Type your name.."
                  className="w-full px-4 py-3 sm:py-4 bg-[#171717] rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all backdrop-blur-sm text-sm sm:text-base"
                  required
                  disabled={loading || success}
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2 ml-4 sm:ml-6">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Type your email.."
                  className="w-full px-4 py-3 sm:py-4 bg-[#171717] rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all backdrop-blur-sm text-sm sm:text-base"
                  required
                  disabled={loading || success}
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2 ml-4 sm:ml-6">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Write your message..."
                  className="w-full px-4 py-3 sm:py-4 bg-[#171717] rounded-3xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none backdrop-blur-sm text-sm sm:text-base"
                  required
                  disabled={loading || success}
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading || success}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-full hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                whileHover={{
                  scale: loading || success ? 1 : 1.02,
                  boxShadow: loading || success ? "none" : "0 10px 30px rgba(139, 92, 246, 0.4)",
                }}
                whileTap={{ scale: loading || success ? 1 : 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : success ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Sent Successfully!</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
