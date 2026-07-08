import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubRepos } from "@/lib/github";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username query parameter is required" },
        { status: 400 }
      );
    }

    const repos = await fetchGitHubRepos(username);
    return NextResponse.json({ repos });
  } catch (error) {
    console.error("API Error in /api/github:", error);
    const errMsg = error instanceof Error ? error.message : "Failed to fetch GitHub repositories";
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }
}
