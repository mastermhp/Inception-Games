"use client";
import React from "react";
import Image from "next/image";

export const partnersData = {
  title: "Our Partners",
  subtitle: "Trusted collaborations that power our ecosystem",
  items: [
    {
      id: 1,
      name: "Ifarmer",
      photo: "/Ecosystem/Partners/ifarmer2.jpeg",
      type: "image",
      link: "https://www.ifarmer.asia",
      caption: {
        normalText: "31,000+ Active Users powering ",
        highlightText:
          '"ভাগ্যের ছক্কা" Ludo Arcade — in collaboration with iFarmer (Folon App).',
      },
    },
    {
      id: 2,
      name: "Mime",
      photo: "/Ecosystem/Partners/MIME.jpeg",
      link: "https://www.mimebd.com",
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
      video: "/Ecosystem/Partners/MOAR.mp4",
      isVideo: true,
      link: "https://moarbd.com",
      imageStyle: {
        objectFit: "contain",
      },
      caption: {
        normalText: "Moar fuels the competitive spirit — ",
        highlightText:
          "They are our social media ads partner. We made game engine based ads for them.",
      },
    },
  ],
};

export function PartnerCard({
  item,
  isFeatured = false,
  isActive,
  onVideoEnd,
}) {
  const [hovered, setHovered] = React.useState(false);
  const videoRef = React.useRef(null);

  // Control autoplay ONLY when active
  React.useEffect(() => {
    if (item.isVideo && videoRef.current) {
      if (isActive) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, item.isVideo]);

  const handleClick = () => {
    window.open(item.link, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        borderRadius: "2rem",
        overflow: "hidden",
        transition: "all 0.4s",
        transform: hovered ? "translateY(-12px)" : "translateY(0)",
        transition: "0.4s ease",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          // height: isFeatured ? "420px" : "240px",
          flex: 1,
          flexShrink: 0,
          position: "relative",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {/* CONDITIONAL RENDER */}
          {item.isVideo ? (
            <video
              ref={videoRef}
              src={item.video}
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onEnded={onVideoEnd}
            />
          ) : (
            <Image
              src={item.photo}
              alt={item.name}
              fill
              unoptimized
              sizes="100vw"
              style={{
                objectFit: "cover",
                transform: hovered ? "scale(1.08)" : "scale(1)",
              }}
            />
          )}
        </div>
      </a>

      {/* Caption stays same */}
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <p style={{ color: "#fff", margin: 0 }}>
          {item.caption.normalText}
          <span style={{ color: "#FFD700", display: "block" }}>
            {item.caption.highlightText}
          </span>
        </p>
      </div>
    </div>
  );
}

// export function PartnerCard({ item, isFeatured = false }) {
//   const [hovered, setHovered] = React.useState(false);

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         width: "100%",
//         height: "100%",
//         borderRadius: "2rem",
//         overflow: "hidden",
//         transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
//         transform: hovered ? "translateY(-12px)" : "translateY(0)",
//       }}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       {/* Image Container */}
//       <a
//         href={item.link}
//         target="_blank"
//         rel="noopener noreferrer"
//         style={{
//           height: isFeatured ? "420px" : "240px",
//           borderRadius: "2rem 2rem 0 0",
//           overflow: "hidden",
//           position: "relative",
//           background: "linear-gradient(135deg, rgba(129, 23, 241, 0.1) 0%, rgba(255, 0, 64, 0.05) 100%)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           border: "1px solid rgba(129, 23, 241, 0.2)",
//           boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
//           transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
//         }}
//       >
//         <div style={{ position: "relative", width: "100%", height: "100%" }}>
//           <Image
//             src={item.photo}
//             alt={item.name}
//             fill
//             unoptimized
//             sizes="100vw"
//             style={{
//               objectFit: "cover",
//               objectPosition: "center",
//               transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
//               transform: hovered ? "scale(1.08)" : "scale(1)",
//               filter: hovered ? "brightness(1.15)" : "brightness(1)",
//             }}
//           />
//         </div>

//         {/* Gradient overlay */}
//         <div
//           style={{
//             position: "absolute",
//             inset: 0,
//             background: hovered
//               ? "linear-gradient(135deg, rgba(129,23,241,0.15) 0%, rgba(255,0,64,0.1) 100%)"
//               : "linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 100%)",
//             transition: "all 0.5s ease-in-out",
//             pointerEvents: "none",
//           }}
//         />

//         {/* Glow border effect */}
//         <div
//           style={{
//             position: "absolute",
//             inset: 0,
//             borderRadius: "2rem 2rem 0 0",
//             background: hovered
//               ? "linear-gradient(90deg, transparent, rgba(129,23,241,0.3), transparent)"
//               : "transparent",
//             transition: "all 0.5s ease-in-out",
//             pointerEvents: "none",
//           }}
//         />
//       </a>

//       {/* Caption with enhanced styling */}
//       <div
//         style={{
//           padding: "1.25rem 1rem",
//           textAlign: "center",
//           background: "linear-gradient(to bottom, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.95) 100%)",
//           borderTop: "1px solid rgba(129, 23, 241, 0.15)",
//           flex: 1,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           transition: "all 0.3s ease",
//         }}
//       >
//         <p
//           style={{
//             color: "#fff",
//             fontSize: isFeatured ? "1rem" : "0.85rem",
//             lineHeight: 1.6,
//             fontWeight: 500,
//             margin: 0,
//             transition: "all 0.3s ease",
//           }}
//         >
//           {item.caption.normalText}
//           <span
//             style={{
//               color: "#FFD700",
//               fontWeight: 700,
//               display: "block",
//               marginTop: "4px",
//               textShadow: "0 2px 8px rgba(255, 215, 0, 0.2)",
//               transition: "all 0.3s ease",
//               transform: hovered ? "scale(1.02)" : "scale(1)",
//             }}
//           >
//             {item.caption.highlightText}
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }
