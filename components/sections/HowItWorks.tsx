import { useState } from 'react';
import Link from 'next/link';
import { HOW_STUDENT, GREEN, HOW_SME, HOW_UNI, DARK } from '@/data/constants';

export default function HowItWorks() {
  const [activeAudience, setActiveAudience] = useState<'student' | 'sme' | 'uni'>('student')

  return (
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
  )
}