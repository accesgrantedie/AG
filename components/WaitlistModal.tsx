'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  open: boolean
  onClose: () => void
}

export default function WaitlistModal({ open, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<'student' | 'sme' | ''>('');
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const [count, setCount] = useState(0)

  useEffect(() => {
    const base = 120 + Math.floor(Math.random() * 80)
    setCount(base)
  }, [])

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (!validateEmail(email)) {
      e.preventDefault()
      setError('Please enter a valid email')
      return
    }

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 800)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B1220]/80 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.8)] backdrop-blur-xl">

              
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-400/10 via-transparent to-transparent" />

              
              <button
                onClick={onClose}
                className="absolute right-5 top-5 text-white/40 hover:text-white"
              >
                ✕
              </button>

              {!submitted ? (
                <>
                  
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">
                      Join the waitlist 🚀
                    </h2>

                    <p className="mt-2 text-white/60">
                      <span className="text-green-400 font-semibold">{count}+</span> people joined today
                    </p>
                  </div>

                  
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        role === 'student'
                          ? 'border-green-400 bg-green-400/10 text-green-400'
                          : 'border-white/10 text-white/60 hover:border-white/30'
                      }`}
                    >
                      🎓 Student
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('sme')}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        role === 'sme'
                          ? 'border-green-400 bg-green-400/10 text-green-400'
                          : 'border-white/10 text-white/60 hover:border-white/30'
                      }`}
                    >
                      🏢 SME
                    </button>
                  </div>

                  <form
                    className="mt-6 flex flex-col gap-4"
                    action="https://docs.google.com/forms/d/e/1FAIpQLScOmmUWGjzCRWu28lUh7S0LhUDyBywrOcYg2Clgp8yrE7wylA/formResponse"
                    method="POST"
                    target="hidden_iframe"
                    onSubmit={handleSubmit}
                  >
                    <input
                      name="entry.1318593735"
                      required
                      placeholder="Your name"
                      className="h-14 rounded-xl border border-white/10 bg-white/5 px-5 text-white placeholder-white/40 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30"
                    />

                    <input
                      name="entry.784974265"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError('')
                      }}
                      required
                      type="email"
                      placeholder="Your email"
                      className={`h-14 rounded-xl border px-5 text-white placeholder-white/40 outline-none transition
                        ${error ? 'border-red-400 focus:ring-red-400/30' : 'border-white/10 focus:border-green-400 focus:ring-green-400/30'}
                      bg-white/5`}
                    />

                    
                    <input
                      type="hidden"
                      name="entry.1178455872"
                      value={role}
                    />
                    {error && (
                      <p className="text-sm text-red-400 -mt-2">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={loading || !role}
                      className="relative mt-2 flex h-14 items-center justify-center gap-2 rounded-xl bg-green-600 text-base font-bold text-white transition hover:scale-[1.03] active:scale-95 disabled:opacity-50"
                    >
                      
                      <span className="absolute inset-0 rounded-xl bg-green-400 opacity-30 blur-xl animate-pulse" />

                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Joining...
                        </>
                      ) : (
                        'Join Waitlist →'
                      )}
                    </button>
                  </form>

                  <iframe name="hidden_iframe" style={{ display: 'none' }} />
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center py-12 text-center"
                >
                  <div className="text-5xl">🎉</div>

                  <h3 className="mt-4 text-2xl font-bold text-green-400">
                    You're in!
                  </h3>

                  <p className="mt-2 text-white/60">
                    We’ll notify you when we launch.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}