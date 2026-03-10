const UPSTREAM = "https://api.slicenshare.com";

async function handler(req, context) {
  const { path } = await context.params;
  // path is an array like ["v1","auth","users","signup","verify"]
  const segments = Array.isArray(path) ? path.join("/") : path;
  // Remove any trailing slashes from segments
  const cleanSegments = segments.replace(/\/+$/, "");
  const url = `${UPSTREAM}/api/${cleanSegments}`;

  // Build headers - forward important headers to make the request look legitimate
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    // Use a proper User-Agent to avoid being blocked
    "User-Agent": "Mozilla/5.0 (compatible; SNS-Proxy/1.0)",
    // Set origin to the upstream domain since we're proxying
    "Origin": "https://api.slicenshare.com",
    "Referer": "https://slicenshare.com/",
  };

  // Forward the Authorization header if present
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    headers["Authorization"] = authHeader;
  }

  // Forward X-Forwarded-For for proper IP tracking
  const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
  if (clientIP) {
    headers["X-Forwarded-For"] = clientIP;
  }

  const fetchOptions = {
    method: req.method,
    headers,
  };

  // Forward body for non-GET requests
  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      const body = await req.text();
      if (body) {
        fetchOptions.body = body;
      }
    } catch {
      // no body
    }
  }

  console.log(`[proxy] ${req.method} ${url}`, fetchOptions.body ? `body: ${fetchOptions.body}` : "");

  try {
    const upstream = await fetch(url, fetchOptions);
    const responseBody = await upstream.text();

    console.log(`[proxy] Response: ${upstream.status} - ${responseBody.substring(0, 200)}`);

    // Check if we got HTML instead of JSON (indicates an error page)
    const contentType = upstream.headers.get("content-type") || "";
    if (upstream.status >= 400 && contentType.includes("text/html")) {
      // Return a proper JSON error instead of HTML
      return new Response(
        JSON.stringify({ 
          success: false,
          message: `Upstream server returned ${upstream.status} error`,
          status: upstream.status
        }),
        { 
          status: upstream.status, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(responseBody, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json",
      },
    });
  } catch (err) {
    console.error(`[proxy] Upstream error:`, err.message);
    return new Response(
      JSON.stringify({ success: false, message: "Proxy error: " + err.message }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
