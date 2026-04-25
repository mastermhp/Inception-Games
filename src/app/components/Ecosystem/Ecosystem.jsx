"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { partnersData, PartnerCard } from "./Partners";
import { gamesData, GamesCarousel } from "./Games";
import { communityData, CommunityCard } from "./Community";

// ── Registry ─────────────────────────────────────────────
const TAB_REGISTRY = {
  partners: { data: partnersData, Card: PartnerCard },
  community: { data: communityData, Card: CommunityCard },
};

// ── Carousel Section ─────────────────────────────────────
function CarouselSection({ tabKey }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef(null);

  const registryItem = TAB_REGISTRY?.[tabKey];
  const currentData = registryItem?.data;
  const items = currentData?.items;

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ❌ HARD SAFE GUARD (prevents crash)
  if (!registryItem || !currentData || !items?.length) {
    return (
      <div className="text-center text-red-400 py-10">
        Invalid or empty carousel: {tabKey}
      </div>
    );
  }

  // Auto-play
  useEffect(() => {
    if (!isClient || isHovered) return;

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [isClient, isHovered, items.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrevious = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const handleGoToIndex = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext]);

  // Swipe handling
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);

    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
      dx < 0 ? handleNext() : handlePrevious();
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // visible cards
  const getVisibleCards = () => {
    if (isMobile) {
      return [{ ...items[activeIndex], position: "center", key: activeIndex }];
    }

    const prevIndex = (activeIndex - 1 + items.length) % items.length;
    const nextIndex = (activeIndex + 1) % items.length;

    return [
      { ...items[prevIndex], position: "left", key: prevIndex },
      { ...items[activeIndex], position: "center", key: activeIndex },
      { ...items[nextIndex], position: "right", key: nextIndex },
    ];
  };

  const { Card } = registryItem;

  const ShowcaseCard = ({ item, isFeatured }) => (
    <Card item={item} isFeatured={isFeatured} />
  );

  const visibleCards = getVisibleCards();

  return (
    <div className="relative">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1">
          {currentData.title}
        </h3>
        <p className="text-white/60 text-xs sm:text-sm md:text-base px-2">
          {currentData.subtitle}
        </p>
      </div>

      {/* Carousel */}
      <div className="relative w-full flex justify-center overflow-hidden">
        {/* Left */}
        <button
          onClick={handlePrevious}
          className="absolute left-1 sm:left-2 md:left-6 top-1/2 -translate-y-1/2 z-40 
  w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 
  rounded-full bg-purple-600/40 hover:bg-purple-600/70 text-white flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Right */}
        <button
          onClick={handleNext}
          className="absolute right-1 sm:right-2 md:right-6 top-1/2 -translate-y-1/2 z-40 
  w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 
  rounded-full bg-purple-600/40 hover:bg-purple-600/70 text-white flex items-center justify-center transition-all"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <div
          className="relative w-full flex items-center justify-center overflow-hidden"
          style={{ 
            height: isMobile ? "340px" : "520px",
            maxWidth: "100vw"
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence>
            {visibleCards.map((card) => {
              const isCenter = card.position === "center";

              let width, height, x;

              if (isMobile) {
                width = Math.max(280, Math.min(window.innerWidth - 50, 380));
                height = 300;
                x = 0;
              } else {
                width = isCenter ? 700 : 320;
                height = isCenter ? 540 : 320;
                x = 0;
                if (card.position === "left") x = -520;
                if (card.position === "right") x = 520;
              }

              return (
                <motion.div
                  key={card.key}
                  className="absolute flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{
                    x,
                    opacity: isCenter ? 1 : isMobile ? 0 : 0.5,
                    scale: isCenter ? 1 : isMobile ? 0 : 0.8,
                    zIndex: isCenter ? 30 : 10,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  style={{ width, height }}
                >
                  <ShowcaseCard item={card} isFeatured={isCenter} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1 sm:gap-2 mt-4 sm:mt-6">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => handleGoToIndex(i)}
            className={`rounded-full transition-all ${
              activeIndex === i
                ? "w-6 sm:w-8 h-2 sm:h-3 bg-purple-500"
                : "w-2 sm:w-3 h-2 sm:h-3 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────
export default function ShowcaseCarousel() {
  return (
    <section className="py-8 sm:py-12 md:py-20 bg-[#0a0a14]">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Discover Our Ecosystem
          </h2>
        </div>

        {/* Partners */}
        <div id="ecosystem-partners" className="mb-12 sm:mb-16 md:mb-20">
          <CarouselSection tabKey="partners" />
        </div>

        {/* Games */}
        <div id="ecosystem-games" className="mb-12 sm:mb-16 md:mb-20">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{gamesData.title}</h3>
            <p className="text-white/60 text-sm sm:text-base mt-1 sm:mt-2">{gamesData.subtitle}</p>
          </div>
          <GamesCarousel />
        </div>

        {/* Community */}
        <div id="ecosystem-community">
          <CarouselSection tabKey="community" />
        </div>
      </div>
    </section>
  );
}
