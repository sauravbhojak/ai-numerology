import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SacredGeometry from "../components/SacredGeometry";
import StarField from "../components/StarField";

const MESSAGES = [
  "Calculating your Life Path…",
  "Finding your Destiny Number…",
  "Reading your Soul Energies…",
  "Consulting Ancient Numbers…",
  "Channelling the Stars…",
  "Decoding your Personality…",
  "Summoning AI Wisdom…",
  "Generating your Report…",
];

export default function LoadingPage() {
  const navigate = useNavigate();
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    // Cycle messages every 2.5s
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // If the report is already ready (set by GeneratePage), navigate immediately
    const stored = sessionStorage.getItem("numerology_report");
    if (stored) {
      navigate("/report", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <StarField />
      <div className="content flex flex-col items-center gap-10 text-center px-6">
        {/* Layered rotating geometry */}
        <div className="relative w-52 h-52 flex items-center justify-center">
          <div className="absolute animate-spin-slow">
            <SacredGeometry size={200} spin={false} />
          </div>
          <div className="absolute animate-spin-reverse opacity-60">
            <SacredGeometry size={140} spin={false} />
          </div>
          <div className="absolute w-10 h-10 rounded-full bg-cosmic-gold/20 animate-pulse" />
        </div>

        {/* Cycling message */}
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="font-serif text-2xl text-cosmic-gold"
          >
            {MESSAGES[msgIdx]}
          </motion.p>
        </AnimatePresence>

        <p className="text-white/30 text-sm max-w-xs">
          Please wait while we compute your numerology profile and generate your AI reading…
        </p>

        {/* Progress dots */}
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-cosmic-gold"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
