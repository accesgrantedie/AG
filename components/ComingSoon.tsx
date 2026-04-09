"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import MorphText from "./MorphText";
import FluidBackground from "./FluidBackground";

export default function ComingSoon() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  // const [count, setCount] = useState(132);

  const [particles, setParticles] = useState<
    { x: number; y: number; duration: number }[]
  >([]);

  useEffect(() => {
    const generated = [...Array(40)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 20 + Math.random() * 10,
    }));
    setParticles(generated);
  }, []);

  // Cursor tracking
  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#0B1220] text-white overflow-hidden">
      <FluidBackground />

      {/* Cursor Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: `radial-gradient(600px at ${mouse.x}px ${mouse.y}px, rgba(74,222,128,0.15), transparent 80%)`,
        }}
      />

      
      {/* Content */}
      <div className="relative z-40 flex items-center min-h-screen px-6 md:px-20">
        <div className="max-w-4xl">

          {/* Status */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs tracking-[0.3em] text-gray-400 mb-6"
          >
            • PRIVATE ACCESS OPENING SOON - <span className="text-green-400 glow">TRL6 IRELAND 2026</span>
          </motion.p>

          {/* Headline */}
          {/* <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 }
              }
            }}
            className="text-5xl md:text-7xl font-semibold leading-[1.1]"
          >
            {[
              "you were never the problem.",
              "your system was."
            ].map((line, i) => (
              <motion.h1
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.8 }}
                className={i === 1 ? "text-white" : "text-gray-400"}
              >
                {i === 0 && <span className="text-green-400">&lt;</span>}
                {line}
                {i === 1 && <span className="text-green-400">&gt;</span>}
              </motion.h1>
            ))}
          </motion.div> */}
          <MorphText />

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-10 text-lg text-gray-400 max-w-xl"
          >
            real work, real outcomes — matched before the first click.
          </motion.p>

          {/* CTA */}
          {/* <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-10"
          >
            <button className="group relative px-6 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md overflow-hidden">

              
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-green-400/20 to-transparent blur-xl" />

              <span className="relative z-10">
                Request early access
              </span>
            </button>

            
            <p className="mt-3 text-sm text-gray-500">
              {count}+ people requested access today
            </p>
          </motion.div>  */}
        </div>
      </div>

      {/* Floating Particles (lightweight) */}
      <div className="absolute inset-0 z-20">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/30 rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              x: ["0%", "20%", "-10%", "0%"],
              y: ["0%", "30%", "-20%", "0%"],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

    </main>
  );
}