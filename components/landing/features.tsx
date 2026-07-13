"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function Features() {
  const t = useTranslations();
  const [atsScore, setAtsScore] = useState(0);

  useEffect(() => {
    // Animate the mini score card on load
    const timer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 3;
        if (current >= 87) {
          current = 87;
          clearInterval(interval);
        }
        setAtsScore(current);
      }, 30);
      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const }
    }
  };

  const ringOffset = 326.7 * (1 - atsScore / 100);

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
      <h2 className="text-center text-2xl sm:text-4xl font-bold tracking-tight text-white mb-16 text-balance">
        {t("landing.features.title")}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ATS Score Card */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative bg-zinc-950 border border-zinc-900 rounded-2xl p-8 overflow-hidden flex flex-col items-center text-center group hover:border-zinc-800 transition-all duration-300"
        >
          {/* Animated score ring in miniature */}
          <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
            <svg width="110" height="110" viewBox="0 0 120 120" className="transform -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#18181B" strokeWidth="6"/>
              <circle 
                cx="60" 
                cy="60" 
                r="52" 
                fill="none" 
                stroke="#FFFFFF" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeDasharray="326.7" 
                strokeDashoffset={ringOffset}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-zinc-100 font-mono">{atsScore}%</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-zinc-100 mb-2">{t("landing.features.scoreTitle")}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {t("landing.features.scoreDesc")}
          </p>
        </motion.div>

        {/* GitHub Integration Card */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative bg-zinc-950 border border-zinc-900 rounded-2xl p-8 overflow-hidden group hover:border-zinc-800 transition-all duration-300 flex flex-col items-center text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-8 group-hover:text-white group-hover:scale-105 transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-zinc-100 mb-2">{t("landing.features.githubTitle")}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {t("landing.features.githubDesc")}
          </p>
        </motion.div>

        {/* Word Document Card */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative bg-zinc-950 border border-zinc-900 rounded-2xl p-8 overflow-hidden group hover:border-zinc-800 transition-all duration-300 flex flex-col items-center text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-8 group-hover:text-white group-hover:scale-105 transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-zinc-100 mb-2">{t("landing.features.docxTitle")}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {t("landing.features.docxDesc")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
export default Features;

