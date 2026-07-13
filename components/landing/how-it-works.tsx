"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

export function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      num: "01",
      title: t("landing.howItWorks.step1Title"),
      desc: t("landing.howItWorks.step1Desc"),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      color: "text-zinc-300 border-zinc-800 bg-zinc-900/50",
    },
    {
      num: "02",
      title: t("landing.howItWorks.step2Title"),
      desc: t("landing.howItWorks.step2Desc"),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        </svg>
      ),
      color: "text-zinc-300 border-zinc-800 bg-zinc-900/50",
    },
    {
      num: "03",
      title: t("landing.howItWorks.step3Title"),
      desc: t("landing.howItWorks.step3Desc"),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
      color: "text-zinc-300 border-zinc-800 bg-zinc-900/50",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.2, 0.7, 0.2, 1] as const,
      },
    }),
  };

  return (
    <section id="how-it-works" className="relative z-10 max-w-6xl mx-auto px-6 py-16 scroll-mt-24">
      <p className="text-center text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-3">
        {t("landing.howItWorks.tag")}
      </p>
      <h2 className="text-center text-2xl sm:text-4xl font-bold tracking-tight text-white mb-16">
        {t("landing.howItWorks.title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 hover:border-zinc-800 transition-colors group"
          >
            {/* Step Icon */}
            <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-6 group-hover:text-white group-hover:scale-105 transition-all ${step.color}`}>
              {step.icon}
            </div>

            {/* Step Number */}
            <div className="font-mono text-xs font-semibold text-zinc-500 mb-2">
              {step.num}
            </div>

            {/* Title & Desc */}
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">{step.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
export default HowItWorks;

