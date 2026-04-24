"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Swords,
  Briefcase,
  Bell,
  Sparkles,
  Lock,
  Users,
} from "lucide-react";

// ─── Scrim Games ──────────────────────────────────────────────────────────────
const SCRIM_GAMES = [
  { id: 1, name: "PUBG Mobile", slots: 60, tag: "MOBILE" },
  { id: 2, name: "Free Fire", slots: 80, tag: "MOBILE" },
  { id: 3, name: "eFootball Mobile", slots: 64, tag: "MOBILE" },
  { id: 4, name: "eFootball Console/PC", slots: 64, tag: "PC" },
  { id: 5, name: "EA FC 26", slots: 128, tag: "PC" },
  { id: 6, name: "Street Fighter 6", slots: 64, tag: "PC" },
];

// ─── Coming Soon Panel ────────────────────────────────────────────────────────
function ComingSoonPanel({ label }) {
  return (
    <motion.div
      key="coming-soon"
      className="flex flex-col items-center justify-center py-24 px-6"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 w-32 h-32 bg-purple-600/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative w-28 h-28 rounded-full border border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-pink-500/10 flex items-center justify-center">
          <Lock size={38} className="text-purple-400" />
        </div>
      </div>

      <div className="px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm font-semibold mb-5 flex items-center gap-2">
        <Sparkles size={14} />
        Starts 1st May
      </div>

      <h2 className="text-4xl font-extrabold text-white text-center mb-3">
        {label}{" "}
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Coming Soon
        </span>
      </h2>

      <p className="text-gray-400 max-w-md text-center leading-relaxed mb-8">
        We're preparing exciting {label.toLowerCase()} opportunities for our
        community. Stay tuned for launch day.
      </p>

      <div className="px-6 py-3 rounded-xl border border-purple-500/30 bg-purple-600/10 text-purple-300 flex items-center gap-2 font-medium">
        <Bell size={16} />
        Stay Tuned — Big things incoming!
      </div>
    </motion.div>
  );
}

// ─── Scrims Panel ─────────────────────────────────────────────────────────────
function ScrimsPanel() {
  return (
    <motion.div
      key="scrims"
      className="py-10"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-semibold mb-4">
          <Swords size={14} />
          Scrim Schedule
        </div>

        <h2 className="text-4xl font-extrabold text-white mb-3">
          Available{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Scrim Games
          </span>
        </h2>

        <p className="text-gray-400 max-w-xl mx-auto">
          Register your team and secure your slot before they fill up.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {SCRIM_GAMES.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -5 }}
            className="rounded-2xl overflow-hidden border border-white/10 bg-[#111115] group"
          >
            <div className="p-6 pb-2">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-white font-bold text-xl">{game.name}</h3>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400 uppercase">
                  {game.tag}
                </span>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="flex items-center justify-between text-sm mb-2 mt-4">
                <span className="text-gray-400 flex items-center gap-2">
                  <Users size={15} />
                  Slots
                </span>
                <span className="text-cyan-400 font-semibold">{game.slots}</span>
              </div>

              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  style={{ width: "75%" }}
                />
              </div>

              <button className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition">
                Register Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EventsSection() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All", icon: Trophy },
    { id: "scrims", label: "Scrims", icon: Swords },
    { id: "tournament", label: "Tournament", icon: Trophy },
    { id: "brand", label: "Brand Deal", icon: Briefcase },
  ];

  const renderContent = () => {
    if (activeTab === "all") return <ScrimsPanel />;
    if (activeTab === "scrims") return <ScrimsPanel />;
    if (activeTab === "tournament")
      return <ComingSoonPanel label="Tournament" />;
    if (activeTab === "brand")
      return <ComingSoonPanel label="Brand Deals" />;
  };

  return (
    <section className="min-h-screen bg-[#0b0b0f] px-4 md:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white mb-3">
            Events{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Hub
            </span>
          </h1>
          <p className="text-gray-400">
            Explore scrims, tournaments and partnership opportunities.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-xl border transition flex items-center gap-2 font-semibold ${
                  active
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-purple-500"
                    : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </div>
    </section>
  );
}