import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, Sparkles, Calendar, Clock } from "lucide-react";
import StarField from "../components/StarField";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SacredGeometry from "../components/SacredGeometry";
import { BLOG_POSTS } from "../data/blogs";

const CATEGORIES = ["All", "Core Numbers", "Life Cycles", "Angel Numbers"];

const inputClass =
  "w-full bg-[#0A0915]/80 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-white/25 text-sm focus:border-cosmic-gold focus:bg-[#1f153a]/60 focus:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 outline-none";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
      <StarField />
      <Navbar />

      {/* Atmospheric Background Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cosmic-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      <main className="content pt-28 pb-24 px-4 sm:px-6 relative z-10 max-w-6xl mx-auto w-full flex-grow">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-6 text-xs font-sans uppercase tracking-[0.3em] font-semibold text-cosmic-gold shadow-[0_0_20px_rgba(212,175,55,0.15)]"
          >
            <BookOpen className="w-3.5 h-3.5 animate-twinkle" />
            Cosmic Library
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl font-normal text-shimmer tracking-wide leading-tight mb-4"
          >
            Spiritual Wisdom
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-cosmic-silver/70 text-base sm:text-lg max-w-xl mx-auto font-sans font-light leading-relaxed"
          >
            Explore articles about ancient numerology math, angel numbers, personal cycles, and synchronicity guides.
          </motion.p>
        </div>

        {/* Filter & Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-12 border-b border-white/5 pb-8"
        >
          {/* Categories */}
          <div className="md:col-span-2 flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-sans font-semibold tracking-wider uppercase border transition-all duration-300 cursor-pointer outline-none
                  ${
                    selectedCategory === cat
                      ? "bg-cosmic-gold text-cosmic-black border-cosmic-gold shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                      : "bg-[#0A0915]/60 text-white/50 border-white/10 hover:border-white/30 hover:text-white"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={inputClass}
            />
          </div>
        </motion.div>

        {/* Blog Post Cards Grid */}
        <AnimatePresence mode="wait">
          {filteredPosts.length > 0 ? (
            <motion.div
              key={selectedCategory + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {filteredPosts.map((post, idx) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  className="glass rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between shadow-lg relative group overflow-hidden"
                >
                  {/* Subtle layout decorative graphics */}
                  <div className="absolute -top-12 -right-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-500">
                    <SacredGeometry size={120} />
                  </div>

                  <div>
                    {/* Header info */}
                    <div className="flex items-center gap-3 text-[10px] sm:text-xs font-sans uppercase tracking-widest text-cosmic-gold font-semibold mb-4">
                      <Sparkles className="w-3 h-3 text-cosmic-gold animate-twinkle" />
                      {post.category}
                    </div>

                    <h2 className="font-serif text-xl sm:text-2xl text-white font-normal leading-snug mb-3 group-hover:text-cosmic-gold transition-colors duration-300">
                      <Link to={`/blogs/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-cosmic-silver/70 text-sm leading-relaxed mb-6 font-light font-sans">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Footer details */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[10px] sm:text-xs text-white/35 font-sans font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 glass rounded-3xl border border-white/5"
            >
              <Sparkles className="w-8 h-8 text-cosmic-gold/40 mx-auto mb-4 animate-pulse" />
              <p className="text-white/40 font-light">No articles match your search parameters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
