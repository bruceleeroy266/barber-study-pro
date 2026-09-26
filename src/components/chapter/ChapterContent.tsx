'use client'

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import type { ChapterSection, ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'
import InfoCard from './InfoCard'
import Timeline from './Timeline'
import TabbedContent from './TabbedContent'
import ToolCard from './ToolCard'
import QuoteBlock from './QuoteBlock'
import FeatureGrid from './FeatureGrid'
import MilestoneList from './MilestoneList'
import Checklist from './Checklist'
import ContentBlock from './ContentBlock'
import ChallengeCard from './ChallengeCard'
import ScenarioBlock from './ScenarioBlock'
import LevelUp from './LevelUp'
import ActionPrompt from './ActionPrompt'
import ProScenario from './ProScenario'
import ConfidenceBuilder from './ConfidenceBuilder'
import ProLevelSystem from './ProLevelSystem'
import AppearanceChecklist from './AppearanceChecklist'
import ProTip from './ProTip'
import ReflectionBlock from './ReflectionBlock'
import HtmlContentBlock from './HtmlContentBlock'
import Chapter7MicroCheckCard from './Chapter7MicroCheckCard'
import { chapter7MicroChecks } from '@/lib/chapter-7-concepts/micro-checks'
import {
  loadChapter7MicroCheckAttempts,
  type Chapter7MicroCheckAttemptRow,
} from '@/lib/chapter-7-concepts/micro-check-persistence'
import { supabase } from '@/lib/supabase'
import {
  areKnowledgeCheckSectionsComplete,
  calculateChapterProgress,
  preserveLegacyFullCompletion,
} from '@/lib/progress'

interface ChapterContentProps {
  sections: ChapterSection[]
  theme?: ChapterTheme
  chapterId?: string
  userId?: string
  lessonCompleted?: boolean
  knowledgeChecksCompleted?: boolean
}

function SectionWrapper({
  title,
  subtitle,
  theme,
  children,
}: {
  title?: string
  subtitle?: string
  theme: ChapterTheme
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      {title && (
        <div>
          <h2 className="text-xl font-semibold" style={{ color: theme.text }}>{title}</h2>
          {subtitle && <p className="text-sm mt-1" style={{ color: theme.textMuted }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export default function ChapterContent({ sections, theme, chapterId, userId, lessonCompleted = false, knowledgeChecksCompleted = false }: ChapterContentProps) {
  const t = theme || defaultTheme
  const knowledgeCheckSectionIds = useMemo(
    () => sections
      .filter((section) => section.type === 'scenarioBlock' || section.type === 'proScenario')
      .map((section) => section.id),
    [sections]
  )
  const hasKnowledgeChecks = knowledgeCheckSectionIds.length > 0
  const knowledgeCheckStorageKey = useMemo(
    () => userId && chapterId ? `knowledge-check-sections-${userId}-${chapterId}` : null,
    [userId, chapterId]
  )
  const [completedKnowledgeCheckSections, setCompletedKnowledgeCheckSections] = useState<Set<string>>(() => {
    if (knowledgeChecksCompleted) return new Set(knowledgeCheckSectionIds)
    if (!knowledgeCheckStorageKey || typeof window === 'undefined') return new Set()

    try {
      const stored = JSON.parse(localStorage.getItem(knowledgeCheckStorageKey) || '[]')
      if (!Array.isArray(stored)) return new Set()
      return new Set(
        stored.filter(
          (id): id is string => typeof id === 'string' && knowledgeCheckSectionIds.includes(id)
        )
      )
    } catch {
      localStorage.removeItem(knowledgeCheckStorageKey)
      return new Set()
    }
  })
  const [knowledgeChecksSaved, setKnowledgeChecksSaved] = useState(knowledgeChecksCompleted)

  const [chapter7MicroCheckAttempts, setChapter7MicroCheckAttempts] = useState<Chapter7MicroCheckAttemptRow[]>([])

  useEffect(() => {
    if (chapterId !== 'ch-7' || !userId) {
      setChapter7MicroCheckAttempts([])
      return
    }

    let cancelled = false
    void loadChapter7MicroCheckAttempts(userId).then((rows) => {
      if (!cancelled) setChapter7MicroCheckAttempts(rows)
    })

    return () => {
      cancelled = true
    }
  }, [chapterId, userId])

  const handleChapter7MicroCheckPersisted = useCallback((row: Chapter7MicroCheckAttemptRow) => {
    setChapter7MicroCheckAttempts((previous) => {
      if (previous.some((attempt) => attempt.question_id === row.question_id)) return previous
      return [...previous, row]
    })
  }, [])

  const saveSignal = useCallback(async (signal: 'lesson_completed' | 'knowledge_checks_completed') => {
    if (!userId || !chapterId) return
    const { data: existing } = await supabase
      .from('student_progress')
      .select('lesson_completed, flashcards_completed, knowledge_checks_completed, quiz_completed, progress_percentage')
      .eq('user_id', userId)
      .eq('chapter_id', chapterId)
      .maybeSingle()
    const lesson = signal === 'lesson_completed' ? true : (existing?.lesson_completed ?? false)
    const knowledge = signal === 'knowledge_checks_completed' ? true : (existing?.knowledge_checks_completed ?? false)
    const calculatedProgress = calculateChapterProgress(existing?.flashcards_completed ?? false, existing?.quiz_completed ?? false, { lessonCompleted: lesson, knowledgeChecksCompleted: knowledge })
    const progressPercentage = preserveLegacyFullCompletion(calculatedProgress, existing?.progress_percentage ?? null)
    const { error } = await supabase.from('student_progress').upsert({ user_id: userId, chapter_id: chapterId, [signal]: true, progress_percentage: progressPercentage, last_studied_at: new Date().toISOString(), updated_at: new Date().toISOString() }, { onConflict: 'user_id,chapter_id' })
    if (error) {
      console.error('[ChapterContent] Failed to save progress signal:', error.message)
      return false
    }
    return true
  }, [userId, chapterId])

  useEffect(() => {
    if (!knowledgeCheckStorageKey || typeof window === 'undefined' || knowledgeChecksSaved) return
    localStorage.setItem(knowledgeCheckStorageKey, JSON.stringify([...completedKnowledgeCheckSections]))
  }, [completedKnowledgeCheckSections, knowledgeCheckStorageKey, knowledgeChecksSaved])

  useEffect(() => {
    if (
      knowledgeChecksSaved ||
      !areKnowledgeCheckSectionsComplete(
        knowledgeCheckSectionIds,
        completedKnowledgeCheckSections
      )
    ) {
      return
    }

    let cancelled = false
    void saveSignal('knowledge_checks_completed').then((saved) => {
      if (!cancelled && saved) {
        setKnowledgeChecksSaved(true)
        if (knowledgeCheckStorageKey && typeof window !== 'undefined') {
          localStorage.removeItem(knowledgeCheckStorageKey)
        }
      }
    })

    return () => {
      cancelled = true
    }
  }, [
    completedKnowledgeCheckSections,
    knowledgeCheckSectionIds,
    knowledgeChecksSaved,
    knowledgeCheckStorageKey,
    saveSignal,
  ])

  const handleKnowledgeCheckSectionComplete = useCallback((sectionId: string) => {
    setCompletedKnowledgeCheckSections((previous) => {
      if (previous.has(sectionId)) return previous
      const next = new Set(previous)
      next.add(sectionId)
      return next
    })
  }, [])

  const renderSection = (section: ChapterSection) => {
    switch (section.type) {
      case 'infoCards':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <InfoCard cards={section.cards} theme={t} />
          </SectionWrapper>
        )

      case 'timeline':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <Timeline items={section.items} theme={t} />
          </SectionWrapper>
        )

      case 'tabbed':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <TabbedContent tabs={section.tabs} theme={t} />
          </SectionWrapper>
        )

      case 'toolCards':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <ToolCard tools={section.tools} theme={t} />
          </SectionWrapper>
        )

      case 'quote':
        return (
          <div key={section.id}>
            <QuoteBlock quote={section.quote} attribution={section.attribution} theme={t} />
          </div>
        )

      case 'featureGrid':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <FeatureGrid features={section.features} theme={t} />
          </SectionWrapper>
        )

      case 'milestoneList':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <MilestoneList milestones={section.milestones} theme={t} />
          </SectionWrapper>
        )

      case 'checklist':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <Checklist items={section.items} theme={t} />
          </SectionWrapper>
        )

      case 'contentBlock':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <ContentBlock content={section.content} highlight={section.highlight} theme={t} />
          </SectionWrapper>
        )

      case 'challengeCard':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <ChallengeCard challenges={section.challenges} theme={t} />
          </SectionWrapper>
        )

      case 'scenarioBlock':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <ScenarioBlock
              scenarios={section.scenarios}
              theme={t}
              onComplete={() => handleKnowledgeCheckSectionComplete(section.id)}
            />
          </SectionWrapper>
        )

      case 'levelUp':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <LevelUp levels={section.levels} theme={t} />
          </SectionWrapper>
        )

      case 'actionPrompt':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <ActionPrompt prompts={section.prompts} theme={t} />
          </SectionWrapper>
        )

      case 'proScenario':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <ProScenario
              scenarios={section.scenarios}
              theme={t}
              onComplete={() => handleKnowledgeCheckSectionComplete(section.id)}
            />
          </SectionWrapper>
        )

      case 'confidenceBuilder':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <ConfidenceBuilder cards={section.cards} theme={t} />
          </SectionWrapper>
        )

      case 'proLevelSystem':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <ProLevelSystem levels={section.levels} theme={t} />
          </SectionWrapper>
        )

      case 'appearanceChecklist':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <AppearanceChecklist
              title={section.title || 'Professional Standards'}
              subtitle={section.subtitle}
              categories={section.categories}
              theme={t}
            />
          </SectionWrapper>
        )

      case 'proTip':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <ProTip items={section.items} theme={t} />
          </SectionWrapper>
        )

      case 'reflectionBlock':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <ReflectionBlock questions={section.questions} theme={t} />
          </SectionWrapper>
        )

      case 'htmlContent':
        return (
          <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle} theme={t}>
            <HtmlContentBlock html={section.html} theme={t} />
          </SectionWrapper>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-10">
      {sections.map((section) => {
        const microCheck = chapterId === 'ch-7'
          ? chapter7MicroChecks.find((check) => check.afterSectionId === section.id)
          : undefined

        return (
          <Fragment key={section.id}>
            {renderSection(section)}
            {microCheck && userId && (
              <Chapter7MicroCheckCard
                check={microCheck}
                userId={userId}
                theme={t}
                attempts={chapter7MicroCheckAttempts.filter((attempt) => attempt.check_id === microCheck.id)}
                onAttemptPersisted={handleChapter7MicroCheckPersisted}
              />
            )}
          </Fragment>
        )
      })}
      {userId && chapterId && !lessonCompleted && (
        <button onClick={() => saveSignal('lesson_completed')} className="w-full rounded-lg border border-[var(--color-brand-gold)] px-4 py-3 font-semibold text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10">
          ✓ Mark Lesson Complete
        </button>
      )}
      {lessonCompleted && <p className="text-sm text-[var(--color-brand-gold)]">✓ Lesson completed</p>}
      {hasKnowledgeChecks && knowledgeChecksSaved && <p className="text-sm text-[var(--color-brand-gold)]">✓ Knowledge checks completed</p>}
    </div>
  )
}
