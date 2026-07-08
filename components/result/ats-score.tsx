"use client";

import React, { useEffect, useState } from "react";
import { ATSResult } from "@/types";

interface ATSScoreProps {
  atsResult: ATSResult;
}

export function ATSScore({ atsResult }: ATSScoreProps) {
  const { score, matchedKeywords, missingKeywords, checklist, recommendations } = atsResult;
  const [animatedScore, setAnimatedScore] = useState(0);
  const [ringOn, setRingOn] = useState(false);

  useEffect(() => {
    let active = true;

    // Defer animation setups to bypass synchronous setState linter warning in React 19
    const resetTimer = setTimeout(() => {
      if (!active) return;
      setAnimatedScore(0);
      setRingOn(false);

      const ringTimer = setTimeout(() => {
        if (active) setRingOn(true);
      }, 50);

      let current = 0;
      const increment = Math.ceil(score / 35);
      const interval = setInterval(() => {
        if (!active) return;
        current += increment;
        if (current >= score) {
          current = score;
          clearInterval(interval);
        }
        setAnimatedScore(current);
      }, 25);

      return () => {
        clearTimeout(ringTimer);
        clearInterval(interval);
      };
    }, 0);

    return () => {
      active = false;
      clearTimeout(resetTimer);
    };
  }, [score]);

  // SVG parameters
  const strokeDashArray = 326.7; // 2 * PI * r (r=52)
  const ringOffset = ringOn ? strokeDashArray * (1 - score / 100) : strokeDashArray;

  // Determine score colors
  const getScoreColorClass = (val: number) => {
    if (val >= 85) return "text-emerald-400 stroke-emerald-500";
    if (val >= 70) return "text-cyan-400 stroke-cyan-500";
    return "text-amber-400 stroke-amber-500";
  };

  const scoreColor = getScoreColorClass(score);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Circle Gauge Card */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col items-center text-center">
        <div className="relative w-40 h-40 mb-4 flex items-center justify-center">
          <svg width="150" height="150" viewBox="0 0 120 120" className="transform -rotate-90">
            {/* Background Circle */}
            <circle cx="60" cy="60" r="52" fill="none" stroke="#18181b" strokeWidth="6" />
            {/* Active Progress Circle */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={strokeDashArray.toString()}
              strokeDashoffset={ringOffset}
              className={`transition-all duration-1000 cubic-bezier(0.2, 0.7, 0.2, 1) ${scoreColor.split(" ")[1]}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-extrabold tracking-tight font-mono ${scoreColor.split(" ")[0]}`}>
              {animatedScore}%
            </span>
          </div>
        </div>
        <h4 className="text-sm font-semibold text-zinc-100 mb-1">ATS Match Rating</h4>
        <p className="text-xs text-zinc-400">
          {score >= 85
            ? "Strong match &mdash; highly optimized for target keywords!"
            : score >= 70
            ? "Good match &mdash; cover letter or certifications could secure shortlist."
            : "Review suggestions &mdash; further edits recommended."}
        </p>
      </div>

      {/* Keywords analysis capsules */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 font-mono">
          Keywords Analysed
        </h4>
        
        {/* Matched list */}
        <div className="mb-4">
          <p className="text-xs font-medium text-emerald-400/80 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Matched ({matchedKeywords.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {matchedKeywords.slice(0, 15).map((kw, i) => (
              <span key={i} className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-medium">
                {kw}
              </span>
            ))}
            {matchedKeywords.length === 0 && (
              <span className="text-[10px] text-zinc-600 italic">No matched keywords</span>
            )}
          </div>
        </div>

        {/* Missing list */}
        <div>
          <p className="text-xs font-medium text-amber-400/80 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Recommended Additions ({missingKeywords.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.slice(0, 10).map((kw, i) => (
              <span key={i} className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md font-medium">
                {kw}
              </span>
            ))}
            {missingKeywords.length === 0 && (
              <span className="text-[10px] text-zinc-600 italic">None! Resume is fully keyworded.</span>
            )}
          </div>
        </div>
      </div>

      {/* Hygiene Checklist */}
      <div className="bg-[#111118] border border-zinc-900 rounded-2xl p-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4 font-mono">
          Hygiene Checklist
        </h4>
        <div className="flex flex-col gap-3">
          {checklist.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] ${
                  item.checked
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/15 text-red-400 border border-red-500/20"
                }`}
              >
                {item.checked ? (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                )}
              </span>
              <span className={`text-[12.5px] leading-tight ${item.checked ? "text-zinc-300" : "text-zinc-500"}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations & Tips */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-[#111118] border border-zinc-900 rounded-2xl p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 font-mono">
            Key Recommendations
          </h4>
          <ul className="list-disc pl-4 text-xs text-zinc-400 leading-relaxed flex flex-col gap-2">
            {recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default ATSScore;
