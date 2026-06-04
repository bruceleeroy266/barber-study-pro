// Orphaned Flashcard Integration
// Converts orphaned FlashcardData to V2 Flashcard schema
// Batch 1: Chapters 2 (merge), 5, 6
// Batch 2: Chapters 7, 8, 9

import { Flashcard } from './flashcards-data'

// Import orphaned sources
import { chapter2Flashcards, chapter5Flashcards } from './flashcard-expansion'
import { chapter6Flashcards as ch6Exp } from './flashcard-expansion-part2'
import { chapter6AllEnhanced } from './chapter6-enhanced-flashcards'

// Batch 3 imports
import {
  chapter10Structure,
  chapter10Chemistry,
  chapter10Growth,
  chapter10Properties1,
} from './chapter10-enhanced-flashcards'
import {
  chapter10Porosity,
  chapter10Elasticity,
  chapter10Pigment,
  chapter10Disorders,
  chapter10ScalpConditions,
  chapter10AllPart2,
} from './chapter10-enhanced-flashcards-part2'
import {
  chapter10Alopecia,
  chapter10Infections,
  chapter10Analysis,
  chapter10AllPart3,
} from './chapter10-enhanced-flashcards-part3'
import {
  chapter11ShampooService,
  chapter11ScalpMassage,
} from './chapter11-enhanced-flashcards'
import {
  chapter11Treatments,
  chapter11Protocols,
  chapter11AllPart2,
} from './chapter11-enhanced-flashcards-part2'
// Chapter 12 orphaned flashcards removed during hard reset

// Batch 4 imports
import {
  chapter15ConsultationPsychology,
} from './chapter15-enhanced-flashcards-part1'
import {
  chapter15HairMaterials,
} from './chapter15-enhanced-flashcards-part2'

// Additional orphaned chapters from expansion files
import { chapter13Flashcards, chapter14Flashcards, chapter17Flashcards } from './flashcard-expansion-part4'
import { chapter18Flashcards, chapter19Flashcards, chapter20Flashcards, chapter21Flashcards } from './flashcard-expansion-part5'

// Transform function: converts orphaned schema to V2 schema
function transform(
  source: Array<{
    chapterNumber: number
    front: string
    back: string
    category: string
    difficulty: 'easy' | 'medium' | 'hard'
  }>,
  chapterNum: number,
  idPrefix: string
): Flashcard[] {
  return source.map((card, idx) => ({
    id: `fc-${idPrefix}-${String(idx + 1).padStart(3, '0')}`,
    chapter_id: `ch-${chapterNum}`,
    front: card.front,
    back: card.back,
    category: card.category || null,
    difficulty: card.difficulty || null,
    order_index: idx + 1,
    is_active: true,
  }))
}

// Chapter 2: Orphaned cards (will be merged with active)
export const ch2Orphaned = transform(chapter2Flashcards, 2, '2o')

// Chapter 4: No orphaned file found — will remain placeholder for now
export const ch4Orphaned: Flashcard[] = []

// Chapter 5: From flashcard-expansion.ts
export const ch5Orphaned = transform(chapter5Flashcards, 5, '5o')

// Chapter 6: Merge from both sources (expansion + enhanced)
const ch6Combined = [...ch6Exp, ...chapter6AllEnhanced]
// Remove duplicates by front text
const ch6Unique = ch6Combined.filter(
  (card, idx, self) => idx === self.findIndex(c => c.front === card.front)
)
export const ch6Orphaned = transform(ch6Unique, 6, '6o')

// Export all for Batch 1
export const batch1Flashcards: Record<string, Flashcard[]> = {
  'ch-2': ch2Orphaned,
  'ch-4': ch4Orphaned,
  'ch-5': ch5Orphaned,
  'ch-6': ch6Orphaned,
}

// Batch 3: Chapters 10, 11, 12
const ch10Combined = [
  ...chapter10Structure,
  ...chapter10Chemistry,
  ...chapter10Growth,
  ...chapter10Properties1,
  ...chapter10Porosity,
  ...chapter10Elasticity,
  ...chapter10Pigment,
  ...chapter10Disorders,
  ...chapter10ScalpConditions,
  ...chapter10AllPart2,
  ...chapter10Alopecia,
  ...chapter10Infections,
  ...chapter10Analysis,
  ...chapter10AllPart3,
]
const ch10Unique = ch10Combined.filter(
  (card, idx, self) => idx === self.findIndex(c => c.front === card.front)
)
export const ch10Orphaned = transform(ch10Unique, 10, '10o')

const ch11Combined = [
  ...chapter11ShampooService,
  ...chapter11ScalpMassage,
  ...chapter11Treatments,
  ...chapter11Protocols,
  ...chapter11AllPart2,
]
const ch11Unique = ch11Combined.filter(
  (card, idx, self) => idx === self.findIndex(c => c.front === card.front)
)
export const ch11Orphaned = transform(ch11Unique, 11, '11o')

// Batch 4: Chapters 13, 14, 15, 17, 18, 19, 20, 21
const ch13Combined = [...chapter13Flashcards]
const ch13Unique = ch13Combined.filter(
  (card, idx, self) => idx === self.findIndex(c => c.front === card.front)
)
export const ch13Orphaned = transform(ch13Unique, 13, '13o')

const ch14Combined = [...chapter14Flashcards]
const ch14Unique = ch14Combined.filter(
  (card, idx, self) => idx === self.findIndex(c => c.front === card.front)
)
export const ch14Orphaned = transform(ch14Unique, 14, '14o')

const ch15Combined = [...chapter15ConsultationPsychology, ...chapter15HairMaterials]
const ch15Unique = ch15Combined.filter(
  (card, idx, self) => idx === self.findIndex(c => c.front === card.front)
)
export const ch15Orphaned = transform(ch15Unique, 15, '15o')

const ch17Combined = [...chapter17Flashcards]
const ch17Unique = ch17Combined.filter(
  (card, idx, self) => idx === self.findIndex(c => c.front === card.front)
)
export const ch17Orphaned = transform(ch17Unique, 17, '17o')

const ch18Combined = [...chapter18Flashcards]
const ch18Unique = ch18Combined.filter(
  (card, idx, self) => idx === self.findIndex(c => c.front === card.front)
)
export const ch18Orphaned = transform(ch18Unique, 18, '18o')

const ch19Combined = [...chapter19Flashcards]
const ch19Unique = ch19Combined.filter(
  (card, idx, self) => idx === self.findIndex(c => c.front === card.front)
)
export const ch19Orphaned = transform(ch19Unique, 19, '19o')

const ch20Combined = [...chapter20Flashcards]
const ch20Unique = ch20Combined.filter(
  (card, idx, self) => idx === self.findIndex(c => c.front === card.front)
)
export const ch20Orphaned = transform(ch20Unique, 20, '20o')

const ch21Combined = [...chapter21Flashcards]
const ch21Unique = ch21Combined.filter(
  (card, idx, self) => idx === self.findIndex(c => c.front === card.front)
)
export const ch21Orphaned = transform(ch21Unique, 21, '21o')

// Export all for Batch 3
export const batch3Flashcards: Record<string, Flashcard[]> = {
  'ch-10': ch10Orphaned,
  'ch-11': ch11Orphaned,
}

// Export all for Batch 4
export const batch4Flashcards: Record<string, Flashcard[]> = {
  'ch-13': ch13Orphaned,
  'ch-14': ch14Orphaned,
  'ch-15': ch15Orphaned,
  'ch-17': ch17Orphaned,
  'ch-18': ch18Orphaned,
  'ch-19': ch19Orphaned,
  'ch-20': ch20Orphaned,
  'ch-21': ch21Orphaned,
}

// Stats
export const batch1Stats = {
  ch2: ch2Orphaned.length,
  ch4: ch4Orphaned.length,
  ch5: ch5Orphaned.length,
  ch6: ch6Orphaned.length,
  total: ch2Orphaned.length + ch4Orphaned.length + ch5Orphaned.length + ch6Orphaned.length,
}

export const batch2Stats = {
  total: 0,
}

export const batch3Stats = {
  ch10: ch10Orphaned.length,
  ch11: ch11Orphaned.length,
  total: ch10Orphaned.length + ch11Orphaned.length,
}

export const batch4Stats = {
  ch13: ch13Orphaned.length,
  ch14: ch14Orphaned.length,
  ch15: ch15Orphaned.length,
  ch17: ch17Orphaned.length,
  ch18: ch18Orphaned.length,
  ch19: ch19Orphaned.length,
  ch20: ch20Orphaned.length,
  ch21: ch21Orphaned.length,
  total: ch13Orphaned.length + ch14Orphaned.length + ch15Orphaned.length +
         ch17Orphaned.length + ch18Orphaned.length + ch19Orphaned.length +
         ch20Orphaned.length + ch21Orphaned.length,
}
