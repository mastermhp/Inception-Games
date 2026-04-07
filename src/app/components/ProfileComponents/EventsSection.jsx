"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Swords,
  Briefcase,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Monitor,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Flag,
  Bell,
  Heart,
  Share2,
  ExternalLink,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { API } from "@/lib/api";

// Games data (for mapping game names to images)
const games = [
  { id: "apex", name: "Apex Legends", image: "/games/apex.png" },
  {
    id: "cod-bo7",
    name: "Call of Duty: Black Ops 7",
    image: "/games/codm.png",
  },
  {
    id: "cod-warzone",
    name: "Call of Duty: Warzone",
    image: "/games/codm.png",
  },
  { id: "chess", name: "Chess", image: "/games/chess.png" },
  { id: "cs2", name: "Counter-Strike 2", image: "/games/csgo.png" },
  { id: "crossfire", name: "Crossfire", image: "/games/cf.jpeg" },
  { id: "dota2", name: "Dota 2", image: "/games/dota2.png" },
  { id: "fc26-pc", name: "FC26 - PC", image: "/games/fifapc.png" },
  {
    id: "fc26-consoles",
    name: "FC26 - Consoles",
    image: "/games/fcconsole.png",
  },
  { id: "fc26-mobile", name: "FC26 - Mobile", image: "/games/fcmobile.png" },
  {
    id: "efootball-pc",
    name: "eFootball - PC",
    image: "/games/efootballpc.png",
  },
  {
    id: "efootball-consoles",
    name: "eFootball - Consoles",
    image: "/games/efootballconsole.png",
  },
  {
    id: "efootball-mobile",
    name: "eFootball - Mobile",
    image: "/games/efootballmobile.png",
  },
  {
    id: "fatal-fury",
    name: "Fatal Fury: City of the Wolves",
    image: "/games/ff.jpeg",
  },
  { id: "freefire", name: "Free Fire", image: "/games/freefire.png" },
  { id: "hok", name: "Honor of Kings", image: "/games/hk.jpeg" },
  { id: "lol", name: "League of Legends", image: "/games/lol.png" },
  { id: "mlbb", name: "Mobile Legends: Bang Bang", image: "/games/mlbb.png" },
  { id: "overwatch2", name: "Overwatch 2", image: "/games/overwatch.png" },
  { id: "pubg", name: "PUBG / PUBG: Battlegrounds", image: "/games/pubg.png" },
  { id: "pubg-mobile", name: "PUBG Mobile", image: "/games/pubg.png" },
  { id: "r6x", name: "Rainbow Six Siege X", image: "/games/r6.jpeg" },
  { id: "sf6", name: "Street Fighter 6", image: "/games/sf6.png" },
  { id: "tft", name: "Teamfight Tactics", image: "/games/tt.jpeg" },
  { id: "valorant", name: "VALORANT", image: "/games/valorant.png" },
  {
    id: "valorant-mobile",
    name: "VALORANT Mobile",
    image: "/games/valorant.png",
  },
  { id: "coc", name: "Clash of Clans", image: "/games/coc.png" },
  { id: "tekken8", name: "Tekken 8", image: "/games/tekken.jpeg" },
  { id: "mk11", name: "Mortal Kombat 11", image: "/games/mk11.png" },
  { id: "brawlstars", name: "Brawl Stars", image: "/games/brawlstars.png" },
];

// Helper to get game image from title or game name
function getGameImage(eventTitle, gameName) {
  // Try to find a matching game from the games list
  const searchTerm = (gameName || eventTitle || "").toLowerCase();
  const matchedGame = games.find(
    (g) =>
      searchTerm.includes(g.name.toLowerCase()) ||
      g.name.toLowerCase().includes(searchTerm.split(" ")[0]),
  );
  return matchedGame?.image || "/games/pubg.png"; // Default fallback
}

// Helper to determine event type from title
function getEventType(title, organizer) {
  const lowerTitle = (title || "").toLowerCase();
  const lowerOrg = (organizer || "").toLowerCase();

  if (
    lowerTitle.includes("brand") ||
    lowerTitle.includes("deal") ||
    lowerTitle.includes("sponsor")
  ) {
    return "Brand Deal";
  }
  if (lowerTitle.includes("scrim")) {
    return "Scrims";
  }
  return "Tournament";
}

function formatDate(dateStr) {
  if (!dateStr) return "TBD";
  const date = new Date(dateStr);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${days[date.getDay()]} ${date.getDate()}${getOrdinalSuffix(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function getStatusColor(status) {
  const lowerStatus = (status || "").toLowerCase();
  if (lowerStatus === "upcoming")
    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  if (lowerStatus === "ongoing")
    return "text-blue-400 bg-blue-500/10 border-blue-500/30";
  if (lowerStatus === "completed" || lowerStatus === "cancelled")
    return "text-red-400 bg-red-500/10 border-red-500/30";
  return "text-gray-400 bg-gray-500/10 border-gray-500/30";
}

function getStatusText(status) {
  const lowerStatus = (status || "").toLowerCase();
  if (lowerStatus === "upcoming") return "Registration Open";
  if (lowerStatus === "ongoing") return "In Progress";
  if (lowerStatus === "completed") return "Event Ended";
  if (lowerStatus === "cancelled") return "Cancelled";
  return status || "Unknown";
}

// Event Card Component
function EventCard({ event, onClick }) {
  const [expanded, setExpanded] = useState(false);
  const eventType =
    event.eventType || getEventType(event.title, event.organizer);
  // Use banner_image from API if available, otherwise fall back to game image
  const gameImage =
    event.banner_image ||
    event.game?.image ||
    getGameImage(event.title, event.game_name);
  const gameName = event.game?.name || event.game_name || "Gaming Event";

  // Calculate slots percentage if available
  const slotsPercentage =
    event.totalSlots > 0 ? (event.filledSlots / event.totalSlots) * 100 : 50;

  return (
    <motion.div
      className="bg-[#111115] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all duration-300"
      whileHover={{ y: -4 }}
      layout
    >
      {/* Banner - Game Image */}
      <div
        className="relative h-48 cursor-pointer overflow-hidden"
        onClick={() => onClick(event)}
      >
        <Image src={gameImage} alt={gameName} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Game Logo Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg">
              <Calendar size={14} className="text-amber-400" />
              <span className="text-white text-sm font-medium">
                {event.start_date
                  ? new Date(event.start_date)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .toUpperCase()
                  : "TBD"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Game + Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
              <Image
                src={gameImage}
                alt={gameName}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white text-sm font-medium truncate max-w-[120px]">
              {gameName.length > 15
                ? gameName.split(":")[0].split(" ").slice(0, 2).join(" ")
                : gameName}
            </span>
          </div>
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded border capitalize ${getStatusColor(event.status)}`}
          >
            {event.status || "Upcoming"}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-white font-bold text-lg mb-2 cursor-pointer hover:text-purple-400 transition-colors line-clamp-2"
          onClick={() => onClick(event)}
        >
          {event.title}
        </h3>

        {/* Date & Status */}
        <div className="flex items-center gap-2 text-sm mb-3">
          <Calendar size={14} className="text-red-400" />
          <span className="text-red-400 font-medium">
            {formatDate(event.start_date)}
          </span>
          <span className="text-gray-500">·</span>
          <span className="text-red-400">{getStatusText(event.status)}</span>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Flag size={12} />
            <span>{event.venue || event.location || "Online"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Monitor size={12} />
            <span>{event.platform || "All Platforms"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{event.teamType || "Open"}</span>
          </div>
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {/* Slots Progress */}
              {event.totalSlots > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Slots</span>
                    <div className="flex items-center gap-1">
                      <Users size={12} />
                      <span>
                        {event.status === "completed"
                          ? "Slots Closed"
                          : `${event.filledSlots || 0}/${event.totalSlots}`}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${slotsPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Prize Pool */}
              {event.prizePool > 0 && (
                <div className="flex items-center gap-2 text-sm mb-3">
                  <DollarSign size={14} className="text-amber-400" />
                  <span className="text-white font-semibold">
                    {event.currency || "BDT"} {event.prizePool.toLocaleString()}{" "}
                    PrizePool
                  </span>
                </div>
              )}

              {/* Description */}
              {event.description && (
                <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                  {event.description}
                </p>
              )}

              {/* Event Type Tag */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs font-medium text-gray-300 bg-gray-800 rounded-full border border-gray-700">
                  {eventType}
                </span>
                {event.organizer && (
                  <span className="px-3 py-1 text-xs font-medium text-purple-300 bg-purple-800/30 rounded-full border border-purple-700/30">
                    {event.organizer}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show More/Less */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-purple-400 text-sm font-medium mt-3 hover:text-purple-300 transition-colors ml-auto"
        >
          {expanded ? "Show Less" : "Show More"}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
    </motion.div>
  );
}

// Main Events Section Component
export default function EventsSection({ user }) {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API.EVENTS_GET_ALL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (res.ok) {
        // Handle both API response formats
        const eventsData = data.tournaments || data.data || [];

        // Transform API events to our format
        const transformedEvents = eventsData.map((event, index) => {
          return {
            id: event.id,
            title: event.title,
            eventType: getEventType(event.title, event.hosted_by),
            game: {
              name: event.game || event.title?.split(" ")[0] || "Gaming",
              image: getGameImage(event.title, event.game),
            },
            game_name: event.game,
            status: event.status,
            start_date: event.event_date || event.tournament_start_at,
            event_date: event.event_date || event.tournament_start_at,
            end_date: event.tournament_end_at,
            location: event.region,
            venue: event.region,
            platform: event.platform || "All Platforms",
            teamType: event.game_mode || "Open",
            prizePool: parseFloat(event.prize_pool) || 0,
            prize_pool: parseFloat(event.prize_pool) || 0,
            currency: event.currency || "BDT",
            totalSlots: event.max_slots || 64,
            total_slots: event.max_slots || 64,
            filledSlots: event.filled_slots || 0,
            filled_slots: event.filled_slots || 0,
            registrationStart: event.reg_start_at,
            registration_start: event.reg_start_at,
            registrationEnd: event.reg_end_at,
            registration_end: event.reg_end_at,
            tournamentStart: event.tournament_start_at,
            tournamentEnd: event.tournament_end_at,
            host: event.hosted_by || "Inception Games",
            organizer: event.hosted_by || "Inception Games",
            banner_image: event.banner_image,
          };
        });
        setEvents(transformedEvents);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("[v0] Failed to fetch events:", err);
      setError("Failed to load events. Please try again.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Calculate filter counts
  const filterCounts = {
    all: events.length,
    Tournament: events.filter((e) => e.eventType === "Tournament").length,
    Scrims: events.filter((e) => e.eventType === "Scrims").length,
    "Brand Deal": events.filter((e) => e.eventType === "Brand Deal").length,
  };

  const FILTER_TABS = [
    { id: "all", label: "All", count: filterCounts.all },
    {
      id: "Tournament",
      label: "Tournaments",
      count: filterCounts.Tournament,
      icon: Trophy,
    },
    { id: "Scrims", label: "Scrims", count: filterCounts.Scrims, icon: Swords },
    {
      id: "Brand Deal",
      label: "Brand Deals",
      count: filterCounts["Brand Deal"],
      icon: Briefcase,
    },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesFilter =
      activeFilter === "all" || event.eventType === activeFilter;
    const matchesSearch =
      (event.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.game?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (event.organizer || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleEventClick = (event) => {
    // Navigate to event detail page with actual event ID
    router.push(`/profile/events/${event.id}`);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="overflow-x-auto">
          <div className="flex items-center gap-1 bg-[#111115] p-1 rounded-xl border border-white/[0.06] min-w-max">
          {FILTER_TABS.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeFilter === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {IconComponent && <IconComponent size={14} />}
                {tab.label}
                <span className={`text-xs ${activeFilter === tab.id ? 'text-purple-200' : 'text-gray-500'}`}>
                  ({tab.count})
                </span>
              </button>
            )
          })}
          </div>
        </div>

        {/* <div className="flex items-center gap-1 bg-[#111115] p-1 rounded-xl border border-white/[0.06]">
          {FILTER_TABS.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeFilter === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {IconComponent && <IconComponent size={14} />}
                {tab.label}
                <span className={`text-xs ${activeFilter === tab.id ? 'text-purple-200' : 'text-gray-500'}`}>
                  ({tab.count})
                </span>
              </button>
            )
          })}
        </div> */}

        {/* Search + Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#111115] border border-white/[0.06] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="p-2.5 bg-[#111115] border border-white/[0.06] rounded-xl text-gray-400 hover:text-white hover:border-white/[0.12] transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="text-purple-500 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <ExternalLink size={24} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Failed to load events
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchEvents}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Events Grid */}
      {!loading && !error && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <EventCard event={event} onClick={handleEventClick} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredEvents.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <Search size={24} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
          <p className="text-gray-500">
            {events.length === 0
              ? "No events are available at the moment. Check back later!"
              : "Try adjusting your filters or search query"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

/*Firstly, i have attached my whole sys[pasted 2872 lines]tem with the live api integrated for user signup through the tournamentCarousel but the issue is i am setting the personal info and gaming info during signup through the api but after successfull signup i'm not getting the data in the profile page to the profile components and also in the edit profile i'm not getting them fetching there to eid them also all are showing blank and after registration successfull user should redirect to profile page /profile directly he can't show home page anymore i also attached the user-signup&login&edit-profile.txt file so that you understand better about the api and endpoints

i have attached the events$signups.txt for the profile page events section you can see there have static tournaments,scrims and brand deals now they all will be in real time using api also the filters for tournament or scrims or brand deal and also for tournament, scrims or brand deal signup all are in the api you have to do them perfectly integrated and signup successfully

i have attached the /profile endpoints in the screenshot so that you can work properly by reading them and don't change the design as it is if need some updates do that but don't change the design and this is the api base url https://inception-games.an.r.appspot.com/api/v1*/
