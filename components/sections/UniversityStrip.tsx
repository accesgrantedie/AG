import { CREAM, UNIVERSITIES } from '@/data/constants';

export default function UniversityStrip() {
  return (
    <section style={{ backgroundColor: CREAM }} className="border-y border-[#E8DFC8]">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
            Students from Ireland&apos;s leading CS programmes
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {UNIVERSITIES.map((uni) => (
              <span
                key={uni}
                className="rounded-full border border-[#C8BFA0] bg-white px-4 py-1.5 text-sm font-semibold text-[#1E2B3A] shadow-sm"
              >
                {uni}
              </span>
            ))}
          </div>
        </div>
      </section>
  )
}