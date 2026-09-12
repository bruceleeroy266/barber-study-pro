'use client'

import { useCallback, useEffect, useState } from 'react'
import { Clock, LogIn, LogOut, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type TodayRecord = {
  id: string
  status: string
  clocked_in_at: string | null
  clocked_out_at: string | null
  minutes_present: number | null
}

function time(value: string | null) {
  return value ? new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '—'
}

function duration(minutes: number | null) {
  if (minutes == null) return '—'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export default function StudentAttendancePage() {
  const [record, setRecord] = useState<TodayRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Please sign in again.')
      setLoading(false)
      return
    }
    const today = new Date().toLocaleDateString('en-CA')
    const { data, error: queryError } = await supabase
      .from('attendance_records')
      .select('id,status,clocked_in_at,clocked_out_at,minutes_present')
      .eq('user_id', user.id)
      .eq('date', today)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (queryError) setError(queryError.message)
    setRecord(data ?? null)
    setLoading(false)
  }, [])

  useEffect(() => { void load() }, [load])

  async function runClock(action: 'student_clock_in' | 'student_clock_out') {
    setWorking(true)
    setError(null)
    const { data, error: rpcError } = await supabase.rpc(action)
    if (rpcError) setError(rpcError.message)
    else if (data) setRecord(data as TodayRecord)
    await load()
    setWorking(false)
  }

  const active = !!record?.clocked_in_at && !record?.clocked_out_at
  const complete = !!record?.clocked_out_at

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Attendance & Hours</h1>
        <p className="text-silver-gray mt-2">Clock your actual school attendance time. Completed time is sent to your instructor for hour approval.</p>
      </div>

      {error && <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-200">{error}</div>}

      <div className="bg-charcoal border border-graphite rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gold/10"><Clock className="w-6 h-6 text-gold" /></div>
          <div>
            <p className="text-sm text-silver-gray">Today</p>
            <p className="text-xl font-semibold text-white">{loading ? 'Loading…' : active ? 'Clocked In' : complete ? 'Clocked Out' : 'Not Clocked In'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-black/30 rounded-xl p-4"><p className="text-xs text-silver-gray">Clock In</p><p className="text-lg text-white mt-1">{time(record?.clocked_in_at ?? null)}</p></div>
          <div className="bg-black/30 rounded-xl p-4"><p className="text-xs text-silver-gray">Clock Out</p><p className="text-lg text-white mt-1">{time(record?.clocked_out_at ?? null)}</p></div>
          <div className="bg-black/30 rounded-xl p-4"><p className="text-xs text-silver-gray">Recorded Time</p><p className="text-lg text-white mt-1">{duration(record?.minutes_present ?? null)}</p></div>
        </div>

        {!complete && !active && (
          <button disabled={loading || working} onClick={() => void runClock('student_clock_in')} className="w-full min-h-14 rounded-xl bg-gold text-black font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            <LogIn className="w-5 h-5" /> {working ? 'Clocking In…' : 'Clock In'}
          </button>
        )}
        {active && (
          <button disabled={working} onClick={() => void runClock('student_clock_out')} className="w-full min-h-14 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            <LogOut className="w-5 h-5" /> {working ? 'Clocking Out…' : 'Clock Out'}
          </button>
        )}
        {complete && <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">Today’s clock session is complete. Your recorded time is pending instructor review before it counts as approved program hours.</div>}
      </div>

      <div className="flex gap-3 rounded-xl border border-graphite p-4 text-sm text-silver-gray">
        <ShieldCheck className="w-5 h-5 text-gold shrink-0" />
        <p>Attendance time and approved licensing hours are intentionally separate. Clocking out records elapsed time; an instructor must review the pending hour entry before it becomes approved program credit.</p>
      </div>
    </div>
  )
}
