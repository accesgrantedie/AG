'use client'

import Link from 'next/link'
import { useState } from 'react'

/* ─── Brand tokens ──────────────────────────────────────────────── */
const GREEN = '#006B3F'
const DARK = '#0F1C2E'
const CREAM = '#F5F2E9'
const GOLD = '#B78A3B'

/* ─── Data ──────────────────────────────────────────────────────── */
const STATS = [
  { value: '12', label: 'Irish universities', suffix: '+' },
  { value: '€12.70', label: 'starting hourly rate', suffix: '' },
  { value: '0%', label: 'commission from students', suffix: '' },
  { value: '3', label: 'top-matched students per project', suffix: '' },
]

const UNIVERSITIES = ['TCD', 'UCD', 'DCU', 'TU Dublin', 'UCC', 'UL', 'Maynooth', 'NCI', 'NUIG', 'ATU']

const HOW_STUDENT = [
  { icon: '🎓', step: '1', title: 'Build your verified profile', body: 'Add your university, course, year, and skills. We verify your enrolment. Verified students get matched first.' },
  { icon: '🤖', step: '2', title: 'Take an AI assessment', body: 'Our AI generates a tailored skills assessment based on live SME requirements. Prove your ability — not just your CV.' },
  { icon: '💰', step: '3', title: 'Earn, grow & get credits', body: 'Get paid from €12.70/hr. Earn LinkedIn badges, university credits, and unlock higher pay tiers as you complete projects.' },
  { icon: '🏢', step: '4', title: 'Get hired full-time', body: 'Hit 10+ verified projects and get directly referred to Irish companies actively hiring. No cold applications.' },
]

const HOW_SME = [
  { icon: '📋', step: '1', title: 'Post your project', body: 'Describe the scope, skills needed, and budget in under 5 minutes. No agency middleman. No markups.' },
  { icon: '🤖', step: '2', title: 'AI screens and matches', body: 'Our AI builds a custom assessment from your requirements and surfaces the top 3 matched students. You only see the best fit.' },
  { icon: '✅', step: '3', title: 'Hire with confidence', body: 'Review AI-assessed profiles, verified portfolios, and peer reviews. Start the project in hours — not weeks.' },
  { icon: '🔄', step: '4', title: 'Convert to full-time', body: 'When your student is ready, convert them to a full-time hire. We help you access GradStart funding to subsidise the salary.' },
]

const HOW_UNI = [
  { icon: '🏛️', step: '1', title: 'Register your institution', body: 'Get a university rep dashboard. Verify your enrolled students and track their real-world project activity.' },
  { icon: '📊', step: '2', title: 'Track student outcomes', body: 'See which students are earning, which skills are in demand, and how your graduates perform in the market.' },
  { icon: '🎓', step: '3', title: 'Award credits for real work', body: 'Recognise professional project work as university credits. Align academic requirements with real industry output.' },
  { icon: '🤝', step: '4', title: 'Build SME relationships', body: 'Connect your department directly with Irish SMEs who hire your students. Create a pipeline from lecture hall to boardroom.' },
]

const PAY_TIERS = [
  { rate: '€12.70', label: 'Entry', badge: '🌱', description: 'First project on the platform', color: '#4ADE80', subtext: 'Minimum wage guaranteed' },
  { rate: '€15', label: 'Rising', badge: '⭐', description: '5+ completed projects', color: '#34D399', subtext: 'Peer-reviewed work' },
  { rate: '€20', label: 'Skilled', badge: '💛', description: '10+ projects, peer-reviewed', color: '#FBBF24', subtext: 'LinkedIn badge unlocked' },
  { rate: '€25+', label: 'Top Tier', badge: '👑', description: '15+ projects, portfolio verified', color: GOLD, subtext: 'Direct full-time referrals' },
]

const BADGES_PREVIEW = [
  { icon: '🌱', label: 'First Project', earned: true },
  { icon: '⭐', label: '5 Projects', earned: true },
  { icon: '🏆', label: 'Job Ready', earned: false },
  { icon: '💚', label: '€15/hr Tier', earned: true },
  { icon: '💛', label: '€20/hr Tier', earned: false },
  { icon: '👑', label: '€25/hr Tier', earned: false },
]

const VS_ROWS = [
  { feature: 'Every freelancer is a verified Irish CS student', access: true, generic: false },
  { feature: '0% commission taken from students', access: true, generic: false },
  { feature: 'AI assessment matched to your exact project needs', access: true, generic: false },
  { feature: 'University-verified enrolment and skills', access: true, generic: false },
  { feature: 'Earn university credits for real work', access: true, generic: false },
  { feature: 'Pathway to full-time employment in Ireland', access: true, generic: false },
  { feature: 'GradStart funding support for SMEs', access: true, generic: false },
  { feature: 'Fair pay tiers — no race to the bottom', access: true, generic: false },
]

const SME_USE_CASES = [
  { label: 'Website redesign', budget: '~€600', time: '2 weeks', icon: '🌐' },
  { label: 'Mobile app prototype', budget: '~€1,200', time: '4 weeks', icon: '📱' },
  { label: 'API integration', budget: '~€400', time: '1 week', icon: '⚙️' },
  { label: 'Data dashboard', budget: '~€800', time: '3 weeks', icon: '📊' },
]

const FAQS = [
  {
    q: 'How do you verify students are real?',
    a: 'Every student is cross-checked against Irish university enrolment records. We verify their institution, course, and year of study. If they\'re not enrolled, they\'re not on access.ie.',
  },
  {
    q: 'What is the AI assessment?',
    a: 'When an SME posts a project, our AI generates a skills assessment tailored to their exact requirements. Students are assessed and ranked, with only the top 3 presented to the SME. You get precision, not noise.',
  },
  {
    q: 'What if the student doesn\'t deliver?',
    a: 'Payment is held on the platform until you confirm delivery. If the work isn\'t completed to spec, you don\'t pay. Every project comes with dispute resolution support.',
  },
  {
    q: 'What is GradStart and how does access.ie help?',
    a: 'GradStart is an Irish Government scheme that subsidises up to €6.50/hr of a graduate\'s wage when you hire them full-time. If your student performs well, we guide you through the GradStart application — so your next hire costs even less.',
  },
  {
    q: 'How do university credits work?',
    a: 'Partnered universities award academic credits for verified professional project work completed through access.ie. Students can apply project hours toward their course requirements. Contact your university rep to check eligibility.',
  },
  {
    q: 'Is this compliant with Irish minimum wage law?',
    a: 'Yes. All rates start at €12.70/hr, which meets the Irish National Minimum Wage. Contracts are PAYE-compliant and transparently structured. No below-minimum negotiation, ever.',
  },
]

/* ─── Components ────────────────────────────────────────────────── */
function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0F1C2E]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-white">access<span style={{ color: GREEN }}>.ie</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <a href="#how-it-works" className="text-sm text-white/70 transition hover:text-white">How it works</a>
          <a href="#ai-matching" className="text-sm text-white/70 transition hover:text-white">AI matching</a>
          <a href="#pay-tiers" className="text-sm text-white/70 transition hover:text-white">Pay tiers</a>
          <a href="#gradstart" className="text-sm text-white/70 transition hover:text-white">GradStart</a>
          <a href="#compare" className="text-sm text-white/70 transition hover:text-white">Why access.ie</a>
        </div>

        {/* Auth CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth?tab=login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white/80 transition hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/auth?tab=register"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition"
            style={{ backgroundColor: GREEN }}
          >
            Get started free
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-5 bg-white transition-all ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition-all ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0F1C2E] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-sm text-white/70">How it works</a>
            <a href="#ai-matching" onClick={() => setMobileOpen(false)} className="text-sm text-white/70">AI matching</a>
            <a href="#pay-tiers" onClick={() => setMobileOpen(false)} className="text-sm text-white/70">Pay tiers</a>
            <a href="#gradstart" onClick={() => setMobileOpen(false)} className="text-sm text-white/70">GradStart</a>
            <a href="#compare" onClick={() => setMobileOpen(false)} className="text-sm text-white/70">Why access.ie</a>
            <hr className="border-white/10" />
            <Link href="/auth?tab=login" className="text-sm text-white/70">Log in</Link>
            <Link
              href="/auth?tab=register"
              className="rounded-lg py-2 text-center text-sm font-semibold text-white"
              style={{ backgroundColor: GREEN }}
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function HomePage() {
  const [activeAudience, setActiveAudience] = useState<'student' | 'sme' | 'uni'>('student')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans">
      <NavBar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center"
        style={{ background: `linear-gradient(160deg, ${DARK} 0%, #0d2540 60%, #0a3020 100%)` }}
      >
        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Pill badge */}
        <div
          className="relative mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold"
          style={{ borderColor: `${GREEN}66`, color: '#4ADE80', backgroundColor: `${GREEN}1A` }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          Ireland&apos;s AI-powered student talent platform
        </div>

        {/* Headline */}
        <h1 className="relative mx-auto max-w-4xl text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
          Earn while you study.<br />
          <span style={{ color: '#4ADE80' }}>Hire</span> who you&apos;ll keep.
        </h1>

        {/* Sub-headline */}
        <p className="relative mx-auto mt-6 max-w-2xl text-lg text-white/60 sm:text-xl">
          access.ie connects Irish SMEs with AI-assessed, university-verified CS students for paid,
          degree-relevant projects — with a clear path from first project to full-time hire,
          and GradStart funding support along the way.
        </p>

        {/* Dual CTAs */}
        <div className="relative mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/auth?tab=register&role=student"
            className="group flex items-center gap-2 rounded-xl px-7 py-4 text-base font-bold text-white shadow-lg transition hover:scale-105"
            style={{ backgroundColor: GREEN }}
          >
            Find projects
            <span className="ml-1 inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold">
              0% commission
            </span>
            <span className="transition group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/auth?tab=register&role=business"
            className="group flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-4 text-base font-bold text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white/20"
          >
            Hire a student
            <span className="ml-1 inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold">
              from €12.70/hr
            </span>
            <span className="transition group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Social proof micro-strip */}
        <div className="relative mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
          <span>✓ AI-assessed skills, not just CVs</span>
          <span className="hidden sm:inline">·</span>
          <span>✓ University-verified enrolment</span>
          <span className="hidden sm:inline">·</span>
          <span>✓ University credits + LinkedIn badges</span>
          <span className="hidden sm:inline">·</span>
          <span>✓ GradStart funding for SMEs</span>
        </div>

        {/* Scroll hint */}
        <div className="relative mt-16 flex flex-col items-center gap-2 text-white/30">
          <span className="text-xs">Scroll to explore</span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/20 pt-1.5">
            <div
              className="h-1.5 w-1 animate-bounce rounded-full bg-white/40"
              style={{ animationDuration: '1.5s' }}
            />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
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

      {/* ── PROBLEM SECTION ───────────────────────────────────── */}
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
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8">
              <div className="mb-4 text-3xl">🎓</div>
              <h3 className="text-lg font-black text-[#0F1C2E]">CS students in final year</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                You have real skills. But generic job boards want 2 years of experience for an entry-level role.
                Part-time work is unrelated to your degree. And platforms like Upwork put you in a race to the bottom.
              </p>
              <div className="mt-5 rounded-xl p-4" style={{ backgroundColor: `${GREEN}10`, borderLeft: `3px solid ${GREEN}` }}>
                <p className="text-sm font-semibold" style={{ color: GREEN }}>
                  access.ie gets you paid projects, university credits, LinkedIn badges, and a direct path to full-time.
                </p>
              </div>
            </div>

            {/* SME problem */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8">
              <div className="mb-4 text-3xl">🏢</div>
              <h3 className="text-lg font-black text-[#0F1C2E]">Irish SMEs</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Agencies charge €2,500+ to find you someone junior. Global freelance platforms give you unverified strangers in different time zones.
                And hiring full-time without a trial feels like a massive gamble.
              </p>
              <div className="mt-5 rounded-xl p-4" style={{ backgroundColor: `${GREEN}10`, borderLeft: `3px solid ${GREEN}` }}>
                <p className="text-sm font-semibold" style={{ color: GREEN }}>
                  access.ie gives you AI-matched, university-verified CS students from €12.70/hr — with a trial-to-full-time pathway and GradStart funding.
                </p>
              </div>
            </div>

            {/* University problem */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8">
              <div className="mb-4 text-3xl">🏛️</div>
              <h3 className="text-lg font-black text-[#0F1C2E]">University departments</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                You want students to build real-world experience before graduation. But traditional placements are hard to arrange, hard to track, and often unpaid.
                And graduate employment rates are hard to improve without direct industry connections.
              </p>
              <div className="mt-5 rounded-xl p-4" style={{ backgroundColor: `${GREEN}10`, borderLeft: `3px solid ${GREEN}` }}>
                <p className="text-sm font-semibold" style={{ color: GREEN }}>
                  access.ie lets you verify, track, and credit your students&apos; real-world work — and build direct pipelines to Irish employers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── UNIVERSITY STRIP ──────────────────────────────────── */}
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

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how-it-works" className="bg-white px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest" style={{ color: GREEN }}>
            How it works
          </p>
          <h2 className="mt-3 text-center text-4xl font-black text-[#0F1C2E]">
            Built for three groups.<br />Works perfectly for all of them.
          </h2>

          {/* Tab toggle */}
          <div className="mx-auto mt-8 flex w-fit rounded-xl border border-gray-200 bg-gray-50 p-1">
            <button
              onClick={() => setActiveAudience('student')}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                activeAudience === 'student'
                  ? 'bg-white text-[#0F1C2E] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🎓 Students
            </button>
            <button
              onClick={() => setActiveAudience('sme')}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                activeAudience === 'sme'
                  ? 'bg-white text-[#0F1C2E] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              💼 SMEs
            </button>
            <button
              onClick={() => setActiveAudience('uni')}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                activeAudience === 'uni'
                  ? 'bg-white text-[#0F1C2E] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🏛️ Universities
            </button>
          </div>

          {/* Steps */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(activeAudience === 'student' ? HOW_STUDENT : activeAudience === 'sme' ? HOW_SME : HOW_UNI).map((step) => (
              <div
                key={step.step}
                className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-xs font-black text-white"
                  style={{ backgroundColor: DARK }}
                >
                  {step.step}
                </div>
                <div className="mb-2 text-2xl">{step.icon}</div>
                <h3 className="text-base font-bold text-[#0F1C2E]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href={`/auth?tab=register&role=${activeAudience === 'student' ? 'student' : activeAudience === 'sme' ? 'business' : 'university'}`}
              className="rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow transition hover:opacity-90"
              style={{ backgroundColor: GREEN }}
            >
              {activeAudience === 'student' ? 'Start earning →' : activeAudience === 'sme' ? 'Post your first project →' : 'Register your university →'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── AI MATCHING SECTION ────────────────────────────────── */}
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
                <p className="mt-2 text-sm text-white/80">&ldquo;Need a React developer to build a customer dashboard with analytics and Stripe integration. 3-week timeline.&rdquo;</p>
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

      {/* ── PAY TIERS ─────────────────────────────────────────── */}
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

      {/* ── BADGE SYSTEM ──────────────────────────────────────── */}
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
                Every badge on your access.ie profile is earned through real, completed work —
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

      {/* ── GRADSTART SECTION ─────────────────────────────────── */}
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
                When your access.ie student is ready to go full-time, we guide you through the GradStart application —
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
              <h3 className="text-lg font-black text-white">The access.ie → GradStart pathway</h3>
              <div className="mt-6 space-y-4">
                {[
                  { step: '1', label: 'Post a project on access.ie', sub: 'Match with a verified CS student. Start in hours.' },
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

      {/* ── SME USE CASES ─────────────────────────────────────── */}
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

      {/* ── COMPARISON ────────────────────────────────────────── */}
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

      {/* ── FOR SMES CALLOUT ──────────────────────────────────── */}
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

      {/* ── FAQ SECTION ───────────────────────────────────────── */}
      <section className="bg-white px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest" style={{ color: GREEN }}>
            Questions
          </p>
          <h2 className="mt-3 text-center text-4xl font-black text-[#0F1C2E]">
            Straight answers.
          </h2>

          <div className="mt-12 divide-y divide-gray-100">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-sm font-bold text-[#0F1C2E]">{faq.q}</span>
                  <span
                    className="shrink-0 text-lg font-light transition-transform"
                    style={{ color: GREEN, transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <p className="pb-5 text-sm leading-relaxed text-gray-500">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: CREAM }} className="px-4 py-28 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 text-4xl">☘️</div>
          <h2 className="text-4xl font-black text-[#0F1C2E]">
            Ireland&apos;s student talent pipeline<br />starts here.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-gray-500">
            Whether you&apos;re a CS student ready to earn while you study, an SME that needs vetted talent without the agency markup, or a university that wants to track and credit real-world student work — access.ie was built for you.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth?tab=register&role=student"
              className="rounded-xl px-8 py-4 text-base font-bold text-white shadow-lg transition hover:scale-105"
              style={{ backgroundColor: GREEN }}
            >
              I&apos;m a student →
            </Link>
            <Link
              href="/auth?tab=register&role=business"
              className="rounded-xl border-2 px-8 py-4 text-base font-bold transition hover:scale-105"
              style={{ borderColor: GREEN, color: GREEN }}
            >
              I&apos;m an SME →
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Are you a university rep?{' '}
            <Link href="/auth?tab=register" className="underline transition hover:text-gray-600">
              Register your institution
            </Link>
          </p>
          <p className="mt-3 text-xs text-gray-400">
            Free for students. No commission taken. 🇮🇪
          </p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: DARK }} className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <span className="text-xl font-black text-white">access<span style={{ color: GREEN }}>.ie</span></span>
              <p className="mt-1 text-xs text-white/30">
                Ireland&apos;s AI-powered student talent platform. Proudly Irish.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-xs text-white/40">
              <Link href="/auth?tab=register&role=student" className="transition hover:text-white/70">For students</Link>
              <Link href="/auth?tab=register&role=business" className="transition hover:text-white/70">For SMEs</Link>
              <Link href="/auth?tab=register" className="transition hover:text-white/70">For universities</Link>
              <Link href="/auth?tab=login" className="transition hover:text-white/70">Log in</Link>
            </div>
          </div>
          <div
            className="mt-8 border-t pt-8 text-center text-xs text-white/20"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            © {new Date().getFullYear()} access.ie. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
