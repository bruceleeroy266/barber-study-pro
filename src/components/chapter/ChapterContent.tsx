'use client'

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

interface ChapterContentProps {
  sections: ChapterSection[]
  theme?: ChapterTheme
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

export default function ChapterContent({ sections, theme }: ChapterContentProps) {
  const t = theme || defaultTheme

  return (
    <div className="space-y-10">
      {sections.map((section) => {
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
                <ScenarioBlock scenarios={section.scenarios} theme={t} />
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
                <ProScenario scenarios={section.scenarios} theme={t} />
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
      })}
    </div>
  )
}
