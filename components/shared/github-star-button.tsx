"use client";

import { useEffect, useState } from "react";

const GITHUB_REPO = "https://github.com/ivancidev/cvearly";
const GITHUB_API = "https://api.github.com/repos/ivancidev/cvearly";

/**
 * Fetches and displays the live GitHub star count for the CVEarly repo.
 * Caches the result in sessionStorage to avoid repeated API calls.
 */
export function GitHubStarButton() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem("gh_stars");
    if (cached) {
      // Defer to avoid synchronous setState inside effect (AGENTS.md rule)
      setTimeout(() => setStars(parseInt(cached, 10)), 0);
      return;
    }
    fetch(GITHUB_API)
      .then((r) => r.json())
      .then((data: { stargazers_count?: number }) => {
        if (typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
          sessionStorage.setItem("gh_stars", String(data.stargazers_count));
        }
      })
      .catch(() => {
        // Silently fail — stars are a nice-to-have
      });
  }, []);

  return (
    <a
      href={GITHUB_REPO}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all text-zinc-400 hover:text-zinc-200 text-xs font-mono cursor-pointer group"
      aria-label="Star CVEarly on GitHub"
    >
      {/* GitHub icon */}
      <svg
        className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 transition-colors"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>

      {/* Star icon */}
      <svg
        className="w-3 h-3 text-amber-500 group-hover:text-amber-400 transition-colors"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>

      <span className="text-zinc-300 font-semibold">
        {stars !== null
          ? stars >= 1000
            ? `${(stars / 1000).toFixed(1)}k`
            : String(stars)
          : "Star"}
      </span>
    </a>
  );
}

export default GitHubStarButton;
