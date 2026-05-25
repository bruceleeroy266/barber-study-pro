// Real flashcards for Barber Study Pro V2
// Chapter 1: Premium image-based rebuild (45 cards, 6 categories)
// Chapters 2-4: Legacy content (to be rebuilt)
// DO NOT copy textbook sentences directly - all content is paraphrased

export interface Flashcard {
  id: string;
  chapter_id: string;
  front: string;
  back: string;
  category: string | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  order_index: number;
  is_active: boolean;
}

// Re-export Chapter 1 premium flashcards
export { chapter1PremiumFlashcards } from './chapter-1-premium-flashcards'

// Re-export Chapter 2 premium flashcards
export { chapter2PremiumFlashcards } from './chapter-2-premium-flashcards'

// Re-export Chapter 3 premium flashcards
export { chapter3PremiumFlashcards } from './chapter-3-premium-flashcards'

// Re-export Chapter 4 premium flashcards
export { chapter4PremiumFlashcards } from './chapter-4-premium-flashcards'

// Re-export Chapter 5 premium flashcards
export { chapter5PremiumFlashcards } from './chapter-5-premium-flashcards'

// Re-export Chapter 7 premium flashcards
export { chapter7PremiumFlashcards } from './chapter-7-premium-flashcards'

import { chapter1PremiumFlashcards } from './chapter-1-premium-flashcards'
import { chapter2PremiumFlashcards } from './chapter-2-premium-flashcards'
import { chapter3PremiumFlashcards } from './chapter-3-premium-flashcards'
import { chapter4PremiumFlashcards } from './chapter-4-premium-flashcards'
import { chapter5PremiumFlashcards } from './chapter-5-premium-flashcards'
import { chapter7PremiumFlashcards } from './chapter-7-premium-flashcards'

export const chapterFlashcards: Record<string, Flashcard[]> = {
  'ch-1': chapter1PremiumFlashcards,
  'ch-2': chapter2PremiumFlashcards,
  'ch-3': chapter3PremiumFlashcards,
  'ch-4': chapter4PremiumFlashcards,
  'ch-5': chapter5PremiumFlashcards,
  'ch-7': chapter7PremiumFlashcards,
}

export default chapterFlashcards
