import Link from 'next/link';
import { CREAM, GREEN } from '@/data/constants';

export default function FinalCTA() {
  return (
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
  )
}