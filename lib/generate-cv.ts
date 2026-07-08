import { Document, Paragraph, TextRun, Packer, AlignmentType, BorderStyle } from "docx";
import { CVData } from "../types";

/**
 * Generates a professional ATS-friendly DOCX file from CV data.
 * Returns a Promise that resolves to a Blob.
 */
export async function generateCVDocx(cv: CVData): Promise<Blob> {
  const { personal, summary, experience, skills, projects } = cv;

  // Contact details line: "email | phone | location | github"
  const contactParts: string[] = [];
  if (personal.email) contactParts.push(personal.email);
  if (personal.phone) contactParts.push(personal.phone);
  if (personal.location) contactParts.push(personal.location);
  if (personal.github) {
    const cleanGithub = personal.github.replace(/^(https?:\/\/)?(www\.)?/, "");
    contactParts.push(cleanGithub);
  }
  if (personal.linkedin) {
    const cleanLinkedin = personal.linkedin.replace(/^(https?:\/\/)?(www\.)?/, "");
    contactParts.push(cleanLinkedin);
  }
  const contactText = contactParts.join("  |  ");

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: [
          // Name (Big, Bold, Centered)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: personal.fullName,
                bold: true,
                size: 32, // 16pt
                font: "Arial",
              }),
            ],
          }),

          // Professional Title (Centered)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: personal.title,
                bold: true,
                color: "475569", // Slate grey
                size: 24, // 12pt
                font: "Arial",
              }),
            ],
          }),

          // Contact Details
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: contactText,
                size: 19, // 9.5pt
                color: "64748B",
                font: "Arial",
              }),
            ],
          }),

          // Thin divider line under header
          new Paragraph({
            border: {
              bottom: {
                color: "0F172A",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 12, // 1.5 pt
              },
            },
            spacing: { after: 240 },
          }),

          // ----------------------------------------------------
          // PROFESSIONAL SUMMARY SECTION
          // ----------------------------------------------------
          createSectionHeader("PROFESSIONAL SUMMARY"),
          new Paragraph({
            spacing: { after: 240, line: 360 }, // 1.5 line spacing
            children: [
              new TextRun({
                text: summary,
                size: 21, // 10.5pt
                font: "Arial",
              }),
            ],
          }),

          // ----------------------------------------------------
          // WORK EXPERIENCE SECTION
          // ----------------------------------------------------
          createSectionHeader("WORK EXPERIENCE"),
          ...experience.flatMap((exp) => [
            // Company and Duration
            new Paragraph({
              spacing: { before: 120, after: 60 },
              children: [
                new TextRun({
                  text: exp.company,
                  bold: true,
                  size: 21, // 10.5pt
                  font: "Arial",
                }),
                new TextRun({
                  text: ` \u2014 ${exp.role}`,
                  bold: true,
                  color: "475569",
                  size: 21,
                  font: "Arial",
                }),
                new TextRun({
                  text: `\t${exp.duration}`,
                  bold: true,
                  size: 21,
                  font: "Arial",
                }),
              ],
              tabStops: [
                {
                  type: "right",
                  position: 9000, // Aligns date to the right margin
                },
              ],
            }),
            // Experience Bullet Points
            ...exp.points.map((point) => 
              new Paragraph({
                bullet: {
                  level: 0,
                },
                spacing: { after: 60, line: 300 },
                children: [
                  new TextRun({
                    text: point,
                    size: 20, // 10pt
                    font: "Arial",
                  }),
                ],
              })
            ),
            // Extra spacing after each job
            new Paragraph({ spacing: { after: 120 } }),
          ]),

          // ----------------------------------------------------
          // PROJECTS SECTION
          // ----------------------------------------------------
          createSectionHeader("PROJECTS"),
          ...projects.flatMap((proj) => [
            new Paragraph({
              spacing: { before: 120, after: 40 },
              children: [
                new TextRun({
                  text: proj.name,
                  bold: true,
                  size: 21, // 10.5pt
                  font: "Arial",
                }),
                proj.stars !== undefined && proj.stars > 0
                  ? new TextRun({
                      text: ` (${proj.stars} \u2605)`,
                      color: "D97706", // Amber stars
                      bold: true,
                      size: 19,
                      font: "Arial",
                    })
                  : new TextRun({ text: "" }),
                proj.url
                  ? new TextRun({
                      text: ` \u2014 ${proj.url.replace(/^(https?:\/\/)?(www\.)?/, "")}`,
                      color: "06B6D4", // Cyan url text
                      size: 19,
                      font: "Arial",
                    })
                  : new TextRun({ text: "" }),
              ],
            }),
            new Paragraph({
              spacing: { after: 120, line: 300 },
              children: [
                new TextRun({
                  text: proj.description,
                  size: 20, // 10pt
                  font: "Arial",
                }),
              ],
            }),
          ]),

          // ----------------------------------------------------
          // KEY SKILLS SECTION
          // ----------------------------------------------------
          createSectionHeader("KEY SKILLS"),
          new Paragraph({
            spacing: { before: 120, after: 240, line: 360 },
            children: [
              new TextRun({
                text: skills.join(", "),
                size: 21, // 10.5pt
                font: "Arial",
              }),
            ],
          }),
        ],
      },
    ],
  });

  // Pack document to blob
  return await Packer.toBlob(doc);
}

/**
 * Creates a section header paragraph with styling and an underline
 */
function createSectionHeader(title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    border: {
      bottom: {
        color: "7C3AED", // Violet accent line
        space: 2,
        style: BorderStyle.SINGLE,
        size: 6, // 0.75 pt
      },
    },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 22, // 11pt
        color: "7C3AED", // Violet theme color
        font: "Arial",
      }),
    ],
  });
}
