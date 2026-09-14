import Link from 'next/link'
import { chapterInstructorNotes } from '@/lib/chapter-2-instructor-notes'

export default function InstructorTeachingNotesIndexPage() {
  const availableChapters = Object.values(chapterInstructorNotes).sort(
    (a, b) => a.chapterNumber - b.chapterNumber,
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-sm text-silver">
        <Link
          href="/instructor"
          className="hover:text-[var(--color-brand-gold)] transition-colors"
        >
          Instructor
        </Link>
        <span>/</span>
        <span className="text-white">Teaching Notes</span>
      </div>

      <section className="bg-charcoal border border-graphite rounded-2xl p-8">
        <p className="text-xs font-bold uppercase tracking-wide text-gold mb-2">
          Instructor Only
        </p>
        <h1 className="text-2xl font-semibold text-white">Teaching Notes</h1>
        <p className="text-silver mt-3 leading-relaxed max-w-3xl">
          Open a chapter to review learning objectives, teaching emphasis,
          common student confusions, classroom activities, remediation guidance,
          and assessment guidance.
        </p>
      </section>

      <section className="space-y-4">
        {availableChapters.length > 0 ? (
          availableChapters.map((notes) => (
            <Link
              key={notes.chapterNumber}
              href={`/instructor/chapters/${notes.chapterNumber}`}
              className="block bg-charcoal border border-graphite rounded-xl p-6 hover:border-[var(--color-brand-gold)]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gold">
                    Chapter {notes.chapterNumber}
                  </p>
                  <h2 className="text-lg font-semibold text-white mt-1">
                    {notes.title}
                  </h2>
                  <p className="text-sm text-silver mt-2 line-clamp-2">
                    {notes.purpose}
                  </p>
                </div>
                <span className="text-gold text-sm whitespace-nowrap">Open notes →</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-charcoal border border-graphite rounded-xl p-6">
            <p className="text-silver text-sm">No teaching notes are available yet.</p>
          </div>
        )}
      </section>
    </div>
  )
}
