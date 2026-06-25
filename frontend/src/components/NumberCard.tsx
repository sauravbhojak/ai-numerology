import { motion } from "framer-motion";

interface Props {
  label: string;
  value: number;
  meaning: string;
  delay?: number;
  accent?: "gold" | "violet" | "silver";
}

const ACCENT_STYLES = {
  gold:   { border: "border-cosmic-gold/30",   text: "text-cosmic-gold",   glow: "hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"    },
  violet: { border: "border-purple-500/30",    text: "text-purple-400",    glow: "hover:shadow-[0_0_30px_rgba(167,139,250,0.25)]"  },
  silver: { border: "border-cosmic-silver/30", text: "text-cosmic-silver", glow: "hover:shadow-[0_0_30px_rgba(192,192,192,0.2)]"   },
};

export default function NumberCard({ label, value, meaning, delay = 0, accent = "gold" }: Props) {
  const s = ACCENT_STYLES[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative overflow-hidden number-card glass rounded-2xl p-6 border ${s.border} ${s.glow} cursor-default group transition-all duration-500`}
    >
      {/* Huge faded number as watermark */}
      <div className={`absolute -right-4 -bottom-10 text-[10rem] font-serif font-normal opacity-5 pointer-events-none ${s.text} transition-transform duration-700 group-hover:scale-110`}>
        {value}
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-5 mb-5">
          <div className={`text-6xl font-serif font-light ${s.text} drop-shadow-sm`}>{value}</div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="text-white font-sans font-semibold text-xs uppercase tracking-[0.2em]">{label}</div>
        </div>
        <div className="text-cosmic-silver/80 text-sm leading-relaxed font-sans font-light">{meaning}</div>
      </div>
    </motion.div>
  );
}
