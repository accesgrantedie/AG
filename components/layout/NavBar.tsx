import { useState } from 'react';
import Link from 'next/link';
import { GREEN } from '@/data/constants';

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0F1C2E]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-white">access<span style={{ color: GREEN }}>.ie</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <a href="#how-it-works" className="text-sm text-white/70 transition hover:text-white">How it works</a>
          <a href="#ai-matching" className="text-sm text-white/70 transition hover:text-white">AI matching</a>
          <a href="#pay-tiers" className="text-sm text-white/70 transition hover:text-white">Pay tiers</a>
          <a href="#gradstart" className="text-sm text-white/70 transition hover:text-white">GradStart</a>
          <a href="#compare" className="text-sm text-white/70 transition hover:text-white">Why access.ie</a>
        </div>

        {/* Auth CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth?tab=login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white/80 transition hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/auth?tab=register"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition"
            style={{ backgroundColor: GREEN }}
          >
            Get started free
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-5 bg-white transition-all ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition-all ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0F1C2E] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-sm text-white/70">How it works</a>
            <a href="#ai-matching" onClick={() => setMobileOpen(false)} className="text-sm text-white/70">AI matching</a>
            <a href="#pay-tiers" onClick={() => setMobileOpen(false)} className="text-sm text-white/70">Pay tiers</a>
            <a href="#gradstart" onClick={() => setMobileOpen(false)} className="text-sm text-white/70">GradStart</a>
            <a href="#compare" onClick={() => setMobileOpen(false)} className="text-sm text-white/70">Why access.ie</a>
            <hr className="border-white/10" />
            <Link href="/auth?tab=login" className="text-sm text-white/70">Log in</Link>
            <Link
              href="/auth?tab=register"
              className="rounded-lg py-2 text-center text-sm font-semibold text-white"
              style={{ backgroundColor: GREEN }}
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}