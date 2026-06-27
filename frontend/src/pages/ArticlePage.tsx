import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion as m } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Sparkles, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import StarField from "../components/StarField";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SacredGeometry from "../components/SacredGeometry";
import { BLOG_POSTS, BlogPost } from "../data/blogs";

function renderInlineFormatting(line: string) {
  const parts = line.split(/(\*\*.*?\*\*|__.*?__)/g);
  return parts.map((part, i) => {
    if ((part.startsWith("**") && part.endsWith("**")) || (part.startsWith("__") && part.endsWith("__"))) {
      const inner = part.slice(2, -2);
      return (
        <span key={i} className="text-cosmic-gold font-semibold bg-cosmic-gold/10 px-2 py-0.5 rounded-md border border-cosmic-gold/25 shadow-[0_0_10px_rgba(212,175,55,0.15)] mx-0.5 inline-block">
          {inner}
        </span>
      );
    }
    return part;
  });
}

function RichText({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split(/\r?\n/);

  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const joined = currentParagraph.join(" ").trim();
      if (joined) {
        elements.push(
          <p key={`p-${elements.length}`} className="text-[#D1D1D6]/90 leading-relaxed text-base sm:text-lg font-light mb-6 tracking-wide font-sans">
            {renderInlineFormatting(joined)}
          </p>
        );
      }
      currentParagraph = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      flushParagraph();
      continue;
    }

    if (line === "---") {
      flushParagraph();
      elements.push(
        <div key={`hr-${elements.length}`} className="w-16 h-px bg-cosmic-gold/30 my-8 mx-auto" />
      );
      continue;
    }

    if (line.startsWith("### ") || line.startsWith("#### ")) {
      flushParagraph();
      const headerText = line.replace(/^#{3,4}\s*/, "");
      elements.push(
        <h3 key={`h-${elements.length}`} className="font-serif text-xl sm:text-2xl font-normal text-cosmic-gold mt-10 mb-4 flex items-center gap-2 border-l-2 border-cosmic-gold pl-3">
          {renderInlineFormatting(headerText)}
        </h3>
      );
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ") || /^\d+\.\s/.test(line)) {
      flushParagraph();
      const bulletText = line.replace(/^(-\s|\*\s|\d+\.\s)/, "");
      elements.push(
        <div key={`li-${elements.length}`} className="flex items-start gap-3 pl-2 sm:pl-4 mb-4 group">
          <span className="text-cosmic-gold mt-1 text-sm select-none group-hover:scale-125 transition-transform">✦</span>
          <div className="text-[#D1D1D6]/90 text-base sm:text-lg leading-relaxed flex-1 font-light font-sans">
            {renderInlineFormatting(bulletText)}
          </div>
        </div>
      );
      continue;
    }

    currentParagraph.push(line);
  }

  flushParagraph();

  return <div className="space-y-1">{elements}</div>;
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const found = BLOG_POSTS.find((p) => p.slug === slug);
    setPost(found || null);
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Article link copied to clipboard!");
  };

  if (!post) {
    return (
      <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
        <StarField />
        <Navbar />
        <main className="content pt-28 pb-24 px-4 relative z-10 flex flex-col items-center justify-center text-center flex-grow">
          <Sparkles className="w-12 h-12 text-cosmic-gold/40 mb-6 animate-pulse" />
          <h1 className="font-serif text-3xl text-white mb-4">Article Not Found</h1>
          <p className="text-white/40 mb-8 font-light">The article slug is invalid or has been moved.</p>
          <Link to="/blogs" className="px-6 py-3 border border-white/10 rounded-full text-sm font-semibold uppercase tracking-wider hover:bg-white/5 text-white">
            Return to Library
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
      <StarField />
      <Navbar />

      {/* Atmospheric Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cosmic-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      <main className="content pt-28 pb-24 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto w-full flex-grow">
        {/* Navigation & Share */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Library
          </Link>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-white/50 hover:text-white transition-colors border border-white/10 px-4 py-2.5 rounded-full hover:bg-white/5 cursor-pointer outline-none"
          >
            <Share2 className="w-3.5 h-3.5" /> Share Article
          </button>
        </div>

        {/* Hero Meta */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] font-semibold text-cosmic-gold mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-twinkle" />
            {post.category}
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-shimmer tracking-wide leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs text-white/35 font-sans font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Article Body */}
        <m.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass rounded-[32px] p-6 sm:p-12 border border-white/5 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-6 right-6 opacity-5 pointer-events-none hidden sm:block">
            <SacredGeometry size={100} />
          </div>

          <RichText text={post.content} />
        </m.div>

        {/* Sticky CTA Block */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 glass-gold rounded-[32px] p-8 sm:p-12 border border-cosmic-gold/25 text-center flex flex-col items-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-cosmic-gold/5 rounded-full filter blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/5 rounded-full filter blur-2xl"></div>
          
          <Sparkles className="w-10 h-10 text-cosmic-gold mb-6 animate-float" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">
            Decode Your Personal Destiny
          </h2>
          <p className="text-cosmic-silver/70 text-sm sm:text-base max-w-lg mb-8 font-light leading-relaxed">
            Calculate your Life Path, Destiny, Soul Urge, and Personality numbers, and receive a comprehensive, downloadable PDF analysis guide.
          </p>
          <Link
            to="/generate"
            className="group relative px-8 py-4 rounded-full bg-cosmic-gold text-cosmic-black font-sans uppercase tracking-[0.2em] text-xs font-bold hover:bg-cosmic-gold-light transition-all duration-300 shadow-[0_0_35px_rgba(212,175,55,0.3)] hover:shadow-[0_0_55px_rgba(212,175,55,0.6)] flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-30deg] -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            <span>Generate Cosmic Report</span>
          </Link>
        </m.div>
      </main>

      <Footer />
    </div>
  );
}
