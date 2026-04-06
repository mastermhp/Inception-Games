"use client"

import { FaFacebookF, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa"

export default function LatestNews() {
  const newsList = [
    {
      title: "গেম খেলা হতে পারে কারো পেশা",
      description:
        "গেম তৈরি ও বাজারজাত করে দেশের অর্থনীতিতেও বড় অবদান রাখতে পারে গেম নির্মাতা প্রতিষ্ঠান। পেশাদার গেমারদের জন্য প্ল্যাটফর্ম তৈরি ও গেম তৈরির কাজ করছেন কাজী হাসিব ও তাঁর দল। তাঁদের দুই প্রতিষ্ঠানের সম্পর্কে লিখেছেন আশিক উল বারাত... ",
      image: "/News/bignews.jpg",
      readMore: true,
    },
  ]

  const smallNews = [

    {
      title: "Mousepad Giveaway tonight guys. Don't miss the chance. ",
      image: "/News/mouse-pad.jpg",
      category: "E-sports",
      time: "March 25",
      link: `https://www.facebook.com/share/p/${process.env.NEXT_PUBLIC_FACEBOOK_POST_1}`,
    },
    {
      title: "5 Jerseys Giveaway is ON GKEC 🎉",
      image: "/News/jersey.jpg",
      category: "E-sports",
      time: "March 30",
      link: `https://www.facebook.com/share/p/${process.env.NEXT_PUBLIC_FACEBOOK_POST_2}`,
    },
    {
      title: "GPU Winner - AL MOHAIMIN FARABI",
      image: "/News/gpu-winner.jpg",
      category: "E-sports",
      time: "March 16",
      link: `https://www.facebook.com/share/p/${process.env.NEXT_PUBLIC_FACEBOOK_POST_3}`,
    },
    {
      title: "Gaming Mouse Winner - ANTOR HASAN",
      image: "/News/mouse-winner.jpg",
      category: "E-sports",
      time: "March 16",
      link: `https://www.facebook.com/share/p/${process.env.NEXT_PUBLIC_FACEBOOK_POST_4}`,
    },
    {
      title: "Slice N Share at Startup Showcase Event - Connecting with aspiring entrepreneurs and gamers",
      image: "/News/showcase.jpg",
      category: "E-sports",
      time: "November 14",
      link: `https://www.facebook.com/share/p/${process.env.NEXT_PUBLIC_FACEBOOK_POST_5}`,
    },
    {
      title: "YUNet Bangladesh Gaming & Esports Summit 2025 - Sign Up going on. Follow YUNet Esport Arena",
      image: "/News/summit.jpg",
      category: "E-sports",
      time: "December 7",
      link: `https://www.facebook.com/share/p/${process.env.NEXT_PUBLIC_FACEBOOK_POST_6}`,
    },
    {
      title: "Digital Entrepreneurship and Innovation Ecosystem Development (DEIED) Project Office has organized a Dialogue Session to introduce the Startup and Scaleup Program (Accelerating Bangladesh) and the University Innovation Hub Program to senior public-sector leadership. ",
      image: "/News/news3.jpg",
      category: "E-sports",
      time: "December 10",
      link: `https://www.facebook.com/share/p/${process.env.NEXT_PUBLIC_FACEBOOK_POST_7}`,
    },
    {
      title: "Dedicating to my Core Teammates & gamers ❤️. Tournament sign up going on at our website. Don't forget to sign up. Slice N Share at Airtel Buzz Presents Bangladesh Gaming & Esports Summit 2025 ",
      image: "/News/news4.jpg",
      category: "E-sports",
      time: "December 10",
      link: `https://www.facebook.com/share/p/${process.env.NEXT_PUBLIC_FACEBOOK_POST_8}`,
    },
  ]

  const shareUrl = `https://www.facebook.com/share/p/${process.env.NEXT_PUBLIC_FEATURED_FACEBOOK_POST}?mibextid=wwXIfr`
  const shareTitle = "Slice N Share Championship - 15 Lakh BDT Prize Pool!"

  const handleShare = (platform) => {
    const url = encodeURIComponent(shareUrl)
    const text = encodeURIComponent(shareTitle)

    const shareLinks = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    }

    window.open(shareLinks[platform], "_blank", "width=600,height=400")
  }

  return (
    <section id="news" className="py-20 px-4" style={{ backgroundColor: "#0a0a14" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start md:items-center justify-between mb-12">
          <h2
            className="text-2xl md:text-6xl font-bold text-white mb-4 md:mb-0"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            Latest News
          </h2>
          <a
            href="#"
            className="text-white hover:text-purple-400 transition flex items-center gap-2 text-sm md:text-lg"
          >
            {/* Explore All <span>›</span> */}
          </a>
        </div>

        <div className="rounded-3xl p-[3px] bg-gradient-to-br from-[#A076CC] to-[#40057C] mb-12">
          <div
            className="relative rounded-3xl overflow-hidden min-h-[400px] md:min-h-[600px] flex items-end"
            style={{
              backgroundImage: `url('${newsList[0].image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              backgroundRepeat: "no-repeat",
              backgroundColor: "#0a0a14",
            }}
          >
            {/* 70% gradient overlay from bottom - dark to transparent */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, 
                  rgba(0, 0, 0, 0.95) 0%, 
                  rgba(0, 0, 0, 0.85) 25%, 
                  rgba(0, 0, 0, 0.6) 50%, 
                  rgba(0, 0, 0, 0.2) 70%, 
                  transparent 100%)`,
              }}
            />

            {/* Text content on top of overlay */}
            <div className="relative z-10 p-4 md:p-12 max-w-3xl">
              <h3 className="text-lg md:text-4xl font-bold text-white mb-3 md:mb-4">{newsList[0].title}</h3>
              <p className="text-gray-200 text-sm md:text-lg mb-2 md:mb-6 leading-relaxed line-clamp-3 md:line-clamp-none">
                {newsList[0].description}
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <a
                  href="https://www.facebook.com/share/p/16yMhZvtR9/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-3 md:px-8 py-1 md:py-3 rounded-full font-bold text-sm text-white transition hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #8117EE 0%, #A076CC 100%)",
                  }}
                >
                  Read More
                </a>

                {/* Social Share Icons */}
                <div className="flex items-center gap-3">
                  {/* <span className="text-gray-400 text-xs md:text-sm hidden md:block">Share:</span> */}
                  <button
                    onClick={() => handleShare("facebook")}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-[#1877F2] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Share on Facebook"
                  >
                    <FaFacebookF className="text-white text-sm md:text-base" />
                  </button>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-[#1DA1F2] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Share on Twitter"
                  >
                    <FaTwitter className="text-white text-sm md:text-base" />
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-[#0A66C2] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Share on LinkedIn"
                  >
                    <FaLinkedin className="text-white text-sm md:text-base" />
                  </button>
                  <button
                    onClick={() => handleShare("whatsapp")}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-[#25D366] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Share on WhatsApp"
                  >
                    <FaWhatsapp className="text-white text-sm md:text-base" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {smallNews.map((news, idx) => (
            <a
              key={idx}
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl overflow-hidden group cursor-pointer transform transition duration-300 hover:scale-[1.02]"
              style={{
                border: "2px solid transparent",
                backgroundImage: "linear-gradient(#0a0a14, #0a0a14), linear-gradient(135deg, #A076CC 0%, #40057C 100%)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
            >
              {/* Card Image with gradient overlay from bottom */}
              <div
                className="relative h-64 overflow-hidden"
                style={{
                  backgroundImage: `url('${news.image}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Gradient overlay from bottom */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, 
                      rgba(0, 0, 0, 0.9) 0%, 
                      rgba(0, 0, 0, 0.7) 40%, 
                      rgba(0, 0, 0, 0.3) 70%, 
                      transparent 100%)`,
                  }}
                />

                {/* Category badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-300 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                    {news.category}
                  </span>
                  <span className="text-xs text-gray-400">• {news.time}</span>
                </div>

                {/* Title at bottom on top of gradient */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <h4 className="text-sm md:text-base font-bold text-white line-clamp-3 group-hover:text-purple-300 transition">
                    {news.title}
                  </h4>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
