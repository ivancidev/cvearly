# Design: CV Form UX Split + PDF-Only Download

**Date:** 2026-07-09  
**Branch:** feat/github-star-rate-limit  
**Status:** Approved

---

## Problem

1. The generate form mixes all fields in a single layout with no clear path for users who just want to upload their existing CV vs. users starting from scratch. Upload is buried in the middle and labeled "Optional", creating confusion.
2. The download button outputs `.docx`. Users expect and need PDF — a universally openable, print-ready format. DOCX requires Word/Docs to open.

---

## Solution Overview

### 1 — Form Mode Selector (Option B: Mode Cards)

Add a `mode: "upload" | "manual"` state to `CVForm`. Default: `"upload"` (most common path).

Two visual cards at the top of the form act as the mode selector. The selected card gets a highlighted border. Switching modes re-renders the relevant fields below without unmounting the form.

**Upload mode fields:**
- File upload zone — **prominent, required for this mode** (PDF, DOCX, TXT, max 7MB)
- GitHub URL — optional
- Job Description — required
- Extra Context — optional
- Full Name + Email — hidden (auto-extracted from CV by Gemini)

**Manual mode fields:**
- Full Name + Email — required
- GitHub URL — optional
- Job Description — required
- Extra Context — optional
- File upload — not shown (manual mode implies no existing CV)

**Validation per mode:**
- Upload mode: error if no file selected on submit
- Manual mode: error if fullName or email missing on submit
- Both modes: error if jobDescription is empty

**Component:** `components/generate/cv-form.tsx` — add `mode` state and conditional rendering. No new files.

---

### 2 — PDF-Only Download

Replace the `.docx` download with a direct PDF download. The PDF is generated client-side by capturing the existing `CVPreview` HTML as a high-resolution canvas image and embedding it in an A4 PDF.

**Libraries to install:**
- `html2canvas` — captures DOM node as canvas
- `jspdf` — creates PDF from canvas image

**Flow:**
1. `app/result/page.tsx` creates a `useRef<HTMLDivElement>(null)` and passes it to both `CVPreview` and `DownloadButton`
2. `CVPreview` wraps its root div with `forwardRef` to expose the ref
3. `DownloadButton` on click:
   - Calls `html2canvas(ref.current, { scale: 2, useCORS: true })`
   - Creates `new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })`
   - Scales canvas to A4 width (210mm), calculates height proportionally
   - Adds image via `pdf.addImage(...)` 
   - Calls `pdf.save(`${safeName}_CV_Optimized.pdf`)`
4. Button states: `idle` → `"Download PDF"` / `generating` → `"Generating PDF..."` / `success` → `"Downloaded ✓"`

**Files changed:**
- `components/result/download-button.tsx` — replace docx logic with html2canvas + jspdf
- `components/result/cv-preview.tsx` — add `forwardRef`
- `app/result/page.tsx` — add ref, pass to both components
- `lib/generate-cv.ts` — kept (not deleted, docx package still installed), but unused by the download button

---

## Files Affected

| File | Change |
|------|--------|
| `components/generate/cv-form.tsx` | Add mode state + mode cards + conditional fields |
| `components/result/cv-preview.tsx` | Add `forwardRef` |
| `components/result/download-button.tsx` | Replace docx with html2canvas + jspdf |
| `app/result/page.tsx` | Add ref, pass to CVPreview + DownloadButton |
| `package.json` | Add `html2canvas`, `jspdf` |

---

## Out of Scope

- Removing the `docx` package or `lib/generate-cv.ts` — left as-is to avoid breaking anything
- Server-side PDF generation
- Multiple download format options
- Any change to the result page layout or ATS score widget
