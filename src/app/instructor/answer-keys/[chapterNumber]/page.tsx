import Link from 'next/link'
import { notFound } from 'next/navigation'
import { localChapters } from '@/lib/local-data'
import { allQuizQuestions } from '@/lib/quiz-data'
import type { QuizQuestion } from '@/types'

interface InstructorAnswerKeyChapterPageProps {
  params: Promise<{
    chapterNumber: string
  }>
}

function answerText(question: QuizQuestion, key: 'a' | 'b' | 'c' | 'd'): string {
  return question[`answer_${key}`]
}

export default async function InstructorAnswerKeyChapterPage({
  params,
}: InstructorAnswerKeyChapterPageProps) {
  const { chapterNumber } = await params
  const number = Number.parseInt(chapterNumber, 10)

  if (!Number.isInteger(number) || number < 1) {
    notFound()
  }

  const chapter = localChapters.find((item) => item.chapter_number === number)
  const questions = allQuizQuestions[`quiz-${number}`]

  if (!chapter || !questions) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2 text-sm text-silver">
        <Link
          href="/instructor"
          className="hover:text-[var(--color-brand-gold)] transition-colors"
        >
          Instructor
        </Link>
        <span>/</span>
        <Link
          href="/instructor/answer-keys"
          className="hover:text-[var(--color-brand-gold)] transition-colors"
        >
          Answer Keys
        </Link>
        <span>/</span>
        <span className="text-white">Chapter {number}</span>
      </div>

      <section className="bg-charcoal border border-graphite rounded-2xl p-8">
        <p className="text-xs font-bold uppercase tracking-wide text-gold mb-2">
          Instructor Only
        </p>
        <h1 className="text-2xl font-semibold text-white">
          Chapter {number}: {chapter.title}
        </h1>
        <p className="text-silver mt-3">
          {questions.length} questions. Correct answers are highlighted below.
        </p>
      </section>

      <section className="space-y-5">
        {questions.map((question, index) => {
          const keys: Array<'a' | 'b' | 'c' | 'd'> = ['a', 'b', 'c', 'd']

          return (
            <article
              id={question.id}
              key={question.id}
              className="bg-charcoal border border-graphite rounded-xl p-6 scroll-mt-24"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gold">
                    Question {index + 1}
                  </p>
                  <h2 className="text-base md:text-lg font-semibold text-white mt-2 leading-relaxed">
                    {question.question}
                  </h2>
                </div>
                <span className="text-xs text-silver border border-graphite rounded-full px-3 py-1 capitalize">
                  {question.difficulty}
                </span>
              </div>

              <div className="mt-5 grid gap-2">
                {keys.map((key) => {
                  const isCorrect = key === question.correct_answer

                  return (
                    <div
                      key={key}
                      className={`rounded-lg border px-4 py-3 text-sm ${
                        isCorrect
                          ? 'border-[var(--color-brand-gold)]/50 bg-[var(--color-brand-gold)]/10 text-white'
                          : 'border-graphite bg-black/20 text-silver'
                      }`}
                    >
                      <span className="font-bold uppercase mr-2">{key}.</span>
                      {answerText(question, key)}
                      {isCorrect && (
                        <span className="ml-2 text-gold font-semibold">Correct answer</span>
                      )}
                    </div>
                  )
                })}
              </div>

              {question.explanation && (
                <div className="mt-5 border-t border-graphite pt-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-silver mb-2">
                    Instructor Explanation
                  </p>
                  <p className="text-sm text-light-gray leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              )}

              {question.learningObjective && (
                <div className="mt-4">
                  <p className="text-xs text-silver">
                    <span className="font-semibold text-white">Learning objective:</span>{' '}
                    {question.learningObjective}
                  </p>
                </div>
              )}
            </article>
          )
        })}
      </section>
    </div>
  )
}
