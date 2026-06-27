import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Sparkles,
  Loader2,
  User,
  Calendar,
  Globe,
  RotateCcw,
} from "lucide-react";
import StarField from "../components/StarField";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SacredGeometry from "../components/SacredGeometry";
import { getDailyForecast } from "../services/api";
import type { DailyForecastResponse } from "../types";

const schema = z.object({
  first_name: z.string().min(1, "First name is required").max(50),
  middle_name: z.string().max(50).optional(),
  last_name: z.string().min(1, "Last name is required").max(50),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    required_error: "Please select a gender alignment",
  }),
  country: z.string().min(2, "Country is required"),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full bg-[#0A0915]/80 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/25 text-sm focus:border-cosmic-gold focus:bg-[#1f153a]/60 focus:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 outline-none";

const labelClass =
  "flex items-center gap-2 font-sans text-xs uppercase tracking-[0.12em] text-cosmic-silver/80 font-medium mb-2.5";

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh",
  "Belgium","Brazil","Canada","Chile","China","Colombia","Croatia","Czech Republic",
  "Denmark","Egypt","Ethiopia","Finland","France","Germany","Ghana","Greece",
  "Hungary","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Japan",
  "Jordan","Kenya","Malaysia","Mexico","Morocco","Netherlands","New Zealand",
  "Nigeria","Norway","Pakistan","Philippines","Poland","Portugal","Romania",
  "Russia","Saudi Arabia","Singapore","South Africa","South Korea","Spain",
  "Sri Lanka","Sweden","Switzerland","Thailand","Turkey","UAE","Ukraine",
  "United Kingdom","United States","Vietnam","Zimbabwe",
].sort();

const MONTHS = [
  { val: "1", label: "January (01)" }, { val: "2", label: "February (02)" }, { val: "3", label: "March (03)" },
  { val: "4", label: "April (04)" }, { val: "5", label: "May (05)" }, { val: "6", label: "June (06)" },
  { val: "7", label: "July (07)" }, { val: "8", label: "August (08)" }, { val: "9", label: "September (09)" },
  { val: "10", label: "October (10)" }, { val: "11", label: "November (11)" }, { val: "12", label: "December (12)" },
];

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => String(currentYear - i));

function parseDailyForecast(text: string) {
  const sections: { heading: string; content: string }[] = [];
  const lines = text.split("\n");
  let current: { heading: string; content: string[] } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      if (current) {
        sections.push({ ...current, content: current.content.join("\n").trim() });
      }
      current = { heading: trimmed.replace(/^###\s*/, ""), content: [] };
    } else if (current) {
      current.content.push(line);
    }
  }
  if (current) {
    sections.push({ ...current, content: current.content.join("\n").trim() });
  }
  return sections;
}

export default function DailyPage() {
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<DailyForecastResponse | null>(null);
  const [hasStoredData, setHasStoredData] = useState(false);
  const [dateParts, setDateParts] = useState({ month: "", day: "", year: "" });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Load profile values from localStorage on mount
  useEffect(() => {
    const first = localStorage.getItem("cosmic_user_first_name");
    const middle = localStorage.getItem("cosmic_user_middle_name") || "";
    const last = localStorage.getItem("cosmic_user_last_name");
    const dobVal = localStorage.getItem("cosmic_user_dob");
    const genderVal = localStorage.getItem("cosmic_user_gender");
    const countryVal = localStorage.getItem("cosmic_user_country");

    if (first && last && dobVal && genderVal && countryVal) {
      const fullName = [first, middle, last].filter(Boolean).join(" ");
      setHasStoredData(true);
      fetchForecast(fullName, dobVal, countryVal);
    }
  }, []);

  const handleDateSelect = (field: "month" | "day" | "year", val: string) => {
    const updated = { ...dateParts, [field]: val };
    setDateParts(updated);
    if (updated.year && updated.month && updated.day) {
      const cleanMonth = updated.month.replace(/^0+/, "");
      const cleanDay = updated.day.replace(/^0+/, "");
      setValue("dob", `${updated.year}-${cleanMonth.padStart(2, "0")}-${cleanDay.padStart(2, "0")}`, { shouldValidate: true });
    } else {
      setValue("dob", "", { shouldValidate: true });
    }
  };

  const fetchForecast = async (userName: string, userDob: string, userLoc: string) => {
    setLoading(true);
    try {
      const response = await getDailyForecast({
        name: userName,
        dob: userDob,
        location: userLoc || undefined,
      });
      setForecast(response.data);
    } catch {
      toast.error("Failed to retrieve your daily forecast. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    const fullName = [data.first_name, data.middle_name, data.last_name].filter(Boolean).join(" ");
    
    // Save to localStorage
    localStorage.setItem("cosmic_user_first_name", data.first_name);
    if (data.middle_name) {
      localStorage.setItem("cosmic_user_middle_name", data.middle_name);
    } else {
      localStorage.removeItem("cosmic_user_middle_name");
    }
    localStorage.setItem("cosmic_user_last_name", data.last_name);
    localStorage.setItem("cosmic_user_dob", data.dob);
    localStorage.setItem("cosmic_user_gender", data.gender);
    localStorage.setItem("cosmic_user_country", data.country);
    
    setHasStoredData(true);
    fetchForecast(fullName, data.dob, data.country);
  };

  const handleReset = () => {
    localStorage.removeItem("cosmic_user_first_name");
    localStorage.removeItem("cosmic_user_middle_name");
    localStorage.removeItem("cosmic_user_last_name");
    localStorage.removeItem("cosmic_user_dob");
    localStorage.removeItem("cosmic_user_gender");
    localStorage.removeItem("cosmic_user_country");
    setForecast(null);
    setHasStoredData(false);
    setDateParts({ month: "", day: "", year: "" });
    reset();
    toast.success("Profile details reset!");
  };

  const parsedSections = forecast ? parseDailyForecast(forecast.forecast) : [];

  return (
    <div className="min-h-screen relative overflow-hidden bg-cosmic-black flex flex-col justify-between">
      <StarField />
      <Navbar />

      {/* Atmospheric Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cosmic-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="content pt-28 pb-24 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto w-full flex-grow flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!hasStoredData ? (
            // ── Form view (Matching /generate exactly) ──
            <div className="w-full max-w-3xl mx-auto">
              {/* Hero Header */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center mb-14"
              >
                <div className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-6 text-xs font-sans uppercase tracking-[0.3em] font-semibold text-cosmic-gold shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                  <Sparkles className="w-3.5 h-3.5 animate-twinkle" />
                  Daily Forecast Portal
                </div>
                <h1 className="font-serif text-4xl sm:text-6xl font-normal text-shimmer tracking-wide leading-tight mb-4">
                  Know Your Today
                </h1>
                <p className="text-cosmic-silver/70 text-base sm:text-lg max-w-xl mx-auto font-sans font-light leading-relaxed">
                  Calculate your Personal Day number and retrieve today's guidance. Enter your coordinates once to unlock instant daily updates.
                </p>
              </motion.div>

              {/* Form Container */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="glass rounded-[32px] p-6 sm:p-12 border border-cosmic-gold/20 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative"
              >
                <div className="absolute top-6 right-6 opacity-10 pointer-events-none hidden sm:block">
                  <SacredGeometry size={80} />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                  {/* SECTION 1: Identity */}
                  <div>
                    <div className="flex items-center gap-3 pb-3 border-b border-white/10 mb-6">
                      <span className="font-serif text-cosmic-gold font-bold text-base bg-cosmic-gold/10 px-2.5 py-1 rounded-lg border border-cosmic-gold/30">01</span>
                      <h2 className="font-sans uppercase tracking-[0.2em] text-white/90 text-xs sm:text-sm font-semibold">
                        Vibrational Identity (Name)
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className={labelClass}>
                          <User className="w-3.5 h-3.5 text-cosmic-gold" /> First Name *
                        </label>
                        <input
                          id="first-name"
                          {...register("first_name")}
                          placeholder="e.g. Siddhartha"
                          className={inputClass}
                        />
                        {errors.first_name && (
                          <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.first_name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className={labelClass}>
                          <User className="w-3.5 h-3.5 text-white/40" /> Middle Name <span className="text-white/30 text-[10px] lowercase tracking-normal font-normal">(optional)</span>
                        </label>
                        <input
                          id="middle-name"
                          {...register("middle_name")}
                          placeholder="e.g. Gautama"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>
                        <User className="w-3.5 h-3.5 text-cosmic-gold" /> Last Name / Family Name *
                      </label>
                      <input
                        id="last-name"
                        {...register("last_name")}
                        placeholder="e.g. Shakya"
                        className={inputClass}
                      />
                      {errors.last_name && (
                        <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.last_name.message}</p>
                      )}
                    </div>
                  </div>

                  {/* SECTION 2: Alignment */}
                  <div>
                    <div className="flex items-center gap-3 pb-3 border-b border-white/10 mb-6">
                      <span className="font-serif text-cosmic-gold font-bold text-base bg-cosmic-gold/10 px-2.5 py-1 rounded-lg border border-cosmic-gold/30">02</span>
                      <h2 className="font-sans uppercase tracking-[0.2em] text-white/90 text-xs sm:text-sm font-semibold">
                        Temporal & Earthly Coordinates
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      {/* DOB */}
                      <div>
                        <label className={labelClass}>
                          <Calendar className="w-3.5 h-3.5 text-cosmic-gold" /> Date of Birth *
                        </label>
                        <input type="hidden" {...register("dob")} />
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                          <select
                            aria-label="Month"
                            value={dateParts.month}
                            onChange={(e) => handleDateSelect("month", e.target.value)}
                            className={`${inputClass} px-2 sm:px-3 cursor-pointer`}
                          >
                            <option value="" className="bg-cosmic-deep text-white/50">Month</option>
                            {MONTHS.map((m) => (
                              <option key={m.val} value={m.val} className="bg-cosmic-deep text-white py-1">{m.label}</option>
                            ))}
                          </select>

                          <select
                            aria-label="Day"
                            value={dateParts.day}
                            onChange={(e) => handleDateSelect("day", e.target.value)}
                            className={`${inputClass} px-2 sm:px-3 cursor-pointer`}
                          >
                            <option value="" className="bg-cosmic-deep text-white/50">Day</option>
                            {DAYS.map((d) => (
                              <option key={d} value={d} className="bg-cosmic-deep text-white py-1">{d}</option>
                            ))}
                          </select>

                          <select
                            aria-label="Year"
                            value={dateParts.year}
                            onChange={(e) => handleDateSelect("year", e.target.value)}
                            className={`${inputClass} px-2 sm:px-3 cursor-pointer`}
                          >
                            <option value="" className="bg-cosmic-deep text-white/50">Year</option>
                            {YEARS.map((y) => (
                              <option key={y} value={y} className="bg-cosmic-deep text-white py-1">{y}</option>
                            ))}
                          </select>
                        </div>
                        {errors.dob && (
                          <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.dob.message}</p>
                        )}
                      </div>

                      {/* Gender */}
                      <div>
                        <label className={labelClass}>
                          <Sparkles className="w-3.5 h-3.5 text-cosmic-gold" /> Biological / Energy Gender *
                        </label>
                        <select id="gender" {...register("gender")} className={`${inputClass} cursor-pointer`}>
                          <option value="" className="bg-cosmic-deep text-white/50">Select gender alignment</option>
                          <option value="male" className="bg-cosmic-deep text-white py-1">Male Energy</option>
                          <option value="female" className="bg-cosmic-deep text-white py-1">Female Energy</option>
                          <option value="other" className="bg-cosmic-deep text-white py-1">Non-binary / Other</option>
                          <option value="prefer_not_to_say" className="bg-cosmic-deep text-white py-1">Prefer not to specify</option>
                        </select>
                        {errors.gender && (
                          <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.gender.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <label className={labelClass}>
                        <Globe className="w-3.5 h-3.5 text-cosmic-gold" /> Current Earthly Residence (Country) *
                      </label>
                      <select id="country" {...register("country")} className={`${inputClass} cursor-pointer`}>
                        <option value="" className="bg-cosmic-deep text-white/50">Select your country</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c} className="bg-cosmic-deep text-white py-1">{c}</option>
                        ))}
                      </select>
                      {errors.country && (
                        <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.country.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="group relative w-full py-4 px-8 rounded-full bg-cosmic-gold text-cosmic-black font-sans uppercase tracking-[0.2em] text-sm font-bold hover:bg-cosmic-gold-light transition-all duration-300 shadow-[0_0_35px_rgba(212,175,55,0.4)] hover:shadow-[0_0_60px_rgba(212,175,55,0.7)] flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden cursor-pointer"
                    >
                      <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-30deg] -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                      <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
                      <span>Calculate Daily Energy</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          ) : loading ? (
            // ── Loading state (glowing alignment) ──
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
                <Loader2 className="w-16 h-16 text-cosmic-gold animate-spin" />
                <div className="absolute inset-0 rounded-full border border-cosmic-gold/20 animate-pulse-gold"></div>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-shimmer mb-2">Aligning Daily Harmonics...</h3>
              <p className="text-white/40 text-sm max-w-sm font-light">
                Determining your Personal Day Number and compiling today's cosmic forecast from the stars.
              </p>
            </motion.div>
          ) : forecast ? (
            // ── Results layout ──
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8 max-w-3xl mx-auto w-full"
            >
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl glass border border-white/5 shadow-lg">
                <div className="text-center sm:text-left">
                  <div className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-1">Cosmic Citizen</div>
                  <h3 className="text-white text-lg font-bold font-serif">{forecast.name}</h3>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-white/50 hover:text-white transition-colors border border-white/10 px-4 py-2.5 rounded-full hover:bg-white/5 cursor-pointer outline-none"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Profile
                  </button>
                </div>
              </div>

              {/* Central Energy Orb Card */}
              <div className="glass-gold rounded-[32px] p-8 sm:p-12 border border-cosmic-gold/25 text-center flex flex-col items-center relative overflow-hidden shadow-2xl">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-cosmic-gold/5 rounded-full filter blur-2xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/5 rounded-full filter blur-2xl"></div>

                <div className="text-xs uppercase tracking-[0.25em] text-cosmic-gold/80 font-bold mb-1">
                  Today's Personal Day
                </div>
                <div className="text-white/45 text-sm font-light mb-6">
                  {forecast.date}
                </div>

                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-cosmic-gold/40 flex items-center justify-center bg-cosmic-gold/5 shadow-[0_0_40px_rgba(212,175,55,0.25)] mb-6">
                  <span className="text-5xl sm:text-6xl font-serif text-cosmic-gold font-light drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]">
                    {forecast.personal_day}
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3 tracking-wide">
                  {forecast.meaning.split(" — ")[0]}
                </h2>
                <p className="text-cosmic-silver/80 text-sm sm:text-base max-w-lg font-light leading-relaxed font-sans">
                  {forecast.meaning.split(" — ")[1] || forecast.meaning}
                </p>
              </div>

              {/* Detailed Reading Sections */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {parsedSections.map((section, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass rounded-2xl p-6 border border-white/5 flex flex-col justify-between shadow-md"
                  >
                    <div>
                      <h4 className="font-serif text-lg font-bold text-cosmic-gold border-b border-white/5 pb-2 mb-4">
                        {section.heading}
                      </h4>
                      <p className="text-cosmic-silver/90 text-sm sm:text-base leading-relaxed font-light font-sans">
                        {section.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
