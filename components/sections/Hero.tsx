'use client'

import { motion } from 'framer-motion'
import NeuralBackground from '@/components/NeuralBackground'
import { fadeUp } from '@/lib/animations'

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 text-center">
      
      <div className="absolute inset-0 bg-[#0B1220]" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(74,222,128,0.15),transparent_60%)]" />

      <NeuralBackground />

      <div className="relative z-10 max-w-4xl">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.8 }}
          className="text-5xl font-black text-white sm:text-6xl lg:text-7xl"
        >
          Earn while you study.<br />
          <span className="text-green-400">Hire</span> who you’ll keep.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-white/60"
        >
          AI-matched, university-verified talent — from project to full-time.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <button className="rounded-xl bg-green-600 px-7 py-4 font-bold text-white">
            Find projects →
          </button>

          <button className="rounded-xl border border-white/20 px-7 py-4 font-bold text-white">
            Hire a student →
          </button>
        </motion.div>
      </div>
    </section>
  )
}