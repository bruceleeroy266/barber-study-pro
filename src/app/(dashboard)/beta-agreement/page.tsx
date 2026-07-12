'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isSupabaseConfigured } from '@/lib/demo-helpers'
import { BETA_AGREEMENT_VERSION, BETA_AGREEMENT_STORAGE_KEY } from '@/lib/beta'
import { Printer, ArrowRight } from 'lucide-react'

const EFFECTIVE_DATE = 'July 1, 2026'

function BetaAgreementContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard/beta-checklist'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadExistingAgreement() {
      try {
        const supabaseReady = isSupabaseConfigured()

        if (supabaseReady) {
          const { data: { user } } = await supabase.auth.getUser()
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
        // Ignore localStorage or network errors during initial load.
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }

    loadExistingAgreement()
    return () => { cancelled = true }
  }, [])

  const canContinue = agreed && name.trim().length > 0 && email.trim().length > 0

  const handleNameChange = (value: string) => {
    setName(value)
    if (agreed) {
      setAgreed(false)
      setSaved(false)
    }
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (agreed) {
      setAgreed(false)
      setSaved(false)
    }
  }

  const handleAgreedChange = async (checked: boolean) => {
    setError(null)

    if (!checked) {
      setAgreed(false)
      setSaved(false)
      return
    }

    if (!name.trim() || !email.trim()) {
      setError('Please enter your name and email before accepting the agreement.')
      return
    }

    setSaving(true)

    try {
      let userId: string | null = null
      const supabaseReady = isSupabaseConfigured()

      if (supabaseReady) {
        const { data: { user } } = await supabase.auth.getUser()
        userId = user?.id ?? null
      }

      const acceptedAt = new Date().toISOString()

      if (supabaseReady) {
        const { error: dbError } = await supabase.from('beta_agreements').insert({
          tester_name: name.trim(),
          tester_email: email.trim(),
          agreement_version: BETA_AGREEMENT_VERSION,
          accepted_at: acceptedAt,
          user_id: userId,
        })

        if (dbError) throw dbError
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(BETA_AGREEMENT_STORAGE_KEY, JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          version: BETA_AGREEMENT_VERSION,
          acceptedAt,
          userId,
        }))
      }

      setAgreed(true)
      setSaved(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save your agreement. Please try again.'
      setError(message)
      setAgreed(false)
      setSaved(false)
    } finally {
      setSaving(false)
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleContinue = () => {
    if (canContinue) {
      router.push(redirectPath)
    }
  }

  return (
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
        <div className="prose prose-invert max-w-none print:prose-black">
          <h1 className="text-2xl font-bold mb-4 lg:hidden print:block">
            ASCYN PRO Beta Tester Agreement & Confidentiality Notice
          </h1>
          <p><strong>Version:</strong> {BETA_AGREEMENT_VERSION}</p>
          <p><strong>Effective Date:</strong> {EFFECTIVE_DATE}</p>

          <p>
            Welcome to the ASCYN PRO private beta program. This Beta Tester Agreement
            (&quot;Agreement&quot;) is a legal agreement between you and ASCYN PRO LLC
            (&quot;ASCYN PRO,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By
            accessing or using the ASCYN PRO beta platform, you agree to be bound by the
            terms below.
          </p>

          <h3>1. Beta Access & Purpose</h3>
          <p>
            ASCYN PRO is in a pre-release testing phase. Your participation helps us
            identify issues, improve features, and refine the learning experience before
            general availability. Beta access is granted on a personal, non-transferable
            basis.
          </p>

          <h3>2. Confidentiality</h3>
          <p>
            All beta features, content, designs, quizzes, flashcards, study materials,
            business concepts, communications, and performance data are confidential and
            proprietary to ASCYN PRO LLC. You agree not to disclose, copy, share,
            distribute, post, publish, or otherwise make available any part of the
            platform to any third party without prior written permission.
          </p>

          <h3>3. Ownership</h3>
          <p>
            ASCYN PRO LLC retains ownership of platform content, design, quizzes,
            flashcards, study materials, and business concepts. Beta access is private
            and may not be copied, shared, distributed, posted, or used commercially
            without written permission.
          </p>

          <h3>4. Feedback</h3>
          <p>
            You may be asked to provide feedback, suggestions, or bug reports. You grant
            ASCYN PRO LLC a perpetual, irrevocable, royalty-free license to use any
            feedback you provide for any purpose.
          </p>

          <h3>5. No Warranty</h3>
          <p>
            The beta platform is provided &quot;as is&quot; without warranties of any
            kind. Data, progress, or accounts may be reset or modified without notice
            during the beta period.
          </p>

          <h3>6. Termination</h3>
          <p>
            ASCYN PRO LLC may suspend or terminate your beta access at any time, for
            any reason, without notice.
          </p>

          <h3>7. Acceptance</h3>
          <p>
            By checking &quot;I agree&quot; below and continuing, you confirm that you
            have read, understood, and agree to this Agreement, and that you are at least
            18 years old or have obtained parental consent.
          </p>
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
              disabled={saving}
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
              disabled={saving}
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
            disabled={saving}
            className="mt-1 h-5 w-5 rounded border-gray-700 bg-gray-800 text-[#D4AF37] focus:ring-[#D4AF37]"
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
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <Printer className="w-5 h-5" />
            Print Agreement
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#c4a030] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BetaAgreementPage() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto p-8 text-center text-gray-400">
        Loading agreement…
      </div>
    }>
      <BetaAgreementContent />
    </Suspense>
  )
}
