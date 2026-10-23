import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import SchoolDashboard from '@/components/school-owner/SchoolDashboard'
import { resolveSupportAccessContext } from '@/lib/support-access'

export default async function SchoolAdminPage() {
  const context = await resolveSupportAccessContext()
  if (!context) redirect('/login')

  const profile = context.effectiveProfile
  if (!(isAdmin(profile.role) || isSchoolAdmin(profile.role))) {
    redirect(context.supportActive ? '/admin/support-access' : '/dashboard')
  }

  if (!profile.school_id) {
    redirect(context.supportActive ? '/admin/support-access' : '/dashboard')
  }

  return <SchoolDashboard schoolId={profile.school_id} />
}
