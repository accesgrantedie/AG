import Link from 'next/link';
import { CREAM, GREEN, BADGES_PREVIEW } from '@/data/constants';

export default function BadgeSystem() {
  return (
    <section style={{ backgroundColor: CREAM }} className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: GREEN }}>
                Verified portfolio
              </p>
              <h2 className="mt-3 text-4xl font-black text-[#0F1C2E]">
                Badges. Credits. LinkedIn.<br />All from real work.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Every badge on your accessgranted.ie profile is earned through real, completed work —
                verified by the SME that commissioned it. Not self-reported. Not guesswork.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Earn badges through verified completed projects',
                  'Skill tags added by businesses you worked with — not your CV',
                  'Badges appear on your LinkedIn profile as verified credentials',
                  'Completed work counts toward university credits at partnered institutions',
                  'Hit 10+ badges → direct referrals to Irish companies actively hiring',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-gray-600">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: GREEN }}
                    >
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth?tab=register&role=student"
                className="mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow transition hover:opacity-90"
                style={{ backgroundColor: GREEN }}
              >
                Start building your portfolio →
              </Link>
            </div>

            {/* Badge preview grid */}
            <div className="grid grid-cols-3 gap-3">
              {BADGES_PREVIEW.map((badge) => (
                <div
                  key={badge.label}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition hover:scale-105 ${
                    badge.earned
                      ? 'border-[#006B3F] bg-white shadow-sm'
                      : 'border-gray-200 bg-gray-50 opacity-40'
                  }`}
                >
                  <span className="text-3xl">{badge.icon}</span>
                  <span className="text-xs font-semibold text-[#1E2B3A]">{badge.label}</span>
                  {badge.earned && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                      Earned ✓
                    </span>
                  )}
                </div>
              ))}
              <div className="col-span-3 rounded-2xl border border-dashed border-[#006B3F]/30 bg-[rgba(0,107,63,0.04)] p-4 text-center">
                <p className="text-xs text-gray-500">
                  <span className="font-semibold" style={{ color: GREEN }}>10+ badges</span> unlocks permanent role referrals with Irish companies 🏢
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}