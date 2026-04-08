'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GREEN } from '@/data/constants'

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    handleScroll();

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[id]');

    const handleScroll = () => {
      let current = ''

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100
        const sectionHeight = section.clientHeight

        if (
          window.scrollY >= sectionTop &&
          window.scrollY < sectionTop + sectionHeight
        ) {
          current = section.getAttribute('id') || ''
        }
      })

      setActiveSection(current)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out">

        {/* TRUE glass layer */}
        <div
          className={`absolute inset-0 backdrop-blur-xl border-b transition-all duration-300 ${
            scrolled
              ? 'bg-[#0B1220]/95 border-white/10'
              : 'bg-white/[0.06] border-transparent'
          }
          ${scrolled ? 'shadow-lg shadow-black/40' : ''}`
        }
        />

        {/* subtle gradient highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* ── LOGO ── */}
        <Link href="/" className="flex items-center gap-3 group">
          
          {/* Logo icon */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-green-600 font-bold text-black shadow-lg group-hover:scale-105 transition">
            AG
          </div>

          {/* Logo text */}
          <span className="text-lg font-black tracking-tight text-white">
            access<span style={{ color: GREEN }}>granted</span>
            <span className="text-white/40">.ie</span>
          </span>
        </Link>

        {/* ── DESKTOP NAV ── */}
        <div className="hidden items-center gap-8 md:flex">
          {[
            { label: 'How it works', href: '#how-it-works' },
            { label: 'AI matching', href: '#ai-matching' },
            { label: 'Pay tiers', href: '#pay-tiers' },
            { label: 'GradStart', href: '#gradstart' },
            { label: 'Why us', href: '#compare' },
          ].map((item) => {
            const isActive = activeSection === item.href.replace('#', '')

            return (
              <a
                key={item.label}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium tracking-tight transition-all duration-200
                  ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {item.label}
              </a>
            )
          })}
        </div>

        {/* ── CTA ── */}
        <div className="hidden items-center gap-3 md:flex">
          
          {/* <Link
            href="/auth?tab=login"
            className="text-sm font-semibold text-white/70 transition hover:text-white"
          >
            Log in
          </Link> */}

          <Link
            href="/auth?tab=register"
            className="relative rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ backgroundColor: GREEN }}
          >
            Join waitlist →

            <span className="absolute inset-0 rounded-xl bg-green-400 opacity-0 blur-md transition hover:opacity-40" />
          </Link>
        </div>

        {/* ── MOBILE MENU BUTTON ── */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={`block h-0.5 w-6 bg-white transition-all ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* ── MOBILE MENU ── */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          mobileOpen ? 'max-h-[400px]' : 'max-h-0'
        }`}
      >
        <div className="border-t border-white/10 bg-[#0B1220]/95 backdrop-blur-xl px-6 py-6">
          <div className="flex flex-col gap-5">
            
            {[
              'How it works',
              'AI matching',
              'Pay tiers',
              'GradStart',
              'Why us',
            ].map((item) => (
              <a
                key={item}
                href="#"
                onClick={() => setMobileOpen(false)}
                className="text-white/70 hover:text-white"
              >
                {item}
              </a>
            ))}

            <div className="mt-4 flex flex-col gap-3">
              <Link href="/auth?tab=login" className="text-white/70">
                Log in
              </Link>

              <Link
                href="/auth?tab=register"
                className="rounded-xl py-3 text-center font-bold text-white"
                style={{ backgroundColor: GREEN }}
              >
                Join waitlist →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}