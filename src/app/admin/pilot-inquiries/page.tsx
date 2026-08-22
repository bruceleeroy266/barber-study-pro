import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import Link from 'next/link'
import { Mail, Phone, Calendar, Tag, Trash2, CheckCircle, XCircle, HelpCircle, AlertCircle } from 'lucide-react'
import ReplyModal from './ReplyModal'
import ApproveInquiryModal from './ApproveInquiryModal'
import CreateSchoolModal from './CreateSchoolModal'
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
  school_id: string | null
  school_created_at: string | null
}

const statusStyles: Record<string, string> = {
  new: 'bg-silver/10 text-silver border-silver/20',
  contacted: 'bg-warm-bronze/10 text-warm-bronze border-warm-bronze/20',
  approved: 'bg-gold/10 text-gold border-gold/20',
  declined: 'bg-silver/10 text-silver border-silver/20',
  spam: 'bg-silver-gray/10 text-silver border-silver-gray/20',
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
    <div className="min-h-screen bg-black p-4 md:p-8">
        <BackButton fallbackHref="/admin" label="Back to admin dashboard" />
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Pilot Inquiries</h1>
            <p className="text-silver">
              {rows.length} submission{rows.length === 1 ? '' : 's'} found
            </p>
          </div>
        </div>

        {error && (
          <div role="alert" aria-live="polite" className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 font-medium">Failed to load pilot inquiries</p>
            <p className="text-red-400/80 text-sm mt-1">Please try refreshing the page. If the problem persists, contact support.</p>
          </div>
        )}

        {rows.length === 0 ? (
          <div className="bg-charcoal border border-graphite rounded-xl p-12 text-center">
            <p className="text-silver text-lg">No pilot inquiries yet.</p>
            <p className="text-silver-gray text-sm mt-2">
              Submissions from the <Link href="/pilot" className="text-[var(--color-brand-gold)] hover:underline">/pilot</Link> page will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`bg-charcoal border rounded-xl p-6 transition-colors ${
                  inquiry.is_test ? 'border-dashed border-warm-bronze/30' : 'border-graphite'
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
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border bg-warm-bronze/10 text-warm-bronze border-warm-bronze/20">
                          TEST
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-light-gray">
                        <Mail className="w-4 h-4 text-[var(--color-brand-gold)]" />
                        <span>{inquiry.contact_name}</span>
                        <span className="text-silver-gray">•</span>
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="text-[var(--color-brand-gold)] hover:underline"
                        >
                          {inquiry.email}
                        </a>
                      </div>

                      {inquiry.phone && (
                        <div className="flex items-center gap-2 text-light-gray">
                          <Phone className="w-4 h-4 text-[var(--color-brand-gold)]" />
                          <a href={`tel:${inquiry.phone}`} className="hover:text-white">
                            {inquiry.phone}
                          </a>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-light-gray">
                        <Tag className="w-4 h-4 text-[var(--color-brand-gold)]" />
                        <span>{inquiry.program_type}</span>
                        {inquiry.cohort_size && (
                          <span className="text-silver-gray">• Cohort {inquiry.cohort_size}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-light-gray">
                        <Calendar className="w-4 h-4 text-[var(--color-brand-gold)]" />
                        <span>{formatDate(inquiry.created_at)}</span>
                      </div>
                    </div>

                    {(inquiry.utm_source || inquiry.utm_medium || inquiry.utm_campaign) && (
                      <details className="pt-2">
                        <summary className="text-xs text-silver-gray uppercase tracking-wider cursor-pointer hover:text-light-gray">
                          Tracking parameters
                        </summary>
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          {inquiry.utm_source && (
                            <span className="px-2 py-1 text-xs rounded bg-graphite text-light-gray">
                              source: {inquiry.utm_source}
                            </span>
                          )}
                          {inquiry.utm_medium && (
                            <span className="px-2 py-1 text-xs rounded bg-graphite text-light-gray">
                              medium: {inquiry.utm_medium}
                            </span>
                          )}
                          {inquiry.utm_campaign && (
                            <span className="px-2 py-1 text-xs rounded bg-graphite text-light-gray">
                              campaign: {inquiry.utm_campaign}
                            </span>
                          )}
                          {inquiry.utm_term && (
                            <span className="px-2 py-1 text-xs rounded bg-graphite text-light-gray">
                              term: {inquiry.utm_term}
                            </span>
                          )}
                          {inquiry.utm_content && (
                            <span className="px-2 py-1 text-xs rounded bg-graphite text-light-gray">
                              content: {inquiry.utm_content}
                            </span>
                          )}
                        </div>
                      </details>
                    )}

                    {inquiry.message && (
                      <div className="bg-black/50 border border-graphite rounded-lg p-4 mt-2">
                        <p className="text-light-gray text-sm whitespace-pre-wrap">{inquiry.message}</p>
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
                    <ApproveInquiryModal
                      inquiryId={inquiry.id}
                      schoolName={inquiry.school_name}
                      contactName={inquiry.contact_name}
                      email={inquiry.email}
                      currentStatus={inquiry.status}
                    />
                    {inquiry.status === 'approved' && (
                      <CreateSchoolModal
                        inquiryId={inquiry.id}
                        schoolName={inquiry.school_name}
                        contactName={inquiry.contact_name}
                        email={inquiry.email}
                        alreadyCreated={!!inquiry.school_id}
                      />
                    )}
                    {inquiry.is_test && (
                      <span className="text-xs text-warm-bronze/80">Safe to delete</span>
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
