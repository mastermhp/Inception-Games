"use client"
import { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Header from "./components/Header"
import HeroSection from "./components/HeroSection"
import TournamentCarousel from "./components/TournamentCarousel.js"
import TrustedBrands from "./components/TrustedBrands"
import ShowcaseCarousel from "./components/ShowcaseCarousel"
import UpcomingEvents from "./components/UpcomingEvents"
import LatestNews from "./components/LatestNews"
import ContactSection from "./components/ContactSection"
import Footer from "./components/Footer"
import AllGamesLoop from "./components/AllGamesLoop"
import Ecosystem from "../../src/app/components/Ecosystem/Ecosystem.jsx"

export default function Home() {
  const searchParams = useSearchParams()
  const scrollTimeoutRef = useRef(null)
  const observerRef = useRef(null)
  const pollIntervalRef = useRef(null)

  useEffect(() => {
    // Also check window.location on first load in case useSearchParams doesn't catch it
    const section = searchParams.get('section') || new URLSearchParams(window.location.search).get('section')
    console.log("[v0] Section param detected:", section, "URL:", window.location.href)
    
    if (!section) return

    // Cleanup previous timers
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    if (observerRef.current) observerRef.current.disconnect()
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)

    const doScroll = () => {
      const element = document.getElementById(section)
      
      if (!element) {
        // Log all available IDs for debugging
        const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id)
        console.log("[v0] Element not found:", section, "Available IDs:", allIds)
      } else {
        console.log("[v0] Element found! Scrolling to:", section)
        // Scroll with proper offset for fixed header
        const headerOffset = 120
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        window.scrollTo({
          top: elementPosition - headerOffset,
          behavior: 'smooth'
        })
        
        // Cleanup
        if (observerRef.current) observerRef.current.disconnect()
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
      }
      
      return !!element
    }

    // Start scrolling attempt after a longer initial delay to let components render
    scrollTimeoutRef.current = setTimeout(() => {
      console.log("[v0] Starting scroll attempt for section:", section)
      
      // First try immediately
      if (doScroll()) return

      // Set up MutationObserver to catch DOM changes
      observerRef.current = new MutationObserver(() => {
        doScroll()
      })

      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
      })

      // Polling fallback with more attempts and longer intervals
      let scrollAttempts = 0
      const maxAttempts = 50
      
      pollIntervalRef.current = setInterval(() => {
        scrollAttempts++
        if (doScroll()) {
          clearInterval(pollIntervalRef.current)
          if (observerRef.current) observerRef.current.disconnect()
        } else if (scrollAttempts >= maxAttempts) {
          console.log("[v0] Max scroll attempts reached for section:", section)
          clearInterval(pollIntervalRef.current)
          if (observerRef.current) observerRef.current.disconnect()
        }
      }, 300)
    }, 800)

    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      if (observerRef.current) observerRef.current.disconnect()
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [searchParams])

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0a0a14" }}>
      <Header />
      <HeroSection />
      {/* <ComingSoon/> */}
      <TournamentCarousel />
      <AllGamesLoop/>
      <TrustedBrands />
      <Ecosystem/>
      {/* <ShowcaseCarousel /> */}
      {/* <UpcomingEvents /> */}
      <LatestNews />
      <div id="career">
        {/* Career section can be added here if needed */}
      </div>
      <ContactSection />
      <Footer />
    </main>
  )
}
