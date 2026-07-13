"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { TranslationSchema } from "./locales/types";

export type Language = "en" | "es";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, variables?: Record<string, string | number | React.ReactNode>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations: Record<Language, TranslationSchema> = { en, es };

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Defer the state updates to avoid synchronous setState inside useEffect during mount (React 19/Next 16 guidelines)
    const timeout = setTimeout(() => {
      const stored = localStorage.getItem("cvearly_lang") as Language | null;
      if (stored === "en" || stored === "es") {
        setLanguageState(stored);
      } else {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith("es")) {
          setLanguageState("es");
        }
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("cvearly_lang", lang);
  };

  const t = (path: string, variables?: Record<string, string | number | React.ReactNode>): string => {
    const keys = path.split(".");
    let current: unknown = translations[language];

    for (const key of keys) {
      if (current && typeof current === "object" && key in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[key];
      } else {
        // Fallback to English if key is missing in Spanish
        let fallback: unknown = translations["en"];
        for (const fallbackKey of keys) {
          if (fallback && typeof fallback === "object" && fallbackKey in (fallback as Record<string, unknown>)) {
            fallback = (fallback as Record<string, unknown>)[fallbackKey];
          } else {
            return path;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current === "string") {
      let result: string = current;
      if (variables) {
        Object.entries(variables).forEach(([key, val]) => {
          if (typeof val === "string" || typeof val === "number") {
            result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(val));
          }
        });
      }
      return result;
    }

    return path;
  };

  // Prevent flash or hydration mismatch issues by rendering children
  // (We start with English fallback, then hydrate the user preference)
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}

