import Link from 'next/link';
import { useState, useEffect } from 'react';
import { DARK, GREEN, AI_TYPING_TEXT } from '@/data/constants';

export default function AIMatching() {
  const [text, setText] = useState('')
  const fullText = AI_TYPING_TEXT;

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setText(fullText.slice(0, i))
      i++
      if (i > fullText.length) clearInterval(interval)
    }, 15)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="ai-matching" style={{ backgroundColor: DARK }} className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-green-400">
                AI-powered matching
              </p>
              <h2 className="mt-3 text-4xl font-black text-white">
                Stop guessing.<br />Start matching precisely.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/50">
                When an SME posts a project, our AI reads the requirements and builds a custom assessment for that exact brief.
                Students are tested. Only the top 3 get presented to the SME — assessed, ranked, and ready to start.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { icon: '🤖', text: 'AI generates bespoke assessments from SME project briefs' },
                  { icon: '📊', text: 'Students are ranked by verified skill performance — not self-reported CVs' },
                  { icon: '3️⃣', text: 'SMEs only review the top 3 matched candidates. Zero noise.' },
                  { icon: '⚡', text: 'From posting to matched shortlist in under 24 hours' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3 text-sm text-white/70">
                    <span className="text-lg">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth?tab=register&role=business"
                className="mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow transition hover:opacity-90"
                style={{ backgroundColor: GREEN }}
              >
                Post a project and get matched →
              </Link>
            </div>

            {/* AI visual */}
            <div className="space-y-3">
              {/* Project brief */}
              <div className="rounded-2xl border border-white/10 p-5" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/30">SME posts project</p>
                <p className="mt-2 text-sm text-white/80">{text}</p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center gap-3">
                <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${GREEN})` }} />
                <div className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: GREEN }}>
                  🤖 AI assessment generated
                </div>
                <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${GREEN})` }} />
              </div>

              {/* Top 3 matches */}
              <div className="rounded-2xl border border-white/10 p-5" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Top 3 matched students</p>
                <div className="space-y-2">
                  {[
                    { name: 'Aoife M.', uni: 'TCD', score: 94, badge: '🏆' },
                    { name: 'Ciarán B.', uni: 'UCD', score: 89, badge: '⭐' },
                    { name: 'Niamh K.', uni: 'DCU', score: 85, badge: '⭐' },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-2.5" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{s.badge}</span>
                        <div>
                          <p className="text-sm font-semibold text-white">{s.name}</p>
                          <p className="text-xs text-white/40">{s.uni} · CS Final Year</p>
                        </div>
                      </div>
                      <div className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: GREEN }}>
                        {s.score}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}