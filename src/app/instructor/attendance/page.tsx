import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Profile, AttendanceRecord } from '@/types'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { demoStudents, demoAttendanceRecords } from '@/lib/demo-data'
import AttendanceClient from './AttendanceClient'
import { mapAttendanceRecordsFromDb } from '@/lib/mappers/operational-data-mappers'
import BackButton from '@/components/ui/BackButton'

function isDemoFallbackEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') return true
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const configured =
    url.startsWith('https://') &&
    !url.includes('your-project') &&
    !url.includes('example.supabase.co') &&
    key.length > 20
  return !configured
}

export default async function AttendanceManagementPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, school_id, full_name, email, schools(name)')
    .eq('id', user.id)
    .single()

  if (!profile || !isInstructorOrAdmin(profile.role)) {
    redirect('/dashboard')
  }

  if (!profile.school_id) {
    redirect('/dashboard')
  }

  const typedProfile: Profile = {
    id: profile.id,
    email: profile.email || '',
    full_name: profile.full_name || '',
    role: profile.role,
    school_id: profile.school_id || null,
    barber_shop_name: null,
    mentor_name: null,
    avatar_url: null,
    approval_status: 'approved',
    is_disabled: false,
    approved_by: null,
    approved_at: null,
    requires_password_change: false,
    created_at: '',
    updated_at: '',
  }

  const schoolId = profile.school_id || null
  const schoolName = (profile.schools as { name?: string } | null)?.name || 'Your School'

  const { data: studentsData } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', schoolId)
    .in('role', ['student', 'apprentice'])

  let students: Profile[] = (studentsData as Profile[]) || []

  if (students.length === 0 && isDemoFallbackEnabled()) {
    students = demoStudents.filter((s) => s.school_id === schoolId || !schoolId)
  }

  const studentIds = students.map((s) => s.id)

  const { data: attendanceData } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('school_id', schoolId)
    .in('user_id', studentIds.length > 0 ? studentIds : ['__none__'])
    .order('date', { ascending: false })

  let records: AttendanceRecord[] = mapAttendanceRecordsFromDb(attendanceData || []) || []
  if (records.length === 0 && isDemoFallbackEnabled()) {
    records = demoAttendanceRecords.filter((a) => studentIds.includes(a.userId))
  }

  const defaultDate = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-8">
      <BackButton fallbackHref="/instructor" label="Back to instructor dashboard" />
      <div className="mt-6">
        <AttendanceClient
          initialRecords={records}
          students={students}
          currentUser={typedProfile}
          schoolId={schoolId}
          schoolName={schoolName}
          defaultDate={defaultDate}
        />
      </div>
    </div>
  )
}
