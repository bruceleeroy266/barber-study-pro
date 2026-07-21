'use client'

import { Suspense, useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isSupabaseConfigured, diagnoseSupabaseConfig } from '@/lib/demo-helpers'
import {
  BETA_AGREEMENT_VERSION,
  BETA_AGREEMENT_STORAGE_KEY,
  BETA_AGREEMENT_NEXT_PATH,
} from '@/lib/beta'
import { Printer, ArrowRight, AlertTriangle } from 'lucide-react'

const EFFECTIVE_DATE = 'July 1, 2026'

interface SupabaseErrorLike {
  message?: string
  code?: string
}

function normalizeErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as SupabaseErrorLike).message === 'string'
  ) {
    return (err as SupabaseErrorLike).message as string
  }
  return 'Failed to save your agreement. Please try again.'
}

// Temporary production diagnostic. Reports boolean presence and check results only — never the key.
function logEnvDiagnostic() {
  if (typeof window === 'undefined') return
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  const diag = diagnoseSupabaseConfig()
  // eslint-disable-next-line no-console
  console.log('[ASCYN PRO diagnostic] Supabase config:', {
    urlPresent: diag.urlPresent,
    keyPresent: diag.keyPresent,
    urlLength: diag.urlLength,
    keyLength: diag.keyLength,
    urlValidScheme: diag.urlValidScheme,
    urlNonPlaceholder: diag.urlNonPlaceholder,
    keyLongEnough: diag.keyLongEnough,
    configured: diag.configured,
    demoMode,
  })
}

function BetaAgreementContent() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)
  const [isAcceptPending, startAcceptTransition] = useTransition()
  const [isContinuePending, startContinueTransition] = useTransition()

  useEffect(() => {
    logEnvDiagnostic()

    let cancelled = false

    async function loadExistingAgreement() {
      try {
        const supabaseReady = isSupabaseConfigured()

        if (supabaseReady) {
          const { data: { user }, error: userError } = await supabase.auth.getUser()
          if (userError) {
            console.error('[Beta agreement] getUser error:', userError)
          }
          if (user && !cancelled) {
            const { data } = await supabase
              .from('beta_agreements')
              .select('tester_name, tester_email, agreement_version, accepted_at')
              .eq('user_id', user.id)
              .maybeSingle()

            if (data && !cancelled) {
              setName(data.tester_name || '')
              setEmail(data.tester_email || '')
              setAgreed(true)
              setSaved(true)
              setLoaded(true)
              return
            }
          }
        }

        const raw = typeof window !== 'undefined'
          ? window.localStorage.getItem(BETA_AGREEMENT_STORAGE_KEY)
          : null

        if (raw && !cancelled) {
          const parsed = JSON.parse(raw)
          setName(parsed.name || '')
          setEmail(parsed.email || '')
          setAgreed(true)
          setSaved(true)
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error'
        console.error('[Beta agreement] Failed to load agreement status:', e)
        if (!cancelled) setInitError(message)
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }

    loadExistingAgreement()
    return () => { cancelled = true }
  }, [])

  const canContinue = agreed && saved && name.trim().length > 0 && email.trim().length > 0
  const isBusy = isAcceptPending || isContinuePending

  const resetAcceptance = () => {
    setAgreed(false)
    setSaved(false)
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (agreed) resetAcceptance()
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (agreed) resetAcceptance()
  }

  const handleAgreedChange = (checked: boolean) => {
    setError(null)

    if (!checked) {
      resetAcceptance()
      return
    }

    if (!name.trim() || !email.trim()) {
      setError('Please enter your name and email before accepting the agreement.')
      return
    }

    // Prevent duplicate submissions while a save is already in flight or completed.
    if (saved || isAcceptPending) return

    startAcceptTransition(async () => {
      try {
        const supabaseReady = isSupabaseConfigured()
        let userId: string | null = null

        if (supabaseReady) {
          const { data: { user }, error: userError } = await supabase.auth.getUser()
          if (userError) {
            console.error('[Beta agreement] getUser error during accept:', userError)
          }
          userId = user?.id ?? null
        }

        const acceptedAt = new Date().toISOString()

        if (supabaseReady && userId) {
          // Authenticated users only have SELECT and INSERT on beta_agreements.
          // We explicitly avoid UPDATE/upsert to respect those grants and RLS policies.
          // 1. Check for an existing record first.
          const { data: existing } = await supabase
            .from('beta_agreements')
            .select('id')
            .eq('user_id', userId)
            .eq('agreement_version', BETA_AGREEMENT_VERSION)
            .maybeSingle()

          if (!existing) {
            // 2. Insert once. The unique constraint on (user_id, agreement_version)
            //    prevents duplicates; a race-condition unique violation is treated as success.
            const { error: dbError } = await supabase.from('beta_agreements').insert({
              user_id: userId,
              tester_name: name.trim(),
              tester_email: email.trim(),
              agreement_version: BETA_AGREEMENT_VERSION,
              accepted_at: acceptedAt,
            })

            if (dbError) {
              const isUniqueViolation = dbError.code === '23505'
                || (dbError.message && /duplicate key value/i.test(dbError.message))
                || /beta_agreements_user_version_unique/i.test(dbError.message)

              if (!isUniqueViolation) throw dbError
            }
          }
        }

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            BETA_AGREEMENT_STORAGE_KEY,
            JSON.stringify({
              name: name.trim(),
              email: email.trim(),
              version: BETA_AGREEMENT_VERSION,
              acceptedAt,
              userId,
            })
          )
        }

        setAgreed(true)
        setSaved(true)
      } catch (err: unknown) {
        const message = normalizeErrorMessage(err)
        setError(message)
        setAgreed(false)
        setSaved(false)
      }
    })
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleContinue = () => {
    if (!canContinue || isContinuePending) return

    setError(null)
    startContinueTransition(async () => {
      try {
        // The beta-agreement gate is part of the onboarding flow; the canonical
        // next step is the beta checklist regardless of where the user arrived from.
        await router.push(BETA_AGREEMENT_NEXT_PATH)
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to continue. Please refresh and try again.'
        setError(message)
      }
    })
  }

  if (initError) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-900 border border-red-900/50 rounded-xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Unable to load agreement</h1>
          <p className="text-gray-400 mb-4">
            Supabase initialization failed. Please refresh the page or contact support if the issue persists.
          </p>
          <p className="text-red-400 text-sm mb-6">{initError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-semibold rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 lg:p-8">
      <div className="max-w-3xl mx-auto print:mx-0">
        <div className="mb-8 print:hidden">
          <h1 className="text-3xl font-bold text-white mb-2">
            ASCYN PRO Beta Tester Agreement & Confidentiality Notice
          </h1>
          <p className="text-gray-400">
            Version {BETA_AGREEMENT_VERSION} · Effective {EFFECTIVE_DATE}
          </p>
        </div>

        <div
          id="agreement-document"
          className="bg-gray-900 border border-gray-800 rounded-xl p-6 lg:p-8 mb-8 print:bg-white print:text-black print:border-none print:shadow-none"
        >
          <div className="prose prose-invert max-w-none print:prose-black print:text-sm">
            <h1 className="text-2xl font-bold mb-4 lg:hidden print:block print:text-xl print:mb-2">
              ASCYN PRO Beta Tester Agreement & Confidentiality Notice
            </h1>
            <p className="print:mb-1"><strong>Version:</strong> {BETA_AGREEMENT_VERSION}</p>
            <p className="print:mb-2"><strong>Effective Date:</strong> {EFFECTIVE_DATE}</p>

            <p className="print:mb-2">
              Welcome to the ASCYN PRO private beta program. This Beta Tester Agreement
              (&quot;Agreement&quot;) is a legal agreement between you and ASCYN PRO LLC
              (&quot;ASCYN PRO,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By
              accessing or using the ASCYN PRO beta platform, you agree to be bound by the
              terms below.
            </p>

            <h3 className="print:text-base print:mb-1 print:mt-2">1. Beta Access & Purpose</h3>
            <p>
              ASCYN PRO is in a pre-release testing phase. Your participation helps us
              identify issues, improve features, and refine the learning experience before
              general availability. Beta access is granted on a personal, non-transferable
              basis.
            </p>

            <h3 className="print:text-base print:mb-1 print:mt-2">2. Confidentiality</h3>
            <p className="print:mb-2">
              All beta features, content, designs, quizzes, flashcards, study materials,
              business concepts, communications, and performance data are confidential and
              proprietary to ASCYN PRO LLC. You agree not to disclose, copy, share,
              distribute, post, publish, or otherwise make available any part of the
              platform to any third party without prior written permission.
            </p>

            <h3 className="print:text-base print:mb-1 print:mt-2">3. Ownership</h3>
            <p className="print:mb-2">
              ASCYN PRO LLC retains ownership of platform content, design, quizzes,
              flashcards, study materials, and business concepts. Beta access is private
              and may not be copied, shared, distributed, posted, or used commercially
              without written permission.
            </p>

            <h3 className="print:text-base print:mb-1 print:mt-2">4. Feedback</h3>
            <p className="print:mb-2">
              You may be asked to provide feedback, suggestions, or bug reports. You grant
              ASCYN PRO LLC a perpetual, irrevocable, royalty-free license to use any
              feedback you provide for any purpose.
            </p>

            <h3 className="print:text-base print:mb-1 print:mt-2">5. No Warranty</h3>
            <p className="print:mb-2">
              The beta platform is provided &quot;as is&quot; without warranties of any
              kind. Data, progress, or accounts may be reset or modified without notice
              during the beta period.
            </p>

            <h3 className="print:text-base print:mb-1 print:mt-2">6. Termination</h3>
            <p className="print:mb-2">
              ASCYN PRO LLC may suspend or terminate your beta access at any time, for
              any reason, without notice.
            </p>

            <h3 className="print:text-base print:mb-1 print:mt-2">7. Acceptance</h3>
            <p className="print:mb-2">
              By checking &quot;I agree&quot; below and continuing, you confirm that you
              have read, understood, and agree to this Agreement, and that you are at least
              18 years old or have obtained parental consent.
            </p>

            {/* Print-only acceptance block preserves tester details on the printed page. */}
            <div className="hidden print:block print:mt-4 print:pt-4 print:border-t print:border-black">
              <p className="print:mb-1"><strong>Tester Name:</strong> {name || '____________________'}</p>
              <p className="print:mb-1"><strong>Tester Email:</strong> {email || '____________________'}</p>
              <p className="print:mb-1"><strong>Accepted:</strong> {saved ? 'Yes' : '_________'}</p>
              <p className="print:mb-1"><strong>Version:</strong> {BETA_AGREEMENT_VERSION}</p>
              <p className="print:mb-0"><strong>Date:</strong> {saved ? new Date().toLocaleDateString() : '_________'}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 lg:p-8 mb-8 print:hidden">
          <h2 className="text-lg font-semibold text-white mb-6">Tester Information</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label
                htmlFor="tester-name"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Tester Name
              </label>
              <input
                id="tester-name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                disabled={isBusy}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] disabled:opacity-50"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="tester-email"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Tester Email
              </label>
              <input
                id="tester-email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                disabled={isBusy}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] disabled:opacity-50"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>

          <div className="flex items-start gap-3 mb-6">
            <input
              id="agree-checkbox"
              type="checkbox"
              checked={agreed}
              onChange={(e) => handleAgreedChange(e.target.checked)}
              disabled={isBusy}
              className="mt-1 h-5 w-5 rounded border-gray-700 bg-gray-800 text-[#D4AF37] focus:ring-[#D4AF37] disabled:opacity-50"
            />
            <label htmlFor="agree-checkbox" className="text-gray-300">
              I agree to the ASCYN PRO Beta Tester Agreement & Confidentiality Notice.
            </label>
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4" role="alert">
              {error}
            </p>
          )}

          {saved && !error && (
            <p className="text-green-400 text-sm mb-4">
              Agreement accepted. You may continue to the checklist.
            </p>
          )}

          {!loaded && (
            <p className="text-gray-500 text-sm mb-4">Loading agreement status…</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors print:hidden"
            >
              <Printer className="w-5 h-5" />
              Print Agreement
            </button>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue || isContinuePending}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#c4a030] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors print:hidden"
            >
              {isContinuePending ? 'Continuing…' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BetaAgreementPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="max-w-3xl mx-auto text-center text-gray-400">
          Loading agreement…
        </div>
      </div>
    }>
      <BetaAgreementContent />
    </Suspense>
  )
}
