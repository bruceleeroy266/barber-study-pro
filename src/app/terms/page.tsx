import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/brand'

export const metadata: Metadata = {
  title: 'Terms of Service — ASCYN PRO',
  description: 'Terms governing use of ASCYN PRO educational services.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background-primary)] text-white">
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
          <Link href="/" aria-label="ASCYN PRO home"><Logo variant="full" size="xl" /></Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/demo" className="text-[var(--color-text-secondary)] hover:text-white">Demo</Link>
            <Link href="/pilot" className="text-[var(--color-text-secondary)] hover:text-white">Pilot</Link>
            <Link href="/contact" className="text-[var(--color-brand-gold)] hover:underline">Contact</Link>
          </nav>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-brand-gold)] mb-3">Terms of Service</h1>
          <p className="text-[var(--color-text-muted)]">Last updated: September 5, 2026</p>
        </div>

        <div className="border-l-4 border-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10 p-5 rounded-r-xl text-[var(--color-text-secondary)]">
          <strong className="text-white">Educational disclaimer:</strong> ASCYN PRO is an independent educational resource. It is not a licensing authority, and use of ASCYN PRO does not guarantee passage of a licensing examination. Users should verify current licensing requirements with the applicable official authority.
        </div>

        <Section title="1. Agreement to Terms"><p>By accessing or using ASCYN PRO, you agree to these Terms of Service. If you do not agree, do not use the service.</p></Section>
        <Section title="2. Description of Service"><p>ASCYN PRO provides educational and licensing-readiness tools, including study content, flashcards, practice assessments, progress tracking, learning-gap identification, readiness information, and instructor or school reporting features where available.</p></Section>
        <Section title="3. Accounts and Authorized Access"><p>Users must provide accurate account information, protect their credentials, and use only the access assigned to them. School, instructor, and administrative features may be restricted by role and organization. Account sharing, unauthorized access, and attempts to bypass access controls are prohibited.</p></Section>
        <Section title="4. School Pilot Program"><p>Where a school participates in an ASCYN PRO pilot, the applicable pilot agreement and approved pilot terms govern that participation. Public pilot information does not create a purchase obligation, automatic renewal, or guarantee of continued access beyond the agreed pilot period.</p></Section>
        <Section title="5. Intellectual Property"><p>ASCYN PRO branding, software, original questions, graphics, and other original platform materials are protected by applicable intellectual-property laws. Users may not reproduce, distribute, sell, reverse engineer, or commercially exploit protected ASCYN PRO materials except as expressly authorized.</p></Section>
        <Section title="6. Acceptable Use"><ul className="list-disc pl-6 space-y-2"><li>Do not use the service for unlawful or abusive purposes.</li><li>Do not attempt unauthorized access or interfere with service operation.</li><li>Do not upload malicious code or misuse another person's account.</li><li>Do not scrape, copy, or redistribute protected platform content without authorization.</li></ul></Section>
        <Section title="7. Educational Content and Exam Information"><p>ASCYN PRO is supplemental educational technology, not an official exam provider or licensing authority. Exam requirements, laws, rules, and testing specifications can change. Users and participating schools remain responsible for verifying current official requirements.</p></Section>
        <Section title="8. Disclaimer of Warranties"><p>To the extent permitted by law, the service is provided “as is” and “as available.” ASCYN PRO does not warrant uninterrupted or error-free operation, guarantee that every item is current in every jurisdiction, or guarantee any particular examination, licensing, academic, or employment outcome.</p></Section>
        <Section title="9. Limitation of Liability"><p>To the fullest extent permitted by applicable law, ASCYN PRO LLC will not be liable for indirect, incidental, special, consequential, or punitive damages arising from use of the service. Where liability cannot be excluded, it will be limited to the extent permitted by law.</p></Section>
        <Section title="10. Suspension, Changes, and Termination"><p>We may modify, suspend, or discontinue features when reasonably necessary for security, maintenance, legal compliance, or service development. Access may be suspended or terminated for material violations of these terms or applicable agreements.</p></Section>
        <Section title="11. Privacy"><p>Use of ASCYN PRO is also subject to our <Link href="/privacy" className="text-[var(--color-brand-gold)] hover:underline">Privacy Policy</Link>, including the retention practices described there.</p></Section>
        <Section title="12. Governing Law"><p>These Terms are governed by the laws of the State of Oklahoma, without regard to conflict-of-law principles, except where applicable law requires otherwise.</p></Section>
        <Section title="13. Changes to These Terms"><p>We may update these Terms as the service changes. The current version will display its last-updated date. Continued use after an effective update constitutes acceptance to the extent permitted by law.</p></Section>
        <Section title="14. Contact"><p>Questions about these Terms can be submitted through the <Link href="/contact" className="text-[var(--color-brand-gold)] hover:underline">ASCYN PRO Contact page</Link>.</p></Section>

        <div className="flex gap-4 text-sm border-t border-white/10 pt-6 pb-8">
          <Link href="/" className="text-[var(--color-brand-gold)] hover:underline">Home</Link>
          <Link href="/privacy" className="text-[var(--color-brand-gold)] hover:underline">Privacy Policy</Link>
          <Link href="/contact" className="text-[var(--color-brand-gold)] hover:underline">Contact</Link>
        </div>
      </article>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="bg-[var(--color-background-secondary)] border border-white/10 rounded-2xl p-6 space-y-4 text-[var(--color-text-secondary)]"><h2 className="text-xl font-semibold text-white">{title}</h2>{children}</section>
}
