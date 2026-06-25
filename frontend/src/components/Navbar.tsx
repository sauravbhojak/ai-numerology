import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* Overlapping Geometric Number Symbol */}
          <div className="relative w-8 h-8 flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-[4s] ease-in-out">
            {/* Faint Background Numbers */}
            <span className="absolute text-[14px] font-serif text-cosmic-gold opacity-30" style={{ transform: 'translate(-8px, 6px) rotate(-45deg)' }}>1</span>
            <span className="absolute text-[12px] font-serif text-cosmic-silver opacity-40" style={{ transform: 'translate(8px, -6px) rotate(60deg)' }}>7</span>
            <span className="absolute text-[16px] font-serif text-[#a78bfa] opacity-20" style={{ transform: 'translate(0px, -8px) rotate(90deg)' }}>8</span>
            <span className="absolute text-[10px] font-serif text-cosmic-gold opacity-50" style={{ transform: 'translate(-6px, -8px) rotate(-75deg)' }}>5</span>
            <span className="absolute text-[14px] font-serif text-cosmic-silver opacity-30" style={{ transform: 'translate(6px, 8px) rotate(120deg)' }}>2</span>

            {/* Primary 3-6-9 Cluster */}
            <span className="absolute text-[22px] font-serif text-cosmic-gold opacity-90 drop-shadow-[0_0_5px_rgba(212,175,55,0.6)]" style={{ transform: 'translate(-3px, -4px) rotate(-15deg)' }}>
              3
            </span>
            <span className="absolute text-[22px] font-serif text-cosmic-gold opacity-80 drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]" style={{ transform: 'translate(4px, 2px) rotate(15deg)' }}>
              6
            </span>
            <span className="absolute text-[22px] font-serif text-white opacity-90 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" style={{ transform: 'translate(-1px, 5px) rotate(45deg) scale(1.1)' }}>
              9
            </span>
            <div className="absolute inset-0 rounded-full border border-cosmic-gold/20 shadow-[0_0_10px_rgba(212,175,55,0.1)] group-hover:border-cosmic-gold/50 transition-colors duration-700"></div>
          </div>
          
          <span className="font-serif text-2xl font-bold tracking-wider text-shimmer">
            Numerology
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className={`text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${pathname === "/"
              ? "text-cosmic-gold"
              : "text-cosmic-silver hover:text-white"
              }`}
          >
            Home
          </Link>
          <Link
            to="/generate"
            className="text-xs font-semibold uppercase tracking-[0.15em] px-5 py-2.5 rounded-full glass-gold text-cosmic-gold border border-cosmic-gold/30 hover:border-cosmic-gold/80 transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            Get Reading
          </Link>
        </div>
      </div>
    </nav>
  );
}
