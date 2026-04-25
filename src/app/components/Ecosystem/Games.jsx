"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const gamesData = {
  title: "Our Games",
  subtitle: "Compete in your favorite titles",
  items: [
    {
      id: 1,
      name: "Z Inception",
      genre: "Action",
      photo: "/Ecosystem/Games/zinception.jpg",
      link: "https://drive.google.com/file/d/1a0PfwyBeGXXJAvE5wRGG_7wey0y5JCZx/view",
    },
    {
      id: 2,
      name: "Beyblade",
      genre: "Sports",
      photo: "/Ecosystem/Games/Beyblade.png",
      link: "https://gamejolt.com/games/bayblade_demo/274742",
    },
    {
      id: 3,
      name: "Dhaka Racing Sim",
      genre: "Racing",
      photo: "/Ecosystem/Games/DhakaRacingSim.jpg",
      link: "https://www.facebook.com/reel/2260993467662799",
    },
    {
      id: 4,
      name: "Exo Discover",
      genre: "Adventure",
      photo: "/Ecosystem/Games/discover.png",
      link: "https://imtiazahmeddipto.itch.io/exo-descover",
    },
    {
      id: 5,
      name: "Arcade Game",
      genre: "Casual",
      photo: "/Ecosystem/Games/ArcadeGame.jpeg",
      link: "https://play.google.com/store/apps/details?id=asia.ifarmer.farmers",
    },
    {
      id: 6,
      name: "Unknown Surge",
      genre: "Action",
      photo: "/Ecosystem/Games/unknownsurge.png",
      link: "https://store.steampowered.com/app/1132450/Unknown_Surge/",
    },
  ],
};

/* ─────────────────────────────────────────────
   CARD
───────────────────────────────────────────── */
export function GameCard({ item, isFeatured = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full h-full"
      tabIndex={isFeatured ? 0 : -1}
    >
      <div
        className="relative w-full h-full rounded-[28px] overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transform: hovered && isFeatured ? "scale(1.03)" : "scale(1)",
          transition: "all .45s ease",
          boxShadow: isFeatured
            ? "0 0 45px rgba(129,23,241,.22), 0 18px 50px rgba(0,0,0,.55)"
            : "0 10px 25px rgba(0,0,0,.35)",
        }}
      >
        {/* IMAGE (FULL COVER FIX) */}
        <img
          src={item.photo}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Genre */}
        <div className="absolute top-4 right-4 z-20">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[1px] uppercase text-white bg-purple-600/45 backdrop-blur-md border border-white/10">
            {item.genre}
          </span>
        </div>

        {/* CTA */}
        <AnimatePresence>
          {hovered && isFeatured && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <div className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm">
                Play Now
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
          <h3 className="text-xl font-black relative inline-block">
            <span className="bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text">
              {item.name}
            </span>
          </h3>

          <p className="text-white/50 text-xs mt-1 uppercase tracking-[2px]">
            {item.genre}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   CAROUSEL
───────────────────────────────────────────── */
export function GamesCarousel() {
  const items = gamesData.items;
  const total = items.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused) return;

    intervalRef.current = setInterval(next, 4500);
    return () => clearInterval(intervalRef.current);
  }, [paused, next]);

  const getVisibleCards = () => {
    if (isMobile) {
      return [{ ...items[activeIndex], position: "center", key: activeIndex }];
    }

    const prevIndex = (activeIndex - 1 + total) % total;
    const nextIndex = (activeIndex + 1) % total;

    return [
      { ...items[prevIndex], position: "left", key: prevIndex },
      { ...items[activeIndex], position: "center", key: activeIndex },
      { ...items[nextIndex], position: "right", key: nextIndex },
    ];
  };

  const visibleCards = getVisibleCards();

  return (
    <section className="relative">
      <div className="relative w-full flex justify-center overflow-hidden">
        {/* Left Arrow */}
        <button
          onClick={prev}
          className="absolute left-1 sm:left-2 md:left-8 top-1/2 -translate-y-1/2 z-50 w-7 h-7 sm:w-10 sm:h-10 md:w-10 md:h-10 rounded-full bg-purple-600/40 hover:bg-purple-600/70 backdrop-blur-md text-white flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={next}
          className="absolute right-1 sm:right-2 md:right-8 top-1/2 -translate-y-1/2 z-50 w-7 h-7 sm:w-10 sm:h-10 md:w-10 md:h-10 rounded-full bg-purple-600/40 hover:bg-purple-600/70 backdrop-blur-md text-white flex items-center justify-center transition-all"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <div
          className="relative flex items-center justify-center w-full overflow-hidden"
          style={{ 
            height: isMobile ? "340px" : "540px",
            maxWidth: "100vw"
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleCards.map((card) => {
              const isCenter = card.position === "center";
              const isLeft = card.position === "left";
              const isRight = card.position === "right";

              let width, height, x;

              if (isMobile) {
                width = Math.max(280, Math.min(window.innerWidth - 50, 380));
                height = 300;
                x = 0;
              } else {
                width = isCenter ? 700 : 320;
                height = isCenter ? 540 : 320;
                x = 0;
                if (isLeft) x = -520;
                if (isRight) x = 520;
              }

              return (
                <motion.div
                  key={`${card.position}-${card.key}`}
                  className="absolute flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.7, x: 250 }}
                  animate={{
                    x,
                    opacity: isCenter ? 1 : isMobile ? 0 : 0.5,
                    scale: isCenter ? 1 : isMobile ? 0 : 0.8,
                    zIndex: isCenter ? 30 : 10,
                  }}
                  exit={{ opacity: 0, scale: 0.7, x: -250 }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  style={{ width, height }}
                >
                  <GameCard item={card} isFeatured={isCenter} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1 sm:gap-2 mt-4 sm:mt-5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              activeIndex === i
                ? "w-6 sm:w-8 h-2 sm:h-3 bg-gradient-to-r from-purple-500 to-pink-500"
                : "w-2 sm:w-3 h-2 sm:h-3 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
