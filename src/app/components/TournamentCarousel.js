"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import UnifiedAuthModal from "./AuthModals/UnifiedAuthModal"

const tournamentData = [
  {
    id: 1,
    title: "Slice N Share Tournaments",
    description:
      "Step into the arena with Slice N Share — where passion meets competition. We're empowering the eSports community of bangladesh",
    image: "/Hero/tournament-card.png",
    eventType: "Slicenshare Tournament",
    price: 399,
    flowType: "tournament",
  },
  {
    id: 2,
    title: "Slice N Share Scrims",
    description: "A revolutionary esports tournament bringing together the best talent from across the region",
    image: "/Hero/tournament-card.png",
    eventType: "Slicenshare Scrims",
    price: 299,
    flowType: "scrims",
  },
  {
    id: 3,
    title: "Slice N Share Brand Deal",
    description:
      "Join the premier esports championship of south asia with massive prize pool and international exposure",
    image: "/Hero/tournament-card.png",
    eventType: "Slicenshare Brand Deal",
    price: 499,
    flowType: "brand-deal",
  },
]

export default function TournamentCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isHovered, setIsHovered] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [signupModalOpen, setSignupModalOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)

  const intervalRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % tournamentData.length)
  }, [])

  useEffect(() => {
    if (!isClient || isHovered) return

    intervalRef.current = setInterval(() => {
      handleNext()
    }, 5000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isClient, isHovered, handleNext])

  const handlePrevious = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev - 1 + tournamentData.length) % tournamentData.length)
  }, [])

  if (!isClient) {
    return (
      <section className="relative py-20 px-4 bg-gradient-to-b from-[#0a0a14] to-[#0f0f1a]">
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-500">Loading tournament carousel...</div>
        </div>
      </section>
    )
  }

  const getVisibleCards = () => {
    const prevIndex = (currentIndex - 1 + tournamentData.length) % tournamentData.length
    const nextIndex = (currentIndex + 1) % tournamentData.length

    return [
      { ...tournamentData[prevIndex], position: "left", key: `${prevIndex}-left` },
      { ...tournamentData[currentIndex], position: "center", key: `${currentIndex}-center` },
      { ...tournamentData[nextIndex], position: "right", key: `${nextIndex}-right` },
    ]
  }

  const visibleCards = getVisibleCards()

  return (
    <>
      <section className="relative py-20 -mt-[420px] overflow-hidden">
        <div className="w-full flex justify-center">
          <div className="relative w-full max-w-[1600px] px-4">
            {/* Left Navigation Arrow */}
            <motion.button
              onClick={handlePrevious}
              className="absolute left-8 top-1/2 transform -translate-y-1/2 z-40 w-12 h-12 md:w-16 md:h-16 bg-purple-600/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-purple-600/60 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={28} />
            </motion.button>

            {/* Right Navigation Arrow */}
            <motion.button
              onClick={handleNext}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 z-40 w-12 h-12 md:w-16 md:h-16 bg-purple-600/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-purple-600/60 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight size={28} />
            </motion.button>

            <div
              className="relative flex items-center justify-center"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ height: "550px" }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {visibleCards.map((card) => {
                  const isCenter = card.position === "center"
                  const isLeft = card.position === "left"
                  const isRight = card.position === "right"

                  const centerWidth = typeof window !== "undefined" ? Math.min(window.innerWidth * 0.7, 900) : 900
                  const sideWidth = typeof window !== "undefined" ? Math.min(window.innerWidth * 0.35, 450) : 450

                  const cardWidth = isCenter ? centerWidth : sideWidth
                  const cardHeight = isCenter ? 500 : 380

                  let xPosition = 0
                  if (isLeft) {
                    xPosition = -centerWidth / 2 - sideWidth / 2 - 10
                  } else if (isRight) {
                    xPosition = centerWidth / 2 + sideWidth / 2 + 10
                  }

                  return (
                    <motion.div
                      key={card.key}
                      className="absolute flex-shrink-0"
                      initial={{
                        x: centerWidth / 2 + sideWidth / 2 + 200,
                        opacity: 0,
                        scale: 0.75,
                      }}
                      animate={{
                        x: xPosition,
                        opacity: isCenter ? 1 : 0.4,
                        scale: isCenter ? 1 : 0.8,
                        zIndex: isCenter ? 30 : 10,
                      }}
                      exit={{
                        x: -centerWidth / 2 - sideWidth / 2 - 200,
                        opacity: 0,
                        scale: 0.75,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 30,
                        mass: 0.8,
                      }}
                      style={{
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                      }}
                    >
                      <div
                        className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-purple-500/50 group-hover:border-purple-500 transition-all shadow-2xl"
                        style={{
                          backgroundImage: `url('${card.image}')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

                        <div className="absolute inset-0 flex flex-col justify-end items-center text-center p-6 md:p-8 text-white z-10">
                          <motion.h3
                            className="font-bold mb-3 md:mb-4"
                            style={{
                              fontFamily: "Bebas Neue, sans-serif",
                              fontSize: isCenter ? "48px" : "32px",
                            }}
                            animate={{
                              opacity: isCenter ? 1 : 0.7,
                            }}
                          >
                            {card.title}
                          </motion.h3>

                          <motion.p
                            className="text-gray-200 mb-4 md:mb-6 line-clamp-3 max-w-2xl"
                            style={{
                              fontSize: isCenter ? "20px" : "16px",
                            }}
                            animate={{
                              opacity: isCenter ? 1 : 0.6,
                            }}
                          >
                            {card.description}
                          </motion.p>

                          {isCenter && (
                            <motion.div
                              className="flex gap-3 md:gap-4"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <button
                                onClick={() => {
                                  setSelectedCard(card)
                                  setSignupModalOpen(true)
                                }}
                                className="px-6 md:px-8 py-2 md:py-3 rounded-full font-bold text-white text-sm transition hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105"
                                style={{
                                  backgroundColor: "#8117EE",
                                }}
                              >
                                Sign Up
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-3 mt-10">
              {tournamentData.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(1)
                    setCurrentIndex(index)
                  }}
                  className={`rounded-full transition-all ${
                    currentIndex === index ? "w-10 h-3 bg-purple-500" : "w-3 h-3 bg-white/40 hover:bg-white/70"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

  <UnifiedAuthModal
    isOpen={signupModalOpen}
    onClose={() => {
      setSignupModalOpen(false)
      setSelectedCard(null)
        }}
        userType="player"
      />
    </>
  )
}
