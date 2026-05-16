/**
 * CHAPTER 9 ENHANCED FLASHCARDS - MASTER EXPORT
 * The Skin: Structure, Disorders, and Diseases
 * Complete compilation of all Chapter 9 flashcard enhancements
 */

import {
  chapter9Epidermis,
  chapter9DermisSubcutaneous,
  chapter9Functions,
  chapter9Glands,
  chapter9PrimaryLesions,
  chapter9SecondaryLesions,
  FlashcardData
} from './chapter9-enhanced-flashcards'

import {
  chapter9AcneDisorders,
  chapter9SweatDisorders,
  chapter9InflammatoryConditions,
  chapter9ContagiousInfections,
  chapter9PigmentDisorders,
  chapter9SkinCancer,
  chapter9ProfessionalProtocols
} from './chapter9-enhanced-flashcards-part2'

// Combine all Chapter 9 enhanced flashcards
export const chapter9AllEnhanced: FlashcardData[] = [
  ...chapter9Epidermis,
  ...chapter9DermisSubcutaneous,
  ...chapter9Functions,
  ...chapter9Glands,
  ...chapter9PrimaryLesions,
  ...chapter9SecondaryLesions,
  ...chapter9AcneDisorders,
  ...chapter9SweatDisorders,
  ...chapter9InflammatoryConditions,
  ...chapter9ContagiousInfections,
  ...chapter9PigmentDisorders,
  ...chapter9SkinCancer,
  ...chapter9ProfessionalProtocols
]

// Statistics
export const chapter9EnhancedStats = {
  // Structure & Function
  epidermis: chapter9Epidermis.length,
  dermisSubcutaneous: chapter9DermisSubcutaneous.length,
  functions: chapter9Functions.length,
  glands: chapter9Glands.length,
  
  // Lesions (STATE BOARD CRITICAL)
  primaryLesions: chapter9PrimaryLesions.length,
  secondaryLesions: chapter9SecondaryLesions.length,
  
  // Disorders & Conditions
  acneDisorders: chapter9AcneDisorders.length,
  sweatDisorders: chapter9SweatDisorders.length,
  inflammatoryConditions: chapter9InflammatoryConditions.length,
  
  // INFECTION CONTROL CRITICAL
  contagiousInfections: chapter9ContagiousInfections.length,
  
  // Clinical Recognition
  pigmentDisorders: chapter9PigmentDisorders.length,
  skinCancer: chapter9SkinCancer.length,
  
  // PROFESSIONAL PRACTICE CRITICAL
  professionalProtocols: chapter9ProfessionalProtocols.length,
  
  // Totals
  total: chapter9AllEnhanced.length,
  safetyCritical: chapter9ContagiousInfections.length + chapter9ProfessionalProtocols.length + chapter9SkinCancer.length,
  stateBoardCritical: chapter9PrimaryLesions.length + chapter9SecondaryLesions.length
}

// Category breakdown
export const chapter9Categories = {
  'Skin Structure': chapter9Epidermis.length + chapter9DermisSubcutaneous.length,
  'Skin Functions & Glands': chapter9Functions.length + chapter9Glands.length,
  'Lesion Identification': chapter9PrimaryLesions.length + chapter9SecondaryLesions.length,
  'Skin Disorders': chapter9AcneDisorders.length + chapter9SweatDisorders.length + chapter9InflammatoryConditions.length,
  'Infections & Safety': chapter9ContagiousInfections.length,
  'Pigmentation & Cancer': chapter9PigmentDisorders.length + chapter9SkinCancer.length,
  'Professional Protocols': chapter9ProfessionalProtocols.length
}

// Difficulty distribution
export const chapter9DifficultyStats = {
  easy: chapter9AllEnhanced.filter(card => card.difficulty === 'easy').length,
  medium: chapter9AllEnhanced.filter(card => card.difficulty === 'medium').length,
  hard: chapter9AllEnhanced.filter(card => card.difficulty === 'hard').length
}

// Quality metrics
export const chapter9QualityMetrics = {
  totalCards: chapter9AllEnhanced.length,
  averageCardLength: Math.round(
    chapter9AllEnhanced.reduce((sum, card) => sum + card.back.length, 0) / chapter9AllEnhanced.length
  ),
  categoriesC overed: Object.keys(chapter9Categories).length,
  safetyCriticalPercentage: Math.round(
    (chapter9EnhancedStats.safetyCritical / chapter9AllEnhanced.length) * 100
  ),
  stateBoardCriticalPercentage: Math.round(
    (chapter9EnhancedStats.stateBoardCritical / chapter9AllEnhanced.length) * 100
  )
}

console.log(`Chapter 9 Enhanced Flashcards: ${chapter9EnhancedStats.total} cards created`)
console.log(`Safety-Critical Cards: ${chapter9EnhancedStats.safetyCritical} (${chapter9QualityMetrics.safetyCriticalPercentage}%)`)
console.log(`State Board Critical: ${chapter9EnhancedStats.stateBoardCritical} (${chapter9QualityMetrics.stateBoardCriticalPercentage}%)`)
