// API base URL with /api/v1 path as per API docs
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://inception-games.an.r.appspot.com/api/v1";

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
  REFRESH_TOKEN:         `${BASE_URL}/auth/refresh-token`,

  // Profile Update - PUT endpoint with FormData
  PROFILE_UPDATE:        `${BASE_URL}/auth/profile/:userId`,

  // Events/Tournaments API
  EVENTS_GET_ALL:        `${BASE_URL}/tournaments`,
  EVENTS_GET_BY_ID:      `${BASE_URL}/tournaments/:eventId`,
  EVENTS_GET_BY_STATUS:  `${BASE_URL}/tournaments?status=:status`,

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
  if (typeof window === "undefined") return null;
  try {
    // Always check storage first to ensure we have the latest tokens
    // Try sessionStorage first (more secure, cleared on tab close)
    let stored = sessionStorage.getItem("sns_auth_tokens");
    if (stored) {
      memoryTokens = JSON.parse(stored);
      return memoryTokens;
    }
    // Fallback to localStorage if sessionStorage is empty
    stored = localStorage.getItem("sns_auth_tokens");
    if (stored) {
      memoryTokens = JSON.parse(stored);
      return memoryTokens;
    }
    // If nothing in storage, return memory cache (if exists)
    if (memoryTokens) {
      return memoryTokens;
    }
  } catch (err) {
    // Error loading tokens - continue silently
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
    } catch (err) {
      // Error storing tokens - continue silently
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
    } catch (err) {
      // Error clearing tokens - continue silently
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
    // Error loading user data - continue silently
  }
  return null;
}

export function setStoredUser(user) {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("sns_user", JSON.stringify(user));
      localStorage.setItem("sns_user", JSON.stringify(user));
    } catch (err) {
      // Error storing user data - continue silently
    }
  }
}

/**
 * Refresh access token using refresh token
 * This is called when we have a refreshToken but no accessToken
 */
export async function refreshAccessToken() {
  const tokens = getTokens();
  
  if (!tokens?.refreshToken) {
    return null;
  }
  
  try {
    const res = await fetch(API.REFRESH_TOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: tokens.refreshToken
      })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      // If refresh fails, clear tokens and require re-login
      clearTokens();
      return null;
    }
    
    // Extract new accessToken from response
    const newAccessToken = data.accessToken || data.access_token || data.token || data.data?.accessToken || data.data?.access_token;
    
    if (newAccessToken) {
      // Update tokens with new accessToken, keep existing refreshToken
      const updatedTokens = {
        ...tokens,
        accessToken: newAccessToken
      };
      setTokens(updatedTokens);
      return updatedTokens;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

