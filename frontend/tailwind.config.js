/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cosmic: {
          black:  "#0A0915",
          deep:   "#121024",
          purple: "#1f153a",
          violet: "#34225e",
          indigo: "#443477",
          bright: "#7c3aed",
          gold:   "#D4AF37",
          "gold-light": "#E5C453",
          silver: "#D1D1D6",
        },
      },
      fontFamily: {
        serif: ['Cinzel', "Playfair Display", "serif"],
        sans:  ['Jost', 'Inter', "sans-serif"],
      },
      animation: {
        "spin-slow":    "spin 25s linear infinite",
        "spin-reverse": "spin-reverse 18s linear infinite",
        float:          "float 6s ease-in-out infinite",
        glow:           "glow 2.5s ease-in-out infinite",
        twinkle:        "twinkle 3s ease-in-out infinite",
        shimmer:        "shimmer 3s linear infinite",
        "pulse-gold":   "pulse-gold 2s ease-in-out infinite",
      },
      keyframes: {
        "spin-reverse": {
          from: { transform: "rotate(360deg)" },
          to:   { transform: "rotate(0deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-18px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(212, 175, 55, 0.25)" },
          "50%":      { boxShadow: "0 0 40px rgba(212, 175, 55, 0.7), 0 0 70px rgba(212, 175, 55, 0.3)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(1)" },
          "50%":      { opacity: "1",   transform: "scale(1.3)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        "pulse-gold": {
          "0%, 100%": { borderColor: "rgba(212, 175, 55, 0.3)" },
          "50%":      { borderColor: "rgba(212, 175, 55, 0.9)" },
        },
      },
      backgroundImage: {
        "cosmic-radial": "radial-gradient(ellipse at top, #1a0a3e 0%, #050010 65%)",
        "gold-gradient": "linear-gradient(135deg, #d4af37, #f0d060, #b8962d)",
        "card-gradient": "linear-gradient(135deg, rgba(45,27,105,0.5), rgba(10,0,32,0.8))",
      },
    },
  },
  plugins: [],
};
