// This proxy route is no longer needed - the app now calls the ngrok API directly
// Keeping this file for now in case it's needed in the future

export const GET = (req) => {
  return new Response(
    JSON.stringify({ message: "This proxy endpoint is not in use" }),
    { status: 405, headers: { "Content-Type": "application/json" } }
  );
};

export const POST = (req) => {
  return new Response(
    JSON.stringify({ message: "This proxy endpoint is not in use" }),
    { status: 405, headers: { "Content-Type": "application/json" } }
  );
};
