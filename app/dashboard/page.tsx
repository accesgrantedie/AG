'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const router = useRouter()
  useEffect(() => {
    const redirect = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/auth'); return }
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role === 'business') router.replace('/dashboard/business')
      else if (profile?.role === 'university') router.replace('/dashboard/university')
      else router.replace('/dashboard/student')
    }
    redirect()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1C2E]">
      <div className="flex items-center gap-3 text-white/60">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#4ADE80]" />
        <span className="text-sm">Loading your dashboard…</span>
      </div>
    </div>
  )
}
