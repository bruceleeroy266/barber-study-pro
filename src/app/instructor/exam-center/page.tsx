import Link from 'next/link'

export default function InstructorExamCenterPage() {
  return (
    <div className="min-w-0 space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-gold">Instructor Only</p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Exam Center</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-silver">
          Find teaching resources or review student results. Correct-answer material is for authorized staff and must not be displayed to students during active testing.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/instructor/answer-keys" className="min-h-32 rounded-xl border border-graphite bg-charcoal p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold hover:border-gold">
          <h2 className="text-lg font-semibold text-white">Chapter Master Answer Keys</h2>
          <p className="mt-2 text-sm text-silver">Search all chapter quiz questions; expand answers, explanations, and general instructor coaching prompts.</p>
        </Link>
        <Link href="/instructor/students" className="min-h-32 rounded-xl border border-graphite bg-charcoal p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold hover:border-gold">
          <h2 className="text-lg font-semibold text-white">Student Exam Review</h2>
          <p className="mt-2 text-sm text-silver">Open a student to review finalized attempts and missed questions. Active tests must not expose answer keys.</p>
        </Link>
      </div>
      <section className="rounded-xl border border-graphite bg-charcoal p-4 sm:p-6" aria-labelledby="final-exam-key-heading">
        <h2 id="final-exam-key-heading" className="text-lg font-semibold text-white">Final Exam Master Key</h2>
        <p className="mt-2 text-sm leading-relaxed text-silver">
          Not yet released in this hub. The final-exam question bank, correct answers, and explanations require academic review and authenticated access testing before a searchable master key can be enabled. Student-specific finalized exam reviews remain separate.
        </p>
      </section>
    </div>
  )
}
