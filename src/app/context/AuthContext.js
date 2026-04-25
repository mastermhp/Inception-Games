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

  // NOTE: There is no GET /profile/:userId endpoint in the API
  // Profile data is collected during registration and can only be updated via updateProfile
  // which uses separate endpoints for personal info, gaming profile, and images

  // Initialize auth state from storage on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    const tokens = getTokens();
    
    if (storedUser) {
      setUser(storedUser);
      
      // Profile data is available from stored user - no need to fetch separately
    }
    setLoading(false);
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
    const res = await fetch(API.LOGIN_SEND_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
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
    const res = await fetch(API.LOGIN_VERIFY_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: String(otp).trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.error || data.message || "Invalid OTP";
      setError(msg);
      throw new Error(msg);
    }

    // Extract tokens from various possible response formats
    // Try all possible token property names and nested paths
    let accessToken = data.accessToken || data.access_token || data.token || data.user?.token || data.data?.token || data.data?.accessToken || data.data?.access_token;
    let refreshToken = data.refreshToken || data.refresh_token || data.user?.refreshToken || data.user?.refresh_token || data.data?.refreshToken || data.data?.refresh_token;
    
    // If still no token found, try looking in authentication/tokens object
    if (!accessToken && data.authentication) {
      accessToken = data.authentication.accessToken || data.authentication.access_token || data.authentication.token;
      refreshToken = data.authentication.refreshToken || data.authentication.refresh_token;
    }
    
    // IMPORTANT: If still no token found, store email+otp for session management (for backends without token system)
    if (!accessToken) {
      // Create a session token marker that includes email for auth purposes
      accessToken = `email-otp-auth:${email}`;
    }
    
    const tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken || "",
      email: email,  // Store email for auth fallback
      otp: String(otp).trim()  // Store OTP for auth fallback
    };
    setTokens(tokens);
    setTokensState(tokens);

    // Build user object with all available data from login response
    // API returns { success: true, user: {...} } format
    let userData = data.user || data.data || data;
    
    const userObj = {
      id: userData?.id || userData?._id || userData?.userId,
      email: userData?.email || email,
      username: userData?.username || userData?.gamer_tag || "",
      fullName: userData?.fullName || userData?.full_name || userData?.name || "",
      phone: userData?.phone || "",
      avatar: userData?.avatar_url || userData?.avatar || userData?.avatarUrl || "",
      banner: userData?.banner_url || userData?.banner || userData?.bannerUrl || "",
      discord: userData?.discord || userData?.discordId || "",
      bio: userData?.bio || userData?.biography || "",
      primaryGame: userData?.primary_game || userData?.primaryGame || userData?.game || "",
      gameRole: userData?.game_role || userData?.gameRole || userData?.role || "",
      rank: userData?.rank || userData?.ranking || "",
      continent: userData?.continent || "",
      country: userData?.country || "",
      region: userData?.region || "",
      authMethod: "email",
    };
    if (!userObj.id) {
      userObj.id = userData?.userId || userData?.id || `user_${Date.now()}`;
    }
    if (!userObj.email) {
      userObj.email = email;
    }
    setUser(userObj);
    setStoredUser(userObj);

    // Redirect to profile page after login
    setTimeout(() => {
      router.push("/profile");
    }, 500);

    return { user: userObj, tokens };
  }, [router]);

  /**
   * Registration Flow Step 1 - Send OTP
   * POST /auth/register/send-otp  body: { email, phone? }
   */
  const registerSendOTP = useCallback(async (email, phone) => {
    setError(null);
    const body = { email };
    if (phone) body.phone = phone;
    const res = await fetch(API.REGISTER_SEND_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
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
    const res = await fetch(API.REGISTER_VERIFY_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: otpStr }),
    });
    const data = await res.json();
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
    const body = { email, full_name: fullName, username };
    if (discord) body.discord = discord;
    if (bio) body.bio = bio;
    
    const res = await fetch(API.REGISTER_PERSONAL_INFO, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
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
    const res = await fetch(API.REGISTER_GAMING_PROFILE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ...gameData }),
    });
    const data = await res.json();
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
   * Complete Registration - No image upload needed at signup
   * Simply finalize the registration with the gaming profile that was already saved
   */
  const registerProfileImages = useCallback(async (email) => {
    setError(null);
    
    // Retrieve personal info from sessionStorage including gaming profile
    let registrationInfo = {};
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("sns_registration_info");
        if (stored) {
          registrationInfo = JSON.parse(stored);
        }
      } catch (e) {
        // Could not retrieve registration info
      }
    }

    // Get userId from sessionStorage if available
    const userId = typeof window !== "undefined" ? sessionStorage.getItem("temp_userId") : null;
    
    // Build complete user object with all registration data from the previous steps
    const userObj = {
      id: userId || `user_${Date.now()}`,
      email: email,
      username: registrationInfo.username || "",
      fullName: registrationInfo.fullName || "",
      phone: registrationInfo.phone || "",
      avatar: "",
      banner: "",
      discord: registrationInfo.discord || "",
      bio: registrationInfo.bio || "",
      primaryGame: registrationInfo.primaryGame || "",
      gameRole: registrationInfo.gameRole || "",
      rank: registrationInfo.rank || "",
      continent: registrationInfo.continent || "",
      country: registrationInfo.country || "",
      region: registrationInfo.region || "",
      authMethod: "email",
    };
    
    // Create a session token marker since API may not return tokens
    const accessToken = `email-otp-auth:${email}`;
    const tokens = {
      accessToken: accessToken,
      refreshToken: "",
      email: email,
      otp: ""
    };
    
    setTokens(tokens);
    setTokensState(tokens);
    
    setUser(userObj);
    setStoredUser(userObj);
    
    // Clean up session storage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("temp_userId");
      sessionStorage.removeItem("sns_registration_info");
    }

    // Redirect to profile page after registration completion
    setTimeout(() => {
      router.push("/profile");
    }, 500);

    return { success: true, message: "Registration completed successfully" };
  }, [router]);

  // Backwards compatibility aliases for signup
  const signupSendOTP = registerSendOTP;
  const signupVerifyOTP = registerVerifyOTP;

  /**
   * Logout - clear tokens and user session
   */
  const logout = useCallback(async () => {
    clearTokens();
    setUser(null);
    setError(null);
  }, []);

  // ============================================
  // PROFILE MANAGEMENT
  // ============================================

  /**
   * Update user profile via API - PUT /profile/:userId with FormData and Bearer token
   * Sends all profile data including optional images as FormData
   * Updates local state after successful API response
   */
  const updateProfile = useCallback(async (userId, formDataToSend) => {
    setError(null);
    
    try {
      // Get current user and tokens
      const currentUser = user || getStoredUser();
      const storedTokens = getStoredTokens();
      
      if (!currentUser?.id) {
        throw new Error("User not found - cannot update profile");
      }
      
      if (!storedTokens?.accessToken) {
        throw new Error("Not authenticated - please log in again");
      }
      
      // Build the API URL
      const url = API.PROFILE_UPDATE.replace(":userId", userId);
      
      // Make PUT request with FormData and Bearer token
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${storedTokens.accessToken}`,
        },
        body: formDataToSend,
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        const errorMsg = responseData.message || responseData.error || "Failed to update profile";
        throw new Error(errorMsg);
      }
      
      // Extract updated user data from API response
      const apiUserData = responseData.data || responseData.user || responseData;
      
      // Create updated user object with values from form + API response
      const updatedUser = {
        ...currentUser,
        id: userId,
        fullName: formDataToSend.get('full_name') || apiUserData.full_name || currentUser.fullName || "",
        username: formDataToSend.get('username') || apiUserData.username || currentUser.username || "",
        phone: formDataToSend.get('phone') || apiUserData.phone || currentUser.phone || "",
        bio: formDataToSend.get('bio') || apiUserData.bio || currentUser.bio || "",
        discord: formDataToSend.get('discord') || apiUserData.discord || currentUser.discord || "",
        primaryGame: formDataToSend.get('primary_game') || apiUserData.primary_game || currentUser.primaryGame || "",
        gameRole: formDataToSend.get('game_role') || apiUserData.game_role || currentUser.gameRole || "",
        rank: formDataToSend.get('rank') || apiUserData.rank || currentUser.rank || "",
        continent: formDataToSend.get('continent') || apiUserData.continent || currentUser.continent || "",
        country: formDataToSend.get('country') || apiUserData.country || currentUser.country || "",
        avatar: apiUserData.avatar_url || apiUserData.avatar || currentUser.avatar || "",
        banner: apiUserData.banner_url || apiUserData.banner || currentUser.banner || "",
      };
      
      // Update React state
      setUser(updatedUser);
      
      // Update localStorage
      setStoredUser(updatedUser);
      
      return { success: true, message: "Profile updated successfully", data: updatedUser };
    } catch (err) {
      const errorMsg = err.message || "Failed to update profile";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [user]);



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
    updateProfile,
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
