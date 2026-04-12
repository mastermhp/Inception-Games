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
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "1.5rem",
        overflow: "hidden",
        boxShadow: isFeatured ? "0 25px 50px rgba(168,85,247,0.2)" : "none",
      }}
    >
      <img
        src={item.photo}
        alt={item.name}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.45)",
        }}
      />

      {/* Caption — dead center */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.25rem",
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "1rem",
            padding: isFeatured ? "1.5rem 2rem" : "0.75rem 1rem",
            textAlign: "center",
            maxWidth: "90%",
          }}
        >
          <div style={{ color: "#E8C840", fontSize: isFeatured ? "2rem" : "1.25rem", lineHeight: 1, marginBottom: "0.5rem", fontFamily: "serif" }}>
            ❝
          </div>
          <p style={{ color: "#fff", fontSize: isFeatured ? "0.9rem" : "0.7rem", lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
            {item.caption.normalText}
            <span style={{ fontWeight: 700, color: "#E8C840" }}>
              {item.caption.highlightText}
            </span>
          </p>
          <div
            style={{
              display: "inline-block",
              marginTop: "0.6rem",
              padding: "0.2rem 0.75rem",
              borderRadius: "9999px",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "rgba(232,200,64,0.15)",
              color: "#E8C840",
              border: "1px solid rgba(232,200,64,0.3)",
            }}
          >
            {item.name}
          </div>
        </div>
      </div>
    </div>
  );
}