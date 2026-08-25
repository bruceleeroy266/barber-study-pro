import Link from 'next/link'
import { Metadata } from 'next'
import { Logo } from '@/components/brand'

export const metadata: Metadata = {
  title: 'Pilot Access — ASCYN PRO',
  description: 'ASCYN PRO is currently invite-only. Request pilot access for your school.',
}

export default function SignupPage() {
  return (
    <div className="bg-[var(--color-background-primary)]/80 backdrop-blur-sm border border-[var(--color-border-primary)] rounded-2xl p-8 shadow-2xl text-center">
      <div className="flex justify-center mb-4">
        <Logo variant="compact" size="xl" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-4">Pilot Access Only</h1>
      <p className="text-[var(--color-text-muted)] mb-6">
        ASCYN PRO is currently available by invitation to approved pilot schools.
        Public registration is closed. If your school is part of the pilot program,
        your administrator will provide login credentials.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/pilot"
          className="inline-block py-3 px-6 bg-gradient-to-r from-[var(--color-brand-gold)] to-[var(--color-brand-gold)] text-black font-semibold rounded-lg hover:from-[var(--color-brand-gold-light)] hover:to-[var(--color-brand-gold)] transition-all duration-200"
        >
          Request Pilot Access
        </Link>
        <Link
          href="/login"
          className="inline-block py-3 px-6 bg-[var(--color-background-secondary)] text-white font-semibold rounded-lg hover:bg-[var(--color-border-secondary)] transition-all duration-200 border border-silver-gray"
        >
          Pilot Login
        </Link>
      </div>
      <div className="mt-8 pt-6 border-t border-[var(--color-border-primary)]">
        <Link
          href="/"
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] text-sm transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
