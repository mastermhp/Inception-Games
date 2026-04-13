import Image from "next/image";

export const partnersData = {
  title: "Our Partners",
  subtitle: "Trusted collaborations that power our ecosystem",
  items: [
    {
      id: 1,
      name: "Ifarmer",
      photo: "/Ecosystem/Partners/ifarmer2.jpeg",
      link: "https://www.ifarmer.asia",
      imageStyle: {
        objectFit: "contain",
        // scale: 0.9,
      },
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
      link: "https://www.mimebd.com",
      imageStyle: {
        objectFit: "contain",
        // scale: 0.8,
      },
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
      link: "https://moarbd.com",
      imageStyle: {
        objectFit: "contain",
        // scale: 0.85,
      },
      caption: {
        normalText: "Moar fuels the competitive spirit — ",
        highlightText:
          "They are our social media ads partner. We made game engine based ads for them.",
      },
    },
  ],
};



export function PartnerCard({ item, isFeatured = false }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        borderRadius: "1.5rem",
        overflow: "hidden",
      }}
    >
      {/* Image Container */}
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          height: isFeatured ? "380px" : "200px",
          borderRadius: "1.5rem",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#1a1a2e",
          display: "block",
        }}
      >
        <Image
          src={item.photo}
          alt={item.name}
          fill
          unoptimized
          sizes="100vw"
          style={{
            objectFit: item.imageStyle?.objectFit || "cover",
            objectPosition: "center",
            transform: `scale(${item.imageStyle?.scale || 1})`,
          }}
        />
      </a>

      {/* Caption */}
      <div
        style={{
          padding: "0.75rem",
          textAlign: "center",
        }}
      >
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
      </div>
    </div>
  );
}