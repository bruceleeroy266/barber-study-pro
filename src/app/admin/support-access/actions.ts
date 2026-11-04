'use server'

import { redirect } from 'next/navigation'
import { startSupportAccess, stopSupportAccess } from '@/lib/support-access'

export async function startSupportMode(formData: FormData) {
  const targetProfileId = String(formData.get('targetProfileId') || '').trim()
  if (!targetProfileId) redirect('/admin/support-access?error=missing-target')

  const result = await startSupportAccess(targetProfileId)
  if (!result.ok || !result.route) {
    redirect(`/admin/support-access?error=${encodeURIComponent(result.error || 'support-start-failed')}`)
  }

  redirect(result.route)
}

export async function stopSupportMode() {
  await stopSupportAccess()
  redirect('/admin/support-access')
}
