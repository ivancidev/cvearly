import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build your CV - CVEarly",
  description: "Optimise your resume structure and keyword density using Gemini AI to sail through Applicant Tracking Systems.",
};

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
