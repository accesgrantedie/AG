'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Props = {
  name: string
  role: 'student' | 'business' | 'university'
}

const NAV_LINKS: Record<string, { href: string; label: string }[]> = {
  student: [
    { href: '/dashboard/student', label: 'Dashboard' },
    { href: '/dashboard/projects', label: 'Browse Projects' },
    { href: '/dashboard/assessment', label: 'Assessments' },
  ],
  business: [
    { href: '/dashboard/business', label: 'Dashboard' },
    { href: '/dashboard/post', label: 'Post Project' },
  ],
  university: [
    { href: '/dashboard/university', label: 'Dashboard' },
  ],
}

const ROLE_BADGE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  student:    { label: '🎓 Student',    color: '#0A66C2', bg: 'rgba(10,102,194,0.08)',  border: 'rgba(10,102,194,0.25)' },
  business:   { label: '💼 SME',        color: '#0A66C2', bg: 'rgba(10,102,194,0.08)',  border: 'rgba(10,102,194,0.25)' },
  university: { label: '🏫 University', color: '#0A66C2', bg: 'rgba(10,102,194,0.08)',  border: 'rgba(10,102,194,0.25)' },
}

export function DashboardNav({ name, role }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const links = NAV_LINKS[role] ?? NAV_LINKS.student
  const badge = ROLE_BADGE[role] ?? ROLE_BADGE.student

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-black text-[#111827]">
            access<span className="text-[#0A66C2]">.ie</span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? 'bg-[#0A66C2]/10 text-[#0A66C2]'
                      : 'text-[#4B5563] hover:bg-gray-100 hover:text-[#111827]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white"
            style={{ backgroundColor: '#0A66C2' }}
          >
            {name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <span className="hidden max-w-32 truncate text-sm text-[#4B5563] md:block">{name}</span>
          <span
            className="hidden rounded-full border px-2 py-0.5 text-xs font-semibold md:inline-flex"
            style={{ color: badge.color, backgroundColor: badge.bg, borderColor: badge.border }}
          >
            {badge.label}
          </span>
          <button
            onClick={signOut}
            className="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-semibold text-[#4B5563] transition hover:border-[#0A66C2] hover:text-[#0A66C2]"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}
