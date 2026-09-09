import { notFound } from 'next/navigation'
import Link from 'next/link'
import { chapterInstructorNotes } from '@/lib/chapter-2-instructor-notes'
import { chapter2LearningObjectives } from '@/lib/chapter-2-concepts/concepts'

interface InstructorChapterNotesPageProps {
  params: Promise<{
    chapterNumber: string
  }>
}

/**
 * Instructor-only chapter teaching notes.
 *
 * Role gating is enforced by src/app/instructor/layout.tsx: unauthenticated
 * users redirect to /login; non-instructor/non-admin roles redirect to
 * /dashboard. This page contains no student-reachable path and must never
 * be linked from student surfaces.
 */
export default async function InstructorChapterNotesPage({
  params,
}: InstructorChapterNotesPageProps) {
  const { chapterNumber } = await params
  const num = parseInt(chapterNumber)

  if (isNaN(num)) {
    notFound()
  }

  const notes = chapterInstructorNotes[num]

  if (!notes) {
    notFound()
  }

  const loById = new Map(chapter2LearningObjectives.map((lo) => [lo.id, lo]))

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-silver">
        <Link href="/instructor" className="hover:text-[var(--color-brand-gold)] transition-colors">
          Instructor
        </Link>
        <span>/</span>
        <span className="text-white">Chapter {num} Teaching Notes</span>
      </div>

      {/* Header */}
      <div className="bg-charcoal border border-graphite rounded-2xl p-8">
        <p className="text-xs font-bold uppercase tracking-wide text-gold mb-2">
          Instructor Only — Not Student-Facing
        </p>
        <h1 className="text-2xl font-semibold text-white">{notes.title}</h1>
        <p className="text-silver mt-3 leading-relaxed">{notes.purpose}</p>
      </div>

      {/* Learning Objectives */}
      <section className="bg-charcoal border border-graphite rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-4">Learning Objectives ({notes.learningObjectiveIds.length})</h2>
        <ol className="space-y-2 list-decimal list-inside">
          {notes.learningObjectiveIds.map((loId) => (
            <li key={loId} className="text-silver text-sm leading-relaxed">
              <span className="text-gold font-medium">{loId}:</span>{' '}
              {loById.get(loId)?.statement ?? loId}
            </li>
          ))}
        </ol>
      </section>

      {/* Teaching Emphasis */}
      <section className="bg-charcoal border border-graphite rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-4">Teaching Emphasis</h2>
        <ul className="space-y-3">
          {notes.teachingEmphasis.map((item, idx) => (
            <li key={idx} className="text-silver text-sm leading-relaxed flex gap-2">
              <span className="text-gold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Common Student Confusions */}
      <section className="bg-charcoal border border-graphite rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-4">Common Student Confusions</h2>
        <div className="space-y-4">
          {notes.commonConfusions.map((c) => (
            <div key={c.topic} className="bg-black/40 border border-graphite rounded-lg p-4">
              <h3 className="text-sm font-medium text-white">{c.topic}</h3>
              <p className="text-silver text-sm mt-2 leading-relaxed">{c.clarification}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Discussion Prompts */}
      <section className="bg-charcoal border border-graphite rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-4">Discussion Prompts</h2>
        <ul className="space-y-3">
          {notes.discussionPrompts.map((prompt, idx) => (
            <li key={idx} className="text-silver text-sm leading-relaxed flex gap-2">
              <span className="text-gold">{idx + 1}.</span>
              <span>{prompt}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Classroom Activities */}
      <section className="bg-charcoal border border-graphite rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-4">Classroom Activities</h2>
        <div className="space-y-4">
          {notes.classroomActivities.map((activity) => (
            <div key={activity.title} className="bg-black/40 border border-graphite rounded-lg p-4">
              <h3 className="text-sm font-medium text-white">{activity.title}</h3>
              <p className="text-silver text-sm mt-2 leading-relaxed">{activity.instructions}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Practical Barbering Connections */}
      <section className="bg-charcoal border border-graphite rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-4">Practical Barbering Connections</h2>
        <ul className="space-y-3">
          {notes.practicalConnections.map((item, idx) => (
            <li key={idx} className="text-silver text-sm leading-relaxed flex gap-2">
              <span className="text-gold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Misconceptions */}
      <section className="bg-charcoal border border-graphite rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-4">Misconceptions to Correct</h2>
        <div className="space-y-4">
          {notes.misconceptions.map((m, idx) => (
            <div key={idx} className="bg-black/40 border border-graphite rounded-lg p-4">
              <p className="text-sm text-warm-bronze font-medium">✗ {m.misconception}</p>
              <p className="text-silver text-sm mt-2 leading-relaxed">✓ {m.correction}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Remediation Guidance */}
      <section className="bg-charcoal border border-graphite rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-4">Remediation Guidance</h2>
        <p className="text-silver text-sm leading-relaxed">{notes.remediationGuidance}</p>
      </section>

      {/* Assessment Guidance */}
      <section className="bg-charcoal border border-graphite rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-4">Assessment Guidance</h2>
        <p className="text-silver text-sm leading-relaxed">{notes.assessmentGuidance}</p>
      </section>

      {/* ASCYN Enrichment Identification */}
      <section className="bg-charcoal border border-graphite rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-4">ASCYN Enrichment Identification</h2>
        <div className="space-y-4">
          {notes.enrichmentIdentification.map((e) => (
            <div key={e.conceptId} className="bg-black/40 border border-graphite rounded-lg p-4">
              <h3 className="text-sm font-medium text-white">
                {e.conceptId} — {e.conceptName}
              </h3>
              <p className="text-silver text-sm mt-2 leading-relaxed">{e.identification}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Source/Provenance Boundaries */}
      <section className="bg-charcoal border border-graphite rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-4">Source & Provenance Boundaries</h2>
        <p className="text-silver text-sm leading-relaxed">{notes.provenanceBoundaries}</p>
      </section>

      {/* Board-Relevance Boundaries */}
      <section className="bg-charcoal border border-graphite rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-4">Exam-Relevance Boundaries</h2>
        <p className="text-silver text-sm leading-relaxed">{notes.boardRelevanceBoundaries}</p>
      </section>
    </div>
  )
}
