import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import Link from 'next/link'
import { Mail, Phone, Calendar, Tag, Trash2, CheckCircle, XCircle, HelpCircle, AlertCircle } from 'lucide-react'
import ReplyModal from './ReplyModal'
import BackButton from '@/components/ui/BackButton'

export const dynamic = 'force-dynamic'

type PilotInquiry = {
  id: string
  created_at: string
  school_name: string
  contact_name: string
  email: string
  phone: string | null
  program_type: string
  cohort_size: string | null
  start_date: string | null
  message: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  is_test: boolean
  status: 'new' | 'contacted' | 'approved' | 'declined' | 'spam'
  notes: string | null
}

const statusStyles: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  contacted: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-400 border-green-500/20',
  declined: 'bg-red-500/10 text-red-400 border-red-500/20',
  spam: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

const statusIcons: Record<string, React.ReactNode> = {
  new: <AlertCircle className="w-3.5 h-3.5" />,
  contacted: <HelpCircle className="w-3.5 h-3.5" />,
  approved: <CheckCircle className="w-3.5 h-3.5" />,
  declined: <XCircle className="w-3.5 h-3.5" />,
  spam: <Trash2 className="w-3.5 h-3.5" />,
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default async function PilotInquiriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  if (!profile || !(isAdmin(profile.role) || isSchoolAdmin(profile.role))) {
    redirect('/dashboard')
  }

  const { data: inquiries, error } = await supabase
    .from('pilot_inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    console.error('[Pilot Inquiries] Failed to load inquiries:', error)
  }

  const rows: PilotInquiry[] = inquiries ?? []

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
        <BackButton fallbackHref="/admin" label="Back to admin dashboard" />
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Pilot Inquiries</h1>
            <p className="text-gray-400">
              {rows.length} submission{rows.length === 1 ? '' : 's'} found
            </p>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-lg">No pilot inquiries yet.</p>
            <p className="text-gray-500 text-sm mt-2">
              Submissions from the <Link href="/pilot" className="text-[#D4AF37] hover:underline">/pilot</Link> page will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`bg-gray-900 border rounded-xl p-6 transition-colors ${
                  inquiry.is_test ? 'border-dashed border-yellow-500/30' : 'border-gray-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-white">{inquiry.school_name}</h2>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${statusStyles[inquiry.status]}`}
                      >
                        {statusIcons[inquiry.status]}
                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </span>
                      {inquiry.is_test && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                          TEST
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Mail className="w-4 h-4 text-[#D4AF37]" />
                        <span>{inquiry.contact_name}</span>
                        <span className="text-gray-500">•</span>
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="text-[#D4AF37] hover:underline"
                        >
                          {inquiry.email}
                        </a>
                      </div>

                      {inquiry.phone && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone className="w-4 h-4 text-[#D4AF37]" />
                          <a href={`tel:${inquiry.phone}`} className="hover:text-white">
                            {inquiry.phone}
                          </a>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-gray-300">
                        <Tag className="w-4 h-4 text-[#D4AF37]" />
                        <span>{inquiry.program_type}</span>
                        {inquiry.cohort_size && (
                          <span className="text-gray-500">• Cohort {inquiry.cohort_size}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4 text-[#D4AF37]" />
                        <span>{formatDate(inquiry.created_at)}</span>
                      </div>
                    </div>

                    {(inquiry.utm_source || inquiry.utm_medium || inquiry.utm_campaign) && (
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">UTM</span>
                        {inquiry.utm_source && (
                          <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-300">
                            source: {inquiry.utm_source}
                          </span>
                        )}
                        {inquiry.utm_medium && (
                          <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-300">
                            medium: {inquiry.utm_medium}
                          </span>
                        )}
                        {inquiry.utm_campaign && (
                          <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-300">
                            campaign: {inquiry.utm_campaign}
                          </span>
                        )}
                        {inquiry.utm_term && (
                          <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-300">
                            term: {inquiry.utm_term}
                          </span>
                        )}
                        {inquiry.utm_content && (
                          <span className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-300">
                            content: {inquiry.utm_content}
                          </span>
                        )}
                      </div>
                    )}

                    {inquiry.message && (
                      <div className="bg-gray-950/50 border border-gray-800 rounded-lg p-4 mt-2">
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{inquiry.message}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex lg:flex-col items-start lg:items-end gap-2 min-w-[140px]">
                    <ReplyModal
                      inquiryId={inquiry.id}
                      email={inquiry.email}
                      contactName={inquiry.contact_name}
                      schoolName={inquiry.school_name}
                      defaultSubject={`RE: ASCYN PRO Pilot Inquiry - ${inquiry.school_name}`}
                    />
                    {inquiry.is_test && (
                      <span className="text-xs text-yellow-500/80">Safe to delete</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
