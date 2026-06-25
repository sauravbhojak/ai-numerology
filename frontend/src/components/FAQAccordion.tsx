import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  q: string;
  a: string;
}

const FAQ_DATA: FAQItem[] = [
  { q: "What is numerology?", a: "Numerology is the ancient study of numbers and their mystical relationship to events and personalities. It uses your birth date and full name to reveal hidden truths about your life path, destiny, and soul's purpose." },
  { q: "How is the Life Path Number calculated?", a: "Your Life Path Number is derived by reducing your full birth date (day + month + year) to a single digit or master number (11, 22, 33). It reveals your life's purpose and the lessons you are here to learn." },
  { q: "What is the Destiny Number?", a: "The Destiny Number (also called Expression Number) is calculated from the full numerical value of all letters in your complete birth name. It reveals your talents, abilities, and life goals." },
  { q: "What are Master Numbers?", a: "Master Numbers (11, 22, 33) are considered spiritually significant and are not reduced further. They carry intensified vibrations and greater challenges, but also greater potential and power." },
  { q: "Is this reading accurate?", a: "Numerology is a spiritual and metaphysical art. Our calculations follow the classical Pythagorean system. The AI interpretation provides guidance and reflection — treat it as a mirror for self-discovery rather than a literal prediction." },
  { q: "Can I download my report?", a: "Yes! After generating your report, click the 'Download PDF' button to get a beautifully designed PDF of your complete numerology reading to keep forever." },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {FAQ_DATA.map((item, i) => (
        <div
          key={i}
          className="glass rounded-xl border border-white/8 overflow-hidden"
        >
          <button
            id={`faq-${i}`}
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left text-white font-medium hover:text-cosmic-gold transition-colors"
          >
            {item.q}
            <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-cosmic-gold flex-shrink-0" />
            </motion.div>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="px-6 pb-5 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-3">
                  {item.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
