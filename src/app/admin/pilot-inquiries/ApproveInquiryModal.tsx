'use client'

import { useState, useRef } from 'react'
import { X, CheckCircle, AlertCircle, Loader2, ShieldCheck } from 'lucide-react'
import { approvePilotInquiry } from './actions'
import type { ApprovePilotInquiryResult } from './actions'

interface ApproveInquiryModalProps {
  inquiryId: string
  schoolName: string
  contactName: string
  email: string
  /** Current inquiry status (new | contacted | approved | declined | spam). */
  currentStatus: string
}

export default function ApproveInquiryModal({
  inquiryId,
  schoolName,
  contactName,
  email,
  currentStatus,
}: ApproveInquiryModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'confirming' | 'submitting' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<ApprovePilotInquiryResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const submittingRef = useRef(false)

  // Only new/contacted inquiries can be approved. Approved inquiries render
  // nothing here (the Create School flow takes over). Declined/spam are
  // terminal for this workflow.
  if (currentStatus !== 'new' && currentStatus !== 'contacted') {
    return null
  }

  async function handleApprove() {
    // Prevent double submission (client-side UX only; server/database
    // protections remain authoritative).
    if (submittingRef.current) return
    submittingRef.current = true

    setStatus('submitting')
    setErrorMessage('')
    setResult(null)

    try {
      const res = await approvePilotInquiry(inquiryId)

      if (res.success) {
        setResult(res)
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMessage(res.error || 'Approval failed.')
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
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[var(--color-brand-black)] bg-[var(--color-brand-gold)] rounded-lg hover:bg-[var(--color-brand-gold-light)] transition-colors"
      >
        <CheckCircle className="w-3.5 h-3.5" />
        Approve
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-charcoal border border-graphite rounded-2xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-graphite">
              <div>
                <h3 className="text-lg font-semibold text-white">Approve Pilot Inquiry</h3>
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
                      This will approve the pilot inquiry from:
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
                        Approval marks this inquiry as eligible for school creation.
                        Creating the school remains a separate, explicit action.
                      </p>
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
                      onClick={handleApprove}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-brand-black)] bg-[var(--color-brand-gold)] rounded-lg hover:bg-[var(--color-brand-gold-light)] transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Confirm Approval
                    </button>
                  </div>
                </>
              )}

              {/* Submitting state */}
              {status === 'submitting' && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Loader2 className="w-8 h-8 text-[var(--color-brand-gold)] animate-spin" />
                  <p className="text-light-gray text-sm">Approving inquiry...</p>
                </div>
              )}

              {/* Success state */}
              {status === 'success' && result && (
                <>
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        {result.alreadyApproved
                          ? 'This inquiry was already approved.'
                          : 'Inquiry approved successfully!'}
                      </p>
                      <p className="text-emerald-400/80 text-xs mt-1">
                        The inquiry is now eligible for school creation.
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
                      <p className="font-medium">Approval failed.</p>
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
                      className="px-4 py-2 text-sm font-medium text-[var(--color-brand-black)] bg-[var(--color-brand-gold)] rounded-lg hover:bg-[var(--color-brand-gold-light)] transition-colors"
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
