// Chapter content data structures and content for Barber Study Pro V2
// This is the FOUNDATION file for ALL chapters — reusable typed structures

import { LucideIcon } from 'lucide-react'

// ───────────────────────────────────────────────
// Section Types (discriminated union)
// ───────────────────────────────────────────────

export type SectionType =
  | 'infoCards'
  | 'timeline'
  | 'tabbed'
  | 'toolCards'
  | 'quote'
  | 'featureGrid'
  | 'milestoneList'
  | 'checklist'
  | 'contentBlock'

export interface BaseSection {
  type: SectionType
  id: string
  title?: string
  subtitle?: string
}

// Info Cards Section (e.g., "Why Study Barbering History?")
export interface InfoCardItem {
  icon: string // Lucide icon name
  title: string
  text: string
}

export interface InfoCardSection extends BaseSection {
  type: 'infoCards'
  cards: InfoCardItem[]
}

// Timeline Section (e.g., "Ancient Origins")
export interface TimelineItem {
  period: string
  icon: string // Lucide icon name
  text: string
  highlight?: string
}

export interface TimelineSection extends BaseSection {
  type: 'timeline'
  items: TimelineItem[]
}

// Tabbed Content Section (e.g., "Shaving & Beard Culture")
export interface TabBullet {
  label: string
  description: string
}

export interface TabFact {
  text: string
}

export interface TabEra {
  name: string
  description: string
}

export interface TabTrend {
  name: string
  percentage: string
  eras: string[]
}

export interface TabContent {
  id: string
  label: string
  title?: string
  bullets?: TabBullet[]
  facts?: TabFact[]
  eras?: TabEra[]
  quote?: string
  trends?: TabTrend[]
}

export interface TabbedSection extends BaseSection {
  type: 'tabbed'
  tabs: TabContent[]
}

// Tool/Evolution Cards Section (e.g., "Evolution of Barbering Tools")
export interface ToolTimelineEntry {
  year: string
  description: string
}

export interface ToolCardItem {
  name: string
  timeline: ToolTimelineEntry[]
}

export interface ToolCardSection extends BaseSection {
  type: 'toolCards'
  tools: ToolCardItem[]
}

// Quote Section
export interface QuoteSection extends BaseSection {
  type: 'quote'
  quote: string
  attribution?: string
}

// Feature Grid Section (e.g., "Modern Barbering Standards")
export interface FeatureItem {
  icon: string // Lucide icon name
  title: string
  description: string
}

export interface FeatureGridSection extends BaseSection {
  type: 'featureGrid'
  features: FeatureItem[]
}

// Milestone List Section (e.g., "Historical Milestones")
export interface MilestoneItem {
  year: string
  title: string
  description: string
}

export interface MilestoneListSection extends BaseSection {
  type: 'milestoneList'
  milestones: MilestoneItem[]
}

// Checklist Section (e.g., "Modern Requirements")
export interface ChecklistItem {
  text: string
}

export interface ChecklistSection extends BaseSection {
  type: 'checklist'
  items: ChecklistItem[]
}

// Content Block Section (simple rich text/content)
export interface ContentBlockSection extends BaseSection {
  type: 'contentBlock'
  content: string
  highlight?: string
}

// ───────────────────────────────────────────────
// Chapter Content Type
// ───────────────────────────────────────────────

export type ChapterSection =
  | InfoCardSection
  | TimelineSection
  | TabbedSection
  | ToolCardSection
  | QuoteSection
  | FeatureGridSection
  | MilestoneListSection
  | ChecklistSection
  | ContentBlockSection

export interface ChapterContent {
  chapterNumber: number
  title: string
  subtitle: string
  sections: ChapterSection[]
}

// ───────────────────────────────────────────────
// Chapter Content Data
// ───────────────────────────────────────────────

export const chapterContentData: Record<string, ChapterContent> = {
  'ch-1': {
    chapterNumber: 1,
    title: 'History of Barbering',
    subtitle: 'From Ancient Rituals to Modern Mastery',
    sections: [
      // Section 1: Why Study Barbering History?
      {
        type: 'infoCards',
        id: 'why-study',
        title: 'Why Study Barbering History?',
        cards: [
          {
            icon: 'Lightbulb',
            title: 'Understanding Evolution',
            text: 'History reveals how techniques, tools, and styles have transformed over millennia, giving you perspective on modern practices.',
          },
          {
            icon: 'Users',
            title: 'Professional Pride',
            text: 'Knowing you\'re part of one of humanity\'s oldest professions connects you to centuries of craftsmen who shaped this art.',
          },
          {
            icon: 'Award',
            title: 'Licensing Context',
            text: 'Understanding why regulations exist helps you appreciate the professional standards that protect both barber and client.',
          },
        ],
      },
      {
        type: 'quote',
        id: 'why-study-quote',
        quote: 'To understand where you\'re going, you must first understand where you\'ve been. The barber\'s chair has been a seat of transformation, healing, and community for over 5,000 years.',
      },

      // Section 2: Ancient Origins (Timeline)
      {
        type: 'timeline',
        id: 'ancient-origins',
        title: 'Ancient Origins',
        items: [
          {
            period: 'Prehistoric Times',
            icon: 'Mountain',
            text: 'Early humans used flint stones, shells, and sharp rocks to cut hair and shave. Archaeological evidence shows sharpened flint blades dating back over 20,000 years.',
            highlight: 'flint stones, shells, and sharp rocks',
          },
          {
            period: 'Ancient Egypt (3000 BCE)',
            icon: 'Crown',
            text: 'Egyptians were meticulous about hair removal. Priests shaved their entire bodies every three days as part of religious purification. Wealthy Egyptians used bronze razors and tweezers made of gold.',
            highlight: 'Priests shaved their entire bodies',
          },
          {
            period: 'Spiritual Significance',
            icon: 'Hand',
            text: 'Hair has held deep spiritual meaning across cultures. Many believed hair contained a person\'s strength or soul essence. Cutting hair was often ceremonial—marking rites of passage, mourning, or religious devotion.',
            highlight: 'strength or soul essence',
          },
          {
            period: 'Ancient Greece & Rome',
            icon: 'Building2',
            text: 'Greeks introduced curling irons (calamistrum) heated in ashes. Romans established the first dedicated barbershops—tonstrinae—where men gathered daily for grooming and gossip.',
            highlight: 'curling irons (calamistrum)',
          },
        ],
      },

      // Section 3: Shaving & Beard Culture (Tabbed)
      {
        type: 'tabbed',
        id: 'shaving-beard-culture',
        title: 'Shaving & Beard Culture',
        tabs: [
          {
            id: 'beard-history',
            label: 'Beard History',
            title: 'The Sacred Beard',
            bullets: [
              { label: 'Wisdom & Authority', description: 'Ancient philosophers wore beards as symbols of knowledge and wisdom.' },
              { label: 'Masculinity & Strength', description: 'Warriors and soldiers often wore beards to project power and virility.' },
              { label: 'Religious Devotion', description: 'Many faiths required or encouraged beards as signs of piety and devotion.' },
              { label: 'Social Status', description: 'Only slaves were forcibly shaved; free men wore beards with pride.' },
            ],
            facts: [
              { text: 'Alexander the Great ordered soldiers to shave to prevent enemies from grabbing their beards in combat.' },
              { text: 'Henry VIII taxed beards in 1535, despite wearing one himself.' },
              { text: 'Abraham Lincoln grew his famous beard after receiving a letter from an 11-year-old girl suggesting it would help him win the election.' },
            ],
          },
          {
            id: 'shaving-evolution',
            label: 'Shaving Evolution',
            eras: [
              { name: 'Stone Age', description: 'Obsidian and flint blades — sharp but brittle, requiring great skill.' },
              { name: 'Bronze Age', description: 'Copper and bronze razors — more durable, allowed for finer edges.' },
              { name: 'Iron Age', description: 'Steel blades — the foundation of modern razor technology.' },
            ],
            quote: 'The Straight Razor Era: From the 1700s-1900s, the straight razor was the standard. Mastering this tool required years of apprenticeship.',
          },
          {
            id: 'fashion-cycles',
            label: 'Fashion Cycles',
            trends: [
              { name: 'Clean-Shaven', percentage: '40%', eras: ['Roman Empire', '1890s-1950s', '2000s-present'] },
              { name: 'Full Beards', percentage: '70%', eras: ['Ancient times', '1860s-1890s', '2010s-present'] },
              { name: 'Mustaches', percentage: '50%', eras: ['Victorian era', '1970s-1980s'] },
              { name: 'Goatees', percentage: '30%', eras: ['1990s-2000s peak'] },
            ],
          },
        ],
      },

      // Section 4: Medieval Barber-Surgeons
      {
        type: 'contentBlock',
        id: 'bloodletting',
        title: 'Bloodletting & Medical Services',
        content: 'For over 2,000 years, bloodletting was standard medical practice. Barber-surgeons used lancets and cupping glasses. The belief was that removing "bad blood" cured illness.',
        highlight: 'lancets and cupping glasses',
      },
      {
        type: 'checklist',
        id: 'medical-services',
        title: 'Medical Services Performed by Barber-Surgeons',
        items: [
          { text: 'Tooth extractions' },
          { text: 'Amputations' },
          { text: 'Leeches application' },
          { text: 'Boil lancing' },
          { text: 'Enemas and cauterization' },
        ],
      },
      {
        type: 'infoCards',
        id: 'barber-pole-guild',
        title: 'Barber Pole & Guild Formation',
        cards: [
          {
            icon: 'Flag',
            title: 'Barber Pole Origin',
            text: 'Red = Blood from bloodletting. White = Bandages and tourniquets. Blue = Veins (or patriotism in America).',
          },
          {
            icon: 'Shield',
            title: 'Guild Formation',
            text: 'In 1308, the Worshipful Company of Barbers was formed in London. In 1540, they merged with the Guild of Surgeons to become the United Barber-Surgeons Company.',
          },
        ],
      },

      // Section 5: Evolution of Barbering Tools
      {
        type: 'toolCards',
        id: 'tool-evolution',
        title: 'Evolution of Barbering Tools',
        tools: [
          {
            name: 'Shears',
            timeline: [
              { year: 'Ancient', description: 'Bronze blades, springless design' },
              { year: 'Middle Ages', description: 'Cross-blade pivot introduced' },
              { year: '1761', description: 'Robert Hinchliffe produced steel shears' },
              { year: 'Modern', description: 'Convex edges, ergonomic handles' },
            ],
          },
          {
            name: 'Clippers',
            timeline: [
              { year: 'Manual', description: 'Hand-powered mechanical clippers' },
              { year: '1921', description: 'Andis Company founded' },
              { year: '1924', description: 'Wahl electromagnetic motor' },
              { year: 'Modern', description: 'Cordless, ceramic blades, precision guards' },
            ],
          },
          {
            name: 'Razors',
            timeline: [
              { year: '1680', description: 'Sheffield steel straight razors' },
              { year: '1901', description: 'King Camp Gillette safety razor' },
              { year: '1928', description: 'Schick electric razor' },
              { year: 'Modern', description: 'Multi-blade cartridges, straight razor revival' },
            ],
          },
        ],
      },

      // Section 6: Professional Organizations & Licensing
      {
        type: 'featureGrid',
        id: 'why-licensing',
        title: 'Why Licensing Matters',
        features: [
          {
            icon: 'Wrench',
            title: 'Technical Competency',
            description: 'Ensures barbers have the skills to perform services safely and effectively.',
          },
          {
            icon: 'HeartPulse',
            title: 'Health Knowledge',
            description: 'Requires understanding of sanitation, infection control, and skin conditions.',
          },
          {
            icon: 'ShieldCheck',
            title: 'Safety Training',
            description: 'Covers proper tool handling, chemical safety, and emergency procedures.',
          },
          {
            icon: 'Scale',
            title: 'Professional Standards',
            description: 'Maintains consistency and quality across the entire profession.',
          },
        ],
      },
      {
        type: 'milestoneList',
        id: 'historical-milestones',
        title: 'Historical Milestones',
        milestones: [
          { year: '1893', title: 'First Barber School', description: 'The first barber school in the United States opened.' },
          { year: '1920s', title: 'Licensing Begins', description: 'States begin requiring formal licensing for barbers.' },
          { year: '1924', title: 'Associated Master Barbers', description: 'Associated Master Barbers of America founded.' },
          { year: 'Today', title: 'Nationwide Standards', description: 'All 50 states require barber licensing.' },
        ],
      },
      {
        type: 'checklist',
        id: 'modern-requirements',
        title: 'Modern Licensing Requirements',
        items: [
          { text: '800-1500 hours in an accredited program' },
          { text: 'Passing written examination' },
          { text: 'Passing practical demonstration' },
          { text: 'Continuing education for renewal' },
        ],
      },

      // Section 7: Modern Barbering Standards
      {
        type: 'featureGrid',
        id: 'modern-standards',
        title: 'Modern Barbering Standards',
        features: [
          {
            icon: 'Sparkles',
            title: 'Sanitation',
            description: 'Hospital-grade disinfectants, single-use blades, and sterilization protocols protect every client.',
          },
          {
            icon: 'Palette',
            title: 'Artistry',
            description: 'Traditional techniques blended with contemporary styles: fades, designs, and precision cutting.',
          },
          {
            icon: 'MessageCircle',
            title: 'Community',
            description: 'The barbershop remains a social hub for conversation, mentorship, and connection.',
          },
        ],
      },
      {
        type: 'quote',
        id: 'legacy-quote',
        quote: 'From prehistoric flint blades to precision electric clippers, from bloodletting to hot towel shaves, the barber\'s role has evolved dramatically. Yet the core remains unchanged: transforming how people look and feel.',
      },
    ],
  },
}

// ───────────────────────────────────────────────
// Helper to get chapter content by chapter number
// ───────────────────────────────────────────────

export function getChapterContent(chapterNumber: number): ChapterContent | null {
  const key = `ch-${chapterNumber}`
  return chapterContentData[key] || null
}

export function hasChapterContent(chapterNumber: number): boolean {
  return !!chapterContentData[`ch-${chapterNumber}`]
}
