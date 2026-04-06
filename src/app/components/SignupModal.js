// "use client";
// import { motion, AnimatePresence } from "framer-motion";
// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { X, Camera, ImageIcon, User, AtSign, Phone, MessageCircle, FileText, Gamepad2, Globe, Award, MapPin, ChevronRight, Loader2, Check, Mail } from "lucide-react";
// import { useAuth } from "@/app/context/AuthContext";
// import { REGION_DATA, CONTINENTS } from "@/lib/regionData";

// const gamesList = [
//   "PUBG",
//   "Valorant",
//   "CS:GO",
//   "Fortnite",
//   "League of Legends",
//   "Dota 2",
//   "Apex Legends",
//   "Call of Duty",
//   "Overwatch",
//   "Rocket League",
//   "FIFA",
//   "Free Fire",
// ];

// const ROLES = {
//   Valorant: ["Duelist", "Controller", "Initiator", "Sentinel"],
//   "League of Legends": ["Top", "Jungle", "Mid", "ADC", "Support"],
//   "CS:GO": ["Rifler", "AWPer", "Support", "Entry", "IGL"],
//   "Dota 2": ["Carry", "Mid", "Off-lane", "Support", "Hard Support"],
//   Fortnite: ["Solo", "Team", "Creative"],
//   "Apex Legends": ["Assault", "Tracker", "Support", "Recon"],
//   PUBG: ["Assaulter", "Sniper", "Support", "IGL", "Scout"],
//   "Free Fire": ["Rusher", "Sniper", "Support", "Leader"],
//   "Call of Duty": ["Slayer", "Objective", "Support", "Anchor", "Flex"],
//   Overwatch: ["Tank", "Damage", "Support"],
//   "Rocket League": ["Goalkeeper", "Forward", "Mid", "Flex"],
//   FIFA: ["Striker", "Midfielder", "Defender", "Goalkeeper"],
// };

// const RANKS = {
//   Valorant: ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ascendant", "Immortal", "Radiant"],
//   "League of Legends": ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster", "Challenger"],
//   "CS:GO": ["Silver 1", "Silver 2", "SEM", "Gold Nova", "GN2", "GN3", "MG", "DMG", "LE", "LEM", "SMFC", "Global"],
//   "Dota 2": ["Herald", "Guardian", "Crusader", "Archon", "Legend", "Ancient", "Divine", "Immortal"],
//   Fortnite: ["Open", "Contender", "Champion"],
//   "Apex Legends": ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Apex Predator"],
//   PUBG: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Crown", "Ace", "Conqueror"],
//   "Free Fire": ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Heroic", "Grandmaster"],
//   "Call of Duty": ["Rookie", "Veteran", "Elite", "Pro", "Master", "Grandmaster", "Legendary"],
//   Overwatch: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster", "Top 500"],
//   "Rocket League": ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Champion", "Grand Champion", "Supersonic Legend"],
//   FIFA: ["Division 10", "Division 9", "Division 8", "Division 7", "Division 6", "Division 5", "Division 4", "Division 3", "Division 2", "Division 1"],
// };

// const countryCodes = [
//   { code: "+880", flag: "🇧🇩" },
//   { code: "+91", flag: "🇮🇳" },
//   { code: "+1", flag: "🇺🇸" },
//   { code: "+44", flag: "🇬🇧" },
//   { code: "+61", flag: "🇦🇺" },
// ];

// export default function SignupModal({ isOpen, onClose, selectedPlan }) {
//   const router = useRouter();
//   const { registerPersonalInfo, registerGamingProfile, registerProfileImages } = useAuth();
  
//   const [step, setStep] = useState(1); // 1: Personal, 2: Gaming, 3: Images
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     username: "",
//     email: "",
//     countryCode: "+880",
//     phone: "",
//     discord: "",
//     bio: "",
//     game: "",
//     role: "",
//     rank: "",
//     continent: "",
//     country: "",
//     city: "",
//   });

//   const [profileImagePreview, setProfileImagePreview] = useState(null);
//   const [bannerImagePreview, setBannerImagePreview] = useState(null);
//   const profileInputRef = useRef(null);
//   const bannerInputRef = useRef(null);

//   useEffect(() => {
//     if (!isOpen) {
//       setStep(1);
//       setError("");
//       setFormData({
//         fullName: "",
//         username: "",
//         email: "",
//         countryCode: "+880",
//         phone: "",
//         discord: "",
//         bio: "",
//         game: "",
//         role: "",
//         rank: "",
//         continent: "",
//         country: "",
//         city: "",
//       });
//       setProfileImagePreview(null);
//       setBannerImagePreview(null);
//     }
//   }, [isOpen]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "game" && { role: "", rank: "" }),
//       ...(name === "continent" && { country: "", city: "" }),
//       ...(name === "country" && { city: "" }),
//     }));
//   };

//   const handleImageChange = (e, type) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (file.size > 5 * 1024 * 1024) {
//       setError("Image must be less than 5MB");
//       return;
//     }
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       if (type === "profile") setProfileImagePreview(reader.result);
//       else setBannerImagePreview(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleNextStep = () => {
//     if (step === 1) {
//       if (!formData.fullName || !formData.username || !formData.email || !formData.phone) {
//         setError("Please fill all required fields");
//         return;
//       }
//       setError("");
//       setStep(2);
//     } else if (step === 2) {
//       setError("");
//       setStep(3);
//     }
//   };

//   const handlePreviousStep = () => {
//     setStep(step - 1);
//     setError("");
//   };

//   const handleCompleteRegistration = async () => {
//     setSaving(true);
//     try {
//       console.log("[v0] Starting registration with email:", formData.email);
      
//       // Step 1: Save personal info
//       console.log("[v0] Saving personal info...");
//       await registerPersonalInfo(formData.email, formData.fullName, formData.username);

//       // Step 2: Save gaming profile if selected
//       if (formData.game) {
//         console.log("[v0] Saving gaming profile...");
//         await registerGamingProfile(formData.email, {
//           primary_game: formData.game,
//           game_role: formData.role || undefined,
//           rank: formData.rank || undefined,
//           continent: formData.continent || undefined,
//           country: formData.country || undefined,
//         });
//       }

//       // Step 3: Save images and redirect (registerProfileImages handles redirect)
//       if (profileImagePreview || bannerImagePreview) {
//         console.log("[v0] Saving profile images...");
//         await registerProfileImages(formData.email, profileImagePreview, bannerImagePreview);
//       } else {
//         // If no images, manually redirect
//         console.log("[v0] No images, redirecting to profile...");
//         setSuccess(true);
//         setTimeout(() => {
//           onClose();
//           router.push("/profile");
//         }, 1500);
//       }
//     } catch (err) {
//       console.error("[v0] Registration error:", err);
//       setError(err.message || "Failed to complete registration");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const inputClass = "w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition text-sm";
//   const selectClass = "w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition text-sm appearance-none cursor-pointer";

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           <motion.div
//             className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//           />
//           <motion.div
//             className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
//             initial={{ scale: 0.92, opacity: 0, y: 30 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.92, opacity: 0, y: 30 }}
//             transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 28 }}
//             onClick={(e) => e.stopPropagation()}
//             style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(168,85,247,0.3) transparent' }}
//           >
//             <div className="relative bg-[#111118] rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
//               {/* Header */}
//               <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
//                 <div>
//                   <h2 className="text-xl font-bold text-white">Join Slice N Share</h2>
//                   <p className="text-gray-500 text-xs mt-1">
//                     {step === 1 && "Complete your profile"}
//                     {step === 2 && "Select your gaming info"}
//                     {step === 3 && "Upload your images"}
//                   </p>
//                 </div>
//                 <motion.button
//                   onClick={onClose}
//                   className="text-gray-500 hover:text-white transition p-2 hover:bg-white/5 rounded-lg disabled:opacity-50"
//                   disabled={saving}
//                 >
//                   <X size={20} />
//                 </motion.button>
//               </div>

//               {/* Success State */}
//               {success && (
//                 <div className="p-12 text-center">
//                   <motion.div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ delay: 0.2, type: "spring" }}
//                     className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
//                   >
//                     <Check size={32} className="text-green-400" />
//                   </motion.div>
//                   <h3 className="text-xl font-bold text-white mb-2">Registration Complete!</h3>
//                   <p className="text-gray-400 text-sm">Redirecting to your profile...</p>
//                 </div>
//               )}

//               {!success && (
//                 <form className="p-6 space-y-5">
//                   {error && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
//                     >
//                       <p className="text-red-400 text-sm">{error}</p>
//                     </motion.div>
//                   )}

//                   {/* STEP 1: Personal Information */}
//                   {step === 1 && (
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
//                       <div>
//                         <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Personal</h4>
//                         <div className="space-y-3">
//                           <div className="relative">
//                             <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
//                             <input
//                               type="text"
//                               name="fullName"
//                               value={formData.fullName}
//                               onChange={handleInputChange}
//                               placeholder="Full Name *"
//                               className={inputClass}
//                               required
//                             />
//                           </div>
//                           <div className="relative">
//                             <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
//                             <input
//                               type="text"
//                               name="username"
//                               value={formData.username}
//                               onChange={handleInputChange}
//                               placeholder="Gamer Tag / Username *"
//                               className={inputClass}
//                               required
//                             />
//                           </div>
//                           <div className="relative">
//                             <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
//                             <input
//                               type="email"
//                               name="email"
//                               value={formData.email}
//                               onChange={handleInputChange}
//                               placeholder="Email *"
//                               className={inputClass}
//                               required
//                             />
//                           </div>
//                           <div className="relative">
//                             <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
//                             <div className="flex gap-2">
//                               <select
//                                 name="countryCode"
//                                 value={formData.countryCode}
//                                 onChange={handleInputChange}
//                                 className="px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50"
//                               >
//                                 {countryCodes.map((country) => (
//                                   <option key={country.code} value={country.code} className="bg-[#1a1a24]">
//                                     {country.code}
//                                   </option>
//                                 ))}
//                               </select>
//                               <input
//                                 type="tel"
//                                 name="phone"
//                                 value={formData.phone}
//                                 onChange={handleInputChange}
//                                 placeholder="Phone *"
//                                 className="flex-1 pl-4 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition text-sm"
//                                 required
//                               />
//                             </div>
//                           </div>
//                           <div className="relative">
//                             <MessageCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
//                             <input
//                               type="text"
//                               name="discord"
//                               value={formData.discord}
//                               onChange={handleInputChange}
//                               placeholder="Discord username"
//                               className={inputClass}
//                             />
//                           </div>
//                           <div className="relative">
//                             <FileText className="absolute left-3.5 top-3 text-gray-600 w-4 h-4" />
//                             <textarea
//                               name="bio"
//                               value={formData.bio}
//                               onChange={handleInputChange}
//                               placeholder="Bio"
//                               rows={2}
//                               className={`${inputClass} resize-none`}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}

//                   {/* STEP 2: Gaming Information */}
//                   {step === 2 && (
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
//                       <div>
//                         <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Gaming</h4>
//                         <div className="space-y-3">
//                           <div className="relative">
//                             <Gamepad2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
//                             <select
//                               name="game"
//                               value={formData.game}
//                               onChange={handleInputChange}
//                               className={selectClass}
//                             >
//                               <option value="" className="bg-[#1a1a24]">Select game</option>
//                               {gamesList.map(g => <option key={g} value={g} className="bg-[#1a1a24]">{g}</option>)}
//                             </select>
//                           </div>

//                           {formData.game && ROLES[formData.game] && (
//                             <div>
//                               <p className="text-xs text-gray-500 mb-2">Role</p>
//                               <div className="flex flex-wrap gap-1.5">
//                                 {ROLES[formData.game].map(r => (
//                                   <button
//                                     key={r}
//                                     type="button"
//                                     onClick={() => setFormData({ ...formData, role: r })}
//                                     className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
//                                       formData.role === r
//                                         ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
//                                         : 'bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:text-gray-300'
//                                     }`}
//                                   >
//                                     {r}
//                                   </button>
//                                 ))}
//                               </div>
//                             </div>
//                           )}

//                           {formData.game && RANKS[formData.game] && (
//                             <div className="relative">
//                               <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
//                               <select
//                                 name="rank"
//                                 value={formData.rank}
//                                 onChange={handleInputChange}
//                                 className={selectClass}
//                               >
//                                 <option value="" className="bg-[#1a1a24]">Select rank</option>
//                                 {RANKS[formData.game].map(rank => <option key={rank} value={rank} className="bg-[#1a1a24]">{rank}</option>)}
//                               </select>
//                             </div>
//                           )}

//                           <div className="relative">
//                             <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
//                             <select
//                               value={formData.continent}
//                               onChange={handleInputChange}
//                               name="continent"
//                               className={selectClass}
//                             >
//                               <option value="" className="bg-[#1a1a24]">Select continent</option>
//                               {CONTINENTS.map(c => <option key={c} value={c} className="bg-[#1a1a24]">{c}</option>)}
//                             </select>
//                           </div>

//                           {formData.continent && (
//                             <div className="relative">
//                               <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
//                               <select
//                                 value={formData.country}
//                                 onChange={handleInputChange}
//                                 name="country"
//                                 className={selectClass}
//                               >
//                                 <option value="" className="bg-[#1a1a24]">Select country</option>
//                                 {Object.keys(REGION_DATA[formData.continent] || {}).map(country => (
//                                   <option key={country} value={country} className="bg-[#1a1a24]">{country}</option>
//                                 ))}
//                               </select>
//                             </div>
//                           )}

//                           {formData.country && REGION_DATA[formData.continent]?.[formData.country]?.length > 0 && (
//                             <div className="relative">
//                               <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
//                               <select
//                                 value={formData.city}
//                                 onChange={handleInputChange}
//                                 name="city"
//                                 className={selectClass}
//                               >
//                                 <option value="" className="bg-[#1a1a24]">Select city</option>
//                                 {REGION_DATA[formData.continent][formData.country].map(city => (
//                                   <option key={city} value={city} className="bg-[#1a1a24]">{city}</option>
//                                 ))}
//                               </select>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}

//                   {/* STEP 3: Images */}
//                   {step === 3 && (
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
//                       <div>
//                         <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Images</h4>
//                         <div className="relative w-full h-28 rounded-xl border-2 border-dashed border-white/[0.1] hover:border-purple-500/30 bg-white/[0.02] cursor-pointer transition-all overflow-hidden group mb-3" onClick={() => bannerInputRef.current?.click()}>
//                           {bannerImagePreview ? (
//                             <>
//                               <img src={bannerImagePreview} alt="Banner" className="w-full h-full object-cover" />
//                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
//                                 <Camera size={20} className="text-white" />
//                               </div>
//                             </>
//                           ) : (
//                             <div className="flex flex-col items-center justify-center h-full gap-1.5 text-gray-600">
//                               <ImageIcon size={22} />
//                               <span className="text-[10px]">Upload banner image</span>
//                             </div>
//                           )}
//                           <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'banner')} />
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <div className="relative w-20 h-20 rounded-2xl border-2 border-dashed border-white/[0.1] hover:border-purple-500/30 bg-white/[0.02] cursor-pointer transition-all overflow-hidden group flex-shrink-0" onClick={() => profileInputRef.current?.click()}>
//                             {profileImagePreview ? (
//                               <>
//                                 <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
//                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
//                                   <Camera size={16} className="text-white" />
//                                 </div>
//                               </>
//                             ) : (
//                               <div className="flex flex-col items-center justify-center h-full gap-0.5 text-gray-600">
//                                 <Camera size={18} />
//                                 <span className="text-[9px]">Upload</span>
//                               </div>
//                             )}
//                             <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'profile')} />
//                           </div>
//                           <div>
//                             <p className="text-xs text-gray-400">Profile picture</p>
//                             <p className="text-[10px] text-gray-600 mt-0.5">Square, max 5MB</p>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}

//                   {/* Navigation */}
//                   <div className="flex gap-3 pt-6 border-t border-white/[0.06]">
//                     {step > 1 && (
//                       <motion.button
//                         type="button"
//                         onClick={handlePreviousStep}
//                         disabled={saving}
//                         className="flex-1 py-3 border border-white/[0.1] hover:border-white/[0.2] text-white font-semibold rounded-xl transition disabled:opacity-50"
//                         whileHover={{ scale: 1.01 }}
//                         whileTap={{ scale: 0.99 }}
//                       >
//                         Back
//                       </motion.button>
//                     )}
//                     <motion.button
//                       type="button"
//                       onClick={step < 3 ? handleNextStep : handleCompleteRegistration}
//                       disabled={saving || (step === 1 && (!formData.fullName || !formData.username))}
//                       className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
//                       whileHover={{ scale: 1.01 }}
//                       whileTap={{ scale: 0.99 }}
//                     >
//                       {saving ? (
//                         <>
//                           <Loader2 size={16} className="animate-spin" /> Saving...
//                         </>
//                       ) : step < 3 ? (
//                         <>Next <ChevronRight size={16} /></>
//                       ) : (
//                         <>Complete Registration <Check size={16} /></>
//                       )}
//                     </motion.button>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }
