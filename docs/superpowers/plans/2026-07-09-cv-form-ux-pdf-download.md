# CV Form UX Split + PDF-Only Download — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the generate form into Upload/Manual modes and replace DOCX download with direct PDF download.

**Architecture:** Mode state in CVForm drives conditional field rendering. PDF is generated client-side by capturing the CVPreview DOM node via html2canvas and embedding it in a jsPDF A4 document. CVPreview gains a forwardRef so the result page can pass the same ref to DownloadButton.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, html2canvas, jspdf, TypeScript strict

## Global Constraints

- No `any` types — use proper TypeScript types or `unknown`
- Every `<button>`, `<a>`, clickable `<div>` must include `cursor-pointer`
- After every task: run `npm run lint` and `npm run build` — both must pass clean
- React 19: no synchronous `setState` inside `useEffect` on mount — defer with `setTimeout`

---

### Task 1: Install PDF libraries

**Files:**
- Modify: `package.json` (via npm install)

**Interfaces:**
- Produces: `html2canvas` and `jspdf` available as imports in subsequent tasks

- [ ] **Step 1: Install dependencies**

```bash
npm install html2canvas jspdf
```

Expected output: packages added to `node_modules`, `package.json` updated with `"html2canvas"` and `"jspdf"` entries under `dependencies`.

- [ ] **Step 2: Verify types are available**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors about missing types (both packages ship their own declarations).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install html2canvas and jspdf for PDF export"
```

---

### Task 2: Add forwardRef to CVPreview and wire ref in result page

**Files:**
- Modify: `components/result/cv-preview.tsx`
- Modify: `app/result/page.tsx`

**Interfaces:**
- Consumes: nothing new
- Produces:
  - `CVPreview` accepts `ref: React.Ref<HTMLDivElement>` via `forwardRef`
  - `cvRef: React.RefObject<HTMLDivElement>` created in `ResultPage`, passed to `CVPreview` as `ref` and to `DownloadButton` as `cvRef` prop (Task 3 consumes this)

- [ ] **Step 1: Rewrite CVPreview with forwardRef**

Replace the entire content of `components/result/cv-preview.tsx` with:

```tsx
import React from "react";
import { CVData } from "@/types";

interface CVPreviewProps {
  cvData: CVData;
}

export const CVPreview = React.forwardRef<HTMLDivElement, CVPreviewProps>(
  ({ cvData }, ref) => {
    const { personal, summary, experience, skills, projects } = cvData;

    return (
      <div
        ref={ref}
        className="w-full bg-white text-zinc-900 rounded-2xl shadow-2xl p-8 sm:p-12 md:p-14 border border-zinc-200 aspect-[1/1.414] overflow-auto select-text font-sans cve-scroll"
      >
        {/* Header section */}
        <div className="border-b-2 border-zinc-900 pb-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 mb-1">
            {personal.fullName}
          </h2>
          <div className="text-sm font-semibold text-zinc-700 tracking-wide">
            {personal.title}
          </div>

          {/* Contact list */}
          <div className="text-xs text-zinc-500 mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && (
              <>
                <span className="text-zinc-300">&bull;</span>
                <span>{personal.phone}</span>
              </>
            )}
            {personal.location && (
              <>
                <span className="text-zinc-300">&bull;</span>
                <span>{personal.location}</span>
              </>
            )}
            {personal.github && (
              <>
                <span className="text-zinc-300">&bull;</span>
                <a
                  href={personal.github.startsWith("http") ? personal.github : `https://${personal.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-violet-600"
                >
                  {personal.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, "github.com/")}
                </a>
              </>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-2 font-mono">
            Professional Summary
          </h3>
          <p className="text-xs sm:text-[13px] text-zinc-700 leading-relaxed text-pretty">
            {summary}
          </p>
        </div>

        {/* Work Experience */}
        {experience && experience.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-3 font-mono">
              Work Experience
            </h3>
            <div className="flex flex-col gap-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="text-xs sm:text-[13px]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline font-semibold text-zinc-950 mb-1">
                    <div>
                      <span>{exp.company}</span>
                      <span className="text-zinc-400 font-medium font-mono text-[11px] sm:text-xs">
                        {" "}&bull;{" "}{exp.role}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-zinc-500 font-mono mt-0.5 sm:mt-0">
                      {exp.duration}
                    </span>
                  </div>
                  <ul className="list-disc pl-4 text-zinc-600 leading-relaxed flex flex-col gap-1 mt-1 text-[11px] sm:text-xs">
                    {exp.points.map((pt, pIdx) => (
                      <li key={pIdx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-3 font-mono">
              Key Projects
            </h3>
            <div className="flex flex-col gap-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="text-xs sm:text-[13px]">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-900 mb-1">
                    <span>{proj.name}</span>
                    {proj.stars !== undefined && proj.stars > 0 && (
                      <span className="inline-flex items-center text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
                        ★ {proj.stars}
                      </span>
                    )}
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] sm:text-xs text-cyan-600 font-normal hover:underline ml-2"
                      >
                        {proj.url.replace(/^(https?:\/\/)?(www\.)?/, "")}
                      </a>
                    )}
                  </div>
                  <p className="text-zinc-600 leading-relaxed text-[11px] sm:text-xs">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-2.5 font-mono">
              Core Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-zinc-100 border border-zinc-200 text-zinc-700 px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
CVPreview.displayName = "CVPreview";

export default CVPreview;
```

- [ ] **Step 2: Update result/page.tsx to create and pass the ref**

Replace the entire content of `app/result/page.tsx` with:

```tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { CVPreview } from "@/components/result/cv-preview";
import { ATSScore } from "@/components/result/ats-score";
import { DownloadButton } from "@/components/result/download-button";
import { Button } from "@/components/ui/button";
import { GenerationResponse } from "@/types";

export default function ResultPage() {
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const cvRef = useRef<HTMLDivElement>(null);

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
            <h2 className="text-xl font-bold text-white mb-2">No CV Found</h2>
            <p className="text-sm text-zinc-400 mb-6">
              {"It seems you haven't generated a tailored CV yet, or your session has expired."}
            </p>
            <Link href="/generate" className="w-full">
              <Button className="w-full font-semibold">Start CV Optimization</Button>
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
              Your CV is ready
            </div>
            <div className="text-xs sm:text-sm text-emerald-400/80 mt-0.5">
              Optimized for the target role &bull; {result.ats.matchedKeywords.length} keywords matched
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
            <CVPreview cvData={result.cv} ref={cvRef} />
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
              <DownloadButton cvData={result.cv} cvRef={cvRef} />

              <Link href="/generate">
                <button className="w-full bg-transparent hover:bg-white/[0.02] border border-zinc-800 hover:border-violet-500/50 text-zinc-300 hover:text-white py-3.5 px-5 rounded-xl font-semibold text-sm transition-all outline-none cursor-pointer">
                  Generate again
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
```

- [ ] **Step 3: Run lint + build**

```bash
npm run lint && npm run build
```

Expected: no errors. If TypeScript complains about the `ref` prop on `CVPreview`, ensure the `forwardRef` generic matches `<HTMLDivElement, CVPreviewProps>`.

- [ ] **Step 4: Commit**

```bash
git add components/result/cv-preview.tsx app/result/page.tsx
git commit -m "refactor: add forwardRef to CVPreview, wire cvRef in ResultPage"
```

---

### Task 3: Replace DownloadButton with PDF generation

**Files:**
- Modify: `components/result/download-button.tsx`

**Interfaces:**
- Consumes:
  - `cvData: CVData` — for the safe filename (`cvData.personal.fullName`)
  - `cvRef: React.RefObject<HTMLDivElement>` — the ref from Task 2
- Produces: nothing (leaf component)

- [ ] **Step 1: Rewrite download-button.tsx**

Replace the entire content of `components/result/download-button.tsx` with:

```tsx
"use client";

import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "../ui/button";
import { CVData } from "@/types";

interface DownloadButtonProps {
  cvData: CVData;
  cvRef: React.RefObject<HTMLDivElement>;
}

export function DownloadButton({ cvData, cvRef }: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "success">("idle");

  const handleDownload = async () => {
    if (status !== "idle" || !cvRef.current) return;
    setStatus("generating");

    try {
      const canvas = await html2canvas(cvRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

      const safeName = cvData.personal.fullName.replace(/[^a-zA-Z0-9]/g, "_");
      pdf.save(`${safeName}_CV_Optimized.pdf`);

      setStatus("success");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      console.error("Failed to generate PDF", err);
      setStatus("idle");
    }
  };

  const getLabel = () => {
    if (status === "generating") return "Generating PDF...";
    if (status === "success") return "Downloaded ✓";
    return "Download PDF";
  };

  return (
    <Button
      onClick={handleDownload}
      isLoading={status === "generating"}
      variant={status === "success" ? "secondary" : "primary"}
      className="w-full flex items-center justify-center gap-2.5 font-semibold py-4"
    >
      {status === "idle" && (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )}
      {getLabel()}
    </Button>
  );
}
export default DownloadButton;
```

- [ ] **Step 2: Run lint + build**

```bash
npm run lint && npm run build
```

Expected: clean. If jsPDF import errors, try `import { jsPDF } from "jspdf"` (named export variant).

- [ ] **Step 3: Commit**

```bash
git add components/result/download-button.tsx
git commit -m "feat: replace docx download with pdf via html2canvas + jspdf"
```

---

### Task 4: Redesign CVForm with mode cards

**Files:**
- Modify: `components/generate/cv-form.tsx`

**Interfaces:**
- Consumes: nothing new (same API route, same state shapes)
- Produces: nothing (self-contained form component)

- [ ] **Step 1: Rewrite cv-form.tsx**

Replace the entire content of `components/generate/cv-form.tsx` with:

```tsx
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

              {/* GitHub URL — always optional, always shown */}
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
                    You&apos;ve used your {DAILY_LIMIT} free generations for today. Resets tomorrow —  or{" "}
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
```

- [ ] **Step 2: Run lint + build**

```bash
npm run lint && npm run build
```

Expected: clean pass. Common issue: if `Input` or `Textarea` label prop doesn't accept `React.ReactNode`, adjust to match the existing component types (they already accept `ReactNode` in the current codebase).

- [ ] **Step 3: Commit**

```bash
git add components/generate/cv-form.tsx
git commit -m "feat: split CV form into upload/manual modes with mode selector cards"
```

---

## Self-Review

**Spec coverage:**
- ✅ Mode state `"upload" | "manual"` with default `"upload"`
- ✅ Two mode cards with violet highlight on selected
- ✅ Upload mode: file required, name/email hidden
- ✅ Manual mode: name/email required, file hidden
- ✅ GitHub always shown as optional
- ✅ Job Description always required in both modes
- ✅ Validation per mode in `handleSubmit`
- ✅ `forwardRef` on CVPreview
- ✅ `cvRef` created in ResultPage, passed to CVPreview and DownloadButton
- ✅ PDF via html2canvas + jspdf, direct download
- ✅ Button labels: "Download PDF" / "Generating PDF..." / "Downloaded ✓"
- ✅ `npm run lint && npm run build` gate after each task
- ✅ All clickable elements have `cursor-pointer`
- ✅ No `any` types used

**Placeholder scan:** None found.

**Type consistency:** `cvRef: React.RefObject<HTMLDivElement>` used consistently in Task 2 (ResultPage produces it) and Task 3 (DownloadButton consumes it).
