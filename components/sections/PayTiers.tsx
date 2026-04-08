import { GREEN, PAY_TIERS, GOLD, DARK } from '@/data/constants';

export default function PayTiers() {
  return (
    <section id="pay-tiers" className="bg-white px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest" style={{ color: GREEN }}>
            Pay tier system
          </p>
          <h2 className="mt-3 text-center text-4xl font-black text-[#0F1C2E]">
            Earn more as you prove yourself.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-base text-gray-500">
            Unlike generic platforms, your rate on access.ie is tied to verified work history —
            not who bids lowest. Every project gets you closer to your next tier.
          </p>

          {/* Tier cards */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PAY_TIERS.map((tier, i) => (
              <div
                key={tier.label}
                className="relative overflow-hidden rounded-2xl border p-6 transition hover:scale-105"
                style={{
                  borderColor: i === PAY_TIERS.length - 1 ? GOLD : '#E5E7EB',
                  backgroundColor: i === PAY_TIERS.length - 1 ? `${GOLD}0D` : '#FAFAFA',
                }}
              >
                {i === PAY_TIERS.length - 1 && (
                  <div
                    className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-bold text-white"
                    style={{ backgroundColor: GOLD }}
                  >
                    Top
                  </div>
                )}
                <div className="text-3xl">{tier.badge}</div>
                <div
                  className="mt-3 text-3xl font-black"
                  style={{ color: i === PAY_TIERS.length - 1 ? GOLD : DARK }}
                >
                  {tier.rate}
                  <span className="text-base font-medium text-gray-400">/hr</span>
                </div>
                <div className="mt-1 text-sm font-bold text-[#0F1C2E]">{tier.label}</div>
                <p className="mt-2 text-xs text-gray-500">{tier.description}</p>
                <p className="mt-3 text-xs font-semibold" style={{ color: GREEN }}>{tier.subtext}</p>
              </div>
            ))}
          </div>

          {/* Arrow connector */}
          <div className="mt-8 flex items-center justify-center gap-3 text-gray-300">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-sm text-gray-400">Your rate grows with your reputation</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
        </div>
      </section>
  )
}