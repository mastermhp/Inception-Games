// API base URL with /api/v1 path as per API docs
const BASE_URL = "https://inception-games.an.r.appspot.com/api/v1";

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
 * Token storage in memory + sessionStorage for persistence across page loads
 * sessionStorage clears when the tab closes for better security
 */
let memoryTokens = null;

export function getTokens() {
  if (memoryTokens) return memoryTokens;
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem("sns_auth_tokens");
    if (stored) {
      memoryTokens = JSON.parse(stored);
      return memoryTokens;
    }
  } catch {
    // ignore
  }
  return null;
}

export function setTokens(tokens) {
  memoryTokens = tokens;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("sns_auth_tokens", JSON.stringify(tokens));
      console.log("[v0] Tokens stored in sessionStorage");
    } catch {
      // ignore
    }
  }
}

export function clearTokens() {
  memoryTokens = null;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem("sns_auth_tokens");
      sessionStorage.removeItem("sns_user");
      console.log("[v0] Tokens and user data cleared from sessionStorage");
    } catch {
      // ignore
    }
  }
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem("sns_user");
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return null;
}

export function setStoredUser(user) {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("sns_user", JSON.stringify(user));
    } catch {
      // ignore
    }
  }
}


