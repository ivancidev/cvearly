import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FAQ } from "@/components/landing/faq";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white">
      {/* Background gradients - subtle developer grid look */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-200px,rgba(255,255,255,0.015),transparent_70%)] pointer-events-none z-0" />
      
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Features Section */}
        <Features />

        {/* FAQ Section */}
        <FAQ />

        {/* Bottom Call to Action Section */}
        <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-3xl p-10 md:p-14 overflow-hidden relative group">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-6">
              Ready to compile your resume?
            </h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed">
              Build an ATS-friendly developer resume backed by your actual repository metrics and project achievements in seconds.
            </p>
            <Link href="/generate">
              <Button size="lg" className="px-10">
                Optimize my CV
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
export const dynamic = "force-static"; // Statically render landing page
