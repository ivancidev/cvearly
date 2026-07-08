"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ShowcaseMockup() {
  const [stage, setStage] = useState(0); // 0: Idle/Raw, 1: Scanning/Transition, 2: Compiled/Optimized
  const [scoreRight, setScoreRight] = useState(0);

  useEffect(() => {
    const runAnimationCycle = () => {
      // Step 1: Reset to Stage 0
      setStage(0);
      setScoreRight(0);

      // Step 2: Start scan transition after 1.5s
      const scanTimer = setTimeout(() => {
        setStage(1);
      }, 1500);

      // Step 3: Reveal optimized document after 3.5s
      const optimizeTimer = setTimeout(() => {
        setStage(2);
        
        // Roll up optimized score
        let current = 0;
        const interval = setInterval(() => {
          current += 2;
          if (current >= 96) {
            current = 96;
            clearInterval(interval);
          }
          setScoreRight(current);
        }, 15);
      }, 3500);

      return () => {
        clearTimeout(scanTimer);
        clearTimeout(optimizeTimer);
      };
    };

    runAnimationCycle();
    const cycleInterval = setInterval(runAnimationCycle, 11000); // Repeat every 11s

    return () => clearInterval(cycleInterval);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 p-1 border border-zinc-900 bg-zinc-950/60 rounded-2xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative top window bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 bg-zinc-950">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
        </div>
        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          resume_compiler_pipeline
        </div>
        <div className="w-12" />
      </div>

      {/* Main compilation sandbox - Taller height to showcase complete CV document layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 bg-[#030303]/90 items-center min-h-[520px]">
        {/* Left Side: Draft Resume (Unoptimized White Document Sheet) */}
        <div className="md:col-span-2 border border-zinc-900 bg-zinc-950/40 p-4 rounded-xl flex flex-col h-[460px] relative overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-zinc-500">resume_draft.docx</span>
              <span className="text-[10px] text-amber-500 font-mono bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                Score: 48%
              </span>
            </div>
            
            {/* Visual draft resume document sheet - White Paper Mockup (Fully Filled) */}
            <div className="bg-white text-zinc-700 rounded-lg p-4 text-left overflow-hidden h-[400px] border border-zinc-200 shadow-lg relative select-none">
              {/* Laser scanning overlay line and glow */}
              {stage === 1 && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  {/* Scanning Laser Line */}
                  <motion.div
                    initial={{ top: "0%" }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                  />
                  {/* Scanning Light overlay trailing the line */}
                  <motion.div
                    initial={{ opacity: 0.1, height: "0%" }}
                    animate={{ height: ["0%", "100%", "0%"], opacity: [0.05, 0.12, 0.05] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    className="absolute left-0 w-full bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none"
                  />
                </div>
              )}
              
              <div className="space-y-2 font-serif text-[7px] leading-tight text-zinc-500">
                {/* CV Header */}
                <div className="text-center space-y-0.5 border-b border-zinc-200 pb-1.5">
                  <h4 className="text-zinc-700 font-bold text-[9px] leading-none uppercase">John Doe</h4>
                  <p className="text-[6px]">johndoe@email.com &bull; github.com/johndoe</p>
                </div>

                {/* CV Summary */}
                <div className="space-y-0.5">
                  <p className="text-zinc-600 font-bold text-[6.5px] uppercase tracking-wide">Summary</p>
                  <p className="text-[6px] leading-relaxed">Developer with 3+ years of experience. I like making websites and working in teams. Good at fixing problems and writing code.</p>
                </div>
                
                {/* CV Work Experience */}
                <div className="space-y-1 border-t border-zinc-200 pt-1.5">
                  <p className="text-zinc-600 font-bold text-[6.5px] uppercase tracking-wide">Work Experience</p>
                  
                  {/* Job 1 */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[6px] text-zinc-500 font-semibold">
                      <span>Developer - Tech Solutions</span>
                      <span>2023 - Present</span>
                    </div>
                    <div className="space-y-0.5 pl-1.5">
                      <p>&bull; Worked on web pages using react and javascript.</p>
                      <p>&bull; Responsible for fixing bug tickets and writing tests.</p>
                      <p>&bull; Helped the team with various tasks.</p>
                    </div>
                  </div>

                  {/* Job 2 */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[6px] text-zinc-500 font-semibold">
                      <span>Junior Web Builder - Code Labs</span>
                      <span>2021 - 2023</span>
                    </div>
                    <div className="space-y-0.5 pl-1.5">
                      <p>&bull; Wrote raw HTML/CSS templates for local businesses.</p>
                      <p>&bull; Uploaded code files to database tables.</p>
                    </div>
                  </div>
                </div>

                {/* CV Selected Projects */}
                <div className="space-y-0.5 border-t border-zinc-200 pt-1.5">
                  <p className="text-zinc-600 font-bold text-[6.5px] uppercase tracking-wide">Selected Projects</p>
                  <div className="text-[6px] text-zinc-500 font-semibold">
                    <span>cvearly - Personal Project</span>
                  </div>
                  <div className="space-y-0.5 pl-1.5">
                    <p>&bull; Created a script to generate resume files.</p>
                    <p>&bull; Used javascript and some other tools.</p>
                  </div>
                </div>

                {/* CV Education */}
                <div className="space-y-0.5 border-t border-zinc-200 pt-1.5">
                  <p className="text-zinc-600 font-bold text-[6.5px] uppercase tracking-wide">Education</p>
                  <div className="flex justify-between text-[6px] text-zinc-500 font-semibold">
                    <span>State University - Computer Systems</span>
                    <span>Graduated 2022</span>
                  </div>
                  <p className="pl-1.5 text-[6px]">General computer courses, programming basics.</p>
                </div>

                {/* CV Technical Skills */}
                <div className="space-y-0.5 border-t border-zinc-200 pt-1.5">
                  <p className="text-zinc-600 font-bold text-[6.5px] uppercase tracking-wide">Skills</p>
                  <p className="text-[6px]">React, JS, HTML, CSS, Git, Node, SQL</p>
                </div>

                {/* CV Languages */}
                <div className="space-y-0.5 border-t border-zinc-200 pt-1.5">
                  <p className="text-zinc-600 font-bold text-[6.5px] uppercase tracking-wide">Languages</p>
                  <p className="text-[6px]">English (conversational), Spanish (native)</p>
                </div>

                {/* CV References */}
                <div className="space-y-0.5 border-t border-zinc-200 pt-1.5">
                  <p className="text-zinc-600 font-bold text-[6.5px] uppercase tracking-wide">References</p>
                  <p className="text-[6px]">Available upon request.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Compile Flow (Transition Scene) */}
        <div className="flex flex-col items-center justify-center py-4 md:py-0 h-full relative">
          {/* Animated line connector */}
          <div className="hidden md:block w-full h-[1px] bg-zinc-900 absolute top-1/2 -translate-y-1/2 z-0" />

          <div className="z-10 bg-zinc-950 border border-zinc-800 p-2.5 rounded-full shadow-lg flex items-center justify-center w-12 h-12">
            {stage === 1 ? (
              <svg className="w-5 h-5 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : stage === 2 ? (
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </div>

          {/* Particle effect flowing from left to right */}
          {stage === 1 && (
            <div className="absolute inset-0 pointer-events-none hidden md:block">
              {/* Dynamic particle dots moving across */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 100, opacity: [0, 1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-[45%] left-1/2"
              />
              <motion.div
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 80, opacity: [0, 1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.0, delay: 0.3, ease: "linear" }}
                className="w-1 h-1 rounded-full bg-cyan-400 absolute top-[55%] left-1/2"
              />
            </div>
          )}
        </div>

        {/* Right Side: Compiled & Optimized Resume (Pristine White Document Sheet) */}
        <div className={`md:col-span-2 border rounded-xl p-4 flex flex-col h-[460px] relative overflow-hidden transition-all duration-500 ${
          stage === 2 
            ? "border-emerald-500/20 bg-[#09090b]/40 shadow-[0_0_20px_rgba(16,185,129,0.02)]" 
            : "border-zinc-900 bg-zinc-950/20 opacity-50"
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-zinc-500">cvearly_optimized.docx</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors duration-500 ${
                stage === 2 
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
                  : "text-zinc-600 bg-zinc-900 border-zinc-800"
              }`}>
                Score: {scoreRight}%
              </span>
            </div>

            {/* Compiled resume document display - White Paper Mockup (Fully Filled) */}
            {stage === 2 ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white text-zinc-900 rounded-lg p-4 border border-zinc-200 shadow-xl text-left overflow-hidden h-[400px] font-serif select-none"
              >
                <div className="space-y-2 text-[7px] leading-tight text-zinc-600">
                  {/* CV Header */}
                  <div className="text-center space-y-0.5 border-b-2 border-zinc-800 pb-1.5">
                    <h4 className="text-zinc-950 font-bold text-[10px] leading-none uppercase tracking-widest">John Doe</h4>
                    <p className="text-[6px] text-zinc-500">johndoe@email.com &bull; github.com/johndoe &bull; SF, CA &bull; (555) 0199</p>
                    <p className="text-[5.5px] text-zinc-400">linkedin.com/in/johndoe &bull; johndoe.dev</p>
                  </div>

                  {/* CV Professional Summary */}
                  <div className="space-y-0.5">
                    <p className="text-zinc-950 font-bold text-[6.5px] uppercase tracking-widest">Professional Summary</p>
                    <p className="text-[6px] leading-relaxed">Results-driven Software Engineer with 3+ years of experience delivering high-performance web applications. Proven track record of optimizing system performance and collaborating across cross-functional teams to ship production-grade features on schedule.</p>
                  </div>

                  {/* CV Work Experience */}
                  <div className="space-y-1 border-t border-zinc-200 pt-1.5">
                    <div className="flex justify-between items-center">
                      <p className="text-zinc-950 font-bold text-[6.5px] uppercase tracking-widest">Professional Experience</p>
                      <span className="text-[5.5px] text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200 font-semibold font-mono">ATS Match</span>
                    </div>
                    
                    {/* Job 1 */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[6px] text-zinc-700 font-bold">
                        <span>Software Engineer II — Tech Solutions</span>
                        <span>Jan 2023 – Present</span>
                      </div>
                      <div className="space-y-0.5 pl-1.5">
                        <p><span className="text-emerald-500 font-bold mr-1">&bull;</span> Architected interactive interfaces using <strong className="text-zinc-950">Next.js App Router</strong> and React 19.</p>
                        <p><span className="text-emerald-500 font-bold mr-1">&bull;</span> Optimized client bundle size by <strong className="text-zinc-950">35%</strong> via code-splitting and lazy imports.</p>
                        <p><span className="text-emerald-500 font-bold mr-1">&bull;</span> Led 4-engineer team migrating legacy monolith to micro-frontend architecture.</p>
                      </div>
                    </div>

                    {/* Job 2 */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[6px] text-zinc-700 font-bold">
                        <span>Associate Software Engineer — Code Labs</span>
                        <span>Jun 2021 – Dec 2022</span>
                      </div>
                      <div className="space-y-0.5 pl-1.5">
                        <p><span className="text-emerald-500 font-bold mr-1">&bull;</span> Designed type-safe REST endpoints using <strong className="text-zinc-950">TypeScript</strong> generics and Zod.</p>
                        <p><span className="text-emerald-500 font-bold mr-1">&bull;</span> Reduced database query response time by <strong className="text-zinc-950">20%</strong> through indexing.</p>
                      </div>
                    </div>
                  </div>

                  {/* CV Selected Projects */}
                  <div className="space-y-0.5 border-t border-zinc-200 pt-1.5">
                    <p className="text-zinc-950 font-bold text-[6.5px] uppercase tracking-widest">Featured Projects</p>
                    <div className="flex justify-between text-[6px] text-zinc-700 font-bold">
                      <span>CVEarly — Open Source AI Resume Compiler</span>
                      <span>Creator</span>
                    </div>
                    <div className="space-y-0.5 pl-1.5">
                      <p><span className="text-emerald-500 font-bold mr-1">&bull;</span> Built AI pipeline parsing GitHub profiles into ATS-optimized Word Documents.</p>
                      <p><span className="text-emerald-500 font-bold mr-1">&bull;</span> Achieved <strong className="text-zinc-950">96% ATS pass rate</strong> across Fortune 500 job descriptions.</p>
                    </div>
                  </div>

                  {/* CV Education */}
                  <div className="space-y-0.5 border-t border-zinc-200 pt-1.5">
                    <p className="text-zinc-950 font-bold text-[6.5px] uppercase tracking-widest">Education</p>
                    <div className="flex justify-between text-[6px] text-zinc-700 font-bold">
                      <span>B.S. Computer Science — State University</span>
                      <span>2022</span>
                    </div>
                    <p className="pl-1.5 text-[6px]">GPA: 3.7 / 4.0 &bull; Dean&apos;s List &bull; Algorithms, Distributed Systems, OS</p>
                  </div>

                  {/* CV Technical Skills */}
                  <div className="space-y-0.5 border-t border-zinc-200 pt-1.5">
                    <p className="text-zinc-950 font-bold text-[6.5px] uppercase tracking-widest">Technical Skills</p>
                    <p className="text-[6px]"><strong className="text-zinc-900">Languages:</strong> TypeScript, JavaScript, Python, SQL</p>
                    <p className="text-[6px]"><strong className="text-zinc-900">Frameworks:</strong> Next.js, React 19, Node.js, Express, Prisma</p>
                    <p className="text-[6px]"><strong className="text-zinc-900">Tools:</strong> Git, Docker, Vercel, AWS, Figma, Linear</p>
                  </div>

                  {/* CV Certifications */}
                  <div className="space-y-0.5 border-t border-zinc-200 pt-1.5">
                    <p className="text-zinc-950 font-bold text-[6.5px] uppercase tracking-widest">Certifications</p>
                    <p className="text-[6px]">AWS Certified Developer – Associate &bull; Google Professional Cloud Developer</p>
                  </div>

                  {/* CV Languages */}
                  <div className="space-y-0.5 border-t border-zinc-200 pt-1.5">
                    <p className="text-zinc-950 font-bold text-[6.5px] uppercase tracking-widest">Languages</p>
                    <p className="text-[6px]">English (Professional) &bull; Spanish (Native)</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[380px] text-center">
                <span className="text-[10px] text-zinc-600 font-mono">
                  {stage === 1 ? "Compiling source data..." : "Waiting for compilation pipeline..."}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ShowcaseMockup;
