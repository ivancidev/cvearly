import { GoogleGenAI } from "@google/genai";
import { GenerationResponse } from "../types";
import { GitHubRepo } from "./github";

// Initialize Google Gen AI client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Interface for CV optimization input parameters
 */
interface OptimizeCVParams {
  fullName: string;
  email: string;
  githubUrl?: string;
  jobDescription: string;
  extraContext?: string;
  githubRepos?: GitHubRepo[];
  pdfFileBase64?: string; // Optional PDF file base64 content
  extractedCvText?: string; // Optional extracted text from docx/txt
}

const responseSchema = {
  type: "OBJECT",
  properties: {
    cv: {
      type: "OBJECT",
      properties: {
        personal: {
          type: "OBJECT",
          properties: {
            fullName: { type: "STRING" },
            title: { type: "STRING" },
            email: { type: "STRING" },
            phone: { type: "STRING" },
            location: { type: "STRING" },
            github: { type: "STRING" },
            linkedin: { type: "STRING" },
            website: { type: "STRING" }
          },
          required: ["fullName", "title", "email"]
        },
        summary: { type: "STRING" },
        experience: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              role: { type: "STRING" },
              company: { type: "STRING" },
              duration: { type: "STRING" },
              points: {
                type: "ARRAY",
                items: { type: "STRING" }
              }
            },
            required: ["role", "company", "duration", "points"]
          }
        },
        skills: {
          type: "ARRAY",
          items: { type: "STRING" }
        },
        projects: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              description: { type: "STRING" },
              stars: { type: "INTEGER" },
              url: { type: "STRING" }
            },
            required: ["name", "description"]
          }
        }
      },
      required: ["personal", "summary", "experience", "skills", "projects"]
    },
    ats: {
      type: "OBJECT",
      properties: {
        score: { type: "INTEGER" },
        matchedKeywords: {
          type: "ARRAY",
          items: { type: "STRING" }
        },
        missingKeywords: {
          type: "ARRAY",
          items: { type: "STRING" }
        },
        checklist: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              text: { type: "STRING" },
              checked: { type: "BOOLEAN" }
            },
            required: ["text", "checked"]
          }
        },
        recommendations: {
          type: "ARRAY",
          items: { type: "STRING" }
        }
      },
      required: ["score", "matchedKeywords", "missingKeywords", "checklist", "recommendations"]
    }
  },
  required: ["cv", "ats"]
};

/**
 * Optimizes a resume based on a job description and GitHub projects using Gemini.
 */
export async function optimizeCV(params: OptimizeCVParams): Promise<GenerationResponse> {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured. Please add it to your environment variables.");
  }

  const {
    fullName,
    email,
    githubUrl,
    jobDescription,
    extraContext,
    githubRepos,
    pdfFileBase64,
    extractedCvText
  } = params;

  // Build the textual prompt details
  let promptText = `
You are an expert technical recruiter and ATS (Applicant Tracking System) optimizer.
Your goal is to tailor the candidate's CV to match the following target job description as closely as possible.
Make sure to emphasize the skills, keywords, and qualifications listed in the job description while maintaining authenticity.

Candidate Name: ${fullName}
Candidate Email: ${email}
Target Job Description:
"""
${jobDescription}
"""
`;

  if (githubUrl) {
    promptText += `\nCandidate GitHub: ${githubUrl}`;
  }

  if (githubRepos && githubRepos.length > 0) {
    promptText += `\n\nCandidate's top GitHub Repositories (incorporate these into the Projects section to show real projects and language skills):`;
    githubRepos.forEach((repo) => {
      promptText += `\n- Name: ${repo.name}, Description: ${repo.description || "N/A"}, Language: ${repo.language || "N/A"}, Stars: ${repo.stars}, URL: ${repo.url}`;
    });
  }

  if (extraContext) {
    promptText += `\n\nAdditional Candidate Context:\n"""\n${extraContext}\n"""`;
  }

  if (extractedCvText) {
    promptText += `\n\nExisting CV Content (parsed from uploaded docx/txt):\n"""\n${extractedCvText}\n"""`;
  }

  promptText += `

INSTRUCTIONS:
1. PERSONAL: Fill in personal details. If an existing CV is uploaded, pull details from it. Ensure the personal.fullName and personal.email match the input values unless the uploaded CV has better/alternate information. Keep personal.github as the provided githubUrl. Generate a professional 'title' matching the target job (e.g. "Senior Backend Engineer").
2. SUMMARY: Write a highly professional, 2-3 sentence resume summary tailored to the job description, using strong action verbs and target keywords.
3. EXPERIENCE: Construct 1 to 3 relevant work experience items (make them up logically or extract from the uploaded CV, tailored to the job description). Each experience point MUST start with a strong past-tense action verb (e.g., "Architected", "Optimized", "Migrated", "Delivered") and contain quantified metrics (e.g., "reduced latency by 40%", "scaled throughput to 10M+ requests", "saved 32% cloud costs") to make them look recruiter-ready.
4. SKILLS: Extract 6 to 12 relevant tech keywords/skills required in the job description that match the candidate's profile.
5. PROJECTS: Incorporate the GitHub repos. Translate descriptions into clear, recruiter-ready descriptions emphasizing job-relevant keywords.
6. ATS EVALUATION: 
   - Calculate a realistic ATS score (0-100) based on how well the generated CV matches the Job Description. Be honest but aim for 75-95.
   - List the matchedKeywords (keywords found in both CV and Job Description) and missingKeywords (important job keywords not included in the CV, which will form the recommendations).
   - Create a checklist of 4-6 items checking resume hygiene (e.g., "Contains all required keywords", "Quantified achievements in every role", "Standard section headings", etc.) showing whether they are completed.
   - List 2-3 actionable recommendations to improve the resume (e.g. "Add a certifications section", "Shorten summary").
`;

  const contents: (string | { inlineData: { data: string; mimeType: string } })[] = [];
  
  // If we have a PDF file, pass it as a file part to Gemini
  if (pdfFileBase64) {
    contents.push({
      inlineData: {
        data: pdfFileBase64,
        mimeType: "application/pdf"
      }
    });
    promptText += `\n\nNote: Please read the uploaded PDF resume attached as a document part above and incorporate its experience, projects, and skills.`;
  }

  contents.push(promptText);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema as unknown as Record<string, unknown>,
        temperature: 0.2, // Low temperature for high accuracy
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini API");
    }

    const json = JSON.parse(text) as GenerationResponse;
    return json;
  } catch (error) {
    console.error("Error generating CV with Gemini:", error);
    throw error;
  }
}
