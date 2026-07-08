"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/button";
import { ShowcaseMockup } from "./showcase-mockup";

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const },
    },
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-12 overflow-hidden">
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,white_75%,transparent_100%)] pointer-events-none z-0" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center"
      >
        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent leading-[1.08] mb-6 text-balance font-sans"
        >
          Your CV, built to <br />
          pass every ATS
        </motion.h1>

        {/* Paragraph description */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10 text-pretty"
        >
          Directly compile your GitHub repositories, code highlights, and professional experience 
          into a tailored, ATS-ready resume engineered for tech recruiters.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 mb-4"
        >
          <Link href="/generate">
            <Button
              size="lg"
              className="px-8 py-4 font-semibold text-base gap-2 flex items-center group"
            >
              Optimize my CV
              <span className="text-zinc-500 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </Button>
          </Link>
        </motion.div>

        <motion.p variants={itemVariants} className="text-xs text-zinc-500 mb-2">
          No signup &bull; Free &bull; Download as .docx
        </motion.p>

        {/* Showcase Mockup */}
        <ShowcaseMockup />
      </motion.div>
    </div>
  );
}
export default Hero;
