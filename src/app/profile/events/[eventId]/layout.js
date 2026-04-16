// Server-side metadata generation for social media sharing
export async function generateMetadata({ params }) {
  try {
    const { eventId } = await params;
    const apiBase = "https://inception-games.an.r.appspot.com/api/v1";
    
    const res = await fetch(`${apiBase}/tournaments/${eventId}`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      return {
        title: "Inception Games - Tournament",
        description: "Join exciting gaming tournaments on Inception Games",
      };
    }
    
    const data = await res.json();
    const event = data.tournament || data.data || data;
    
    if (!event) {
      return {
        title: "Inception Games - Tournament",
        description: "Join exciting gaming tournaments on Inception Games",
      };
    }
    
    const title = event.title || "Inception Games Tournament";
    const eventDate = event.start_date || event.date
      ? new Date(event.start_date || event.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "TBD";
    const location = event.region || event.location || "Online";
    const description = `${title} - ${eventDate} in ${location}. Join the competition on Inception Games platform!`;
    
    // Get banner image URL - prioritize absolute URLs
    let ogImageUrl = event.banner_image;
    if (ogImageUrl) {
      // Convert relative paths to absolute
      if (!ogImageUrl.startsWith("http")) {
        ogImageUrl = ogImageUrl.startsWith("/")
          ? `${apiBase}${ogImageUrl}`
          : `${apiBase}/${ogImageUrl}`;
      }
      // Ensure HTTPS for social media crawlers
      ogImageUrl = ogImageUrl.replace("http://", "https://");
    } else {
      // Fallback to OG image API endpoint
      ogImageUrl = `${apiBase.replace("/api/v1", "")}/api/og-image/${eventId}`;
    }
    
    return {
      title: title,
      description: description,
      metadataBase: new URL("https://inception.games"),
      openGraph: {
        title: title,
        description: description,
        type: "website",
        url: `/profile/events/${eventId}`,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${title} Tournament`,
            type: "image/jpeg",
          },
        ],
        siteName: "Inception Games",
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [ogImageUrl],
        creator: "@SnSGames",
      },
    };
  } catch (error) {
    console.error("[v0] Metadata generation error:", error);
    return {
      title: "Inception Games - Tournament",
      description: "Join exciting gaming tournaments on Inception Games",
    };
  }
}

export default function EventLayout({ children }) {
  return children;
}
