// API base URL with /api/v1 path as per API docs
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://inception-games.an.r.appspot.com/api/v1";

console.log("[v0] API BASE_URL initialized to:", BASE_URL);

export const API = {
  // Registration Flow (5 Steps)
  REGISTER_SEND_OTP:     `${BASE_URL}/auth/register/send-otp`,
  REGISTER_VERIFY_OTP:   `${BASE_URL}/auth/register/verify-otp`,
  REGISTER_PERSONAL_INFO: `${BASE_URL}/auth/register/personal-info`,
  REGISTER_GAMING_PROFILE: `${BASE_URL}/auth/register/gaming-profile`,
  REGISTER_PROFILE_IMAGES: `${BASE_URL}/auth/register/profile-images`,

  // Login Flow
  LOGIN_SEND_OTP:        `${BASE_URL}/auth/login/send-otp`,
  LOGIN_VERIFY_OTP:      `${BASE_URL}/auth/login/verify-otp`,

  // Utility
  RESEND_OTP:            `${BASE_URL}/auth/resend-otp`,

  // Profile - use userId per API docs
  PROFILE_GET:           `${BASE_URL}/auth/profile/:userId`,
  PROFILE_UPDATE:        `${BASE_URL}/auth/profile/:userId`,

  // Events API
  EVENTS_GET_ALL:        `${BASE_URL}/events`,
  EVENTS_GET_BY_ID:      `${BASE_URL}/events/:eventId`,
  EVENTS_GET_BY_STATUS:  `${BASE_URL}/events?status=:status`,

  // Event Signups API
  EVENT_SIGNUP:          `${BASE_URL}/events/signup`,
  EVENT_SIGNUPS_ALL:     `${BASE_URL}/events/signup/all`,
  EVENT_SIGNUPS_BY_EVENT:`${BASE_URL}/events/signup/:eventId`,
  EVENT_SIGNUP_BY_ID:    `${BASE_URL}/events/signup/:signupId`,
};

/**
 * Make an authenticated API request with authorization header
 */
export async function authFetch(url, options = {}) {
  const tokens = getTokens();
  if (!tokens?.accessToken) {
    throw new Error("Not authenticated");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokens.accessToken}`,
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  return res;
}

/**
 * Token storage in memory + localStorage for persistence across page loads and tab sessions
 */
let memoryTokens = null;

export function getTokens() {
  if (memoryTokens) return memoryTokens;
  if (typeof window === "undefined") return null;
  try {
    // Try sessionStorage first (more secure, cleared on tab close)
    let stored = sessionStorage.getItem("sns_auth_tokens");
    if (stored) {
      memoryTokens = JSON.parse(stored);
      console.log("[v0] Tokens loaded from sessionStorage");
      return memoryTokens;
    }
    // Fallback to localStorage if sessionStorage is empty
    stored = localStorage.getItem("sns_auth_tokens");
    if (stored) {
      memoryTokens = JSON.parse(stored);
      console.log("[v0] Tokens loaded from localStorage");
      return memoryTokens;
    }
  } catch (err) {
    console.log("[v0] Error loading tokens:", err.message);
  }
  return null;
}

export function setTokens(tokens) {
  memoryTokens = tokens;
  if (typeof window !== "undefined") {
    try {
      // Store in both sessionStorage and localStorage for redundancy
      sessionStorage.setItem("sns_auth_tokens", JSON.stringify(tokens));
      localStorage.setItem("sns_auth_tokens", JSON.stringify(tokens));
      console.log("[v0] Tokens stored in sessionStorage and localStorage");
    } catch (err) {
      console.log("[v0] Error storing tokens:", err.message);
    }
  }
}

export function clearTokens() {
  memoryTokens = null;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem("sns_auth_tokens");
      sessionStorage.removeItem("sns_user");
      localStorage.removeItem("sns_auth_tokens");
      localStorage.removeItem("sns_user");
      console.log("[v0] Tokens and user data cleared from all storage");
    } catch (err) {
      console.log("[v0] Error clearing tokens:", err.message);
    }
  }
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    // Try sessionStorage first
    let stored = sessionStorage.getItem("sns_user");
    if (stored) return JSON.parse(stored);
    // Fallback to localStorage
    stored = localStorage.getItem("sns_user");
    if (stored) return JSON.parse(stored);
  } catch (err) {
    console.log("[v0] Error loading user data:", err.message);
  }
  return null;
}

export function setStoredUser(user) {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("sns_user", JSON.stringify(user));
      localStorage.setItem("sns_user", JSON.stringify(user));
    } catch (err) {
      console.log("[v0] Error storing user data:", err.message);
    }
  }
}


