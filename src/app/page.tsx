import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="ASCYN PRO" className="h-7 w-auto" />
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                Pilot Login
              </Link>
              <Link
                href="/demo"
                className="px-4 py-2 text-sm font-semibold text-white border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
              >
                View Demo
              </Link>
              <Link
                href="/pilot"
                className="px-4 py-2 text-sm font-semibold bg-[#D4AF37] text-[#0a0a0a] rounded-lg hover:bg-[#F4E4A6] transition-colors"
              >
                Request Pilot Access
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#D4AF37]/[0.03] rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
              </span>
              Now piloting in Oklahoma schools
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
              See Learning Gaps{' '}
              <span className="text-[#D4AF37]">Before the Exam</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-10 leading-relaxed max-w-3xl mx-auto">
              ASCYN PRO is a professional licensing platform that gives students focused practice, 
              instructors early insight, and schools measurable readiness before board exam day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pilot"
                className="px-8 py-4 bg-[#D4AF37] text-[#0a0a0a] font-bold rounded-xl hover:bg-[#F4E4A6] transition-all shadow-lg shadow-[#D4AF37]/20 text-center"
              >
                Request Pilot Access
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition-all border border-white/10 text-center"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 border-y border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for the Entire Learning Ecosystem</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              One platform that connects students, instructors, and schools around a single goal: 
              more licensed professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 hover:border-[#D4AF37]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-2xl mb-6">🎓</div>
              <h3 className="text-xl font-semibold text-white mb-3">For Students</h3>
              <p className="text-gray-400 leading-relaxed">
                Personalized practice, clear weak-area tracking, and a Board Readiness Score that shows 
                exactly where to focus before test day.
              </p>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 hover:border-[#D4AF37]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-2xl mb-6">📊</div>
              <h3 className="text-xl font-semibold text-white mb-3">For Instructors</h3>
              <p className="text-gray-400 leading-relaxed">
                Real-time dashboards that surface at-risk students and weak topic areas, so intervention 
                happens earlier and more effectively.
              </p>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 hover:border-[#D4AF37]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-2xl mb-6">🏫</div>
              <h3 className="text-xl font-semibold text-white mb-3">For Schools</h3>
              <p className="text-gray-400 leading-relaxed">
                School-wide readiness reporting, cohort progress tracking, and the data to support 
                accreditation and continuous improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Readiness Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-[#D4AF37] font-semibold mb-4">STUDENT READINESS</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Stop Guessing. Start Measuring.
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Students know where they stand every time they log in. ASCYN PRO turns study time into 
                targeted progress with diagnostics, adaptive practice, and a readiness score weighted 
                to actual board exam coverage.
              </p>
              <ul className="space-y-4">
                {[
                  'Personalized study plans based on weak areas',
                  'Board Readiness Score updated with every quiz',
                  'Flashcards, diagnostics, and retest loops in one place',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span className="text-[#D4AF37] mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Your Board Readiness</div>
                  <div className="text-4xl font-bold text-[#D4AF37]">78%</div>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
                  On Track
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Infection Control', value: 92 },
                  { label: 'Anatomy & Physiology', value: 85 },
                  { label: 'Chemical Services', value: 64 },
                  { label: 'State Rules & Laws', value: 71 },
                ].map((skill) => (
                  <div key={skill.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">{skill.label}</span>
                      <span className="text-gray-500">{skill.value}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D4AF37] rounded-full"
                        style={{ width: `${skill.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor Insight Section */}
      <section className="py-20 lg:py-28 border-y border-white/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 bg-[#111111] border border-white/10 rounded-2xl p-8">
              <div className="text-sm text-gray-500 mb-4">Class Overview</div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-white">24</div>
                  <div className="text-sm text-gray-500">Active Students</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-2xl font-bold text-[#D4AF37]">6</div>
                  <div className="text-sm text-gray-500">At Risk</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Alex Johnson', risk: 'High', topic: 'Chemical Texture' },
                  { name: 'Maria Garcia', risk: 'Medium', topic: 'State Rules' },
                  { name: 'Jordan Smith', risk: 'Medium', topic: 'Infection Control' },
                ].map((student) => (
                  <div key={student.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">Weak area: {student.topic}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      student.risk === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {student.risk} Risk
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="text-[#D4AF37] font-semibold mb-4">INSTRUCTOR INSIGHT</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Intervene Earlier. Teach Smarter.
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Instructors see risk before it becomes failure. ASCYN PRO flags struggling students, 
                highlights class-wide weak areas, and gives you the data to guide review sessions 
                with confidence.
              </p>
              <ul className="space-y-4">
                {[
                  'At-a-glance risk levels for every student',
                  'Class and cohort progress reporting',
                  'Weak-area analytics by chapter and topic',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span className="text-[#D4AF37] mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* School Pilot Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-[#D4AF37] font-semibold mb-4">SCHOOL PILOT PROGRAM</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Partner With Us for the Fall Semester
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  We are looking for three Oklahoma schools to pilot ASCYN PRO with one cohort for one semester. 
                  No financial commitment. Transparent collaboration. Real student outcomes.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    'One cohort, one semester',
                    'No financial commitment',
                    'Weekly readiness reports',
                    'Dedicated onboarding support',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-300">
                      <span className="text-[#D4AF37]">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
                <Link
                  href="/pilot"
                  className="inline-flex px-8 py-4 bg-[#D4AF37] text-[#0a0a0a] font-bold rounded-xl hover:bg-[#F4E4A6] transition-all shadow-lg shadow-[#D4AF37]/20"
                >
                Request Pilot Access
                </Link>
              </div>
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
                <div className="text-sm text-gray-500 mb-6">Pilot Timeline</div>
                <div className="space-y-6">
                  {[
                    { week: 'Week 1', title: 'Setup & Onboarding', desc: 'School accounts, instructor training, curriculum alignment' },
                    { week: 'Weeks 2–10', title: 'Active Pilot', desc: 'Students practice, instructors review weekly reports' },
                    { week: 'Weeks 11–12', title: 'Results & Review', desc: 'Pilot summary report and next-step recommendations' },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-[#D4AF37] text-sm font-medium">{step.week}</div>
                        <div className="text-white font-semibold">{step.title}</div>
                        <div className="text-gray-500 text-sm">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Bring ASCYN PRO to Your School?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            See the platform in action or request a pilot spot for the upcoming semester.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pilot"
              className="px-8 py-4 bg-[#D4AF37] text-[#0a0a0a] font-bold rounded-xl hover:bg-[#F4E4A6] transition-all shadow-lg shadow-[#D4AF37]/20"
            >
                Request Pilot Access
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition-all border border-white/10"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <img src="/logo.svg" alt="ASCYN PRO" className="h-6 w-auto" />
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="text-gray-500 hover:text-white text-sm transition-colors"
              >
                Pilot Login
              </Link>
              <Link
                href="/pilot"
                className="text-gray-500 hover:text-white text-sm transition-colors"
              >
                Request Pilot Access
              </Link>
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
