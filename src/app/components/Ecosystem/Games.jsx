"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export const gamesData = {
  title: "Our Games",
  subtitle: "Compete in your favorite titles",
  items: [
    {
      id: 1,
      name: "Z Inception",
      genre: "Action",
      photo: "/Ecosystem/Games/zinception.jpg",
      link: "https://drive.google.com/file/d/1a0PfwyBeGXXJAvE5wRGG_7wey0y5JCzX/view",
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
      link: "https://play.google.com/store/apps/details?id=asia.ifarmer.farmers&pcampaignid=web_share",
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

function PlayIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="flex-shrink-0"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function GameCard({ item, isFeatured = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={item.link || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full h-full"
    >
      <div
        className="relative w-full h-full rounded-3xl overflow-hidden group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "linear-gradient(135deg, rgba(129, 23, 241, 0.1) 0%, rgba(255, 0, 64, 0.05) 100%)",
          border: "1px solid rgba(129, 23, 241, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          transform: hovered ? "translateY(-8px)" : "translateY(0)",
        }}
      >
        {/* Game Image - Full cover */}
        <img
          src={item.photo}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{
            transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            transform: hovered ? "scale(1.08) rotate(1deg)" : "scale(1) rotate(0deg)",
          }}
        />

        {/* Enhanced gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: hovered
              ? "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(129,23,241,0.2) 50%, rgba(0,0,0,0.4) 100%)"
              : "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)",
            transition: "all 0.5s ease-in-out",
          }}
        />

        {/* Animated border glow on hover */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: hovered
              ? "linear-gradient(90deg, transparent, rgba(129,23,241,0.3), transparent)"
              : "transparent",
            transition: "all 0.5s ease-in-out",
            pointerEvents: "none",
          }}
        />

        {/* Top-right badge with enhancement */}
        <div
          className="absolute top-4 right-4 text-white/90 tracking-widest font-bold z-20"
          style={{
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "10px",
            background: "rgba(129, 23, 241, 0.4)",
            padding: "6px 12px",
            borderRadius: "20px",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            transition: "all 0.3s ease",
            opacity: hovered ? 1 : 0.8,
            transform: hovered ? "scale(1.1)" : "scale(1)",
          }}
        >
          ● PLAY
        </div>

        {/* Play now button - appears on hover */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.3 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
            style={{
              pointerEvents: "none",
            }}
          >
            <div
              className="flex items-center gap-2 rounded-full text-black font-bold whitespace-nowrap select-none"
              style={{
                fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: "13px",
                background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,240,240,0.95) 100%)",
                padding: "10px 22px",
                boxShadow: "0 12px 40px rgba(129, 23, 241, 0.3)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <PlayIcon size={16} />
              <span>Play now</span>
            </div>
          </motion.div>
        )}

        {/* Footer: name + genre */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            padding: "16px 18px 18px",
            background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)",
            transition: "all 0.3s ease",
          }}
        >
          <p
            style={{
              background: "linear-gradient(135deg, rgb(129, 23, 241) 0%, rgb(255, 0, 64) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: "16px",
              fontWeight: 900,
              letterSpacing: "0.8px",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {item.name}
          </p>
          {item.genre && (
            <p
              className="leading-tight"
              style={{
                fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.7)",
                fontWeight: 600,
                letterSpacing: "0.3px",
                marginTop: "8px",
                transition: "all 0.3s ease",
              }}
            >
              {item.genre}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function GamesMarquee() {
  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-[#120820] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-[#120820] to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex gap-4 md:gap-6 w-fit"
      >
        {/* First set of cards */}
        {gamesData.items.map((item) => (
          <div
            key={`game-1-${item.id}`}
            className="flex-shrink-0"
            style={{
              width: "280px",
              height: "320px",
            }}
          >
            <GameCard item={item} />
          </div>
        ))}

        {/* Duplicate set for seamless loop */}
        {gamesData.items.map((item) => (
          <div
            key={`game-2-${item.id}`}
            className="flex-shrink-0"
            style={{
              width: "280px",
              height: "320px",
            }}
          >
            <GameCard item={item} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
