export const partnersData = {
  title: "Our Partners",
  subtitle: "Trusted collaborations that power our ecosystem",
  items: [
    {
      id: 1,
      name: "Ifarmer",
      photo: "/Ecosystem/Partners/ifarmer2.jpeg",
      link: "#",
      caption: {
        normalText: "31,000+ Active Users powering ",
        highlightText:
          '"ভাগ্যের ছক্কা" Ludo Arcade — in collaboration with iFarmer & Folon.',
      },
    },
    {
      id: 2,
      name: "Mime",
      photo: "/Ecosystem/Partners/mime2.png",
      link: "#",
      caption: {
        normalText: "Mime is our official Internet Sponsor — ",
        highlightText:
          "powering seamless connectivity for every gamer in the ecosystem.",
      },
    },
    {
      id: 3,
      name: "Moar",
      photo: "/Ecosystem/Partners/moar2.png",
      link: "#",
      caption: {
        normalText: "Moar fuels the competitive spirit — ",
        highlightText:
          "official tournament sponsor empowering the gaming community.",
      },
    },
  ],
};

export function PartnerCard({ item, isFeatured = false }) {
  return (
    <div
      className={`relative h-full rounded-3xl overflow-hidden ${
        isFeatured ? "shadow-2xl shadow-purple-500/20" : ""
      }`}
      style={{
        backgroundImage: `url('${item.photo}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark vignette — darkens center slightly, heavy at top & bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Caption block — centered vertically & horizontally */}
      <div className="absolute inset-0 flex items-center justify-center px-5 md:px-8">
        <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 md:px-7 md:py-6 text-center max-w-[90%]">
          {/* Yellow quote mark */}
          <div
            className="text-2xl md:text-3xl font-serif leading-none mb-2 select-none"
            style={{ color: "#E8C840" }}
          >
            ❝
          </div>

          <p className="text-white text-xs sm:text-sm md:text-base leading-relaxed font-medium drop-shadow-md">
            {item.caption.normalText}
            <span className="font-bold" style={{ color: "#E8C840" }}>
              {item.caption.highlightText}
            </span>
          </p>

          {/* Partner name pill */}
          <div
            className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
            style={{
              background: "rgba(232, 200, 64, 0.15)",
              color: "#E8C840",
              border: "1px solid rgba(232, 200, 64, 0.3)",
            }}
          >
            {item.name}
          </div>
        </div>
      </div>
    </div>
  );
}