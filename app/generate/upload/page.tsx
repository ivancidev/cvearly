"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { getRateLimitState, consumeRateLimit } from "@/lib/rate-limit";
import { useTranslation } from "@/lib/i18n";

const DAILY_LIMIT = 3;

const loadingStepsKeys = [
  "uploadPage.loader.step1",
  "uploadPage.loader.step2",
  "uploadPage.loader.step3",
  "uploadPage.loader.step4",
  "uploadPage.loader.step5",
  "uploadPage.loader.step6",
];

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, language } = useTranslation();

  const [file, setFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [extraContext, setExtraContext] = useState("");
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
      setProgressStep((prev) => (prev < loadingStepsKeys.length - 1 ? prev + 1 : prev));
    }, 3500);
    return () => clearInterval(interval);
  }, [isGenerating]);


  const MAX_FILE_BYTES = 7 * 1024 * 1024;

  const validateAndSetFile = (f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "txt"].includes(ext ?? "")) {
      setError(t("uploadPage.errors.unsupported"));
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setError(t("uploadPage.errors.tooLarge").replace("{size}", (f.size / 1024 / 1024).toFixed(1)));
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
    if (!file) { setError(t("uploadPage.errors.fileRequired")); return; }
    if (!jobDescription) { setError(t("uploadPage.errors.jdRequired")); return; }

    setIsGenerating(true);
    setProgressStep(0);
    setError(null);

    try {
      let pdfFileBase64 = "";
      let docxFileBase64 = "";
      let extractedCvText = "";
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf") pdfFileBase64 = await fileToBase64(file);
      else if (ext === "docx") docxFileBase64 = await fileToBase64(file);
      else if (ext === "txt") extractedCvText = await fileToText(file);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "",
          email: "",
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
        throw new Error(errData.error || t("uploadPage.errors.unexpected"));
      }

      const data = await response.json();
      sessionStorage.setItem("cv_result", JSON.stringify(data));
      setRemainingGenerations(consumeRateLimit(remainingGenerations));
      router.push("/result");
    } catch (err) {
      const rawMsg = err instanceof Error ? err.message : String(t("uploadPage.errors.unexpected"));
      setError(
        rawMsg.includes("503") || rawMsg.includes("UNAVAILABLE")
          ? t("uploadPage.errors.geminiLimit")
          : rawMsg
      );
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0F] text-zinc-100 flex flex-col selection:bg-violet-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_50%_-100px,rgba(124,58,237,0.10),transparent_70%)] pointer-events-none z-0" />
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
                {t("uploadPage.back")}
              </Link>

              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full mb-4">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  {t("uploadPage.tag")}
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                  {t("uploadPage.title")}
                </h1>
                <p className="text-sm text-zinc-400">
                  {t("uploadPage.desc")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Drop Zone */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                />
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full min-h-[180px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 ${
                    isDragActive
                      ? "border-violet-500/60 bg-violet-500/[0.06]"
                      : file
                      ? "border-emerald-500/40 bg-emerald-500/[0.03]"
                      : "border-zinc-800 bg-zinc-950/50 hover:border-violet-500/40 hover:bg-violet-500/[0.03]"
                  }`}
                >
                  {file ? (
                    <>
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <path d="M9 15l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-zinc-100 max-w-[260px] truncate">{file.name}</p>
                        <p className="text-xs text-zinc-500 mt-1">{(file.size / 1024).toFixed(0)} KB · {t("uploadPage.dropzone.ready")}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="text-xs text-zinc-600 hover:text-red-400 border border-zinc-800 hover:border-red-500/30 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        {t("uploadPage.dropzone.remove")}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-zinc-300">
                          <span className="text-violet-400 font-semibold">{t("uploadPage.dropzone.click")}</span> or drag &amp; drop
                        </p>
                        <p className="text-xs text-zinc-600 mt-1">{t("uploadPage.dropzone.formats")}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* GitHub — optional */}
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center justify-between text-sm font-medium text-zinc-300">
                    {t("uploadPage.github.label")}
                    <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {t("uploadPage.github.optional")}
                    </span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-colors"
                  />
                </div>

                {/* Job Description — required */}
                <Textarea
                  label={t("uploadPage.jobDescription.label")}
                  placeholder={t("uploadPage.jobDescription.placeholder")}
                  className="h-36"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                />

                {/* Extra Context — optional */}
                <Textarea
                  label={
                    <span className="flex items-center justify-between w-full">
                      <span>{t("uploadPage.extraContext.label")}</span>
                      <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {t("uploadPage.extraContext.optional")}
                      </span>
                    </span>
                  }
                  placeholder={t("uploadPage.extraContext.placeholder")}
                  className="h-24"
                  value={extraContext}
                  onChange={(e) => setExtraContext(e.target.value)}
                />

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
                  {isLimitReached ? t("uploadPage.submit.limitReached") : t("uploadPage.submit.optimize")}
                </Button>

                {isLimitReached ? (
                  <div className="text-center p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
                    <p className="text-xs text-amber-400">
                      {t("uploadPage.rateLimit.used")
                        .split("{selfHost}")
                        .map((part: string, idx: number) => (
                          <React.Fragment key={idx}>
                            {idx > 0 && (
                              <a
                                href="https://github.com/ivancidev/cvearly"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-amber-300 cursor-pointer"
                              >
                                {language === "es"
                                  ? "hospedarlo tú mismo con tu clave de API"
                                  : "self-host with your API key"}
                              </a>
                            )}
                            {part}
                          </React.Fragment>
                        ))}
                    </p>
                  </div>
                ) : (
                  <p className="text-center text-xs text-zinc-500">
                    {language === "es" ? (
                      <>
                        <span className={`font-semibold ${remainingGenerations === 1 ? "text-amber-400" : "text-zinc-400"}`}>
                          {remainingGenerations}
                        </span>{" "}
                        de {DAILY_LIMIT} generaciones gratuitas restantes hoy
                      </>
                    ) : (
                      <>
                        <span className={`font-semibold ${remainingGenerations === 1 ? "text-amber-400" : "text-zinc-400"}`}>
                          {remainingGenerations}
                        </span>{" "}
                        of {DAILY_LIMIT} free generations remaining today
                      </>
                    )}
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
                <div className="absolute inset-0 rounded-full border-4 border-violet-500/10 animate-ping" />
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
                {t(loadingStepsKeys[progressStep])}
              </motion.h3>
              <p className="text-sm text-zinc-500 max-w-xs">
                {t("uploadPage.loader.sub")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

