/**
 * CHAPTER 11 ENHANCED FLASHCARDS - MASTER EXPORT
 */

import {
  chapter11ShampooService,
  chapter11ScalpMassage,
  FlashcardData
} from './chapter11-enhanced-flashcards'

import {
  chapter11Treatments,
  chapter11Protocols
} from './chapter11-enhanced-flashcards-part2'

export const chapter11AllEnhanced: FlashcardData[] = [
  ...chapter11ShampooService,
  ...chapter11ScalpMassage,
  ...chapter11Treatments,
  ...chapter11Protocols
]

export const chapter11Stats = {
  shampooService: chapter11ShampooService.length,
  scalpMassage: chapter11ScalpMassage.length,
  treatments: chapter11Treatments.length,
  protocols: chapter11Protocols.length,
  total: chapter11AllEnhanced.length
}


