"use client"

export default function TrustedBrands() {
  const brands = [
    { name: "Bangladesh Hi-Tech Park Authority", logo: "/brands/bangladesh-hitech.png" },
    { name: "IDEB", logo: "/brands/ideb.png" },
    { name: "The World Bank", logo: "/brands/world-bank.png" },
    { name: "ICT Division", logo: "/brands/ict-division.png" },
    { name: "Accelerating Bangladesh", logo: "/brands/accelerating-bangladesh.png" },
  ]

  return (
    <section className="py-16 overflow-hidden bg-gradient-to-b from-[#0a0a14] to-[#1a0a2e]">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-2">SUPPORTED BY </h2>
        <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
      </div>

      <div className="relative">
        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#1a0a2e] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#1a0a2e] to-transparent z-10"></div>

        {/* Infinite scrolling container */}
        <div className="flex animate-infinite-scroll">
          {/* First set of logos */}
          {brands.map((brand, index) => (
            <div
              key={`brand-1-${index}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
              style={{ width: "300px", height: "120px" }}
            >
              <img
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                className="max-w-full max-h-full object-contain filter brightness-90 hover:brightness-110 transition-all duration-300"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {brands.map((brand, index) => (
            <div
              key={`brand-2-${index}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
              style={{ width: "300px", height: "120px" }}
            >
              <img
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                className="max-w-full max-h-full object-contain filter brightness-90 hover:brightness-110 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes infinite-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-infinite-scroll {
          animation: infinite-scroll 30s linear infinite;
        }

        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
