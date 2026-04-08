import Link from 'next/link';
import { DARK, GREEN } from '@/data/constants';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: DARK }} className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <span className="text-xl font-black text-white">access<span style={{ color: GREEN }}>.ie</span></span>
              <p className="mt-1 text-xs text-white/30">
                Ireland&apos;s AI-powered student talent platform. Proudly Irish.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-xs text-white/40">
              <Link href="/auth?tab=register&role=student" className="transition hover:text-white/70">For students</Link>
              <Link href="/auth?tab=register&role=business" className="transition hover:text-white/70">For SMEs</Link>
              <Link href="/auth?tab=register" className="transition hover:text-white/70">For universities</Link>
              <Link href="/auth?tab=login" className="transition hover:text-white/70">Log in</Link>
            </div>
          </div>
          <div
            className="mt-8 border-t pt-8 text-center text-xs text-white/20"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            © {new Date().getFullYear()} access.ie. All rights reserved.
          </div>
        </div>
      </footer>
  )
}