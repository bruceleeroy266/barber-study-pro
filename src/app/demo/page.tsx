import Link from 'next/link'
import { GraduationCap, Users, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/brand'

export const metadata = {
  title: 'ASCYN PRO — Interactive Demo',
  description: 'Experience the ASCYN PRO student dashboard and instructor portal demos.',
}

export default function DemoLandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[var(--color-background-primary)]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Logo variant="horizontal" theme="dark" size="sm" />
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex text-light-gray hover:text-white transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/pilot"
                className="px-4 py-2 text-sm font-semibold bg-[var(--color-brand-gold)] text-[var(--color-background-primary)] rounded-lg hover:bg-[var(--color-brand-gold-light)] transition-colors"
              >
                Request Pilot Access
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[var(--color-brand-gold)] font-semibold text-sm mb-4">INTERACTIVE DEMO</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            See ASCYN PRO in Action
          </h1>
          <p className="text-xl text-silver max-w-2xl mx-auto">
            Choose the experience that matters most for your role. No account required.
          </p>
        </div>
      </section>

      {/* Demo Cards */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Student Demo */}
          <Link
            href="/demo/student"
            className="group bg-[var(--color-brand-black)] border border-white/10 rounded-2xl p-8 hover:border-[var(--color-brand-gold)]/30 transition-all"
          >
            <div className="w-14 h-14 rounded-xl bg-[var(--color-brand-gold)]/10 flex items-center justify-center text-[var(--color-brand-gold)] mb-6">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Student Dashboard Demo</h2>
            <p className="text-silver mb-6 leading-relaxed">
              See how students track their Board Readiness Score, review focus areas, take board-style quizzes, 
              and learn from mistakes.
            </p>
            <div className="flex items-center text-[var(--color-brand-gold)] font-semibold group-hover:gap-2 transition-all">
              Start Student Demo
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Instructor Demo */}
          <Link
            href="/demo/instructor"
            className="group bg-[var(--color-brand-black)] border border-white/10 rounded-2xl p-8 hover:border-[var(--color-brand-gold)]/30 transition-all"
          >
            <div className="w-14 h-14 rounded-xl bg-[var(--color-brand-gold)]/10 flex items-center justify-center text-[var(--color-brand-gold)] mb-6">
              <Users className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Instructor Portal Demo</h2>
            <p className="text-silver mb-6 leading-relaxed">
              See how instructors identify at-risk students, review class-wide weak areas, drill into individual 
              readiness, and log intervention notes.
            </p>
            <div className="flex items-center text-[var(--color-brand-gold)] font-semibold group-hover:gap-2 transition-all">
              Start Instructor Demo
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          <Link
            href="/demo/request"
            className="group flex flex-col md:flex-row items-center justify-between gap-6 bg-[var(--color-brand-black)] border border-white/10 rounded-2xl p-8 hover:border-[var(--color-brand-gold)]/30 transition-all"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Want a personalized walkthrough?</h2>
              <p className="text-silver leading-relaxed">
                Request a live demo and our team will show you how ASCYN PRO fits your school.
              </p>
            </div>
            <div className="flex items-center text-[var(--color-brand-gold)] font-semibold whitespace-nowrap group-hover:gap-2 transition-all">
              Request a Demo
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Logo variant="horizontal" theme="dark" size="sm" />
            </div>
            <p className="text-silver-gray text-sm">
              © 2026 ASCYN PRO. Built for future licensed professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
