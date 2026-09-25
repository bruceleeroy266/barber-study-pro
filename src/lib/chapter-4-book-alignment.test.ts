import { describe, expect, it } from 'vitest'
import { chapter4PremiumContent } from './chapter-4-premium'
import { chapter4PremiumFlashcards } from './chapter-4-premium-flashcards'
import { chapter4PremiumQuizQuestions } from './chapter-4-premium-quiz'
import { chapter4ReassessmentQuestions } from './chapter-4-reassessment-questions'
import { chapter4ContentConceptMappings } from './chapter-4-concepts/mappings'

describe('C4 source-book lesson alignment', () => {
  const lesson = JSON.stringify(chapter4PremiumContent)

  it('serves and maps every new source-aligned lesson block', () => {
    const expected = [
      'regulatory-source-detail',
      'infection-principles-source-detail',
      'processing-source-detail',
      'disinfectant-antiseptic-source-detail',
      'standard-precautions-source-detail',
      'safe-work-practices-source-detail',
      'professional-responsibilities-source-detail',
    ]
    const ids = chapter4PremiumContent.sections.map((section) => section.id)
    for (const id of expected) {
      expect(ids).toContain(id)
      expect(chapter4ContentConceptMappings.some((m) => m.contentBlockId === id)).toBe(true)
    }
  })

  it('covers all eight source learning-objective targets at lesson level', () => {
    const evidence: Record<string, string[]> = {
      LO1: ['OSHA', 'EPA', 'STATE AGENCIES', '16-section Safety Data Sheet', 'GHS PICTOGRAMS'],
      LO2: ['COCCI', 'BACILLI', 'SPIRILLA', 'ACTIVE / INACTIVE'],
      LO3: ['DIRECT TRANSMISSION', 'INDIRECT TRANSMISSION', 'LOCAL vs SYSTEMIC', 'ASYMPTOMATIC', 'IMMUNITY'],
      LO4: ['CLEANING', 'DISINFECTION', 'STERILIZATION', 'autoclave', 'spore testing'],
      LO5: ['HOSPITAL DISINFECTANT', 'TUBERCULOCIDAL CLAIM', 'QUATS', 'PHENOLICS / BLEACH', 'ANTISEPTIC'],
      LO6: ['STANDARD PRECAUTIONS', 'human blood and certain body fluids as potentially infectious', 'safe handling and disposal of sharps'],
      LO7: ['WATER', 'ELECTRICITY', 'TOOLS & APPLIANCES', 'HEAT & FIRE', 'CHEMICALS', 'CORDS & WALKWAYS'],
      LO8: ['Keep your professional license', 'Check for updates to state rules', 'Keep emergency contact information', 'Never skip cleaning/disinfection steps'],
    }
    for (const [objective, terms] of Object.entries(evidence)) {
      for (const term of terms) expect(lesson, `${objective} missing: ${term}`).toContain(term)
    }
  })

  it('removes audited unsupported absolutes from the lesson', () => {
    const forbidden = [
      '50% of pathogens',
      '99.9%',
      '100x more contagious',
      '$50,000+',
      'permanent revocation',
      'OSHA inspectors ask for this FIRST',
      'replace at 3/4 full',
      'Most disinfectants require 10 minutes',
      'Disinfectant needs 10 MINUTES',
      'less than 10% of pathogens',
    ]
    for (const phrase of forbidden) expect(lesson).not.toContain(phrase)
  })

  it('preserves the locked lesson while flashcards expand and assessments remain unchanged', () => {
    expect(chapter4PremiumFlashcards).toHaveLength(70)
    expect(chapter4PremiumQuizQuestions).toHaveLength(30)
    expect(chapter4ReassessmentQuestions).toHaveLength(90)
  })

  it('keeps source-aligned production wording original rather than source-brand copy', () => {
    expect(lesson).not.toContain('Milady')
  })
})
