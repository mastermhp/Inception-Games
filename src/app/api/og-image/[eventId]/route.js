// Simple proxy route to serve event banner as OG image
// This ensures the image is accessible to Facebook's crawler

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
      // Return a default gradient if event not found
      return new Response('Not found', { status: 404 });
    }

    const data = await response.json();
    const event = data.tournament || data.data || data;

    // Get banner image URL
    const bannerUrl = event?.banner_image || event?.game_image;

    if (!bannerUrl) {
      // Return 404 if no banner - layout.js will handle fallback
      return new Response('No image', { status: 404 });
    }

    // If image URL is absolute, redirect to it
    if (bannerUrl.startsWith('http')) {
      return Response.redirect(bannerUrl, 307);
    }

    // If relative, try to fetch from API base
    const absoluteImageUrl = bannerUrl.startsWith('/')
      ? `${baseUrl.replace('/api/v1', '')}${bannerUrl}`
      : `${baseUrl.replace('/api/v1', '')}/${bannerUrl}`;

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

    return new Response('Image not accessible', { status: 404 });
  } catch (error) {
    console.error('[v0] OG image route error:', error);
    return new Response('Error', { status: 500 });
  }
}
