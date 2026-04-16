"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Users, Monitor, Trophy } from "lucide-react";

export default function EventShareCard({ event, forceRender = false }) {
  const canvasRef = useRef(null);

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    const date = new Date(dateStr);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayNum = date.getDate();
    const getDaySuffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${days[date.getDay()]} ${dayNum}${getDaySuffix(dayNum)} ${months[date.getMonth()]}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return { bg: "#10b981", text: "#d1fae5" };
      case "Ongoing":
        return { bg: "#3b82f6", text: "#dbeafe" };
      case "Completed":
        return { bg: "#ef4444", text: "#fee2e2" };
      default:
        return { bg: "#6b7280", text: "#f3f4f6" };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Upcoming":
        return "Registration Open";
      case "Ongoing":
        return "In Progress";
      case "Completed":
        return "Tournament Ended";
      default:
        return status;
    }
  };

  // Generate share image
  const generateShareImage = async () => {
    if (!canvasRef.current || !event) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size (1200x630 for optimal social sharing)
    canvas.width = 1200;
    canvas.height = 630;

    // Draw background
    ctx.fillStyle = "#0a0a14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load and draw banner image
    if (event.banner_image || event.game?.image || event.gameImage) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        // Draw banner image, maintaining aspect ratio
        const imgAspect = img.width / img.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.width / imgAspect;
        
        if (drawHeight < 280) {
          drawHeight = 280;
          drawWidth = drawHeight * imgAspect;
        }
        
        const offsetX = (canvas.width - drawWidth) / 2;
        const offsetY = (280 - drawHeight) / 2;
        
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Add gradient overlay - darker at bottom
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "rgba(10, 10, 20, 0.1)");
        gradient.addColorStop(0.3, "rgba(10, 10, 20, 0.2)");
        gradient.addColorStop(0.6, "rgba(10, 10, 20, 0.6)");
        gradient.addColorStop(1, "rgba(10, 10, 20, 0.98)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawCardContent(ctx);
      };

      img.onerror = () => {
        // Fallback if image fails to load - draw gradient background
        const fallbackGradient = ctx.createLinearGradient(0, 0, canvas.width, 280);
        fallbackGradient.addColorStop(0, "#1a1a3f");
        fallbackGradient.addColorStop(1, "#2d1b4e");
        ctx.fillStyle = fallbackGradient;
        ctx.fillRect(0, 0, canvas.width, 280);
        drawCardContent(ctx);
      };

      img.src =
        event.banner_image ||
        event.gameImage ||
        event.game?.image ||
        "/games/pubg.png";
    } else {
      // Draw gradient background if no image
      const fallbackGradient = ctx.createLinearGradient(0, 0, canvas.width, 280);
      fallbackGradient.addColorStop(0, "#1a1a3f");
      fallbackGradient.addColorStop(1, "#2d1b4e");
      ctx.fillStyle = fallbackGradient;
      ctx.fillRect(0, 0, canvas.width, 280);
      drawCardContent(ctx);
    }
  };

  const drawCardContent = (ctx) => {
    const statusColor = getStatusColor(event.status);

    // Draw date badge (top left, over banner) - matching event card design
    const dateX = 40;
    const dateY = 160;
    const dateWidth = 160;
    const dateHeight = 60;

    // Dark background for date badge
    ctx.fillStyle = "rgba(70, 25, 80, 0.95)";
    ctx.beginPath();
    ctx.roundRect(dateX, dateY, dateWidth, dateHeight, 8);
    ctx.fill();

    // Date text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "left";

    const dateText = new Date(event.start_date || event.date);
    const monthStr = dateText.toLocaleDateString("en-GB", {
      month: "short",
    }).toUpperCase();
    const dayStr = String(dateText.getDate()).padStart(2, "0");

    ctx.fillText(dayStr, dateX + 15, dateY + 32);
    ctx.font = "bold 14px Arial";
    ctx.fillText(monthStr, dateX + 15, dateY + 50);

    // Draw content area (bottom)
    const contentY = 280;
    ctx.fillStyle = "rgba(10, 10, 20, 0.98)";
    ctx.fillRect(0, contentY, ctx.canvas.width, ctx.canvas.height - contentY);

    // Draw status badge (top right)
    const statusX = ctx.canvas.width - 180;
    const statusY = 310;

    ctx.fillStyle = statusColor.bg;
    ctx.beginPath();
    ctx.roundRect(statusX, statusY, 150, 45, 8);
    ctx.fill();

    ctx.fillStyle = statusColor.text;
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(getStatusText(event.status), statusX + 75, statusY + 30);

    // Draw title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "left";

    const title = event.title || "";
    const maxTitleWidth = ctx.canvas.width - 80;
    const lines = wrapText(ctx, title, maxTitleWidth);

    let currentY = 360;
    lines.slice(0, 2).forEach((line) => {
      ctx.fillText(line, 40, currentY);
      currentY += 42;
    });

    // Draw date and registration info
    currentY += 15;
    ctx.fillStyle = "#f87171";
    ctx.font = "18px Arial";
    ctx.textAlign = "left";
    ctx.fillText(
      `${formatDate(event.start_date || event.date)} · ${getStatusText(event.status)}`,
      40,
      currentY
    );

    // Draw meta info (location, platform, mode)
    currentY += 45;
    ctx.fillStyle = "#d1d5db";
    ctx.font = "16px Arial";

    const location = event.location || event.venue || "Online";
    const platform = event.platform || "All Platforms";
    const teamType = event.teamType || "Open";

    ctx.fillText(`📍 ${location}`, 40, currentY);
    ctx.fillText(`🖥️  ${platform}`, 350, currentY);
    ctx.fillText(`👥 ${teamType}`, 750, currentY);

    // Draw category tags at bottom
    currentY += 55;
    
    // Tournament tag
    ctx.fillStyle = "rgba(100, 90, 130, 0.6)";
    ctx.beginPath();
    ctx.roundRect(40, currentY, 130, 40, 8);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Tournament", 105, currentY + 27);

    // Organizer tag
    const organizerTag = event.organizer || event.host || "Inception Games";
    ctx.fillStyle = "rgba(128, 60, 200, 0.6)";
    ctx.beginPath();
    ctx.roundRect(190, currentY, 220, 40, 8);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    const displayOrganizerTag = organizerTag.length > 25 
      ? organizerTag.substring(0, 22) + "..." 
      : organizerTag;
    ctx.fillText(displayOrganizerTag, 300, currentY + 27);
  };

  // Helper to wrap text
  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
  };

  useEffect(() => {
    if (forceRender) {
      generateShareImage();
    }
  }, [event, forceRender]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "none" }}
      className="hidden"
    />
  );
}
