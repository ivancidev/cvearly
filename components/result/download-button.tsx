"use client";

import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "../ui/button";
import { CVData } from "@/types";

interface DownloadButtonProps {
  cvData: CVData;
  cvRef: React.RefObject<HTMLDivElement | null>;
}

export function DownloadButton({ cvData, cvRef }: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "success">("idle");

  const handleDownload = async () => {
    if (status !== "idle" || !cvRef.current) return;
    setStatus("generating");

    try {
      const el = cvRef.current;

      // Pre-compute RGB colors from the live DOM before html2canvas clones it.
      // html2canvas can't parse oklch/lab (Tailwind v4 default), so we collect
      // computed styles here (browser resolves them to rgb()) and re-apply in onclone.
      const allOriginal = [el, ...Array.from(el.querySelectorAll<HTMLElement>("*"))];
      const styleCache = allOriginal.map((node) => {
        const cs = window.getComputedStyle(node);
        return {
          color: cs.color,
          backgroundColor: cs.backgroundColor,
          borderTopColor: cs.borderTopColor,
          borderRightColor: cs.borderRightColor,
          borderBottomColor: cs.borderBottomColor,
          borderLeftColor: cs.borderLeftColor,
        };
      });

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (_doc, clonedEl) => {
          const allCloned = [clonedEl, ...Array.from(clonedEl.querySelectorAll<HTMLElement>("*"))];
          allCloned.forEach((node, i) => {
            const s = styleCache[i];
            if (!s) return;
            node.style.color = s.color;
            node.style.backgroundColor = s.backgroundColor;
            node.style.borderTopColor = s.borderTopColor;
            node.style.borderRightColor = s.borderRightColor;
            node.style.borderBottomColor = s.borderBottomColor;
            node.style.borderLeftColor = s.borderLeftColor;
          });
        },
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
