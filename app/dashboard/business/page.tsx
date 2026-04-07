'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { DashboardShell } from '@/components/DashboardShell'
import { FieldSelect } from '@/components/ui/FieldSelect'
import { INDUSTRIES, COMPANY_SIZES } from '@/lib/constants'

/* ── Types ───────────────────────────────────────────────────────── */
type Profile = {
  id: string
  full_name?: string
  role?: 'student' | 'business' | string
  company_name?: string
}

type BusinessProfile = {
  id: string
  user_id: string
  company_name?: string
  website?: string
  description?: string
  industry?: string
  company_size?: string
  location?: string
  vat_number?: string
}

type Project = {
  id: string
  title?: string
  status?: string
  created_at?: string
  expires_at?: string
  owner_id?: string
}

type Application = {
  id: string
  project_id?: string
  status?: string
  created_at?: string
  amount?: number
}

/* ── Mock talent data ────────────────────────────────────────────── */
type TalentProfile = {
  id: string
  name: string
  university: string
  course: string
  skillScore: number
  skills: string[]
  assessment: {
    task: string
    score: number
    time: string
    feedback: string
    answers: { q: string; a: string; mark: number; max: number }[]
  }
}

const MOCK_TALENT: TalentProfile[] = [
  {
    id: '1',
    name: 'Aoife Brennan',
    university: 'UCD',
    course: 'BSc Computer Science',
    skillScore: 91,
    skills: ['React', 'TypeScript', 'Node.js'],
    assessment: {
      task: 'Build a REST API with authentication',
      score: 91,
      time: '47 min',
      feedback: 'Excellent structure and error handling. JWT implementation was clean and secure.',
      answers: [
        { q: 'Explain JWT token flow', a: 'JWT is issued on login, signed with secret, verified on each request...', mark: 9, max: 10 },
        { q: 'Optimise a slow SQL query', a: 'Added composite index on (user_id, created_at) and rewrote subquery as JOIN...', mark: 10, max: 10 },
        { q: 'Handle race condition in payments', a: 'Use database transactions with SELECT FOR UPDATE...', mark: 8, max: 10 },
      ],
    },
  },
  {
    id: '2',
    name: 'Ciarán Kelly',
    university: 'DCU',
    course: 'BSc Software Engineering',
    skillScore: 84,
    skills: ['Python', 'Django', 'PostgreSQL'],
    assessment: {
      task: 'Implement a data pipeline with error recovery',
      score: 84,
      time: '53 min',
      feedback: 'Solid understanding of async patterns. Could improve on edge-case handling.',
      answers: [
        { q: 'Design a retry mechanism', a: 'Exponential backoff with jitter, max 3 retries, dead-letter queue for failures...', mark: 9, max: 10 },
        { q: 'Explain database indexing', a: 'B-tree indexes for range queries, hash indexes for equality...', mark: 8, max: 10 },
        { q: 'Write a Python generator', a: 'Used yield keyword inside a function to lazily produce values...', mark: 7, max: 10 },
      ],
    },
  },
  {
    id: '3',
    name: 'Sinéad Murphy',
    university: 'TCD',
    course: 'MSc Computer Science',
    skillScore: 78,
    skills: ['Vue.js', 'Laravel', 'MySQL'],
    assessment: {
      task: 'Create a full-stack CRUD application',
      score: 78,
      time: '61 min',
      feedback: 'Good grasp of MVC architecture. Front-end was polished and accessible.',
      answers: [
        { q: 'Explain MVC pattern', a: 'Model handles data, View renders UI, Controller manages flow...', mark: 8, max: 10 },
        { q: 'How do you prevent XSS?', a: 'Sanitise inputs, use CSP headers, escape output with htmlspecialchars...', mark: 8, max: 10 },
        { q: 'Describe a Vue computed property', a: 'Reactive property derived from state, cached until dependencies change...', mark: 6, max: 10 },
      ],
    },
  },
]

const ACTIVE_STUDENTS = [
  { name: 'Aoife Brennan', project: 'API Integration', hoursThisWeek: 14, status: 'on track' },
  { name: 'Ciarán Kelly', project: 'Data Pipeline', hoursThisWeek: 11, status: 'on track' },
  { name: 'Sinéad Murphy', project: 'Frontend Rebuild', hoursThisWeek: 9, status: 'review needed' },
]

/* ── Helpers ─────────────────────────────────────────────────────── */
function scoreColor(score: number) {
  if (score >= 85) return '#0A66C2'
  if (score >= 70) return '#F59E0B'
  return '#ef4444'
}

function ScoreRing({ score }: { score: number }) {
  const r = 20
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="shrink-0">
      <circle cx="26" cy="26" r={r} fill="none" stroke="#E5E7EB" strokeWidth="4" />
      <circle
        cx="26" cy="26" r={r} fill="none"
        stroke={scoreColor(score)} strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
      />
      <text x="26" y="31" textAnchor="middle" fontSize="11" fontWeight="700" fill={scoreColor(score)}>
        {score}%
      </text>
    </svg>
  )
}

/* ── Assessment Modal ────────────────────────────────────────────── */
function AssessmentModal({
  talent,
  onClose,
}: {
  talent: TalentProfile
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,28,46,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Assessment Results</p>
            <h3 className="text-lg font-bold text-[#111827]">{talent.name}</h3>
            <p className="text-sm text-[#4B5563]">{talent.course} · {talent.university}</p>
          </div>
          <div className="flex flex-col items-center">
            <ScoreRing score={talent.assessment.score} />
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Task Set</p>
            <p className="mt-1 text-sm font-medium text-[#111827]">{talent.assessment.task}</p>
            <div className="mt-2 flex gap-4 text-xs text-gray-500">
              <span>⏱ {talent.assessment.time}</span>
              <span>💬 AI Feedback</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-gray-600 italic">"{talent.assessment.feedback}"</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Question Breakdown</p>
            {talent.assessment.answers.map((ans, i) => (
              <div key={i} className="rounded-xl border border-gray-100 p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold text-[#111827]">Q{i + 1}. {ans.q}</p>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold text-white"
                    style={{ background: scoreColor((ans.mark / ans.max) * 100) }}
                  >
                    {ans.mark}/{ans.max}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{ans.a}</p>
                {/* mini progress bar */}
                <div className="mt-2 h-1 w-full rounded-full bg-gray-100">
                  <div
                    className="h-1 rounded-full transition-all"
                    style={{ width: `${(ans.mark / ans.max) * 100}%`, background: scoreColor((ans.mark / ans.max) * 100) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition hover:opacity-90 bg-[#0A66C2]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function BusinessDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState({ activeProjects: 0, totalSpent: 0, totalHires: 0 })

  // Profile form
  const [form, setForm] = useState<Partial<BusinessProfile>>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)

  // Project intake
  const [projectTitle, setProjectTitle] = useState('')
  const [projectRequirements, setProjectRequirements] = useState('')
  const [projectSaving, setProjectSaving] = useState(false)
  const [projectFeedback, setProjectFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Assessment modal
  const [activeTalent, setActiveTalent] = useState<TalentProfile | null>(null)

  const totalHoursThisWeek = ACTIVE_STUDENTS.reduce((s, st) => s + st.hoursThisWeek, 0)

  const companyName = useMemo(() => {
    if (businessProfile?.company_name) return businessProfile.company_name
    return profile?.company_name || 'Company'
  }, [businessProfile, profile])

  const isProfileComplete = useMemo(() => {
    if (!businessProfile) return false
    return (
      Boolean(businessProfile.company_name) &&
      Boolean(businessProfile.description) &&
      Boolean(businessProfile.industry) &&
      Boolean(businessProfile.company_size) &&
      Boolean(businessProfile.location)
    )
  }, [businessProfile])

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
        if (!profileData || profileData.role !== 'business') { router.push('/auth'); return }

        setProfile(profileData)

        const { data: businessData, error: businessError } = await supabase
          .from('business_profiles').select('*').eq('user_id', user.id).single()

        if (businessError && businessError.code !== 'PGRST116') {
          setError('Unable to load your business profile.'); return
        }

        setBusinessProfile(businessData || null)
        setForm(businessData || { user_id: user.id })
        await loadDashboard(user.id)
      } catch (err) {
        console.error('Business dashboard error:', err)
        setError('Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router])

  const loadDashboard = async (userId: string) => {
    try {
      const [{ data: projectsData }, { data: appsData }] = await Promise.all([
        supabase.from('projects').select('*').eq('owner_id', userId)
          .in('status', ['open', 'active']).order('created_at', { ascending: false }).limit(10),
        supabase.from('applications').select('*').eq('business_id', userId)
          .order('created_at', { ascending: false }).limit(10),
      ])
      const projectList = (projectsData as Project[]) || []
      const appList = (appsData as Application[]) || []
      setProjects(projectList)
      const totalSpent = appList
        .filter((a) => a.status === 'paid' || a.status === 'completed')
        .reduce((s, a) => s + (a.amount ?? 0), 0)
      const totalHires = appList.filter((a) => ['hired', 'completed', 'paid'].includes(a.status ?? '')).length
      setStats({ activeProjects: projectList.length, totalSpent, totalHires })
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    }
  }

  const validateForm = () => {
    const next: Record<string, string> = {}
    if (!form.company_name?.trim()) next.company_name = 'Company name is required.'
    if (!form.description?.trim()) next.description = 'Company description is required.'
    if (!form.industry) next.industry = 'Please select an industry.'
    if (!form.company_size) next.company_size = 'Please select a company size.'
    if (!form.location?.trim()) next.location = 'Location is required.'
    setFormErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProfileSuccess(null)
    if (!validateForm()) return
    setSaving(true)
    try {
      const payload: Partial<BusinessProfile> = {
        user_id: profile?.id ?? '',
        company_name: form.company_name,
        website: form.website || undefined,
        description: form.description,
        industry: form.industry,
        company_size: form.company_size,
        location: form.location,
        vat_number: form.vat_number || undefined,
      }
      const { error } = await supabase.from('business_profiles').upsert(payload)
      if (error) { setError('Something went wrong.'); return }
      setProfileSuccess('Company profile saved')
      const { data: updated } = await supabase.from('business_profiles').select('*').eq('user_id', profile?.id).single()
      setBusinessProfile(updated || null)
      await loadDashboard(profile?.id ?? '')
    } catch (err) {
      console.error('Unexpected save error:', err)
      setError('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  const handlePostProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!projectTitle.trim() || !projectRequirements.trim()) {
      setProjectFeedback({ type: 'error', text: 'Please fill in both fields.' })
      return
    }
    setProjectSaving(true)
    setProjectFeedback(null)
    try {
      const { error } = await supabase.from('projects').insert({
        owner_id: profile?.id,
        title: projectTitle.trim(),
        description: projectRequirements.trim(),
        status: 'open',
      })
      if (error) {
        setProjectFeedback({ type: 'error', text: error.message })
      } else {
        setProjectFeedback({ type: 'success', text: 'Project posted — AI matching has started.' })
        setProjectTitle('')
        setProjectRequirements('')
        if (profile?.id) await loadDashboard(profile.id)
      }
    } catch (err) {
      console.error('Post project error:', err)
      setProjectFeedback({ type: 'error', text: 'Something went wrong.' })
    } finally {
      setProjectSaving(false)
    }
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-[#6B7280]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#0A66C2]" />
          Loading your dashboard…
        </div>
      </div>
    )
  }

  /* ── Error ── */
  if (error) {
    return (
      <DashboardShell name={companyName} role="business" title="Something went wrong" subtitle={error}>
        <div className="rounded-2xl bg-white p-8 border border-[#E5E7EB] shadow-sm">
          <button
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#0A66C2] transition hover:bg-[#0855a8]"
            onClick={() => router.push('/auth')}
          >
            Go to login
          </button>
        </div>
      </DashboardShell>
    )
  }

  /* ── Profile setup (incomplete) ── */
  if (!isProfileComplete) {
    return (
      <DashboardShell name={companyName} role="business" title={`Welcome, ${companyName}`} subtitle="Complete your profile to unlock your dashboard.">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="text-lg font-bold text-[#111827]">Complete your company profile</h2>
          <p className="mt-1 text-sm text-gray-500">Fill in the details so students can find and trust your company.</p>
          {profileSuccess && (
            <div className="mt-4 rounded-lg border border-green-100 bg-green-50 p-3 text-sm font-medium text-green-700">
              {profileSuccess}
            </div>
          )}
          <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
            <FormField label="Company name" value={form.company_name ?? ''} onChange={(v) => setForm((p) => ({ ...p, company_name: v }))} error={formErrors.company_name} />
            <FormField label="Website (optional)" value={form.website ?? ''} onChange={(v) => setForm((p) => ({ ...p, website: v }))} type="url" />
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Description</span>
              <textarea
                value={form.description ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="mt-1 h-24 w-full resize-none rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006B3F]"
                placeholder="Describe your company and the kinds of projects you post."
              />
              {formErrors.description && <p className="mt-1 text-xs text-red-500">{formErrors.description}</p>}
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <FieldSelect label="Industry" value={form.industry ?? ''} options={INDUSTRIES} onChange={(v) => setForm((p) => ({ ...p, industry: v }))} error={formErrors.industry} />
              <FieldSelect label="Company size" value={form.company_size ?? ''} options={COMPANY_SIZES} onChange={(v) => setForm((p) => ({ ...p, company_size: v }))} error={formErrors.company_size} />
            </div>
            <FormField label="Location" value={form.location ?? ''} onChange={(v) => setForm((p) => ({ ...p, location: v }))} error={formErrors.location} />
            <FormField label="VAT number (optional)" value={form.vat_number ?? ''} onChange={(v) => setForm((p) => ({ ...p, vat_number: v }))} />
            <button
              type="submit" disabled={saving}
              className="w-full rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 bg-[#0A66C2]"
            >
              {saving ? 'Saving…' : 'Save company profile'}
            </button>
          </form>
        </div>
      </DashboardShell>
    )
  }

  /* ── Main Bento Dashboard ── */
  return (
    <>
      {activeTalent && (
        <AssessmentModal talent={activeTalent} onClose={() => setActiveTalent(null)} />
      )}

      <DashboardShell
        name={companyName}
        role="business"
        title={`Welcome back, ${companyName}`}
        subtitle="Here's your SME command centre."
      >
        {/* ── BENTO GRID ── */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* ── WIDGET 1: Savings Tracker (col 1, row 1) ── */}
          <div
            className="flex flex-col justify-between rounded-2xl p-6 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0F1C2E 0%, #0d2540 100%)' }}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-white/10 p-2 text-lg">💰</span>
                <span className="text-xs font-semibold uppercase tracking-widest text-white/40">GradStart Grant</span>
              </div>
              <p className="mt-4 text-4xl font-black tracking-tight text-[#0A66C2]">
                €1,225.40
              </p>
              <p className="mt-1 text-sm font-medium text-white/70">Total GradStart Savings</p>
              <p className="mt-3 text-xs leading-relaxed text-white/40">
                You&apos;ve saved this by hiring verified Irish CS students instead of agency contractors.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-xs text-white/50">
                <span>Grant utilised</span>
                <span className="text-[#0A66C2]">61%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10">
                <div className="h-1.5 rounded-full" style={{ width: '61%', background: '#0A66C2' }} />
              </div>
              <a
                href="#"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#0A66C2] transition hover:opacity-80"
              >
                View Grant Details →
              </a>
            </div>
          </div>

          {/* ── WIDGET 2: Project Intake (col 2–3, row 1) ── */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#111827]">Post a Project</h2>
                <p className="mt-0.5 text-sm text-gray-400">Describe the work — AI will match the right students.</p>
              </div>
              <span className="rounded-xl bg-[#0A66C2]/10 px-3 py-1 text-xs font-semibold text-[#0A66C2]">
                {stats.activeProjects} active
              </span>
            </div>

            {projectFeedback && (
              <div className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                projectFeedback.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
                {projectFeedback.text}
              </div>
            )}

            <form onSubmit={handlePostProject} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Project Title
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Build a React dashboard for our CRM"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Requirements
                </label>
                <textarea
                  value={projectRequirements}
                  onChange={(e) => setProjectRequirements(e.target.value)}
                  rows={4}
                  placeholder="Describe skills, deliverables, timeline, and budget…"
                  className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/10"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">AI matching starts immediately after posting</p>
                <button
                  type="submit"
                  disabled={projectSaving}
                  className="rounded-xl px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#0855a8] disabled:opacity-50 bg-[#0A66C2]"
                >
                  {projectSaving ? 'Posting…' : 'Post Project'}
                </button>
              </div>
            </form>

            {/* Recent projects mini-list */}
            {projects.length > 0 && (
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Recent Projects</p>
                <div className="space-y-2">
                  {projects.slice(0, 3).map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5">
                      <span className="text-sm font-medium text-gray-700">{p.title || 'Untitled'}</span>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                          {p.status}
                        </span>
                        <button
                          onClick={() => router.push(`/dashboard/business/${p.id}/applicants`)}
                          className="text-xs font-semibold text-[#0A66C2] transition hover:opacity-80"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── WIDGET 3: AI Matching / Top Vetted Talent (col 1–2, row 2) ── */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#111827]">Top Vetted Talent</h2>
                <p className="mt-0.5 text-sm text-gray-400">AI-matched to your active projects · Ranked by Skill Score</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-xl bg-[#0A66C2]/10 px-3 py-1.5 text-xs font-semibold text-[#0A66C2]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0A66C2] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0A66C2]" />
                </span>
                Live matching
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {MOCK_TALENT.map((talent, i) => (
                <div
                  key={talent.id}
                  className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-[#006B3F]/20 hover:bg-white"
                >
                  {/* Rank badge */}
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white"
                    style={{ background: i === 0 ? '#006B3F' : 'rgba(30,43,58,0.3)' }}
                  >
                    #{i + 1}
                  </div>

                  {/* Score ring */}
                  <ScoreRing score={talent.skillScore} />

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-gray-900">{talent.name}</p>
                      {/* University badge */}
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white bg-gray-50">
                        {talent.university}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">{talent.course}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {talent.skills.map((s) => (
                        <span key={s} className="rounded-md bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => setActiveTalent(talent)}
                    className="shrink-0 rounded-xl px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0855a8] bg-[#0A66C2]"
                  >
                    Review Assessment
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── WIDGET 4: Active Students + Hours (col 3, row 2) ── */}
          <div className="flex flex-col gap-4">

            {/* Hours counter */}
            <div
              className="rounded-2xl p-5 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0F1C2E 0%, #0d2540 100%)' }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Total Hours</p>
              <p className="mt-1 text-xs text-white/50">This Week</p>
              <p className="mt-2 text-5xl font-black tracking-tight text-[#0A66C2]">
                {totalHoursThisWeek}
                <span className="text-lg font-semibold text-white/40"> hrs</span>
              </p>
              <div className="mt-3 flex gap-4 text-xs text-white/50">
                <span>{ACTIVE_STUDENTS.length} students active</span>
                <span>·</span>
                <span>↑ 12% vs last week</span>
              </div>
            </div>

            {/* Active students list */}
            <div className="flex-1 rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-sm">
              <h2 className="text-sm font-bold text-[#111827]">Active Students</h2>
              <p className="mt-0.5 text-xs text-gray-400">Logged in this week</p>

              <div className="mt-4 space-y-3">
                {ACTIVE_STUDENTS.map((student) => (
                  <div key={student.name} className="rounded-xl border border-gray-100 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-800">{student.name}</p>
                        <p className="truncate text-xs text-gray-400">{student.project}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          student.status === 'on track'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {student.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="h-1 flex-1 rounded-full bg-gray-100">
                        <div
                          className="h-1 rounded-full"
                          style={{
                            width: `${Math.min(100, (student.hoursThisWeek / 20) * 100)}%`,
                            background: '#0A66C2',
                          }}
                        />
                      </div>
                      <span className="ml-2 text-xs font-bold text-[#111827]">
                        {student.hoursThisWeek}h
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-gray-100 pt-3 text-center">
                <span className="text-xs text-gray-400">
                  Avg.{' '}
                  <span className="font-bold text-[#111827]">
                    {(totalHoursThisWeek / ACTIVE_STUDENTS.length).toFixed(1)}h
                  </span>{' '}
                  per student
                </span>
              </div>
            </div>

          </div>

        </div>
      </DashboardShell>
    </>
  )
}

/* ── Shared form field ────────────────────────────────────────────── */
function FormField({
  label,
  value,
  onChange,
  type = 'text',
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  error?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full rounded-lg border px-4 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[#006B3F] ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </label>
  )
}
