'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { calculateChapterProgress } from '@/lib/progress'
import { isSupabaseConfigured } from '@/lib/demo-helpers'
import { saveMissedQuestions } from '@/lib/missed-questions'
import { getCategoryForChapter } from '@/lib/analytics'
import { calculateQuizScore } from '@/lib/quiz-scoring'
import { Quiz, QuizQuestion, QuizAttempt } from '@/types'
import RemediationPanel from './chapter/RemediationPanel'
import type { ChapterCompetency, ChapterRemediationPath } from '@/lib/chapter-content'
import { Button, Card, Badge, ProgressBar, Alert } from '@/components/ui'

interface QuizClientProps {
  quiz: Quiz
  questions: QuizQuestion[]
  chapterId: string
  chapterNumber?: number
  nextChapterNumber?: number | null
  userId: string | undefined
  bestAttempt: QuizAttempt | null
  remediation?: ChapterRemediationPath[]
  competencies?: ChapterCompetency[]
}

// ───────────────────────────────────────────────
// Randomization helpers
// ───────────────────────────────────────────────
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface ShuffledQuestion {
  original: QuizQuestion
  options: { key: string; label: string; text: string }[]
  correctKey: string
}

function shuffleQuestionAnswers(q: QuizQuestion): ShuffledQuestion {
  const raw = [
    { key: 'a', text: q.answer_a },
    { key: 'b', text: q.answer_b },
    { key: 'c', text: q.answer_c },
    { key: 'd', text: q.answer_d },
  ]
  const shuffled = shuffleArray(raw)
  const correctKey = shuffled.find((opt) => opt.key === q.correct_answer)!.key
  const labels = ['A', 'B', 'C', 'D']
  const options = shuffled.map((opt, idx) => ({
    key: opt.key,
    label: labels[idx],
    text: opt.text,
  }))
  return { original: q, options, correctKey }
}

export default function QuizClient({
  quiz,
  questions,
  chapterId,
  chapterNumber,
  nextChapterNumber,
  userId,
  bestAttempt,
  remediation = [],
  competencies = [],
}: QuizClientProps) {
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [saving, setSaving] = useState(false)

  // Book + ASCYN learning model: standard passing score is 80%.
  const passingScore = quiz.passing_score ?? 80

  // Randomize questions and answers on each quiz start
  const shuffledQuestions = useMemo(() => {
    const randomized = shuffleArray(questions)
    return randomized.map(shuffleQuestionAnswers)
  }, [started]) // eslint-disable-line react-hooks/exhaustive-deps

  const question = shuffledQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100

  const handleSelectAnswer = useCallback((answer: string) => {
    if (showExplanation) return
    setSelectedAnswer(answer)
  }, [showExplanation])

  const handleSubmitAnswer = useCallback(() => {
    if (!selectedAnswer || !question) return

    const isCorrect = selectedAnswer === question.correctKey
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }

    setAnswers((prev) => ({ ...prev, [question.original.id]: selectedAnswer }))
    setShowExplanation(true)
  }, [selectedAnswer, question])

  const finishQuiz = useCallback(async () => {
    if (!userId) {
      setCompleted(true)
      return
    }

    setSaving(true)
    // Calculate final score using the dedicated scoring helper. The current
    // question's answer is already in `answers` when the user clicked Submit, but
    // the helper merges `selectedAnswer` as a safeguard against any state timing
    // edge case and ensures each question is counted exactly once.
    // Do NOT use score state - it was already incremented during gameplay.
    const scoringQuestions = shuffledQuestions.map((sq) => ({
      id: sq.original.id,
      correctKey: sq.correctKey,
    }))
    const allAnswers = { ...answers, [question!.original.id]: selectedAnswer }
    const {
      score: finalScore,
      percentage,
    } = calculateQuizScore(scoringQuestions, answers, question!.original.id, selectedAnswer)

    try {
      await supabase.from('quiz_attempts').insert({
        user_id: userId,
        quiz_id: quiz.id,
        score: finalScore,
        total_questions: shuffledQuestions.length,
        percentage,
        answers_json: { ...answers, [question!.original.id]: selectedAnswer },
        completed_at: new Date().toISOString(),
      })

      // Preserve existing progress flags and only mark the quiz complete on a PASS.
      let flashcardsCompleted = false
      let existingQuizCompleted = false
      let existingBestScore = 0

      if (isSupabaseConfigured()) {
        const { data: existingProgress } = await supabase
          .from('student_progress')
          .select('flashcards_completed, quiz_completed, best_quiz_score')
          .eq('user_id', userId)
          .eq('chapter_id', chapterId)
          .maybeSingle()

        flashcardsCompleted = existingProgress?.flashcards_completed ?? false
        existingQuizCompleted = existingProgress?.quiz_completed ?? false
        existingBestScore = existingProgress?.best_quiz_score ?? 0
      }

      const quizPassed = percentage >= passingScore
      const quizCompleted = existingQuizCompleted || quizPassed
      const bestQuizScore = Math.max(
        percentage,
        existingBestScore,
        bestAttempt?.percentage ?? 0
      )
      const progressPercentage = calculateChapterProgress(
        flashcardsCompleted,
        quizCompleted
      )

      await supabase
        .from('student_progress')
        .upsert(
          {
            user_id: userId,
            chapter_id: chapterId,
            quiz_completed: quizCompleted,
            best_quiz_score: bestQuizScore,
            progress_percentage: progressPercentage,
            last_studied_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,chapter_id' }
        )

      // Persist missed questions to Supabase so they survive logout/login.
      const chapterNumber = parseInt(chapterId.replace(/^ch-/, ''), 10) || 0
      const category = chapterNumber ? getCategoryForChapter(chapterNumber) : 'General'
      const missed = shuffledQuestions
        .filter((sq) => allAnswers[sq.original.id] !== sq.correctKey)
        .map((sq) => {
          const studentKey = allAnswers[sq.original.id] ?? ''
          const correctOption = sq.options.find((o) => o.key === sq.correctKey)
          const studentOption = sq.options.find((o) => o.key === studentKey)
          return {
            userId,
            questionId: sq.original.id,
            quizId: quiz.id,
            question: sq.original.question,
            correctAnswer: correctOption ? `${correctOption.label}. ${correctOption.text}` : sq.correctKey,
            studentAnswer: studentOption ? `${studentOption.label}. ${studentOption.text}` : studentKey || 'No answer',
            explanation: sq.original.explanation ?? null,
            chapterId,
            chapterNumber: chapterNumber || null,
            category,
          }
        })

      // Only persist missed questions for real chapter quizzes. The weak-area
      // retest uses synthetic question IDs (weak-*) that should not create new
      // missed-question records; the original missed questions remain in the bank.
      if (missed.length > 0 && !quiz.id.startsWith('weak-area')) {
        const saveResult = await saveMissedQuestions(userId, missed)
        if (!saveResult.ok) {
          console.error('[QuizClient] Failed to save missed questions:', saveResult.error)
        }
      }

      setScore(finalScore)
      setCompleted(true)
    } catch (err) {
      console.error('Error saving quiz:', err)
    } finally {
      setSaving(false)
    }
  }, [answers, selectedAnswer, question, shuffledQuestions, userId, quiz.id, chapterId, bestAttempt, passingScore])

  const handleNext = useCallback(() => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      finishQuiz()
    }
  }, [currentQuestion, shuffledQuestions.length, finishQuiz])

  const restartQuiz = useCallback(() => {
    setStarted(false)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers({})
    setShowExplanation(false)
    setCompleted(false)
    setScore(0)
  }, [])

  // Warn before leaving active quiz
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (started && !completed) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [started, completed])

  // ── START SCREEN ──
  if (!started) {
    return (
      <div className="text-center py-8">
        {bestAttempt && (
          <Card variant="outlined" padding="md" className="mb-6">
            <p className="text-[var(--color-text-muted)] text-sm uppercase tracking-wider">Your Best Score</p>
            <p className="text-4xl font-bold text-[var(--color-brand-gold)] mt-1">{bestAttempt.percentage}%</p>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">
              {bestAttempt.score}/{bestAttempt.total_questions} correct
            </p>
          </Card>
        )}

        <div className="mb-6 space-y-2">
          <p className="text-[var(--color-text-secondary)] font-medium">
            {shuffledQuestions.length} questions &bull; Multiple choice &bull; Passing: {passingScore}%
          </p>
          <p className="text-[var(--color-text-muted)] text-sm">
            Questions and answers are randomized each attempt
          </p>
        </div>

        {/* ASCYN study notice */}
        <Alert variant="info" className="mb-6 text-left">
          <p className="text-sm leading-relaxed">
            Some questions may require information from your assigned course materials.
            ASCYN PRO is designed to be used alongside your program materials and classroom instruction.
          </p>
        </Alert>

        <Button
          variant="primary"
          size="lg"
          onClick={() => setStarted(true)}
        >
          {bestAttempt ? 'Retake Quiz' : 'Start Quiz'}
        </Button>
      </div>
    )
  }

  // Build missed questions for review
  const missedQuestions = completed
    ? shuffledQuestions.filter((sq) => {
        const userAnswer = answers[sq.original.id] || selectedAnswer
        return userAnswer !== sq.correctKey
      })
    : []

  // ── RESULTS SCREEN ──
  if (completed) {
    const percentage = Math.round((score / shuffledQuestions.length) * 100)
    const passed = percentage >= passingScore

    return (
      <div className="text-center py-8">
        <div className={`text-5xl mb-4 ${passed ? 'text-gold' : 'text-warm-bronze'}`}>
          {passed ? 'PASS' : 'REVIEW NEEDED'}
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">
          {passed ? 'Quiz Passed!' : 'Quiz Completed'}
        </h3>

        <div className="text-5xl font-bold text-[var(--color-brand-gold)] mb-2">
          {percentage}%
        </div>

        <p className="text-[var(--color-text-muted)] mb-2">
          You got {score} out of {shuffledQuestions.length} questions correct
        </p>

        {passed ? (
          <p className="text-gold mb-6 font-medium">
            Quiz passed. Review your missed questions, flashcards, and course materials anytime, or retake the quiz to improve your score.
          </p>
        ) : (
          <p className="text-warm-bronze mb-6 font-medium">
            Review the flashcards and the corresponding lesson, then retake the quiz.
          </p>
        )}

        {/* Missed Questions Review */}
        {missedQuestions.length > 0 && (
          <div className="mt-8 text-left">
            <h4 className="text-lg font-semibold text-white mb-4">
              Review Missed Questions ({missedQuestions.length})
            </h4>
            <div className="space-y-4">
              {missedQuestions.map((sq, idx) => {
                const userAnswerKey = answers[sq.original.id] || selectedAnswer
                const userOption = sq.options.find((o) => o.key === userAnswerKey)
                const correctOption = sq.options.find((o) => o.key === sq.correctKey)
                return (
                  <Card key={sq.original.id} variant="default" padding="md" className="text-left">
                    <p className="text-sm text-[var(--color-text-muted)] mb-2">Question {idx + 1}</p>
                    <p className="text-white font-medium mb-3">{sq.original.question}</p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-silver">
                        <span className="font-bold">Your answer:</span>
                        <span>{userOption ? `${userOption.label}. ${userOption.text}` : 'No answer'}</span>
                      </div>
                      <div className="flex items-start gap-2 text-gold">
                        <span className="font-bold">Correct answer:</span>
                        <span>{correctOption ? `${correctOption.label}. ${correctOption.text}` : ''}</span>
                      </div>
                    </div>
                    {sq.original.explanation && (
                      <p className="mt-3 text-sm text-[var(--color-text-secondary)] bg-[var(--color-border-secondary)]/50 rounded-lg p-3">
                        {sq.original.explanation}
                      </p>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Targeted Remediation */}
        {remediation.length > 0 && competencies.length > 0 && (
          <div className="mt-8">
            <RemediationPanel
              remediation={remediation}
              competencies={competencies}
              missedQuestionIds={missedQuestions.map((sq) => sq.original.id)}
              chapterNumber={chapterNumber}
              onRetryQuiz={restartQuiz}
            />
          </div>
        )}

        {/* Result actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          {passed ? (
            <>
              {nextChapterNumber ? (
                <Link href={`/dashboard/chapters/${nextChapterNumber}`}>
                  <Button variant="primary" size="lg">
                    Continue to Chapter {nextChapterNumber}
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button variant="primary" size="lg">
                    Return to Dashboard
                  </Button>
                </Link>
              )}
              <Button
                variant="secondary"
                size="lg"
                onClick={restartQuiz}
              >
                Retake Quiz
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={restartQuiz}
            >
              Review and Retake Quiz
            </Button>
          )}
        </div>

        {/* Missed questions review link */}
        {missedQuestions.length > 0 && (
          <div className="mt-6">
            <Link
              href="/dashboard/missed-questions"
              className="inline-flex items-center gap-2 text-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold-light)] transition-colors"
            >
              Review Missed Questions
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    )
  }

  // ── QUESTION SCREEN ──
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-text-muted)]">
          Question {currentQuestion + 1} of {shuffledQuestions.length}
        </span>
        <span className="text-[var(--color-brand-gold)] font-medium">
          Score: {score}
        </span>
      </div>

      {/* Progress bar */}
      <ProgressBar
        value={progress}
        variant="default"
        size="md"
        showLabel={false}
        aria-label={`Quiz progress: question ${currentQuestion + 1} of ${shuffledQuestions.length}`}
      />

      {/* Question card */}
      <Card variant="default" padding="lg">
        <p className="text-lg text-white font-medium mb-6 leading-relaxed">
          {question.original.question}
        </p>

        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.key
            const isCorrect = question.correctKey === option.key
            const showCorrect = showExplanation && isCorrect
            const showWrong = showExplanation && isSelected && !isCorrect

            return (
              <button
                key={option.key}
                onClick={() => handleSelectAnswer(option.key)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 ${
                  showCorrect
                    ? 'bg-gold/10 border-gold text-gold'
                    : showWrong
                    ? 'bg-silver/10 border-silver text-silver'
                    : isSelected
                    ? 'bg-[var(--color-brand-gold)]/10 border-[var(--color-brand-gold)] text-white'
                    : 'bg-[var(--color-border-secondary)]/50 border-silver-gray text-[var(--color-text-secondary)] hover:bg-[var(--color-border-secondary)] hover:border-silver-gray'
                }`}
              >
                <span className="font-bold mr-3 text-[var(--color-brand-gold)]">{option.label}.</span>
                {option.text}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showExplanation && question.original.explanation && (
          <Alert variant="info" className="mt-6">
            <p className="font-semibold mb-1 text-sm uppercase tracking-wider">Explanation</p>
            <p className="leading-relaxed">{question.original.explanation}</p>
          </Alert>
        )}
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        {!showExplanation ? (
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : currentQuestion === shuffledQuestions.length - 1
              ? 'Finish Quiz'
              : 'Next Question'}
          </Button>
        )}
      </div>
    </div>
  )
}