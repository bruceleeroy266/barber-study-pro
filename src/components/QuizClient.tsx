'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Quiz, QuizQuestion, QuizAttempt } from '@/types'

interface QuizClientProps {
  quiz: Quiz
  questions: QuizQuestion[]
  chapterId: string
  userId: string | undefined
  bestAttempt: QuizAttempt | null
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

export default function QuizClient({ quiz, questions, chapterId, userId, bestAttempt }: QuizClientProps) {
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [saving, setSaving] = useState(false)

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

  const handleNext = useCallback(() => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      finishQuiz()
    }
  }, [currentQuestion, shuffledQuestions.length])

  const finishQuiz = useCallback(async () => {
    if (!userId) {
      setCompleted(true)
      return
    }

    setSaving(true)
    // Calculate final score from answers + current selected answer
    // Do NOT use score state - it was already incremented during gameplay
    const currentQuestionCorrect = selectedAnswer && question && selectedAnswer === question.correctKey ? 1 : 0
    const answeredCorrectly = Object.entries(answers).reduce((acc, [qId, answer]) => {
      const sq = shuffledQuestions.find((sq) => sq.original.id === qId)
      return acc + (sq && sq.correctKey === answer ? 1 : 0)
    }, 0)
    const finalScore = answeredCorrectly + currentQuestionCorrect

    const percentage = Math.round((finalScore / shuffledQuestions.length) * 100)

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

      await supabase
        .from('student_progress')
        .upsert(
          {
            user_id: userId,
            chapter_id: chapterId,
            quiz_completed: true,
            best_quiz_score: Math.max(percentage, bestAttempt?.percentage || 0),
            progress_percentage: 100,
            last_studied_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,chapter_id' }
        )

      setScore(finalScore)
      setCompleted(true)
    } catch (err) {
      console.error('Error saving quiz:', err)
    } finally {
      setSaving(false)
    }
  }, [answers, selectedAnswer, question, shuffledQuestions, userId, quiz.id, chapterId, bestAttempt])

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
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm uppercase tracking-wider">Your Best Score</p>
            <p className="text-4xl font-bold text-[#D4AF37] mt-1">{bestAttempt.percentage}%</p>
            <p className="text-gray-500 text-sm mt-1">
              {bestAttempt.score}/{bestAttempt.total_questions} correct
            </p>
          </div>
        )}

        <div className="mb-6 space-y-2">
          <p className="text-gray-300 font-medium">
            {shuffledQuestions.length} questions &bull; Multiple choice &bull; Passing: 75%
          </p>
          <p className="text-gray-500 text-sm">
            Questions and answers are randomized each attempt
          </p>
        </div>

        <button
          onClick={() => setStarted(true)}
          className="px-8 py-3 bg-[#D4AF37] text-gray-950 font-semibold rounded-lg hover:bg-[#F4E4A6] transition-colors shadow-lg shadow-[#D4AF37]/20"
        >
          {bestAttempt ? 'Retake Quiz' : 'Start Quiz'}
        </button>
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
    const passed = percentage >= 75

    return (
      <div className="text-center py-8">
        <div className={`text-5xl mb-4 ${passed ? 'text-green-400' : 'text-yellow-400'}`}>
          {passed ? 'PASS' : 'REVIEW NEEDED'}
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">
          {passed ? 'Quiz Passed!' : 'Quiz Completed'}
        </h3>

        <div className="text-5xl font-bold text-[#D4AF37] mb-2">
          {percentage}%
        </div>

        <p className="text-gray-400 mb-2">
          You got {score} out of {shuffledQuestions.length} questions correct
        </p>

        {passed ? (
          <p className="text-green-400 mb-6 font-medium">Great job! You demonstrated solid knowledge.</p>
        ) : (
          <p className="text-yellow-400 mb-6 font-medium">
            Passing score is 75%. Review the flashcards and try again.
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
                  <div key={sq.original.id} className="bg-gray-800 rounded-xl p-5 border border-gray-700 text-left">
                    <p className="text-sm text-gray-400 mb-2">Question {idx + 1}</p>
                    <p className="text-white font-medium mb-3">{sq.original.question}</p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-red-400">
                        <span className="font-bold">Your answer:</span>
                        <span>{userOption ? `${userOption.label}. ${userOption.text}` : 'No answer'}</span>
                      </div>
                      <div className="flex items-start gap-2 text-green-400">
                        <span className="font-bold">Correct answer:</span>
                        <span>{correctOption ? `${correctOption.label}. ${correctOption.text}` : ''}</span>
                      </div>
                    </div>
                    {sq.original.explanation && (
                      <p className="mt-3 text-sm text-gray-300 bg-gray-700/50 rounded-lg p-3">
                        {sq.original.explanation}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={restartQuiz}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-600"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    )
  }

  // ── QUESTION SCREEN ──
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          Question {currentQuestion + 1} of {shuffledQuestions.length}
        </span>
        <span className="text-[#D4AF37] font-medium">
          Score: {score}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#D4AF37] to-[#F4E4A6] h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
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
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  showCorrect
                    ? 'bg-green-500/10 border-green-500 text-green-400'
                    : showWrong
                    ? 'bg-red-500/10 border-red-500 text-red-400'
                    : isSelected
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-white'
                    : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                }`}
              >
                <span className="font-bold mr-3 text-[#D4AF37]">{option.label}.</span>
                {option.text}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showExplanation && question.original.explanation && (
          <div className="mt-6 p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-lg">
            <p className="text-[#D4AF37] font-semibold mb-1 text-sm uppercase tracking-wider">Explanation</p>
            <p className="text-gray-300 leading-relaxed">{question.original.explanation}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        {!showExplanation ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className="px-6 py-3 bg-[#D4AF37] text-gray-950 font-semibold rounded-lg hover:bg-[#F4E4A6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-lg shadow-[#D4AF37]/10"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={saving}
            className="px-6 py-3 bg-[#D4AF37] text-gray-950 font-semibold rounded-lg hover:bg-[#F4E4A6] disabled:opacity-50 transition-colors shadow-lg shadow-[#D4AF37]/10"
          >
            {saving
              ? 'Saving...'
              : currentQuestion === shuffledQuestions.length - 1
              ? 'Finish Quiz'
              : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  )
}
