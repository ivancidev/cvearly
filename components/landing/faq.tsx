"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: t("landing.faq.q1"),
      answer: t("landing.faq.a1"),
    },
    {
      question: t("landing.faq.q2"),
      answer: t("landing.faq.a2"),
    },
    {
      question: t("landing.faq.q3"),
      answer: t("landing.faq.a3"),
    },
    {
      question: t("landing.faq.q4"),
      answer: t("landing.faq.a4"),
    },
  ];

  const toggle = (i: number) => {
    setActiveIndex(activeIndex === i ? null : i);
  };

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          {t("landing.faq.title")}
        </h2>
        <p className="text-zinc-500 text-sm max-w-md mx-auto">
          {t("landing.faq.subtitle")}
        </p>
      </div>

      <div className="border border-zinc-900 bg-zinc-950/40 rounded-2xl divide-y divide-zinc-900 overflow-hidden">
        {faqs.map((faq, i) => {
          const isOpen = activeIndex === i;
          return (
            <div key={i} className="group">
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer transition-colors hover:bg-zinc-900/10"
              >
                <span className="text-sm sm:text-base font-medium text-zinc-200 group-hover:text-white transition-colors">
                  {faq.question}
                </span>
                <span
                  className={`ml-4 flex-shrink-0 text-zinc-500 transition-transform duration-300 ${
                    isOpen ? "rotate-45 text-white" : ""
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed font-sans">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default FAQ;

