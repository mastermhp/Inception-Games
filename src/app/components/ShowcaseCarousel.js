"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// Data for the three sections
const showcaseData = {
  partners: {
    title: "Our Partners",
    subtitle: "Trusted collaborations that power our ecosystem",
    items: [
      {
        id: 1,
        name: "Ifarmer",
        photo: "/Ecosystem/Partners/ifarmer2.jpeg",
        smallLogo: "/Ecosystem/Partners/ifarmer2.jpeg",
        link: "#",
        caption: {
          normalText: "31,000+ Active Users powering ",
          highlightText:
            '"ভাগ্যের ছক্কা" Ludo Arcade — in collaboration with iFarmer & Folon.',
        },
      },
      {
        id: 2,
        name: "Mime",
        photo: "/Ecosystem/Partners/mime2.png",
        smallLogo: "/Ecosystem/Partners/mime2.png",
        link: "#",
        caption: {
          normalText: "Mime is our official Internet Sponsor — ",
          highlightText:
            "powering seamless connectivity for every gamer in the ecosystem.",
        },
      },
      {
        id: 3,
        name: "Moar",
        photo: "/Ecosystem/Partners/moar2.png",
        smallLogo: "/Ecosystem/Partners/moar2.png",
        link: "#",
        caption: {
          normalText: "Moar fuels the competitive spirit — ",
          highlightText:
            "official tournament sponsor empowering the gaming community.",
        },
      },
    ],
  },
  games: {
    title: "Our Games",
    subtitle: "Compete in your favorite titles",
    items: [
      {
        id: 1,
        name: "Z Inception",
        photo: "/Ecosystem/Games/zinception.jpg",
        smallLogo: "/Ecosystem/Games/zinception.jpg",
        link: "#",
      },
      {
        id: 2,
        name: "Beyblade",
        photo: "/Ecosystem/Games/Beyblade.png",
        smallLogo: "/Ecosystem/Games/Beyblade.png",
        link: "#",
      },
      {
        id: 3,
        name: "Dhaka Racing Sim",
        photo: "/Ecosystem/Games/DhakaRacingSim.jpg",
        smallLogo: "/Ecosystem/Games/DhakaRacingSim.jpg",
        link: "#",
      },
      {
        id: 4,
        name: "Exo Discover",
        photo: "/Ecosystem/Games/discover.png",
        smallLogo: "/Ecosystem/Games/discover.png",
        link: "#",
      },
      {
        id: 5,
        name: "Arcade Game",
        photo: "/Ecosystem/Games/ArcadeGame.jpeg",
        smallLogo: "/Ecosystem/Games/ArcadeGame.jpeg",
        link: "#",
      },
      {
        id: 6,
        name: "Unknown Surge",
        photo: "/Ecosystem/Games/unknownsurge.png",
        smallLogo: "/Ecosystem/Games/unknownsurge.png",
        link: "#",
      },
      
    ],
  },
  community: {
    title: "Our Community",
    subtitle: "Join thousands of passionate gamers",
    items: [
      { id: 1, photo: "/Ecosystem/Community/c1.jpg" },
      { id: 2, photo: "/Ecosystem/Community/c2.jpg" },
      { id: 3, photo: "/Ecosystem/Community/c3.jpg" },
      { id: 4, photo: "/Ecosystem/Community/c4.jpg" },
      { id: 5, photo: "/Ecosystem/Community/c5.PNG" },
      { id: 6, photo: "/Ecosystem/Community/c6.jpg" },
      { id: 7, photo: "/Ecosystem/Community/c7.jpg" },
      { id: 8, photo: "/Ecosystem/Community/c8.jpg" },
      // { id: 9, photo: "/Ecosystem/Community/c9.png" },
      // { id: 10, photo: "/Ecosystem/Community/c10.png" },
      // { id:11, photo: "/Ecosystem/Community/c11.png" },
      // { id: 12, photo: "/Ecosystem/Community/c12.png" },
      // { id: 13, photo: "/Ecosystem/Community/c13.png" },
      // { id: 14, photo: "/Ecosystem/Community/c14.png" },
      // { id: 15, photo: "/Ecosystem/Community/c15.png" },
      // { id: 16, photo: "/Ecosystem/Community/c16.png" },
      { id: 17, photo: "/Ecosystem/Community/c17.jpg" },
    ],
  },
};

const tabs = [
  { key: "partners", label: "Partners" },
  { key: "games", label: "Games" },
  { key: "community", label: "Community" },
];

// ── Quote-style Partner Card ─────────────────────────────────────────────────
function PartnerCard({ item, isFeatured = false }) {
  return (
    <div
      className={`relative h-full rounded-3xl overflow-hidden ${
        isFeatured ? "shadow-2xl shadow-purple-500/20" : ""
      }`}
    >
      {/* Full-bleed background photo */}
      <img
        src={item.photo}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* Dark gradient — heavy at bottom, fades at top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

      {/* Caption block pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-3 md:px-6 md:pb-7">
        {/* Yellow opening quote mark */}
        <div
          className="text-3xl md:text-4xl font-serif leading-none mb-1 select-none"
          style={{ color: "#E8C840" }}
        >
          ❝❝
        </div>

        {/* FIX: text-xs on mobile, text-sm/base on larger screens */}
        <p className="text-white text-xs sm:text-sm md:text-base leading-snug font-medium drop-shadow-md">
          {item.caption.normalText}
          <span className="font-bold" style={{ color: "#E8C840" }}>
            {item.caption.highlightText}
          </span>
        </p>
      </div>
    </div>
  );
}

// ── Shared ShowcaseCard dispatcher ───────────────────────────────────────────
function ShowcaseCard({ item, type, isFeatured = false, isPreview = false }) {
  if (type === "partners") {
    return <PartnerCard item={item} isFeatured={isFeatured} />;
  }

  if (type === "games") {
    return (
      <div
        className={`relative h-full rounded-3xl overflow-hidden ${isFeatured ? "shadow-2xl shadow-purple-500/20" : ""}`}
      >
        {/* Game Image */}
        <img
          src={item.photo}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {/* Title */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <h4 className="text-white font-semibold text-lg">{item.name}</h4>
        </div>
      </div>
    );
  }

  if (type === "community") {
    return (
      <div
        className={`relative h-full rounded-3xl overflow-hidden ${isFeatured ? "shadow-2xl shadow-purple-500/20" : ""}`}
      >
        <img
          src={item.photo}
          alt={`Community member ${item.id}`}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-sm font-bold">
            {item.id}
          </span>
        </div>
      </div>
    );
  }

  return null;
}

// ── Small Bottom Thumbnail ───────────────────────────────────────────────────
function SmallCard({ item, type, isActive }) {
  if (type === "partners") {
    return (
      <div
        className={`h-[80px] sm:h-[100px] rounded-xl overflow-hidden relative border transition-all ${isActive ? "border-purple-500" : "border-white/10"}`}
      >
        <img
          src={item.photo}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover "
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
        <div className="relative h-full flex items-end justify-center pb-2">
          <img
            src={item.smallLogo}
            alt={item.name}
            className="h-6 sm:h-7 w-auto object-contain filter brightness-110 drop-shadow-lg"
          />
        </div>
      </div>
    );
  }

  if (type === "games") {
    return (
      <div
        className={`h-[80px] sm:h-[100px] rounded-xl overflow-hidden relative border transition-all ${isActive ? "border-purple-500" : "border-white/10"}`}
      >
        <img
          src={item.photo}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
        <div className="relative h-full flex items-end justify-center pb-2">
          <img
            src={item.smallLogo}
            alt={item.name}
            className="h-6 sm:h-7 w-auto object-contain filter brightness-110 drop-shadow-lg"
          />
        </div>
      </div>
    );
  }

  if (type === "community") {
    return (
      <div
        className={`h-[80px] sm:h-[100px] rounded-xl overflow-hidden relative border transition-all ${isActive ? "border-purple-500" : "border-white/10"}`}
      >
        <img
          src={item.photo}
          alt={`Community member ${item.id}`}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/60 border border-white/20 text-white text-xs font-bold">
            {item.id}
          </span>
        </div>
      </div>
    );
  }

  return null;
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function ShowcaseCarousel() {
  const [activeTab, setActiveTab] = useState("partners");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef(null);

  // Touch/swipe state
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const currentData = showcaseData[activeTab];
  const items = currentData.items;

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length, activeTab]);

  useEffect(() => {
    setActiveIndex(0);
  }, [activeTab]);

  const goToPrev = useCallback(() => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goToNext = useCallback(() => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToIndex = useCallback((index) => {
    setIsAutoPlaying(false);
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  // ── Touch / swipe handlers ────────────────────────────────────────────────
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
      // Only trigger if horizontal swipe is dominant and >= 50px
      if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
        if (dx < 0) goToNext();
        else goToPrev();
      }
      touchStartX.current = null;
      touchStartY.current = null;
    },
    [goToNext, goToPrev],
  );

  return (
    <section className="py-12 md:py-20 overflow-hidden bg-gradient-to-b from-[#0a0a14] via-[#120820] to-[#0a0a14]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Discover Our Ecosystem
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mx-auto rounded-full" />
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="inline-flex bg-black/40 backdrop-blur-md rounded-full p-1.5 border border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? "text-white"
                    : "text-white/60 hover:text-white/80"
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-6 md:mb-8"
          >
            <h3 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">
              {currentData.title}
            </h3>
            <p className="text-white/60 text-sm md:text-base">
              {currentData.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Main Carousel */}
        <div className="relative" ref={containerRef}>
          {/* ── Nav arrows: on mobile sit outside card area using negative margin ── */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-black/80 hover:scale-110 transition-all duration-200"
            aria-label="Previous"
          >
            <ChevronLeft size={18} className="sm:hidden" />
            <ChevronLeft size={24} className="hidden sm:block" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-black/80 hover:scale-110 transition-all duration-200"
            aria-label="Next"
          >
            <ChevronRight size={18} className="sm:hidden" />
            <ChevronRight size={24} className="hidden sm:block" />
          </button>

          {/* Cards row */}
          <div
            className="flex items-center justify-center gap-4 py-4 md:py-8 px-10 sm:px-14 md:px-16"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Left preview — desktop only */}
            <motion.div
              className="hidden lg:block w-[340px] h-[340px] flex-shrink-0 opacity-40 scale-90"
              initial={false}
              animate={{ opacity: 0.4, scale: 0.9 }}
            >
              <ShowcaseCard
                item={items[(activeIndex - 1 + items.length) % items.length]}
                type={activeTab}
                isPreview
              />
            </motion.div>

            {/* Featured card
                FIX: removed fixed h-[650px] on mobile.
                Use aspect-ratio on small screens so card is always fully visible,
                then switch to fixed height on md+ where there's room. */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${activeIndex}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[500px] flex-shrink-0"
                style={{
                  aspectRatio: "3/4",
                }} /* mobile: natural proportional height */
              >
                {/* On md+ override the aspect-ratio with fixed height via inline style */}
                <div className="h-full md:h-[500px] md:[aspect-ratio:unset]">
                  <ShowcaseCard
                    item={items[activeIndex]}
                    type={activeTab}
                    isFeatured
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Right preview — desktop only */}
            <motion.div
              className="hidden lg:block w-[340px] h-[340px] flex-shrink-0 opacity-40 scale-90"
              initial={false}
              animate={{ opacity: 0.4, scale: 0.9 }}
            >
              <ShowcaseCard
                item={items[(activeIndex + 1) % items.length]}
                type={activeTab}
                isPreview
              />
            </motion.div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-4 md:mt-6">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-8 bg-gradient-to-r from-purple-500 to-pink-500"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Thumbnail Strip */}
        <div className="mt-8 md:mt-12 flex items-center justify-center">
          {/* FIX: narrower thumbnails on mobile so more fit without cut-off */}
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide snap-x snap-mandatory w-full justify-start sm:justify-center">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                onClick={() => goToIndex(idx)}
                className="flex-shrink-0 w-[120px] sm:w-[150px] md:w-[180px] cursor-pointer snap-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <SmallCard
                  item={item}
                  type={activeTab}
                  isActive={idx === activeIndex}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @media (min-width: 768px) {
          .md\\:[aspect-ratio\\:unset] { aspect-ratio: unset !important; }
        }
      `}</style>
    </section>
  );
}
