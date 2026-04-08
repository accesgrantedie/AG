import Link from 'next/link';
import { GREEN } from '@/data/constants';

export default function GradStart() {
  return (
    <section id="gradstart" style={{ backgroundColor: GREEN }} className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                For Irish SMEs
              </p>
              <h2 className="mt-3 text-4xl font-black text-white">
                Hire a student now.<br />Let the government help pay later.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/70">
                GradStart is an Irish Government scheme that subsidises graduate salaries for eligible SMEs.
                When your accessgranted.ie student is ready to go full-time, we guide you through the GradStart application —
                so your next key hire costs significantly less.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Trial a student as a freelancer with zero commitment',
                  'When they\'re ready, convert to a full-time hire',
                  'We help you apply for GradStart wage support',
                  'Reduce your graduate salary cost from day one',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-white/80">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-green-900 bg-white">
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth?tab=register&role=business"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold shadow transition hover:opacity-90"
                style={{ color: GREEN }}
              >
                Find out if you qualify →
              </Link>
            </div>

            {/* GradStart visual */}
            <div className="rounded-2xl bg-white/10 p-8 backdrop-blur">
              <h3 className="text-lg font-black text-white">The accessgranted.ie → GradStart pathway</h3>
              <div className="mt-6 space-y-4">
                {[
                  { step: '1', label: 'Post a project on accessgranted.ie', sub: 'Match with a verified CS student. Start in hours.' },
                  { step: '2', label: 'Run a paid trial project', sub: 'Low-risk. No commitment. See if they\'re a fit.' },
                  { step: '3', label: 'Convert to full-time employment', sub: 'They graduate. You offer them the role.' },
                  { step: '4', label: 'Apply for GradStart support', sub: 'We guide you through the government funding application.' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black" style={{ color: GREEN }}>
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.label}</p>
                      <p className="text-xs text-white/60">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}