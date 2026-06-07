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

// Re-export Chapter 8 premium flashcards
export { chapter8PremiumFlashcards } from './chapter-8-premium-flashcards'

// Re-export Chapter 9 premium flashcards
export { chapter9PremiumFlashcards } from './chapter-9-premium-flashcards'
// Re-export Chapter 10 premium flashcards
export { chapter10PremiumFlashcards } from './chapter-10-premium-flashcards'
// Re-export Chapter 11 premium flashcards
export { chapter11PremiumFlashcards } from './chapter-11-premium-flashcards'
// Re-export Chapter 12 premium flashcards
export { chapter12PremiumFlashcards } from './chapter-12-premium-flashcards'
// Re-export Chapter 13 premium flashcards
export { chapter13PremiumFlashcards } from './chapter-13-premium-flashcards'
import { chapter1PremiumFlashcards } from './chapter-1-premium-flashcards'
import { chapter2PremiumFlashcards } from './chapter-2-premium-flashcards'
import { chapter3PremiumFlashcards } from './chapter-3-premium-flashcards'
import { chapter4PremiumFlashcards } from './chapter-4-premium-flashcards'
import { chapter5PremiumFlashcards } from './chapter-5-premium-flashcards'
import { chapter7PremiumFlashcards } from './chapter-7-premium-flashcards'
import { chapter8PremiumFlashcards } from './chapter-8-premium-flashcards'
import { chapter9PremiumFlashcards } from './chapter-9-premium-flashcards'
import { chapter10PremiumFlashcards } from './chapter-10-premium-flashcards'
import { chapter11PremiumFlashcards } from './chapter-11-premium-flashcards'
import { chapter12PremiumFlashcards } from './chapter-12-premium-flashcards'
import { chapter13PremiumFlashcards } from './chapter-13-premium-flashcards'

export const chapterFlashcards: Record<string, Flashcard[]> = {
  'ch-1': chapter1PremiumFlashcards,
  'ch-2': chapter2PremiumFlashcards,
  'ch-3': chapter3PremiumFlashcards,
  'ch-4': chapter4PremiumFlashcards,
  'ch-5': chapter5PremiumFlashcards,
  'ch-7': chapter7PremiumFlashcards,
  'ch-8': chapter8PremiumFlashcards,
  'ch-9': chapter9PremiumFlashcards,
  'ch-10': chapter10PremiumFlashcards,
  'ch-11': chapter11PremiumFlashcards,
  'ch-12': chapter12PremiumFlashcards,
  'ch-13': chapter13PremiumFlashcards,
}

export default chapterFlashcards
