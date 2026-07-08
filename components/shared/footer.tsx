import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-zinc-900 bg-[#030303] py-8 px-6 mt-auto w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <span className="text-[8px] font-black text-zinc-300 leading-none">CV</span>
          </div>
          <span className="font-semibold text-zinc-400 tracking-tight">CVEarly</span>
        </div>

        {/* Links */}
        <div className="flex gap-6">
          <span className="hover:text-zinc-300 cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-zinc-300 cursor-pointer transition-colors">Terms</span>
          <Link href="/" className="hover:text-zinc-300 transition-colors">
            Docs
          </Link>
        </div>

        {/* Copyright */}
        <div>
          <span className="text-zinc-700">&copy; {new Date().getFullYear()} CVEarly. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
