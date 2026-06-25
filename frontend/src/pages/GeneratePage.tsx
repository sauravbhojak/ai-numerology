import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Sparkles, Loader2 } from "lucide-react";
import StarField from "../components/StarField";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
  "input-cosmic w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-cosmic-gold/60 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)] transition-all outline-none";

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
  { val: "1", label: "Jan" }, { val: "2", label: "Feb" }, { val: "3", label: "Mar" },
  { val: "4", label: "Apr" }, { val: "5", label: "May" }, { val: "6", label: "Jun" },
  { val: "7", label: "Jul" }, { val: "8", label: "Aug" }, { val: "9", label: "Sep" },
  { val: "10", label: "Oct" }, { val: "11", label: "Nov" }, { val: "12", label: "Dec" },
];

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
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
      setValue("dob", `${updated.year}-${updated.month.padStart(2, "0")}-${updated.day.padStart(2, "0")}`, { shouldValidate: true });
    } else {
      setValue("dob", "", { shouldValidate: true });
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const res = await generateReport(data);
      const report: ReportResponse = res.data;
      // Store in sessionStorage, navigate to report page
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
    <div className="min-h-screen">
      <StarField />
      <Navbar />
      <div className="content pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Sparkles className="w-8 h-8 text-cosmic-gold mx-auto mb-4 animate-float" />
            <h1 className="font-serif text-5xl font-bold text-shimmer mb-3">
              Generate Your Report
            </h1>
            <p className="text-white/50">
              Enter your details below. Your name and birth date hold the key to your cosmic blueprint.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-gold rounded-3xl p-8 md:p-10 border border-cosmic-gold/15"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">First Name *</label>
                  <input
                    id="first-name"
                    {...register("first_name")}
                    placeholder="e.g. Arjun"
                    className={inputClass}
                  />
                  {errors.first_name && (
                    <p className="text-red-400 text-xs mt-1">{errors.first_name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Middle Name</label>
                  <input
                    id="middle-name"
                    {...register("middle_name")}
                    placeholder="Optional"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm text-white/60 mb-2">Last Name *</label>
                <input
                  id="last-name"
                  {...register("last_name")}
                  placeholder="e.g. Sharma"
                  className={inputClass}
                />
                {errors.last_name && (
                  <p className="text-red-400 text-xs mt-1">{errors.last_name.message}</p>
                )}
              </div>

              {/* DOB + Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Date of Birth *</label>
                  <input type="hidden" {...register("dob")} />
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      aria-label="Month"
                      value={dateParts.month}
                      onChange={(e) => handleDateSelect("month", e.target.value)}
                      className={inputClass}
                    >
                      <option value="" className="bg-cosmic-deep">Month</option>
                      {MONTHS.map((m) => (
                        <option key={m.val} value={m.val} className="bg-cosmic-deep">{m.label}</option>
                      ))}
                    </select>

                    <select
                      aria-label="Day"
                      value={dateParts.day}
                      onChange={(e) => handleDateSelect("day", e.target.value)}
                      className={inputClass}
                    >
                      <option value="" className="bg-cosmic-deep">Day</option>
                      {DAYS.map((d) => (
                        <option key={d} value={d} className="bg-cosmic-deep">{d}</option>
                      ))}
                    </select>

                    <select
                      aria-label="Year"
                      value={dateParts.year}
                      onChange={(e) => handleDateSelect("year", e.target.value)}
                      className={inputClass}
                    >
                      <option value="" className="bg-cosmic-deep">Year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y} className="bg-cosmic-deep">{y}</option>
                      ))}
                    </select>
                  </div>
                  {errors.dob && (
                    <p className="text-red-400 text-xs mt-1">{errors.dob.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Gender *</label>
                  <select id="gender" {...register("gender")} className={inputClass}>
                    <option value="" className="bg-cosmic-deep">Select gender</option>
                    <option value="male" className="bg-cosmic-deep">Male</option>
                    <option value="female" className="bg-cosmic-deep">Female</option>
                    <option value="other" className="bg-cosmic-deep">Other</option>
                    <option value="prefer_not_to_say" className="bg-cosmic-deep">Prefer not to say</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-400 text-xs mt-1">{errors.gender.message}</p>
                  )}
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm text-white/60 mb-2">Country *</label>
                <select id="country" {...register("country")} className={inputClass}>
                  <option value="" className="bg-cosmic-deep">Select your country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-cosmic-deep">{c}</option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-400 text-xs mt-1">{errors.country.message}</p>
                )}
              </div>

              {/* Question */}
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Your Question for the Universe{" "}
                  <span className="text-white/30">(optional)</span>
                </label>
                <textarea
                  id="question"
                  {...register("question")}
                  rows={3}
                  placeholder="e.g. What career path aligns with my true purpose?"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Submit */}
              <button
                id="generate-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-cosmic-gold text-cosmic-deep font-bold text-lg flex items-center justify-center gap-3 hover:bg-cosmic-gold-light transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Consulting the cosmos…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate My Report
                  </>
                )}
              </button>

              <p className="text-center text-white/25 text-xs">
                This may take 15–30 seconds while AI reads your energies.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
