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
    if (event.banner_image || event.game?.image) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        // Draw banner with gradient overlay
        ctx.drawImage(img, 0, 0, canvas.width, 280);

        // Add gradient overlay
        const gradient = ctx.createLinearGradient(
          0,
          0,
          0,
          canvas.height
        );
        gradient.addColorStop(0, "rgba(10, 10, 20, 0)");
        gradient.addColorStop(0.4, "rgba(10, 10, 20, 0.3)");
        gradient.addColorStop(1, "rgba(10, 10, 20, 0.95)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawCardContent(ctx);
      };

      img.onerror = () => {
        // Fallback if image fails to load
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, canvas.width, 280);
        drawCardContent(ctx);
      };

      img.src =
        event.banner_image ||
        event.game?.image ||
        "/games/pubg.png";
    } else {
      drawCardContent(ctx);
    }
  };

  const drawCardContent = (ctx) => {
    const statusColor = getStatusColor(event.status);

    // Draw date badge (top left, over banner)
    const dateX = 40;
    const dateY = 160;
    const dateWidth = 180;
    const dateHeight = 70;

    ctx.fillStyle = "rgba(129, 23, 238, 0.9)";
    ctx.beginPath();
    ctx.roundRect(dateX, dateY, dateWidth, dateHeight, 12);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "left";

    const dateText = new Date(event.start_date || event.date);
    const monthStr = dateText.toLocaleDateString("en-GB", {
      month: "short",
    });
    const dayStr = dateText.getDate();

    ctx.fillText(
      dayStr,
      dateX + 15,
      dateY + 35
    );
    ctx.font = "bold 18px Arial";
    ctx.fillText(
      monthStr.toUpperCase(),
      dateX + 15,
      dateY + 58
    );

    // Draw content area (bottom)
    const contentY = 280;
    ctx.fillStyle = "rgba(17, 17, 21, 0.95)";
    ctx.fillRect(0, contentY, ctx.canvas.width, ctx.canvas.height - contentY);

    // Draw status badge (top right)
    const statusX = ctx.canvas.width - 200;
    const statusY = 320;

    ctx.fillStyle = statusColor.bg;
    ctx.beginPath();
    ctx.roundRect(statusX, statusY, 160, 50, 8);
    ctx.fill();

    ctx.fillStyle = statusColor.text;
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(getStatusText(event.status), statusX + 80, statusY + 35);

    // Draw title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "left";

    const title = event.title || "";
    const maxTitleWidth = ctx.canvas.width - 80;
    const lines = wrapText(ctx, title, maxTitleWidth);

    let currentY = 350;
    lines.slice(0, 2).forEach((line) => {
      ctx.fillText(line, 40, currentY);
      currentY += 40;
    });

    // Draw date and status info
    currentY += 10;
    ctx.fillStyle = "#f87171";
    ctx.font = "20px Arial";
    ctx.fillText(
      `${formatDate(event.start_date)} · ${getStatusText(event.status)}`,
      40,
      currentY
    );

    // Draw meta info
    currentY += 50;
    ctx.fillStyle = "#d1d5db";
    ctx.font = "18px Arial";

    const metaItems = [
      { icon: "📍", text: event.location || event.venue || "Online" },
      { icon: "🖥️", text: event.platform || "All Platforms" },
      { icon: "👥", text: event.teamType || "Open" },
    ];

    let metaX = 40;
    metaItems.forEach((item) => {
      ctx.fillText(`${item.icon} ${item.text}`, metaX, currentY);
      metaX += 350;
    });

    // Draw tags at bottom
    currentY += 60;
    ctx.fillStyle = "#6b7280";
    ctx.fillRect(40, currentY, 140, 50);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Tournament", 110, currentY + 35);

    const organizerTag = event.organizer || event.host || "Inception Games";
    ctx.fillStyle = "#a78bfa";
    ctx.fillRect(200, currentY, 200, 50);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(organizerTag.substring(0, 20), 300, currentY + 35);
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
