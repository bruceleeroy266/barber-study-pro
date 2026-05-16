'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Flashcard } from '@/types'

interface FlashcardClientProps {
  flashcards: Flashcard[]
  chapterId: string
  userId: string | undefined
  isCompleted: boolean
}

export default function FlashcardClient({ flashcards, chapterId, userId, isCompleted }: FlashcardClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [completed, setCompleted] = useState(isCompleted)
  const [saving, setSaving] = useState(false)

  const currentCard = flashcards[currentIndex]
  const progress = ((currentIndex + 1) / flashcards.length) * 100

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false)
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleMarkComplete = async () => {
    if (!userId) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('student_progress')
        .upsert({
          user_id: userId,
          chapter_id: chapterId,
          flashcards_completed: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,chapter_id'
        })

      if (error) throw error
      setCompleted(true)
    } catch (err) {
      console.error('Error saving progress:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-center text-sm text-gray-400">
        Card {currentIndex + 1} of {flashcards.length}
      </div>

      {/* Flashcard */}
      <div
        onClick={handleFlip}
        className="relative h-64 md:h-80 cursor-pointer perspective-1000"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-gray-800 border border-gray-700 rounded-xl p-8 flex items-center justify-center backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">Question</p>
              <p className="text-xl md:text-2xl text-white font-medium">{currentCard.front}</p>
              <p className="text-xs text-gray-600 mt-8">Click to flip</p>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-gray-800 border border-[#D4AF37]/30 rounded-xl p-8 flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="text-center">
              <p className="text-sm text-[#D4AF37] mb-4">Answer</p>
              <p className="text-xl md:text-2xl text-white font-medium">{currentCard.back}</p>
              {currentCard.category && (
                <span className="inline-block mt-4 px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                  {currentCard.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>

        <div className="flex gap-2">
          {!completed && currentIndex === flashcards.length - 1 && (
            <button
              onClick={handleMarkComplete}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : '✓ Mark Complete'}
            </button>
          )}
          {completed && (
            <span className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg">
              ✓ Completed
            </span>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-gray-600">
        Press spacebar to flip • Use arrow keys to navigate
      </p>
    </div>
  )
}
