import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ClipboardCheck } from 'lucide-react'

export default async function BetaChecklistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Beta Tester Checklist</h1>
        <p className="text-gray-400">
          Your guided list of beta tasks and feedback areas.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
        <ClipboardCheck className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Coming Soon</h2>
        <p className="text-gray-400 mb-6">
          The beta tester checklist is being finalized. Check back shortly for your
          first tasks.
        </p>
        <Link
          href="/beta-agreement"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Beta Agreement
        </Link>
      </div>
    </div>
  )
}
