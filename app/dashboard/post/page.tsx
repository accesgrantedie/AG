'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Field } from '@/components/ui/Field'
import { FieldSelect } from '@/components/ui/FieldSelect'
import { SKILL_OPTIONS } from '@/lib/constants'
import { DashboardShell } from '@/components/DashboardShell'

type FormState = {
  title: string
  description: string
  required_skills: string[]
  budget: string
  project_type: 'fixed' | 'hourly'
  estimated_weeks: string
  deadline: string
}

export default function PostProjectPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('Company')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth'); return }
      supabase.from('profiles').select('full_name, company_name').eq('id', data.user.id).single()
        .then(({ data: p }) => {
          if (p?.company_name) setUserName(p.company_name)
          else if (p?.full_name) setUserName(p.full_name)
        })
    })
  }, [router])
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    required_skills: [],
    budget: '',
    project_type: 'fixed',
    estimated_weeks: '',
    deadline: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const toggleSkill = (skill: string) => {
    setField(
      'required_skills',
      form.required_skills.includes(skill)
        ? form.required_skills.filter((s) => s !== skill)
        : [...form.required_skills, skill]
    )
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.title.trim()) next.title = 'Project title is required.'
    if (!form.description.trim()) next.description = 'Description is required.'
    if (!form.required_skills.length) next.required_skills = 'Select at least one required skill.'
    if (!form.budget || Number(form.budget) <= 0) next.budget = 'Budget must be greater than €0.'
    setFormErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    setError(null)

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      router.push('/auth')
      return
    }

    const { error: insertError } = await supabase.from('projects').insert({
      owner_id: userData.user.id,
      title: form.title.trim(),
      description: form.description.trim(),
      required_skills: form.required_skills,
      budget: Number(form.budget),
      project_type: form.project_type,
      estimated_weeks: form.estimated_weeks ? Number(form.estimated_weeks) : null,
      expires_at: form.deadline || null,
      status: 'open',
    })

    if (insertError) {
      setError('Unable to post project. Please try again.')
      setSaving(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/dashboard/business'), 1500)
  }

  if (success) {
    return (
      <DashboardShell
        name={userName}
        role="business"
        title="Project posted!"
        subtitle="Students can now apply. Redirecting…"
      >
        <div className="rounded-2xl border-l-4 border-[#0A66C2] bg-white p-10 shadow-xl text-center max-w-md">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[#111827]">Project posted!</h2>
          <p className="mt-2 text-sm text-gray-600">Students can now apply. Redirecting…</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      name={userName}
      role="business"
      title="Post a new project"
      subtitle="Describe your project so the right students can apply."
      right={
        <button
          onClick={() => router.push('/dashboard/business')}
          className="rounded-lg border border-[#0A66C2] bg-white px-4 py-2 text-sm font-semibold text-[#0A66C2] shadow-sm transition hover:bg-blue-50"
        >
          Cancel
        </button>
      }
    >
      {error ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Field
            label="Project title"
            value={form.title}
            onChange={(v) => setField('title', v)}
            error={formErrors.title}
            placeholder="e.g. Build a React dashboard for our SaaS product"
          />

          <div>
            <label className="block">
              <span className="text-sm font-medium text-[#111827]">Project description</span>
              <textarea
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                rows={5}
                placeholder="Describe the project scope, deliverables, and any relevant context…"
                className={`mt-1 w-full resize-none rounded-lg border px-4 py-2 text-sm text-[#111827] shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#0A66C2] ${
                  formErrors.description ? 'border-red-300 focus:ring-red-400' : 'border-[#E8E9EB]'
                }`}
              />
            </label>
            {formErrors.description ? (
              <p className="mt-1 text-xs text-red-600">{formErrors.description}</p>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-medium text-[#111827]">Required skills</p>
            <p className="mt-1 text-xs text-gray-500">Select all that apply.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {SKILL_OPTIONS.map((skill) => {
                const selected = form.required_skills.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      selected
                        ? 'border-[#0A66C2] bg-[rgba(10,102,194,0.08)] text-[#0A66C2]'
                        : 'border-gray-200 bg-white text-[#111827] hover:border-[#0A66C2]/50'
                    }`}
                  >
                    {skill}
                  </button>
                )
              })}
            </div>
            {formErrors.required_skills ? (
              <p className="mt-1 text-xs text-red-600">{formErrors.required_skills}</p>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Budget (€)"
              type="number"
              value={form.budget}
              onChange={(v) => setField('budget', v)}
              error={formErrors.budget}
              placeholder="e.g. 500"
            />
            <FieldSelect
              label="Project type"
              value={form.project_type}
              options={['fixed', 'hourly']}
              onChange={(v) => setField('project_type', v as 'fixed' | 'hourly')}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Estimated duration (weeks)"
              type="number"
              value={form.estimated_weeks}
              onChange={(v) => setField('estimated_weeks', v)}
              placeholder="e.g. 4"
            />
            <div>
              <label className="block">
                <span className="text-sm font-medium text-[#111827]">
                  Application deadline (optional)
                </span>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setField('deadline', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#E8E9EB] px-4 py-2 text-sm text-[#111827] shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#0A66C2]"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-[#0A66C2] py-3 font-semibold text-white shadow-sm transition hover:bg-[#0855a8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Posting…' : 'Post project'}
          </button>
        </form>
      </div>

      <div className="pointer-events-none mt-4 flex justify-end">
        <span className="rounded-full bg-[#0A66C2] px-3 py-1 text-xs font-semibold text-white shadow-sm">
          🇮🇪 Proudly Irish
        </span>
      </div>
    </DashboardShell>
  )
}
