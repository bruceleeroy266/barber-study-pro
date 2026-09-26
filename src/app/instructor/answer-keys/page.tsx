import Link from 'next/link'
import { localChapters } from '@/lib/local-data'
import { allQuizQuestions } from '@/lib/quiz-data'
import AnswerKeySearch, { type AnswerKeySearchEntry } from './AnswerKeySearch'

export default function InstructorAnswerKeysPage() {
  const chapters = [...localChapters].sort((a, b) => a.chapter_number - b.chapter_number)

  const searchEntries: AnswerKeySearchEntry[] = chapters.flatMap((chapter) => {
    const questions = allQuizQuestions[`quiz-${chapter.chapter_number}`] ?? []

    return questions.map((question, index) => ({
      id: question.id,
      chapterNumber: chapter.chapter_number,
      chapterTitle: chapter.title,
      questionNumber: index + 1,
      question: question.question,
      answers: {
        a: question.answer_a,
        b: question.answer_b,
        c: question.answer_c,
        d: question.answer_d,
      },
      correctAnswer: question.correct_answer,
      explanation: question.explanation ?? '',
    }))
  })

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
        <span className="text-white">Answer Keys</span>
      </div>

      <section className="bg-charcoal border border-graphite rounded-2xl p-8">
        <p className="text-xs font-bold uppercase tracking-wide text-gold mb-2">
          Instructor Only
        </p>
        <h1 className="text-2xl font-semibold text-white">Chapter Quiz Answer Keys</h1>
        <p className="text-silver mt-3 leading-relaxed max-w-3xl">
          Review the canonical chapter quiz questions, correct answers, and explanations.
          Keep this view instructor-facing and avoid displaying it while students are actively testing.
        </p>
      </section>

      <AnswerKeySearch entries={searchEntries} />

      <section className="grid gap-4 md:grid-cols-2">
        {chapters.map((chapter) => {
          const questions = allQuizQuestions[`quiz-${chapter.chapter_number}`] ?? []

          return (
            <Link
              key={chapter.id}
              href={`/instructor/answer-keys/${chapter.chapter_number}`}
              className="block bg-charcoal border border-graphite rounded-xl p-6 hover:border-[var(--color-brand-gold)]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gold">
                    Chapter {chapter.chapter_number}
                  </p>
                  <h2 className="text-lg font-semibold text-white mt-1">
                    {chapter.title}
                  </h2>
                  <p className="text-sm text-silver mt-2">
                    {questions.length} quiz {questions.length === 1 ? 'question' : 'questions'}
                  </p>
                </div>
                <span className="text-gold text-sm whitespace-nowrap">Open key →</span>
              </div>
            </Link>
          )
        })}
      </section>
    </div>
  )
}
