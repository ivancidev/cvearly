import { NextRequest, NextResponse } from "next/server";
import { optimizeCV } from "@/lib/gemini";
import { fetchGitHubRepos, GitHubRepo } from "@/lib/github";
import mammoth from "mammoth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      githubUrl,
      jobDescription,
      extraContext,
      pdfFileBase64,
      docxFileBase64,
      extractedCvText: clientExtractedText,
    } = body;

    // Validate required fields
    // name + email are optional when a CV file is uploaded — Gemini extracts them
    const hasFile = !!pdfFileBase64 || !!docxFileBase64 || !!clientExtractedText;
    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }
    if (!hasFile && (!fullName || !email)) {
      return NextResponse.json(
        { error: "Full name and email are required when no CV file is uploaded" },
        { status: 400 }
      );
    }

    // 1. Fetch GitHub repositories if githubUrl is provided
    let githubRepos: GitHubRepo[] = [];
    if (githubUrl) {
      try {
        githubRepos = await fetchGitHubRepos(githubUrl);
      } catch (err) {
        console.error("Error fetching GitHub repos during generation:", err);
        // Continue even if GitHub fetching fails
      }
    }

    // 2. Extract text from DOCX if provided
    let extractedCvText = clientExtractedText || "";
    if (docxFileBase64 && !extractedCvText) {
      try {
        const buffer = Buffer.from(docxFileBase64, "base64");
        const result = await mammoth.extractRawText({ buffer });
        extractedCvText = result.value;
      } catch (err) {
        console.error("Error extracting text from DOCX on server:", err);
        // Continue without text extraction
      }
    }

    // 3. Optimize CV using Gemini API
    const response = await optimizeCV({
      fullName,
      email,
      githubUrl,
      jobDescription,
      extraContext,
      githubRepos,
      pdfFileBase64,
      extractedCvText,
    });

    return NextResponse.json(response);
  } catch (error) {
    // Log full error details server-side for debugging
    if (error instanceof Error) {
      console.error("API Error in /api/generate:", error.message);
      if (error.stack) console.error(error.stack);
    } else {
      console.error("API Error in /api/generate:", error);
    }

    const rawMsg = error instanceof Error ? error.message : "Failed to generate optimized CV";

    // Map known errors to user-friendly messages
    let errMsg = rawMsg;
    if (rawMsg.includes("ECONNREFUSED") || rawMsg.includes("ENOTFOUND")) {
      errMsg = "Could not reach the Gemini API. Check your GEMINI_API_KEY in .env and that the key starts with 'AIzaSy'.";
    } else if (rawMsg.includes("fetch failed") || rawMsg.includes("ECONNRESET") || rawMsg.includes("ETIMEDOUT")) {
      errMsg = "Network error reaching Gemini — please try again in a moment.";
    } else if (rawMsg.includes("API_KEY") || rawMsg.includes("API key") || rawMsg.includes("401") || rawMsg.includes("403")) {
      errMsg = "Invalid Gemini API key. Get a valid key from https://aistudio.google.com/";
    } else if (rawMsg.includes("503") || rawMsg.includes("UNAVAILABLE")) {
      errMsg = "Gemini is experiencing high demand. Please try again in a moment.";
    } else if (rawMsg.includes("payload") || rawMsg.includes("body") || rawMsg.includes("size")) {
      errMsg = "The uploaded file is too large. Please try with a smaller PDF (under 8MB).";
    }

    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
export const maxDuration = 60;

