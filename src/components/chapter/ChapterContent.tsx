'use client'

import type { ChapterSection } from '@/lib/chapter-content'
import InfoCard from './InfoCard'
import Timeline from './Timeline'
import TabbedContent from './TabbedContent'
import ToolCard from './ToolCard'
import QuoteBlock from './QuoteBlock'
import FeatureGrid from './FeatureGrid'
import MilestoneList from './MilestoneList'
import Checklist from './Checklist'
import ContentBlock from './ContentBlock'

interface ChapterContentProps {
  sections: ChapterSection[]
}

function SectionWrapper({
  title,
  subtitle,
  children,
}: {
  title?: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      {title && (
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export default function ChapterContent({ sections }: ChapterContentProps) {
  return (
    <div className="space-y-10">
      {sections.map((section) => {
        switch (section.type) {
          case 'infoCards':
            return (
              <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle}>
                <InfoCard cards={section.cards} />
              </SectionWrapper>
            )

          case 'timeline':
            return (
              <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle}>
                <Timeline items={section.items} />
              </SectionWrapper>
            )

          case 'tabbed':
            return (
              <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle}>
                <TabbedContent tabs={section.tabs} />
              </SectionWrapper>
            )

          case 'toolCards':
            return (
              <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle}>
                <ToolCard tools={section.tools} />
              </SectionWrapper>
            )

          case 'quote':
            return (
              <div key={section.id}>
                <QuoteBlock quote={section.quote} attribution={section.attribution} />
              </div>
            )

          case 'featureGrid':
            return (
              <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle}>
                <FeatureGrid features={section.features} />
              </SectionWrapper>
            )

          case 'milestoneList':
            return (
              <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle}>
                <MilestoneList milestones={section.milestones} />
              </SectionWrapper>
            )

          case 'checklist':
            return (
              <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle}>
                <Checklist items={section.items} />
              </SectionWrapper>
            )

          case 'contentBlock':
            return (
              <SectionWrapper key={section.id} title={section.title} subtitle={section.subtitle}>
                <ContentBlock content={section.content} highlight={section.highlight} />
              </SectionWrapper>
            )

          default:
            // Exhaustive check — TypeScript ensures we handle all cases
            return null
        }
      })}
    </div>
  )
}
