import { calculateSharedGrade, type SharedGradeResult } from './shared-grading'
import {
  getFlashcardEvidenceInventory,
  getScenarioEvidenceInventory,
  isUnifiedActivityEvidenceChapter,
} from './activity-evidence-registry'

export interface LiveInstructorActivityEvidenceRow {
  chapter_id: string
  source: 'flashcard' | 'scenario_application'
  item_id: string
  is_correct: boolean
  answered_at?: string
}

export interface LiveInstructorChapterGradeComponents {
  microCheckPercent: number | null
  flashcardPercent: number | null
  chapterAssessmentPercent: number | null
  scenarioApplicationPercent: number | null
  remediationReassessmentPercent: number | null
}

export interface LiveInstructorChapterGrade {
  chapterId: string
  components: LiveInstructorChapterGradeComponents
  grade: SharedGradeResult
  evidenceComplete: boolean
}

function round(value: number) {
  return Math.round(value * 100) / 100
}

function scoreInventory(
  rows: readonly LiveInstructorActivityEvidenceRow[],
  chapterId: string,
  source: 'flashcard' | 'scenario_application',
  inventory: readonly string[],
): number | null {
  if (inventory.length === 0) return null
  const eligible = new Set(inventory)
  const first = new Map<string, LiveInstructorActivityEvidenceRow>()

  for (const row of rows) {
    if (
      row.chapter_id !== chapterId ||
      row.source !== source ||
      !eligible.has(row.item_id) ||
      first.has(row.item_id)
    ) continue
    first.set(row.item_id, row)
  }

  const correct = [...first.values()].filter((row) => row.is_correct).length
  return round((correct / inventory.length) * 100)
}

export function buildLiveInstructorChapterGrade(input: {
  chapterId: string
  microCheckPercent: number | null
  chapterAssessmentPercent: number | null
  remediationReassessmentPercent: number | null
  activityRows: readonly LiveInstructorActivityEvidenceRow[]
}): LiveInstructorChapterGrade {
  const flashcardPercent = isUnifiedActivityEvidenceChapter(input.chapterId)
    ? scoreInventory(
        input.activityRows,
        input.chapterId,
        'flashcard',
        getFlashcardEvidenceInventory(input.chapterId),
      )
    : null

  const scenarioApplicationPercent = isUnifiedActivityEvidenceChapter(input.chapterId)
    ? scoreInventory(
        input.activityRows,
        input.chapterId,
        'scenario_application',
        getScenarioEvidenceInventory(input.chapterId),
      )
    : null

  const components: LiveInstructorChapterGradeComponents = {
    microCheckPercent: input.microCheckPercent,
    flashcardPercent,
    chapterAssessmentPercent: input.chapterAssessmentPercent,
    scenarioApplicationPercent,
    remediationReassessmentPercent: input.remediationReassessmentPercent,
  }

  return {
    chapterId: input.chapterId,
    components,
    grade: calculateSharedGrade(components),
    evidenceComplete:
      components.microCheckPercent !== null &&
      components.flashcardPercent !== null &&
      components.chapterAssessmentPercent !== null &&
      components.scenarioApplicationPercent !== null,
  }
}
