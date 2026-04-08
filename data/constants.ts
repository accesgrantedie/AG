/* ─── Brand tokens ──────────────────────────────────────────────── */
export const GREEN = '#006B3F'
export const DARK = '#0F1C2E'
export const CREAM = '#F5F2E9'
export const GOLD = '#B78A3B'

/* ─── Data ──────────────────────────────────────────────────────── */
export const STATS = [
  { value: '12', label: 'Irish universities', suffix: '+' },
  { value: '€12.70', label: 'starting hourly rate', suffix: '' },
  { value: '0%', label: 'commission from students', suffix: '' },
  { value: '3', label: 'top-matched students per project', suffix: '' },
]

export const UNIVERSITIES = ['TCD', 'UCD', 'DCU', 'TU Dublin', 'UCC', 'UL', 'Maynooth', 'NCI', 'NUIG', 'ATU']

export const HOW_STUDENT = [
  { icon: '🎓', step: '1', title: 'Build your verified profile', body: 'Add your university, course, year, and skills. We verify your enrolment. Verified students get matched first.' },
  { icon: '🤖', step: '2', title: 'Take an AI assessment', body: 'Our AI generates a tailored skills assessment based on live SME requirements. Prove your ability — not just your CV.' },
  { icon: '💰', step: '3', title: 'Earn, grow & get credits', body: 'Get paid from €12.70/hr. Earn LinkedIn badges, university credits, and unlock higher pay tiers as you complete projects.' },
  { icon: '🏢', step: '4', title: 'Get hired full-time', body: 'Hit 10+ verified projects and get directly referred to Irish companies actively hiring. No cold applications.' },
]

export const HOW_SME = [
  { icon: '📋', step: '1', title: 'Post your project', body: 'Describe the scope, skills needed, and budget in under 5 minutes. No agency middleman. No markups.' },
  { icon: '🤖', step: '2', title: 'AI screens and matches', body: 'Our AI builds a custom assessment from your requirements and surfaces the top 3 matched students. You only see the best fit.' },
  { icon: '✅', step: '3', title: 'Hire with confidence', body: 'Review AI-assessed profiles, verified portfolios, and peer reviews. Start the project in hours — not weeks.' },
  { icon: '🔄', step: '4', title: 'Convert to full-time', body: 'When your student is ready, convert them to a full-time hire. We help you access GradStart funding to subsidise the salary.' },
]

export const HOW_UNI = [
  { icon: '🏛️', step: '1', title: 'Register your institution', body: 'Get a university rep dashboard. Verify your enrolled students and track their real-world project activity.' },
  { icon: '📊', step: '2', title: 'Track student outcomes', body: 'See which students are earning, which skills are in demand, and how your graduates perform in the market.' },
  { icon: '🎓', step: '3', title: 'Award credits for real work', body: 'Recognise professional project work as university credits. Align academic requirements with real industry output.' },
  { icon: '🤝', step: '4', title: 'Build SME relationships', body: 'Connect your department directly with Irish SMEs who hire your students. Create a pipeline from lecture hall to boardroom.' },
]

export const PAY_TIERS = [
  { rate: '€12.70', label: 'Entry', badge: '🌱', description: 'First project on the platform', color: '#4ADE80', subtext: 'Minimum wage guaranteed' },
  { rate: '€15', label: 'Rising', badge: '⭐', description: '5+ completed projects', color: '#34D399', subtext: 'Peer-reviewed work' },
  { rate: '€20', label: 'Skilled', badge: '💛', description: '10+ projects, peer-reviewed', color: '#FBBF24', subtext: 'LinkedIn badge unlocked' },
  { rate: '€25+', label: 'Top Tier', badge: '👑', description: '15+ projects, portfolio verified', color: GOLD, subtext: 'Direct full-time referrals' },
]

export const BADGES_PREVIEW = [
  { icon: '🌱', label: 'First Project', earned: true },
  { icon: '⭐', label: '5 Projects', earned: true },
  { icon: '🏆', label: 'Job Ready', earned: false },
  { icon: '💚', label: '€15/hr Tier', earned: true },
  { icon: '💛', label: '€20/hr Tier', earned: false },
  { icon: '👑', label: '€25/hr Tier', earned: false },
]

export const VS_ROWS = [
  { feature: 'Every freelancer is a verified Irish CS student', access: true, generic: false },
  { feature: '0% commission taken from students', access: true, generic: false },
  { feature: 'AI assessment matched to your exact project needs', access: true, generic: false },
  { feature: 'University-verified enrolment and skills', access: true, generic: false },
  { feature: 'Earn university credits for real work', access: true, generic: false },
  { feature: 'Pathway to full-time employment in Ireland', access: true, generic: false },
  { feature: 'GradStart funding support for SMEs', access: true, generic: false },
  { feature: 'Fair pay tiers — no race to the bottom', access: true, generic: false },
]

export const SME_USE_CASES = [
  { label: 'Website redesign', budget: '~€600', time: '2 weeks', icon: '🌐' },
  { label: 'Mobile app prototype', budget: '~€1,200', time: '4 weeks', icon: '📱' },
  { label: 'API integration', budget: '~€400', time: '1 week', icon: '⚙️' },
  { label: 'Data dashboard', budget: '~€800', time: '3 weeks', icon: '📊' },
]

export const FAQS = [
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

export const AI_TYPING_TEXT = 'Need a React developer to build a customer dashboard with analytics and Stripe integration. 3-week timeline...';