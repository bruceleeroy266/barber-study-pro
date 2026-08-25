import Link from 'next/link'
import { GraduationCap, Users, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/brand'

export const metadata = {
  title: 'ASCYN PRO — Experience the Demo',
  description: 'Choose your ASCYN PRO demonstration experience. See how students prepare and instructors monitor progress.',
}

export default function DemoLandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] text-white flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[var(--color-background-primary)]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[88px]">
            <Link href="/" className="flex items-center">
              <Logo variant="compact" size="lg" className="sm:hidden" />
              <Logo variant="compact" width={80} className="hidden sm:block lg:hidden" />
              <Logo variant="full" width={180} className="hidden lg:block" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-5xl mx-auto w-full text-center">
          {/* Demo Environment Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-silver text-sm mb-8">
            <span className="w-2 h-2 bg-[var(--color-brand-gold)] rounded-full animate-pulse" />
            Demo Environment · Fictional Data
          </div>

          {/* Hero */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            Experience ASCYN PRO
          </h1>
          
          <p className="text-xl sm:text-2xl text-silver max-w-2xl mx-auto mb-4 leading-relaxed">
            See how ASCYN PRO helps students prepare and gives instructors a clearer view of where support is needed.
          </p>

          {/* Tagline */}
          <p className="text-[var(--color-brand-gold)] font-semibold text-lg mb-12 tracking-wide">
            Elevate. Learn. Succeed.
          </p>

          {/* Primary Experience Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-12">
            {/* Student Experience */}
            <Link
              href="/demo/student"
              className="group relative bg-[var(--color-brand-black)] border-2 border-white/10 rounded-2xl p-8 sm:p-10 hover:border-[var(--color-brand-gold)]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--color-brand-gold)]/5 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[var(--color-brand-gold)]/10 flex items-center justify-center text-[var(--color-brand-gold)] mb-6 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Student Experience
                </h2>
                
                <p className="text-silver text-base sm:text-lg mb-8 leading-relaxed">
                  See how students study, track progress, identify areas to improve, and prepare for their licensing exam.
                </p>
                
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-brand-gold)] text-[var(--color-background-primary)] font-bold rounded-xl group-hover:bg-[var(--color-brand-gold-light)] transition-colors text-base sm:text-lg">
                  Explore Student View
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Instructor Experience */}
            <Link
              href="/demo/instructor"
              className="group relative bg-[var(--color-brand-black)] border-2 border-white/10 rounded-2xl p-8 sm:p-10 hover:border-[var(--color-brand-gold)]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--color-brand-gold)]/5 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[var(--color-brand-gold)]/10 flex items-center justify-center text-[var(--color-brand-gold)] mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Instructor Experience
                </h2>
                
                <p className="text-silver text-base sm:text-lg mb-8 leading-relaxed">
                  See how instructors monitor class progress, identify students who need support, and understand where learning gaps are developing.
                </p>
                
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-brand-gold)] text-[var(--color-background-primary)] font-bold rounded-xl group-hover:bg-[var(--color-brand-gold-light)] transition-colors text-base sm:text-lg">
                  Explore Instructor View
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* Invitation Text */}
          <p className="text-silver-gray text-sm sm:text-base mb-8">
            Choose an experience to begin.
          </p>

          {/* Secondary CTA — Demo Request */}
          <div className="border-t border-white/10 pt-8 mt-4">
            <p className="text-silver-gray text-sm mb-4">
              Want a personalized walkthrough for your school?
            </p>
            <Link
              href="/demo/request"
              className="inline-flex items-center gap-2 text-[var(--color-brand-gold)] font-medium hover:text-[var(--color-brand-gold-light)] transition-colors text-sm sm:text-base"
            >
              Request a guided demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo variant="full" size="md" />
            <p className="text-silver-gray text-sm">
              © 2026 ASCYN PRO. Built for future licensed professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
