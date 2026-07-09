import jsPDF from "jspdf";
import { CVData } from "../types";

const M = 20; // margin mm
const W = 210; // A4 width mm
const H = 297; // A4 height mm
const CW = W - 2 * M; // content width

const VIOLET: [number, number, number] = [124, 58, 237];
const DARK: [number, number, number] = [15, 23, 42];
const SLATE: [number, number, number] = [71, 85, 105];
const MUTED: [number, number, number] = [100, 116, 139];
const CYAN: [number, number, number] = [6, 182, 212];

export function generateCVPdf(cv: CVData): Blob {
  const { personal, summary, experience, skills, projects } = cv;
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let y = M;

  const pageBreak = (needed: number) => {
    if (y + needed > H - M) { pdf.addPage(); y = M; }
  };

  const section = (title: string) => {
    pageBreak(12);
    y += 5;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.setTextColor(...VIOLET);
    pdf.text(title.toUpperCase(), M, y);
    y += 2.5;
    pdf.setDrawColor(...VIOLET);
    pdf.setLineWidth(0.35);
    pdf.line(M, y, W - M, y);
    y += 5;
    pdf.setTextColor(...DARK);
  };

  // ── Header ──────────────────────────────────────────
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.setTextColor(...DARK);
  pdf.text(personal.fullName, W / 2, y, { align: "center" });
  y += 7;

  if (personal.title) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(...SLATE);
    pdf.text(personal.title, W / 2, y, { align: "center" });
    y += 5.5;
  }

  const contact: string[] = [];
  if (personal.email) contact.push(personal.email);
  if (personal.phone) contact.push(personal.phone);
  if (personal.location) contact.push(personal.location);
  if (personal.github) contact.push(personal.github.replace(/^(https?:\/\/)?(www\.)?/, ""));
  if (personal.linkedin) contact.push(personal.linkedin.replace(/^(https?:\/\/)?(www\.)?/, ""));

  if (contact.length) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(...MUTED);
    pdf.text(contact.join("  |  "), W / 2, y, { align: "center" });
    y += 5;
  }

  pdf.setDrawColor(...DARK);
  pdf.setLineWidth(0.5);
  pdf.line(M, y, W - M, y);
  y += 6;

  // ── Summary ─────────────────────────────────────────
  section("Professional Summary");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9.5);
  pdf.setTextColor(...DARK);
  const summaryLines = pdf.splitTextToSize(summary, CW);
  pageBreak(summaryLines.length * 5);
  pdf.text(summaryLines, M, y);
  y += summaryLines.length * 5 + 1;

  // ── Experience ───────────────────────────────────────
  if (experience?.length) {
    section("Work Experience");
    for (const exp of experience) {
      pageBreak(18);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9.5);
      pdf.setTextColor(...DARK);
      pdf.text(`${exp.company} — ${exp.role}`, M, y);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(...SLATE);
      pdf.text(exp.duration, W - M, y, { align: "right" });
      y += 5;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(...DARK);
      for (const point of exp.points) {
        const lines = pdf.splitTextToSize(`• ${point}`, CW - 2);
        pageBreak(lines.length * 4.5 + 1);
        pdf.text(lines, M + 1, y);
        y += lines.length * 4.5 + 0.5;
      }
      y += 2.5;
    }
  }

  // ── Projects ─────────────────────────────────────────
  if (projects?.length) {
    section("Projects");
    for (const proj of projects) {
      pageBreak(13);
      const projLabel = proj.stars && proj.stars > 0 ? `${proj.name} (★ ${proj.stars})` : proj.name;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9.5);
      pdf.setTextColor(...DARK);
      pdf.text(projLabel, M, y);

      if (proj.url) {
        const cleanUrl = proj.url.replace(/^(https?:\/\/)?(www\.)?/, "");
        const labelW = pdf.getTextWidth(projLabel);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(...CYAN);
        pdf.text(` — ${cleanUrl}`, M + labelW, y);
      }
      y += 4.5;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(...DARK);
      const descLines = pdf.splitTextToSize(proj.description, CW);
      pageBreak(descLines.length * 4.5 + 1);
      pdf.text(descLines, M, y);
      y += descLines.length * 4.5 + 3;
    }
  }

  // ── Skills ───────────────────────────────────────────
  if (skills?.length) {
    section("Key Skills");
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9.5);
    pdf.setTextColor(...DARK);
    const skillLines = pdf.splitTextToSize(skills.join(" • "), CW);
    pageBreak(skillLines.length * 5);
    pdf.text(skillLines, M, y);
  }

  return pdf.output("blob");
}
