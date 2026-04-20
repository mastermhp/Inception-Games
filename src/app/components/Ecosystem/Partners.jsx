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
      photo: "/Ecosystem/Partners/mime2.jpeg",
      type: "image",
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
      photo: "/Ecosystem/Partners/moar2.mp4",
      type: "video",
      link: "https://moarbd.com",
      caption: {
        normalText: "Moar fuels the competitive spirit — ",
        highlightText:
          "They are our social media ads partner. We made game engine based ads for them.",
      },
    },
  ],
};

export function PartnerCard({ item, isFeatured = false }) {
  const [hovered, setHovered] = React.useState(false);

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
        overflow: "visible",
        transform: hovered ? "translateY(-12px)" : "translateY(0)",
        transition: "0.4s ease",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Media Section */}
      <div
        style={{
          // height: isFeatured ? "420px" : "240px",
          flex: 1,
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
          borderRadius: "2rem 2rem 0 0",
          background: "#111",
          // flexShrink: 0,
        }}
      >
        {item.type === "video" ? (
          <video
            src={item.photo}
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Image
            src={item.photo}
            alt={item.name}
            fill
            unoptimized
            style={{
              objectFit: "cover",
            }}
          />
        )}
      </div>

      {/* Caption */}
      <div
        style={{
          padding: "0.875rem 1rem",
          background: "#0a0a0a",
          borderRadius: "0 0 2rem 2rem",
          color: "white",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: isFeatured ? "1rem" : "0.85rem",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {item.caption.normalText}
          <span
            style={{
              display: "block",
              color: "#FFD700",
              fontWeight: 700,
              marginTop: "4px",
            }}
          >
            {item.caption.highlightText}
          </span>
        </p>
      </div>
    </div>
  );
}