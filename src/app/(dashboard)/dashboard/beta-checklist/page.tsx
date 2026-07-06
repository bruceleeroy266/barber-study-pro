import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import BetaChecklist from '@/components/BetaChecklist'
import { getMyBetaFeedback } from './actions'

export default async function BetaChecklistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { feedback, error } = await getMyBetaFeedback()

  return (
    <BetaChecklist
      initialFeedback={feedback ?? []}
    />
  )
}
