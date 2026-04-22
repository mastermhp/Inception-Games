"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { useAuth } from '@/hooks/useAuth.js'
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProfileHeroBanner from "../components/ProfileComponents/ProfileHeroBanner";
import CareerStats from "../components/ProfileComponents/CareerStats";
import QuickInfo from "../components/ProfileComponents/QuickInfo";
import EventsSection from "../components/ProfileComponents/EventsSection";
import MatchHistory from "../components/ProfileComponents/MatchHistory";
import Availability from "../components/ProfileComponents/Availability";
import FeaturedCarousel from "../components/ProfileComponents/FeaturedCarousel";
import EditProfileModal from "../components/ProfileComponents/EditProfileModal";
import { useAuth } from "../context/AuthContext";
import NotificationsPanel from "../components/ProfileComponents/NotificationsPanel";

export default function ProfilePage() {
  const { user, isAuthenticated, loading, fetchProfile } = useAuth();
  const router = useRouter();
  const [gamingProfile, setGamingProfile] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    console.log("[v0] Profile page state:", {
      loading,
      isAuthenticated,
      user: user ? { id: user.id, email: user.email } : null,
      profileLoading,
    });
  }, [loading, isAuthenticated, user, profileLoading]);

  // Fetch user profile data on component mount
  useEffect(() => {
    if (!loading && isAuthenticated && user?.id) {
      console.log(
        "[v0] Profile page - fetching user profile for user ID:",
        user.id,
      );
      setProfileLoading(true);
      fetchProfile()
        .then(() => {
          console.log("[v0] Profile page - profile fetch completed");
          setProfileLoading(false);
        })
        .catch((err) => {
          console.error(
            "[v0] Profile page - profile fetch error:",
            err.message,
          );
          setProfileLoading(false);
        });
    } else if (!loading && !isAuthenticated) {
      console.log("[v0] Profile page - user not authenticated and loading complete");
      setProfileLoading(false);
    }
  }, [isAuthenticated, loading, user?.id, fetchProfile]);

  // Load gaming profile from sessionStorage whenever user changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("sns_gaming_profile");
        if (stored) {
          setGamingProfile(JSON.parse(stored));
        } else {
          setGamingProfile(null);
        }
      } catch {
        setGamingProfile(null);
      }
    }
  }, [user]);

  useEffect(() => {
    // Only redirect if loading is complete and user is not authenticated
    if (loading === false && !isAuthenticated) {
      console.log(
        "[v0] Profile page - user not authenticated, redirecting to home",
      );
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  if (!user || profileLoading) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-gray-500 text-sm">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  // Use user data from API which includes gaming profile data
  // The user object already contains primaryGame, gameRole, rank, region, etc. from the API
  const mergedUser = {
    ...user,
    // Use API data first, fallback to gamingProfile sessionStorage if needed
    username:
      user?.username ||
      gamingProfile?.username ||
      user?.fullName ||
      user?.email?.split("@")[0] ||
      "Player",
    bio: user?.bio || gamingProfile?.bio || "",
    primaryGame: user?.primaryGame || gamingProfile?.game || "",
    gameRole: user?.gameRole || gamingProfile?.role || "",
    region: user?.region || gamingProfile?.region || "",
    rank: user?.rank || gamingProfile?.rank || "",
    discord: user?.discord || gamingProfile?.discord || "",
    // Legacy fields for compatibility
    game: user?.primaryGame || gamingProfile?.game || "",
    role: user?.gameRole || gamingProfile?.role || "",
  };

  console.log("[v0] Profile page - mergedUser data:", {
    username: mergedUser.username,
    primaryGame: mergedUser.primaryGame,
    gameRole: mergedUser.gameRole,
    rank: mergedUser.rank,
    region: mergedUser.region,
  });

  return (
    <div className="min-h-screen bg-[#060608] flex flex-col">
      <Header />

      <main className="flex-1 pt-28 pb-20">
        {/* Subtle ambient glow */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-purple-600/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-600/[0.04] rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Banner */}
          <div className="mb-8">
            <ProfileHeroBanner
              user={mergedUser}
              onEditProfile={() => setEditProfileOpen(true)}
            />
          </div>

          {/* Player Info + Notifications */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <QuickInfo user={mergedUser} />
            </div>
            <div className="col-span-1">
              <NotificationsPanel />
            </div>
          </div>

          {/* Featured Carousel - Jobs, Career, Merch */}
          <div className="mb-8">
            <FeaturedCarousel />
          </div>

          {/* Events Section */}
          <div className="space-y-6">
            <EventsSection user={mergedUser} />
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        user={mergedUser}
        gamingProfile={gamingProfile}
        onProfileUpdate={(updated) => {
          setGamingProfile(updated);
          if (typeof window !== "undefined") {
            sessionStorage.setItem(
              "sns_gaming_profile",
              JSON.stringify(updated),
            );
          }
        }}
      />
    </div>
  );
}
