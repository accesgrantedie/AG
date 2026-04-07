'use client'

import Link from 'next/link'

type Props = {
  projectsCompleted: number
  hourlyRate: number
  skills?: string[]
}

export function StudentCareerProgress({ projectsCompleted, hourlyRate, skills }: Props) {
  const hasFirstProject = projectsCompleted >= 1
  const hasAssessment = (skills?.length ?? 0) > 0
  const hasFiveStarReview = false

  const badgeCount = [hasFirstProject, hasAssessment, hasFiveStarReview].filter(Boolean).length
  const badgeGoal = 3
  const progressPercent = Math.round((badgeCount / badgeGoal) * 100)

  const currentLevelLabel = 'Level 1: Rising Talent'
  const nextLevelLabel = 'Unlock €20/hr rate'

  const badges = [
    {
      label: 'First Project',
      detail: hasFirstProject ? 'Completed' : '0 / 1',
      earned: hasFirstProject,
      cta: 'Find a project',
      href: '/dashboard/projects',
    },
    {
      label: 'CS Assessment',
      detail: hasAssessment ? 'Passed' : '0 / 1',
      earned: hasAssessment,
      cta: 'Take assessment',
      href: '/dashboard/assessment',
    },
    {
      label: '5‑Star review',
      detail: hasFiveStarReview ? 'Received' : '0 / 1',
      earned: hasFiveStarReview,
      cta: 'Tips to get 5 stars',
      href: '/dashboard/tips',
    },
  ]

  return (
    <section className="rounded-2xl bg-linear-to-r from-[#0F1C2E] via-[#0d2540] to-[#0a3020] p-6 shadow-xl text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#4ADE80]">
            Career progress
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
            {currentLevelLabel}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            {hourlyRate > 0
              ? `Current rate: €${hourlyRate.toFixed(2)} / hr — keep earning to level up.`
              : 'Complete badges below to unlock higher pay tiers.'}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
          <span className="h-2 w-2 rounded-full bg-[#4ADE80]" />
          Active level
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-white/10 p-4">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span className="text-white">{badgeCount}/{badgeGoal} badges to reach Level 2</span>
          <span className="text-white/70">(€20/hr)</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#4ADE80] transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-white/60">
          <span>{progressPercent}% complete</span>
          <span>{badgeGoal - badgeCount} step{badgeGoal - badgeCount !== 1 ? 's' : ''} remaining</span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {badges.map((badge) => (
          <div
            key={badge.label}
            className={`flex flex-col gap-3 rounded-xl border p-4 transition ${
              badge.earned
                ? 'border-[#4ADE80]/30 bg-[#4ADE80]/5'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{badge.label}</p>
                <p className="mt-1 text-xs text-white/60">{badge.detail}</p>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  badge.earned
                    ? 'bg-[#4ADE80]/20 text-[#4ADE80]'
                    : 'bg-white/10 text-white/60'
                }`}
              >
                {badge.earned ? 'Done ✓' : 'Pending'}
              </span>
            </div>
            <Link
              href={badge.href}
              className={`mt-auto inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition ${
                badge.earned
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-[#006B3F] text-white hover:bg-[#004d2e]'
              }`}
            >
              {badge.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
            Next level
          </p>
          <p className="mt-1 text-lg font-bold">{nextLevelLabel}</p>
        </div>
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4ADE80] px-4 py-2 text-sm font-semibold text-[#0F1C2E] transition hover:bg-[#3ecf6d]"
        >
          See how to get there
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
