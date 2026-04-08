import { GREEN, STATS } from '@/data/constants';

export default function Stats() {
  return (
    <section style={{ backgroundColor: GREEN }}>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center px-6 py-8 text-center">
              <span className="text-3xl font-black text-white">
                {s.value}{s.suffix}
              </span>
              <span className="mt-1 text-xs font-medium text-white/70">{s.label}</span>
            </div>
          ))}
        </div>
      </section>
  )
}