"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { getRateLimitState, consumeRateLimit } from "@/lib/rate-limit";

type Mode = "upload" | "manual";

export function CVForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<Mode>("upload");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [extraContext, setExtraContext] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // UI states
  const [isDragActive, setIsDragActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const DAILY_LIMIT = 3;

  const [remainingGenerations, setRemainingGenerations] = useState<number>(
    () => getRateLimitState(DAILY_LIMIT)
  );
  const [error, setError] = useState<string | null>(null);
  const isLimitReached = remainingGenerations <= 0;

  const loadingSteps = [
    "Reading uploaded resume profile...",
    "Connecting to public GitHub API...",
    "Analyzing top starred repositories...",
    "Extracting critical keywords from job offer...",
    "Tailoring experience milestones using active verbs...",
    "Running ATS score verification... Almost ready!",
  ];

  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setProgressStep((prev) =>
        prev < loadingSteps.length - 1 ? prev + 1 : prev
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [isGenerating, loadingSteps.length]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const MAX_FILE_BYTES = 7 * 1024 * 1024;

  const validateAndSetFile = (f: File): void => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "txt"].includes(ext ?? "")) {
      setError("Unsupported file format. Please upload PDF, DOCX, or TXT.");
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setError(`File is too large (${(f.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 7MB.`);
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fileToBase64 = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = (err) => reject(err);
    });

  const fileToText = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(f);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "upload" && !file) {
      setError("Please upload your CV file so we can extract your information automatically.");
      return;
    }
    if (mode === "manual" && (!fullName || !email)) {
      setError("Please fill in Full Name and Email.");
      return;
    }
    if (!jobDescription) {
      setError("Please paste the job description.");
      return;
    }

    setIsGenerating(true);
    setProgressStep(0);
    setError(null);

    try {
      let pdfFileBase64 = "";
      let docxFileBase64 = "";
      let extractedCvText = "";

      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext === "pdf") {
          pdfFileBase64 = await fileToBase64(file);
        } else if (ext === "docx") {
          docxFileBase64 = await fileToBase64(file);
        } else if (ext === "txt") {
          extractedCvText = await fileToText(file);
        }
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

      const nextRemaining = consumeRateLimit(remainingGenerations);
      setRemainingGenerations(nextRemaining);

      router.push("/result");
    } catch (err) {
      console.error(err);
      const rawMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
      const errMsg =
        rawMsg.includes("503") || rawMsg.includes("UNAVAILABLE") || rawMsg.includes("high demand")
          ? "Gemini is experiencing high demand right now. We'll retry automatically — if this persists, try again in a minute."
          : rawMsg;
      setError(errMsg);
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10 md:py-16">
      <AnimatePresence mode="wait">
        {!isGenerating ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2 font-sans">
                Generate your CV
              </h1>
              <p className="text-sm text-zinc-400">
                Tailor your developer experience and projects for the role in seconds.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Mode Selector Cards */}
              <div className="grid grid-cols-2 gap-3">
                {(["upload", "manual"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMode(m); setError(null); }}
                    className={`flex flex-col items-start gap-1.5 p-4 rounded-xl border transition-all cursor-pointer text-left ${
                      mode === m
                        ? "border-violet-500/60 bg-violet-500/[0.06]"
                        : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
                    }`}
                  >
                    <span className="text-lg">{m === "upload" ? "📄" : "✏️"}</span>
                    <span className={`text-sm font-semibold ${mode === m ? "text-white" : "text-zinc-300"}`}>
                      {m === "upload" ? "Upload my CV" : "Start from scratch"}
                    </span>
                    <span className="text-[11px] text-zinc-500 leading-snug">
                      {m === "upload"
                        ? "We extract your info automatically"
                        : "Fill your details manually"}
                    </span>
                  </button>
                ))}
              </div>

              {/* Upload mode: file drop zone */}
              {mode === "upload" && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                  />
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    className={`w-full py-10 px-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                      isDragActive
                        ? "border-zinc-500 bg-zinc-900/10"
                        : file
                        ? "border-emerald-500/40 bg-emerald-500/[0.02]"
                        : "border-zinc-800 bg-zinc-950/50 hover:border-violet-500/40 hover:bg-violet-500/[0.02]"
                    }`}
                  >
                    {file ? (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-zinc-100 max-w-[280px] truncate">{file.name}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-xs text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-500/30 bg-zinc-950 px-3 py-1 rounded-lg transition-colors mt-2 cursor-pointer"
                        >
                          Remove file
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-zinc-300">
                            <span className="text-violet-400 font-semibold">Click to upload</span> or drag &amp; drop
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">PDF, DOCX, or TXT · Max 7MB</p>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {/* Manual mode: name + email */}
              {mode === "manual" && (
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
              )}

              {/* GitHub URL — always optional */}
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

              {/* Job Description — always required */}
              <Textarea
                label="Job Description"
                placeholder="Paste the job offer details, requirements, and keywords here..."
                className="h-36"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />

              {/* Extra Context — always optional */}
              <Textarea
                label={
                  <span className="flex items-center justify-between w-full">
                    <span>Extra Context</span>
                    <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Optional
                    </span>
                  </span>
                }
                placeholder="Specific certifications, key achievements, or items you want the engine to prioritize..."
                className="h-24"
                value={extraContext}
                onChange={(e) => setExtraContext(e.target.value)}
              />

              {error && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400 flex items-start gap-2.5">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
                    <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isLimitReached}
                className="w-full flex items-center justify-center gap-2 mt-4 font-semibold"
              >
                {isLimitReached ? "Daily limit reached" : "Optimize my CV"}
              </Button>

              {isLimitReached ? (
                <div className="text-center p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
                  <p className="text-xs text-amber-400 font-medium">
                    You&apos;ve used your {DAILY_LIMIT} free generations for today. Resets tomorrow — or{" "}
                    <a
                      href="https://github.com/ivancidev/cvearly"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      self-host with your own API key
                    </a>
                    .
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
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-850/20 animate-ping" />
              <svg className="w-full h-full animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>

            <motion.h3
              key={progressStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-lg sm:text-xl font-bold text-white mb-3"
            >
              {loadingSteps[progressStep]}
            </motion.h3>

            <p className="text-sm text-zinc-500 max-w-sm">
              We extract keywords, analyze commits, and build your tailor-made document. This can take up to 20 seconds.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default CVForm;
