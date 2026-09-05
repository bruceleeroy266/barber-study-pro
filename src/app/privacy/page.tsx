import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/brand'

export const metadata: Metadata = {
  title: 'Privacy Policy — ASCYN PRO',
  description: 'How ASCYN PRO collects, uses, protects, and retains information.',
}

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-[var(--color-brand-gold)] mb-3">Privacy Policy</h1>
          <p className="text-[var(--color-text-muted)]">Last updated: September 5, 2026</p>
        </div>

        <Section title="1. Introduction">
          <p>ASCYN PRO is committed to protecting the information entrusted to us. This policy explains the information we collect, why we use it, how long certain information is retained, and the choices available to users.</p>
        </Section>

        <Section title="2. Information We Collect">
          <p>Depending on how you use ASCYN PRO, we may collect account and contact information, school or program affiliation, study activity, quiz and assessment results, progress and readiness information, pilot inquiry information, and communications you send to us.</p>
          <p>Our systems may also process technical information needed to operate and secure the service, such as IP address, browser or device information, timestamps, and security or audit events.</p>
        </Section>

        <Section title="3. How We Use Information">
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and secure ASCYN PRO.</li>
            <li>Deliver study, progress, readiness, and instructor features.</li>
            <li>Support school pilots and respond to inquiries.</li>
            <li>Diagnose problems, prevent abuse, and maintain security records.</li>
            <li>Improve the service and communicate important service information.</li>
          </ul>
        </Section>

        <Section title="4. Information Sharing">
          <p>ASCYN PRO does not sell or rent personal information. Information may be shared with service providers that help us operate the service, when required by law, to protect rights or security, or as part of a legitimate business transaction. Access within a participating school is limited according to authorized roles and the features provided to that school.</p>
        </Section>

        <Section title="5. Data Security">
          <p>We use technical and organizational safeguards designed to protect information from unauthorized access, alteration, disclosure, or loss. No internet-based service can guarantee absolute security.</p>
        </Section>

        <Section title="6. Data Retention and Deletion">
          <p>ASCYN PRO does not intend to retain pilot information indefinitely. Our current pilot retention schedule is:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-white">Pilot/student educational data:</strong> retained for up to 90 days after pilot termination or account deactivation, then deleted or de-identified as applicable.</li>
            <li><strong className="text-white">Security and audit logs:</strong> retained for up to 12 months.</li>
            <li><strong className="text-white">Unsuccessful pilot inquiries:</strong> retained for up to 12 months.</li>
          </ul>
          <p>Information may be retained longer when required by law, needed to resolve a dispute, or necessary to protect the security and integrity of the service. Requests concerning access, correction, or deletion can be submitted through our Contact page.</p>
        </Section>

        <Section title="7. Analytics and Cookies">
          <p>ASCYN PRO may use cookies that are necessary for authentication, security, and core service functionality. Google Analytics 4 and Microsoft Clarity are configured for the service but are not currently active for production analytics collection. If that status changes, this policy will be updated to describe the applicable analytics use.</p>
        </Section>

        <Section title="8. Your Choices and Rights">
          <p>Depending on applicable law and your relationship with a participating school, you may request access to, correction of, or deletion of personal information. Marketing communications, when offered, will include an appropriate way to opt out.</p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>ASCYN PRO is designed for professional licensing education and is not directed to children under 13. Participating schools are responsible for ensuring that use of the service is appropriate for their students and consistent with applicable requirements.</p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>We may update this policy as ASCYN PRO and its practices change. The current version will display its last-updated date on this page.</p>
        </Section>

        <Section title="11. Contact Us">
          <p>For privacy questions, data requests, or other concerns, please use the <Link href="/contact" className="text-[var(--color-brand-gold)] hover:underline">ASCYN PRO Contact page</Link>. This avoids directing privacy requests to an unverified mailbox.</p>
        </Section>

        <div className="border-t border-white/10 pt-6 text-sm text-[var(--color-text-muted)]">
          ASCYN PRO is an independent educational resource and is not a licensing authority. Educational content does not guarantee licensing-exam success.
        </div>
        <div className="flex gap-4 text-sm pb-8">
          <Link href="/" className="text-[var(--color-brand-gold)] hover:underline">Home</Link>
          <Link href="/terms" className="text-[var(--color-brand-gold)] hover:underline">Terms of Service</Link>
          <Link href="/contact" className="text-[var(--color-brand-gold)] hover:underline">Contact</Link>
        </div>
      </article>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="bg-[var(--color-background-secondary)] border border-white/10 rounded-2xl p-6 space-y-4 text-[var(--color-text-secondary)]"><h2 className="text-xl font-semibold text-white">{title}</h2>{children}</section>
}
