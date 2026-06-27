import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Sparkles,
  Loader2,
  User,
  Calendar,
  Globe,
  MessageSquare,
  Wand2,
  Lock,
} from "lucide-react";
import StarField from "../components/StarField";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SacredGeometry from "../components/SacredGeometry";
import { generateReport } from "../services/api";
import type { ReportResponse } from "../types";

const schema = z.object({
  first_name: z.string().min(1, "First name is required").max(50),
  middle_name: z.string().max(50).optional(),
  last_name: z.string().min(1, "Last name is required").max(50),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    required_error: "Please select a gender",
  }),
  country: z.string().min(2, "Country is required"),
  question: z.string().max(500).optional(),
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

export default function GeneratePage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [dateParts, setDateParts] = useState({ month: "", day: "", year: "" });

  const handleDateSelect = (field: "month" | "day" | "year", val: string) => {
    const updated = { ...dateParts, [field]: val };
    setDateParts(updated);
    if (updated.year && updated.month && updated.day) {
      // Clean numeric formatting for dob
      const cleanMonth = updated.month.replace(/^0+/, "");
      const cleanDay = updated.day.replace(/^0+/, "");
      setValue("dob", `${updated.year}-${cleanMonth.padStart(2, "0")}-${cleanDay.padStart(2, "0")}`, { shouldValidate: true });
    } else {
      setValue("dob", "", { shouldValidate: true });
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const res = await generateReport(data);
      const report: ReportResponse = res.data;
      sessionStorage.setItem("numerology_report", JSON.stringify(report));
      navigate("/report");
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        "Failed to generate report. Please check your API key and try again.";
      toast.error(msg, { duration: 5000 });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />
      <Navbar />

      {/* Atmospheric Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cosmic-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="content pt-28 pb-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-6 text-xs font-sans uppercase tracking-[0.3em] font-semibold text-cosmic-gold shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <Sparkles className="w-3.5 h-3.5 animate-twinkle" />
              Cosmic Blueprint Portal
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-normal text-shimmer tracking-wide leading-tight mb-4">
              Decode Your Destiny
            </h1>
            <p className="text-cosmic-silver/70 text-base sm:text-lg max-w-xl mx-auto font-sans font-light leading-relaxed">
              Enter your earthly coordinates. Your full birth name and precise date of birth encode sacred vibrational frequencies.
            </p>
          </motion.div>

          {/* Form Card Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="glass rounded-[32px] p-6 sm:p-12 border border-cosmic-gold/20 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative"
          >
            {/* Subtle corner geometry motif */}
            <div className="absolute top-6 right-6 opacity-10 pointer-events-none hidden sm:block">
              <SacredGeometry size={80} />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* SECTION 1: Vibrational Identity */}
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
                  <p className="text-white/35 text-[11px] mt-2 font-light">
                    💡 Tip: Use your exact full name as recorded at birth for the most accurate Destiny & Soul Urge numbers.
                  </p>
                </div>
              </div>

              {/* SECTION 2: Cosmic Alignment */}
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

              {/* SECTION 3: Universal Query */}
              <div>
                <div className="flex items-center gap-3 pb-3 border-b border-white/10 mb-6">
                  <span className="font-serif text-cosmic-gold font-bold text-base bg-cosmic-gold/10 px-2.5 py-1 rounded-lg border border-cosmic-gold/30">03</span>
                  <h2 className="font-sans uppercase tracking-[0.2em] text-white/90 text-xs sm:text-sm font-semibold">
                    Cosmic Intent & Query
                  </h2>
                </div>

                <div>
                  <label className={labelClass}>
                    <MessageSquare className="w-3.5 h-3.5 text-cosmic-gold" /> Your Burning Question for the Universe{" "}
                    <span className="text-white/30 text-[10px] lowercase tracking-normal font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="question"
                    {...register("question")}
                    rows={3}
                    placeholder="e.g. What major energetic shifts should I prepare for in my career over the next 12 months?"
                    className={`${inputClass} resize-none leading-relaxed`}
                  />
                  <p className="text-white/35 text-[11px] mt-2 font-light">
                    ✨ Groq AI will weave your personal numerological numbers into specific spiritual guidance answering this inquiry.
                  </p>
                </div>
              </div>

              {/* Submit Button Area */}
              <div className="pt-4">
                <button
                  id="generate-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full py-4 px-8 rounded-full bg-cosmic-gold text-cosmic-black font-sans uppercase tracking-[0.2em] text-sm font-bold hover:bg-cosmic-gold-light transition-all duration-300 shadow-[0_0_35px_rgba(212,175,55,0.4)] hover:shadow-[0_0_60px_rgba(212,175,55,0.7)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
                >
                  {/* Subtle shimmer sheen effect */}
                  <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-30deg] -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-cosmic-black" />
                      <span>Aligning Celestial Energies…</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 transition-transform group-hover:rotate-12" />
                      <span>Generate Mystical Report</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-5 text-white/30 text-xs">
                  <Lock className="w-3.5 h-3.5 text-cosmic-gold/60" />
                  <span>100% Private · No Database Storage · Instant AI Generation</span>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

