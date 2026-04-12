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
       
      }}
    >
      {/* Background Image */}
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


      {/* Dark Overlay for better text visibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Caption Center */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.25rem",
          zIndex: 10,
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "85%",
          }}
        >
          <div
            style={{
              color: "#E8C840",
              fontSize: isFeatured ? "2rem" : "1.25rem",
              marginBottom: "0.5rem",
           
            }}
          >
            ❝
          </div>

          <p
            style={{
              color: "#fff",
              fontSize: isFeatured ? "1rem" : "0.8rem",
              lineHeight: 1.7,
              fontWeight: 500,
              margin: 0,
           
            }}
          >
            {item.caption.normalText}
            <span
              style={{
                color: "#E8C840",
                fontWeight: 700,
              }}
            >
              {item.caption.highlightText}
            </span>
          </p>

          <div
            style={{
              display: "inline-block",
              marginTop: "0.8rem",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#E8C840",
           
            }}
          >
            {item.name}
          </div>
        </div>
      </div>
    </div>
  );
}
