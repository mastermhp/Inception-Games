"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { X } from "lucide-react"

const ANIMATION_DELAYS = {
  logo: 0.5,
  title: 0.7,
  subtitle: 0.9,
}

const ANIMATION_DURATION = 1

// Hiring Form Modal Component
function HiringFormModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-[#0a0a14] rounded-2xl border border-purple-500/30 overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-transparent">
              <div className="flex items-center gap-3">
                <img src="/Logo/SNS_Logo.svg" alt="SNS Logo" className="w-8 h-8" />
                <h2 className="text-xl font-bold text-white">SliceNShare Hiring</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Embedded Google Form */}
            <div className="flex-1 w-full bg-white">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSd6LJ8hoLYkxMVxVoZJenWelXsW52oz5lmLhOVwRJE3kU8jCQ/viewform?embedded=true"
                width="100%"
                height="100%"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                className="w-full h-full"
                style={{ minHeight: "500px" }}
                title="SliceNShare Hiring Form"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              >
                Loading form...
              </iframe>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function HeroSection() {
  const [hiringModalOpen, setHiringModalOpen] = useState(false)

  return (
    <>
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center pt-20 px-4"
        style={{ backgroundColor: "#0a0a14" }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/Hero/hero-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }}
        />

        {/* Gradient overlay from Figma */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(23, 3, 43, 0.2) 2%, rgba(13, 2, 26, 1) 96%)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center max-w-3xl -mt-72">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: ANIMATION_DURATION, delay: ANIMATION_DELAYS.logo }}
            className="mb-1"
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <img src="/Logo/SNS_Logo.svg" alt="SNS Logo" className="hero-logo" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: ANIMATION_DURATION, delay: ANIMATION_DELAYS.title }}
            className="text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "Bebas Neue, sans-serif", letterSpacing: "-0.02em" }}
          >
            EMPOWERING THE NEXT
            <br />
            GENERATION OF ESPORTS TALENT
          </motion.h1>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 mt-20 bg-black/30 px-6 py-4">
            <button
              onClick={() => setHiringModalOpen(true)}
              className="px-8 py-3 rounded-full text-white transition flex items-center justify-center gap-1 md:gap-2 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
              style={{
                backgroundColor: "#8117EE",
              }}
            >
              <img src="/Logo/SNS_Logo.svg" alt="SNS Logo" className="w-18 md:w-28" />{" "}
              <p className="text-[16px] md:text-[24px]">Hiring</p>
            </button>
          </div>
        </div>
      </section>

      {/* Hiring Form Modal */}
      <HiringFormModal isOpen={hiringModalOpen} onClose={() => setHiringModalOpen(false)} />
    </>
  )
}
