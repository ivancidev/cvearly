"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { CVData } from "@/types";
import { generateCVDocx } from "@/lib/generate-cv";

interface DownloadButtonProps {
  cvData: CVData;
}

export function DownloadButton({ cvData }: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "success">("idle");

  const handleDownload = async () => {
    if (status !== "idle") return;
    setStatus("generating");

    try {
      // Compile document
      const blob = await generateCVDocx(cvData);
      
      // Setup file download anchor
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      // Clean filename matching name
      const safeName = cvData.personal.fullName.replace(/[^a-zA-Z0-9]/g, "_");
      link.href = url;
      link.download = `${safeName}_CV_Optimized.docx`;
      
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setStatus("success");
      
      // Reset button state
      setTimeout(() => {
        setStatus("idle");
      }, 2500);
    } catch (err) {
      console.error("Failed to generate and download docx", err);
      setStatus("idle");
    }
  };

  const getLabel = () => {
    if (status === "generating") return "Generating Docx...";
    if (status === "success") return "Downloaded ✓";
    return "Download .docx";
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
