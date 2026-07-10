"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { CVData } from "@/types";
import { generateCVPdf } from "@/lib/generate-cv-pdf";

interface DownloadButtonProps {
  cvData: CVData;
}

export function DownloadButton({ cvData }: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "success">("idle");

  const handleDownload = () => {
    if (status !== "idle") return;
    setStatus("generating");

    try {
      const blob = generateCVPdf(cvData);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeName = cvData.personal.fullName.replace(/[^a-zA-Z0-9]/g, "_");
      link.href = url;
      link.download = `${safeName}_CV_Optimized.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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
