import { CREAM, GREEN, VS_ROWS } from '@/data/constants';

export default function Comparison() {
  return (
    <section id="compare" style={{ backgroundColor: CREAM }} className="px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest" style={{ color: GREEN }}>
            Why access.ie
          </p>
          <h2 className="mt-3 text-center text-4xl font-black text-[#0F1C2E]">
            Built for Ireland.<br />Designed to replace the old way.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-base text-gray-500">
            All talent on access.ie is AI-assessed, university-enrolled, and Irish — delivering work aligned to their degree and your business.
          </p>

          <div className="mt-12 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-gray-100 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <span className="col-span-1">Feature</span>
              <span className="text-center" style={{ color: GREEN }}>access.ie</span>
              <span className="text-center">Generic platforms</span>
            </div>

            {VS_ROWS.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 items-center px-6 py-4 text-sm ${
                  i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <span className="col-span-1 font-medium text-[#1E2B3A]">{row.feature}</span>
                <span className="flex justify-center text-lg">
                  {row.access ? '✅' : '❌'}
                </span>
                <span className="flex justify-center text-lg">
                  {row.generic ? '✅' : '❌'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}