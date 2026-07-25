'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { calculateChapterProgress } from '@/lib/progress'
import { isSupabaseConfigured } from '@/lib/demo-helpers'
import { isTypingTarget } from '@/lib/keyboard-shortcuts'
import { Flag } from 'lucide-react'
import { Flashcard } from '@/types'

interface FlashcardClientProps {
  flashcards: Flashcard[]
  chapterId: string
  userId: string | undefined
  isCompleted: boolean
}

type StudyMode = 'all' | 'flagged'

function getIndexStorageKey(chapterId: string) {
  return `flashcard-index-${chapterId}`
}

function getCardIdStorageKey(chapterId: string) {
  return `flashcard-card-id-${chapterId}`
}

function getStudyModeStorageKey(chapterId: string) {
  return `flashcard-study-mode-${chapterId}`
}

export default function FlashcardClient({ flashcards, chapterId, userId, isCompleted }: FlashcardClientProps) {
  const [studyMode, setStudyMode] = useState<StudyMode>(() => {
    if (typeof window === 'undefined') return 'all'
    return (localStorage.getItem(getStudyModeStorageKey(chapterId)) as StudyMode) || 'all'
  })

  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set())
  const [isLoadingFlags, setIsLoadingFlags] = useState(true)
  const [flagError, setFlagError] = useState<string | null>(null)
  const [backendFlaggingReady, setBackendFlaggingReady] = useState(true)

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (typeof window === 'undefined') return 0
    const cardId = localStorage.getItem(getCardIdStorageKey(chapterId))
    if (cardId) {
      const idx = flashcards.findIndex((c) => c.id === cardId)
      if (idx >= 0) return idx
    }
    const savedIndex = localStorage.getItem(getIndexStorageKey(chapterId))
    if (savedIndex) {
      const parsed = parseInt(savedIndex, 10)
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed < flashcards.length) return parsed
    }
    return 0
  })
  const [isFlipped, setIsFlipped] = useState(false)
  const [completed, setCompleted] = useState(isCompleted)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Resolve the effective deck based on study mode.
  const effectiveFlashcards = useMemo(() => {
    if (studyMode === 'flagged') {
      return flashcards.filter((card) => flaggedIds.has(card.id))
    }
    return flashcards
  }, [studyMode, flashcards, flaggedIds])

  // Ensure current index stays within the effective deck bounds.
  const safeIndex = Math.min(currentIndex, Math.max(effectiveFlashcards.length - 1, 0))

  // Persist current card ID, index, and study mode to localStorage.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const card = effectiveFlashcards[safeIndex]
    if (card) {
      localStorage.setItem(getCardIdStorageKey(chapterId), card.id)
      localStorage.setItem(getIndexStorageKey(chapterId), String(safeIndex))
    }
    localStorage.setItem(getStudyModeStorageKey(chapterId), studyMode)
  }, [safeIndex, chapterId, effectiveFlashcards, studyMode])

  // Load flagged cards from Supabase.
  useEffect(() => {
    let cancelled = false

    async function loadFlaggedIds() {
      if (!userId || !isSupabaseConfigured()) {
        setIsLoadingFlags(false)
        return
      }
      setIsLoadingFlags(true)
      try {
        const { data, error } = await supabase
          .from('flagged_flashcards')
          .select('flashcard_id')
          .eq('user_id', userId)
          .eq('chapter_id', chapterId)

        if (error) {
          const isMissingTable =
            error.code === 'PGRST116' ||
            error.message?.includes("Could not find the table 'public.flagged_flashcards'")
          if (isMissingTable) {
            // The backend table has not been applied yet. Fail silently so the
            // flashcard experience still works; the flagging UI will be disabled.
            if (!cancelled) {
              setBackendFlaggingReady(false)
            }
          } else {
            console.error('[FlashcardClient] Error loading flagged cards:', error.message)
          }
          return
        }
        if (!cancelled) {
          const ids = new Set<string>((data ?? []).map((row: { flashcard_id: string }) => row.flashcard_id))
          setFlaggedIds(ids)
          setBackendFlaggingReady(true)
        }
      } finally {
        if (!cancelled) {
          setIsLoadingFlags(false)
        }
      }
    }

    loadFlaggedIds()
    return () => {
      cancelled = true
    }
  }, [userId, chapterId])

  // Keyboard shortcuts: Space to flip, Arrow keys to navigate.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return

      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        setIsFlipped((prev) => !prev)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (currentIndex < effectiveFlashcards.length - 1) {
          setIsFlipped(false)
          setCurrentIndex((prev) => prev + 1)
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (currentIndex > 0) {
          setIsFlipped(false)
          setCurrentIndex((prev) => prev - 1)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [safeIndex, effectiveFlashcards.length])

  const currentCard = effectiveFlashcards[safeIndex]
  const isFlagged = currentCard ? flaggedIds.has(currentCard.id) : false
  const progress = effectiveFlashcards.length > 0
    ? ((safeIndex + 1) / effectiveFlashcards.length) * 100
    : 0

  const handleFlip = () => {
    setIsFlipped((prev) => !prev)
  }

  const handleNext = () => {
    if (safeIndex < effectiveFlashcards.length - 1) {
      setIsFlipped(false)
      setCurrentIndex((prev) => Math.min(prev + 1, effectiveFlashcards.length - 1))
    }
  }

  const handlePrevious = () => {
    if (safeIndex > 0) {
      setIsFlipped(false)
      setCurrentIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  const toggleFlag = async () => {
    if (!userId) {
      setFlagError("Couldn't save your study flag. Please sign in and try again.")
      return
    }
    if (!currentCard) return

    const cardId = currentCard.id
    const willBeFlagged = !flaggedIds.has(cardId)

    // Optimistically update local state.
    setFlaggedIds((prev) => {
      const next = new Set(prev)
      if (willBeFlagged) {
        next.add(cardId)
      } else {
        next.delete(cardId)
      }
      return next
    })
    setFlagError(null)

    if (!isSupabaseConfigured() || !backendFlaggingReady) {
      setFlagError("The flashcard flagging feature is not available right now. Please try again later.")
      return
    }

    try {
      if (willBeFlagged) {
        const { error } = await supabase
          .from('flagged_flashcards')
          .insert({ user_id: userId, chapter_id: chapterId, flashcard_id: cardId })

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('flagged_flashcards')
          .delete()
          .eq('user_id', userId)
          .eq('chapter_id', chapterId)
          .eq('flashcard_id', cardId)

        if (error) throw error
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[FlashcardClient] Flag toggle error:', message)
      // Revert optimistic update on failure.
      setFlaggedIds((prev) => {
        const next = new Set(prev)
        if (willBeFlagged) {
          next.delete(cardId)
        } else {
          next.add(cardId)
        }
        return next
      })
      setFlagError("Couldn't save your study flag. Please try again.")
    }
  }

  const handleMarkComplete = async () => {
    if (!userId) {
      console.error('[FlashcardClient] Cannot save progress: no userId provided')
      setSaveError('Unable to save progress. Please sign in again and retry.')
      return
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !sessionData.session) {
      console.error('[FlashcardClient] No authenticated session found:', sessionError?.message || 'Session is null')
      setSaveError('Your session has expired. Please sign in again to save your progress.')
      return
    }

    setSaving(true)
    setSaveError(null)
    try {
      let quizCompleted = false

      if (isSupabaseConfigured()) {
        const { data: existingProgress } = await supabase
          .from('student_progress')
          .select('quiz_completed')
          .eq('user_id', userId)
          .eq('chapter_id', chapterId)
          .maybeSingle()

        quizCompleted = existingProgress?.quiz_completed ?? false
      }

      const progressPercentage = calculateChapterProgress(true, quizCompleted)

      const { error } = await supabase
        .from('student_progress')
        .upsert({
          user_id: userId,
          chapter_id: chapterId,
          flashcards_completed: true,
          progress_percentage: progressPercentage,
          last_studied_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,chapter_id'
        })

      if (error) {
        throw new Error('We could not save your flashcard progress. Your current card position is still stored on this device. Please try again.')
      }
      setCompleted(true)
      setSaveError(null)
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err))
      console.error('[FlashcardClient] Error saving progress:', error.message)
      setSaveError(error.message || 'Something went wrong while saving your progress. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleModeChange = (mode: StudyMode) => {
    setStudyMode(mode)
    setIsFlipped(false)
    // Preserve the current card if it exists in the new deck; otherwise start at 0.
    if (currentCard) {
      const newDeck = mode === 'flagged'
        ? flashcards.filter((c) => flaggedIds.has(c.id))
        : flashcards
      const idx = newDeck.findIndex((c) => c.id === currentCard.id)
      setCurrentIndex(Math.min(idx >= 0 ? idx : 0, Math.max(newDeck.length - 1, 0)))
    } else {
      setCurrentIndex(0)
    }
  }

  if (effectiveFlashcards.length === 0 && studyMode === 'flagged') {
    return (
      <div className="space-y-6">
        <div className="flex justify-center gap-2 p-1 bg-gray-800 rounded-lg">
          <button
            onClick={() => handleModeChange('all')}
            aria-pressed={false}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-gray-900 text-gray-300 hover:text-white"
          >
            All Flashcards
          </button>
          <button
            onClick={() => handleModeChange('flagged')}
            aria-pressed={true}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-gray-900 bg-[#D4AF37] text-gray-900"
          >
            Flagged Flashcards
          </button>
        </div>
        <div className="text-center p-8 bg-gray-800/50 rounded-xl border border-gray-700">
          <p className="text-gray-300 mb-2">No flagged flashcards yet.</p>
          <p className="text-sm text-gray-500">Study in All Flashcards mode and click 🚩 Need More Practice on any card you want to review again.</p>
        </div>
      </div>
    )
  }

  if (!currentCard) {
    return (
      <div className="text-center p-8 text-gray-400">
        No flashcards available.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Study mode selector */}
      <div
        role="group"
        aria-label="Flashcard study mode"
        className="flex justify-center gap-2 p-1 bg-gray-800 rounded-lg"
      >
        <button
          onClick={() => handleModeChange('all')}
          aria-pressed={studyMode === 'all'}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-gray-900 ${
            studyMode === 'all' ? 'bg-[#D4AF37] text-gray-900' : 'text-gray-300 hover:text-white'
          }`}
        >
          All Flashcards
        </button>
        <button
          onClick={() => handleModeChange('flagged')}
          aria-pressed={studyMode === 'flagged'}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-gray-900 ${
            studyMode === 'flagged' ? 'bg-[#D4AF37] text-gray-900' : 'text-gray-300 hover:text-white'
          }`}
        >
          Flagged Flashcards
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="w-full bg-gray-800 rounded-full h-2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-label={`Flashcard progress: card ${safeIndex + 1} of ${effectiveFlashcards.length}`}
      >
        <div
          className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-center text-sm text-gray-400">
        Card {safeIndex + 1} of {effectiveFlashcards.length}
        {studyMode === 'flagged' && (
          <span className="ml-2 text-[#D4AF37]">({flaggedIds.size} flagged)</span>
        )}
      </div>

      {/* Error alerts */}
      {flagError && (
        <div
          role="alert"
          className="rounded-lg p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
        >
          <p className="font-medium">{flagError}</p>
        </div>
      )}

      {saveError && (
        <div
          role="alert"
          className="rounded-lg p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
        >
          <p className="font-medium mb-2">{saveError}</p>
          <button
            onClick={handleMarkComplete}
            disabled={saving}
            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
          >
            {saving ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      )}

      {/* Flashcard */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Flashcard ${safeIndex + 1} of ${effectiveFlashcards.length}. ${isFlipped ? 'Answer showing. Press Enter or Space to show question.' : 'Question showing. Press Enter or Space to show answer.'}`}
        onClick={handleFlip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleFlip()
          }
        }}
        className="relative h-64 md:h-80 cursor-pointer perspective-1000 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-gray-900 rounded-xl"
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
              {isFlagged && (
                <div className="inline-flex items-center gap-1 px-2 py-1 mb-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                  <Flag className="w-3 h-3" aria-hidden="true" />
                  <span>Needs Practice</span>
                </div>
              )}
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
              {isFlagged && (
                <div className="inline-flex items-center gap-1 px-2 py-1 mb-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                  <Flag className="w-3 h-3" aria-hidden="true" />
                  <span>Needs Practice</span>
                </div>
              )}
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={handlePrevious}
          disabled={safeIndex === 0}
          className="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          ← Previous
        </button>

        <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
          <button
            onClick={toggleFlag}
            disabled={isLoadingFlags || !userId || !backendFlaggingReady}
            aria-pressed={isFlagged}
            aria-label={isFlagged ? 'Remove flag from this flashcard' : 'Flag this flashcard for more practice'}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 ${
              isFlagged
                ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Flag className="w-4 h-4" aria-hidden="true" />
              {isFlagged ? 'Remove Flag' : 'Need More Practice'}
            </span>
          </button>

          {!completed && safeIndex === effectiveFlashcards.length - 1 && (
            <button
              onClick={handleMarkComplete}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-gray-900"
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
          disabled={safeIndex === effectiveFlashcards.length - 1}
          className="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-gray-900"
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
