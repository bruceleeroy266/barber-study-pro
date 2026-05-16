'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Quiz, QuizQuestion, QuizAttempt } from '@/types'

interface QuizClientProps {
  quiz: Quiz
  questions: QuizQuestion[]
  chapterId: string
  userId: string | undefined
  bestAttempt: QuizAttempt | null
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

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleSelectAnswer = (answer: string) => {
    if (showExplanation) return
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return

    const isCorrect = selectedAnswer === question.correct_answer
    if (isCorrect) {
      setScore(score + 1)
    }

    setAnswers({ ...answers, [question.id]: selectedAnswer })
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = async () => {
    if (!userId) {
      setCompleted(true)
      return
    }

    setSaving(true)
    const finalScore = Object.entries(answers).reduce((acc, [qId, answer]) => {
      const q = questions.find(q => q.id === qId)
      return acc + (q && q.correct_answer === answer ? 1 : 0)
    }, selectedAnswer === question.correct_answer ? score + 1 : score)

    const percentage = Math.round((finalScore / questions.length) * 100)

    try {
      // Save quiz attempt
      await supabase.from('quiz_attempts').insert({
        user_id: userId,
        quiz_id: quiz.id,
        score: finalScore,
        total_questions: questions.length,
        percentage,
        answers_json: { ...answers, [question.id]: selectedAnswer },
        completed_at: new Date().toISOString()
      })

      // Update progress
      await supabase
        .from('student_progress')
        .upsert({
          user_id: userId,
          chapter_id: chapterId,
          quiz_completed: true,
          best_quiz_score: Math.max(percentage, bestAttempt?.percentage || 0),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,chapter_id'
        })

      setScore(finalScore)
      setCompleted(true)
    } catch (err) {
      console.error('Error saving quiz:', err)
    } finally {
      setSaving(false)
    }
  }

  const restartQuiz = () => {
    setStarted(false)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers({})
    setShowExplanation(false)
    setCompleted(false)
    setScore(0)
  }

  if (!started) {
    return (
      <div className="text-center py-8">
        {bestAttempt && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <p className="text-gray-400 text-sm">Your Best Score</p>
            <p className="text-3xl font-bold text-[#D4AF37]">{bestAttempt.percentage}%</p>
            <p className="text-gray-500 text-sm">
              {bestAttempt.score}/{bestAttempt.total_questions} correct
            </p>
          </div>
        )}
        
        <p className="text-gray-400 mb-6">
          {questions.length} questions • Multiple choice • Instant feedback
        </p>
        
        <button
          onClick={() => setStarted(true)}
          className="px-8 py-3 bg-[#D4AF37] text-gray-950 font-semibold rounded-lg hover:bg-[#F4E4A6] transition-colors"
        >
          {bestAttempt ? 'Retake Quiz' : 'Start Quiz'}
        </button>
      </div>
    )
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100)
    const passed = percentage >= 70

    return (
      <div className="text-center py-8">
        <div className={`text-6xl mb-4 ${passed ? 'text-green-400' : 'text-yellow-400'}`}>
          {passed ? '🎉' : '⚠️'}
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2">
          {passed ? 'Quiz Completed!' : 'Quiz Finished'}
        </h3>
        
        <div className="text-5xl font-bold text-[#D4AF37] mb-2">
          {percentage}%
        </div>
        
        <p className="text-gray-400 mb-6">
          You got {score} out of {questions.length} questions correct
        </p>

        {passed ? (
          <p className="text-green-400 mb-6">Great job! You passed the quiz.</p>
        ) : (
          <p className="text-yellow-400 mb-6">Review the material and try again.</p>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={restartQuiz}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Question {currentQuestion + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>
      
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-gray-800 rounded-xl p-6">
        <p className="text-lg text-white font-medium mb-6">{question.question}</p>

        <div className="space-y-3">
          {['a', 'b', 'c', 'd'].map((option) => {
            const answerText = option === 'a' ? question.answer_a :
                             option === 'b' ? question.answer_b :
                             option === 'c' ? question.answer_c : question.answer_d
            
            const isSelected = selectedAnswer === option
            const isCorrect = question.correct_answer === option
            const showCorrect = showExplanation && isCorrect
            const showWrong = showExplanation && isSelected && !isCorrect

            return (
              <button
                key={option}
                onClick={() => handleSelectAnswer(option)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  showCorrect
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : showWrong
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : isSelected
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <span className="font-semibold mr-3">{option.toUpperCase()}.</span>
                {answerText}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showExplanation && question.explanation && (
          <div className="mt-6 p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg">
            <p className="text-[#D4AF37] font-semibold mb-1">Explanation</p>
            <p className="text-gray-300">{question.explanation}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        {!showExplanation ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className="px-6 py-3 bg-[#D4AF37] text-gray-950 font-semibold rounded-lg hover:bg-[#F4E4A6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={saving}
            className="px-6 py-3 bg-[#D4AF37] text-gray-950 font-semibold rounded-lg hover:bg-[#F4E4A6] disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  )
}
