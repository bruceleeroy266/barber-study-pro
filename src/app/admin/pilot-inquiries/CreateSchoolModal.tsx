'use client'

import { useState, useRef } from 'react'
import { X, Building2, CheckCircle, AlertCircle, Loader2, ShieldCheck } from 'lucide-react'
import { createSchoolFromInquiry } from './actions'
import type { CreateSchoolResult } from './actions'

interface CreateSchoolModalProps {
  inquiryId: string
  schoolName: string
  contactName: string
  email: string
  /** Whether a school has already been created for this inquiry. */
  alreadyCreated: boolean
}

export default function CreateSchoolModal({
  inquiryId,
  schoolName,
  contactName,
  email,
  alreadyCreated,
}: CreateSchoolModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'confirming' | 'submitting' | 'success' | 'partial' | 'error'>('idle')
  const [result, setResult] = useState<CreateSchoolResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const submittingRef = useRef(false)

  // If school already exists, show the existing state instead of the button.
  if (alreadyCreated) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gold bg-gold/10 border border-gold/20 rounded-lg">
        <Building2 className="w-3.5 h-3.5" />
        School Created
      </span>
    )
  }

  async function handleCreate() {
    // Prevent double submission (client-side UX only; server/database
    // protections remain authoritative).
    if (submittingRef.current) return
    submittingRef.current = true

    setStatus('submitting')
    setErrorMessage('')
    setResult(null)

    try {
      const res = await createSchoolFromInquiry(inquiryId)

      if (res.success) {
        setResult(res)
        if (res.partialSuccess) {
          setStatus('partial')
        } else {
          setStatus('success')
        }
      } else {
        setStatus('error')
        setErrorMessage(res.error || 'School creation failed.')
      }
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      submittingRef.current = false
    }
  }

  function handleClose() {
    setIsOpen(false)
    // Reset state after modal close animation completes.
    setTimeout(() => {
      setStatus('idle')
      setResult(null)
      setErrorMessage('')
    }, 200)
  }

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true)
          setStatus('confirming')
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[var(--color-brand-black)] bg-emerald-500 rounded-lg hover:bg-emerald-400 transition-colors"
      >
        <Building2 className="w-3.5 h-3.5" />
        Create School
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-charcoal border border-graphite rounded-2xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-graphite">
              <div>
                <h3 className="text-lg font-semibold text-white">Create School</h3>
                <p className="text-sm text-silver mt-1">{schoolName}</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-silver hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Confirmation state */}
              {status === 'confirming' && (
                <>
                  <div className="bg-black/50 border border-graphite rounded-lg p-4 space-y-3">
                    <p className="text-light-gray text-sm">
                      This will create a new school from the approved pilot inquiry:
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-silver-gray">School Name:</span>
                        <span className="text-white font-medium">{schoolName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-silver-gray">Contact:</span>
                        <span className="text-white">{contactName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-silver-gray">Email:</span>
                        <span className="text-white">{email}</span>
                      </div>
                    </div>
                    <div className="border-t border-graphite pt-3 mt-3">
                      <p className="text-silver-gray text-xs">
                        This action will:
                      </p>
                      <ul className="text-silver-gray text-xs mt-1 space-y-1 list-disc list-inside">
                        <li>Create the school record with default settings</li>
                        <li>Create a default program</li>
                        <li>Send a school admin invitation to {email}</li>
                        <li>Notify the platform owner</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-light-gray hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCreate}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-brand-black)] bg-emerald-500 rounded-lg hover:bg-emerald-400 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Confirm & Create School
                    </button>
                  </div>
                </>
              )}

              {/* Submitting state */}
              {status === 'submitting' && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                  <p className="text-light-gray text-sm">Creating school...</p>
                  <p className="text-silver-gray text-xs">This may take a few seconds.</p>
                </div>
              )}

              {/* Success state */}
              {status === 'success' && result && (
                <>
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        {result.alreadyExisted
                          ? 'School already exists for this inquiry.'
                          : 'School created successfully!'}
                      </p>
                      <p className="text-emerald-400/80 text-xs mt-1">
                        School: {result.schoolName} • ID: {result.schoolId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-[var(--color-brand-black)] bg-[var(--color-brand-gold)] rounded-lg hover:bg-[var(--color-brand-gold-light)] transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </>
              )}

              {/* Partial success state */}
              {status === 'partial' && result && (
                <>
                  <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">School created with warnings.</p>
                      <p className="text-amber-400/80 text-xs mt-1">
                        The school was created successfully, but some follow-up actions failed:
                      </p>
                      <p className="text-amber-400/80 text-xs mt-1">
                        {result.sideEffectError}
                      </p>
                      <p className="text-amber-400/80 text-xs mt-2">
                        School: {result.schoolName} • ID: {result.schoolId}
                      </p>
                      <p className="text-amber-400/60 text-xs mt-1">
                        The school record is preserved. You can retry the failed actions manually.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-[var(--color-brand-black)] bg-[var(--color-brand-gold)] rounded-lg hover:bg-[var(--color-brand-gold-light)] transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </>
              )}

              {/* Error state */}
              {status === 'error' && (
                <>
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">School creation failed.</p>
                      <p className="text-red-400/80 text-xs mt-1">{errorMessage}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-light-gray hover:text-white transition-colors"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('confirming')}
                      className="px-4 py-2 text-sm font-medium text-[var(--color-brand-black)] bg-emerald-500 rounded-lg hover:bg-emerald-400 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
