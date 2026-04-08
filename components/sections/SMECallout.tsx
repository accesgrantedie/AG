import Link from 'next/link';
import { DARK, GREEN } from '@/data/constants';

export default function SMECallout() {
  return (
    <section
        className="px-4 py-24"
        style={{
          background: `linear-gradient(135deg, ${DARK} 0%, #0d2540 100%)`,
        }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-green-400">
                For Irish SMEs
              </p>
              <h2 className="mt-3 text-4xl font-black text-white">
                Stop overpaying agencies.<br />Start hiring smart.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/50">
                Get AI-matched, degree-level CS talent at transparent rates — from €12.70/hr.
                No bidding wars, no hidden fees, no chasing invoices.
                Every student is university-enrolled, AI-assessed, and ready to work.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/auth?tab=register&role=business"
                  className="rounded-xl px-7 py-3.5 text-center text-sm font-bold text-white shadow transition hover:opacity-90"
                  style={{ backgroundColor: GREEN }}
                >
                  Post a project free →
                </Link>
                <a
                  href="#how-it-works"
                  className="rounded-xl border border-white/20 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  See how it works
                </a>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🤖', title: 'AI-matched talent', body: 'Our AI builds a custom assessment from your brief and delivers the top 3 students. No guesswork.' },
                { icon: '⚡', title: 'Hire in hours', body: 'Matched and assessed profiles on your dashboard. Review, accept, and kick off within 24 hours.' },
                { icon: '🔒', title: 'Transparent rates', body: 'No surprise agency markups. €12.70–€25/hr. You see the rate, you pay the rate.' },
                { icon: '🏛️', title: 'GradStart support', body: 'We help you access Irish Government funding when you convert your student to a full-time hire.' },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-white/10 p-5 backdrop-blur"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                >
                  <div className="text-2xl">{card.icon}</div>
                  <h3 className="mt-3 text-sm font-bold text-white">{card.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/40">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
  )
}