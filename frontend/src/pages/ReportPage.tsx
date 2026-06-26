import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Sparkles, ArrowLeft, Wand2, AtSign } from "lucide-react";
import toast from "react-hot-toast";
import StarField from "../components/StarField";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Numeroscope from "../components/Numeroscope";
import SacredGeometry from "../components/SacredGeometry";
import { downloadPdf } from "../services/api";
import type { ReportResponse } from "../types";

const AI_SECTION_ICONS: Record<string, string> = {
  "core personality": "✨",
  "career": "💼",
  "professional": "💼",
  "relationships": "💕",
  "love": "💕",
  "strengths": "🌟",
  "natural gifts": "🌟",
  "challenges": "🌱",
  "growth": "🌱",
  "current year": "🌀",
  "personal year": "🌀",
  "spiritual": "🔮",
  "advice": "🔮",
  "guidance": "🔮",
};

function parseAIResponse(text: string) {
  const sections: { heading: string; content: string }[] = [];
  const lines = text.split("\n");
  let current: { heading: string; content: string[] } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      if (current) {
        sections.push({ ...current, content: current.content.join("\n").trim() });
      }
      const rawHeading = trimmed.replace(/^##\s*/, "").trim();
      const cleanHeading = rawHeading.replace(/✨|💼|💕|🌟|🌱|🌀|🔮|✦|★|☆|💫/g, "").trim();
      current = { heading: cleanHeading || rawHeading, content: [] };
    } else if (current) {
      current.content.push(line);
    }
  }
  if (current) {
    sections.push({ ...current, content: current.content.join("\n").trim() });
  }
  return sections;
}

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
          <p key={`p-${elements.length}`} className="text-[#D1D1D6]/90 leading-relaxed text-base sm:text-lg font-light mb-5 tracking-wide">
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

    if (line.startsWith("### ") || line.startsWith("#### ")) {
      flushParagraph();
      const headerText = line.replace(/^#{3,4}\s*/, "");
      elements.push(
        <h4 key={`h-${elements.length}`} className="font-serif text-lg sm:text-xl font-bold text-cosmic-gold mt-6 mb-3 flex items-center gap-2 border-l-2 border-cosmic-gold pl-3">
          {renderInlineFormatting(headerText)}
        </h4>
      );
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ") || /^\d+\.\s/.test(line)) {
      flushParagraph();
      const bulletText = line.replace(/^(-\s|\*\s|\d+\.\s)/, "");
      elements.push(
        <div key={`li-${elements.length}`} className="flex items-start gap-3 pl-2 sm:pl-4 mb-3 group">
          <span className="text-cosmic-gold mt-1 text-sm select-none group-hover:scale-125 transition-transform">✦</span>
          <div className="text-[#D1D1D6]/90 text-base sm:text-lg leading-relaxed flex-1 font-light">
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

export default function ReportPage() {
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("numerology_report");
    if (!stored) { navigate("/generate"); return; }
    setReport(JSON.parse(stored));
  }, [navigate]);

  if (!report) return null;

  const { numbers } = report;
  const aiSections = parseAIResponse(report.ai_response);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadPdf(report);
      toast.success("PDF downloaded!");
    } catch {
      toast.error("PDF download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <StarField />
      <Navbar />
      <div className="content pt-28 pb-20 px-6 max-w-5xl mx-auto">
        {/* ── Back Button ── */}
        <button
          onClick={() => navigate("/generate")}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Generate another report
        </button>

        {/* ── Header Card ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-gold rounded-3xl p-8 md:p-10 border border-cosmic-gold/20 mb-10 flex flex-col md:flex-row items-center gap-8"
        >
          <SacredGeometry size={140} />
          <div className="flex-1 text-center md:text-left">
            <div className="text-cosmic-gold/60 text-sm mb-1">Your Cosmic Reading</div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">
              {report.full_name}
            </h1>
            <div className="flex flex-wrap gap-4 text-white/50 text-sm mt-3 justify-center md:justify-start">
              <span>🎂 {report.dob}</span>
              <span>🌍 {report.country}</span>
              <span>📅 {report.generated_at}</span>
            </div>
            {report.question && (
              <p className="mt-4 text-white/40 text-sm italic">
                "{report.question}"
              </p>
            )}
          </div>
        </motion.div>

        {/* ── Core Numbers Numeroscope ── */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-serif text-3xl font-bold text-shimmer">◈ Core Numeroscope</h2>
          <div className="h-px bg-cosmic-gold/20 flex-1"></div>
        </div>
        <div className="mb-16">
          <Numeroscope numbers={numbers as any} />
        </div>

        {/* ── Lucky Section ── */}
        <h2 className="font-serif text-3xl font-bold text-shimmer mb-6">◈ Lucky Attributes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            { title: "Lucky Numbers", items: numbers.lucky_numbers.map(String), emoji: "🔢" },
            { title: "Lucky Colors",  items: numbers.lucky_colors,               emoji: "🎨" },
            { title: "Lucky Days",    items: numbers.lucky_days,                  emoji: "📅" },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/8"
            >
              <div className="text-2xl mb-3">{card.emoji}</div>
              <div className="text-white font-semibold mb-3">{card.title}</div>
              <div className="flex flex-wrap gap-2">
                {card.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 rounded-full glass-gold text-cosmic-gold text-sm border border-cosmic-gold/20"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Name Optimizations ── */}
        {((numbers.name_optimizations?.length ?? 0) > 0 || (numbers.lucky_handles?.length ?? 0) > 0) && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-serif text-3xl font-bold text-shimmer">◈ Name Optimization</h2>
              <div className="h-px bg-cosmic-gold/20 flex-1"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {(numbers.name_optimizations?.length ?? 0) > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="relative group overflow-hidden glass rounded-3xl p-1 border border-cosmic-gold/30 hover:border-cosmic-gold/60 transition-colors duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cosmic-gold/5 via-transparent to-cosmic-purple/10 group-hover:opacity-100 opacity-50 transition-opacity duration-500"></div>
                  <div className="relative bg-[#050010]/80 rounded-[22px] p-6 h-full backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-full bg-cosmic-gold/10 text-cosmic-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                        <Wand2 className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-white">Lucky Spellings</h3>
                    </div>
                    <p className="text-sm text-white/50 mb-6 leading-relaxed">
                      These mathematical variations of your name align perfectly with your Destiny Number's most fortunate frequency.
                    </p>
                    <div className="flex flex-col gap-3">
                      {numbers.name_optimizations?.map((name: string, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-cosmic-gold/10 hover:border-cosmic-gold/30 transition-all cursor-default">
                          <span className="font-serif text-lg text-white">
                            <span className="text-cosmic-gold font-bold">{name}</span> {report.full_name.split(" ").slice(1).join(" ")}
                          </span>
                          <Sparkles className="w-4 h-4 text-cosmic-gold/50" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {(numbers.lucky_handles?.length ?? 0) > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="relative group overflow-hidden glass rounded-3xl p-1 border border-[#9d4edd]/30 hover:border-[#9d4edd]/60 transition-colors duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#9d4edd]/5 via-transparent to-[#9d4edd]/10 group-hover:opacity-100 opacity-50 transition-opacity duration-500"></div>
                  <div className="relative bg-[#050010]/80 rounded-[22px] p-6 h-full backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-full bg-[#9d4edd]/10 text-[#9d4edd] shadow-[0_0_15px_rgba(157,78,221,0.2)]">
                        <AtSign className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-white">Social Handles</h3>
                    </div>
                    <p className="text-sm text-white/50 mb-6 leading-relaxed">
                      These handles mathematically match your lucky numerology vibration, enhancing your digital presence.
                    </p>
                    <div className="flex flex-col gap-3">
                      {numbers.lucky_handles?.map((handle: string, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-[#9d4edd]/10 hover:border-[#9d4edd]/30 transition-all cursor-default">
                          <span className="font-mono text-base tracking-wide text-[#e0aaff]">
                            @{handle}
                          </span>
                          <Sparkles className="w-4 h-4 text-[#9d4edd]/50" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </>
        )}

        {/* ── AI Reading Section ── */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-serif text-3xl font-bold text-shimmer tracking-wide">◈ AI Numerology Reading</h2>
          <div className="h-px bg-cosmic-gold/30 flex-1"></div>
        </div>

        <div className="space-y-8 mb-16">
          {aiSections.length > 0 ? (
            aiSections.map((section, i) => {
              const iconKey = Object.keys(AI_SECTION_ICONS).find((k) =>
                section.heading.toLowerCase().includes(k)
              );
              const icon = iconKey ? AI_SECTION_ICONS[iconKey] : "✦";

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="glass-gold rounded-[28px] p-6 sm:p-10 border border-cosmic-gold/25 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden group hover:border-cosmic-gold/45 transition-all duration-500"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="flex items-center gap-4 pb-5 mb-6 border-b border-white/10">
                    <div className="text-2xl sm:text-3xl p-3 rounded-2xl bg-cosmic-gold/15 border border-cosmic-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.2)] select-none">
                      {icon}
                    </div>
                    <div>
                      <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-cosmic-gold font-semibold block mb-1">
                        Chapter 0{i + 1}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                        {section.heading}
                      </h3>
                    </div>
                  </div>

                  <RichText text={section.content} />
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-gold rounded-[28px] p-8 sm:p-12 border border-cosmic-gold/25 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center gap-4 pb-5 mb-6 border-b border-white/10">
                <div className="text-3xl p-3 rounded-2xl bg-cosmic-gold/15 border border-cosmic-gold/30">
                  ✨
                </div>
                <h3 className="font-serif text-3xl font-bold text-white tracking-wide">
                  Complete Mystical Interpretation
                </h3>
              </div>
              <RichText text={report.ai_response} />
            </motion.div>
          )}
        </div>

        {/* ── Download Button ── */}
        <div className="flex justify-center">
          <button
            id="download-pdf-btn"
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-3 px-10 py-5 rounded-full bg-cosmic-gold text-cosmic-deep font-bold text-lg hover:bg-cosmic-gold-light transition-all shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:shadow-[0_0_50px_rgba(212,175,55,0.7)] disabled:opacity-60"
          >
            {downloading ? (
              <><Sparkles className="w-5 h-5 animate-spin" /> Generating PDF…</>
            ) : (
              <><Download className="w-5 h-5" /> Download Beautiful PDF</>
            )}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
