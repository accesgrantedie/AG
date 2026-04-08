'use client'

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion'
import NeuralBackground from '@/components/NeuralBackground'
import { fadeUp } from '@/lib/animations'

export default function Hero() {
  const mouse = useRef({ x: 50, y: 50 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100

      document.documentElement.style.setProperty('--mouse-x', `${x}%`)
      document.documentElement.style.setProperty('--mouse-y', `${y}%`)
    }

    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 text-center">
      
      {/* 🌌 Background (bottom layer) */}
      <div className="absolute inset-0 bg-[#0B1220]" />

      {/* 🧠 Neural network */}
      <NeuralBackground />

      {/* ✨ Soft green glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(74,222,128,0.18),transparent_60%)]" />

      {/* 🌫️ Depth gradient (top fade) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1220]/30 to-[#0B1220]" />

      {/* 🔍 Blur layer (ONLY affects background) */}
      <div className="absolute inset-0 backdrop-blur-[1.5px]" />

      {/* 🎯 Focus mask (MOST IMPORTANT) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),transparent_15%,#0B1220_80%)]" />

      {/* 🧾 CONTENT */}
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
          className="mt-6 text-lg text-white/70"
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
          <button className="cursor-pointer rounded-xl bg-green-600 px-7 py-4 font-bold text-white transition hover:scale-105 active:scale-95">
            Join Waitlist →
          </button>

          {/* <button className="rounded-xl border border-white/20 px-7 py-4 font-bold text-white transition hover:bg-white/10">
            Hire a student →
          </button> */}
        </motion.div>
      </div>
    </section>
  )
}