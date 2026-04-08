import { GREEN, SME_USE_CASES } from '@/data/constants';

export default function SMEUseCases() {
  return (
    <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest" style={{ color: GREEN }}>
            What SMEs are building
          </p>
          <h2 className="mt-3 text-center text-4xl font-black text-[#0F1C2E]">
            Real projects. Real outcomes. Fair prices.
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SME_USE_CASES.map((uc) => (
              <div key={uc.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center">
                <div className="text-3xl">{uc.icon}</div>
                <h3 className="mt-3 text-sm font-bold text-[#0F1C2E]">{uc.label}</h3>
                <div className="mt-3 text-2xl font-black" style={{ color: GREEN }}>{uc.budget}</div>
                <p className="mt-1 text-xs text-gray-400">Estimated {uc.time}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-gray-400">
            No agency markup. No hidden platform fee. You pay the student directly through the platform.
          </p>
        </div>
      </section>
  )
}