import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cosmic-gold" />
            <span className="font-serif text-xl text-shimmer">AI Numerology</span>
          </div>
          <p className="text-white/40 text-sm max-w-md">
            Unlock the ancient wisdom of numbers. Your cosmic journey begins here.
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link to="/" className="hover:text-cosmic-gold transition-colors">Home</Link>
            <Link to="/daily" className="hover:text-cosmic-gold transition-colors">Daily Forecast</Link>
            <Link to="/blogs" className="hover:text-cosmic-gold transition-colors">Library</Link>
            <Link to="/generate" className="hover:text-cosmic-gold transition-colors">Generate Report</Link>
          </div>
          <p className="text-white/20 text-xs mt-4">
            © {new Date().getFullYear()} AI Numerology · For entertainment and spiritual guidance purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
