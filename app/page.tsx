'use client'

import NavBar from '@/components/layout/NavBar'
import Hero from '@/components/sections/Hero'
import Stats from '@/components/sections/Stats'
import Problem from '@/components/sections/Problem'
import UniversityStrip from '@/components/sections/UniversityStrip'
import HowItWorks from '@/components/sections/HowItWorks'
import AIMatching from '@/components/sections/AIMatching'
import PayTiers from '@/components/sections/PayTiers'
import BadgeSystem from '@/components/sections/BadgeSystem'
import GradStart from '@/components/sections/GradStart'
import SMEUseCases from '@/components/sections/SMEUseCases'
import Comparison from '@/components/sections/Comparison'
import SMECallout from '@/components/sections/SMECallout'
import FAQ from '@/components/sections/FAQ'
import FinalCTA from '@/components/sections/FinalCTA'
import Footer from '@/components/layout/Footer'
import ComingSoon from '@/components/ComingSoon'

export default function HomePage() {
  
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans">
      <ComingSoon />
      {/* <NavBar />
      <Hero />
      <Stats />
      <Problem />
      <UniversityStrip />
      <HowItWorks />
      <AIMatching />
      <PayTiers />
      <BadgeSystem />
      <GradStart />
      <SMEUseCases />
      <Comparison />
      <SMECallout />
      <FAQ />
      <FinalCTA />
      <Footer /> */}
    </div>
  )
}
