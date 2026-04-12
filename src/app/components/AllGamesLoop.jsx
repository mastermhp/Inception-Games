"use client"

import game1 from "../../assets/AllGames/brand-1.webp"
import game2 from "../../assets/AllGames/brand-10.webp"
import game3 from "../../assets/AllGames/brand-11.webp"
import game4 from "../../assets/AllGames/brand-2.webp"
import game5 from "../../assets/AllGames/brand-3.webp"
import game6 from "../../assets/AllGames/brand-4.webp"
import game7 from "../../assets/AllGames/brand-5.webp"
import game8 from "../../assets/AllGames/brand-7.webp"
import game9 from "../../assets/AllGames/brand-8.webp"
import game10 from "../../assets/AllGames/brand-9.webp"
import game11 from "../../assets/AllGames/brand-pubg.webp"

const games = [
  { src: game1?.src  ?? game1,  alt: "Brand 1" },
  { src: game2?.src  ?? game2,  alt: "Brand 10" },
  { src: game3?.src  ?? game3,  alt: "Brand 11" },
  { src: game4?.src  ?? game4,  alt: "Brand 2" },
  { src: game5?.src  ?? game5,  alt: "Brand 3" },
  { src: game6?.src  ?? game6,  alt: "Brand 4" },
  { src: game7?.src  ?? game7,  alt: "Brand 5" },
  { src: game8?.src  ?? game8,  alt: "Brand 7" },
  { src: game9?.src  ?? game9,  alt: "Brand 8" },
  { src: game10?.src ?? game10, alt: "Brand 9" },
  { src: game11?.src ?? game11, alt: "PUBG" },
]

export default function AllGamesLoop() {
  // Duplicate for seamless infinite loop
  const loop = [...games, ...games]

  return (
    <section className="all-games-marquee">
      {/* Left fade */}
      <div className="fade fade--left" />
      {/* Right fade */}
      <div className="fade fade--right" />

      <div className="marquee-track">
        {loop.map((game, i) => (
          <div className="game-pill" key={i}>
            <img
              src={game.src}
              alt={game.alt}
              draggable={false}
            />
          </div>
        ))}
      </div>

      <style>{`
        .all-games-marquee {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: linear-gradient(90deg, #0a0a14 0%, #0f0f1a 100%);
          padding: 18px 0;
        }

        /* Fade overlays */
        .fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 120px;
          z-index: 10;
          pointer-events: none;
        }
        .fade--left {
          left: 0;
          background: linear-gradient(to right, #12082a, transparent);
        }
        .fade--right {
          right: 0;
          background: linear-gradient(to left, #12082a, transparent);
        }

        /* Scrolling track */
        .marquee-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: marquee-scroll 32s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Individual pill card — matches the rounded dark cards in the image */
        .game-pill {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 200px;
          height: 80px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
          backdrop-filter: blur(6px);
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
          cursor: pointer;
          padding: 14px 24px;
        }

        .game-pill:hover {
          background: rgba(255, 255, 255, 0.09);
          border-color: rgba(160, 100, 255, 0.35);
          transform: translateY(-2px);
        }

        .game-pill img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: brightness(0.75) grayscale(0.2);
          transition: filter 0.25s ease;
          user-select: none;
        }

        .game-pill:hover img {
          filter: brightness(1) grayscale(0);
        }
      `}</style>
    </section>
  )
}