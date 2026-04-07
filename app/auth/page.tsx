'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Mode = 'login' | 'register'
type Feedback = { type: 'success' | 'error'; text: string } | null
type LoginMethod = 'password' | 'magic'
type Role = 'student' | 'business' | 'university'

type ProfileRecord = {
  id: string
  email: string
  full_name: string
  role: Role
  company_name?: string
  institution_name?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getPasswordStrength(password: string) {
  const lengthScore = Math.min(4, Math.floor(password.length / 4))
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSymbol = /[^A-Za-z0-9]/.test(password)
  const complexity = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length
  const score = Math.min(4, lengthScore + complexity)
  if (!password) return { label: 'Too short', score: 0 }
  if (score <= 2) return { label: 'Weak', score }
  if (score === 3) return { label: 'Medium', score }
  return { label: 'Strong', score }
}

function validateEmail(email: string) {
  if (!email) return 'Email is required'
  if (!emailRegex.test(email)) return "That doesn't look like an email"
  return null
}

/* ── Role panel content ─────────────────────────────────────────── */
const ROLE_CONTENT: Record<Role, {
  badge: string
  headline: string
  sub: string
  bullets: { icon: string; text: string }[]
  stats: { value: string; label: string }[]
}> = {
  student: {
    badge: "Ireland's only CS student platform",
    headline: 'Your career starts\nhere.',
    sub: 'Paid projects. Verified badges. A direct pipeline to full-time employment in Ireland.',
    bullets: [
      { icon: '🎓', text: 'University-verified student profiles' },
      { icon: '💰', text: '0% commission — keep every cent you earn' },
      { icon: '🏆', text: 'Earn badges that unlock higher pay tiers' },
      { icon: '🏢', text: '10+ badges → permanent role referrals' },
    ],
    stats: [
      { value: '0%', label: 'commission' },
      { value: '€25+', label: 'top hourly rate' },
      { value: '12+', label: 'universities' },
    ],
  },
  business: {
    badge: 'Hire verified Irish CS talent',
    headline: 'Top student talent,\nno agency fees.',
    sub: 'Post projects in minutes. Get matched with AI-assessed students ready to deliver.',
    bullets: [
      { icon: '📋', text: 'Post projects in under 5 minutes' },
      { icon: '🤖', text: 'AI-matched, skills-assessed candidates' },
      { icon: '💸', text: 'No agency markup — pay talent directly' },
      { icon: '⭐', text: 'Build a pipeline of proven junior hires' },
    ],
    stats: [
      { value: '3', label: 'top matches' },
      { value: '€0', label: 'agency fees' },
      { value: '48h', label: 'avg. match time' },
    ],
  },
  university: {
    badge: 'University partner programme',
    headline: 'Connect students\nto real work.',
    sub: 'Give your students paid, degree-relevant industry projects and track their progress.',
    bullets: [
      { icon: '🏫', text: 'Verified enrolment for your students' },
      { icon: '📊', text: 'Dashboard to track student activity' },
      { icon: '🎖️', text: 'Co-brand placement reports & transcripts' },
      { icon: '🤝', text: 'Direct SME partnerships for your faculty' },
    ],
    stats: [
      { value: '12+', label: 'partners' },
      { value: '100%', label: 'verified' },
      { value: '4★', label: 'avg. SME rating' },
    ],
  },
}

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [companyName, setCompanyName] = useState('')
  const [institutionName, setInstitutionName] = useState('')
  const [department, setDepartment] = useState('')

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])
  const panelContent = ROLE_CONTENT[role]

  useEffect(() => {
    if (!feedback) return
    const timer = setTimeout(() => setFeedback(null), 5000)
    return () => clearTimeout(timer)
  }, [feedback])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab') || window.location.hash.replace('#', '')
    if (tab === 'register' || tab === 'login') {
      setMode(tab)
      if (tab === 'login') setLoginMethod('password')
    }
    const roleParam = params.get('role')
    if (roleParam === 'student' || roleParam === 'business' || roleParam === 'university') {
      setRole(roleParam)
      setMode('register')
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    url.searchParams.set('tab', mode)
    url.hash = ''
    router.replace(url.toString(), { scroll: false })
  }, [mode, router])

  const showError = (text: string) => setFeedback({ type: 'error', text })
  const showSuccess = (text: string) => setFeedback({ type: 'success', text })
  const setFieldTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }))

  const validateRegister = () => {
    const nextErrors: Partial<Record<string, string>> = {}
    if (!fullName || fullName.trim().length < 2)
      nextErrors.fullName = 'Full name must be at least 2 characters'
    const emailError = validateEmail(email)
    if (emailError) nextErrors.email = emailError
    if (!password) nextErrors.password = 'Password is required'
    else if (passwordStrength.score <= 1) nextErrors.password = 'Password is too weak'
    if (role === 'business' && !companyName.trim())
      nextErrors.companyName = 'Company name is required'
    if (role === 'university' && !institutionName.trim())
      nextErrors.institutionName = 'Institution name is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const validateLogin = () => {
    const nextErrors: Partial<Record<string, string>> = {}
    const emailError = validateEmail(email)
    if (emailError) nextErrors.email = emailError
    if (loginMethod === 'password' && !password)
      nextErrors.password = 'Password is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    setFeedback(null)
    setLoading(false)
    setErrors({})
    setTouched({})
    setLoginMethod('password')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)
    if (!validateLogin()) { setLoading(false); return }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) showError(error.message)
      else router.push('/dashboard')
    } catch (err: unknown) {
      console.error('Unexpected login error:', err)
      showError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    setLoading(true)
    setFeedback(null)
    if (!validateLogin()) { setLoading(false); return }
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      })
      if (error) showError(error.message)
      else showSuccess('Grand! Check your email for your magic link')
    } catch (err: unknown) {
      console.error('Unexpected magic link error:', err)
      showError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)
    if (!validateRegister()) { setLoading(false); return }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } },
      })
      if (error) { showError(error.message); setLoading(false); return }

      const userId = data?.user?.id
      if (userId) {
        const profileData: ProfileRecord = { id: userId, email, full_name: fullName, role }
        if (role === 'business' && companyName) profileData.company_name = companyName
        if (role === 'university' && institutionName) profileData.institution_name = institutionName

        try {
          const { error: profileError } = await supabase.from('profiles').insert(profileData)
          if (profileError) {
            console.error('Base profile creation error:', profileError)
          } else {
            if (role === 'student') {
              const { error: e } = await supabase.from('student_profiles').insert({ user_id: userId })
              if (e) console.error('Student profile error:', e)
            }
            if (role === 'business') {
              const { error: e } = await supabase.from('business_profiles').insert({
                user_id: userId,
                company_name: companyName || 'Company Name Pending',
              })
              if (e) console.error('Business profile error:', e)
            }
            if (role === 'university') {
              const { error: e } = await supabase.from('university_profiles').insert({
                user_id: userId,
                institution_name: institutionName || 'Institution Pending',
                department: department || null,
              })
              if (e) console.error('University profile error:', e)
            }
          }
        } catch (err) {
          console.error('Profile creation error:', err)
        }

        showSuccess('Check your email to verify your account')
        setTimeout(() => {
          switchMode('login')
          router.push('/auth?tab=login')
        }, 2000)
      }
    } catch (err: unknown) {
      console.error('Unexpected registration error:', err)
      showError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderValidationMessage = (field: string) => {
    if (!touched[field] || !errors[field]) return null
    return <p className="mt-1 text-xs text-red-600">{errors[field]}</p>
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ background: 'linear-gradient(160deg, #0F1C2E 0%, #0d2540 60%, #0a3020 100%)' }}
    >
      {/* Dot-grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* ── LEFT PANEL (desktop only) ── */}
      <div className="relative hidden w-[46%] flex-col justify-between p-12 lg:flex">
        <Link href="/" className="text-2xl font-black text-white">
          access<span className="text-[#006B3F]">.ie</span>
        </Link>

        <div>
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300"
            style={{ borderColor: 'rgba(74,222,128,0.3)', color: '#4ADE80', backgroundColor: 'rgba(0,107,63,0.15)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            {panelContent.badge}
          </div>

          <h2 className="text-4xl font-black leading-tight text-white whitespace-pre-line transition-all duration-300">
            {panelContent.headline.split('\n')[0]}<br />
            <span style={{ color: '#4ADE80' }}>{panelContent.headline.split('\n')[1]}</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/50">{panelContent.sub}</p>

          <ul className="mt-8 space-y-4">
            {panelContent.bullets.map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-sm text-white/70">
                <span className="text-lg">{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex gap-6 text-center">
            {panelContent.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/20">© {new Date().getFullYear()} access.ie 🇮🇪</p>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="relative w-full max-w-lg">
          {/* Mobile-only logo */}
          <div className="mb-6 text-center lg:hidden">
            <Link href="/" className="text-2xl font-black text-white">
              access<span className="text-[#006B3F]">.ie</span>
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#1E2B3A]">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {mode === 'login'
                    ? role === 'student'
                      ? 'Log in to find projects & track earnings.'
                      : role === 'business'
                      ? 'Log in to manage projects & talent.'
                      : 'Log in to your university portal.'
                    : "Join Ireland's student-freelance community"}
                </p>
              </div>
              <div className="flex self-start rounded-xl border border-[#E8E9EB] bg-gray-50 p-1">
                <TabButton active={mode === 'login'} onClick={() => switchMode('login')} label="Log in" />
                <TabButton active={mode === 'register'} onClick={() => switchMode('register')} label="Register" />
              </div>
            </div>

            {feedback && <FeedbackBanner feedback={feedback} onClose={() => setFeedback(null)} />}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="mt-6 space-y-6">
                {/* Role context picker — updates left panel, not used for auth logic */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">I am a…</p>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: 'student', label: 'Student', icon: '🎓' },
                      { value: 'business', label: 'SME', icon: '💼' },
                      { value: 'university', label: 'University', icon: '🏫' },
                    ] as { value: Role; label: string; icon: string }[]).map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#006B3F] ${
                          role === r.value
                            ? 'border-[#006B3F] bg-[rgba(0,107,63,0.07)] text-[#006B3F]'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-[#006B3F]/40'
                        }`}
                      >
                        <span>{r.icon}</span>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Field
                    label="Email"
                    value={email}
                    onChange={(value) => {
                      setEmail(value)
                      setErrors((prev) => ({ ...prev, email: validateEmail(value) ?? undefined }))
                    }}
                    onBlur={() => setFieldTouched('email')}
                    type="email"
                  />
                  {renderValidationMessage('email')}

                  {loginMethod === 'password' && (
                    <>
                      <Field
                        label="Password"
                        value={password}
                        onChange={(value) => {
                          setPassword(value)
                          setErrors((prev) => ({
                            ...prev,
                            password: value ? undefined : 'Password is required',
                          }))
                        }}
                        onBlur={() => setFieldTouched('password')}
                        type="password"
                      />
                      {renderValidationMessage('password')}
                    </>
                  )}
                </div>

                {loginMethod === 'password' ? (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <button
                        type="button"
                        onClick={() => router.push('/auth/forgot')}
                        className="text-[#006B3F] hover:underline"
                      >
                        Forgot password?
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginMethod('magic')
                          setPassword('')
                          setErrors({})
                          setTouched({})
                        }}
                        className="text-[#006B3F] hover:underline"
                      >
                        Send magic link instead
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-[#006B3F] py-3 font-semibold text-white shadow-sm transition hover:bg-[#004d2e] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? 'Logging in…' : 'Log in'}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">
                      Enter your email and we&apos;ll send a link to sign in instantly.
                    </p>
                    <button
                      type="button"
                      onClick={handleMagicLink}
                      disabled={loading}
                      className="w-full rounded-lg bg-[#006B3F] py-3 font-semibold text-white shadow-sm transition hover:bg-[#004d2e] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? 'Sending…' : 'Send magic link'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod('password')
                        setFeedback(null)
                        setErrors({})
                        setTouched({})
                      }}
                      className="text-sm text-[#006B3F] hover:underline"
                    >
                      Use password instead
                    </button>
                  </>
                )}
              </form>
            ) : (
              <form onSubmit={handleRegister} className="mt-6 space-y-5">
                {/* Role selector — 3 cards */}
                <div className="grid gap-3 md:grid-cols-3">
                  <SelectCard
                    selected={role === 'student'}
                    onSelect={() => setRole('student')}
                    title="Student"
                    description="Find projects, build your portfolio"
                    icon="🎓"
                  />
                  <SelectCard
                    selected={role === 'business'}
                    onSelect={() => setRole('business')}
                    title="SME"
                    description="Post projects, find talent"
                    icon="💼"
                  />
                  <SelectCard
                    selected={role === 'university'}
                    onSelect={() => setRole('university')}
                    title="University"
                    description="Partner & track students"
                    icon="🏫"
                  />
                </div>

                <div className="space-y-4">
                  <Field
                    label="Full name"
                    value={fullName}
                    onChange={(value) => {
                      setFullName(value)
                      setErrors((prev) => ({
                        ...prev,
                        fullName: value.trim().length >= 2 ? undefined : 'Full name must be at least 2 characters',
                      }))
                    }}
                    onBlur={() => setFieldTouched('fullName')}
                  />
                  {renderValidationMessage('fullName')}

                  <Field
                    label="Email"
                    value={email}
                    onChange={(value) => {
                      setEmail(value)
                      setErrors((prev) => ({ ...prev, email: validateEmail(value) ?? undefined }))
                    }}
                    onBlur={() => setFieldTouched('email')}
                    type="email"
                  />
                  {renderValidationMessage('email')}

                  <Field
                    label="Password"
                    value={password}
                    onChange={(value) => {
                      setPassword(value)
                      const strength = getPasswordStrength(value)
                      setErrors((prev) => ({
                        ...prev,
                        password: value && strength.score > 1 ? undefined : 'Password is too weak',
                      }))
                    }}
                    onBlur={() => setFieldTouched('password')}
                    type="password"
                  />
                  {renderValidationMessage('password')}
                  {password && (
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Password strength: {passwordStrength.label}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((step) => (
                          <span
                            key={step}
                            className={`h-1.5 w-6 rounded-full ${
                              step <= passwordStrength.score ? 'bg-[#006B3F]' : 'bg-[#E5E7EB]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Role-specific fields */}
                  {role === 'business' && (
                    <>
                      <Field
                        label="Company name"
                        value={companyName}
                        onChange={(value) => {
                          setCompanyName(value)
                          setErrors((prev) => ({
                            ...prev,
                            companyName: value.trim() ? undefined : 'Company name is required',
                          }))
                        }}
                        onBlur={() => setFieldTouched('companyName')}
                      />
                      {renderValidationMessage('companyName')}
                    </>
                  )}

                  {role === 'university' && (
                    <>
                      <Field
                        label="Institution name"
                        value={institutionName}
                        onChange={(value) => {
                          setInstitutionName(value)
                          setErrors((prev) => ({
                            ...prev,
                            institutionName: value.trim() ? undefined : 'Institution name is required',
                          }))
                        }}
                        onBlur={() => setFieldTouched('institutionName')}
                      />
                      {renderValidationMessage('institutionName')}

                      <Field
                        label="Department (optional)"
                        value={department}
                        onChange={setDepartment}
                      />
                    </>
                  )}
                </div>

                <div className="flex items-center justify-center text-sm text-gray-400">
                  <span className="h-px w-16 bg-gray-200" />
                  <span className="mx-3">☘️</span>
                  <span className="h-px w-16 bg-gray-200" />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#006B3F] py-3 font-semibold text-white shadow-sm transition hover:bg-[#004d2e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-[#1E2B3A]">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button type="button" onClick={() => switchMode('register')} className="text-[#006B3F] hover:underline">
                    Create account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button type="button" onClick={() => switchMode('login')} className="text-[#006B3F] hover:underline">
                    Log in
                  </button>
                </>
              )}
            </p>

            <div className="pointer-events-none mt-6 flex justify-center">
              <span className="rounded-full bg-[#B78A3B] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                🇮🇪 Proudly Irish
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#006B3F] ${
        active ? 'bg-[#006B3F] text-white' : 'bg-white text-[#1E2B3A] hover:bg-[#F5F2E9]'
      }`}
    >
      {label}
    </button>
  )
}

function FeedbackBanner({
  feedback,
  onClose,
}: {
  feedback: Exclude<Feedback, null>
  onClose: () => void
}) {
  return (
    <div
      className={`mt-6 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
        feedback.type === 'success'
          ? 'border-[#C6F0D6] bg-[rgba(0,107,63,0.12)] text-[#006B3F]'
          : 'border-[#F9D0B9] bg-[rgba(183,138,59,0.12)] text-[#1E2B3A]'
      }`}
    >
      <span className="text-lg leading-none">☘️</span>
      <p className="flex-1 leading-relaxed">
        <span className="font-semibold">
          {feedback.type === 'success' ? 'Grand job!' : 'Ah now,'}
        </span>{' '}
        {feedback.text}
      </p>
      <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
        ×
      </button>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  type?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#1E2B3A]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="mt-1 w-full rounded-lg border border-[#E8E9EB] bg-white px-4 py-2 text-sm text-[#1E2B3A] shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#006B3F]"
        required={!label.includes('optional')}
      />
    </label>
  )
}

function SelectCard({
  selected,
  onSelect,
  title,
  description,
  icon,
}: {
  selected: boolean
  onSelect: () => void
  title: string
  description: string
  icon: string
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-[#006B3F] ${
        selected
          ? 'border-2 border-[#006B3F] bg-[rgba(0,107,63,0.06)]'
          : 'border border-gray-200 bg-white hover:border-[#006B3F]/30'
      }`}
    >
      <div className="text-2xl">{icon}</div>
      <p className="text-sm font-semibold text-[#1E2B3A]">{title}</p>
      <p className="text-xs text-gray-500 leading-snug">{description}</p>
    </button>
  )
}
