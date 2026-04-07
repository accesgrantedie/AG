'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { DashboardShell } from '@/components/DashboardShell'
import Link from 'next/link'

const TIPS = [
  {
    icon: '💬',
    title: 'Communicate early and often',
    body: 'Send a short update at the start and end of every work session. Businesses value responsiveness above almost everything else. If you're stuck, say so — silence is worse than a problem.',
  },
  {
    icon: '📋',
    title: 'Clarify scope before you start',
    body: 'Ask one round of questions before beginning — not ten mid-way through. Understand the deliverables, the deadline, and what "done" looks like. Misaligned expectations are the most common source of bad reviews.',
  },
  {
    icon: '🎯',
    title: 'Deliver exactly what was agreed',
    body: 'Scope creep in either direction hurts. Don't under-deliver, but don't invent new features that weren't asked for either. If you spot an improvement opportunity, flag it — don't just do it.',
  },
  {
    icon: '✅',
    title: 'Test your own work',
    body: 'Before marking anything complete, check it yourself as if you were the client. Submitting work with obvious bugs signals carelessness. A short self-review list goes a long way.',
  },
  {
    icon: '📁',
    title: 'Document your work',
    body: 'Leave the business better than you found them. A short README, inline comments on complex logic, or a handover note shows professionalism and makes 5-star reviews easy to justify.',
  },
  {
    icon: '⏰',
    title: 'Meet every deadline',
    body: 'If a deadline is at risk, flag it 2–3 days early — never the day before. Businesses can adjust plans if they have notice. Being late without warning is the fastest way to get a 1-star review.',
  },
  {
    icon: '🤝',
    title: 'End with a handover',
    body: 'When the project wraps, send a short summary of what was delivered, any known limitations, and next steps. It shows maturity and makes it easy for the business to leave a detailed, positive review.',
  },
  {
    icon: '🌟',
    title: 'Ask for feedback (politely)',
    body: 'After delivery, a simple "I'd love any feedback on how I can improve" signals professionalism and often prompts a business to leave a review they might have otherwise skipped.',
  },
]

const DO_DONTS = [
  { do: 'Confirm the brief in writing before starting', dont: 'Assume you understood everything' },
  { do: 'Send progress updates proactively', dont: 'Go quiet for days at a time' },
  { do: 'Flag blockers early', dont: 'Wait until the deadline to mention problems' },
  { do: 'Deliver clean, readable work', dont: 'Submit rushed, undocumented code or outputs' },
  { do: 'Ask one well-thought-out question', dont: 'Send 10 questions in separate messages' },
]

export default function TipsPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('Student')

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
      title="How to earn 5-star reviews"
      subtitle="Practical habits that separate great students from average ones."
      right={
        <button
          onClick={() => router.push('/dashboard/student')}
          className="rounded-lg border border-[#006B3F] bg-white px-4 py-2 text-sm font-semibold text-[#006B3F] shadow-sm transition hover:bg-[#F5F2E9]"
        >
          ← Back
        </button>
      }
    >
      {/* Hero card */}
      <div className="mb-8 rounded-2xl bg-linear-to-r from-[#0F1C2E] via-[#0d2540] to-[#0a3020] p-6 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#4ADE80]">
          Why reviews matter
        </p>
        <h2 className="mt-2 text-xl font-extrabold">
          Your review history is your reputation on access.ie
        </h2>
        <p className="mt-2 text-sm text-white/70">
          Businesses choose students partly on reviews from previous projects. A consistent 5-star
          record unlocks higher-tier projects, better rates, and ultimately — full-time role
          referrals. These habits make the difference.
        </p>
      </div>

      {/* Tips grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {TIPS.map((tip) => (
          <div
            key={tip.title}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-2xl">{tip.icon}</span>
              <div>
                <p className="font-semibold text-[#1E2B3A]">{tip.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{tip.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Do / Don't table */}
      <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="grid grid-cols-2 border-b bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          <span className="text-[#006B3F]">✓ Do</span>
          <span className="text-red-500">✗ Don't</span>
        </div>
        {DO_DONTS.map((row, i) => (
          <div
            key={row.do}
            className={`grid grid-cols-2 items-start gap-4 px-6 py-4 text-sm ${
              i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
            }`}
          >
            <span className="font-medium text-[#1E2B3A]">{row.do}</span>
            <span className="text-gray-500">{row.dont}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 rounded-2xl border border-[#C6F0D6] bg-[rgba(0,107,63,0.06)] p-6 text-center">
        <p className="text-sm font-semibold text-[#1E2B3A]">
          Ready to put this into practice?
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Find a project that matches your skills and start building your reputation.
        </p>
        <Link
          href="/dashboard/projects"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#006B3F] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004d2e]"
        >
          Browse projects →
        </Link>
      </div>
    </DashboardShell>
  )
}
