import { chapter1MicroChecks } from '@/lib/chapter-1-concepts/micro-checks'
import { chapter2MicroChecks } from '@/lib/chapter-2-concepts/micro-checks'
import { chapter3MicroChecks } from '@/lib/chapter-3-concepts/micro-checks'
import { chapter4MicroChecks } from '@/lib/chapter-4-concepts/micro-checks'
import { chapter5MicroChecks } from '@/lib/chapter-5-concepts/micro-checks'
import { chapter6MicroChecks } from '@/lib/chapter-6-concepts/micro-checks'
import { chapter7MicroChecks } from '@/lib/chapter-7-concepts/micro-checks'
import { chapter8MicroChecks } from '@/lib/chapter-8-concepts/micro-checks'
import { chapter9MicroChecks } from '@/lib/chapter-9-concepts/micro-checks'
import { chapter10MicroChecks } from '@/lib/chapter-10-concepts/micro-checks'
import { chapter11MicroChecks } from '@/lib/chapter-11-concepts/micro-checks'
import { chapter12MicroChecks } from '@/lib/chapter-12-concepts/micro-checks'
import { chapter13MicroChecks } from '@/lib/chapter-13-concepts/micro-checks'
import { chapter14MicroChecks } from '@/lib/chapter-14-concepts/micro-checks'
import { chapter15MicroChecks } from '@/lib/chapter-15-concepts/micro-checks'
import { chapter16MicroChecks } from '@/lib/chapter-16-concepts/micro-checks'
import { chapter17MicroChecks } from '@/lib/chapter-17-concepts/micro-checks'
import { chapter18MicroChecks } from '@/lib/chapter-18-concepts/micro-checks'
import { chapter19MicroChecks } from '@/lib/chapter-19-concepts/micro-checks'
import { chapter20MicroChecks } from '@/lib/chapter-20-concepts/micro-checks'
import { chapter21MicroChecks } from '@/lib/chapter-21-concepts/micro-checks'
import type { FourChoiceMicroCheckQuestion, MicroCheckAnswerKey } from './randomization'

export interface RegisteredMicroCheckQuestion extends FourChoiceMicroCheckQuestion {
  id: string
  conceptFamilyId: string
  difficulty: 'understanding' | 'application' | 'scenario'
  explanation: string
  correctAnswer: MicroCheckAnswerKey
}

export interface RegisteredMicroCheck {
  id: string
  questions: readonly RegisteredMicroCheckQuestion[]
}

const chapterMicroCheckRegistry: Readonly<Record<string, readonly RegisteredMicroCheck[]>> = {
  'ch-1': chapter1MicroChecks,
  'ch-2': chapter2MicroChecks,
  'ch-3': chapter3MicroChecks,
  'ch-4': chapter4MicroChecks,
  'ch-5': chapter5MicroChecks,
  'ch-6': chapter6MicroChecks,
  'ch-7': chapter7MicroChecks,
  'ch-8': chapter8MicroChecks,
  'ch-9': chapter9MicroChecks,
  'ch-10': chapter10MicroChecks,
  'ch-11': chapter11MicroChecks,
  'ch-12': chapter12MicroChecks,
  'ch-13': chapter13MicroChecks,
  'ch-14': chapter14MicroChecks,
  'ch-15': chapter15MicroChecks,
  'ch-16': chapter16MicroChecks,
  'ch-17': chapter17MicroChecks,
  'ch-18': chapter18MicroChecks,
  'ch-19': chapter19MicroChecks,
  'ch-20': chapter20MicroChecks,
  'ch-21': chapter21MicroChecks,
}

export interface ResolvedRegisteredMicroCheckQuestion {
  chapterId: string
  checkId: string
  question: RegisteredMicroCheckQuestion
}

export function resolveRegisteredMicroCheckQuestion(
  chapterId: string,
  questionId: string,
): ResolvedRegisteredMicroCheckQuestion | null {
  const checks = chapterMicroCheckRegistry[chapterId]
  if (!checks) return null

  for (const check of checks) {
    const question = check.questions.find((candidate) => candidate.id === questionId)
    if (question) {
      return {
        chapterId,
        checkId: check.id,
        question,
      }
    }
  }

  return null
}

export function registeredMicroCheckChapterIds(): readonly string[] {
  return Object.keys(chapterMicroCheckRegistry)
}
