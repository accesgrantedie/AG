import { useState } from 'react';
import { GREEN, FAQS } from '@/data/constants';

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
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
  )
}