"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { useTranslations } from "next-intl";

export default function GeneratePage() {
  const t = useTranslations();

  const paths = [
    {
      href: "/generate/upload",
      badge: t("generate.upload.badge"),
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      title: t("generate.upload.title"),
      description: t("generate.upload.desc"),
      bullets: [
        t("generate.upload.bullet1"),
        t("generate.upload.bullet2"),
        t("generate.upload.bullet3"),
      ],
      bulletColor: "text-violet-400",
      cta: t("generate.upload.cta"),
      cardBorder: "border-violet-500/25 hover:border-violet-500/50",
      cardBg: "bg-[#0e0b1a]",
      iconBg: "bg-violet-500/10 border-violet-500/20 text-violet-400",
      ctaClass:
        "bg-violet-600 hover:bg-violet-500 text-white border border-violet-500/40",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <polyline points="9 15 12 12 15 15" />
        </svg>
      ),
    },
    {
      href: "/generate/manual",
      badge: t("generate.manual.badge"),
      badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      title: t("generate.manual.title"),
      description: t("generate.manual.desc"),
      bullets: [
        t("generate.manual.bullet1"),
        t("generate.manual.bullet2"),
        t("generate.manual.bullet3"),
      ],
      bulletColor: "text-cyan-400",
      cta: t("generate.manual.cta"),
      cardBorder: "border-zinc-700/40 hover:border-cyan-500/40",
      cardBg: "bg-[#0c0f14]",
      iconBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
      ctaClass:
        "bg-transparent hover:bg-white/[0.04] text-zinc-200 border border-zinc-700 hover:border-cyan-500/50",
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
    },
  ];

  const steps = [
    {
      n: "01",
      label: t("generate.steps.s1Title"),
      desc: t("generate.steps.s1Desc"),
    },
    {
      n: "02",
      label: t("generate.steps.s2Title"),
      desc: t("generate.steps.s2Desc"),
    },
    {
      n: "03",
      label: t("generate.steps.s3Title"),
      desc: t("generate.steps.s3Desc"),
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#0A0A0F] text-zinc-100 flex flex-col selection:bg-violet-500/30 selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_-150px,rgba(124,58,237,0.12),transparent_70%)] pointer-events-none z-0" />

      <Navbar />

      <main className="flex-grow relative z-10 flex flex-col items-center px-6 py-14 md:py-20">

        {/* Back Link */}
        <div className="w-full max-w-3xl flex justify-start mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {t("navbar.backHome")}
          </Link>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-12 max-w-xl"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            {t("generate.title")}
          </h1>
          <p className="text-base text-zinc-400">
            {t("generate.subtitle")}
          </p>
        </motion.div>

        {/* Path Cards */}
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {paths.map((p, i) => (
            <motion.div
              key={p.href}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            >
              <Link
                href={p.href}
                className={`group flex flex-col h-full rounded-2xl border ${p.cardBorder} ${p.cardBg} p-6 transition-all duration-200 cursor-pointer`}
              >
                {/* Icon + Badge row */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-13 h-13 w-[52px] h-[52px] rounded-xl border flex items-center justify-center ${p.iconBg} transition-transform duration-200 group-hover:scale-105`}>
                    {p.icon}
                  </div>
                  <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </div>

                {/* Text */}
                <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
                  {p.title}
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed mb-5 flex-grow">
                  {p.description}
                </p>

                {/* Bullets */}
                <ul className="flex flex-col gap-2 mb-6">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2.5 text-sm text-zinc-300">
                      <svg className={`w-4 h-4 flex-shrink-0 ${p.bulletColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className={`w-full py-3 px-4 rounded-xl font-semibold text-sm text-center transition-all ${p.ctaClass} flex items-center justify-center gap-2`}>
                  {p.cta}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-full max-w-3xl"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 text-center mb-6">
            {t("generate.steps.title")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col gap-2 p-5 rounded-xl border border-zinc-900 bg-zinc-950/40">
                <span className="text-2xl font-black text-zinc-800 font-mono">{s.n}</span>
                <span className="text-sm font-semibold text-zinc-200">{s.label}</span>
                <span className="text-xs text-zinc-500 leading-relaxed">{s.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
}
