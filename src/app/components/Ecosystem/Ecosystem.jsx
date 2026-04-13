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
  games: { data: gamesData, Card: GameCard },
  community: { data: communityData, Card: CommunityCard },
};

// ── Carousel Section Component ─────────────────────────────────────────────
function CarouselSection({ tabKey }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const intervalRef = useRef(null);

  const currentData = TAB_REGISTRY[tabKey].data;
  const items = currentData.items;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-play
  useEffect(() => {
    if (!isClient || isHovered) return;

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
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

  // Touch / swipe handlers
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

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
        dx < 0 ? handleNext() : handlePrevious();
      }
      touchStartX.current = null;
      touchStartY.current = null;
    },
    [handleNext, handlePrevious],
  );

  // Get visible cards: left, center, right
  const getVisibleCards = () => {
    const prevIndex = (activeIndex - 1 + items.length) % items.length;
    const nextIndex = (activeIndex + 1) % items.length;

    return [
      {
        ...items[prevIndex],
        position: "left",
        key: `${tabKey}-${prevIndex}-left`,
      },
      {
        ...items[activeIndex],
        position: "center",
        key: `${tabKey}-${activeIndex}-center`,
      },
      {
        ...items[nextIndex],
        position: "right",
        key: `${tabKey}-${nextIndex}-right`,
      },
    ];
  };

  // Dispatcher: picks the right Card for the active tab
  function ShowcaseCard({ item, isFeatured = false }) {
    const { Card } = TAB_REGISTRY[tabKey];
    return <Card item={item} isFeatured={isFeatured} />;
  }

  if (!isClient) {
    return (
      <div className="relative text-center">
        <h3 className="text-xl md:text-3xl font-bold text-white mb-1">
          {currentData.title}
        </h3>
        <p className="text-white/60 text-sm md:text-base">
          {currentData.subtitle}
        </p>
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-500">Loading carousel...</div>
        </div>
      </div>
    );
  }

  const visibleCards = getVisibleCards();

  return (
    <div className="relative">
      {/* Dynamic Title */}
      <div className="text-center mb-6 md:mb-8">
        <h3 className="text-xl md:text-3xl font-bold text-white mb-1">
          {currentData.title}
        </h3>
        <p className="text-white/60 text-sm md:text-base">
          {currentData.subtitle}
        </p>
      </div>

      {/* Main Carousel */}
      <div className="relative w-full flex justify-center">
        {/* Left Navigation Arrow */}
        <motion.button
          onClick={handlePrevious}
          className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-40 w-10 h-10 md:w-14 md:h-14 bg-purple-600/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-purple-600/60 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous"
        >
          <ChevronLeft size={24} className="md:size-28" />
        </motion.button>

        {/* Right Navigation Arrow */}
        <motion.button
          onClick={handleNext}
          className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-40 w-10 h-10 md:w-14 md:h-14 bg-purple-600/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-purple-600/60 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next"
        >
          <ChevronRight size={24} className="md:size-28" />
        </motion.button>

        <div
          className="relative flex items-center justify-center px-4 md:px-20"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ height: "600px", minHeight: "600px" }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleCards.map((card) => {
              const isCenter = card.position === "center";
              const isLeft = card.position === "left";
              const isRight = card.position === "right";

              const centerWidth =
                typeof window !== "undefined"
                  ? Math.min(window.innerWidth * 0.65, 700)
                  : 700;
              const sideWidth =
                typeof window !== "undefined"
                  ? Math.min(window.innerWidth * 0.3, 320)
                  : 320;

              const cardWidth = isCenter ? centerWidth : sideWidth;
              const cardHeight = isCenter ? 400 : 280;

              let xPosition = 0;
              if (isLeft) {
                xPosition = -centerWidth / 2 - sideWidth / 2 - 15;
              } else if (isRight) {
                xPosition = centerWidth / 2 + sideWidth / 2 + 15;
              }

              return (
                <motion.div
                  key={card.key}
                  className="absolute flex-shrink-0"
                  initial={{
                    x: centerWidth / 2 + sideWidth / 2 + 200,
                    opacity: 0,
                    scale: 0.7,
                  }}
                  animate={{
                    x: xPosition,
                    opacity: isCenter ? 1 : 0.5,
                    scale: isCenter ? 1 : 0.8,
                    zIndex: isCenter ? 30 : 10,
                  }}
                  exit={{
                    x: -centerWidth / 2 - sideWidth / 2 - 200,
                    opacity: 0,
                    scale: 0.7,
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
                  {/* Stretch inner div to fill motion wrapper 100% */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <ShowcaseCard item={card} isFeatured={isCenter} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleGoToIndex(idx)}
            className={`rounded-full transition-all ${
              activeIndex === idx
                ? "w-8 h-3 bg-gradient-to-r from-purple-500 to-pink-500"
                : "w-3 h-3 bg-white/40 hover:bg-white/60"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function ShowcaseCarousel() {
  return (
    <section className="py-12 md:py-20 overflow-hidden bg-gradient-to-b from-[#0a0a14] via-[#120820] to-[#0a0a14]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Discover Our Ecosystem
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 mx-auto rounded-full" />
        </div>

        {/* Partners Section */}
        <div className="mb-20 md:mb-32">
          <CarouselSection tabKey="partners" />
        </div>

        {/* Games Section */}
        <div className="mb-20 md:mb-32">
          <CarouselSection tabKey="games" />
        </div>

        {/* Community Section */}
        <div className="mb-8">
          <CarouselSection tabKey="community" />
        </div>
      </div>
    </section>
  );
}
