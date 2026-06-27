import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface NumeroscopeProps {
  numbers: {
    life_path: number;
    destiny: number;
    soul_urge: number;
    personality: number;
    birthday: number;
    personal_year: number;
    meanings: {
      life_path: string;
      destiny: string;
      soul_urge: string;
      personality: string;
      birthday: string;
      personal_year: string;
    };
  };
}

const ITEMS = [
  { id: "life_path", label: "Life Path", accent: "gold" as const, desc: "Your core life purpose and the path you are destined to walk." },
  { id: "destiny", label: "Destiny", accent: "violet" as const, desc: "The talents, abilities, and goals encoded in your birth name." },
  { id: "soul_urge", label: "Soul Urge", accent: "silver" as const, desc: "Your innermost desires and what your heart truly craves." },
  { id: "personality", label: "Personality", accent: "gold" as const, desc: "How the world perceives you and the image you project." },
  { id: "birthday", label: "Birthday", accent: "violet" as const, desc: "A specific gift or talent given to you at birth." },
  { id: "personal_year", label: "Personal Year", accent: "silver" as const, desc: "The universal energy cycle you are experiencing this year." },
];

const ACCENT_STYLES = {
  gold: {
    border: "border-cosmic-gold/40",
    text: "text-cosmic-gold",
    glow: "shadow-[0_0_20px_rgba(212,175,55,0.4)]",
    activeBg: "bg-cosmic-gold/10",
  },
  violet: {
    border: "border-purple-500/40",
    text: "text-purple-400",
    glow: "shadow-[0_0_20px_rgba(167,139,250,0.4)]",
    activeBg: "bg-purple-500/10",
  },
  silver: {
    border: "border-cosmic-silver/40",
    text: "text-cosmic-silver",
    glow: "shadow-[0_0_20px_rgba(192,192,192,0.4)]",
    activeBg: "bg-cosmic-silver/10",
  },
};

export default function Numeroscope({ numbers }: NumeroscopeProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeItem = ITEMS[activeIndex];
  const activeValue = numbers[activeItem.id as keyof typeof numbers] as number;
  const activeMeaning = numbers.meanings[activeItem.id as keyof typeof numbers.meanings];
  const style = ACCENT_STYLES[activeItem.accent];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-[350px] sm:max-w-[500px] aspect-square flex items-center justify-center my-10">
        
        {/* Background SVG for connector lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="180" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="250" cy="250" r="140" fill="none" stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />
          
          {ITEMS.map((item, i) => {
            const angle = (Math.PI * 2 * i) / ITEMS.length - Math.PI / 2;
            const lineX = 250 + 180 * Math.cos(angle);
            const lineY = 250 + 180 * Math.sin(angle);
            const isActive = i === activeIndex;
            return (
              <line
                key={item.id}
                x1="250"
                y1="250"
                x2={lineX}
                y2={lineY}
                stroke={isActive ? "rgba(212,175,55,0.5)" : "rgba(212,175,55,0.1)"}
                strokeWidth={isActive ? "1.5" : "0.5"}
                className="transition-[stroke,stroke-width] duration-500"
              />
            );
          })}
        </svg>

        {/* Central HUD */}
        <div className="absolute z-10 w-48 h-48 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center bg-[#050010] border border-cosmic-gold/20 shadow-[0_0_30px_rgba(0,0,0,0.8)]" style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center text-center px-4"
              style={{ willChange: 'transform, opacity' }}
            >
              <span className={`text-[10px] sm:text-xs font-sans uppercase tracking-[0.2em] font-semibold ${style.text} mb-1 sm:mb-2`}>
                {activeItem.label}
              </span>
              <span className={`text-5xl sm:text-7xl font-serif font-light ${style.text} drop-shadow-sm`}>
                {activeValue}
              </span>
              <span className="text-[10px] text-white/40 mt-3 font-sans max-w-[80%] leading-relaxed">
                {activeItem.desc}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Orbital Nodes */}
        {ITEMS.map((item, i) => {
          const angle = (Math.PI * 2 * i) / ITEMS.length - Math.PI / 2;
          // Scale down radius slightly for mobile
          const radius = typeof window !== "undefined" && window.innerWidth < 640 ? 130 : 180;
          const x = `calc(50% + ${radius * Math.cos(angle)}px)`;
          const y = `calc(50% + ${radius * Math.sin(angle)}px)`;
          
          const isActive = i === activeIndex;
          const val = numbers[item.id as keyof typeof numbers] as number;
          const s = ACCENT_STYLES[item.accent];

          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveIndex(i)}
              className={`absolute z-20 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 -ml-8 -mt-8 sm:-ml-10 sm:-mt-10 rounded-full glass border cursor-pointer transition-colors duration-300
                ${isActive ? `${s.border} ${s.glow} ${s.activeBg}` : 'border-white/10 hover:border-white/30 hover:bg-white/5 opacity-60 hover:opacity-100'}
              `}
              style={{ left: x, top: y, willChange: 'transform, opacity' }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: isActive ? 1 : 0.6, scale: isActive ? 1.1 : 1 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
            >
              {isActive && <Sparkles className={`absolute -top-1 -right-1 w-3 h-3 ${s.text} animate-pulse`} />}
              <span className="text-xl sm:text-2xl font-serif font-light text-white">{val}</span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-sans text-white/50">{item.label.split(" ")[0]}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Description Panel below wheel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeItem.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="max-w-2xl text-center glass rounded-2xl p-6 sm:p-8 border border-white/5 mt-4 sm:mt-8"
        >
          <p className="text-cosmic-silver/80 text-sm sm:text-base leading-relaxed font-sans font-light">
            {activeMeaning}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
