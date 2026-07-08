import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-[#0A0A0F] text-zinc-100">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_50%_40%,rgba(124,58,237,0.14),transparent_70%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.05)_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none z-0" />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Large 404 text */}
        <h1 className="text-[120px] sm:text-[140px] font-extrabold leading-none tracking-tighter bg-gradient-to-br from-violet-400 to-cyan-400 bg-clip-text text-transparent select-none">
          404
        </h1>
        
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-4 mb-2">
          {"This page doesn't exist"}
        </h2>
        
        <p className="text-sm text-zinc-400 max-w-sm leading-relaxed mb-8">
          {"The page you're looking for may have been moved, deleted, or never existed in the first place."}
        </p>
        
        <Link href="/">
          <Button size="md" className="cve-glow px-8 py-3.5 font-semibold text-sm">
            Back home
          </Button>
        </Link>
      </div>
    </div>
  );
}
export const dynamic = "force-static"; // Render statically
