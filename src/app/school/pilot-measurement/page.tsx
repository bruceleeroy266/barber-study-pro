import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import StaffPilotMeasurementView from '@/components/pilot-measurement/StaffPilotMeasurementView'
import { resolveSupportAccessContext } from '@/lib/support-access'

export const dynamic = 'force-dynamic'

export default async function SchoolPilotMeasurementPage() {
  const context = await resolveSupportAccessContext()
  if (!context) redirect('/login')

  const profile = context.effectiveProfile
  if (!(isAdmin(profile.role) || isSchoolAdmin(profile.role))) {
    redirect(context.supportActive ? '/admin/support-access' : '/dashboard')
  }
  if (!profile.school_id) redirect(context.supportActive ? '/admin/support-access' : '/dashboard')

  return (
    <div className="mx-auto max-w-7xl">
      <StaffPilotMeasurementView schoolId={profile.school_id} viewer="school_admin" />
    </div>
  )
}
