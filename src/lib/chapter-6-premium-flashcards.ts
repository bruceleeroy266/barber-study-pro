import type { Flashcard } from '@/types'
import { chapter6AllEnhanced } from './chapter6-enhanced-flashcards'

/**
 * Canonical Chapter 6 flashcard projection.
 * Preserves the hardened original 105-card C6-4 order and appends C6-8 book-aligned cards while exposing the production
 * Flashcard contract and stable fc-6-001..125 IDs used by concept mappings.
 */
export const chapter6PremiumFlashcards: Flashcard[] = chapter6AllEnhanced.map((card, index) => ({
  id: `fc-6-${String(index + 1).padStart(3, '0')}`,
  chapter_id: 'ch-6',
  front: card.front,
  back: card.back,
  category: card.category,
  difficulty: card.difficulty,
  order_index: index + 1,
  is_active: true,
}))
