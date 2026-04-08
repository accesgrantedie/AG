'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { DashboardShell } from '@/components/DashboardShell'

type Track = {
  id: string
  icon: string
  title: string
  description: string
  domains: string[]
  difficulty: string
  minutes: number
}

const TRACKS: Track[] = [
  {
    id: 'web-dev',
    icon: '🌐',
    title: 'Web Development',
    description:
      'HTML, CSS, JavaScript, TypeScript, and modern frontend frameworks. Build and debug real UI components.',
    domains: ['Frontend', 'React', 'TypeScript'],
    difficulty: 'Beginner → Advanced',
    minutes: 20,
  },
  {
    id: 'data',
    icon: '📊',
    title: 'Data & Analytics',
    description:
      'Data wrangling, statistical analysis, visualisation, and working with real-world datasets.',
    domains: ['Python', 'SQL', 'Data viz'],
    difficulty: 'Intermediate',
    minutes: 25,
  },
  {
    id: 'databases',
    icon: '🗄️',
    title: 'Databases & SQL',
    description:
      'Relational schemas, query writing and optimisation, normalisation, and NoSQL fundamentals.',
    domains: ['SQL', 'PostgreSQL', 'NoSQL'],
    difficulty: 'Beginner → Intermediate',
    minutes: 20,
  },
  {
    id: 'cloud',
    icon: '☁️',
    title: 'Cloud & DevOps',
    description:
      'Cloud infrastructure basics, containerisation, CI/CD pipelines, and deployment workflows.',
    domains: ['AWS', 'Docker', 'Linux'],
    difficulty: 'Intermediate',
    minutes: 30,
  },
  {
    id: 'systems',
    icon: '⚙️',
    title: 'Systems & Networking',
    description:
      'Operating systems, networking protocols, security principles, and low-level architecture.',
    domains: ['Linux', 'TCP/IP', 'Security'],
    difficulty: 'Intermediate → Advanced',
    minutes: 25,
  },
  {
    id: 'algorithms',
    icon: '🧩',
    title: 'Algorithms & Problem Solving',
    description:
      'Data structures, complexity analysis, recursion, and practical CS problem solving in any language.',
    domains: ['Any language', 'Logic', 'DSA'],
    difficulty: 'All levels',
    minutes: 35,
  },
  {
    id: 'cybersecurity',
    icon: '🔒',
    title: 'Cybersecurity',
    description:
      'Core security concepts, common vulnerabilities (OWASP), ethical hacking fundamentals, and risk thinking.',
    domains: ['Security', 'Networking', 'Linux'],
    difficulty: 'Intermediate',
    minutes: 25,
  },
  {
    id: 'ux',
    icon: '🎨',
    title: 'UI/UX & Product Design',
    description:
      'User research, wireframing, accessibility, design systems, and translating designs to code.',
    domains: ['Figma', 'CSS', 'Accessibility'],
    difficulty: 'Beginner → Intermediate',
    minutes: 20,
  },
]

const DIFFICULTY_COLOR: Record<string, string> = {
  'Beginner → Advanced': 'bg-green-100 text-green-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  'Beginner → Intermediate': 'bg-green-100 text-green-700',
  'Intermediate → Advanced': 'bg-amber-100 text-amber-700',
  'All levels': 'bg-slate-100 text-slate-600',
}

export default function AssessmentPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('Student')
  const [started, setStarted] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth'); return }
      supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user.id)
        .single()
        .then(({ data: p }) => {
          if (p?.full_name) setUserName(p.full_name)
        })
    })
  }, [router])

  return (
    <DashboardShell
      name={userName}
      role="student"
      title="CS Assessments"
      subtitle="Verify your skills across different areas of computer science."
      right={
        <button
          onClick={() => router.push('/dashboard/student')}
          className="rounded-lg border border-[#006B3F] bg-white px-4 py-2 text-sm font-semibold text-[#006B3F] shadow-sm transition hover:bg-[#F5F2E9]"
        >
          ← Back
        </button>
      }
    >
      {/* Info banner */}
      <div className="mb-6 rounded-2xl border border-[#C6F0D6] bg-[rgba(0,107,63,0.06)] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#1E2B3A]">
              How assessments work
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Pick a track below. Each assessment is a short, practical challenge reviewed by the
              accessgranted.ie team. Pass one to earn your <span className="font-semibold text-[#006B3F]">CS Assessment</span> badge — visible on your profile to businesses.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#006B3F] px-3 py-1.5 text-xs font-semibold text-white">
            🏅 Earns badge
          </span>
        </div>
      </div>

      {/* Track grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TRACKS.map((track) => (
          <div
            key={track.id}
            className="flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-3xl">{track.icon}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  DIFFICULTY_COLOR[track.difficulty] ?? 'bg-slate-100 text-slate-600'
                }`}
              >
                {track.difficulty}
              </span>
            </div>

            <h2 className="mt-3 text-base font-bold text-[#1E2B3A]">{track.title}</h2>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-gray-500">
              {track.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1">
              {track.domains.map((d) => (
                <span
                  key={d}
                  className="rounded-full border border-gray-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600"
                >
                  {d}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
              <span>~{track.minutes} min</span>
            </div>

            {started === track.id ? (
              <div className="mt-4 rounded-lg border border-[#C6F0D6] bg-[rgba(0,107,63,0.06)] p-3 text-center text-sm font-semibold text-[#006B3F]">
                ✓ Request submitted — we'll be in touch!
              </div>
            ) : (
              <button
                onClick={() => setStarted(track.id)}
                className="mt-4 w-full rounded-lg bg-[#006B3F] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004d2e]"
              >
                Start assessment
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-gray-400">
        Assessments are reviewed within 2 business days. You'll be notified by email.
      </p>
    </DashboardShell>
  )
}
