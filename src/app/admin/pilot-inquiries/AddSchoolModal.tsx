'use client'

import { useRef, useState } from 'react'
import { Building2, CheckCircle, Loader2, Plus, X } from 'lucide-react'
import { addSchoolFromAdmin, type AdminAddSchoolResult } from './actions'

interface AddSchoolModalProps {
  defaultOpen?: boolean
}

export default function AddSchoolModal({ defaultOpen = false }: AddSchoolModalProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<AdminAddSchoolResult | null>(null)
  const [error, setError] = useState('')
  const submittingRef = useRef(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current) return

    const form = new FormData(event.currentTarget)
    submittingRef.current = true
    setSubmitting(true)
    setError('')
    setResult(null)

    try {
      const response = await addSchoolFromAdmin({
        schoolName: String(form.get('schoolName') || ''),
        contactName: String(form.get('contactName') || ''),
        email: String(form.get('email') || ''),
        phone: String(form.get('phone') || ''),
        cohortSize: String(form.get('cohortSize') || ''),
      })

      if (!response.success) {
        setError(response.error || 'Unable to add school.')
        return
      }

      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add school.')
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  function close() {
    setIsOpen(false)
    setResult(null)
    setError('')
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--color-brand-gold)] px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        Add School
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-graphite bg-charcoal">
            <div className="flex items-start justify-between border-b border-graphite p-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Add New School</h2>
                <p className="mt-1 text-sm text-silver">
                  Create a Barbering pilot school directly from the platform-admin dashboard.
                </p>
              </div>
              <button type="button" onClick={close} aria-label="Close add school" className="p-2 text-silver hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {result?.success ? (
              <div className="space-y-4 p-6">
                <div className="flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-300">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-semibold">{result.schoolName} was created.</p>
                    <p className="mt-1 text-sm text-emerald-200/80">
                      School ID: {result.schoolId}
                    </p>
                    {result.partialSuccess && (
                      <p className="mt-2 text-sm text-amber-300">
                        School created, but follow-up needs attention: {result.sideEffectError}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-silver">
                  The existing onboarding pipeline also created the default Barbering program and attempted the school-admin invitation.
                </p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-lg bg-[var(--color-brand-gold)] px-4 py-2 text-sm font-semibold text-black"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 p-6">
                <div>
                  <label htmlFor="admin-school-name" className="mb-2 block text-sm font-medium text-light-gray">
                    School name *
                  </label>
                  <input
                    id="admin-school-name"
                    name="schoolName"
                    required
                    autoFocus
                    className="w-full rounded-lg border border-graphite bg-black px-4 py-3 text-white outline-none focus:border-[var(--color-brand-gold)]"
                    placeholder="Elevate Barber & Beauty Academy"
                  />
                </div>

                <div>
                  <label htmlFor="admin-contact-name" className="mb-2 block text-sm font-medium text-light-gray">
                    School admin / contact name *
                  </label>
                  <input
                    id="admin-contact-name"
                    name="contactName"
                    required
                    className="w-full rounded-lg border border-graphite bg-black px-4 py-3 text-white outline-none focus:border-[var(--color-brand-gold)]"
                    placeholder="Aaron Valles"
                  />
                </div>

                <div>
                  <label htmlFor="admin-contact-email" className="mb-2 block text-sm font-medium text-light-gray">
                    School admin email *
                  </label>
                  <input
                    id="admin-contact-email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-graphite bg-black px-4 py-3 text-white outline-none focus:border-[var(--color-brand-gold)]"
                    placeholder="owner@school.com"
                  />
                  <p className="mt-1 text-xs text-silver-gray">
                    ASCYN PRO will use this email for the school-admin invitation.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="admin-school-phone" className="mb-2 block text-sm font-medium text-light-gray">
                      Phone
                    </label>
                    <input
                      id="admin-school-phone"
                      name="phone"
                      type="tel"
                      className="w-full rounded-lg border border-graphite bg-black px-4 py-3 text-white outline-none focus:border-[var(--color-brand-gold)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="admin-cohort-size" className="mb-2 block text-sm font-medium text-light-gray">
                      Barbering students
                    </label>
                    <input
                      id="admin-cohort-size"
                      name="cohortSize"
                      type="number"
                      min="1"
                      max="30"
                      className="w-full rounded-lg border border-graphite bg-black px-4 py-3 text-white outline-none focus:border-[var(--color-brand-gold)]"
                      placeholder="14"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-[var(--color-brand-gold)]/20 bg-[var(--color-brand-gold)]/10 p-4 text-sm text-silver">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-[var(--color-brand-gold)]">
                    <Building2 className="h-4 w-4" />
                    Current pilot scope: Barbering
                  </div>
                  This uses the existing certified flow: create onboarding record → approve → provision school/settings/program → invite school admin.
                </div>

                {error && (
                  <div role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={close} className="px-4 py-2 text-sm font-medium text-silver hover:text-white">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[var(--color-brand-gold)] px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    {submitting ? 'Creating school…' : 'Create School'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
