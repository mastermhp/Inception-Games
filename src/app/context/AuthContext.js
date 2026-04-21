"use client";
// import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  API,
  getTokens,
  setTokens,
  clearTokens,
  getStoredUser,
  setStoredUser,
  authFetch,
  refreshAccessToken,
} from "@/lib/api";

const getStoredTokens = () => getTokens();
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export { AuthContext };

export function AuthProvider({ children }) {

      const router = useRouter();


  const [user, setUser] = useState(null);
  const [tokens, setTokensState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTournamentCategory, setSelectedTournamentCategory] = useState(null);

  /**
   * Fetch user profile from API (GET /api/v1/auth/profile/:userId)
   */
  const fetchProfile = useCallback(async () => {
    try {
      const storedUser = getStoredUser();
      if (!storedUser?.id) {
        console.log("No stored user ID for profile fetch");
        return;
      }
      const tokens = getStoredTokens();
      if (!tokens?.accessToken) {
        console.log("[v0] No access token available for profile fetch");
        return;
      }
      
      const url = API.PROFILE_GET.replace(":userId", storedUser.id);
      console.log("[v0] Fetching profile from:", url);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokens.accessToken}`
        },
      });
      const data = await res.json();
      console.log("[v0] Profile API response:", JSON.stringify(data, null, 2));

      if (res.ok) {
        const userData = data.data || data;
        const userObj = {
          id: userData.id || userData._id,
          email: userData.email,
          username: userData.username || "",
          fullName: userData.full_name || userData.fullName || userData.name || "",
          phone: userData.phone || "",
          avatar: userData.avatar_url || userData.avatar || "",
          banner: userData.banner_url || userData.banner || "",
          discord: userData.discord || "",
          bio: userData.bio || "",
          primaryGame: userData.primary_game || "",
          gameRole: userData.game_role || "",
          rank: userData.rank || "",
          continent: userData.continent || "",
          country: userData.country || "",
          region: userData.region || "",
          authMethod: userData.authMethod || getStoredUser()?.authMethod || "email",
          firebaseUid: userData.firebaseUid || getStoredUser()?.firebaseUid || null,
        };
        console.log("[v0] Profile parsed user object:", userObj);
        setUser(userObj);
        setStoredUser(userObj);
        return userObj;
      } else {
        console.log("[v0] Profile fetch failed with status:", res.status, data);
      }
    } catch (err) {
      console.error("[v0] Profile fetch error:", err.message);
    }
    return null;
  }, []);

  // Initialize auth state from storage on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    const tokens = getTokens();
    console.log("[v0] AuthProvider init - stored user:", storedUser?.email, "has tokens:", !!tokens?.accessToken);
    
    if (storedUser) {
      setUser(storedUser);
      console.log("[v0] User restored from storage:", storedUser.email);
      
      // If we have tokens, fetch fresh profile in background
      if (tokens?.accessToken) {
        fetchProfile().catch((err) => {
          console.log("[v0] Background profile fetch failed, keeping stored user:", err.message);
        });
      } else {
        console.log("[v0] User restored but no access token available - user may need to re-login for authenticated actions");
      }
    } else {
      console.log("[v0] No stored user found, app is not authenticated");
    }
    setLoading(false);
  }, [fetchProfile]);

  // ============================================
  // EMAIL/OTP AUTH METHODS
  // ============================================

  /**
   * Email/OTP Login: Step 1 - Send OTP
   * POST /auth/login/send-otp  body: { email }
   */
  const loginSendOTP = useCallback(async (email) => {
    setError(null);
    console.log("Login - sending OTP to:", email);
    const res = await fetch(API.LOGIN_SEND_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    console.log("Login send OTP response:", JSON.stringify(data, null, 2));
    if (!res.ok) {
      const msg = data.error || data.message || "Failed to send OTP";
      setError(msg);
      throw new Error(msg);
    }
    return data;
  }, []);

  /**
   * Email/OTP Login: Step 2 - Verify OTP
   * POST /auth/login/verify-otp  body: { email, otp }
   */
  const loginVerifyOTP = useCallback(async (email, otp) => {
    setError(null);
    console.log("Login - verifying OTP for:", email);
    const res = await fetch(API.LOGIN_VERIFY_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: String(otp).trim() }),
    });
    const data = await res.json();
    console.log("Login verify OTP response:", JSON.stringify(data, null, 2));
    if (!res.ok) {
      const msg = data.error || data.message || "Invalid OTP";
      setError(msg);
      throw new Error(msg);
    }

    // Extract tokens from various possible response formats
    // Try all possible token property names and nested paths
    let accessToken = data.accessToken || data.access_token || data.token || data.user?.token || data.data?.token || data.data?.accessToken || data.data?.access_token;
    let refreshToken = data.refreshToken || data.refresh_token || data.user?.refreshToken || data.user?.refresh_token || data.data?.refreshToken || data.data?.refresh_token;
    
    // Log all available data for debugging
    console.log("[v0] FULL LOGIN RESPONSE:", JSON.stringify(data, null, 2));
    console.log("[v0] Top-level response keys:", Object.keys(data));
    if (data.user) console.log("[v0] data.user keys:", Object.keys(data.user));
    if (data.data) console.log("[v0] data.data keys:", Object.keys(data.data));
    
    // If still no token found, try looking in authentication/tokens object
    if (!accessToken && data.authentication) {
      accessToken = data.authentication.accessToken || data.authentication.access_token || data.authentication.token;
      refreshToken = data.authentication.refreshToken || data.authentication.refresh_token;
      console.log("[v0] Found tokens in authentication object");
    }
    
    // IMPORTANT: Only store tokens if we found them, don't store empty strings
    if (!accessToken) {
      console.error("[v0] CRITICAL: No access token found in login response!");
      console.error("[v0] This is a backend API issue - the login endpoint is not returning tokens");
      console.error("[v0] Expected tokens in one of these locations:");
      console.error("[v0]   - data.accessToken / data.access_token");
      console.error("[v0]   - data.token");
      console.error("[v0]   - data.user.token / data.user.accessToken / data.user.access_token");
      console.error("[v0]   - data.data.token / data.data.accessToken / data.data.access_token");
      console.error("[v0]   - data.authentication.accessToken / data.authentication.access_token");
      throw new Error("Backend error: Login response missing access token");
    }
    
    const tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken || ""
    };
    console.log("[v0] Tokens extracted - accessToken:", accessToken.substring(0, 20) + "...", "refreshToken:", refreshToken ? refreshToken.substring(0, 20) + "..." : "NOT_PROVIDED");
    setTokens(tokens);
    setTokensState(tokens);

    // Build user object with all available data from login response
    const userData = data.user || data.data || data;
    const userObj = {
      id: data.userId || userData.id || userData._id,
      email: userData.email || email,
      username: userData.username || "",
      fullName: userData.fullName || userData.full_name || "",
      phone: userData.phone || "",
      avatar: userData.avatar_url || userData.avatar || "",
      banner: userData.banner_url || userData.banner || "",
      discord: userData.discord || "",
      bio: userData.bio || "",
      primaryGame: userData.primary_game || userData.primaryGame || "",
      gameRole: userData.game_role || userData.gameRole || "",
      rank: userData.rank || "",
      continent: userData.continent || "",
      country: userData.country || "",
      authMethod: "email",
    };
    console.log("Login user object:", userObj);
    setUser(userObj);
    setStoredUser(userObj);

    // Fetch full profile in background to get any additional data
    fetchProfile().catch(() => {});

    // Redirect to profile page after login
    setTimeout(() => {
      router.push("/profile");
    }, 500);

    return { user: userObj, tokens };
  }, [fetchProfile, router]);

  /**
   * Registration Flow Step 1 - Send OTP
   * POST /auth/register/send-otp  body: { email, phone? }
   */
  const registerSendOTP = useCallback(async (email, phone) => {
    setError(null);
    const body = { email };
    if (phone) body.phone = phone;
    console.log("Register send OTP:", JSON.stringify(body));
    const res = await fetch(API.REGISTER_SEND_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log("Register send OTP response:", res.status, JSON.stringify(data));
    if (!res.ok) {
      const msg = data.error || data.message || "Failed to send OTP";
      setError(msg);
      throw new Error(msg);
    }
    return data;
  }, []);

  /**
   * Registration Flow Step 2 - Verify OTP
   * POST /auth/register/verify-otp  body: { email, otp }
   */
  const registerVerifyOTP = useCallback(async (email, otp) => {
    setError(null);
    const otpStr = String(otp).trim();
    console.log("Register verify OTP for:", email);
    const res = await fetch(API.REGISTER_VERIFY_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: otpStr }),
    });
    const data = await res.json();
    console.log("Register verify OTP response:", res.status, JSON.stringify(data));
    if (!res.ok) {
      const msg = data.error || data.message || "Invalid OTP";
      setError(msg);
      throw new Error(msg);
    }
    // Store userId for next steps
    if (data.userId) {
      sessionStorage.setItem("temp_userId", data.userId);
    }
    return data;
  }, []);

  /**
   * Registration Flow Step 3 - Save Personal Info
   * POST /auth/register/personal-info  body: { email, full_name, username, discord?, bio? }
   */
  const registerPersonalInfo = useCallback(async (email, fullName, username, discord = '', bio = '') => {
    setError(null);
    console.log("Register personal info for:", email);
    const body = { email, full_name: fullName, username };
    if (discord) body.discord = discord;
    if (bio) body.bio = bio;
    
    const res = await fetch(API.REGISTER_PERSONAL_INFO, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log("Register personal info response:", res.status, JSON.stringify(data));
    if (!res.ok) {
      const msg = data.error || data.message || "Failed to save personal info";
      setError(msg);
      throw new Error(msg);
    }
    // Store personal info for later use in profile completion
    if (typeof window !== "undefined") {
      sessionStorage.setItem("sns_registration_info", JSON.stringify({ email, fullName, username, discord, bio }));
    }
    // Store userId if returned
    if (data.userId) {
      sessionStorage.setItem("temp_userId", data.userId);
    }
    return data;
  }, []);

  /**
   * Registration Flow Step 4 - Save Gaming Profile
   * POST /auth/register/gaming-profile  body: { email, primary_game, game_role, rank, continent, country }
   */
  const registerGamingProfile = useCallback(async (email, gameData) => {
    setError(null);
    console.log("Register gaming profile for:", email);
    const res = await fetch(API.REGISTER_GAMING_PROFILE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ...gameData }),
    });
    const data = await res.json();
    console.log("Register gaming profile response:", res.status, JSON.stringify(data));
    if (!res.ok) {
      const msg = data.error || data.message || "Failed to save gaming profile";
      setError(msg);
      throw new Error(msg);
    }
    // Store gaming profile info for later use
    if (typeof window !== "undefined") {
      const existingInfo = sessionStorage.getItem("sns_registration_info");
      const parsedInfo = existingInfo ? JSON.parse(existingInfo) : {};
      sessionStorage.setItem("sns_registration_info", JSON.stringify({
        ...parsedInfo,
        primaryGame: gameData.primary_game,
        gameRole: gameData.game_role,
        rank: gameData.rank,
        continent: gameData.continent,
        country: gameData.country,
      }));
    }
    return data;
  }, []);

  /**
   * Registration Flow Step 5 - Upload Profile Images
   * POST /auth/register/profile-images  body: { email, avatar_url?, banner_url? }
   */
  const registerProfileImages = useCallback(async (email, avatarUrl, bannerUrl) => {
    setError(null);
    console.log("Register profile images for:", email);
    const body = { email };
    if (avatarUrl) body.avatar_url = avatarUrl;
    if (bannerUrl) body.banner_url = bannerUrl;
    const res = await fetch(API.REGISTER_PROFILE_IMAGES, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log("Register profile images response:", res.status, JSON.stringify(data));
    if (!res.ok) {
      const msg = data.error || data.message || "Failed to upload images";
      setError(msg);
      throw new Error(msg);
    }

    // After successful registration, store tokens and user
    const accessToken = data.accessToken || data.access_token || data.token;
    if (accessToken) {
      const tokens = {
        accessToken: accessToken,
        refreshToken: data.refreshToken || data.refresh_token || ""
      };
      setTokens(tokens);
      setTokensState(tokens);
      console.log("[v0] Tokens stored after registration");
    } else {
      console.log("[v0] No tokens returned after registration. Response keys:", Object.keys(data));
    }

    // Retrieve personal info from sessionStorage including gaming profile
    let registrationInfo = {};
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("sns_registration_info");
        if (stored) {
          registrationInfo = JSON.parse(stored);
        }
      } catch (e) {
        console.log("Could not retrieve registration info");
      }
    }

    // Build complete user object with all registration data + API response
    const userData = data.data || data.user || data;
    const userObj = {
      id: data.userId || userData.id || userData._id || sessionStorage.getItem("temp_userId"),
      email: email,
      username: registrationInfo.username || userData.username || "",
      fullName: registrationInfo.fullName || userData.full_name || "",
      phone: userData.phone || "",
      avatar: avatarUrl || userData.avatar_url || "",
      banner: bannerUrl || userData.banner_url || "",
      discord: registrationInfo.discord || userData.discord || "",
      bio: registrationInfo.bio || userData.bio || "",
      primaryGame: registrationInfo.primaryGame || userData.primary_game || "",
      gameRole: registrationInfo.gameRole || userData.game_role || "",
      rank: registrationInfo.rank || userData.rank || "",
      continent: registrationInfo.continent || userData.continent || "",
      country: registrationInfo.country || userData.country || "",
      authMethod: "email",
    };
    console.log("[v0] Complete user object after registration:", userObj);
    setUser(userObj);
    setStoredUser(userObj);
    sessionStorage.removeItem("temp_userId");
    sessionStorage.removeItem("sns_registration_info");

    // Redirect to profile page after registration completion
    setTimeout(() => {
      router.push("/profile");
    }, 500);

    return data;
  }, [router]);

  // Backwards compatibility aliases for signup
  const signupSendOTP = registerSendOTP;
  const signupVerifyOTP = registerVerifyOTP;

  /**
   * Logout - clear tokens and user session
   */
  const logout = useCallback(async () => {
    console.log("Logging out...");
    clearTokens();
    setUser(null);
    setError(null);
    console.log("Session cleared");
  }, []);

  // ============================================
  // PROFILE MANAGEMENT
  // ============================================

  /**
   * Update user profile
   * PUT /auth/profile/:userId  body: { field updates } or FormData with files
   */
  const updateProfile = useCallback(async (userId, updates) => {
    setError(null);
    console.log("[v0] updateProfile called with userId:", userId);
    console.log("[v0] Current user in state:", user?.id, user?.email);
    console.log("[v0] Tokens in state:", tokens ? { hasAccessToken: !!tokens.accessToken, hasRefreshToken: !!tokens.refreshToken } : "null");
    
    // Try to get tokens from context state first (most reliable)
    let tokensToUse = tokens;
    
    // If not in state, try to get from storage
    if (!tokensToUse) {
      console.log("[v0] No tokens in state, attempting to retrieve from storage...");
      tokensToUse = getStoredTokens();
      console.log("[v0] Tokens retrieved from storage:", tokensToUse ? { hasAccessToken: !!tokensToUse.accessToken, hasRefreshToken: !!tokensToUse.refreshToken } : "null");
    }
    
    // Final fallback: check localStorage directly
    if (!tokensToUse) {
      console.log("[v0] No tokens found anywhere, checking localStorage directly...");
      try {
        const stored = typeof window !== "undefined" ? localStorage.getItem("sns_auth_tokens") : null;
        if (stored) {
          tokensToUse = JSON.parse(stored);
          console.log("[v0] Successfully retrieved tokens from localStorage");
          setTokensState(tokensToUse);
        }
      } catch (e) {
        console.log("[v0] Failed to parse localStorage tokens:", e.message);
      }
    }
    
    // If still no tokens and user exists, session expired
    if (!tokensToUse && user?.id) {
      console.log("[v0] No tokens found anywhere - session expired");
      const msg = "Session expired - please log in again to update profile";
      setError(msg);
      throw new Error(msg);
    }
    
    // If we only have refreshToken (no accessToken), refresh it
    if (!tokensToUse?.accessToken && tokensToUse?.refreshToken) {
      console.log("[v0] No accessToken but refreshToken available - attempting refresh...");
      const refreshedTokens = await refreshAccessToken();
      if (refreshedTokens?.accessToken) {
        tokensToUse = refreshedTokens;
        setTokensState(refreshedTokens);
        console.log("[v0] Token refreshed successfully");
      } else {
        const msg = "Failed to refresh access token";
        console.log("[v0]", msg);
        setError(msg);
        throw new Error(msg);
      }
    }
    
    // Final check for access token
    if (!tokensToUse?.accessToken) {
      const msg = "Not authenticated - please log in again";
      console.log("[v0]", msg);
      setError(msg);
      throw new Error(msg);
    }
    
    const accessToken = tokensToUse.accessToken;
    console.log("[v0] Using accessToken:", accessToken.substring(0, 20) + "...");
    
    const url = API.PROFILE_UPDATE.replace(":userId", userId);
    console.log("[v0] Making PUT request to:", url);
    
    // Determine if we're dealing with FormData (multipart) or JSON
    const isFormData = updates instanceof FormData;
    console.log("[v0] Request type:", isFormData ? "FormData (multipart)" : "JSON");
    
    const options = {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      body: isFormData ? updates : JSON.stringify(updates),
    };
    
    // Don't set Content-Type for FormData - browser will set it with boundary
    if (!isFormData) {
      options.headers["Content-Type"] = "application/json";
    }
    
    console.log("[v0] Request headers:", Object.keys(options.headers));
    const res = await fetch(url, options);
    console.log("[v0] Update profile response status:", res.status);
    const data = await res.json();
    console.log("[v0] Update profile response:", JSON.stringify(data, null, 2));
    if (!res.ok) {
      const msg = data.message || "Failed to update profile";
      setError(msg);
      throw new Error(msg);
    }
    
    // Update the user in state if successful
    if (res.ok && data.data) {
      const userData = data.data;
      const userObj = {
        id: userData.id || userData._id,
        email: userData.email,
        username: userData.username || "",
        fullName: userData.full_name || userData.fullName || userData.name || "",
        phone: userData.phone || "",
        avatar: userData.avatar_url || userData.avatar || "",
        banner: userData.banner_url || userData.banner || "",
        discord: userData.discord || "",
        bio: userData.bio || "",
        primaryGame: userData.primary_game || "",
        gameRole: userData.game_role || "",
        rank: userData.rank || "",
        continent: userData.continent || "",
        country: userData.country || "",
        region: userData.region || "",
        authMethod: user?.authMethod || "email",
        firebaseUid: user?.firebaseUid || null,
      };
      setUser(userObj);
      setStoredUser(userObj);
    }
    
    return data;
  }, [user]);

  /**
   * Get user profile
   * GET /auth/profile/:identifier
   */
  const getProfile = useCallback(async (identifier) => {
    try {
      const url = API.PROFILE_GET.replace(":identifier", identifier);
      const res = await authFetch(url);
      const data = await res.json();
      console.log("Get profile response:", JSON.stringify(data, null, 2));
      if (res.ok) {
        return data;
      }
      return null;
    } catch (err) {
      console.error("Get profile error:", err);
      return null;
    }
  }, []);

  const value = {
    // State
    user,
    loading,
    error,
    isAuthenticated: !!user,
    tokens,
    selectedTournamentCategory,
    setSelectedTournamentCategory,

    // Registration Flow (5 Steps)
    registerSendOTP,
    registerVerifyOTP,
    registerPersonalInfo,
    registerGamingProfile,
    registerProfileImages,

    // Login Flow
    loginSendOTP,
    loginVerifyOTP,

    // Backwards compatibility aliases
    signupSendOTP,
    signupVerifyOTP,
    loginWithEmail: loginSendOTP,
    verifyLoginOTP: loginVerifyOTP,
    signupWithEmail: signupSendOTP,
    verifySignupOTP: signupVerifyOTP,

    // Logout
    logout,

    // Profile
    fetchProfile,
    updateProfile,
    getProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
