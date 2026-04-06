"use client"
import { MapPin, Clock } from "lucide-react"
import EventInterestModal from "./EventInterestModal"
import { useState } from "react"

export default function UpcomingEvents() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [eventFilter, setEventFilter] = useState("upcoming")

  const events = [
    {
      title: "NSU Startup Next X SnS",
      location: "NSU Plaza",
      time: "9 AM - 6 PM",
      date: "10-11",
      month: "NOV",
      facebookLink: process.env.NEXT_PUBLIC_EVENT_FACEBOOK_LINK,
      image: "/Event/coming-to-nsu.png",
      status: "finished",
    },
    // {
    //   title: "Gaming & Esports Summit 2025",
    //   location: "𝐈𝐃𝐄𝐁 𝐀𝐮𝐝𝐢𝐭𝐨𝐫𝐢𝐮𝐦, 𝐕𝐈𝐏 𝐑𝐨𝐚𝐝, 𝐃𝐡𝐚𝐤𝐚",
    //   time: "9 AM - 8 PM",
    //   date: "13",
    //   month: "NOV",
    //   facebookLink: "https://www.facebook.com/share/p/1GSkzoYVP7/",
    //   image: "/Event/ideb.jpg",
    //   status: "upcoming",
    // },
  ]

  const filteredEvents = events.filter((event) => event.status === eventFilter)

  const handleEventInterest = (event) => {
    setSelectedEvent(event)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedEvent(null)
  }

  const nextSlide = () => {
    setCurrentEventIndex((prev) => (prev + 1) % events.length)
  }

  const prevSlide = () => {
    setCurrentEventIndex((prev) => (prev - 1 + events.length) % events.length)
  }

  return (
    <section className="relative py-20 px-4 overflow-hidden" style={{ backgroundColor: "#0a0a14" }}>
      {/* Top-right radial gradient */}
      <div
        className="absolute -top-40 -right-80 pointer-events-none"
        style={{
          width: "483px",
          height: "608px",
          background: "radial-gradient(circle, rgba(141, 21, 222, 0.5) 0%, transparent 50%)",
          filter: "blur(200px)",
        }}
      />

      {/* Bottom-left diagonal gradient */}
      <div
        className="absolute -bottom-92 -left-40 pointer-events-none"
        style={{
          width: "348px",
          height: "498px",
          background: "linear-gradient(135deg, rgba(248, 2, 74, 0.61) 0%, rgba(54, 28, 82, 1) 100%)",
          filter: "blur(320px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <h2 className="text-2xl md:text-6xl font-bold text-white " style={{ fontFamily: "Bebas Neue, sans-serif" }}>
            Upcoming Events
          </h2>

          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              <button
                onClick={() => setEventFilter("upcoming")}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  eventFilter === "upcoming"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setEventFilter("finished")}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  eventFilter === "finished"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Finished
              </button>
            </div>

            <a
              href="#"
              className="text-white hover:text-purple-400 transition flex items-center gap-2 text-sm md:text-lg"
            >
              {/* Explore All <span className="text-2xl">›</span> */}
            </a>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, idx) => (
            <div
              key={idx}
              className="relative rounded-3xl overflow-hidden"
              style={{
                minHeight: "460px",
                border: "2px solid #7c3aed",
                background: "linear-gradient(135deg, #4a1d7e 0%, #2d1450 100%)",
              }}
            >
              {/* Background Image with Gradient Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${event.image}')`,
                }}
              />

              {/* Gradient Overlay - allows background to show through */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(74, 29, 126, 0.6) 0%, rgba(45, 20, 80, 0.3) 40%, rgba(20, 10, 35, 0.9) 100%)",
                }}
              />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6">
                {/* Top Section */}
                <div>
                  {/* Date Badge */}
                  <div className="inline-block px-4 py-2 rounded-xl mb-4" style={{ backgroundColor: "#8117ee" }}>
                    <div className="text-white font-bold text-lg text-center leading-tight">
                      {event.date}
                      <br />
                      {event.month}
                    </div>
                  </div>

                  {/* Venue */}
                  {/* <div className="text-7xl font-bold text-purple-200 mt-4">{event.location}</div> */}
                </div>

                {/* Bottom Card - Event Details */}
                <div
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: "rgba(21, 2, 43, 0.85)",
                    backdropFilter: "blur(10px)",
                    opacity: "58%",
                  }}
                >
                  {/* Event Title */}
                  <h3 className="text-2xl font-bold text-white mb-4">{event.title}</h3>

                  {/* Location & Time */}
                  <div className="flex items-center justify-between text-white mb-8">
                    <div className="flex items-center gap-2">
                      <MapPin size={20} />
                      <span className="text-base">{event.location}</span>
                    </div>
                    <div className="flex items-center w-44 gap-2">
                      <Clock size={20} />
                      <span className="text-base">{event.time}</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <a
                    href={event.facebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-36 py-2 rounded-full font-bold text-white text-center transition hover:opacity-90"
                    style={{
                      backgroundColor: "#8117ee",
                    }}
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Event Interest Modal */}
      <EventInterestModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        eventTitle={selectedEvent?.title}
        eventImage={selectedEvent?.image}
      />
    </section>
  )
}
