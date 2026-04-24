"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  Trophy,
  Swords,
  Video,
  Briefcase,
  Users,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  MessageSquare,
  ShoppingBag,
  Shirt,
  Package,
  Star,
  Bell,
  Zap,
  ChevronRight,
  Play,
  ArrowRight,
  Gamepad2,
  Target,
  Flame,
  Lock,
  CheckCircle,
  ExternalLink,
  Globe,
} from "lucide-react";
// import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import TournamentCarousel from "./components/TournamentCarousel.js";
import TrustedBrands from "./components/TrustedBrands";
import ShowcaseCarousel from "./components/ShowcaseCarousel";
import UpcomingEvents from "./components/UpcomingEvents";
import LatestNews from "./components/LatestNews";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import AllGamesLoop from "./components/AllGamesLoop";
import Ecosystem from "../../src/app/components/Ecosystem/Ecosystem.jsx";
import Image from "next/image";
import UnifiedAuthModal from "./components/AuthModals/UnifiedAuthModal";
import LaunchCountdownModal from "./components/LaunchCountdownModal";

function AnimatedCounter({ target, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = target / 60;

          const id = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(id);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const scrollTimeoutRef = useRef(null);
  const observerRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [countdownModalOpen, setCountdownModalOpen] = useState(false);

  const howToEarn = [
    {
      step: "01",
      title: "Sign Up Free",
      desc: "Create your account in 60 seconds.",
      icon: Gamepad2,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/30",
    },
    {
      step: "02",
      title: "Join Tournaments",
      desc: "Play and compete.",
      icon: Trophy,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/30",
    },
    {
      step: "03",
      title: "Build Fanbase",
      desc: "Grow followers.",
      icon: Users,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/30",
    },
    {
      step: "04",
      title: "Earn Money",
      desc: "Get paid.",
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
    },
  ];

  useEffect(() => {
    // Also check window.location on first load in case useSearchParams doesn't catch it
    const section =
      searchParams.get("section") ||
      new URLSearchParams(window.location.search).get("section");
    console.log(
      "[v0] Section param detected:",
      section,
      "URL:",
      window.location.href,
    );

    if (!section) return;

    // Cleanup previous timers
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    if (observerRef.current) observerRef.current.disconnect();
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    const doScroll = () => {
      const element = document.getElementById(section);

      if (!element) {
        // Log all available IDs for debugging
        const allIds = Array.from(document.querySelectorAll("[id]")).map(
          (el) => el.id,
        );
        console.log(
          "[v0] Element not found:",
          section,
          "Available IDs:",
          allIds,
        );
      } else {
        console.log("[v0] Element found! Scrolling to:", section);
        // Scroll with proper offset for fixed header
        const headerOffset = 120;
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - headerOffset,
          behavior: "smooth",
        });

        // Cleanup
        if (observerRef.current) observerRef.current.disconnect();
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      }

      return !!element;
    };

    // Start scrolling attempt after a longer initial delay to let components render
    scrollTimeoutRef.current = setTimeout(() => {
      console.log("[v0] Starting scroll attempt for section:", section);

      // First try immediately
      if (doScroll()) return;

      // Set up MutationObserver to catch DOM changes
      observerRef.current = new MutationObserver(() => {
        doScroll();
      });

      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
      });

      // Polling fallback with more attempts and longer intervals
      let scrollAttempts = 0;
      const maxAttempts = 50;

      pollIntervalRef.current = setInterval(() => {
        scrollAttempts++;
        if (doScroll()) {
          clearInterval(pollIntervalRef.current);
          if (observerRef.current) observerRef.current.disconnect();
        } else if (scrollAttempts >= maxAttempts) {
          console.log("[v0] Max scroll attempts reached for section:", section);
          clearInterval(pollIntervalRef.current);
          if (observerRef.current) observerRef.current.disconnect();
        }
      }, 300);
    }, 800);

    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (observerRef.current) observerRef.current.disconnect();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [searchParams]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0a0a14" }}>
      <Header />
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1699962700191-0f5633845733?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="Esports Arena"
            fill
            className="object-cover"
            priority
          />{" "}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/20" />
        </div>

        {/* Neon grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 w-full pt-28 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Live badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-zinc-900/80 border border-purple-700 rounded-full px-4 py-1.5 mb-6"
              >
                <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                <span className="text-xs text-zinc-300">
                  500 Gamers Earning,{" "}
                  <span className="text-purple-500">Right now</span>
                </span>

                {/* Logo */}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                // transition={{
                //   duration: ANIMATION_DURATION,
                //   delay: ANIMATION_DELAYS.logo,
                // }}
                className="mb-0"
              >
                <div className="flex items-center pt-4 pb-2">
                  <img
                    src="/Logo/fullLogo.png"
                    alt="SNS Logo"
                    className="w-50  h-13"
                  />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-6xl lg:text-7xl mb-4 tracking-tight leading-[0.92]"
              >
                PLAY GAMES.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  GET PAID.
                </span>
                <br />
                <span className="text-3xl lg:text-4xl text-zinc-400">
                  BUILD YOUR LEGACY.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-zinc-300 mb-8 max-w-lg leading-relaxed"
              >
                {
                  "The world's first platform where casual gamers and pros earn real money through tournaments, creator commissions, and brand deals — all in one place."
                }
              </motion.p>

              {/* Earning path teaser */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-2 mb-8"
              >
                {[
                  "🏆 Win Tournaments",
                  "💰 Get Commissions",
                  "🎁 Free Merch @ 500 Fans",
                  "🤝 Brand Deals",
                ].map((pill) => (
                  <span
                    key={pill}
                    className="text-xs bg-zinc-800/80 border border-zinc-700 rounded-full px-3 py-1.5 text-zinc-300"
                  >
                    {pill}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 mb-10"
              >
                <button
                  onClick={() => {
                    const element = document.getElementById("how-to-earn");
                    if (element) {
                      const headerOffset = 120;
                      const elementPosition =
                        element.getBoundingClientRect().top +
                        window.pageYOffset;
                      window.scrollTo({
                        top: elementPosition - headerOffset,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="relative px-8 py-4 bg-purple-800 cursor-pointer hover:bg-transparent transition-all duration-500 rounded-full flex items-center gap-2 border border-zinc-700 overflow-hidden group"
                >
                  {/* base background */}
                  <div className="absolute inset-0 bg-zinc-800/80 group-hover:opacity-0 transition-opacity duration-500 rounded-full" />

                  {/* glass effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/5 backdrop-blur-md rounded-full" />

                  {/* premium purple-pink glow sweep */}
                  <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                    <motion.div
                      className="absolute -left-1/2 top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-purple-400/25 to-transparent"
                      animate={{ x: ["0%", "250%"] }}
                      transition={{
                        duration: 1.3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </motion.div>

                  {/* glowing border */}
                  <div className="absolute inset-0 rounded-full border border-purple-500/0 group-hover:border-pink-400/30 transition-all duration-500" />

                  {/* content */}
                  <span className="relative z-10 flex items-center gap-2 text-white group-hover:text-purple-200 transition-colors duration-300">
                    <Play className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                    Watch How It Works
                  </span>
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-3 gap-4 border-t border-zinc-800/60 pt-6"
              >
                {[
                  {
                    target: 1500,
                    suffix: "+",
                    prefix: "$",
                    label: "Paid Out",
                  },
                  {
                    target: 5000,
                    suffix: "+",
                    prefix: "",
                    label: "Active Gamers",
                  },
                  {
                    target: 1000,
                    suffix: "+",
                    prefix: "$",
                    label: "Prize Pools",
                  },
                ].map(({ target, suffix, prefix, label }) => (
                  <div key={label}>
                    <div className="text-2xl text-purple-400">
                      <AnimatedCounter
                        target={target}
                        suffix={suffix}
                        prefix={prefix}
                      />
                    </div>
                    <div className="text-xs text-zinc-500">{label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Floating Cards */}
            {/* <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="space-y-4 max-w-sm ml-auto">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 backdrop-blur"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-zinc-400">
                        Monthly Earnings
                      </span>
                    </div>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      +34% ↑
                    </span>
                  </div>
                  <div className="text-3xl text-white mb-1">$1,247.80</div>
                  <div className="flex gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-yellow-400" />
                      Tournaments $820
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-purple-400" />
                      Commission $427
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 7, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="bg-gradient-to-br from-purple-900/60 to-zinc-900/90 border border-purple-500/30 rounded-2xl p-5 backdrop-blur"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-zinc-300">
                        1000 Follower Reward
                      </span>
                    </div>
                    <span className="text-xs text-purple-400">84.7%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2.5 mb-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "84.7%" }}
                      transition={{ duration: 2, delay: 1 }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full"
                    />
                  </div>
                  <div className="text-xs text-zinc-500 mb-3">
                    847 / 1000 followers — 153 to go!
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs bg-pink-500/20 text-pink-400 border border-pink-500/30 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Package className="w-3 h-3" /> Free Merch
                    </span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-lg flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> 15% Commission
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/30 rounded-xl flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">Spring Championship</div>
                      <div className="text-xs text-zinc-500">
                        Starts in{" "}
                        <span className="text-yellow-400">8 days</span> · $50K
                        Prize
                      </div>
                    </div>
                    <button className="text-xs bg-purple-600 hover:bg-purple-500 px-3 py-1.5 rounded-lg transition-colors">
                      Join
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div> */}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-600"
        >
          <span className="text-xs">Scroll to explore</span>
          <div className="w-5 h-8 border-2 border-zinc-700 rounded-full flex items-start justify-center pt-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-purple-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ── HOW TO EARN ── */}
      <section
        id="how-to-earn"
        className="py-28 px-6 bg-zinc-950 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-purple-950/10 to-zinc-950 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1.5 mb-5">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-purple-300">Your Earning Path</span>
            </div>
            <h2 className="text-5xl mb-4">
              How You{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Earn Money
              </span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Four simple steps from a casual gamer to a paid professional.
              Start today, get paid this month.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 relative py-16">
            {/* ===== Processing Bar Fill - Gray fills to Purple-Pink ===== */}
            <div className="hidden md:block absolute top-36 left-[5%] right-[5%] h-1 pointer-events-none">
              {/* Container for the processing line */}
              <div className="processing-line w-full h-full" />
            </div>

            {/* Step Cards */}
            {howToEarn.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -16 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Icon container - starts gray, reveals to purple-pink glow */}
                <motion.div
                  whileHover={{
                    scale: 1.2,
                    y: -4,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`icon-animate-reveal icon-animate-reveal-${i} w-24 h-24 bg-gray-900 rounded-full border-1 border-gray-500 rounded-3xl flex items-center justify-center mb-8 relative z-10 transition-all duration-300`}
                  style={{
                    boxShadow: `0 20px 40px rgba(100, 100, 100, 0.1)`,
                  }}
                >
                  {/* Rotating border - starts gray, reveals purple on animation */}
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-1 rounded-full border-2 border-dashed opacity-50 group-hover:opacity-40 transition-opacity duration-300"
                    style={{
                      borderColor: "rgb(129, 23, 241)",
                    }}
                  />
                  {/* Icon - starts gray, reveals to purple as line passes */}
                  <item.icon className="w-10 h-10 relative z-20 icon-color" />
                </motion.div>

                {/* Step Label - starts gray, reveals purple */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="step-label text-xs font-extrabold mb-3 tracking-widest"
                  style={{
                    color: "rgb(120, 120, 120)",
                  }}
                >
                  STEP {item.step}
                </motion.div>

                {/* Title - starts gray, reveals to light gray as animation plays */}
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  className="step-title text-2xl font-bold mb-3 leading-tight transition-all duration-300"
                  style={{
                    color: "rgb(130, 130, 130)",
                  }}
                >
                  {item.title}
                </motion.h3>

                {/* Description - starts gray, reveals lighter gray */}
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.15 }}
                  className="step-description text-base leading-relaxed transition-colors duration-300"
                  style={{
                    color: "rgb(100, 100, 100)",
                  }}
                >
                  {item.desc}
                </motion.p>

                {/* Animated bottom accent underline */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                  className="h-1 mt-6 w-12 rounded-full origin-left"
                  style={{
                    background: `linear-gradient(90deg, ${["#a855f7", "#facc15", "#06b6d4", "#10b981"][i]}, ${["#ec4899", "#f97316", "#0ea5e9", "#34d399"][i]})`,
                  }}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-14"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (user) {
                  router.push("/profile");
                } else {
                  // setCountdownModalOpen(true);
                  setLoginModalOpen(true);
                }
              }}
              className="relative cursor-pointer px-10 py-3 bg-gradient-to-r from-purple-900 to-pink-800 hover:bg-transparent transition-all duration-500 rounded-[40px] inline-flex items-center gap-2 shadow-lg shadow-purple-500/20 font-semibold text-lg overflow-hidden group"
            >
              {/* fade out gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-pink-800 group-hover:opacity-0 transition-opacity duration-500 rounded-[40px]" />

              {/* glass layer appears on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/5 backdrop-blur-md rounded-[40px]" />

              {/* animated glow sweep (only visible on hover) */}
              <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                <motion.div
                  className="absolute -left-1/2 top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  animate={{ x: ["0%", "250%"] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>

              {/* border glow on hover */}
              <div className="absolute inset-0 rounded-[40px] border border-white/0 group-hover:border-purple-300/30 transition-all duration-500" />

              {/* content */}
              <span className="relative z-10 text-white group-hover:text-purple-200 transition-colors duration-300">
                {user ? "My Profile" : "Start Your Journey"}
              </span>

              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* <HeroSection /> */}
      {/* <ComingSoon/> */}
      {/* <TournamentCarousel /> */}
      <AllGamesLoop />
      <TrustedBrands />
      <Ecosystem />
      {/* <ShowcaseCarousel /> */}
      {/* <UpcomingEvents /> */}
      <LatestNews />
      <div id="career">{/* Career section can be added here if needed */}</div>
      <ContactSection />
      <Footer />

      {/* Countdown Modal */}
      <LaunchCountdownModal
        isOpen={countdownModalOpen}
        onClose={() => setCountdownModalOpen(false)}
        onCountdownComplete={() => {
          setCountdownModalOpen(false);
          setLoginModalOpen(true);
        }}
      />

      {/* Login Modal */}
      <UnifiedAuthModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div />}>
      <HomeContent />
    </Suspense>
  );
}
