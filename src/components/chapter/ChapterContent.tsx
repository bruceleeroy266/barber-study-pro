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
import Chapter1MicroCheckCard from './Chapter1MicroCheckCard'
import Chapter2MicroCheckCard from './Chapter2MicroCheckCard'
import Chapter3MicroCheckCard from './Chapter3MicroCheckCard'
import Chapter4MicroCheckCard from './Chapter4MicroCheckCard'
import Chapter5MicroCheckCard from './Chapter5MicroCheckCard'
import Chapter6MicroCheckCard from './Chapter6MicroCheckCard'
import Chapter7MicroCheckCard from './Chapter7MicroCheckCard'
import Chapter8MicroCheckCard from './Chapter8MicroCheckCard'
import Chapter9MicroCheckCard from './Chapter9MicroCheckCard'
import Chapter10MicroCheckCard from './Chapter10MicroCheckCard'
import Chapter11MicroCheckCard from './Chapter11MicroCheckCard'
import { chapter1MicroChecks } from '@/lib/chapter-1-concepts/micro-checks'
import {
  loadChapter1MicroCheckAttempts,
  type Chapter1MicroCheckAttemptRow,
} from '@/lib/chapter-1-concepts/micro-check-persistence'
import { chapter2MicroChecks } from '@/lib/chapter-2-concepts/micro-checks'
import { chapter3MicroChecks } from '@/lib/chapter-3-concepts/micro-checks'
import { chapter4MicroChecks } from '@/lib/chapter-4-concepts/micro-checks'
import { chapter5MicroChecks } from '@/lib/chapter-5-concepts/micro-checks'
import { chapter6MicroChecks } from '@/lib/chapter-6-concepts/micro-checks'
import {
  loadChapter6MicroCheckAttempts,
  type Chapter6MicroCheckAttemptRow,
} from '@/lib/chapter-6-concepts/micro-check-persistence'
import {
  loadChapter5MicroCheckAttempts,
  type Chapter5MicroCheckAttemptRow,
} from '@/lib/chapter-5-concepts/micro-check-persistence'
import {
  loadChapter4MicroCheckAttempts,
  type Chapter4MicroCheckAttemptRow,
} from '@/lib/chapter-4-concepts/micro-check-persistence'
import {
  loadChapter3MicroCheckAttempts,
  type Chapter3MicroCheckAttemptRow,
} from '@/lib/chapter-3-concepts/micro-check-persistence'
import {
  loadChapter2MicroCheckAttempts,
  type Chapter2MicroCheckAttemptRow,
} from '@/lib/chapter-2-concepts/micro-check-persistence'
import { chapter7MicroChecks } from '@/lib/chapter-7-concepts/micro-checks'
import {
  loadChapter7MicroCheckAttempts,
  type Chapter7MicroCheckAttemptRow,
} from '@/lib/chapter-7-concepts/micro-check-persistence'
import { chapter8MicroChecks } from '@/lib/chapter-8-concepts/micro-checks'
import {
  loadChapter8MicroCheckAttempts,
  type Chapter8MicroCheckAttemptRow,
} from '@/lib/chapter-8-concepts/micro-check-persistence'
import { chapter9MicroChecks } from '@/lib/chapter-9-concepts/micro-checks'
import {
  loadChapter9MicroCheckAttempts,
  type Chapter9MicroCheckAttemptRow,
} from '@/lib/chapter-9-concepts/micro-check-persistence'
import { chapter10MicroChecks } from '@/lib/chapter-10-concepts/micro-checks'
import {
  loadChapter10MicroCheckAttempts,
  type Chapter10MicroCheckAttemptRow,
} from '@/lib/chapter-10-concepts/micro-check-persistence'
import { chapter11MicroChecks } from '@/lib/chapter-11-concepts/micro-checks'
import {
  loadChapter11MicroCheckAttempts,
  type Chapter11MicroCheckAttemptRow,
} from '@/lib/chapter-11-concepts/micro-check-persistence'
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

  const [chapter1MicroCheckAttempts, setChapter1MicroCheckAttempts] = useState<Chapter1MicroCheckAttemptRow[]>([])
  const [chapter2MicroCheckAttempts, setChapter2MicroCheckAttempts] = useState<Chapter2MicroCheckAttemptRow[]>([])
  const [chapter3MicroCheckAttempts, setChapter3MicroCheckAttempts] = useState<Chapter3MicroCheckAttemptRow[]>([])
  const [chapter4MicroCheckAttempts, setChapter4MicroCheckAttempts] = useState<Chapter4MicroCheckAttemptRow[]>([])
  const [chapter5MicroCheckAttempts, setChapter5MicroCheckAttempts] = useState<Chapter5MicroCheckAttemptRow[]>([])
  const [chapter6MicroCheckAttempts, setChapter6MicroCheckAttempts] = useState<Chapter6MicroCheckAttemptRow[]>([])
  const [chapter7MicroCheckAttempts, setChapter7MicroCheckAttempts] = useState<Chapter7MicroCheckAttemptRow[]>([])
  const [chapter8MicroCheckAttempts, setChapter8MicroCheckAttempts] = useState<Chapter8MicroCheckAttemptRow[]>([])
  const [chapter9MicroCheckAttempts, setChapter9MicroCheckAttempts] = useState<Chapter9MicroCheckAttemptRow[]>([])
  const [chapter10MicroCheckAttempts, setChapter10MicroCheckAttempts] = useState<Chapter10MicroCheckAttemptRow[]>([])
  const [chapter11MicroCheckAttempts, setChapter11MicroCheckAttempts] = useState<Chapter11MicroCheckAttemptRow[]>([])

  useEffect(() => {
    if (chapterId !== 'ch-1' || !userId) return
    let cancelled = false
    void loadChapter1MicroCheckAttempts(userId).then((rows) => {
      if (!cancelled) setChapter1MicroCheckAttempts(rows)
    })
    return () => { cancelled = true }
  }, [chapterId, userId])

  const handleChapter1MicroCheckPersisted = useCallback((row: Chapter1MicroCheckAttemptRow) => {
    setChapter1MicroCheckAttempts((previous) => {
      if (previous.some((attempt) => attempt.question_id === row.question_id)) return previous
      return [...previous, row]
    })
  }, [])

  useEffect(() => {
    if (chapterId !== 'ch-2' || !userId) return

    let cancelled = false
    void loadChapter2MicroCheckAttempts(userId).then((rows) => {
      if (!cancelled) setChapter2MicroCheckAttempts(rows)
    })

    return () => {
      cancelled = true
    }
  }, [chapterId, userId])

  const handleChapter2MicroCheckPersisted = useCallback((row: Chapter2MicroCheckAttemptRow) => {
    setChapter2MicroCheckAttempts((previous) => {
      if (previous.some((attempt) => attempt.question_id === row.question_id)) return previous
      return [...previous, row]
    })
  }, [])

  useEffect(() => {
    if (chapterId !== 'ch-3' || !userId) return
    let cancelled = false
    void loadChapter3MicroCheckAttempts(userId).then((rows) => {
      if (!cancelled) setChapter3MicroCheckAttempts(rows)
    })
    return () => { cancelled = true }
  }, [chapterId, userId])

  const handleChapter3MicroCheckPersisted = useCallback((row: Chapter3MicroCheckAttemptRow) => {
    setChapter3MicroCheckAttempts((previous) => {
      if (previous.some((attempt) => attempt.question_id === row.question_id)) return previous
      return [...previous, row]
    })
  }, [])

  useEffect(() => {
    if (chapterId !== 'ch-4' || !userId) return
    let cancelled = false
    void loadChapter4MicroCheckAttempts(userId).then((rows) => {
      if (!cancelled) setChapter4MicroCheckAttempts(rows)
    })
    return () => { cancelled = true }
  }, [chapterId, userId])

  const handleChapter4MicroCheckPersisted = useCallback((row: Chapter4MicroCheckAttemptRow) => {
    setChapter4MicroCheckAttempts((previous) => {
      if (previous.some((attempt) => attempt.question_id === row.question_id)) return previous
      return [...previous, row]
    })
  }, [])

  useEffect(() => {
    if (chapterId !== 'ch-5' || !userId) return
    let cancelled = false
    void loadChapter5MicroCheckAttempts(userId).then((rows) => {
      if (!cancelled) setChapter5MicroCheckAttempts(rows)
    })
    return () => { cancelled = true }
  }, [chapterId, userId])

  const handleChapter5MicroCheckPersisted = useCallback((row: Chapter5MicroCheckAttemptRow) => {
    setChapter5MicroCheckAttempts((previous) => {
      if (previous.some((attempt) => attempt.question_id === row.question_id)) return previous
      return [...previous, row]
    })
  }, [])

  useEffect(() => {
    if (chapterId !== 'ch-6' || !userId) return
    let cancelled = false
    void loadChapter6MicroCheckAttempts(userId).then((rows) => {
      if (!cancelled) setChapter6MicroCheckAttempts(rows)
    })
    return () => { cancelled = true }
  }, [chapterId, userId])

  const handleChapter6MicroCheckPersisted = useCallback((row: Chapter6MicroCheckAttemptRow) => {
    setChapter6MicroCheckAttempts((previous) => {
      if (previous.some((attempt) => attempt.question_id === row.question_id)) return previous
      return [...previous, row]
    })
  }, [])

  useEffect(() => {
    if (chapterId !== 'ch-7' || !userId) return

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

  useEffect(() => {
    if (chapterId !== 'ch-8' || !userId) return

    let cancelled = false
    void loadChapter8MicroCheckAttempts(userId).then((rows) => {
      if (!cancelled) setChapter8MicroCheckAttempts(rows)
    })

    return () => {
      cancelled = true
    }
  }, [chapterId, userId])

  const handleChapter8MicroCheckPersisted = useCallback((row: Chapter8MicroCheckAttemptRow) => {
    setChapter8MicroCheckAttempts((previous) => {
      if (previous.some((attempt) => attempt.question_id === row.question_id)) return previous
      return [...previous, row]
    })
  }, [])

  useEffect(() => {
    if (chapterId !== 'ch-9' || !userId) return

    let cancelled = false
    void loadChapter9MicroCheckAttempts(userId).then((rows) => {
      if (!cancelled) setChapter9MicroCheckAttempts(rows)
    })

    return () => {
      cancelled = true
    }
  }, [chapterId, userId])

  const handleChapter9MicroCheckPersisted = useCallback((row: Chapter9MicroCheckAttemptRow) => {
    setChapter9MicroCheckAttempts((previous) => {
      if (previous.some((attempt) => attempt.question_id === row.question_id)) return previous
      return [...previous, row]
    })
  }, [])

  useEffect(() => {
    if (chapterId !== 'ch-10' || !userId) return

    let cancelled = false
    void loadChapter10MicroCheckAttempts(userId).then((rows) => {
      if (!cancelled) setChapter10MicroCheckAttempts(rows)
    })

    return () => {
      cancelled = true
    }
  }, [chapterId, userId])

  const handleChapter10MicroCheckPersisted = useCallback((row: Chapter10MicroCheckAttemptRow) => {
    setChapter10MicroCheckAttempts((previous) => {
      if (previous.some((attempt) => attempt.question_id === row.question_id)) return previous
      return [...previous, row]
    })
  }, [])

  useEffect(() => {
    if (chapterId !== 'ch-11' || !userId) return

    let cancelled = false
    void loadChapter11MicroCheckAttempts(userId).then((rows) => {
      if (!cancelled) setChapter11MicroCheckAttempts(rows)
    })

    return () => {
      cancelled = true
    }
  }, [chapterId, userId])

  const handleChapter11MicroCheckPersisted = useCallback((row: Chapter11MicroCheckAttemptRow) => {
    setChapter11MicroCheckAttempts((previous) => {
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
        const chapter1MicroCheck = chapterId === 'ch-1'
          ? chapter1MicroChecks.find((check) => check.afterSectionId === section.id)
          : undefined
        const chapter2MicroCheck = chapterId === 'ch-2'
          ? chapter2MicroChecks.find((check) => check.afterSectionId === section.id)
          : undefined
        const chapter3MicroCheck = chapterId === 'ch-3'
          ? chapter3MicroChecks.find((check) => check.afterSectionId === section.id)
          : undefined
        const chapter4MicroCheck = chapterId === 'ch-4'
          ? chapter4MicroChecks.find((check) => check.afterSectionId === section.id)
          : undefined
        const chapter5MicroCheck = chapterId === 'ch-5'
          ? chapter5MicroChecks.find((check) => check.afterSectionId === section.id)
          : undefined
        const chapter6MicroCheck = chapterId === 'ch-6'
          ? chapter6MicroChecks.find((check) => check.afterSectionId === section.id)
          : undefined
        const chapter7MicroCheck = chapterId === 'ch-7'
          ? chapter7MicroChecks.find((check) => check.afterSectionId === section.id)
          : undefined
        const chapter8MicroCheck = chapterId === 'ch-8'
          ? chapter8MicroChecks.find((check) => check.afterSectionId === section.id)
          : undefined
        const chapter9MicroCheck = chapterId === 'ch-9'
          ? chapter9MicroChecks.find((check) => check.afterSectionId === section.id)
          : undefined
        const chapter10MicroCheck = chapterId === 'ch-10'
          ? chapter10MicroChecks.find((check) => check.afterSectionId === section.id)
          : undefined
        const chapter11MicroCheck = chapterId === 'ch-11'
          ? chapter11MicroChecks.find((check) => check.afterSectionId === section.id)
          : undefined

        return (
          <Fragment key={section.id}>
            {renderSection(section)}
            {chapter1MicroCheck && userId && (
              <Chapter1MicroCheckCard
                check={chapter1MicroCheck}
                userId={userId}
                theme={t}
                attempts={chapter1MicroCheckAttempts.filter((attempt) => attempt.check_id === chapter1MicroCheck.id)}
                onAttemptPersisted={handleChapter1MicroCheckPersisted}
              />
            )}
            {chapter2MicroCheck && userId && (
              <Chapter2MicroCheckCard
                check={chapter2MicroCheck}
                userId={userId}
                theme={t}
                attempts={chapter2MicroCheckAttempts.filter((attempt) => attempt.check_id === chapter2MicroCheck.id)}
                onAttemptPersisted={handleChapter2MicroCheckPersisted}
              />
            )}
            {chapter3MicroCheck && userId && (
              <Chapter3MicroCheckCard
                check={chapter3MicroCheck}
                userId={userId}
                theme={t}
                attempts={chapter3MicroCheckAttempts.filter((attempt) => attempt.check_id === chapter3MicroCheck.id)}
                onAttemptPersisted={handleChapter3MicroCheckPersisted}
              />
            )}
            {chapter4MicroCheck && userId && (
              <Chapter4MicroCheckCard
                check={chapter4MicroCheck}
                userId={userId}
                theme={t}
                attempts={chapter4MicroCheckAttempts.filter((attempt) => attempt.check_id === chapter4MicroCheck.id)}
                onAttemptPersisted={handleChapter4MicroCheckPersisted}
              />
            )}
            {chapter5MicroCheck && userId && (
              <Chapter5MicroCheckCard
                check={chapter5MicroCheck}
                userId={userId}
                theme={t}
                attempts={chapter5MicroCheckAttempts.filter((attempt) => attempt.check_id === chapter5MicroCheck.id)}
                onAttemptPersisted={handleChapter5MicroCheckPersisted}
              />
            )}
            {chapter6MicroCheck && userId && (
              <Chapter6MicroCheckCard
                check={chapter6MicroCheck}
                userId={userId}
                theme={t}
                attempts={chapter6MicroCheckAttempts.filter((attempt) => attempt.check_id === chapter6MicroCheck.id)}
                onAttemptPersisted={handleChapter6MicroCheckPersisted}
              />
            )}
            {chapter7MicroCheck && userId && (
              <Chapter7MicroCheckCard
                check={chapter7MicroCheck}
                userId={userId}
                theme={t}
                attempts={chapter7MicroCheckAttempts.filter((attempt) => attempt.check_id === chapter7MicroCheck.id)}
                onAttemptPersisted={handleChapter7MicroCheckPersisted}
              />
            )}
            {chapter8MicroCheck && userId && (
              <Chapter8MicroCheckCard
                check={chapter8MicroCheck}
                userId={userId}
                theme={t}
                attempts={chapter8MicroCheckAttempts.filter((attempt) => attempt.check_id === chapter8MicroCheck.id)}
                onAttemptPersisted={handleChapter8MicroCheckPersisted}
              />
            )}
            {chapter9MicroCheck && userId && (
              <Chapter9MicroCheckCard
                check={chapter9MicroCheck}
                userId={userId}
                theme={t}
                attempts={chapter9MicroCheckAttempts.filter((attempt) => attempt.check_id === chapter9MicroCheck.id)}
                onAttemptPersisted={handleChapter9MicroCheckPersisted}
              />
            )}
            {chapter10MicroCheck && userId && (
              <Chapter10MicroCheckCard
                check={chapter10MicroCheck}
                userId={userId}
                theme={t}
                attempts={chapter10MicroCheckAttempts.filter((attempt) => attempt.check_id === chapter10MicroCheck.id)}
                onAttemptPersisted={handleChapter10MicroCheckPersisted}
              />
            )}
            {chapter11MicroCheck && userId && (
              <Chapter11MicroCheckCard
                check={chapter11MicroCheck}
                userId={userId}
                theme={t}
                attempts={chapter11MicroCheckAttempts.filter((attempt) => attempt.check_id === chapter11MicroCheck.id)}
                onAttemptPersisted={handleChapter11MicroCheckPersisted}
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
