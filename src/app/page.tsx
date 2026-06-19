import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✂️</span>
              <span className="font-bold text-white text-lg">ASCYN PRO</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-[#D4AF37] text-gray-950 font-semibold rounded-lg hover:bg-[#F4E4A6] transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Master the Art of{' '}
              <span className="text-gradient-gold">Barbering</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Professional barbering education with 21 comprehensive chapters, 
              interactive flashcards, and practice quizzes to help you ace your state board exam.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 bg-[#D4AF37] text-gray-950 font-bold rounded-xl hover:bg-[#F4E4A6] transition-all shadow-lg shadow-[#D4AF37]/20"
              >
                Start Learning Free
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all border border-gray-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Everything You Need to Succeed</h2>
            <p className="text-gray-400">Comprehensive study tools designed for barbering students</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-white mb-3">21 Comprehensive Chapters</h3>
              <p className="text-gray-400">
                Covering everything from history and anatomy to advanced cutting techniques and state board prep.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-3">Interactive Flashcards</h3>
              <p className="text-gray-400">
                Master key terms and concepts with our interactive flashcard system designed for active recall.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-white mb-3">Practice Quizzes</h3>
              <p className="text-gray-400">
                Test your knowledge with chapter quizzes featuring detailed explanations and progress tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900/30 border-y border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">21</div>
              <div className="text-gray-400">Chapters</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">680+</div>
              <div className="text-gray-400">Quiz Questions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">400+</div>
              <div className="text-gray-400">Flashcards</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">100%</div>
              <div className="text-gray-400">Free to Start</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Barbering Journey?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of students preparing for their state board exams with ASCYN PRO.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-[#D4AF37] text-gray-950 font-bold rounded-xl hover:bg-[#F4E4A6] transition-all shadow-lg shadow-[#D4AF37]/20"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">✂️</span>
              <span className="font-semibold text-white">ASCYN PRO</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 ASCYN PRO. Built for future licensed professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
