"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { CVPreview } from "@/components/result/cv-preview";
import { ATSScore } from "@/components/result/ats-score";
import { DownloadButton } from "@/components/result/download-button";
import { Button } from "@/components/ui/button";
import { GenerationResponse } from "@/types";
import { useTranslation } from "@/lib/i18n";

export default function ResultPage() {
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0 });

    let active = true;

    const timer = setTimeout(() => {
      if (!active) return;
      const cachedResult = sessionStorage.getItem("cv_result");
      if (cachedResult) {
        try {
          const parsed = JSON.parse(cachedResult) as GenerationResponse;
          setResult(parsed);
        } catch (err) {
          console.error("Error parsing cached CV result", err);
        }
      }
      setLoading(false);
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-zinc-100 flex flex-col items-center justify-center">
        <svg className="w-10 h-10 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="relative min-h-screen bg-[#0A0A0F] text-zinc-100 flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-12">
          <div className="max-w-md w-full border border-zinc-900 bg-[#111118]/80 p-8 rounded-3xl flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{t("resultPage.noCv.title")}</h2>
            <p className="text-sm text-zinc-400 mb-6">
              {t("resultPage.noCv.desc")}
            </p>
            <Link href="/generate" className="w-full">
              <Button className="w-full font-semibold">{t("resultPage.noCv.cta")}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A0F] text-zinc-100 flex flex-col selection:bg-violet-500/30 selection:text-white">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 relative z-10 flex flex-col gap-6">

        {/* CV Ready Success Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/35 rounded-2xl p-4 sm:p-5"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 text-zinc-950 font-bold">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-sm sm:text-base text-emerald-300">
              {t("resultPage.success.title")}
            </div>
            <div className="text-xs sm:text-sm text-emerald-400/80 mt-0.5">
              {t("resultPage.success.desc", { count: result.ats.matchedKeywords.length })}
            </div>
          </div>
        </motion.div>

        {/* Dynamic 2-column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-8 items-start mb-12">

          {/* Left Column: CV A4 Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full flex-grow"
          >
            <CVPreview cvData={result.cv} />
          </motion.div>

          {/* Right Column: Score Gauge & Tools */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* ATS Score widget */}
            <ATSScore atsResult={result.ats} />

            {/* CTA download buttons */}
            <div className="flex flex-col gap-3">
              <DownloadButton cvData={result.cv} />

              <Link href="/generate">
                <button className="w-full bg-transparent hover:bg-white/[0.02] border border-zinc-800 hover:border-violet-500/50 text-zinc-300 hover:text-white py-3.5 px-5 rounded-xl font-semibold text-sm transition-all outline-none cursor-pointer">
                  {t("resultPage.actions.generateAgain")}
                </button>
              </Link>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

