"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { partnersData, PartnerCard } from "./partners";
import { gamesData, GameCard } from "./games";
import { communityData, CommunityCard } from "./community";

// ── Registry: add new tabs here only ────────────────────────────────────────
const TAB_REGISTRY = {
  partners: { data: partnersData, Card: PartnerCard },
  games:    { data: gamesData,    Card: GameCard },
  community:{ data: communityData,Card: CommunityCard },
};

// ── Carousel Section Component ─────────────────────────────────────────────
function CarouselSection({ tabKey }) {
  const [activeIndex, setActiveIndex]   = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef(null);

  // Touch / swipe state
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const currentData = TAB_REGISTRY[tabKey].data;
  const items = currentData.items;

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft")  goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  // Touch / swipe handlers
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
      if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
        dx < 0 ? goToNext() : goToPrev();
      }
      touchStartX.current = null;
      touchStartY.current = null;
    },
    [goToNext, goToPrev],
  );

  // Dispatcher: picks the right Card for the active tab
  function ShowcaseCard({ item, isFeatured = false }) {
    const { Card } = TAB_REGISTRY[tabKey];
    return <Card item={item} isFeatured={isFeatured} />;
  }

  return (
    <div className="relative" ref={containerRef}>

      {/* Dynamic Title */}
      <div className="text-center mb-3 md:mb-4">
        <h3 className="text-xl md:text-3xl font-bold text-white mb-1">
          {currentData.title}
        </h3>
        <p className="text-white/60 text-sm md:text-base">
          {currentData.subtitle}
        </p>
      </div>

      {/* Main Carousel */}
      <div className="relative">

        {/* Nav arrows */}
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
          className="flex items-center justify-center gap-3 py-1 md:py-2 px-2 sm:px-3 md:px-4"
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
            />
          </motion.div>

          {/* Featured card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${tabKey}-${activeIndex}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-[500px] flex-shrink-0"
              style={{ aspectRatio: "3/4" }}
            >
              <div className="h-full md:h-[500px] md:[aspect-ratio:unset]">
                <ShowcaseCard
                  item={items[activeIndex]}
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
            />
          </motion.div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-2">
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
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function ShowcaseCarousel() {
  return (
    <section className="py-3 md:py-6 overflow-hidden bg-gradient-to-b from-[#0a0a14] via-[#120820] to-[#0a0a14]">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className="text-center mb-3 md:mb-4">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
            Discover Our Ecosystem
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mx-auto rounded-full" />
        </div>


        {/* Partners Section */}
        <div className="mb-16 md:mb-20">
          <CarouselSection tabKey="partners" />
        </div>

        {/* Games Section */}
        <div className="mb-16 md:mb-20">
          <CarouselSection tabKey="games" />
        </div>

        {/* Community Section */}
        <div className="mb-16 md:mb-20">
          <CarouselSection tabKey="community" />
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