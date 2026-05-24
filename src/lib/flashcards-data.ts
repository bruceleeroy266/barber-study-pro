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

import { chapter1PremiumFlashcards } from './chapter-1-premium-flashcards'
import { chapter2PremiumFlashcards } from './chapter-2-premium-flashcards'

export const chapterFlashcards: Record<string, Flashcard[]> = {
  'ch-1': chapter1PremiumFlashcards,
  'ch-2': chapter2PremiumFlashcards,
  'ch-3': [
    // Legacy Chapter 3 flashcards
    {
      id: 'fc-3-001',
      chapter_id: 'ch-3',
      front: 'What are the key elements of professional image?',
      back: 'Professional image includes personal grooming, attire, communication skills, and attitude.',
      category: 'Professional Image',
      difficulty: 'easy',
      order_index: 1,
      is_active: true,
    },
  ],
  'ch-4': [
    // Legacy Chapter 4 flashcards
    {
      id: 'fc-4-001',
      chapter_id: 'ch-4',
      front: 'What is the first step in infection control?',
      back: 'Hand washing is the first and most important step in infection control.',
      category: 'Infection Control',
      difficulty: 'easy',
      order_index: 1,
      is_active: true,
    },
  ],
}

export default chapterFlashcards
