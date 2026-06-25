import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import StarField from "../components/StarField";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <StarField />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="content"
      >
        <div className="font-serif text-[120px] font-bold text-shimmer leading-none mb-6">
          404
        </div>
        <Sparkles className="w-10 h-10 text-cosmic-gold mx-auto mb-6 animate-float" />
        <h1 className="font-serif text-3xl font-bold text-white mb-4">
          The Cosmos Holds No Record of This Path
        </h1>
        <p className="text-white/40 mb-10 max-w-sm mx-auto">
          This page does not exist in any numerological dimension. Perhaps the universe is guiding you elsewhere.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-cosmic-gold text-cosmic-deep font-semibold hover:bg-cosmic-gold-light transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
