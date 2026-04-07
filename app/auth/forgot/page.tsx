'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!feedback) return

    const timer = setTimeout(() => setFeedback(null), 5000)
    return () => clearTimeout(timer)
  }, [feedback])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/login`,
      })

      if (error) {
        setFeedback({ type: 'error', text: error.message })
      } else {
        setFeedback({ type: 'success', text: 'Check your inbox for reset instructions' })
      }
    } catch (err: unknown) {
      console.error('Unexpected password reset error:', err)
      setFeedback({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-[#F5F2E9] flex items-center justify-center px-4 py-10"
      style={{
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2760%27 height=%2760%27 viewBox=%270 0 64 64%27%3E%3Cpath fill=%27rgba(0,107,63,0.05)%27 d=%27M32 14c-3.3 0-6 2.7-6 6 0 1.2.4 2.3 1.1 3.2-1.1 1.1-2.1 2.3-2.9 3.6-2.2-1.4-5-1.3-7.1.3-2.2 1.7-2.5 4.9-.8 7.1 1.4 2.2 4.2 2.4 6.2.5 1.5 1.4 3.2 2.5 5.1 3.2-.3 2.7 1.7 5.2 4.3 5.5 3.1.4 5.8-2 5.8-5.1 0-1.5-.7-2.8-1.8-3.7 1.2-1.5 2.1-3.3 2.5-5.3 2.4-.5 4.1-2.8 3.6-5.2-.4-2.1-2.3-3.6-4.4-3.6-1.7 0-3.2 1-3.9 2.5-.8-.4-1.6-.6-2.5-.6z%27/%3E%3C/svg%3E")',
        backgroundRepeat: 'repeat',
        backgroundSize: '160px',
      }}
    >
      <div className="relative w-full max-w-lg">
        <div className="rounded-2xl border-l-4 border-[#006B3F] bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-[#1E2B3A]">Forgot your password?</h1>
          <p className="mt-2 text-sm text-gray-600">Enter your email and we’ll send reset instructions.</p>

          {feedback && (
            <div
              className={`mt-6 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
                feedback.type === 'success'
                  ? 'border-[#C6F0D6] bg-[rgba(0,107,63,0.12)] text-[#006B3F]'
                  : 'border-[#F9D0B9] bg-[rgba(183,138,59,0.12)] text-[#1E2B3A]'
              }`}
            >
              <span className="text-lg leading-none">☘️</span>
              <p className="leading-relaxed flex-1">
                <span className="font-semibold">
                  {feedback.type === 'success' ? 'Grand job!' : 'Ah now,'}
                </span>{' '}
                {feedback.text}
              </p>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <label className="block">
              <span className="text-sm font-medium text-[#1E2B3A]">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E8E9EB] bg-white px-4 py-2 text-sm text-[#1E2B3A] shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#006B3F]"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#006B3F] py-3 font-semibold text-white shadow-sm transition hover:bg-[#004d2e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Sending…' : 'Send reset email'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#1E2B3A]">
            Remembered your password?{' '}
            <button
              type="button"
              onClick={() => router.push('/auth')}
              className="text-[#006B3F] hover:underline"
            >
              Log in
            </button>
          </p>

          <div className="pointer-events-none absolute bottom-5 right-5 rounded-full bg-[#B78A3B] px-3 py-1 text-xs font-semibold text-white shadow-sm">
            🇮🇪 Proudly Irish
          </div>
        </div>
      </div>
    </div>
  )
}
