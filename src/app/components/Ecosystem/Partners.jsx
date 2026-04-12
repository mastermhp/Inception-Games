

// data
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

// card component
export function PartnerCard({ item, isFeatured = false }) {
  return (
    <div
      className={`relative h-full rounded-3xl overflow-hidden ${
        isFeatured ? "shadow-2xl shadow-purple-500/20" : ""
      }`}
    >
      {/* Full-bleed background photo */}
      <img
        src={item.photo}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* Dark gradient — heavy at bottom, fades at top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

      {/* Caption block pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-3 md:px-6 md:pb-7">
        {/* Yellow opening quote mark */}
        <div
          className="text-3xl md:text-4xl font-serif leading-none mb-1 select-none"
          style={{ color: "#E8C840" }}
        >
          ❝❝
        </div>

        <p className="text-white text-xs sm:text-sm md:text-base leading-snug font-medium drop-shadow-md">
          {item.caption.normalText}
          <span className="font-bold" style={{ color: "#E8C840" }}>
            {item.caption.highlightText}
          </span>
        </p>
      </div>
    </div>
  );
}