"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

const districts = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barisal",
  "Bhola",
  "Bogra",
  "Brahmanbaria",
  "Chandpur",
  "Chittagong",
  "Chuadanga",
  "Comilla",
  "Cox's Bazar",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jessore",
  "Jhalokati",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Nawabganj",
  "Netrakona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
  "Jashore",
];

const platforms = ["PC", "Mobile", "Console"];

const gamesList = [
  "PUBG",
  "Valorant",
  "CS:GO",
  "Fortnite",
  "League of Legends",
  "Dota 2",
  "Apex Legends",
  "Call of Duty",
  "Overwatch",
  "Rocket League",
  "FIFA",
  "Free Fire",
];

const socialPlatforms = [
  "YouTube",
  "Twitch",
  "Facebook",
  "Instagram",
  "TikTok",
  "Discord",
];

const sponsorshipOptions = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
  { value: "ending_soon", label: "Yes but ending soon" },
];

const countryCodes = [
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+1", country: "USA / Canada / NANP territories", flag: "🇺🇸/🇨🇦" },
  { code: "+7", country: "Russia / Kazakhstan", flag: "🇷🇺/🇰🇿" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },
  { code: "+39", country: "Italy / Vatican City", flag: "🇮🇹/🇻🇦" },
  { code: "+40", country: "Romania", flag: "🇷🇴" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+95", country: "Myanmar", flag: "🇲🇲" },
  { code: "+98", country: "Iran", flag: "🇮🇷" },
  { code: "+211", country: "South Sudan", flag: "🇸🇸" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { code: "+218", country: "Libya", flag: "🇱🇾" },
  // …continued through codes like +380 (Ukraine), +385 (Croatia), +593 (Ecuador), etc.
];

export default function SignupModal({ isOpen, onClose, selectedPlan }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    ingameName: "",
    email: "",
    countryCode: "+880",
    phone: "",
    district: "",
    platform: "",
    primaryGameTitles: "",
    secondaryGameTitles: "", // Changed from array to single string
    isSponsored: "",
    monthlyIncomeRange: "",
    socials: [{ platform: "", url: "" }],
    bio: "",
  });

  const getPlanFeatures = (planName) => {
    const planFeatures = {
      BASIC: [
        "Global Gamer Profile on Slice N Share",
        "Access to Free Training Resources",
        "Monthly Gamer Meetups",
        "Discount on 20 Lifestyle Apps",
        "Mental Health Support",
        "Exclusive Networking Opportunities",
        "Limited Chance to Be Scouted by Sponsors",
        "Limited Community Support & Feedback",
        "Entry in Tournaments with Prize Pools",
        "Earn from Limited Scrims",
        "Limited Opportunities for Brand Collaboration",
        "Noob to Pro Pathway",
      ],
      STANDARD: [
        "Monthly Salary Based on Performance",
        "Personalized Gamer Profile",
        "Bootcamp once in 4 months",
        "Content Creation Support & Guidelines",
        "Mental Health Support from Specialized Doctors",
        "Priority Entry in Monthly Tournaments",
        "Unlimited Scrims Earning Priority",
        "Priority Access to Sponsorship Deals",
        "Regular in-person coaching from Pro Players",
        "Multiple Brand Collaborations",
        "Support for International Tournaments",
        "Priority Selection in Slice N Share Esports Teams",
        "Exclusive Slice N Share Branding",
        "AI Tools for Gamers",
        "Device Support on Demand",
        "Discounts at 100+ Lifestyle Brands",
      ],
      ADVANCED: [
        "Global Gamer Profile on Slice N Share",
        "Content Creation Support",
        "Access to Slice N Share HQ for Bootcamps",
        "Mental Health Support with Doctors (Priority++)",
        "Device Support on Demand",
        "Entry in Ranked Monthly Tournaments",
        "Unlimited Scrim Earning Opportunities",
        "Unlimited Sponsorship Matchmaking",
        "1:1 Coaching & Elite Mentorship",
        "Full Support for International Tournaments",
        "Priority Recruitment to Slice N Share Esports Team",
        "Unlimited Specialized Slice N Share Branding",
        "Unlimited Global Media Features",
        "Access to AI-Powered Training & Performance Tools",
        "500+ Discounts on Global & Local Lifestyle Brands",
      ],
    };
    return planFeatures[planName?.toUpperCase()] || [];
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSocialChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      socials: prev.socials.map((social, i) =>
        i === index ? { ...social, [field]: value } : social
      ),
    }));
  };

  const addSocialField = () => {
    setFormData((prev) => ({
      ...prev,
      socials: [...prev.socials, { platform: "", url: "" }],
    }));
  };

  const removeSocialField = (index) => {
    setFormData((prev) => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const baseURL = "https://perturbatious-brainlike-maliyah.ngrok-free.dev";
      const phone = `${formData.countryCode}${formData.phone}`;

      // Step 1: Send OTP
      const sendOTPResponse = await fetch(`${baseURL}/auth/register/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: phone,
        }),
      });

      if (!sendOTPResponse.ok) {
        const errorData = await sendOTPResponse.json();
        throw new Error(errorData?.message || "Failed to send OTP");
      }

      // For now, show success since full multi-step would require user input between steps
      // In a real scenario, you'd have a multi-step modal similar to UnifiedAuthModal
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          fullName: "",
          ingameName: "",
          email: "",
          countryCode: "+880",
          phone: "",
          district: "",
          platform: "",
          primaryGameTitles: "",
          secondaryGameTitles: "",
          isSponsored: "",
          monthlyIncomeRange: "",
          socials: [{ platform: "", url: "" }],
          bio: "",
        });
      }, 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#0D0D0D] rounded-2xl p-8 max-w-4xl w-full relative"
            style={{
              maxHeight: success ? "auto" : "90vh",
              height: success ? "600px" : "auto",
              overflow: success ? "hidden" : "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Join Slice N Share - {selectedPlan} Plan
                </h2>
                <p className="text-gray-400">
                  Fill out the form to get started
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Success State Overlay */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 bg-[#0D0D0D] rounded-2xl flex flex-col items-center justify-center z-50 overflow-hidden"
                style={{
                  margin: 0,
                  width: "100%",
                  height: "100%",
                  minHeight: "600px",
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6"
                >
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center max-w-md px-6"
                >
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Welcome to Slice N Share!
                  </h3>
                  <p className="text-gray-400 text-base mb-6">
                    Your registration for the{" "}
                    <span className="text-purple-400 font-semibold">
                      {selectedPlan} Plan
                    </span>{" "}
                    was successful! We&apos;re excited to have you on board.
                  </p>

                  <div className="bg-[#171717] rounded-lg p-4 mb-6">
                    <h4 className="text-white font-semibold mb-2">
                      What&apos;s Next?
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-1 text-left">
                      <li>• Our team will review your application</li>
                      <li>
                        • You&apos;ll receive a confirmation email within 24
                        hours
                      </li>
                      <li>• We&apos;ll contact you to set up your profile</li>
                      <li>• Get ready to level up your gaming journey!</li>
                    </ul>
                  </div>

                  {/* Animated progress bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.6, duration: 4 }}
                      className="bg-gradient-to-r from-purple-500 to-green-500 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Modal will close automatically
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Plan Features Display */}
            {!success && selectedPlan && (
              <div className="mb-8 bg-[#171717] rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  {selectedPlan} Plan Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto">
                  {getPlanFeatures(selectedPlan).map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="flex-shrink-0 mt-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      </div>
                      <span className="text-gray-300 text-sm leading-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500 rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}

                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#171717] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      In-Game Name (IGN) *
                    </label>
                    <input
                      type="text"
                      name="ingameName"
                      value={formData.ingameName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#171717] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#171717] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Phone *
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleInputChange}
                        className="px-3 py-3 bg-[#171717] rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 min-w-[100px]"
                        disabled={loading}
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="1XXXXXXXXX"
                        className="flex-1 px-4 py-3 bg-[#171717] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* District and Monthly Income */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      District *
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#171717] rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      required
                      disabled={loading}
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Monthly Income Range
                    </label>
                    <select
                      name="monthlyIncomeRange"
                      value={formData.monthlyIncomeRange}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#171717] rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      disabled={loading}
                    >
                      <option value="">Select Range</option>
                      <option value="0-3K">0-3K BDT</option>
                      <option value="3-6K">3-6K BDT</option>
                      <option value="6-10K">6-10K BDT</option>
                      <option value="10K+">10K+ BDT</option>
                    </select>
                  </div>
                </div>

                {/* Gaming Platform - Single Selection */}
                <div>
                  <label className="block text-white text-sm font-medium mb-3">
                    Gaming Platform *
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {platforms.map((platform) => (
                      <label
                        key={platform}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="platform"
                          value={platform}
                          checked={formData.platform === platform}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-purple-600 bg-[#171717] border-gray-600 focus:ring-purple-500"
                          required
                          disabled={loading}
                        />
                        <span className="text-gray-300">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Primary Game - Single Selection Required */}
                <div>
                  <label className="block text-white text-sm font-medium mb-3">
                    Primary Game Title *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gamesList.map((game) => (
                      <label
                        key={game}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="primaryGameTitles"
                          value={game}
                          checked={formData.primaryGameTitles === game}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-purple-600 bg-[#171717] border-gray-600 focus:ring-purple-500"
                          required
                          disabled={loading}
                        />
                        <span className="text-gray-300 text-sm">{game}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Secondary Game - Single Selection Optional */}
                <div>
                  <label className="block text-white text-sm font-medium mb-3">
                    Secondary Game Title (Optional)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gamesList.map((game) => (
                      <label
                        key={game}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="secondaryGameTitles"
                          value={game}
                          checked={formData.secondaryGameTitles === game}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-purple-600 bg-[#171717] border-gray-600 focus:ring-purple-500"
                          disabled={loading}
                        />
                        <span className="text-gray-300 text-sm">{game}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <label className="block text-white text-sm font-medium mb-3">
                    Social Media Profiles
                  </label>
                  {formData.socials.map((social, index) => (
                    <div key={index} className="flex gap-3 mb-3">
                      <select
                        value={social.platform}
                        onChange={(e) =>
                          handleSocialChange(index, "platform", e.target.value)
                        }
                        className="px-4 py-3 bg-[#171717] rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        disabled={loading}
                      >
                        <option value="">Select Platform</option>
                        {socialPlatforms.map((platform) => (
                          <option key={platform} value={platform}>
                            {platform}
                          </option>
                        ))}
                      </select>
                      <input
                        type="url"
                        value={social.url}
                        onChange={(e) =>
                          handleSocialChange(index, "url", e.target.value)
                        }
                        placeholder="Profile URL"
                        className="flex-1 px-4 py-3 bg-[#171717] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        disabled={loading}
                      />
                      {formData.socials.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSocialField(index)}
                          className="px-3 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          disabled={loading}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSocialField}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                    disabled={loading}
                  >
                    + Add Another Social Profile
                  </button>
                </div>

                {/* Sponsorship - Three Options */}
                <div>
                  <label className="block text-white text-sm font-medium mb-3">
                    Do you have any Sponsorship? *
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {sponsorshipOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="isSponsored"
                          value={option.value}
                          checked={formData.isSponsored === option.value}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-purple-600 bg-[#171717] border-gray-600 focus:ring-purple-500"
                          required
                          disabled={loading}
                        />
                        <span className="text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    What kind of supports do you need from us?
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Write down your answers"
                    className="w-full px-4 py-3 bg-[#171717] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                    disabled={loading}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing Up...</span>
                    </div>
                  ) : (
                    "Submit & Join Slice N Share"
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
