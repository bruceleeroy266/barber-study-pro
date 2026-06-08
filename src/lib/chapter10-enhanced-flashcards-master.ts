/**
 * CHAPTER 10 ENHANCED FLASHCARDS - MASTER EXPORT
 * Complete compilation with statistics
 */

import {
  chapter10Structure,
  chapter10Chemistry,
  chapter10Growth,
  chapter10Properties1,
  FlashcardData
} from './chapter10-enhanced-flashcards'

import {
  chapter10Porosity,
  chapter10Elasticity,
  chapter10Pigment,
  chapter10Disorders,
  chapter10ScalpConditions
} from './chapter10-enhanced-flashcards-part2'

import {
  chapter10Alopecia,
  chapter10Infections,
  chapter10Analysis
} from './chapter10-enhanced-flashcards-part3'

// Master export
export const chapter10AllEnhanced: FlashcardData[] = [
  ...chapter10Structure,
  ...chapter10Chemistry,
  ...chapter10Growth,
  ...chapter10Properties1,
  ...chapter10Porosity,
  ...chapter10Elasticity,
  ...chapter10Pigment,
  ...chapter10Disorders,
  ...chapter10ScalpConditions,
  ...chapter10Alopecia,
  ...chapter10Infections,
  ...chapter10Analysis
]

// Statistics
export const chapter10Stats = {
  structure: chapter10Structure.length,
  chemistry: chapter10Chemistry.length,
  growth: chapter10Growth.length,
  textureAndDensity: chapter10Properties1.length,
  porosity: chapter10Porosity.length,
  elasticity: chapter10Elasticity.length,
  pigment: chapter10Pigment.length,
  disorders: chapter10Disorders.length,
  scalpConditions: chapter10ScalpConditions.length,
  alopecia: chapter10Alopecia.length,
  infections: chapter10Infections.length,
  professionalAnalysis: chapter10Analysis.length,
  total: chapter10AllEnhanced.length
}

// Category groupings
export const chapter10Categories = {
  'Hair Structure & Composition': chapter10Structure.length + chapter10Chemistry.length,
  'Growth & Cycles': chapter10Growth.length,
  'Hair Properties Analysis': chapter10Properties1.length + chapter10Porosity.length + chapter10Elasticity.length + chapter10Pigment.length,
  'Disorders & Conditions': chapter10Disorders.length + chapter10ScalpConditions.length,
  'Hair Loss': chapter10Alopecia.length,
  'Infections': chapter10Infections.length,
  'Professional Analysis': chapter10Analysis.length
}

// Difficulty distribution
export const chapter10Difficulty = {
  easy: chapter10AllEnhanced.filter(c => c.difficulty === 'easy').length,
  medium: chapter10AllEnhanced.filter(c => c.difficulty === 'medium').length,
  hard: chapter10AllEnhanced.filter(c => c.difficulty === 'hard').length
}


