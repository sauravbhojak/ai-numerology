import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles, Star, Heart, Briefcase, Calendar,
  Hash, Globe, Users, ChevronRight,
} from "lucide-react";
import StarField from "../components/StarField";
import FAQAccordion from "../components/FAQAccordion";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const FEATURES = [
  { icon: Star,     title: "Life Path Number",      desc: "Discover your core life purpose and the path you are destined to walk." },
  { icon: Sparkles, title: "Destiny Number",         desc: "Uncover the talents and abilities encoded in your birth name." },
  { icon: Heart,    title: "Soul Urge Number",       desc: "Reveal your innermost desires and what your heart truly craves." },
  { icon: Users,    title: "Personality Number",     desc: "See how the world perceives you and the image you project." },
  { icon: Calendar, title: "Personal Year Number",   desc: "Understand the energy cycle you are in right now this year." },
  { icon: Hash,     title: "Lucky Numbers",          desc: "Discover the numbers that vibrate at your highest frequency." },
  { icon: Globe,    title: "Compatibility Insights", desc: "Explore your relationship dynamics through numerology." },
  { icon: Briefcase, title: "Career Guidance",       desc: "Find your ideal career path aligned with your numerological energy." },
];


const STEPS = [
  { n: "01", title: "Enter Your Details",     desc: "Provide your full name and date of birth. Your name carries vibrational frequency." },
  { n: "02", title: "AI Calculates & Reads",  desc: "Ancient numerology calculations combined with Groq AI to generate your unique reading." },
  { n: "03", title: "Receive Your Report",    desc: "Get a full mystical report with career, love, lucky numbers and downloadable PDF." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <StarField />

      <Navbar />
      <div className="content">
        {/* ── HERO ────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
          {/* Glow orb */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ willChange: 'transform' }}>
            <div className="w-[800px] h-[800px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(167, 139, 250, 0.12) 0%, transparent 60%)' }} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative z-10 max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-8 text-[10px] sm:text-xs font-sans uppercase tracking-[0.3em] font-semibold text-cosmic-gold">
              <Sparkles className="w-3.5 h-3.5" />
              Ancient Wisdom · Modern AI
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-wide leading-tight mb-8">
              <span className="text-shimmer">Discover Your Life</span>
              <br />
              <span className="text-cosmic-silver">Through Numbers</span>
            </h1>

            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Unlock your Life Path, Destiny, Personality and Hidden Energies
              using Ancient Numerology — powered by AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                id="hero-cta"
                to="/generate"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-cosmic-gold text-cosmic-black font-sans uppercase tracking-[0.15em] text-sm font-semibold hover:bg-cosmic-gold-light transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)]"
              >
                Generate My Report
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 text-white/20 text-sm flex flex-col items-center gap-2"
          >
            <span>Scroll to explore</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </section>

        {/* ── FEATURES ────────────────────────────────── */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="font-sans uppercase tracking-[0.2em] text-cosmic-gold text-xs font-semibold mb-4 block">Features</span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal text-shimmer mb-6 tracking-wide">
              What's In Your Report
            </h2>
            <div className="w-12 h-px bg-cosmic-gold/50 mb-6"></div>
            <p className="text-cosmic-silver/70 max-w-xl mx-auto font-sans font-light">
              A complete numerological analysis covering every dimension of your cosmic blueprint.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="glass rounded-2xl p-6 border border-white/5 hover:border-cosmic-gold/25 transition-all group hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] cursor-default"
              >
                <f.icon className="w-6 h-6 text-cosmic-gold mb-4 group-hover:animate-float" />
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────── */}
        <section className="py-20 px-6 max-w-4xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="font-sans uppercase tracking-[0.2em] text-cosmic-gold text-xs font-semibold mb-4 block">Process</span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal text-shimmer mb-6 tracking-wide">
              How It Works
            </h2>
            <div className="w-12 h-px bg-cosmic-gold/50"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="font-serif text-6xl font-bold text-cosmic-gold/20 mb-4">{s.n}</div>
                <h3 className="text-white font-semibold text-xl mb-3">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>


        {/* ── FAQ ─────────────────────────────────────── */}
        <section className="py-20 px-6 max-w-3xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="font-sans uppercase tracking-[0.2em] text-cosmic-gold text-xs font-semibold mb-4 block">Help</span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal text-shimmer mb-6 tracking-wide">
              Frequently Asked Questions
            </h2>
            <div className="w-12 h-px bg-cosmic-gold/50"></div>
          </div>
          <FAQAccordion />
        </section>

        {/* ── CTA BANNER ──────────────────────────────── */}
        <section className="py-20 px-6 max-w-2xl mx-auto text-center">
          <div className="glass-gold rounded-3xl p-12 border border-cosmic-gold/20">
            <Sparkles className="w-10 h-10 text-cosmic-gold mx-auto mb-6 animate-float" />
            <h2 className="font-serif text-3xl font-bold text-white mb-4">
              Ready to Discover Your Numbers?
            </h2>
            <p className="text-white/50 mb-8">
              Your cosmic blueprint is waiting. It only takes 30 seconds.
            </p>
            <Link
              to="/generate"
              id="bottom-cta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-cosmic-gold text-cosmic-deep font-semibold hover:bg-cosmic-gold-light transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)]"
            >
              Generate My Report <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
