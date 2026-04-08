'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  open: boolean
  onClose: () => void
}

export default function WaitlistModal({ open, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* MODAL */}
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#0B1220]/90 p-6 shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
          >
            {/* CLOSE */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white/50 hover:text-white"
            >
              ✕
            </button>

            {!submitted ? (
              <>
                {/* HEADER */}
                <h2 className="text-2xl font-bold text-white">
                  Join the waitlist 🚀
                </h2>

                <p className="mt-2 text-sm text-white/60">
                  Be the first to access AI-matched student talent.
                </p>

                {/* FORM */}
                <form
                  className="mt-6 flex flex-col gap-4"
                  action="https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse"
                  method="POST"
                  target="hidden_iframe"
                  onSubmit={() => setSubmitted(true)}
                >
                  {/* NAME */}
                  <input
                    name="entry.123456789"
                    required
                    placeholder="Your name"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-green-400"
                  />

                  {/* EMAIL */}
                  <input
                    name="entry.987654321"
                    required
                    type="email"
                    placeholder="Your email"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-green-400"
                  />

                  {/* ROLE */}
                  <select
                    name="entry.111111111"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-green-400"
                  >
                    <option value="">I am a...</option>
                    <option value="Student">Student</option>
                    <option value="Company">Company</option>
                  </select>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    className="mt-2 rounded-xl bg-green-600 py-3 font-bold text-white transition hover:scale-105 active:scale-95"
                  >
                    Join Waitlist →
                  </button>
                </form>

                <iframe name="hidden_iframe" style={{ display: 'none' }} />
              </>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-xl font-bold text-green-400">
                  You're in! 🎉
                </h3>
                <p className="mt-2 text-white/60">
                  We'll notify you when we launch.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}