"use client";

import { Link, usePathname } from "@/i18n/routing";
import { Button } from "../ui/button";
import { GitHubStarButton } from "./github-star-button";
import { LanguagePicker } from "./language-picker";
import { useTranslations } from "next-intl";

// GitHub repo URL — defined in github-star-button.tsx

export function Navbar() {
  const pathname = usePathname();
  const t = useTranslations();

  const isHome = pathname === "/" || pathname === "";
  const isResult = pathname === "/result";
  return (
    <nav className="relative z-50 max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-all">
          <span className="font-mono text-sm font-semibold text-zinc-200 group-hover:text-white">&lt;/&gt;</span>
        </div>
        <span className="font-semibold text-lg tracking-tight text-white font-sans">
          {t("navbar.logo")}
        </span>
        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 select-none font-mono">
          BETA
        </span>
      </Link>

      <div className="flex items-center gap-3">
        {/* GitHub star button — always visible */}
        <GitHubStarButton />

        {/* Language Selector Dropdown */}
        <LanguagePicker />

        {isHome && (
          <Link href="/generate">
            <Button size="sm">{t("navbar.tryItFree")}</Button>
          </Link>
        )}

        {isResult && (
          <Link href="/generate">
            <Button size="sm" variant="outline">
              &larr; {t("navbar.newCv")}
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
export default Navbar;

