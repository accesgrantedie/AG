'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { SKILL_OPTIONS } from '@/lib/constants'
import { DashboardShell } from '@/components/DashboardShell'

type Project = {
  id: string
  title?: string
  description?: string
  status?: string
  budget?: number
  required_skills?: string[]
  project_type?: string
  estimated_weeks?: number
  expires_at?: string
  created_at?: string
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value)
}

export default function BrowseProjectsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set())
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState('Student')
  const [search, setSearch] = useState('')
  const [filterSkills, setFilterSkills] = useState<string[]>([])
  const [feedback, setFeedback] = useState<{ id: string; message: string } | null>(null)
  const now = useMemo(() => +new Date(), [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        router.push('/auth')
        return
      }
      setUserId(userData.user.id)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userData.user.id)
        .single()
      if (profileData?.full_name) setUserName(profileData.full_name)

      const [{ data: projectData }, { data: existingApps }] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .in('status', ['open', 'active'])
          .order('created_at', { ascending: false }),
        supabase
          .from('applications')
          .select('project_id')
          .eq('user_id', userData.user.id),
      ])

      setProjects((projectData as Project[]) || [])
      setAppliedIds(
        new Set((existingApps ?? []).map((a: { project_id: string }) => a.project_id))
      )
      setLoading(false)
    }

    load()
  }, [router])

  const handleApply = async (project: Project) => {
    if (!userId || !project.id) return
    setApplyingId(project.id)

    const { error } = await supabase.from('applications').insert({
      user_id: userId,
      project_id: project.id,
      project_name: project.title,
      status: 'active',
    })

    if (error) {
      setFeedback({ id: project.id, message: 'Unable to apply. Please try again.' })
    } else {
      setAppliedIds((prev) => new Set([...prev, project.id]))
      setFeedback({ id: project.id, message: 'Application sent!' })
    }

    setApplyingId(null)
    setTimeout(() => setFeedback(null), 3000)
  }

  const toggleFilterSkill = (skill: string) =>
    setFilterSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )

  const filtered = projects.filter((p) => {
    const matchesSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())

    const matchesSkills =
      filterSkills.length === 0 ||
      filterSkills.some((s) => p.required_skills?.includes(s))

    return matchesSearch && matchesSkills
  })

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-[#6B7280]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#0A66C2]" />
          Loading projects...
        </div>
      </div>
    )
  }

  return (
    <DashboardShell
      name={userName}
      role="student"
      title="Browse projects"
      subtitle="Find degree-relevant projects from Irish SMEs."
    >

        {/* Search & filter */}
        <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full rounded-lg border border-[#E8E9EB] px-4 py-2 text-sm text-[#111827] shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#0A66C2]"
          />

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Filter by skill
            </p>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((skill) => {
                const active = filterSkills.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleFilterSkill(skill)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                      active
                        ? 'border-[#0A66C2] bg-[#0A66C2] text-white'
                        : 'border-gray-200 bg-white text-[#111827] hover:border-[#0A66C2]/50'
                    }`}
                  >
                    {skill}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <p className="text-4xl">🔍</p>
            <p className="mt-4 text-lg font-semibold text-[#111827]">No projects found</p>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or skill filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((project) => {
              const alreadyApplied = appliedIds.has(project.id)
              const isApplying = applyingId === project.id
              const thisFeedback = feedback?.id === project.id ? feedback.message : null

              const daysLeft = project.expires_at
                ? Math.max(
                    0,
                    Math.ceil(
                      (new Date(project.expires_at).getTime() - now) /
                        (1000 * 60 * 60 * 24)
                    )
                  )
                : null

              return (
                <div key={project.id} className="rounded-2xl border bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold text-[#111827]">
                          {project.title || 'Untitled project'}
                        </h2>
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          {project.status}
                        </span>
                        {project.project_type ? (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 capitalize">
                            {project.project_type}
                          </span>
                        ) : null}
                      </div>

                      {project.description ? (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                          {project.description}
                        </p>
                      ) : null}

                      {project.required_skills?.length ? (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {project.required_skills.map((s) => (
                            <span
                              key={s}
                              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                                filterSkills.includes(s)
                                  ? 'border-[#0A66C2] bg-[rgba(10,102,194,0.08)] text-[#0A66C2]'
                                  : 'border-gray-200 bg-slate-50 text-slate-600'
                              }`}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                        {project.budget ? (
                          <span className="font-semibold text-[#111827]">
                            {formatCurrency(project.budget)}
                          </span>
                        ) : null}
                        {project.estimated_weeks ? (
                          <span>~{project.estimated_weeks} weeks</span>
                        ) : null}
                        {daysLeft != null ? (
                          <span className={daysLeft <= 3 ? 'font-semibold text-red-600' : ''}>
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Closing soon'}
                          </span>
                        ) : null}
                        {project.created_at ? (
                          <span>
                            Posted {new Date(project.created_at).toLocaleDateString('en-IE')}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      {thisFeedback ? (
                        <p
                          className={`text-xs font-medium ${
                            thisFeedback.includes('sent') ? 'text-[#0A66C2]' : 'text-red-600'
                          }`}
                        >
                          {thisFeedback}
                        </p>
                      ) : null}
                      <button
                        disabled={alreadyApplied || isApplying}
                        onClick={() => handleApply(project)}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition ${
                          alreadyApplied
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-[#0A66C2] text-white hover:bg-[#0855a8] disabled:opacity-60'
                        }`}
                      >
                        {alreadyApplied ? 'Applied' : isApplying ? 'Applying...' : 'Apply'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-gray-400">
          Showing {filtered.length} of {projects.length} open project
          {projects.length !== 1 ? 's' : ''}
        </p>
    </DashboardShell>
  )
}
