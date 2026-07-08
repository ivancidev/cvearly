"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Does cvearly store my uploaded CV or personal data?",
      answer: "No. All CV parsing and keyword analysis happens in-memory during the API lifecycle. We do not store your resumes, contact details, or PDF uploads. The generated CV is saved locally in your browser session for direct download.",
    },
    {
      question: "How does the GitHub integration work?",
      answer: "When you provide your GitHub profile URL, we use the public GitHub API to scan your repositories. We sort them by star count and analyze their programming languages, descriptions, and commit highlights. We use this information to select actual, active projects to back up your experience milestones.",
    },
    {
      question: "Is the final download compatible with ATS scanning platforms?",
      answer: "Yes, fully. We compile the optimized CV directly into standard Word Document format (.docx) using clean paragraph margins, standard fonts, and simple table outlines. This structure guarantees that applicant tracking systems (such as Workday or Greenhouse) can parse the text cleanly.",
    },
    {
      question: "Can I download my CV directly in other formats?",
      answer: "Currently, we compile directly into a .docx document. This provides you with an editable format that you can customize in Microsoft Word or Google Docs before exporting to PDF for final job submissions.",
    },
  ];

  const toggle = (i: number) => {
    setActiveIndex(activeIndex === i ? null : i);
  };

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          Frequently asked questions
        </h2>
        <p className="text-zinc-500 text-sm max-w-md mx-auto">
          Everything you need to know about privacy, compilation, and file formats.
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
