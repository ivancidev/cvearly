"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { GitHubStarButton } from "./github-star-button";

// GitHub repo URL — defined in github-star-button.tsx

export function Navbar() {
  const pathname = usePathname();

  const isHome = pathname === "/" || pathname === "";
  const isGenerate = pathname === "/generate";
  const isResult = pathname === "/result";

  const handleScrollToHowItWorks = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      const element = document.getElementById("how-it-works");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="relative z-10 max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-all">
          <span className="font-mono text-sm font-semibold text-zinc-200 group-hover:text-white">&lt;/&gt;</span>
        </div>
        <span className="font-semibold text-lg tracking-tight text-white font-sans">
          cvearly
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {/* GitHub star button — always visible */}
        <GitHubStarButton />

        {isHome && (
          <>
            <a
              href="#how-it-works"
              onClick={handleScrollToHowItWorks}
              className="text-zinc-400 text-sm hover:text-white transition-colors cursor-pointer"
            >
              How it works
            </a>
            <Link href="/generate">
              <Button size="sm">Try it free</Button>
            </Link>
          </>
        )}

        {isGenerate && (
          <Link
            href="/"
            className="text-zinc-400 text-sm hover:text-white transition-colors flex items-center gap-1.5"
          >
            &larr; Back home
          </Link>
        )}

        {isResult && (
          <Link href="/generate">
            <Button size="sm" variant="outline">
              &larr; New CV
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
export default Navbar;
