"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function Footer() {
  const [ecosystemDropdownOpen, setEcosystemDropdownOpen] = useState(false)
  return (
    <>
      <footer className="py-8 md:py-12 bg-[#0D0D0D]">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">

            {/* Logo + Description Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center md:items-start gap-4"
            >
              {/* Logo */}
              <div className="flex items-center space-x-1">
                <img src="/Logo/Logo.png" alt="Inceptions Logo" className="w-20 h-25" />
              </div>

              {/* Short Description */}
              <p className="text-gray-400 text-sm leading-relaxed text-center md:text-left max-w-xs">
                Compete. Connect. Conquer. — Your home for premier esports tournaments and gaming excellence.
              </p>

              {/* Decorative accent line */}
              <div
                className="h-[2px] w-12 rounded-full"
                style={{
                  background: "linear-gradient(90deg, rgb(255, 0, 64), rgb(129, 23, 241))",
                }}
              />
            </motion.div>

            {/* Social Links Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center md:text-left"
            >
              <h3
                className="font-bold text-base sm:text-lg mb-3 sm:mb-4 tracking-wider"
                style={{
                  backgroundImage:
                    "linear-gradient(300deg, rgb(255, 0, 64) 0%, rgb(255, 145, 173) 19.91%, rgb(182, 214, 241) 36.19%, rgb(254, 221, 194) 52.44%, rgb(255, 195, 161) 65.36%, rgb(252, 161, 43) 82.61%, rgb(129, 23, 241) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                SOCIAL LINKS
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <motion.a
                  href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
                  className="flex items-center justify-center md:justify-start space-x-3 text-white hover:text-gray-300 transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="text-sm sm:text-base">LinkedIn</span>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.a>

                <motion.a
                  href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                  className="flex items-center justify-center md:justify-start space-x-3 text-white hover:text-gray-300 transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-sm sm:text-base">Facebook</span>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>

            {/* Website Links Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center md:text-left"
            >
              <h3
                className="font-bold text-base sm:text-lg mb-3 sm:mb-4 tracking-wider"
                style={{
                  backgroundImage:
                    "linear-gradient(300deg, rgb(255, 0, 64) 0%, rgb(255, 145, 173) 19.91%, rgb(182, 214, 241) 36.19%, rgb(254, 221, 194) 52.44%, rgb(255, 195, 161) 65.36%, rgb(252, 161, 43) 82.61%, rgb(129, 23, 241) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                WEBSITE
              </h3>
              <div className="space-y-3">
                {/* Ecosystem Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setEcosystemDropdownOpen(!ecosystemDropdownOpen)}
                    className="flex items-center justify-center md:justify-start gap-2 text-white hover:text-gray-300 transition-colors group"
                  >
                    <span>Ecosystem</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${ecosystemDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {ecosystemDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="mt-2 space-y-2 text-center md:text-left"
                      >
                        <a
                          href="#ecosystem-partners"
                          onClick={() => {
                            setEcosystemDropdownOpen(false)
                            document.getElementById("ecosystem-partners")?.scrollIntoView({ behavior: "smooth" })
                          }}
                          className="block text-white/80 text-sm hover:text-gray-300 transition-colors cursor-pointer pl-0 md:pl-4"
                        >
                          Partners
                        </a>
                        <a
                          href="#ecosystem-games"
                          onClick={() => {
                            setEcosystemDropdownOpen(false)
                            document.getElementById("ecosystem-games")?.scrollIntoView({ behavior: "smooth" })
                          }}
                          className="block text-white/80 text-sm hover:text-gray-300 transition-colors cursor-pointer pl-0 md:pl-4"
                        >
                          Games
                        </a>
                        <a
                          href="#ecosystem-community"
                          onClick={() => {
                            setEcosystemDropdownOpen(false)
                            document.getElementById("ecosystem-community")?.scrollIntoView({ behavior: "smooth" })
                          }}
                          className="block text-white/80 text-sm hover:text-gray-300 transition-colors cursor-pointer pl-0 md:pl-4"
                        >
                          Community
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.a
                  href="#news"
                  className="block text-white hover:text-gray-300 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  News
                </motion.a>
                <motion.a
                  href="#career"
                  className="block text-white hover:text-gray-300 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Career
                </motion.a>
                <motion.a
                  href="#contact"
                  className="block text-white hover:text-gray-300 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Contact
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="bg-[#0D0D0D] pb-4">
        <p className="text-gray-500 text-sm text-center">
          Copyright © 2026. All Rights Reserved by Inception Games.
        </p>
      </div>
    </>
  )
}