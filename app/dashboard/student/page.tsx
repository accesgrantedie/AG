'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { DashboardShell } from '@/components/DashboardShell'

type Profile = {
  id: string
  full_name?: string
  role?: string
}

type StudentProfile = {
  id: string
  user_id: string
  university?: string
  course_name?: string
  year_of_study?: number
  graduation_year?: number
  skills?: string[]
  hourly_rate?: number
  bio?: string
  github_url?: string
  linkedin_url?: string
  portfolio_url?: string
}

type Application = {
  id: string
  project_name?: string
  status?: string
  created_at?: string
  amount?: number
}

type Project = {
  id: string
  title?: string
  description?: string
  budget?: number
  required_skills?: string[]
  status?: string
}

const CAREER_LEVELS = [
  { level: 1, label: 'Rising Talent',     minBadges: 0,  rate: 12.70 },
  { level: 2, label: 'Proven Coder',      minBadges: 3,  rate: 20.00 },
  { level: 3, label: 'Senior Freelancer', minBadges: 6,  rate: 28.00 },
  { level: 4, label: 'Elite Talent',      minBadges: 10, rate: 40.00 },
]

const MOCK_PROJECTS: Project[] = [
  { id: 'p1', title: 'React Dashboard for CRM', description: 'Build a real-time analytics dashboard using React and Chart.js for a Dublin SaaS company.', budget: 800, required_skills: ['React', 'TypeScript', 'Chart.js'] },
  { id: 'p2', title: 'REST API — Node.js + PostgreSQL', description: 'Design and implement a RESTful API with auth, rate-limiting, and full OpenAPI docs.', budget: 650, required_skills: ['Node.js', 'PostgreSQL', 'Express'] },
  { id: 'p3', title: 'Python Data Pipeline', description: 'ETL pipeline to pull data from 3 APIs, clean it, and load into a data warehouse.', budget: 700, required_skills: ['Python', 'Pandas', 'SQL'] },
]

const STATUS_META: Record<string, { label: string; bg: string; text: string }> = {
  pending:   { label: 'Pending',    bg: 'bg-amber-50',  text: 'text-amber-700'  },
  active:    { label: 'Active',     bg: 'bg-blue-50',   text: 'text-blue-700'   },
  completed: { label: 'Completed',  bg: 'bg-green-50',  text: 'text-green-700'  },
  paid:      { label: 'Paid ✓',     bg: 'bg-green-50',  text: 'text-green-700'  },
  rejected:  { label: 'Not chosen', bg: 'bg-gray-100',  text: 'text-gray-500'   },
}

function scoreColor(score: number) {
  if (score >= 80) return '#0A66C2'
  if (score >= 60) return '#F59E0B'
  return '#ef4444'
}

function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const r = size * 0.38
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = scoreColor(score)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={size*0.07} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={size*0.07}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text x={size/2} y={size/2 + size*0.07} textAnchor="middle" fontSize={size*0.18} fontWeight="700" fill={color}>
        {score}%
      </text>
    </svg>
  )
}

export default function StudentDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState({ applicationsSent: 0, projectsCompleted: 0, totalEarned: 0 })

  const displayName = useMemo(() => profile?.full_name ?? 'Student', [profile])

  const badgeCount = stats.projectsCompleted
  const currentLevel = useMemo(() => {
    return [...CAREER_LEVELS].reverse().find((l) => badgeCount >= l.minBadges) ?? CAREER_LEVELS[0]
  }, [badgeCount])
  const nextLevel = useMemo(() => CAREER_LEVELS.find((l) => l.level === currentLevel.level + 1) ?? null, [currentLevel])
  const levelProgress = useMemo(() => {
    if (!nextLevel) return 100
    return Math.min(100, Math.round(((badgeCount - currentLevel.minBadges) / (nextLevel.minBadges - currentLevel.minBadges)) * 100))
  }, [badgeCount, currentLevel, nextLevel])

  const skillScore = useMemo(() => {
    if (!studentProfile?.skills?.length) return 0
    return Math.min(100, 55 + studentProfile.skills.length * 7)
  }, [studentProfile])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data: userData } = await supabase.auth.getUser()
        const user = userData.user
        if (!user) { router.push('/auth'); return }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles').select('*').eq('id', user.id).single()
        if (profileError) { setError('Unable to load your profile.'); return }
        if (!profileData || profileData.role !== 'student') { router.push('/auth'); return }
        setProfile(profileData)

        const { data: studentData, error: studentError } = await supabase
          .from('student_profiles').select('*').eq('user_id', user.id).single()
        if (studentError && studentError.code !== 'PGRST116') { setError('Unable to load your student profile.'); return }
        setStudentProfile(studentData || null)

        const { data: apps } = await supabase
          .from('applications').select('*').eq('user_id', user.id)
          .order('created_at', { ascending: false }).limit(10)
        const appsList = (apps as Application[]) || []
        const completed = appsList.filter((a) => a.status === 'completed' || a.status === 'paid')
        const totalEarned = completed.reduce((s, a) => s + (a.amount ?? 0), 0)
        setApplications(appsList)
        setStats({ applicationsSent: appsList.length, projectsCompleted: completed.length, totalEarned })
      } catch (err) {
        console.error(err)
        setError('Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-[#6B7280]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#0A66C2]" />
          <span className="text-sm">Loading your dashboard…</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <DashboardShell name={displayName} role="student" title="Something went wrong" subtitle={error}>
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-[#E5E7EB]">
          <button className="rounded-lg bg-[#0A66C2] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0855a8]" onClick={() => router.push('/auth')}>
            Go to login
          </button>
        </div>
      </DashboardShell>
    )
  }

  const hourlyRate = studentProfile?.hourly_rate ?? currentLevel.rate
  const university = studentProfile?.university ?? 'University'
  const skills = studentProfile?.skills ?? []

  return (
    <DashboardShell name={displayName} role="student" title={`Welcome back, ${displayName}`} subtitle="Your career command centre.">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* ── WIDGET 1: Earnings & Career Level ── */}
        <div
          className="flex flex-col justify-between rounded-2xl p-6 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #0F1C2E 0%, #0d2540 100%)' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-white/10 p-2 text-base">💰</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">Earnings</span>
            </div>
            <p className="mt-4 text-4xl font-black tracking-tight text-[#0A66C2]">
              €{stats.totalEarned.toFixed(2)}
            </p>
            <p className="mt-1 text-sm font-medium text-white/60">Total earned to date</p>

            <div className="mt-5 rounded-xl bg-white/10 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-white/50">Current rate</p>
                <p className="font-black text-white">€{hourlyRate.toFixed(2)}<span className="text-xs font-normal text-white/40">/hr</span></p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{currentLevel.label}</span>
                {nextLevel && <span className="text-white/40">→ {nextLevel.label}</span>}
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                <div className="h-1.5 rounded-full transition-all" style={{ width: `${levelProgress}%`, background: '#0A66C2' }} />
              </div>
              <p className="mt-1.5 text-xs text-white/40">{levelProgress}% to next level</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 p-3 text-center">
              <p className="text-xl font-black text-white">{stats.projectsCompleted}</p>
              <p className="text-xs text-white/40">Completed</p>
            </div>
            <div className="rounded-xl bg-white/5 p-3 text-center">
              <p className="text-xl font-black text-white">{stats.applicationsSent}</p>
              <p className="text-xs text-white/40">Applied</p>
            </div>
          </div>
        </div>

        {/* ── WIDGET 2: Skill Score & Badges ── */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm md:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">Skill Score & Badges</h2>
              <p className="mt-0.5 text-sm text-gray-400">Your verified competency profile · AI-assessed</p>
            </div>
            <span className="rounded-full bg-[#0A66C2] px-3 py-1 text-xs font-bold text-white">{university}</span>
          </div>

          <div className="mt-5 flex items-center gap-5">
            {skillScore > 0 ? (
              <ScoreRing score={skillScore} size={76} />
            ) : (
              <div className="flex h-19 w-19 shrink-0 items-center justify-center rounded-full border-4 border-dashed border-gray-200">
                <span className="text-[10px] font-semibold text-gray-400 text-center">No score</span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-700">
                {skillScore > 0
                  ? `${skillScore >= 80 ? 'Excellent' : skillScore >= 60 ? 'Good' : 'Developing'} — keep building`
                  : 'Take your AI assessment to get a verified score'}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skills.length > 0
                  ? skills.slice(0, 6).map((s) => (
                      <span key={s} className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">{s}</span>
                    ))
                  : <span className="text-xs text-gray-400">No skills added yet — edit your profile</span>
                }
              </div>
              {skillScore === 0 && (
                <Link href="/dashboard/assessment" className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#0A66C2] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0855a8]">
                  Take AI Assessment →
                </Link>
              )}
            </div>
          </div>

          <div className="mt-5 border-t border-gray-100 pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Badge Milestones</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'First Project',  earned: stats.projectsCompleted >= 1, href: '/dashboard/projects',   cta: 'Find a project'     },
                { label: 'CS Assessment',  earned: skillScore > 0,               href: '/dashboard/assessment',  cta: 'Take assessment'    },
                { label: '5-Star Review',  earned: false,                         href: '/dashboard/tips',        cta: 'Tips to get 5 stars' },
              ].map((badge) => (
                <div key={badge.label} className={`rounded-xl border p-3 ${badge.earned ? 'border-[#006B3F]/20 bg-[rgba(0,107,63,0.04)]' : 'border-gray-100 bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#111827]">{badge.label}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.earned ? 'bg-[#0A66C2]/10 text-[#0A66C2]' : 'bg-gray-200 text-gray-500'}`}>
                      {badge.earned ? 'Done ✓' : 'Pending'}
                    </span>
                  </div>
                  {!badge.earned && (
                    <Link href={badge.href} className="mt-2 inline-flex items-center text-xs font-semibold text-[#0A66C2] hover:underline">
                      {badge.cta} →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── WIDGET 3: AI-Matched Projects ── */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">AI-Matched Projects</h2>
              <p className="mt-0.5 text-sm text-gray-400">Handpicked for your skills · Apply in one click</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-[#006B3F]/20 bg-[rgba(0,107,63,0.06)] px-3 py-1 text-xs font-semibold text-[#0A66C2]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0A66C2] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0A66C2]" />
              </span>
              {MOCK_PROJECTS.length} live
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {MOCK_PROJECTS.map((project) => (
              <div key={project.id} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-[#006B3F]/20 hover:bg-white">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-lg">💻</div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#111827]">{project.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{project.description}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {(project.required_skills ?? []).map((s) => (
                      <span key={s} className="rounded-md bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-600">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-sm font-black text-[#0A66C2]">€{project.budget?.toLocaleString()}</span>
                  <button
                    className="rounded-lg bg-[#0A66C2] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#0855a8]"
                    onClick={() => router.push('/dashboard/projects')}
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/projects" className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-[#0A66C2] transition hover:underline">
            View all open projects →
          </Link>
        </div>

        {/* ── WIDGET 4: Next Level + Applications ── */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl p-5 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0F1C2E 0%, #0d2540 100%)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Next milestone</p>
            {nextLevel ? (
              <>
                <p className="mt-1 text-lg font-black text-white">{nextLevel.label}</p>
                <p className="mt-0.5 text-sm text-[#0A66C2]">Unlocks €{nextLevel.rate.toFixed(2)}/hr</p>
                <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
                  <div className="h-1.5 rounded-full" style={{ width: `${levelProgress}%`, background: '#0A66C2' }} />
                </div>
                <p className="mt-1.5 text-xs text-white/40">
                  {nextLevel.minBadges - badgeCount} project{nextLevel.minBadges - badgeCount !== 1 ? 's' : ''} away
                </p>
              </>
            ) : (
              <>
                <p className="mt-1 text-lg font-black text-white">Elite Talent 🏆</p>
                <p className="mt-0.5 text-sm text-[#0A66C2]">You&apos;ve reached the top tier!</p>
              </>
            )}
            <Link
              href="/dashboard/projects"
              className="mt-4 flex items-center justify-center gap-1 rounded-xl border border-[#006B3F] bg-[#0A66C2] py-2.5 text-xs font-bold text-white transition hover:bg-[#0855a8]"
            >
              Find projects →
            </Link>
          </div>

          <div className="flex-1 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-[#111827]">My Applications</h2>
            <p className="mt-0.5 text-xs text-gray-400">{stats.applicationsSent} total sent</p>

            {applications.length > 0 ? (
              <div className="mt-4 space-y-2">
                {applications.slice(0, 5).map((app) => {
                  const meta = STATUS_META[app.status ?? 'pending'] ?? STATUS_META.pending
                  return (
                    <div key={app.id} className="rounded-xl border border-gray-100 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-xs font-semibold text-[#111827]">{app.project_name ?? 'Project'}</p>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.bg} ${meta.text}`}>{meta.label}</span>
                      </div>
                      {app.amount != null && app.amount > 0 && (
                        <p className="mt-1 text-xs font-bold text-[#0A66C2]">€{app.amount.toFixed(2)} earned</p>
                      )}
                      {app.created_at && (
                        <p className="mt-0.5 text-[10px] text-gray-400">{new Date(app.created_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' })}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-5 text-center">
                <p className="text-xs font-semibold text-gray-400">No applications yet</p>
                <Link href="/dashboard/projects" className="mt-2 inline-flex items-center text-xs font-bold text-[#0A66C2] hover:underline">
                  Browse projects →
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardShell>
  )
}
