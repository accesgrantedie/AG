'use client'

import { ReactNode } from 'react'
import { DashboardNav } from '@/components/DashboardNav'

type Props = {
  name: string
  role: 'student' | 'business' | 'university'
  title?: string
  subtitle?: string
  right?: ReactNode
  children: ReactNode
}

export function DashboardShell({ name, role, title, subtitle, right, children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav name={name} role={role} />

      {/* Page header */}
      {(title || subtitle || right) && (
        <div className="border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
            <div>
              {title && <h1 className="text-xl font-semibold text-[#111827]">{title}</h1>}
              {subtitle && <p className="mt-0.5 text-sm text-[#6B7280]">{subtitle}</p>}
            </div>
            {right && <div className="flex items-center gap-3">{right}</div>}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  )
}
