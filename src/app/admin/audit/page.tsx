import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth-helpers'
import { getAuditHistory } from './actions'
import AuditHistoryViewer from '@/components/admin/audit/AuditHistoryViewer'
import BackButton from '@/components/ui/BackButton'

export default async function AuditHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !isAdmin(profile.role)) {
    redirect('/dashboard')
  }

  const initialData = await getAuditHistory({ limit: 50, offset: 0 })

  return (
    <div className="min-h-screen bg-gray-950 p-6 lg:p-8">
        <BackButton fallbackHref="/admin" label="Back to admin dashboard" />
      <div className="max-w-7xl mx-auto">
        <AuditHistoryViewer initialData={initialData} />
      </div>
    </div>
  )
}
