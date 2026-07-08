/**
 * Helper to calculate keyword matching density or refine ATS scores.
 */
export function calculateKeywordDensity(text: string, keywords: string[]): {
  matched: string[];
  missing: string[];
  density: number;
} {
  if (!text || !keywords || keywords.length === 0) {
    return { matched: [], missing: [], density: 0 };
  }

  const normalizedText = text.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];

  keywords.forEach((keyword) => {
    const cleanKeyword = keyword.toLowerCase().trim();
    if (!cleanKeyword) return;
    
    // Check if keyword is in the text as a word boundary
    const regex = new RegExp(`\\b${escapeRegExp(cleanKeyword)}\\b`, "i");
    if (regex.test(normalizedText) || normalizedText.includes(cleanKeyword)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  const density = keywords.length > 0 ? (matched.length / keywords.length) * 100 : 0;

  return {
    matched,
    missing,
    density: Math.round(density),
  };
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
