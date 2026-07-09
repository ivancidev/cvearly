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
