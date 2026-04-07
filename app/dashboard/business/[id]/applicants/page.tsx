'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { DashboardShell } from '@/components/DashboardShell'

type Applicant = {
  id: string
  user_id: string
  status: string
  created_at: string
  amount?: number
  profile?: {
    full_name?: string
    email?: string
  }
  student_profile?: {
    university?: string
    course_name?: string
    skills?: string[]
    hourly_rate?: number
    bio?: string
    github_url?: string
    linkedin_url?: string
    portfolio_url?: string
  }
}

type Project = {
  id: string
  title?: string
  status?: string
  budget?: number
  required_skills?: string[]
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-blue-100 text-blue-700',
  hired: 'bg-green-100 text-green-700',
  completed: 'bg-emerald-100 text-emerald-700',
  paid: 'bg-purple-100 text-purple-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function ApplicantsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)

      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        router.push('/auth')
        return
      }

      // Load project — verify ownership
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('owner_id', userData.user.id)
        .single()

      if (projectError || !projectData) {
        setError('Project not found or you do not have access.')
        setLoading(false)
        return
      }

      setProject(projectData as Project)

      // Load applications for this project
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (appsError) {
        setError('Unable to load applicants.')
        setLoading(false)
        return
      }

      const appList = (apps as Applicant[]) || []

      // Enrich with profile data for each applicant
      const enriched = await Promise.all(
        appList.map(async (app) => {
          const [{ data: profile }, { data: studentProfile }] = await Promise.all([
            supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', app.user_id)
              .single(),
            supabase
              .from('student_profiles')
              .select('university, course_name, skills, hourly_rate, bio, github_url, linkedin_url, portfolio_url')
              .eq('user_id', app.user_id)
              .single(),
          ])
          return {
            ...app,
            profile: profile ?? undefined,
            student_profile: studentProfile ?? undefined,
          }
        })
      )

      setApplicants(enriched)
      setLoading(false)
    }

    load()
  }, [projectId, router])

  const updateStatus = async (applicationId: string, newStatus: string) => {
    setUpdatingId(applicationId)
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', applicationId)

    if (!error) {
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
      )
    }
    setUpdatingId(null)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-[#6B7280]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#0A66C2]" />
          Loading applicants…
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <DashboardShell
        name="Business"
        role="business"
        title="Oops!"
        subtitle="We couldn’t load applicants right now."
        right={
          <button
            onClick={() => router.push('/dashboard/business')}
            className="rounded-lg border border-[#0A66C2] bg-white px-4 py-2 text-sm font-semibold text-[#0A66C2] shadow-sm transition hover:bg-blue-50"
          >
            Back to dashboard
          </button>
        }
      >
        <div className="rounded-2xl border-l-4 border-[#0A66C2] bg-white p-8 shadow">
          <h1 className="text-2xl font-semibold">Ah now...</h1>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      name="Business"
      role="business"
      title={project?.title ?? 'Applicants'}
      subtitle="Manage applications for this project."
      right={
        <button
          onClick={() => router.push('/dashboard/business')}
          className="rounded-lg border border-[#0A66C2] bg-white px-4 py-2 text-sm font-semibold text-[#0A66C2] shadow-sm transition hover:bg-blue-50"
        >
          ← Back
        </button>
      }
    >
      <div className="mx-auto max-w-4xl px-4 py-10">
        {applicants.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <p className="text-4xl">📭</p>
            <p className="mt-4 text-lg font-semibold text-[#111827]">No applicants yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Students who apply to this project will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((applicant) => (
              <div key={applicant.id} className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(10,102,194,0.08)] text-lg font-bold text-[#0A66C2]">
                        {applicant.profile?.full_name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-[#111827]">
                          {applicant.profile?.full_name ?? 'Unknown student'}
                        </p>
                        {applicant.student_profile?.university ? (
                          <p className="text-xs text-gray-500">
                            {applicant.student_profile.university}
                            {applicant.student_profile.course_name
                              ? ` — ${applicant.student_profile.course_name}`
                              : ''}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {applicant.student_profile?.bio ? (
                      <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                        {applicant.student_profile.bio}
                      </p>
                    ) : null}

                    {applicant.student_profile?.skills?.length ? (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {applicant.student_profile.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                      {applicant.student_profile?.hourly_rate ? (
                        <span>
                          €{applicant.student_profile.hourly_rate.toFixed(2)}/hr
                        </span>
                      ) : null}
                      {applicant.student_profile?.github_url ? (
                        <a
                          href={applicant.student_profile.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0A66C2] hover:underline"
                        >
                          GitHub
                        </a>
                      ) : null}
                      {applicant.student_profile?.linkedin_url ? (
                        <a
                          href={applicant.student_profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0A66C2] hover:underline"
                        >
                          LinkedIn
                        </a>
                      ) : null}
                      {applicant.student_profile?.portfolio_url ? (
                        <a
                          href={applicant.student_profile.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0A66C2] hover:underline"
                        >
                          Portfolio
                        </a>
                      ) : null}
                      <span>
                        Applied {new Date(applicant.created_at).toLocaleDateString('en-IE')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        STATUS_COLORS[applicant.status] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {applicant.status}
                    </span>

                    <div className="flex gap-2">
                      {applicant.status !== 'hired' && applicant.status !== 'rejected' ? (
                        <>
                          <button
                            disabled={updatingId === applicant.id}
                            onClick={() => updateStatus(applicant.id, 'hired')}
                            className="rounded-lg bg-[#0A66C2] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0855a8] disabled:opacity-50"
                          >
                            Hire
                          </button>
                          <button
                            disabled={updatingId === applicant.id}
                            onClick={() => updateStatus(applicant.id, 'rejected')}
                            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
