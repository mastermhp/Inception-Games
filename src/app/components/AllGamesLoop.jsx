"use client";

import game1 from "../../assets/AllGames/brand-1.webp";
import game2 from "../../assets/AllGames/brand-10.webp";
import game3 from "../../assets/AllGames/brand-11.webp";
import game4 from "../../assets/AllGames/brand-2.webp";
import game5 from "../../assets/AllGames/brand-3.webp";
import game6 from "../../assets/AllGames/brand-4.webp";
import game7 from "../../assets/AllGames/brand-5.webp";
import game8 from "../../assets/AllGames/brand-7.webp";
import game9 from "../../assets/AllGames/brand-8.webp";
import game10 from "../../assets/AllGames/brand-9.webp";
import game11 from "../../assets/AllGames/brand-pubg.webp";

const games = [
  {
    src: game1?.src ?? game1,
    alt: "Dota 2",
    color: "#E2231A",
  },
  {
    src: game2?.src ?? game2,
    alt: "Street Fighter",
    color: "#FFD400",
  },
  {
    src: game3?.src ?? game3,
    alt: "Tekken",
    color: "#FF5A00",
  },
  {
    src: game4?.src ?? game4,
    alt: "Fortnite",
    color: "#00B7FF",
  },
  {
    src: game5?.src ?? game5,
    alt: "Counter Strike 2",
    color: "#F59E0B",
  },
  {
    src: game6?.src ?? game6,
    alt: "Free Fire",
    color: "#FF6B00",
  },
  {
    src: game7?.src ?? game7,
    alt: "eFootball",
    color: "#005CFF",
  },
  {
    src: game8?.src ?? game8,
    alt: "Valorant",
    color: "#FF4655",
  },
  {
    src: game9?.src ?? game9,
    alt: "EA Sports",
    color: "#00A3FF",
  },
  {
    src: game10?.src ?? game10,
    alt: "League of Legends",
    color: "#C89B3C",
  },
  {
    src: game11?.src ?? game11,
    alt: "PUBG Mobile",
    color: "#F2A900",
  },
];

export default function AllGamesLoop() {
  const loop = [...games, ...games];

  return (
    <section className="all-games-marquee">
      <div className="fade fade--left" />
      <div className="fade fade--right" />

      <div className="marquee-track">
        {loop.map((game, i) => (
          <div
            className="game-pill"
            key={i}
            style={{ "--hover-color": game.color }}
          >
            <img src={game.src} alt={game.alt} draggable={false} />
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
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .game-pill {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 200px;
          height: 80px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          backdrop-filter: blur(6px);
          transition: all 0.3s ease;
          cursor: pointer;
          padding: 14px 24px;
          position: relative;
          overflow: hidden;
        }

      .game-pill::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--hover-color);
  opacity: 0.18;          /* always visible */
  z-index: 0;
}

.game-pill {
  /* ... existing styles ... */
  border-color: var(--hover-color);               /* always on */
  box-shadow: 0 0 20px var(--hover-color);        /* always on */
}

.game-pill:hover {
  transform: translateY(-4px) scale(1.03);     
}

.game-pill img {
  position: relative;
  z-index: 2;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: brightness(0) invert(1);
  transition: transform 0.3s ease;
  user-select: none;
}

.game-pill:hover img {
  transform: scale(1.06);
}
        .game-pill img {
          position: relative;
          z-index: 2;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: brightness(0.75) grayscale(0.2);
          transition: filter 0.3s ease, transform 0.3s ease;
          user-select: none;
        }

        .game-pill:hover img {
          filter: brightness(1) grayscale(0);
          transform: scale(1.06);
        }
      `}</style>
    </section>
  );
}
