import { getChapterContent } from '../chapter-content'
import { chapterFlashcards } from '../flashcards-data'
import { chapter1ContentConceptMappings, chapter1FlashcardConceptMappings } from '../chapter-1-concepts/mappings'
import { chapter2ContentMappings, chapter2FlashcardMappings } from '../chapter-2-concepts/mappings'
import { chapter3ContentConceptMappings, chapter3FlashcardConceptMappings } from '../chapter-3-concepts/mappings'
import { chapter4ContentConceptMappings, chapter4FlashcardConceptMappings } from '../chapter-4-concepts/mappings'
import { chapter5ContentConceptMappings, chapter5FlashcardConceptMappings } from '../chapter-5-concepts/mappings'
import { chapter6ContentConceptMappings, chapter6FlashcardConceptMappings } from '../chapter-6-concepts/mappings'
import { chapter7ContentConceptMappings, chapter7FlashcardConceptMappings } from '../chapter-7-concepts/mappings'
import { chapter8ContentConceptMappings, chapter8FlashcardConceptMappings } from '../chapter-8-concepts/mappings'
import { chapter9ContentConceptMappings, chapter9FlashcardConceptMappings } from '../chapter-9-concepts/mappings'
import { chapter10ContentConceptMappings, chapter10FlashcardConceptMappings } from '../chapter-10-concepts/mappings'
import { chapter11ContentConceptMappings, chapter11FlashcardConceptMappings } from '../chapter-11-concepts/mappings'
import { chapter12ContentConceptMappings, chapter12FlashcardConceptMappings } from '../chapter-12-concepts/mappings'
import { chapter13ContentConceptMappings, chapter13FlashcardConceptMappings } from '../chapter-13-concepts/mappings'
import { chapter14ContentConceptMappings, chapter14FlashcardConceptMappings } from '../chapter-14-concepts/mappings'
import { chapter15ContentConceptMappings, chapter15FlashcardConceptMappings } from '../chapter-15-concepts/mappings'
import { chapter16ContentConceptMappings, chapter16FlashcardConceptMappings } from '../chapter-16-concepts/mappings'
import { chapter17ContentConceptMappings, chapter17FlashcardConceptMappings } from '../chapter-17-concepts/mappings'
import { chapter18ContentConceptMappings, chapter18FlashcardConceptMappings } from '../chapter-18-concepts/mappings'
import { chapter19ContentConceptMappings, chapter19FlashcardConceptMappings } from '../chapter-19-concepts/mappings'
import { chapter20ContentConceptMappings, chapter20FlashcardConceptMappings } from '../chapter-20-concepts/mappings'
import { chapter21ContentConceptMappings, chapter21FlashcardConceptMappings } from '../chapter-21-concepts/mappings'

type GenericMapping = {
  flashcardId?: string
  contentBlockId?: string
  conceptFamilyId?: string
  conceptId?: string
}

function conceptId(mapping: GenericMapping): string | null {
  const value = mapping.conceptFamilyId ?? mapping.conceptId
  return typeof value === 'string' ? value : null
}

function normalizeFlashcards(rows: readonly GenericMapping[]) {
  return rows.flatMap((mapping) => {
    const id = mapping.flashcardId
    const concept = conceptId(mapping)
    return typeof id === 'string' && concept ? [{ itemId: id, conceptId: concept }] : []
  })
}

function normalizeContent(rows: readonly GenericMapping[]) {
  return rows.flatMap((mapping) => {
    const id = mapping.contentBlockId
    const concept = conceptId(mapping)
    return typeof id === 'string' && concept ? [{ sectionId: id, conceptId: concept }] : []
  })
}

const flashcardMappings: Record<string, readonly GenericMapping[]> = {
  'ch-1': chapter1FlashcardConceptMappings,
  'ch-2': chapter2FlashcardMappings,
  'ch-3': chapter3FlashcardConceptMappings,
  'ch-4': chapter4FlashcardConceptMappings,
  'ch-5': chapter5FlashcardConceptMappings,
  'ch-6': chapter6FlashcardConceptMappings,
  'ch-7': chapter7FlashcardConceptMappings,
  'ch-8': chapter8FlashcardConceptMappings,
  'ch-9': chapter9FlashcardConceptMappings,
  'ch-10': chapter10FlashcardConceptMappings,
  'ch-11': chapter11FlashcardConceptMappings,
  'ch-12': chapter12FlashcardConceptMappings,
  'ch-13': chapter13FlashcardConceptMappings,
  'ch-14': chapter14FlashcardConceptMappings,
  'ch-15': chapter15FlashcardConceptMappings,
  'ch-16': chapter16FlashcardConceptMappings,
  'ch-17': chapter17FlashcardConceptMappings,
  'ch-18': chapter18FlashcardConceptMappings,
  'ch-19': chapter19FlashcardConceptMappings,
  'ch-20': chapter20FlashcardConceptMappings,
  'ch-21': chapter21FlashcardConceptMappings,
}

const contentMappings: Record<string, readonly GenericMapping[]> = {
  'ch-1': chapter1ContentConceptMappings,
  'ch-2': chapter2ContentMappings,
  'ch-3': chapter3ContentConceptMappings,
  'ch-4': chapter4ContentConceptMappings,
  'ch-5': chapter5ContentConceptMappings,
  'ch-6': chapter6ContentConceptMappings,
  'ch-7': chapter7ContentConceptMappings,
  'ch-8': chapter8ContentConceptMappings,
  'ch-9': chapter9ContentConceptMappings,
  'ch-10': chapter10ContentConceptMappings,
  'ch-11': chapter11ContentConceptMappings,
  'ch-12': chapter12ContentConceptMappings,
  'ch-13': chapter13ContentConceptMappings,
  'ch-14': chapter14ContentConceptMappings,
  'ch-15': chapter15ContentConceptMappings,
  'ch-16': chapter16ContentConceptMappings,
  'ch-17': chapter17ContentConceptMappings,
  'ch-18': chapter18ContentConceptMappings,
  'ch-19': chapter19ContentConceptMappings,
  'ch-20': chapter20ContentConceptMappings,
  'ch-21': chapter21ContentConceptMappings,
}

export function getFlashcardEvidenceConcept(chapterId: string, flashcardId: string): string | null {
  return normalizeFlashcards(flashcardMappings[chapterId] ?? []).find((row) => row.itemId === flashcardId)?.conceptId ?? null
}

const scenarioItemConceptOverrides: Readonly<Record<string, readonly string[]>> = {
  'ch-1:chapter-1-application-scenarios': [
    'ch1-barber-surgeons-symbols',
    'ch1-tools-technology',
    'ch1-modern-profession',
  ],
  // Chapter 6's cross-system scenario block intentionally applies three
  // different concept families; keep the evidence at item granularity.
  'ch-6:real-shop-scenarios': [
    'ch6-cardiovascular',
    'ch6-lymphatic',
    'ch6-endocrine',
  ],
  'ch-10:diagnostic-scenarios': [
    'ch10-analysis-properties',
    'ch10-infectious-parasitic-scalp',
    'ch10-service-safety-referral',
  ],
  'ch-13:shaving-application-scenarios': [
    'ch13-hair-growth-ingrown-prevention',
    'ch13-razor-handling-stretching-technique',
    'ch13-infection-control-service-safety',
    'ch13-client-care-professional-practice',
  ],
  'ch-20:ch20-real-shop-scenarios': [
    'ch20-teamwork-workplace-relationships',
    'ch20-ethical-selling-retailing',
    'ch20-financial-responsibility-income-reporting',
    'ch20-ethical-selling-retailing',
    'ch20-employment-classification-compensation',
  ],
  'ch-21:ch21-kc1': [
    'ch21-business-entry-paths',
    'ch21-shop-opening-planning',
  ],
  'ch-21:ch21-kc2': [
    'ch21-ownership-legal-structures',
    'ch21-ownership-legal-structures',
  ],
  'ch-21:ch21-kc3': [
    'ch21-business-plan-financial-planning',
    'ch21-business-plan-financial-planning',
  ],
  'ch-21:ch21-kc4': [
    'ch21-recordkeeping-financial-compliance',
    'ch21-booth-rental-independent-business-responsibilities',
  ],
  'ch-21:ch21-real-shop-scenarios': [
    'ch21-business-entry-paths',
    'ch21-shop-operations-management',
    'ch21-recordkeeping-financial-compliance',
    'ch21-booth-rental-independent-business-responsibilities',
    'ch21-advertising-marketing-client-consent',
  ],
}

export function getScenarioEvidenceConcept(
  chapterId: string,
  sectionId: string,
  scenarioIndex?: number,
): string | null {
  if (scenarioIndex != null) {
    const override = scenarioItemConceptOverrides[`${chapterId}:${sectionId}`]?.[scenarioIndex]
    if (override) return override
  }
  return normalizeContent(contentMappings[chapterId] ?? []).find((row) => row.sectionId === sectionId)?.conceptId ?? null
}

export function getFlashcardEvidenceInventory(chapterId: string): readonly string[] {
  const mapped = new Set(normalizeFlashcards(flashcardMappings[chapterId] ?? []).map((row) => row.itemId))
  return (chapterFlashcards[chapterId] ?? [])
    .filter((card) => card.is_active && mapped.has(card.id))
    .map((card) => card.id)
}

export function getScenarioEvidenceInventory(chapterId: string): readonly string[] {
  if (!isUnifiedActivityEvidenceChapter(chapterId)) return []
  const number = Number(chapterId.replace('ch-', ''))
  if (!Number.isInteger(number) || number < 1) return []
  const content = getChapterContent(number)
  if (!content) return []

  return content.sections.flatMap((section) => {
    if (section.type !== 'scenarioBlock' && section.type !== 'proScenario') return []
    return section.scenarios.map((_, index) => `${section.id}:${index}`)
  })
}

export function isUnifiedActivityEvidenceChapter(chapterId: string): boolean {
  return Boolean(flashcardMappings[chapterId] && contentMappings[chapterId])
}

// Backward-compatible alias retained for existing G7-era call sites.
export const isG7EvidenceChapter = isUnifiedActivityEvidenceChapter
