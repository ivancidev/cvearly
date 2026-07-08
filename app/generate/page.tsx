import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { CVForm } from "@/components/generate/cv-form";

export const metadata = {
  title: "Build your CV - CVEarly",
  description: "Optimise your resume structure and keyword density using Gemini AI to sail through Applicant Tracking Systems.",
};

export default function GeneratePage() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0F] text-zinc-100 flex flex-col selection:bg-violet-500/30 selection:text-white">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_-150px,rgba(124,58,237,0.12),transparent_70%)] pointer-events-none z-0" />
      
      <Navbar />

      <main className="flex-grow relative z-10">
        <CVForm />
      </main>

      <Footer />
    </div>
  );
}
export const dynamic = "force-static"; // Pre-render the form static wrapper
