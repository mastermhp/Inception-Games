"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Swords, Briefcase, Bell, Lock } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Scrims Panel
// ─────────────────────────────────────────────────────────────
function ScrimsPanel() {
  const scrims = [
    { game: "PUBGM", slots: 60 },
    { game: "Freefire", slots: 80 },
    { game: "Efootball Mobile", slots: 64 },
    { game: "Efootball Console PC", slots: 64 },
    { game: "EA FC 26", slots: 128 },
    { game: "Street Fighter", slots: 64 },
  ];

  return (
    <motion.div
      key="scrims"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-4 sm:py-6"
    >
      {/* Title */}
      <div className="text-center mb-4 sm:mb-6 px-2">
        <h2 className="text-xl sm:text-3xl font-black text-white mb-1">
          Scrim{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Slots
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-gray-400">
          Available slots for upcoming scrims
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-2xl mx-auto grid gap-2 sm:gap-3">
        {scrims.map((scrim, i) => (
          <motion.div
            key={scrim.game}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.015 }}
            className="flex flex-row items-center justify-between px-3 sm:px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <span className="text-sm sm:text-base font-semibold text-white">
              {scrim.game}
            </span>

            <span className="text-cyan-400 font-bold text-xs sm:text-base">
              {scrim.slots} Slots
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Coming Soon Panel
// ─────────────────────────────────────────────────────────────
function ComingSoonPanel({ label }) {
  return (
    <motion.div
      key="coming-soon"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center"
    >
      {/* Icon */}
      <div className="relative mb-4">
        <div className="absolute inset-0 w-20 h-20 bg-purple-600/20 blur-2xl rounded-full animate-pulse" />

        <div className="relative w-16 h-16 rounded-full border border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-pink-500/10 flex items-center justify-center">
          <Lock size={24} className="text-purple-400" />
        </div>
      </div>

      {/* Badge */}
      <div className="px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[10px] sm:text-xs font-semibold mb-3">
        Starts 1st May
      </div>

      {/* Title */}
      <h2 className="text-xl sm:text-3xl font-black text-white mb-2">
        {label}{" "}
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Coming Soon
        </span>
      </h2>

      {/* Note */}
      <div className="px-3 py-2 rounded-lg border border-purple-500/30 bg-purple-600/10 text-purple-300 flex items-center gap-2 text-xs sm:text-sm font-medium">
        <Bell size={14} />
        Stay Tuned — Big things incoming!
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
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
    <section className="bg-[#0b0b0f] px-3 sm:px-6 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 px-2">
          <h1 className="text-2xl sm:text-4xl font-black text-white mb-2">
            Events{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Hub
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
            Explore scrims, tournaments and partnership opportunities.
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 justify-center mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg border transition flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold ${
                  active
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500"
                    : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                }`}
              >
                <Icon size={14} />
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