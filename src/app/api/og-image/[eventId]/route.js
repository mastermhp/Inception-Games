// OG Image Generator for Event Sharing
// Creates a rich preview card image when events are shared on social media

export async function GET(request, { params }) {
  try {
    const { eventId } = params;
    
    // Fetch event data from the API
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inception-games.an.r.appspot.com/api/v1';
    const eventUrl = `${baseUrl}/tournaments/${eventId}`;
    
    const response = await fetch(eventUrl, {
      next: { revalidate: 3600 },
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      console.log('[v0] Event API not found, returning 404');
      return new Response('Event not found', { status: 404 });
    }

    const data = await response.json();
    const event = data.tournament || data.data || data;

    if (!event) {
      return new Response('Event data invalid', { status: 404 });
    }

    // Get banner image URL
    const bannerUrl = event?.banner_image || event?.game_image;

    // If we have a banner image, redirect to it as the OG image
    // This provides the best quality for social sharing
    if (bannerUrl) {
      // If image URL is absolute, redirect to it directly
      if (bannerUrl.startsWith('http')) {
        console.log('[v0] Redirecting to absolute banner URL:', bannerUrl);
        return Response.redirect(bannerUrl, 307);
      }

      // If relative, construct absolute URL
      const absoluteImageUrl = bannerUrl.startsWith('/')
        ? `${baseUrl.replace('/api/v1', '')}${bannerUrl}`
        : `${baseUrl.replace('/api/v1', '')}/${bannerUrl}`;

      console.log('[v0] Attempting to fetch banner from:', absoluteImageUrl);
      
      try {
        const imageResponse = await fetch(absoluteImageUrl, {
          next: { revalidate: 86400 }, // Cache for 24 hours
        });

        if (imageResponse.ok) {
          return new Response(imageResponse.body, {
            status: 200,
            headers: {
              'Content-Type': imageResponse.headers.get('content-type') || 'image/jpeg',
              'Cache-Control': 'public, max-age=86400',
            },
          });
        }
      } catch (imgError) {
        console.log('[v0] Failed to fetch banner image:', imgError.message);
        // Fall through to return default
      }
    }

    // If no banner or it failed to load, return the primary image as fallback
    console.log('[v0] No valid banner image, returning 404 for client fallback');
    return new Response('No banner image available', { status: 404 });
    
  } catch (error) {
    console.error('[v0] OG image route error:', error);
    return new Response('Server error generating OG image', { status: 500 });
  }
}
