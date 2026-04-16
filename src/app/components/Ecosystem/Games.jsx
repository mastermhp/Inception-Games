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
        className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-900"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Game Image */}
        <img
          src={item.photo}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500"
          style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
        />

        {/* Dark overlay - only on hover */}
        <div
          className="absolute inset-0 transition-all duration-500 ease-in-out"
          style={{
            background: hovered
              ? "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 100%)"
              : "transparent",
          }}
        />

        {/* Top-right badge */}
        <div
          className="absolute top-3 right-3 text-white/80 tracking-widest"
          style={{
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "9px",
            fontWeight: 600,
          }}
        >
          ● PLAY
        </div>

        {/* Play now button - appears on hover */}
        {hovered && (
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-full text-black font-medium whitespace-nowrap select-none z-10"
            style={{
              fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: "12px",
              background: "rgba(255,255,255,0.95)",
              padding: "8px 18px",
              animation: "popIn 0.3s ease-out",
              pointerEvents: "none",
            }}
          >
            <PlayIcon size={14} />
            <span>Play now</span>
          </div>
        )}
        
        <style jsx>{`
          @keyframes popIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>

        {/* Footer: name + genre */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ padding: "8px 12px 10px" }}
        >
          <p
            className="text-white font-medium leading-tight"
            style={{
              fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: "12px",
            }}
          >
            {item.name}
          </p>
          {item.genre && (
            <p
              className="text-white/55 leading-tight mt-0.5"
              style={{
                fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: "11px",
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