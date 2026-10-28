import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// Temporary isolated-QA diagnostic. Never exposes session tokens or cookies.
export async function GET() {
  const qaProject = 'mtuqzlkesptcpvfhmnwk'
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  if (process.env.VERCEL_ENV !== 'preview' || new URL(url || 'https://invalid.local').hostname !== qaProject + '.supabase.co') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  return NextResponse.json({ user_id: user.id, email: user.email, role: profile?.role ?? null }, {
    headers: { 'Cache-Control': 'no-store, private' },
  })
}
