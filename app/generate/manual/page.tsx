"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { getRateLimitState, consumeRateLimit } from "@/lib/rate-limit";

const DAILY_LIMIT = 3;

const loadingSteps = [
  "Processing your details...",
  "Connecting to public GitHub API...",
  "Analyzing top starred repositories...",
  "Extracting critical keywords from job offer...",
  "Tailoring experience milestones using active verbs...",
  "Running ATS score verification... Almost ready!",
];

export default function ManualPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [extraContext, setExtraContext] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [remainingGenerations, setRemainingGenerations] = useState<number>(
    () => getRateLimitState(DAILY_LIMIT)
  );
  const isLimitReached = remainingGenerations <= 0;

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setProgressStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 3500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const MAX_FILE_BYTES = 7 * 1024 * 1024;

  const validateAndSetFile = (f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "txt"].includes(ext ?? "")) {
      setError("Unsupported format. Please upload PDF, DOCX, or TXT.");
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setError(`File too large (${(f.size / 1024 / 1024).toFixed(1)} MB). Max 7 MB.`);
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };

  const fileToBase64 = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
    });

  const fileToText = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(f);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) { setError("Please fill in Full Name and Email."); return; }
    if (!jobDescription) { setError("Please paste the job description."); return; }

    setIsGenerating(true);
    setProgressStep(0);
    setError(null);

    try {
      let pdfFileBase64 = "";
      let docxFileBase64 = "";
      let extractedCvText = "";

      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext === "pdf") pdfFileBase64 = await fileToBase64(file);
        else if (ext === "docx") docxFileBase64 = await fileToBase64(file);
        else if (ext === "txt") extractedCvText = await fileToText(file);
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          githubUrl,
          jobDescription,
          extraContext,
          pdfFileBase64,
          docxFileBase64,
          extractedCvText,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate optimized resume");
      }

      const data = await response.json();
      sessionStorage.setItem("cv_result", JSON.stringify(data));
      setRemainingGenerations(consumeRateLimit(remainingGenerations));
      router.push("/result");
    } catch (err) {
      const rawMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(
        rawMsg.includes("503") || rawMsg.includes("UNAVAILABLE")
          ? "Gemini is experiencing high demand. Please try again in a moment."
          : rawMsg
      );
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0F] text-zinc-100 flex flex-col selection:bg-violet-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_50%_-100px,rgba(6,182,212,0.07),transparent_70%)] pointer-events-none z-0" />
      <Navbar />

      <main className="flex-grow relative z-10 w-full max-w-xl mx-auto px-6 py-10 md:py-14">
        <AnimatePresence mode="wait">
          {!isGenerating ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35 }}
            >
              {/* Back link */}
              <Link
                href="/generate"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-8 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Choose differently
              </Link>

              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full mb-4">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Fill manually
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                  Build from scratch
                </h1>
                <p className="text-sm text-zinc-400">
                  Enter your details below. Optionally upload your CV at the bottom to enrich the AI&apos;s output.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Ada Lovelace"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="ada@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* GitHub */}
                <Input
                  label={
                    <span className="flex items-center justify-between w-full">
                      <span>GitHub Profile URL</span>
                      <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Optional
                      </span>
                    </span>
                  }
                  placeholder="https://github.com/username"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />

                {/* Job Description */}
                <Textarea
                  label="Job Description"
                  placeholder="Paste the job offer details, requirements, and keywords here..."
                  className="h-36"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                />

                {/* Extra Context */}
                <Textarea
                  label={
                    <span className="flex items-center justify-between w-full">
                      <span>Extra Context</span>
                      <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Optional
                      </span>
                    </span>
                  }
                  placeholder="Certifications, key achievements, or anything you want to prioritize..."
                  className="h-24"
                  value={extraContext}
                  onChange={(e) => setExtraContext(e.target.value)}
                />

                {/* CV Upload — optional enrichment */}
                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">Boost with your CV</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Upload your existing resume for richer, more accurate output</p>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full uppercase tracking-wider flex-shrink-0 ml-3">
                      Optional
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                  />

                  {file ? (
                    <div className="flex items-center justify-between bg-emerald-500/[0.04] border border-emerald-500/20 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-zinc-200 truncate">{file.name}</p>
                          <p className="text-[11px] text-zinc-500">{(file.size / 1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="text-xs text-zinc-600 hover:text-red-400 border border-zinc-800 hover:border-red-500/30 px-2.5 py-1 rounded-lg transition-colors ml-3 flex-shrink-0 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border border-dashed rounded-xl px-4 py-5 flex items-center gap-4 cursor-pointer transition-all ${
                        isDragActive
                          ? "border-zinc-500 bg-zinc-900/20"
                          : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/20"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">
                          <span className="text-zinc-300 font-medium">Click to upload</span> or drag &amp; drop
                        </p>
                        <p className="text-xs text-zinc-600 mt-0.5">PDF, DOCX, or TXT · Max 7 MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400 flex items-start gap-2.5">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
                      <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLimitReached}
                  className="w-full font-semibold mt-2"
                >
                  {isLimitReached ? "Daily limit reached" : "Optimize my CV"}
                </Button>

                {isLimitReached ? (
                  <div className="text-center p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
                    <p className="text-xs text-amber-400">
                      You&apos;ve used your {DAILY_LIMIT} free generations for today. Resets tomorrow — or{" "}
                      <a href="https://github.com/ivancidev/cvearly" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-300 cursor-pointer">
                        self-host with your API key
                      </a>.
                    </p>
                  </div>
                ) : (
                  <p className="text-center text-xs text-zinc-500">
                    <span className={`font-semibold ${remainingGenerations === 1 ? "text-amber-400" : "text-zinc-400"}`}>
                      {remainingGenerations}
                    </span>{" "}
                    of {DAILY_LIMIT} free generations remaining today
                  </p>
                )}
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500/10 animate-ping" />
                <svg className="w-full h-full animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <motion.h3
                key={progressStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-lg font-bold text-white mb-3"
              >
                {loadingSteps[progressStep]}
              </motion.h3>
              <p className="text-sm text-zinc-500 max-w-xs">
                We extract keywords, analyze commits, and build your tailor-made document. Up to 20 seconds.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
