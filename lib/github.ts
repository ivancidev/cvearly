export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
}

interface RawGitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  fork: boolean;
}

/**
 * Fetches the public repositories for a given GitHub username.
 * Automatically filters out forks and sorts by stars (descending), limit to top 10.
 */
export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  if (!username) return [];

  // Clean username in case they entered a full URL
  const cleanUsername = username.replace(/^(https?:\/\/)?(www\.)?github\.com\//, "").split("/")[0].trim();
  if (!cleanUsername) return [];

  try {
    const response = await fetch(`https://api.github.com/users/${cleanUsername}/repos?per_page=100`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "CVEarly-App",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("GitHub user not found");
      }
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const repos = (await response.json()) as RawGitHubRepo[];

    if (!Array.isArray(repos)) return [];

    return repos
      .filter((repo) => !repo.fork)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count || 0,
        url: repo.html_url,
      }))
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 10); // Return top 10 starred repos
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return [];
  }
}
