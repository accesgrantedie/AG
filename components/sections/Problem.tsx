import { GREEN } from '@/data/constants';

export default function Problem() {
  return (
    <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest" style={{ color: GREEN }}>
            The problem we solve
          </p>
          <h2 className="mt-3 text-center text-4xl font-black text-[#0F1C2E]">
            Three groups. Three frustrations.<br />One platform.
          </h2>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {/* Student problem */}
            <div className="border-gray-100 group relative rounded-2xl border bg-gray-50 p-8 transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/10 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="mb-4 text-3xl">🎓</div>
              <h3 className="text-lg font-black text-[#0F1C2E]">CS students in final year</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                You have real skills. But generic job boards want 2 years of experience for an entry-level role.
                Part-time work is unrelated to your degree. And platforms like Upwork put you in a race to the bottom.
              </p>
              <div className="mt-5 rounded-xl p-4" style={{ backgroundColor: `${GREEN}10`, borderLeft: `3px solid ${GREEN}` }}>
                <p className="text-sm font-semibold" style={{ color: GREEN }}>
                  accessgranted.ie gets you paid projects, university credits, LinkedIn badges, and a direct path to full-time.
                </p>
              </div>
            </div>

            {/* SME problem */}
            <div className="group relative   transition duration-300 hover:-translate-y-2 hover:shadow-2xl rounded-2xl border border-gray-100 bg-gray-50 p-8">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/10 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="mb-4 text-3xl">🏢</div>
              <h3 className="text-lg font-black text-[#0F1C2E]">Irish SMEs</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Agencies charge €2,500+ to find you someone junior. Global freelance platforms give you unverified strangers in different time zones.
                And hiring full-time without a trial feels like a massive gamble.
              </p>
              <div className="mt-5 rounded-xl p-4" style={{ backgroundColor: `${GREEN}10`, borderLeft: `3px solid ${GREEN}` }}>
                <p className="text-sm font-semibold" style={{ color: GREEN }}>
                  accessgranted.ie gives you AI-matched, university-verified CS students from €12.70/hr — with a trial-to-full-time pathway and GradStart funding.
                </p>
              </div>
            </div>

            {/* University problem */}
            <div className="group relative transition duration-300 hover:-translate-y-2 hover:shadow-2xl rounded-2xl border border-gray-100 bg-gray-50 p-8">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/10 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="mb-4 text-3xl">🏛️</div>
              <h3 className="text-lg font-black text-[#0F1C2E]">University departments</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                You want students to build real-world experience before graduation. But traditional placements are hard to arrange, hard to track, and often unpaid.
                And graduate employment rates are hard to improve without direct industry connections.
              </p>
              <div className="mt-5 rounded-xl p-4" style={{ backgroundColor: `${GREEN}10`, borderLeft: `3px solid ${GREEN}` }}>
                <p className="text-sm font-semibold" style={{ color: GREEN }}>
                  accessgranted.ie lets you verify, track, and credit your students&apos; real-world work — and build direct pipelines to Irish employers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}