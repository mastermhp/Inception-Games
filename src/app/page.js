"use client"
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
      <ContactSection />
      <Footer />
    </main>
  )
}
