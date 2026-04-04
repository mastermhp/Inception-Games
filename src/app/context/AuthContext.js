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
} from "@/lib/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export { AuthContext };

export function AuthProvider({ children }) {

      const router = useRouter();


  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from storage on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    const tokens = getTokens();
    console.log("[v0] AuthProvider init - stored user:", storedUser?.email, "has tokens:", !!tokens?.accessToken);
    if (storedUser && tokens?.accessToken) {
      setUser(storedUser);
      // Fetch fresh profile in background
      fetchProfile().catch((err) => {
        console.log("[v0] Background profile fetch failed, keeping stored user:", err.message);
      });
    }
    setLoading(false);
  }, []);

  /**
   * Fetch user profile from API (GET /api/v1/auth/profile/:userId)
   */
  const fetchProfile = useCallback(async () => {
    try {
      const storedUser = getStoredUser();
      if (!storedUser?.id) {
        console.log("[v0] No stored user ID for profile fetch");
        return;
      }
      const url = API.PROFILE_GET.replace(":userId", storedUser.id);
      console.log("[v0] Fetching profile from:", url);
      const res = await authFetch(url);
      const data = await res.json();
      console.log("[v0] Profile API response:", JSON.stringify(data, null, 2));

      if (res.ok) {
        const userData = data.data || data;
        const userObj = {
          id: userData.id || userData._id,
          email: userData.email,
          fullName: userData.fullName || userData.name || "",
          phone: userData.phone || "",
          avatar: userData.avatar || "",
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

  // ============================================
  // EMAIL/OTP AUTH METHODS
  // ============================================

  /**
   * Email/OTP Login: Step 1 - Send OTP
   * POST /auth/login/send-otp  body: { email }
   */
  const loginSendOTP = useCallback(async (email) => {
    setError(null);
    console.log("[v0] Login - sending OTP to:", email);
    const res = await fetch(API.LOGIN_SEND_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    console.log("[v0] Login send OTP response:", JSON.stringify(data, null, 2));
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
    console.log("[v0] Login - verifying OTP for:", email);
    const res = await fetch(API.LOGIN_VERIFY_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: String(otp).trim() }),
    });
    const data = await res.json();
    console.log("[v0] Login verify OTP response:", JSON.stringify(data, null, 2));
    if (!res.ok) {
      const msg = data.error || data.message || "Invalid OTP";
      setError(msg);
      throw new Error(msg);
    }

    // Extract tokens
    const tokens = {
      accessToken: data.accessToken || data.token,
      refreshToken: data.refreshToken || ""
    };
    console.log("[v0] Login tokens received - accessToken:", tokens.accessToken?.substring(0, 20) + "...");
    setTokens(tokens);

    const userObj = {
      id: data.userId || data.user?.id || data.id,
      email: data.email || email,
      fullName: data.fullName || data.full_name || "",
      phone: data.phone || "",
      avatar: data.avatar_url || "",
      authMethod: "email",
    };
    console.log("[v0] Login user object:", userObj);
    setUser(userObj);
    setStoredUser(userObj);

    // Fetch full profile in background
    fetchProfile().catch(() => {});

    // Redirect to profile page after login
    setTimeout(() => {
      router.push("/profile");
    }, 500);

    return { user: userObj, tokens };
  }, [fetchProfile]);

  /**
   * Registration Flow Step 1 - Send OTP
   * POST /auth/register/send-otp  body: { email, phone? }
   */
  const registerSendOTP = useCallback(async (email, phone) => {
    setError(null);
    const body = { email };
    if (phone) body.phone = phone;
    console.log("[v0] Register send OTP:", JSON.stringify(body));
    const res = await fetch(API.REGISTER_SEND_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log("[v0] Register send OTP response:", res.status, JSON.stringify(data));
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
    console.log("[v0] Register verify OTP for:", email);
    const res = await fetch(API.REGISTER_VERIFY_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: otpStr }),
    });
    const data = await res.json();
    console.log("[v0] Register verify OTP response:", res.status, JSON.stringify(data));
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
   * POST /auth/register/personal-info  body: { email, full_name, username }
   */
  const registerPersonalInfo = useCallback(async (email, fullName, username) => {
    setError(null);
    console.log("[v0] Register personal info for:", email);
    const res = await fetch(API.REGISTER_PERSONAL_INFO, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, full_name: fullName, username }),
    });
    const data = await res.json();
    console.log("[v0] Register personal info response:", res.status, JSON.stringify(data));
    if (!res.ok) {
      const msg = data.error || data.message || "Failed to save personal info";
      setError(msg);
      throw new Error(msg);
    }
    return data;
  }, []);

  /**
   * Registration Flow Step 4 - Save Gaming Profile
   * POST /auth/register/gaming-profile  body: { email, primary_game, game_role, rank, continent, country }
   */
  const registerGamingProfile = useCallback(async (email, gameData) => {
    setError(null);
    console.log("[v0] Register gaming profile for:", email);
    const res = await fetch(API.REGISTER_GAMING_PROFILE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ...gameData }),
    });
    const data = await res.json();
    console.log("[v0] Register gaming profile response:", res.status, JSON.stringify(data));
    if (!res.ok) {
      const msg = data.error || data.message || "Failed to save gaming profile";
      setError(msg);
      throw new Error(msg);
    }
    return data;
  }, []);

  /**
   * Registration Flow Step 5 - Upload Profile Images
   * POST /auth/register/profile-images  body: { email, avatar_url?, banner_url? }
   */
  const registerProfileImages = useCallback(async (email, avatarUrl, bannerUrl) => {
    setError(null);
    console.log("[v0] Register profile images for:", email);
    const body = { email };
    if (avatarUrl) body.avatar_url = avatarUrl;
    if (bannerUrl) body.banner_url = bannerUrl;
    const res = await fetch(API.REGISTER_PROFILE_IMAGES, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log("[v0] Register profile images response:", res.status, JSON.stringify(data));
    if (!res.ok) {
      const msg = data.error || data.message || "Failed to upload images";
      setError(msg);
      throw new Error(msg);
    }

    // After successful registration, store tokens and user
    if (data.accessToken) {
      const tokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || ""
      };
      setTokens(tokens);
    }

    const userObj = {
      id: data.userId || data.user?.id,
      email: email,
      fullName: data.full_name || "",
      phone: data.phone || "",
      avatar: avatarUrl || "",
      authMethod: "email",
    };
    setUser(userObj);
    setStoredUser(userObj);
    sessionStorage.removeItem("temp_userId");

    // Redirect to profile page after registration completion
    setTimeout(() => {
      router.push("/profile");
    }, 500);

    return data;
  }, []);

  // Backwards compatibility aliases for signup
  const signupSendOTP = registerSendOTP;
  const signupVerifyOTP = registerVerifyOTP;

  /**
   * Logout - clear tokens and user session
   */
  const logout = useCallback(async () => {
    console.log("[v0] Logging out...");
    clearTokens();
    setUser(null);
    setError(null);
    console.log("[v0] Session cleared");
  }, []);

  // ============================================
  // PROFILE MANAGEMENT
  // ============================================

  /**
   * Update user profile
   * PUT /auth/profile/:userId  body: { field updates }
   */
  const updateProfile = useCallback(async (userId, updates) => {
    setError(null);
    console.log("[v0] Updating profile for:", userId);
    const url = API.PROFILE_UPDATE.replace(":userId", userId);
    const res = await authFetch(url, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    console.log("[v0] Update profile response:", JSON.stringify(data, null, 2));
    if (!res.ok) {
      const msg = data.message || "Failed to update profile";
      setError(msg);
      throw new Error(msg);
    }
    return data;
  }, []);

  /**
   * Get user profile
   * GET /auth/profile/:identifier
   */
  const getProfile = useCallback(async (identifier) => {
    try {
      const url = API.PROFILE_GET.replace(":identifier", identifier);
      const res = await authFetch(url);
      const data = await res.json();
      console.log("[v0] Get profile response:", JSON.stringify(data, null, 2));
      if (res.ok) {
        return data;
      }
      return null;
    } catch (err) {
      console.error("[v0] Get profile error:", err);
      return null;
    }
  }, []);

  const value = {
    // State
    user,
    loading,
    error,
    isAuthenticated: !!user,

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
