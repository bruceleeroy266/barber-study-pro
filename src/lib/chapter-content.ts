// Chapter content data structures and content for Barber Study Pro V2
// This is the FOUNDATION file for ALL chapters — reusable typed structures

import { LucideIcon } from 'lucide-react'
import { chapter4Content, chapter4Theme } from './chapter-4-content'
import { chapter4PremiumContent, chapter4PremiumTheme } from './chapter-4-premium'
import { chapter5PremiumContent, chapter5PremiumTheme } from './chapter-5-premium'
import { chapter6PremiumContent, chapter6PremiumTheme } from './chapter-6-premium'
import { chapter7PremiumContent, chapter7PremiumTheme } from './chapter-7-premium'
import { chapter8PremiumContent, chapter8PremiumTheme } from './chapter-8-premium'
import { chapter9PremiumContent, chapter9PremiumTheme } from './chapter-9-premium'
import { chapter10PremiumContent, chapter10PremiumTheme } from './chapter-10-premium'
import { chapter11PremiumContent, chapter11PremiumTheme } from './chapter-11-premium'
import { chapter12PremiumContent, chapter12PremiumTheme } from './chapter-12-premium'
import { chapter13PremiumContent, chapter13PremiumTheme } from './chapter-13-premium'
import { chapter14PremiumContent, chapter14PremiumTheme } from './chapter-14-premium'
import { chapter15PremiumContent, chapter15PremiumTheme } from './chapter-15-premium'
import { chapter16PremiumContent, chapter16PremiumTheme } from './chapter-16-premium'

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
  | 'challengeCard'
  | 'scenarioBlock'
  | 'levelUp'
  | 'actionPrompt'
  | 'proScenario'
  | 'confidenceBuilder'
  | 'proLevelSystem'
  | 'appearanceChecklist'
  | 'proTip'
  | 'reflectionBlock'

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

// Challenge Card Section — interactive "Try This" challenges
export interface ChallengeCardItem {
  badge: string
  title: string
  description: string
  action: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface ChallengeCardSection extends BaseSection {
  type: 'challengeCard'
  challenges: ChallengeCardItem[]
}

// Scenario Block Section — "Real Shop Scenario" interactive blocks
export interface ScenarioOption {
  letter: string
  text: string
  feedback: string
}

export interface ScenarioBlockItem {
  situation: string
  options: ScenarioOption[]
  correctAnswer: string
  timeLimit?: number // Optional countdown timer in seconds
}

export interface ScenarioBlockSection extends BaseSection {
  type: 'scenarioBlock'
  scenarios: ScenarioBlockItem[]
}

// Level Up Section — achievement-style callouts
export interface LevelUpItem {
  level: string
  title: string
  description: string
  reward: string
}

export interface LevelUpSection extends BaseSection {
  type: 'levelUp'
  levels: LevelUpItem[]
}

// Action Prompt Section — "Try This Today" cards
export interface ActionPromptItem {
  action: string
  description: string
  benefit: string
  timeframe: string
}

export interface ActionPromptSection extends BaseSection {
  type: 'actionPrompt'
  prompts: ActionPromptItem[]
}

// ───────────────────────────────────────────────
// CHAPTER 3 PREMIUM INTERACTIVE SECTIONS
// ───────────────────────────────────────────────

// Professional Scenario — luxury client-service simulations
export interface ProScenarioOption {
  letter: string
  text: string
  feedback: string
  isPremium?: boolean
}

export interface ProScenarioItem {
  situation: string
  context?: string
  options: ProScenarioOption[]
  correctAnswer: string
  proTip: string
}

export interface ProScenarioSection extends BaseSection {
  type: 'proScenario'
  scenarios: ProScenarioItem[]
}

// Confidence Builder — "How would you respond?" interactive cards
export interface ConfidenceResponse {
  text: string
  isProfessional: boolean
  feedback: string
}

export interface ConfidenceCard {
  situation: string
  question: string
  responses: ConfidenceResponse[]
  insight: string
}

export interface ConfidenceBuilderSection extends BaseSection {
  type: 'confidenceBuilder'
  cards: ConfidenceCard[]
}

// Professional Level System — elegant progression (Apprentice → Shop Leader)
export interface ProLevel {
  level: string
  title: string
  description: string
  standards: string[]
  reward: string
}

export interface ProLevelSystemSection extends BaseSection {
  type: 'proLevelSystem'
  levels: ProLevel[]
}

// Appearance Checklist — interactive professional standards checklist
export interface ChecklistItemEnhanced {
  text: string
  isEssential: boolean
}

export interface ChecklistCategory {
  category: string
  icon: string
  items: ChecklistItemEnhanced[]
}

export interface AppearanceChecklistSection extends BaseSection {
  type: 'appearanceChecklist'
  categories: ChecklistCategory[]
}

// Pro Tip — expandable luxury tips
export interface ProTipItem {
  category: string
  tips: string[]
}

export interface ProTipSection extends BaseSection {
  type: 'proTip'
  items: ProTipItem[]
}

// Reflection Block — interactive journaling prompts
export interface ReflectionQuestion {
  question: string
  placeholder: string
  insight: string
}

export interface ReflectionBlockSection extends BaseSection {
  type: 'reflectionBlock'
  questions: ReflectionQuestion[]
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
  | ChallengeCardSection
  | ScenarioBlockSection
  | LevelUpSection
  | ActionPromptSection
  | ProScenarioSection
  | ConfidenceBuilderSection
  | ProLevelSystemSection
  | AppearanceChecklistSection
  | ProTipSection
  | ReflectionBlockSection

// ───────────────────────────────────────────────
// Chapter Theme System
// ───────────────────────────────────────────────

export interface ChapterTheme {
  // Core palette
  primary: string          // Main accent (gold, blue, green, etc.)
  primaryLight: string     // Lighter variant for hover states
  primaryDark: string      // Darker variant for borders
  secondary: string        // Secondary accent
  background: string       // Section card backgrounds
  backgroundAlt: string    // Alternate background
  surface: string          // Elevated surfaces
  border: string           // Border color
  text: string            // Primary text
  textMuted: string       // Secondary/muted text
  highlight: string       // Highlighted terms
  // Section-specific overrides (use Record for flexibility)
  timeline?: Record<string, string>
  quote?: Record<string, string>
  tabbed?: Record<string, string>
  toolCard?: Record<string, string>
  featureGrid?: Record<string, string>
  milestone?: Record<string, string>
  checklist?: Record<string, string>
  contentBlock?: Record<string, string>
  // Interactive section themes
  challengeCard?: Record<string, string>
  scenarioBlock?: Record<string, string>
  levelUp?: Record<string, string>
  actionPrompt?: Record<string, string>
}

export interface ChapterContent {
  chapterNumber: number
  title: string
  subtitle: string
  theme?: ChapterTheme
  sections: ChapterSection[]
}

// ───────────────────────────────────────────────
// Default Theme (fallback for chapters without custom theme)
// ───────────────────────────────────────────────

export const defaultTheme: ChapterTheme = {
  primary: '#D4AF37',
  primaryLight: '#F4E4A6',
  primaryDark: '#B8941F',
  secondary: '#8B7355',
  background: 'rgba(17, 24, 39, 0.8)',
  backgroundAlt: 'rgba(17, 24, 39, 0.6)',
  surface: '#111827',
  border: 'rgba(31, 41, 55, 0.5)',
  text: '#ffffff',
  textMuted: '#9CA3AF',
  highlight: '#D4AF37',
}

// ───────────────────────────────────────────────
// Chapter 1: History of Barbering — Ancient Legacy Theme
// Deep brown, bronze, aged gold, parchment, burnt orange
// ───────────────────────────────────────────────

export const chapter1Theme: ChapterTheme = {
  // Core: warm ancient palette
  primary: '#C9A84C',           // Aged gold (slightly muted from bright gold)
  primaryLight: '#E8D5A3',      // Light parchment gold
  primaryDark: '#8B6914',       // Dark bronze gold
  secondary: '#A0522D',         // Burnt sienna / bronze
  background: 'rgba(44, 30, 20, 0.85)',   // Deep espresso brown
  backgroundAlt: 'rgba(60, 40, 25, 0.7)', // Lighter brown
  surface: '#1E1410',           // Very dark brown
  border: 'rgba(139, 105, 20, 0.3)',      // Bronze border
  text: '#F5E6D3',              // Parchment cream
  textMuted: '#B8A088',         // Muted warm gray
  highlight: '#D4A574',         // Bronze highlight
  // Timeline: ancient parchment feel
  timeline: {
    line: 'rgba(139, 105, 20, 0.4)',
    iconBg: '#2C1E14',
    iconBorder: '#8B6914',
  },
  // Quote: elegant gold border
  quote: {
    border: 'rgba(201, 168, 76, 0.4)',
    icon: 'rgba(201, 168, 76, 0.3)',
    bg: 'rgba(44, 30, 20, 0.6)',
  },
  // Tabbed: leather and bronze
  tabbed: {
    activeBg: 'rgba(201, 168, 76, 0.15)',
    activeBorder: 'rgba(201, 168, 76, 0.5)',
    activeText: '#E8D5A3',
    inactiveBg: 'rgba(44, 30, 20, 0.6)',
    inactiveBorder: 'rgba(139, 105, 20, 0.2)',
    inactiveText: '#B8A088',
    panelBg: 'rgba(44, 30, 20, 0.7)',
    panelBorder: 'rgba(139, 105, 20, 0.25)',
  },
  // Tool cards: steel and bronze
  toolCard: {
    headerBg: 'rgba(160, 82, 45, 0.2)',
    headerText: '#D4A574',
    dot: 'rgba(201, 168, 76, 0.6)',
    line: 'rgba(139, 105, 20, 0.3)',
  },
  // Feature grid: warm bronze
  featureGrid: {
    iconBg: 'rgba(201, 168, 76, 0.15)',
    iconColor: '#C9A84C',
    cardBorder: 'rgba(139, 105, 20, 0.3)',
  },
  // Milestones: official gold
  milestone: {
    yearColor: '#C9A84C',
    border: 'rgba(139, 105, 20, 0.3)',
  },
  // Checklist: warm
  checklist: {
    checkBorder: 'rgba(201, 168, 76, 0.5)',
    checkColor: '#C9A84C',
    bg: 'rgba(44, 30, 20, 0.6)',
  },
  // Content block: parchment
  contentBlock: {
    bg: 'rgba(44, 30, 20, 0.6)',
    border: 'rgba(139, 105, 20, 0.25)',
    highlightColor: '#D4A574',
  },
}

// ───────────────────────────────────────────────
// Chapter 2: Life Skills — Vibrant Success Game Plan Theme
// Electric blue / Gold / Emerald / Bold gradients
// ───────────────────────────────────────────────

export const chapter2Theme: ChapterTheme = {
  // Core: vibrant energetic palette
  primary: '#00D4FF',           // Electric cyan — energy, action, growth
  primaryLight: '#7EE8FF',      // Light electric blue
  primaryDark: '#0099CC',       // Deep cyan
  secondary: '#FFD700',         // Gold — success, achievement, badges
  background: 'rgba(10, 15, 35, 0.9)',    // Deep space blue
  backgroundAlt: 'rgba(20, 30, 60, 0.8)', // Lighter space blue
  surface: '#070D1A',           // Deepest space
  border: 'rgba(0, 212, 255, 0.3)',       // Electric cyan border
  text: '#F0F8FF',              // Clean white
  textMuted: '#8BA4C7',         // Soft blue-gray
  highlight: '#FFD700',         // Gold highlight
  // Timeline: vibrant level-up feel
  timeline: {
    line: 'rgba(0, 212, 255, 0.4)',
    iconBg: '#0A1A2E',
    iconBorder: '#00D4FF',
  },
  // Quote: electric border with gold accent
  quote: {
    border: 'rgba(0, 212, 255, 0.5)',
    icon: 'rgba(255, 215, 0, 0.4)',
    bg: 'rgba(10, 15, 35, 0.7)',
  },
  // Tabbed: game-like tabs
  tabbed: {
    activeBg: 'rgba(0, 212, 255, 0.2)',
    activeBorder: 'rgba(0, 212, 255, 0.6)',
    activeText: '#7EE8FF',
    inactiveBg: 'rgba(10, 15, 35, 0.7)',
    inactiveBorder: 'rgba(0, 212, 255, 0.15)',
    inactiveText: '#8BA4C7',
    panelBg: 'rgba(10, 15, 35, 0.8)',
    panelBorder: 'rgba(0, 212, 255, 0.25)',
  },
  // Tool cards: gold and electric
  toolCard: {
    headerBg: 'rgba(255, 215, 0, 0.15)',
    headerText: '#FFD700',
    dot: 'rgba(0, 212, 255, 0.7)',
    line: 'rgba(0, 212, 255, 0.3)',
  },
  // Feature grid: vibrant cards
  featureGrid: {
    iconBg: 'rgba(0, 212, 255, 0.2)',
    iconColor: '#00D4FF',
    cardBorder: 'rgba(0, 212, 255, 0.25)',
  },
  // Milestones: gold level-up
  milestone: {
    yearColor: '#FFD700',
    border: 'rgba(0, 212, 255, 0.3)',
  },
  // Checklist: energetic
  checklist: {
    checkBorder: 'rgba(0, 212, 255, 0.5)',
    checkColor: '#00D4FF',
    bg: 'rgba(10, 15, 35, 0.7)',
  },
  // Content block: vibrant
  contentBlock: {
    bg: 'rgba(10, 15, 35, 0.7)',
    border: 'rgba(0, 212, 255, 0.2)',
    highlightColor: '#FFD700',
  },
}

// ───────────────────────────────────────────────
// Chapter 3: Professional Image — LUXURY ACADEMY THEME
// Deep navy / platinum silver / chrome / glassmorphism
// Premium grooming institute aesthetic — elite, polished, refined
// ───────────────────────────────────────────────

export const chapter3Theme: ChapterTheme = {
  // Core: luxury academy palette
  primary: '#C0A062',           // Warm champagne gold — premium, refined
  primaryLight: '#E8D5A3',      // Light champagne
  primaryDark: '#8B7355',       // Deep bronze gold
  secondary: '#E8E8E8',         // Platinum silver — polished, clean
  background: 'rgba(12, 18, 35, 0.92)',   // Deep midnight navy
  backgroundAlt: 'rgba(20, 28, 50, 0.85)', // Lighter navy with depth
  surface: '#080E1C',           // Deepest midnight
  border: 'rgba(192, 160, 98, 0.25)',      // Champagne gold border
  text: '#F8F6F3',              // Warm white — softer than pure white
  textMuted: '#A0A8B8',         // Soft platinum-gray
  highlight: '#C0A062',         // Champagne gold highlight
  // Timeline: luxury progression
  timeline: {
    line: 'rgba(192, 160, 98, 0.35)',
    iconBg: '#0C1223',
    iconBorder: '#C0A062',
  },
  // Quote: elegant gold border with glassmorphism
  quote: {
    border: 'rgba(192, 160, 98, 0.45)',
    icon: 'rgba(192, 160, 98, 0.35)',
    bg: 'rgba(12, 18, 35, 0.7)',
  },
  // Tabbed: luxury lounge tabs
  tabbed: {
    activeBg: 'rgba(192, 160, 98, 0.18)',
    activeBorder: 'rgba(192, 160, 98, 0.55)',
    activeText: '#E8D5A3',
    inactiveBg: 'rgba(12, 18, 35, 0.7)',
    inactiveBorder: 'rgba(192, 160, 98, 0.15)',
    inactiveText: '#A0A8B8',
    panelBg: 'rgba(12, 18, 35, 0.8)',
    panelBorder: 'rgba(192, 160, 98, 0.2)',
  },
  // Tool cards: chrome and platinum
  toolCard: {
    headerBg: 'rgba(192, 160, 98, 0.12)',
    headerText: '#E8D5A3',
    dot: 'rgba(192, 160, 98, 0.65)',
    line: 'rgba(192, 160, 98, 0.3)',
  },
  // Feature grid: luxury cards
  featureGrid: {
    iconBg: 'rgba(192, 160, 98, 0.18)',
    iconColor: '#C0A062',
    cardBorder: 'rgba(192, 160, 98, 0.22)',
  },
  // Milestones: champagne accent
  milestone: {
    yearColor: '#C0A062',
    border: 'rgba(192, 160, 98, 0.25)',
  },
  // Checklist: luxury
  checklist: {
    checkBorder: 'rgba(192, 160, 98, 0.45)',
    checkColor: '#C0A062',
    bg: 'rgba(12, 18, 35, 0.7)',
  },
  // Content block: refined navy
  contentBlock: {
    bg: 'rgba(12, 18, 35, 0.7)',
    border: 'rgba(192, 160, 98, 0.2)',
    highlightColor: '#E8D5A3',
  },
  // Challenge cards: premium styling
  challengeCard: {
    badgeBg: 'rgba(192, 160, 98, 0.2)',
    badgeText: '#E8D5A3',
    cardBorder: 'rgba(192, 160, 98, 0.25)',
    completedBg: 'rgba(16, 185, 129, 0.1)',
    completedBorder: 'rgba(16, 185, 129, 0.3)',
  },
  // Scenario blocks: polished
  scenarioBlock: {
    situationBg: 'rgba(192, 160, 98, 0.1)',
    optionBorder: 'rgba(192, 160, 98, 0.2)',
    correctBg: 'rgba(16, 185, 129, 0.12)',
    incorrectBg: 'rgba(239, 68, 68, 0.1)',
  },
  // Level up: elegant progression
  levelUp: {
    levelBadgeBg: 'rgba(192, 160, 98, 0.2)',
    levelBadgeText: '#E8D5A3',
    rewardBg: 'rgba(16, 185, 129, 0.12)',
    rewardText: '#10B981',
  },
  // Action prompts: premium
  actionPrompt: {
    cardBorder: 'rgba(192, 160, 98, 0.2)',
    completedBorder: 'rgba(16, 185, 129, 0.35)',
    benefitBg: 'rgba(192, 160, 98, 0.1)',
    benefitBorder: 'rgba(192, 160, 98, 0.3)',
  },
}

// ───────────────────────────────────────────────
// Chapter Content Data
// ───────────────────────────────────────────────

export const chapterContentData: Record<string, ChapterContent> = {
  'ch-1': {
    chapterNumber: 1,
    title: 'History of Barbering',
    subtitle: 'From Ancient Rituals to Modern Mastery',
    theme: chapter1Theme,
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
  'ch-2': {
    chapterNumber: 2,
    title: 'Life Skills for Barbers',
    subtitle: 'Building the Foundation for a Successful Career Beyond the Chair',
    theme: chapter2Theme,
    sections: [
      // Section 1: Why Life Skills Matter
      {
        type: 'contentBlock',
        id: 'why-life-skills',
        title: 'Why Life Skills Matter for Barber Success',
        content: "Technical skill gets you the license. Life skills build your career. The difference between a barber who struggles and one who thrives often has nothing to do with how well they fade. Most barber school graduates have similar technical training. What separates the successful from the struggling comes down to showing up consistently and on time, managing money wisely, building genuine client relationships, and handling stress without burning out.",
        highlight: 'Life skills build your career.',
      },
      {
        type: 'checklist',
        id: 'success-separators',
        title: 'What Separates Successful Barbers',
        items: [
          { text: 'Showing up consistently and on time' },
          { text: 'Managing money wisely' },
          { text: 'Building genuine client relationships' },
          { text: 'Handling stress without burning out' },
        ],
      },
      {
        type: 'quote',
        id: 'clippers-quote',
        quote: "Your clippers are just tools. You are the business.",
      },

      // Section 2: Setting and Achieving Goals (Tabbed)
      {
        type: 'tabbed',
        id: 'goal-setting',
        title: 'Setting and Achieving Goals',
        subtitle: "Dreams without plans are just wishes. Let's build your roadmap.",
        tabs: [
          {
            id: 'smart-goals',
            label: 'SMART Goals',
            title: 'The SMART Framework',
            bullets: [
              { label: 'S — Specific', description: 'Not "get better" but "master skin fades on all hair types"' },
              { label: 'M — Measurable', description: '"Build to 20 regular clients" not "get more customers"' },
              { label: 'A — Achievable', description: 'Challenging but realistic given your current situation' },
              { label: 'R — Relevant', description: 'Aligns with your bigger career vision' },
              { label: 'T — Time-Bound', description: '"By December 31st" creates urgency and focus' },
            ],
          },
          {
            id: 'short-vs-long',
            label: 'Short vs Long',
            title: 'Short-Term vs Long-Term Goals',
            bullets: [
              { label: 'Short-Term (1-12 months)', description: 'Pass state board exam, complete 100 practice cuts, build Instagram portfolio, save $2,000 emergency fund' },
              { label: 'Long-Term (2-10 years)', description: 'Open your own barbershop, build clientele of 200+ regulars, hire and mentor apprentices, achieve financial independence' },
            ],
          },
          {
            id: 'action-steps',
            label: 'Action Steps',
            title: 'Breaking Goals Into Action Steps',
            bullets: [
              { label: 'Step 1: Write down your big goal', description: 'Example: "Open my own barbershop in 3 years"' },
              { label: 'Step 2: Work backward', description: 'Get licensed → Build clientele → Save money → Find location' },
              { label: 'Step 3: Break into weekly tasks', description: '"This week: Practice 5 fades, post 3 cuts on social media, save $50"' },
              { label: 'Step 4: Schedule it like an appointment', description: 'Put practice time on your calendar. Treat it like a paid client.' },
            ],
          },
          {
            id: 'track-progress',
            label: 'Track Progress',
            title: 'Tracking Your Progress',
            bullets: [
              { label: 'Keep a Progress Journal', description: 'Write down what you accomplished each day. Seeing progress builds momentum.' },
              { label: 'Use Visual Trackers', description: 'Charts, calendars, or apps that show your streaks and milestones.' },
              { label: 'Find an Accountability Partner', description: 'Share goals with a classmate or mentor who will check in on your progress.' },
            ],
          },
        ],
      },

      // 🎮 INTERACTIVE: Level Up Your Goal-Setting Skills
      {
        type: 'levelUp',
        id: 'goal-levels',
        title: '📈 Level Up: From Dreamer to Doer',
        subtitle: 'Progress through each level to master goal-setting',
        levels: [
          { level: 'Level 1: Rookie Planner', title: 'Write Down ONE Goal', description: 'Pick one specific goal for this month. Write it on paper and put it where you will see it daily.', reward: 'Unlock: Focus Badge 🎯' },
          { level: 'Level 2: Smart Setter', title: 'Apply the SMART Framework', description: 'Rewrite your goal using all 5 SMART criteria. If it is missing any element, refine it until it passes the test.', reward: 'Unlock: Strategy Badge 🧠' },
          { level: 'Level 3: Action Taker', title: 'Create 3 Action Steps', description: 'Break your goal into 3 concrete actions you can take this week. Schedule them like appointments.', reward: 'Unlock: Momentum Badge ⚡' },
          { level: 'Level 4: Progress Tracker', title: 'Build a Tracking System', description: 'Create a simple tracker (notebook, app, or calendar) and update it daily. Review weekly.', reward: 'Unlock: Consistency Badge 🔥' },
          { level: 'Level 5: Goal Master', title: 'Achieve and Celebrate', description: 'Hit your goal, reflect on what worked, and set the next one. Share your win with someone.', reward: 'Unlock: Champion Badge 🏆' },
        ],
      },

      // 🎮 INTERACTIVE: Try This Today Challenges
      {
        type: 'challengeCard',
        id: 'goal-challenges',
        title: '🎯 Challenge Zone: Goal-Setting Drills',
        subtitle: 'Tap a challenge to accept it. Complete it to earn XP.',
        challenges: [
          { badge: 'Quick Win', title: 'The 5-Minute Goal Audit', description: 'Pull out your phone or notebook and write down your top 3 goals for the next 90 days.', action: 'Set a timer for 5 minutes and write without stopping. No editing — just dump every goal on your mind, then circle the top 3.', difficulty: 'easy' },
          { badge: 'Smart Check', title: 'SMART-ify Your Weak Goal', description: 'Find a vague goal like "get better at fades" and rewrite it into a SMART goal.', action: 'Rewrite it as: "Master skin fades on all hair types by practicing 5 fades per week for 8 weeks, tracked in my practice journal."', difficulty: 'medium' },
          { badge: 'Deep Work', title: 'The Sunday Planning Ritual', description: 'Spend 30 minutes this Sunday mapping out your entire week.', action: 'Block school hours, practice time, study blocks, family time, and rest. Put it on a calendar and treat each block as a non-negotiable appointment.', difficulty: 'medium' },
          { badge: 'Boss Mode', title: 'Create Your 5-Year Vision Board', description: 'Visualize where you want to be in 5 years and create a physical or digital vision board.', action: 'Include: shop ownership, income goals, skill milestones, family goals, and health targets. Review it every 90 days.', difficulty: 'hard' },
        ],
      },

      // Section 3: Time Management
      {
        type: 'contentBlock',
        id: 'time-challenge',
        title: 'Time Management for Students',
        content: "You're juggling school, possibly work, family, and trying to have a life. Without a system, something always suffers — usually your progress. The barber student's challenge is real: every hour counts, and how you spend your time directly impacts how fast you grow.",
        highlight: 'every hour counts',
      },
      {
        type: 'checklist',
        id: 'time-traps',
        title: 'Common Time Traps',
        items: [
          { text: '"I\'ll practice later" (later never comes)' },
          { text: 'Scrolling social media "for just a minute"' },
          { text: 'Saying yes to everything and everyone' },
          { text: 'Not planning tomorrow before bed' },
        ],
      },
      {
        type: 'featureGrid',
        id: 'time-tools',
        title: 'Time Management Tools',
        features: [
          {
            icon: 'Wrench',
            title: 'The Time Block Method',
            description: 'Divide your day into blocks: School (8am-3pm), Practice (4pm-6pm), Family (6pm-8pm), Personal (8pm-10pm). Protect each block.',
          },
          {
            icon: 'Lightbulb',
            title: 'The 2-Minute Rule',
            description: 'If a task takes less than 2 minutes, do it immediately. Don\'t let small tasks pile up.',
          },
          {
            icon: 'Calendar',
            title: 'The Sunday Planning Session',
            description: 'Spend 30 minutes every Sunday mapping out your week. Know your priorities before Monday hits.',
          },
        ],
      },
      {
        type: 'contentBlock',
        id: 'sample-schedule',
        title: 'Sample Weekly Schedule for Barber Students',
        content: "A well-structured week balances school, practice, study, family, and rest. Here's a sample framework: School hours (8am-3pm) Monday through Friday. Practice time (4pm-6pm) on Mondays, Wednesdays, and Fridays. Study blocks (4pm-6pm) on Tuesdays and Thursdays. Evenings reserved for family time. Saturdays for extended practice or portfolio work. Sundays for the weekly planning session and rest. Adjust based on your specific school schedule and commitments, but protect your practice and study blocks like paid appointments.",
        highlight: 'protect your practice and study blocks like paid appointments',
      },

      // Section 4: Effective Study Habits
      {
        type: 'featureGrid',
        id: 'study-habits',
        title: 'Effective Study Habits',
        features: [
          {
            icon: 'BookOpen',
            title: 'Active Learning',
            description: "Don't just read — do. Practice cuts while explaining what you're doing out loud. Teach a classmate. Create flashcards.",
          },
          {
            icon: 'Redo',
            title: 'Spaced Repetition',
            description: 'Review material multiple times over days/weeks, not just once. Your brain remembers better with spaced exposure.',
          },
          {
            icon: 'Hand',
            title: 'Muscle Memory',
            description: 'Barbering is physical. Repetition builds automatic movements. Practice the same technique until it feels natural.',
          },
        ],
      },
      {
        type: 'contentBlock',
        id: 'study-system',
        title: 'The Barber Student Study System',
        content: "For Theory (State Board Prep): Create flashcards for terms and definitions. Study in 25-minute focused blocks (Pomodoro Technique). Take practice exams under timed conditions. Review wrong answers and understand why. Study with a partner and quiz each other. For Practical Skills: Film yourself cutting and review the footage. Practice on mannequins with different textures. Ask instructors for specific feedback. Shadow barbers whose work you admire. Keep a portfolio of before/after photos.",
        highlight: 'Study in 25-minute focused blocks',
      },

      // Section 5: Stress Management & Work-Life Balance
      {
        type: 'contentBlock',
        id: 'stress-intro',
        title: 'Stress Management & Work-Life Balance',
        content: "Barbering is physically demanding and emotionally draining. Standing all day, making constant conversation, and managing client expectations takes a toll. Your well-being is your most important business asset. Without it, your technical skills don't matter.",
        highlight: 'Your well-being is your most important business asset.',
      },
      {
        type: 'featureGrid',
        id: 'physical-self-care',
        title: 'Physical Self-Care',
        features: [
          {
            icon: 'ShoePrints',
            title: 'Invest in Quality Shoes',
            description: 'Your feet are your foundation. Good shoes prevent back and knee problems.',
          },
          {
            icon: 'Dumbbell',
            title: 'Stretch and Strengthen',
            description: 'Do wrist stretches, shoulder rolls, and back exercises daily.',
          },
          {
            icon: 'Bed',
            title: 'Prioritize Sleep',
            description: "7-8 hours isn't optional — it's when your body repairs itself.",
          },
          {
            icon: 'Utensils',
            title: 'Eat Real Food',
            description: "Pack meals. Don't rely on vending machines and fast food between clients.",
          },
        ],
      },
      {
        type: 'featureGrid',
        id: 'mental-health',
        title: 'Mental & Emotional Health',
        features: [
          {
            icon: 'Ban',
            title: 'Set Boundaries',
            description: "Learn to say no. You don't have to take every walk-in or stay late every day.",
          },
          {
            icon: 'Users',
            title: 'Build a Support Network',
            description: 'Connect with other barbers who understand the unique stresses of the job.',
          },
          {
            icon: 'Palette',
            title: 'Have Hobbies Outside Barbering',
            description: "You're more than your job. Maintain interests that recharge you.",
          },
          {
            icon: 'HeartPulse',
            title: 'Know When to Seek Help',
            description: "Therapy isn't weakness. If stress is overwhelming, talk to a professional.",
          },
        ],
      },
      {
        type: 'checklist',
        id: 'burnout-signs',
        title: 'Warning Signs of Burnout',
        items: [
          { text: 'Dreading work' },
          { text: 'Chronic fatigue' },
          { text: 'Irritability with clients' },
          { text: 'Physical aches' },
          { text: 'Loss of creativity' },
        ],
      },

      // Section 6: Building Professional Relationships
      {
        type: 'contentBlock',
        id: 'networking-intro',
        title: 'Building Professional Relationships & Networking',
        content: "In barbering, who you know opens doors. A connection can lead to a job, a shop partnership, or a mentorship opportunity. Your network is your net worth. Real networking is just building genuine relationships — not sleazy or fake. Start now — people love helping students. Even 10 minutes a day on social media counts.",
        highlight: 'Your network is your net worth.',
      },
      {
        type: 'checklist',
        id: 'networking-myths',
        title: 'Networking Myths Debunked',
        items: [
          { text: '❌ "Networking is sleazy and fake" → Real networking is just building genuine relationships' },
          { text: '❌ "I\'m too new to network" → Start now — people love helping students' },
          { text: '❌ "I don\'t have time" → 10 minutes a day on social media counts' },
        ],
      },
      {
        type: 'featureGrid',
        id: 'where-to-network',
        title: 'Where to Network',
        features: [
          {
            icon: 'MessageCircle',
            title: 'Social Media',
            description: 'Follow, comment, and engage with barbers you admire.',
          },
          {
            icon: 'Award',
            title: 'Barber Battles & Competitions',
            description: 'Meet barbers from all over your region.',
          },
          {
            icon: 'Store',
            title: 'Local Barber Shops',
            description: 'Visit shops, introduce yourself, get haircuts.',
          },
          {
            icon: 'GraduationCap',
            title: 'School Events & Alumni',
            description: 'Connect with graduates who are now working.',
          },
        ],
      },
      {
        type: 'featureGrid',
        id: 'building-relationships',
        title: 'The Art of Building Relationships',
        features: [
          {
            icon: 'Heart',
            title: 'Be Genuine',
            description: "People can smell fake interest. Actually care about others' work and journey.",
          },
          {
            icon: 'Gift',
            title: 'Give First',
            description: 'Share knowledge, make introductions, offer help before asking for anything.',
          },
          {
            icon: 'MessageCircle',
            title: 'Stay in Touch',
            description: 'A quick comment on their post or occasional check-in keeps connections alive.',
          },
          {
            icon: 'Star',
            title: 'Show Gratitude',
            description: 'Thank people who help you. Public shoutouts and private messages both matter.',
          },
        ],
      },

      // 🎮 INTERACTIVE: Real Shop Scenarios
      {
        type: 'scenarioBlock',
        id: 'time-scenarios',
        title: '🎬 Real Shop Scenarios: Time Crunch Moments',
        subtitle: 'Test your decision-making under pressure',
        scenarios: [
          {
            situation: "You're 30 minutes behind schedule. Your next client is waiting, and the current cut is taking longer than expected. What do you do?",
            options: [
              { letter: 'A', text: 'Rush the current cut to get back on schedule', feedback: "❌ Rushing leads to mistakes. The client in your chair deserves your full attention." },
              { letter: 'B', text: 'Apologize to the waiting client, offer a beverage, and explain the delay', feedback: "✅ Correct! Communication is key. Most clients appreciate honesty and a small gesture of hospitality." },
              { letter: 'C', text: 'Ask the waiting client to reschedule for another day', feedback: "❌ Only as a last resort. If they can wait a few extra minutes, it's better than sending them away." },
              { letter: 'D', text: 'Skip the consultation with the current client to save time', feedback: "❌ Never skip the consultation. It's the most important part of the service." },
            ],
            correctAnswer: 'B',
          },
          {
            situation: "A walk-in client arrives during your lunch break. You're hungry and tired. How do you handle it?",
            options: [
              { letter: 'A', text: 'Tell them you are on break and they need to come back', feedback: "❌ This loses business. Walk-ins are valuable opportunities." },
              { letter: 'B', text: 'Take the client and eat lunch later', feedback: "✅ Correct! Flexibility builds clientele. Eat after — the client comes first." },
              { letter: 'C', text: 'Eat while cutting their hair', feedback: "❌ Unprofessional and unsanitary. Never eat while working." },
              { letter: 'D', text: 'Ask a coworker to take them without introducing yourself', feedback: "❌ Passing off clients without a proper handoff looks unprofessional." },
            ],
            correctAnswer: 'B',
          },
        ],
      },

      // 🎮 INTERACTIVE: Action Prompts
      {
        type: 'actionPrompt',
        id: 'time-actions',
        title: '⚡ Try This Today: Time Mastery Actions',
        subtitle: 'Pick one action and commit to it this week',
        prompts: [
          { action: 'Time Audit', description: 'Track every hour for 3 days. Write down what you actually do vs. what you planned. You will be shocked at where your time goes.', benefit: 'Reveals hidden time-wasters and shows where you can reclaim 5+ hours per week.', timeframe: 'This Week' },
          { action: 'The 2-Minute Rule', description: 'If a task takes less than 2 minutes, do it immediately. Do not add it to a list.', benefit: 'Eliminates tiny tasks that clutter your mind and to-do lists.', timeframe: 'Start Today' },
          { action: 'Sunday Planning Session', description: 'Every Sunday, plan your entire week. Block school, practice, study, and rest time.', benefit: 'Removes daily decision fatigue and ensures priorities get scheduled first.', timeframe: 'This Sunday' },
          { action: 'Phone Jail', description: 'Put your phone in another room during practice and study sessions. Use an app blocker if needed.', benefit: 'Recovers 1-2 hours daily of focused, distraction-free work time.', timeframe: 'Start Tomorrow' },
        ],
      },

      // Section 7: Financial Literacy
      {
        type: 'contentBlock',
        id: 'financial-truth',
        title: 'Basic Financial Literacy for Barbers',
        content: "Hard Truth: Most barbers struggle financially not because they can't cut hair, but because they never learned money management. Technical skill earns income. Financial literacy keeps it.",
        highlight: "never learned money management",
      },
      {
        type: 'featureGrid',
        id: 'financial-rules',
        title: 'Financial Foundations',
        features: [
          {
            icon: 'PiggyBank',
            title: 'The 50/30/20 Rule',
            description: '50% Needs (rent, food, utilities), 30% Wants (entertainment), 20% Savings & Debt.',
          },
          {
            icon: 'ShieldCheck',
            title: 'Emergency Fund',
            description: 'Start with $1,000 mini-fund. Build to 3 months of expenses. Eventually aim for 6 months.',
          },
          {
            icon: 'ChartLine',
            title: 'Track Everything',
            description: "Use apps like Mint or YNAB, or a simple spreadsheet. Review weekly, not monthly. Categorize every dollar.",
          },
        ],
      },
      {
        type: 'contentBlock',
        id: 'barber-finances',
        title: 'Barber-Specific Financial Considerations',
        content: "If You're a Booth Renter: Set aside 25-30% for taxes (you're self-employed). Track all business expenses (supplies, tools, education). Pay quarterly estimated taxes to avoid penalties. Consider forming an LLC for liability protection. If You're an Employee: Understand your commission structure completely. Track tips separately — they're taxable income too. Ask about benefits (health insurance, retirement). Know when you're eligible for raises.",
        highlight: 'Set aside 25-30% for taxes',
      },
      {
        type: 'milestoneList',
        id: 'money-goals',
        title: 'Money Goals for New Barbers',
        milestones: [
          { year: 'Month 1', title: 'Separate Business Account', description: 'Open a separate business checking account to keep personal and business finances apart.' },
          { year: 'Month 3', title: '$1,000 Emergency Fund', description: 'Build a $1,000 mini emergency fund for unexpected expenses.' },
          { year: 'Month 6', title: 'Consistently Save 20%', description: 'Make saving 20% of your income a consistent habit.' },
          { year: 'Year 1', title: '3 Months Expenses Saved', description: 'Have 3 months of living expenses saved in your emergency fund.' },
        ],
      },

      // 🎮 INTERACTIVE: Money Mastery Level Up
      {
        type: 'levelUp',
        id: 'money-levels',
        title: '💰 Level Up: From Broke Barber to Money Smart',
        subtitle: 'Progress through each level to master barber finances',
        levels: [
          { level: 'Level 1: Aware', title: 'Track Every Dollar', description: 'For one week, write down every single purchase. Coffee, gas, snacks — everything. Awareness is the first step.', reward: 'Unlock: Awareness Badge 👁️' },
          { level: 'Level 2: Organized', title: 'Separate Business & Personal', description: 'Open a separate checking account for barber income and expenses. Never mix them again.', reward: 'Unlock: Organization Badge 📁' },
          { level: 'Level 3: Protected', title: 'Build Your $1,000 Emergency Fund', description: 'Save $1,000 as fast as possible. Sell stuff, pick up extra cuts, eat cheap. This fund prevents debt.', reward: 'Unlock: Security Badge 🛡️' },
          { level: 'Level 4: Growing', title: 'Save 20% Consistently', description: 'Automate 20% of every check into savings. Pay yourself first, before any bills or fun money.', reward: 'Unlock: Growth Badge 📈' },
          { level: 'Level 5: Wealth Builder', title: 'Invest in Your Future', description: 'Open a Roth IRA or investment account. Start with $50/month. Time + compound interest = wealth.', reward: 'Unlock: Wealth Badge 💎' },
        ],
      },

      // ============================================================
      // NEW SECTION 8: Communication Skills & Client Consultation
      // ============================================================
      {
        type: 'contentBlock',
        id: 'communication-intro',
        title: 'Mastering Communication in the Barbershop',
        content: "Your shears can be sharp, but your words need to be sharper. Communication is the invisible tool that turns a one-time walk-in into a client for life. The consultation — that first 60 seconds of conversation — determines whether the client walks out thrilled or disappointed. Most complaints don't come from bad technique; they come from misunderstood expectations.",
        highlight: 'Communication is the invisible tool',
      },
      {
        type: 'checklist',
        id: 'active-listening',
        title: 'The Art of Active Listening',
        items: [
          { text: 'Maintain eye contact — it shows respect and attention' },
          { text: 'Nod and use verbal cues ("I see," "Got it") to confirm understanding' },
          { text: 'Repeat back what you heard: "So you want a low fade with about an inch on top — is that right?"' },
          { text: 'Never interrupt while the client is describing what they want' },
          { text: 'Ask clarifying questions before picking up any tool' },
        ],
      },
      {
        type: 'featureGrid',
        id: 'consultation-skills',
        title: 'Consultation Confidence Builders',
        features: [
          {
            icon: 'MessageCircle',
            title: 'Ask Open-Ended Questions',
            description: '"What look are you going for?" gets better answers than "Short on the sides?" Open questions reveal the full picture.',
          },
          {
            icon: 'Camera',
            title: 'Use Reference Photos',
            description: "Ask clients to show photos of styles they like. Photos eliminate guesswork and give you a visual target.",
          },
          {
            icon: 'Scissors',
            title: 'Set Realistic Expectations',
            description: "If a style won't work with their hair type, explain why and offer alternatives. Honesty builds more trust than false promises.",
          },
          {
            icon: 'CheckCircle',
            title: 'Confirm Before Cutting',
            description: 'Before the first snip, summarize the plan. "Just to confirm: textured crop, faded to skin at the neckline, about two inches on top."',
          },
        ],
      },
      {
        type: 'contentBlock',
        id: 'communication-mistakes',
        title: 'Common Communication Mistakes to Avoid',
        content: "❌ Assuming you know what they want without asking. ❌ Using technical jargon clients don't understand. ❌ Talking over the client or finishing their sentences. ❌ Checking your phone during the consultation. ❌ Dismissing their concerns with 'trust me, I got you' before understanding them. ✅ Instead: Ask, listen, confirm, then execute. The 30 seconds you spend on a thorough consultation saves 30 minutes of fixing mistakes.",
        highlight: 'Ask, listen, confirm, then execute',
      },

      // 🎮 INTERACTIVE: Communication Challenge Cards
      {
        type: 'challengeCard',
        id: 'comm-challenges',
        title: '🗣️ Challenge Zone: Communication Drills',
        subtitle: 'Master the art of client conversation',
        challenges: [
          { badge: 'Quick Win', title: 'The Perfect Consultation', description: 'Practice your consultation script on a friend or family member. Ask open-ended questions, use reference photos, and confirm before "cutting."', action: 'Record yourself (audio only) and listen back. Count how many times you interrupted vs. listened. Aim for 80% listening.', difficulty: 'easy' },
          { badge: 'Role Play', title: 'Handle the Difficult Client', description: 'Have a friend pretend to be an unhappy client. Practice the 4-step recovery: Listen, Empathize, Fix, Follow Up.', action: 'Do this role-play 3 times. Each time, focus on a different step. Film it and review your body language.', difficulty: 'medium' },
          { badge: 'Deep Work', title: 'Build Your Communication Playbook', description: 'Write out scripts for 5 common situations: consultation, unhappy client, price objection, no-show follow-up, and referral request.', action: 'Keep these on your phone. Review and refine them monthly based on real interactions.', difficulty: 'medium' },
          { badge: 'Boss Mode', title: 'The Silent Cut Challenge', description: 'Give a full haircut without speaking unless the client speaks first. Focus entirely on your technique and their non-verbal cues.', action: 'This builds your ability to read clients and work with minimal direction. Debrief afterward: Did they seem comfortable?', difficulty: 'hard' },
        ],
      },

      // ============================================================
      // NEW SECTION 9: Professional Ethics & Integrity
      // ============================================================
      {
        type: 'contentBlock',
        id: 'ethics-intro',
        title: 'Professional Ethics: The Foundation of Trust',
        content: "Ethics aren't just rules on a wall — they're the daily decisions that build or destroy your reputation. Every time you're honest about what a client needs (or doesn't need), every time you protect someone's privacy, every time you show up on time, you're depositing trust into your professional bank account. That trust compounds over time into the most valuable asset any barber can have: a loyal clientele.",
        highlight: "Ethics aren't just rules on a wall",
      },
      {
        type: 'infoCards',
        id: 'ethical-principles',
        title: 'Core Ethical Principles for Barbers',
        cards: [
          {
            icon: 'ShieldCheck',
            title: 'Honesty First',
            text: "If a product won't help their hair, don't sell it. If a style won't suit their face shape, say so tactfully. Clients can sense when you're prioritizing their best interest over your bottom line.",
          },
          {
            icon: 'Lock',
            title: 'Confidentiality Matters',
            text: "What happens in your chair stays in your chair. Never share client personal information, health details, or private conversations — not even with coworkers or friends.",
          },
          {
            icon: 'Clock',
            title: 'Punctuality is Respect',
            text: "Being on time shows you value your client's schedule. Chronic lateness signals disrespect and costs you more than just one appointment.",
          },
          {
            icon: 'Award',
            title: 'Competence & Continuing Education',
            text: "Stay current. An ethical barber doesn't let skills stagnate. Attend workshops, watch tutorials, and seek feedback to keep your craft sharp.",
          },
        ],
      },
      {
        type: 'checklist',
        id: 'ethical-checklist',
        title: 'Daily Ethics Checklist',
        items: [
          { text: 'Did I give honest recommendations about products and services?' },
          { text: 'Did I protect client privacy today?' },
          { text: 'Was I on time for every appointment?' },
          { text: 'Did I maintain professional boundaries?' },
          { text: 'Did I treat every client with equal respect regardless of background?' },
        ],
      },

      // 🎮 INTERACTIVE: Ethics Scenario Block
      {
        type: 'scenarioBlock',
        id: 'ethics-scenarios',
        title: '🎬 Real Shop Scenarios: Ethics Under Pressure',
        subtitle: 'What would you do when no one is watching?',
        scenarios: [
          {
            situation: "A client asks you to cut their hair even though they have an obvious scalp infection. They say it's 'not a big deal' and offer to pay double. What do you do?",
            options: [
              { letter: 'A', text: 'Take the money and do the cut carefully', feedback: "❌ Never compromise health and safety. This violates sanitation laws and could spread infection." },
              { letter: 'B', text: 'Refuse politely and explain why, then refer them to a dermatologist', feedback: "✅ Correct! Professional integrity means prioritizing client health over short-term profit." },
              { letter: 'C', text: 'Do the cut but charge triple for the risk', feedback: "❌ Charging more doesn't make it ethical. This is still a health code violation." },
              { letter: 'D', text: 'Tell them to come back when it looks better without explaining why', feedback: "❌ Vague responses don't educate the client. Explain the health risk clearly and compassionately." },
            ],
            correctAnswer: 'B',
          },
          {
            situation: "You overhear a coworker gossiping about a client's personal life. The details are juicy and everyone is listening. What do you do?",
            options: [
              { letter: 'A', text: 'Listen quietly but do not participate', feedback: "❌ Silence implies consent. You're still part of the problem." },
              { letter: 'B', text: 'Change the subject or walk away', feedback: "❌ Better than participating, but it doesn't address the behavior." },
              { letter: 'C', text: 'Speak up: "We should not be talking about clients like this. It is unprofessional."', feedback: "✅ Correct! Protecting client confidentiality is everyone's responsibility. Courageous professionalism." },
              { letter: 'D', text: 'Report it to the shop owner later', feedback: "❌ Reporting is appropriate for repeated violations, but addressing it in the moment is more effective." },
            ],
            correctAnswer: 'C',
          },
        ],
      },

      // ============================================================
      // NEW SECTION 10: Problem-Solving & Conflict Resolution
      // ============================================================
      {
        type: 'contentBlock',
        id: 'conflict-intro',
        title: 'Turning Complaints into Loyalty',
        content: "Sooner or later, every barber faces an unhappy client. Maybe the fade is higher than they expected. Maybe the texture came out differently. Maybe they just had a bad day and took it out on you. The difference between a good barber and a great one isn't avoiding mistakes — it's how you recover. Handle a complaint well, and that client becomes more loyal than if nothing ever went wrong.",
        highlight: "how you recover",
      },
      {
        type: 'tabbed',
        id: 'conflict-resolution',
        title: 'The Complaint Recovery System',
        subtitle: 'A step-by-step framework for handling dissatisfied clients',
        tabs: [
          {
            id: 'step-1-listen',
            label: 'Step 1: Listen',
            title: 'Listen Without Defending',
            bullets: [
              { label: 'Stay Calm', description: 'Take a breath. Their frustration is about the cut, not about you as a person.' },
              { label: 'Let Them Finish', description: "Don't interrupt. Let them say everything they need to say. Often, feeling heard resolves half the issue." },
              { label: 'Body Language Matters', description: 'Maintain open posture, make eye contact, and nod to show you are genuinely listening.' },
            ],
          },
          {
            id: 'step-2-empathize',
            label: 'Step 2: Empathize',
            title: 'Acknowledge Their Feelings',
            bullets: [
              { label: 'Validate Their Experience', description: '"I completely understand why you\'re disappointed. That\'s not the look we discussed."' },
              { label: 'Take Responsibility', description: 'Even if it was a miscommunication, own it. "I should have confirmed that detail before cutting."' },
              { label: 'Avoid Blame', description: 'Never blame the client. Phrases like "You said..." or "You moved" escalate tension.' },
            ],
          },
          {
            id: 'step-3-fix',
            label: 'Step 3: Fix It',
            title: 'Offer a Clear Solution',
            bullets: [
              { label: 'Present Options', description: '"Here\'s what I can do: I can blend the fade lower, or I can reshape the top to balance it out. Which would you prefer?"' },
              { label: 'Be Realistic', description: "Don't promise what you can't deliver. If it needs to grow out, be honest about the timeline." },
              { label: 'Act Quickly', description: 'Fix it immediately if possible. Waiting makes the situation worse.' },
            ],
          },
          {
            id: 'step-4-follow-up',
            label: 'Step 4: Follow Up',
            title: 'The Follow-Up That Wins Clients',
            bullets: [
              { label: 'Check In After the Fix', description: '"How does this feel? Is this closer to what you had in mind?"' },
              { label: 'Offer a Gesture', description: 'A complimentary neck trim, a discount on the next visit, or product sample shows you care.' },
              { label: 'Learn and Document', description: 'Note what went wrong in your client records so you never repeat the same mistake.' },
            ],
          },
        ],
      },
      {
        type: 'contentBlock',
        id: 'conflict-pro-tip',
        title: 'Pro Tip: The Complaint Recovery Paradox',
        content: "Research shows that clients who experience a problem that gets resolved quickly and professionally become more loyal than clients who never had a problem at all. This is the service recovery paradox. A complaint handled with grace becomes a story they tell about how much you care — not about the mistake.",
        highlight: 'the service recovery paradox',
      },

      // 🎮 INTERACTIVE: Conflict Resolution Action Prompts
      {
        type: 'actionPrompt',
        id: 'conflict-actions',
        title: '⚡ Try This Today: Conflict Mastery Actions',
        subtitle: 'Build your complaint-handling muscle',
        prompts: [
          { action: 'The Apology Script', description: 'Write out your go-to apology script for when things go wrong. Practice saying it out loud until it feels natural.', benefit: 'Removes the panic of "what do I say?" in the moment. You will respond calmly and professionally.', timeframe: 'This Week' },
          { action: 'Complaint Role-Play', description: 'Ask a friend to give you fake complaints about a haircut. Practice the 4-step recovery on each one.', benefit: 'Builds muscle memory for handling real complaints under pressure.', timeframe: 'This Weekend' },
          { action: 'The Follow-Up Log', description: 'Create a simple note system to track complaints and how you resolved them. Review monthly.', benefit: 'Identifies patterns and prevents repeat mistakes. Shows growth over time.', timeframe: 'Start Today' },
          { action: 'Service Recovery Kit', description: 'Prepare 3 "make-it-right" gestures: a free neck trim, a product sample, or a discount card.', benefit: 'Having options ready means you can act fast instead of scrambling for solutions.', timeframe: 'This Week' },
        ],
      },

      // ============================================================
      // NEW SECTION 11: Self-Motivation & Success Mindset
      // ============================================================
      {
        type: 'contentBlock',
        id: 'mindset-intro',
        title: 'Building a Success Mindset That Lasts',
        content: "Motivation is like a spark — it ignites quickly but burns out just as fast. Discipline is the fuel that keeps the fire going. Every successful barber has days when they don't feel like showing up, practicing, or studying. What separates them is a system of habits that carries them through low-motivation periods. You don't need to feel inspired every day. You need a routine that works even when inspiration is gone.",
        highlight: 'Discipline is the fuel that keeps the fire going',
      },
      {
        type: 'featureGrid',
        id: 'mindset-pillars',
        title: 'The Six Pillars of Barber Success',
        features: [
          {
            icon: 'Target',
            title: 'Consistency Over Intensity',
            description: 'Practicing 30 minutes daily beats 5 hours once a week. Small, repeated efforts compound into mastery.',
          },
          {
            icon: 'TrendingUp',
            title: 'Embrace the Plateau',
            description: "Progress isn't linear. You'll hit periods where skills don't seem to improve. This is normal. Keep going — breakthroughs follow plateaus.",
          },
          {
            icon: 'RefreshCw',
            title: 'Reframe Setbacks',
            description: "A bad cut isn't failure — it's data. Analyze what went wrong, adjust, and try again. Every master barber has thousands of 'learning cuts' behind them.",
          },
          {
            icon: 'Zap',
            title: 'Visualize Your Success',
            description: 'Spend 5 minutes daily imagining yourself working in your dream shop, handling clients confidently, and loving your craft.',
          },
        ],
      },
      {
        type: 'checklist',
        id: 'daily-discipline',
        title: 'Daily Discipline Checklist',
        items: [
          { text: 'Showed up on time, even when I did not feel like it' },
          { text: 'Practiced at least one technique today, even if just for 15 minutes' },
          { text: 'Reviewed flashcards or studied theory material' },
          { text: 'Reflected on what went well and what to improve' },
          { text: 'Took care of my physical health (sleep, food, movement)' },
        ],
      },

      // 🎮 INTERACTIVE: Mindset Mastery Challenges
      {
        type: 'challengeCard',
        id: 'mindset-challenges',
        title: '🧠 Challenge Zone: Build Unbreakable Discipline',
        subtitle: 'These challenges forge the mental toughness of elite barbers',
        challenges: [
          { badge: 'Daily Habit', title: 'The 5-Minute Morning Ritual', description: 'Before checking your phone, spend 5 minutes visualizing your goals and repeating your personal mission statement.', action: 'Write your mission statement: "I am becoming the barber who _______." Read it every morning for 30 days.', difficulty: 'easy' },
          { badge: 'Resilience', title: 'The Failure Reframe', description: 'The next time you make a mistake (bad cut, missed appointment, etc.), write down 3 things you learned from it.', action: 'Keep a "Failure Journal." Each entry = one mistake + three lessons. Review it monthly to see your growth.', difficulty: 'medium' },
          { badge: 'Deep Work', title: 'The 30-Day Consistency Challenge', description: 'Pick ONE skill and practice it for 30 minutes every single day for 30 days. No exceptions.', action: 'Track it on a calendar. Put an X on every day you complete it. Do not break the chain. Missing one day is allowed — but never two.', difficulty: 'medium' },
          { badge: 'Boss Mode', title: 'The Comfort Zone Destroyer', description: 'Do one thing every week that scares you professionally: enter a competition, post your work online, ask for a raise.', action: 'Fear is a compass pointing to growth. Document each scary action and the result. You will be amazed how much fear was just a story.', difficulty: 'hard' },
        ],
      },

      // ============================================================
      // NEW SECTION 12: Cultural Competence & Inclusive Service
      // ============================================================
      {
        type: 'contentBlock',
        id: 'cultural-competence-intro',
        title: 'Cultural Competence: Serving Every Client with Respect',
        content: "Barbershops are community hubs that welcome people from every background, culture, and walk of life. Your chair will hold clients with different hair textures, cultural traditions, communication styles, and personal preferences. Cultural competence isn't about knowing everything — it's about approaching every client with curiosity, respect, and a willingness to learn. The barber who makes everyone feel welcome builds a clientele that no marketing budget can buy.",
        highlight: "approaching every client with curiosity, respect, and a willingness to learn",
      },
      {
        type: 'infoCards',
        id: 'inclusive-practices',
        title: 'Inclusive Barbering Practices',
        cards: [
          {
            icon: 'Globe',
            title: 'Respect Hair Texture Diversity',
            text: "Different hair types require different techniques, tools, and products. Never assume one approach works for everyone. Ask about their hair history and preferences.",
          },
          {
            icon: 'MessageSquare',
            title: 'Adapt Your Communication Style',
            text: 'Some clients want detailed consultation. Others prefer minimal conversation. Read cues and adjust. Not everyone communicates the same way.',
          },
          {
            icon: 'Heart',
            title: 'Avoid Assumptions',
            text: "Don't assume someone's background, preferences, or style based on appearance. Ask respectful questions and let them guide the conversation.",
          },
          {
            icon: 'Users',
            title: 'Create a Welcoming Environment',
            text: 'Your shop should feel safe and inclusive for everyone. The music, decor, and conversation all signal who belongs there. Make sure the signal says "everyone."',
          },
        ],
      },
      {
        type: 'checklist',
        id: 'cultural-awareness',
        title: 'Cultural Awareness Quick Check',
        items: [
          { text: 'Did I ask about their hair history and preferences before starting?' },
          { text: 'Did I use respectful language and avoid stereotypes?' },
          { text: 'Did I adapt my communication style to match their comfort level?' },
          { text: 'Did I make them feel welcome and comfortable in my space?' },
          { text: 'Did I seek to learn something new from this client?' },
        ],
      },

      // 🎮 INTERACTIVE: Cultural Competence Scenarios
      {
        type: 'scenarioBlock',
        id: 'cultural-scenarios',
        title: '🎬 Real Shop Scenarios: Cultural Sensitivity',
        subtitle: 'Navigate diverse clients with confidence and respect',
        scenarios: [
          {
            situation: "A client with a different hair texture than you're used to sits in your chair. You're unsure which techniques work best. What do you do?",
            options: [
              { letter: 'A', text: 'Use the same techniques you always use and hope for the best', feedback: "❌ Different hair textures require different approaches. Guessing can damage hair and lose trust." },
              { letter: 'B', text: 'Ask the client about their hair history and preferences, then research techniques before cutting', feedback: "✅ Correct! Humility and curiosity build more trust than false confidence. Clients appreciate being asked." },
              { letter: 'C', text: 'Refer them to another barber who specializes in their hair type', feedback: "❌ Referring is fine if you're truly unqualified, but learning new textures expands your skills and clientele." },
              { letter: 'D', text: 'Tell them you have never worked with their hair type and ask if they want to risk it', feedback: "❌ Framing it as 'risk' undermines confidence. Be honest but positive: 'I want to learn — can you teach me about your hair?'" },
            ],
            correctAnswer: 'B',
          },
          {
            situation: "A client asks you to use a term or pronoun you're not familiar with. You don't want to offend them. What's the best approach?",
            options: [
              { letter: 'A', text: 'Ignore it and use the terms you are comfortable with', feedback: "❌ Dismissing a client's identity is disrespectful and damages trust permanently." },
              { letter: 'B', text: 'Ask them politely to explain and then use their preferred terms', feedback: "✅ Correct! Asking respectfully shows you care about their comfort. Most people appreciate the effort." },
              { letter: 'C', text: 'Apologize in advance and say you will probably mess it up', feedback: "❌ Self-deprecating apologies put the burden on them. Just ask, listen, and do your best." },
              { letter: 'D', text: 'Avoid the topic entirely and focus only on the haircut', feedback: "❌ Avoidance feels awkward and inauthentic. A simple 'What should I call you?' solves it." },
            ],
            correctAnswer: 'B',
          },
        ],
      },

      // ============================================================
      // NEW SECTION 13: Personal Development & Career Planning
      // ============================================================
      {
        type: 'contentBlock',
        id: 'career-planning-intro',
        title: 'Designing Your Barber Career Roadmap',
        content: "Most barbers don't fail because they lack talent — they fail because they never planned. A career roadmap gives you direction, helps you make better decisions, and keeps you motivated when progress feels slow. Your plan doesn't need to be perfect. It just needs to exist, and it needs to be reviewed regularly. Think of it as a living document that grows with you.",
        highlight: "A career roadmap gives you direction",
      },
      {
        type: 'milestoneList',
        id: 'career-milestones',
        title: 'Your Barber Career Milestones',
        milestones: [
          { year: 'Year 1', title: 'Foundation Builder', description: 'Get licensed. Build a clientele of 50+ regulars. Master 5 core cuts. Save 3 months of expenses. Create a professional portfolio.' },
          { year: 'Year 2', title: 'Skill Refiner', description: 'Specialize in one technique (fades, beard sculpting, designs). Attend 2 industry events. Build social media presence. Start mentoring newer barbers.' },
          { year: 'Year 3', title: 'Brand Builder', description: 'Develop your personal brand. Launch a signature style or service. Build to 150+ regular clients. Consider booth rental vs. employment.' },
          { year: 'Year 5', title: 'Shop Owner or Senior Barber', description: 'Open your own shop OR become a senior barber with premium pricing. Hire apprentices. Build passive income streams (products, education).' },
        ],
      },
      {
        type: 'featureGrid',
        id: 'specialization-paths',
        title: 'Specialization Opportunities',
        features: [
          {
            icon: 'Scissors',
            title: 'Precision Fades',
            description: 'Become known for the cleanest fades in your city. Specialization commands premium pricing.',
          },
          {
            icon: 'Palette',
            title: 'Hair Art & Designs',
            description: 'Develop artistic shaving and design skills. This niche attracts clients willing to pay for unique work.',
          },
          {
            icon: 'Beard',
            title: 'Beard Sculpting',
            description: 'Master beard shaping, conditioning, and maintenance. The beard trend shows no signs of slowing.',
          },
          {
            icon: 'GraduationCap',
            title: 'Barber Educator',
            description: 'Teach the next generation. Many successful barbers transition into education, workshops, or online courses.',
          },
        ],
      },

      // 🎮 INTERACTIVE: Career Roadmap Level Up
      {
        type: 'levelUp',
        id: 'career-levels',
        title: '🚀 Level Up: Your Barber Career Roadmap',
        subtitle: 'From first cut to shop owner — level up your career',
        levels: [
          { level: 'Level 1: Student Barber', title: 'Master the Basics', description: 'Get licensed. Learn 5 core cuts by heart. Build a portfolio of 20 before/after photos. Start a social media page.', reward: 'Unlock: Licensed Badge 📜' },
          { level: 'Level 2: Junior Barber', title: 'Build Your Clientele', description: 'Reach 50 regular clients. Master one specialty (fades, beards, designs). Save 3 months of expenses.', reward: 'Unlock: Hustler Badge 💼' },
          { level: 'Level 3: Established Barber', title: 'Raise Your Prices', description: 'Increase prices based on skill, not time. Build to 150+ regulars. Attend 2 industry events per year.', reward: 'Unlock: Pro Badge ⭐' },
          { level: 'Level 4: Senior Barber', title: 'Mentor Others', description: 'Take an apprentice. Teach a workshop. Build passive income (products, online content).', reward: 'Unlock: Mentor Badge 🎓' },
          { level: 'Level 5: Shop Owner', title: 'Build Your Empire', description: 'Open your own shop. Hire a team. Create systems that run without you. Build generational wealth.', reward: 'Unlock: Empire Badge 🏢' },
        ],
      },

      // ============================================================
      // NEW SECTION 14: Leadership & Mentorship
      // ============================================================
      {
        type: 'contentBlock',
        id: 'leadership-intro',
        title: 'Leadership in the Barbershop: From Student to Mentor',
        content: "Leadership isn't about having a title — it's about influence. The moment you help a classmate with a technique, you become a leader. The moment you set a positive example in the shop, you become a leader. Great barbers don't just build their own careers; they lift others as they climb. Mentorship creates a legacy that outlasts any single haircut.",
        highlight: "Mentorship creates a legacy",
      },
      {
        type: 'featureGrid',
        id: 'leadership-qualities',
        title: 'Qualities of a Barber Leader',
        features: [
          {
            icon: 'Star',
            title: 'Leads by Example',
            description: 'Show up early, stay late, practice consistently, and treat everyone with respect. Your actions teach louder than your words.',
          },
          {
            icon: 'Heart',
            title: 'Gives Constructive Feedback',
            description: "When helping others, focus on what's working and what to adjust. Criticism without guidance destroys confidence.",
          },
          {
            icon: 'Users',
            title: 'Builds Team Culture',
            description: 'In a shop, attitude is contagious. A leader sets the tone — positive, collaborative, and growth-oriented.',
          },
          {
            icon: 'TrendingUp',
            title: 'Invests in Others',
            description: "Share knowledge freely. The barber who hoards techniques stays small. The barber who teaches builds an empire.",
          },
        ],
      },
      {
        type: 'checklist',
        id: 'mentorship-actions',
        title: 'Ways to Start Mentoring Today',
        items: [
          { text: 'Help a struggling classmate with a technique you have mastered' },
          { text: 'Share study resources and flashcard decks with your peers' },
          { text: 'Offer to practice on each other and give honest, kind feedback' },
          { text: 'Introduce newer students to barbers you admire in the community' },
          { text: 'Document your learning journey so others can learn from your mistakes' },
        ],
      },

      // 🎮 INTERACTIVE: Leadership Action Prompts
      {
        type: 'actionPrompt',
        id: 'leadership-actions',
        title: '⚡ Try This Today: Lead from Your Chair',
        subtitle: 'Leadership starts now — not when you have a title',
        prompts: [
          { action: 'The Knowledge Share', description: 'Teach one technique to a classmate this week. Do not just demonstrate — have them practice while you coach.', benefit: 'Teaching reinforces your own knowledge and builds your reputation as a generous professional.', timeframe: 'This Week' },
          { action: 'The Positive Influence', description: 'Every day this week, compliment one coworker or classmate on something specific they did well.', benefit: 'Positivity is contagious. You become the person others want to be around and work with.', timeframe: 'This Week' },
          { action: 'The Feedback Loop', description: 'Ask two people for honest feedback on your work this week. Listen without defending. Take notes.', benefit: 'Feedback is a gift. The barbers who grow fastest are the ones who seek criticism, not praise.', timeframe: 'This Week' },
          { action: 'The Documentation Habit', description: 'Start a "lessons learned" document. Every mistake, breakthrough, and insight goes in one place.', benefit: 'Creates a personal knowledge base you can share with apprentices someday. Your legacy starts now.', timeframe: 'Start Today' },
        ],
      },

      // ============================================================
      // NEW SECTION 15: Workplace Professionalism & Shop Etiquette
      // ============================================================
      {
        type: 'contentBlock',
        id: 'workplace-intro',
        title: 'Workplace Professionalism: Thriving in Any Shop Environment',
        content: "Every shop has its own culture, but certain professional standards are universal. Whether you're in a high-end suite, a neighborhood shop, or a school clinic, your behavior affects everyone around you. Workplace professionalism isn't about being stiff or formal — it's about creating an environment where clients feel comfortable, coworkers feel respected, and the business runs smoothly.",
        highlight: "creating an environment where clients feel comfortable",
      },
      {
        type: 'tabbed',
        id: 'shop-etiquette',
        title: 'Shop Etiquette Essentials',
        subtitle: 'The unwritten rules that separate professionals from amateurs',
        tabs: [
          {
            id: 'station-respect',
            label: 'Station Respect',
            title: 'Your Station, Your Responsibility',
            bullets: [
              { label: 'Clean as You Go', description: 'Sweep hair immediately after each cut. Wipe down your chair and station between clients.' },
              { label: 'Organized Tools', description: 'Keep your shears, clippers, and combs in designated spots. A messy station signals a messy barber.' },
              { label: 'Shared Spaces', description: 'Clean the bathroom, break room, and waiting area on your assigned days. Shared responsibility keeps the shop pristine.' },
            ],
          },
          {
            id: 'coworker-conduct',
            label: 'Coworker Conduct',
            title: 'Building Positive Colleague Relationships',
            bullets: [
              { label: 'No Poaching Clients', description: "Never solicit another barber's regular clients. If their client asks you for a cut, redirect them back to their barber." },
              { label: 'Share the Floor', description: 'In walk-in shops, rotate fairly. No one likes the barber who hogs every walk-in.' },
              { label: 'Keep Drama Out', description: 'Personal conflicts stay outside the shop. Clients can sense tension, and it makes the environment uncomfortable.' },
            ],
          },
          {
            id: 'busy-days',
            label: 'Busy Days',
            title: 'Handling High-Volume Days',
            bullets: [
              { label: 'Stay Calm Under Pressure', description: 'Rushing leads to mistakes. Breathe, focus on one client at a time, and communicate wait times clearly.' },
              { label: 'Support Each Other', description: 'On slammed days, help coworkers sweep, sanitize, or greet clients. Teamwork makes the shop run.' },
              { label: 'Know When to Say No', description: "If you're fully booked and exhausted, it's better to reschedule than to deliver a rushed, poor-quality cut." },
            ],
          },
        ],
      },
      {
        type: 'checklist',
        id: 'professional-daily',
        title: 'Daily Professionalism Checklist',
        items: [
          { text: 'Arrived on time and prepared for the day' },
          { text: 'Station is clean and organized before the first client' },
          { text: 'Treated every coworker with respect and fairness' },
          { text: 'Maintained professional boundaries with clients' },
          { text: 'Left the shop cleaner than I found it' },
        ],
      },
      {
        type: 'quote',
        id: 'closing-quote',
        quote: "The barber who masters life skills doesn't just build a career — they build a legacy. Technical skill opens the door. Character, discipline, and integrity keep you in the room.",
      },

      // 🎮 INTERACTIVE: Final Boss Challenge
      {
        type: 'challengeCard',
        id: 'final-boss',
        title: '👑 Final Boss: The 30-Day Life Skills Challenge',
        subtitle: 'Complete all 5 challenges to earn the Life Skills Master badge',
        challenges: [
          { badge: 'Week 1', title: 'Goal Crusher', description: 'Set 3 SMART goals for the month. Write them down and read them every morning. Track daily progress.', action: 'Use a notebook or app. At the end of each day, rate your progress 1-10. Average above 7 = win.', difficulty: 'medium' },
          { badge: 'Week 2', title: 'Time Lord', description: 'Do a full time audit. Plan every day in advance using time blocking. Zero unplanned social media during work/study blocks.', action: 'Use Google Calendar or a paper planner. Color-code: school (blue), practice (green), study (purple), rest (gray).', difficulty: 'medium' },
          { badge: 'Week 3', title: 'Network Ninja', description: 'Reach out to 3 people in the barber industry. Introduce yourself, ask one question, and offer value (share a resource, compliment their work).', action: 'DM on Instagram, email a shop owner, or attend a local barber event. Document responses in a networking log.', difficulty: 'medium' },
          { badge: 'Week 4', title: 'Money Master — Financial Foundation', description: 'Track every dollar for 7 days. Create a simple budget. Open a separate business account if you do not have one.', action: 'Use a spreadsheet or app like YNAB. Identify your top 3 spending leaks and commit to fixing one.', difficulty: 'hard' },
          { badge: 'BOSS MODE', title: 'Legacy Builder', description: 'Combine everything: set a 90-day goal, create a weekly schedule, reach out to a mentor, and track your finances for a full month.', action: 'This is the capstone. Document your entire system in one place. This is your blueprint for barber success.', difficulty: 'hard' },
        ],
      },
    ],
  },
  'ch-3': {
    chapterNumber: 3,
    title: 'Professional Image',
    subtitle: 'Building trust, credibility, and success through personal excellence',
    theme: chapter3Theme,
    sections: [
      // Section 1: Why Professional Image Matters
      {
        type: 'infoCards',
        id: 'why-image-matters',
        title: 'Why Professional Image Matters',
        subtitle: 'Your image is your silent ambassador — it speaks before you do',
        cards: [
          {
            icon: 'Handshake',
            title: 'First Impressions Are Everything',
            text: 'Clients decide if they trust you within the first 7 seconds. A clean, professional appearance signals competence, attention to detail, and respect for your craft. When you look the part, clients relax and feel confident in your hands.',
          },
          {
            icon: 'TrendingUp',
            title: 'Your Brand, Your Business',
            text: 'You are your own walking advertisement. Every client who leaves your chair becomes a potential referral. A polished image encourages clients to recommend you to friends, family, and colleagues — building your reputation and income.',
          },
          {
            icon: 'ShieldCheck',
            title: 'Health and Safety Standards',
            text: 'Professional image isn\'t just about looks — it\'s about demonstrating your commitment to sanitation and safety. Clean hands, fresh linens, and organized tools show clients you take their health seriously.',
          },
          {
            icon: 'Trophy',
            title: 'Industry Respect',
            text: 'Barbering is a respected profession with deep traditions. Maintaining high standards elevates the entire industry and positions you as a serious professional, not just someone who "cuts hair."',
          },
        ],
      },

      // Section 2: Personal Hygiene & Grooming Standards (Tabbed)
      {
        type: 'tabbed',
        id: 'hygiene-grooming',
        title: 'Personal Hygiene & Grooming Standards',
        subtitle: 'The foundation of professional trust',
        tabs: [
          {
            id: 'daily-care',
            label: 'Daily Care',
            title: 'Daily Personal Care Routine',
            bullets: [
              { label: 'Shower Before Work', description: 'Start each day fresh. Working in close proximity to clients means body odor is unacceptable.' },
              { label: 'Clean Uniform Daily', description: 'Hair clippings, product residue, and stains must be removed. Have multiple uniforms ready.' },
              { label: 'Hand Washing', description: 'Wash hands thoroughly before and after every client. Use antibacterial soap.' },
              { label: 'Face Care', description: 'Keep facial hair trimmed and neat. If clean-shaven, maintain it daily.' },
            ],
          },
          {
            id: 'hair-nails',
            label: 'Hair & Nails',
            title: 'Hair and Nail Standards',
            bullets: [
              { label: 'Your Hair Speaks Volumes', description: 'As a barber, your hairstyle is your best advertisement. Keep it freshly cut, styled, and appropriate. Never let your own hair look neglected.' },
              { label: 'Nail Care Essentials', description: 'Keep nails trimmed short — long nails harbor bacteria and can scratch clients. Clean under nails thoroughly. No chipped polish. Avoid artificial nails that trap bacteria.' },
            ],
          },
          {
            id: 'breath-body',
            label: 'Breath & Body',
            title: 'Breath and Body Awareness',
            bullets: [
              { label: 'Avoid Strong Scents', description: 'Heavy cologne, perfume, or aftershave can trigger allergies and overwhelm clients in close quarters. Use lightly scented or unscented products.' },
              { label: 'Fresh Breath Matters', description: 'Brush teeth before work, keep mints handy (sugar-free), and avoid strong-smelling foods like garlic or onions during work hours.' },
              { label: 'Deodorant is Essential', description: 'Apply antiperspirant/deodorant daily. Physical work and stress can cause perspiration — stay fresh for every client.' },
              { label: 'No Smoking Smell', description: 'Smoke odor clings to hair, clothes, and hands. If you smoke, do so away from the shop and wash hands thoroughly afterward.' },
            ],
          },
          {
            id: 'workplace-hygiene',
            label: 'Workplace',
            title: 'Workplace Hygiene Standards',
            bullets: [
              { label: 'Sweep After Each Cut', description: 'Sweep hair immediately after each cut — never let it accumulate.' },
              { label: 'Disinfect Tools', description: 'Disinfect tools between every client: clippers, shears, combs.' },
              { label: 'Fresh Capes & Neck Strips', description: 'Use fresh capes and neck strips for each client.' },
              { label: 'Hand Sanitizer', description: 'Keep hand sanitizer visible and use it.' },
              { label: 'Organized Products', description: 'Store products in clean, organized containers — no dust or residue.' },
            ],
          },
        ],
      },

      // 💎 INTERACTIVE: Professional Standards Checklist
      {
        type: 'appearanceChecklist',
        id: 'daily-prep-checklist',
        title: 'Opening Shift Preparation',
        subtitle: 'The elite barber\'s daily readiness protocol',
        categories: [
          {
            category: 'Personal Grooming',
            icon: 'Sparkles',
            items: [
              { text: 'Showered and applied deodorant', isEssential: true },
              { text: 'Hair styled and professional', isEssential: true },
              { text: 'Nails clean, trimmed, and polished', isEssential: true },
              { text: 'Facial hair groomed or clean-shaven', isEssential: false },
              { text: 'Breath fresh — brushed teeth, mints ready', isEssential: true },
              { text: 'Minimal or no strong fragrance', isEssential: true },
            ],
          },
          {
            category: 'Professional Attire',
            icon: 'Shirt',
            items: [
              { text: 'Clean, pressed uniform or professional attire', isEssential: true },
              { text: 'Closed-toe, comfortable footwear', isEssential: true },
              { text: 'Minimal jewelry — nothing that dangles or distracts', isEssential: false },
              { text: 'Watch is clean and professional', isEssential: false },
            ],
          },
          {
            category: 'Station Readiness',
            icon: 'Scissors',
            items: [
              { text: 'Tools sanitized and organized', isEssential: true },
              { text: 'Fresh capes, neck strips, and towels', isEssential: true },
              { text: 'Products stocked and within reach', isEssential: true },
              { text: 'Chair and station wiped down', isEssential: true },
              { text: 'Trash emptied and floor swept', isEssential: false },
            ],
          },
        ],
      },

      // Section 3: Exercise & Physical Health
      {
        type: 'featureGrid',
        id: 'physical-health',
        title: 'Exercise & Physical Health',
        subtitle: 'Barbering is physically demanding — your body is your tool',
        features: [
          {
            icon: 'Dumbbell',
            title: 'Strength Training',
            description: 'Barbering requires holding your arms up for hours. Shoulder, back, and core strength prevent fatigue and injury. Focus on exercises that build endurance, not just bulk.',
          },
          {
            icon: 'HeartPulse',
            title: 'Cardiovascular Health',
            description: 'Standing all day is taxing on your cardiovascular system. Regular cardio — walking, jogging, cycling — keeps your energy up and supports heart health for a long career.',
          },
          {
            icon: 'Sparkles',
            title: 'Flexibility & Recovery',
            description: 'Stretching, yoga, or simple mobility work keeps joints healthy and prevents the stiffness that comes from repetitive motions. Recovery is as important as the work itself.',
          },
        ],
      },
      {
        type: 'contentBlock',
        id: 'health-tips',
        title: 'Practical Health Tips for Barbers',
        content: '1) Stay Hydrated — Keep a water bottle at your station. Dehydration causes fatigue, headaches, and poor concentration. 2) Pack Healthy Snacks — Avoid energy crashes by eating protein-rich snacks between clients instead of sugary foods. 3) Protect Your Hearing — Clipper noise adds up over years. Consider ear protection if you work in a loud environment. 4) Get Regular Checkups — Physical labor takes a toll. Annual physicals catch problems early. Don\'t ignore pain.',
        highlight: 'Stay Hydrated',
      },

      // 💎 INTERACTIVE: Professionalism Level System
      {
        type: 'proLevelSystem',
        id: 'professionalism-levels',
        title: '🏆 The Professionalism Progression',
        subtitle: 'From Apprentice to Shop Leader — elevate your professional standards',
        levels: [
          {
            level: 'Level 1: Apprentice',
            title: 'Foundation Builder',
            description: 'You are learning the basics of professional image. Every day is an opportunity to build good habits that will serve your entire career.',
            standards: [
              'Arrive on time, every day, without exception',
              'Maintain basic hygiene: showered, clean uniform, fresh breath',
              'Keep your station organized and tools sanitized',
              'Listen more than you speak during consultations',
              'Ask questions when you do not understand',
            ],
            reward: 'Client Trust Badge — Clients notice your consistency',
          },
          {
            level: 'Level 2: Reliable Professional',
            title: 'The Consistent Performer',
            description: 'You have established routines that clients and coworkers can depend on. Your reliability is becoming your reputation.',
            standards: [
              'Deliver consistent quality on every single cut',
              'Remember client preferences and details',
              'Handle scheduling and cancellations professionally',
              'Maintain composure during busy or stressful periods',
              'Support coworkers without being asked',
            ],
            reward: 'Referral Ready — Clients recommend you to friends',
          },
          {
            level: 'Level 3: Trusted Barber',
            title: 'The Client Favorite',
            description: 'Clients specifically request you. Your professionalism has created loyalty that transcends price or convenience.',
            standards: [
              'Clients book weeks in advance to secure your chair',
              'You handle difficult situations with grace and confidence',
              'Your personal brand is recognizable and respected',
              'You mentor newer barbers by example',
              'Your station is a model of organization and cleanliness',
            ],
            reward: 'Premium Pricing Power — You have earned the right to charge more',
          },
          {
            level: 'Level 4: Elite Professional',
            title: 'The Industry Standard',
            description: 'You are known beyond your shop. Other barbers study your work. Your professionalism sets the bar for everyone around you.',
            standards: [
              'Your social media presence attracts clients and respect',
              'You represent the shop at events, competitions, and media',
              'Your consultation process is a masterclass in client care',
              'You have developed signature techniques or styles',
              'Your reputation precedes you — people know your name',
            ],
            reward: 'Industry Recognition — Your name carries weight',
          },
          {
            level: 'Level 5: Shop Leader',
            title: 'The Legacy Builder',
            description: 'You shape the culture of your shop. Your standards become the shop\'s standards. You are building something that outlasts your time in the chair.',
            standards: [
              'You set and enforce professional standards for the team',
              'Your mentorship produces the next generation of elite barbers',
              'Your business acumen drives shop growth and profitability',
              'Your community presence elevates the entire profession',
              'Your legacy is measured in the success of those you trained',
            ],
            reward: 'Legacy Status — Your influence extends beyond your career',
          },
        ],
      },

      // Section 4: Stress Management Techniques
      {
        type: 'contentBlock',
        id: 'stress-intro',
        title: 'Recognize Barbering Stressors',
        content: 'Barbering comes with unique pressures: difficult clients, time constraints, physical demands, financial uncertainty, and the need to constantly stay creative. Acknowledging these stressors is the first step to managing them.',
        highlight: 'Acknowledging these stressors',
      },
      {
        type: 'featureGrid',
        id: 'moment-techniques',
        title: 'In-the-Moment Techniques',
        features: [
          {
            icon: 'Wind',
            title: 'Deep Breathing',
            description: '4 counts in, hold, out, hold. Calms your nervous system instantly.',
          },
          {
            icon: 'Clock',
            title: 'Micro-Breaks',
            description: '30 seconds between clients to reset. Step back, breathe, and refocus.',
          },
          {
            icon: 'RotateCcw',
            title: 'Shoulder Rolls',
            description: 'Release physical tension. Roll shoulders backward 5 times.',
          },
          {
            icon: 'MessageCircle',
            title: 'Positive Self-Talk',
            description: '"I\'ve got this." Simple affirmations reframe anxiety into confidence.',
          },
        ],
      },
      {
        type: 'featureGrid',
        id: 'long-term-strategies',
        title: 'Long-Term Strategies',
        features: [
          {
            icon: 'Ban',
            title: 'Set Boundaries',
            description: 'Learn to say no. Protect your days off. Your health is your business asset.',
          },
          {
            icon: 'Calendar',
            title: 'Schedule Rest',
            description: 'Block rest days like appointments. Recovery prevents burnout.',
          },
          {
            icon: 'Palette',
            title: 'Hobbies Outside Work',
            description: 'Maintain interests that recharge you. You are more than your job.',
          },
          {
            icon: 'Users',
            title: 'Talk to Someone',
            description: 'Don\'t bottle it up. A mentor, therapist, or friend can help.',
          },
        ],
      },
      {
        type: 'featureGrid',
        id: 'burnout-signs',
        title: 'Warning Signs of Burnout',
        features: [
          {
            icon: 'AlertTriangle',
            title: 'Physical',
            description: 'Chronic fatigue, headaches, muscle pain, sleep problems, getting sick often.',
          },
          {
            icon: 'Frown',
            title: 'Emotional',
            description: 'Irritability, cynicism, feeling detached, loss of enjoyment, anxiety.',
          },
          {
            icon: 'TrendingDown',
            title: 'Performance',
            description: 'Declining quality, missed appointments, difficulty concentrating, procrastination.',
          },
        ],
      },

      // Section 5: Dress & Appearance Standards (Tabbed)
      {
        type: 'tabbed',
        id: 'dress-standards',
        title: 'Dress & Appearance Standards',
        subtitle: 'Dress for the professional you want to be',
        tabs: [
          {
            id: 'uniforms',
            label: 'Uniforms',
            title: 'Professional Uniforms',
            bullets: [
              { label: 'Classic Barber Attire', description: 'Traditional barber smocks, vests, or aprons in black, white, or navy project professionalism. A clean, well-fitted uniform shows you take your role seriously.' },
              { label: 'Do', description: 'Wear clean, pressed uniforms daily. Ensure proper fit — not too tight or loose. Have backup uniforms ready. Follow shop dress code exactly.' },
              { label: 'Don\'t', description: 'Wear stained or torn clothing. Show excessive skin or wear revealing clothes. Wear clothes with offensive graphics. Wear the same uniform multiple days.' },
            ],
          },
          {
            id: 'footwear',
            label: 'Footwear',
            title: 'Footwear for the Long Haul',
            bullets: [
              { label: 'Comfort First', description: 'Cushioned insoles, arch support, and proper fit. You\'ll be on your feet 8+ hours a day.' },
              { label: 'Closed-Toe Required', description: 'Protect feet from dropped tools and hair clippings. Safety first.' },
              { label: 'Easy to Clean', description: 'Leather or synthetic materials that wipe clean. Hair and product residue happens.' },
            ],
          },
          {
            id: 'accessories',
            label: 'Accessories',
            title: 'Accessories & Jewelry',
            bullets: [
              { label: 'Keep It Minimal', description: 'Accessories should complement, not distract. A simple watch, small earrings, or a subtle necklace is fine. Avoid anything that jingles, dangles, or could catch on tools.' },
              { label: 'Safety Considerations', description: 'No dangling bracelets near clippers. Rings can harbor bacteria. Long necklaces can swing into your work.' },
            ],
          },
          {
            id: 'personal-style',
            label: 'Style',
            title: 'Personal Style Within Professional Bounds',
            bullets: [
              { label: 'Express Yourself Professionally', description: 'Your personal style can be part of your brand — but always within professional boundaries. Creative hair, tattoos, and unique fashion can attract certain clients, but cleanliness and neatness must never be compromised.' },
              { label: 'Key Principle', description: 'Your appearance should never make a client uncomfortable. Express yourself, but remember you\'re creating a safe, welcoming space for everyone who sits in your chair.' },
            ],
          },
        ],
      },

      // 💎 INTERACTIVE: Professional Scenarios
      {
        type: 'proScenario',
        id: 'consultation-scenarios',
        title: '🎭 Client Consultation Scenarios',
        subtitle: 'Navigate real client interactions with confidence and professionalism',
        scenarios: [
          {
            situation: 'A new client sits in your chair and says, "Just do whatever you think looks best." They seem nervous and are not making eye contact.',
            context: 'This is a trust-building moment. How you respond will determine whether they become a regular client.',
            options: [
              { letter: 'A', text: 'Start cutting immediately — they said do whatever you want', feedback: '❌ Rushing into a cut without understanding the client\'s preferences shows overconfidence. Nervous clients need reassurance, not assumptions.', isPremium: false },
              { letter: 'B', text: 'Ask open-ended questions about their lifestyle, hair history, and what they liked about past cuts. Show reference photos.', feedback: '✅ Correct! Even when clients defer to your expertise, gathering context ensures the result matches their reality. Reference photos bridge the gap between imagination and execution.', isPremium: true },
              { letter: 'C', text: 'Give them the same cut you give everyone — it works on most people', feedback: '❌ One-size-fits-all barbering ignores individual face shapes, hair textures, and personal style. Every client deserves a customized approach.', isPremium: false },
              { letter: 'D', text: 'Tell them you need more direction and ask them to come back when they know what they want', feedback: '❌ Turning away a nervous client wastes a trust-building opportunity. Your job is to guide them, not demand they arrive with a vision board.', isPremium: false },
            ],
            correctAnswer: 'B',
            proTip: 'Elite barbers treat "do whatever" as an invitation to demonstrate expertise through questions, not as permission to skip the consultation.',
          },
          {
            situation: 'A regular client shows you a photo of a celebrity haircut and says, "I want this exact style." Their hair texture and face shape are completely different from the person in the photo.',
            context: 'Managing expectations while preserving the client relationship requires diplomacy and expertise.',
            options: [
              { letter: 'A', text: 'Agree to do it exactly like the photo and hope for the best', feedback: '❌ False promises damage trust. When the result inevitably differs, the client will feel deceived, not disappointed.', isPremium: false },
              { letter: 'B', text: 'Explain that their hair texture and face shape differ from the reference, then suggest an adapted version that captures the essence while suiting them', feedback: '✅ Correct! Honest expertise builds more trust than false agreement. Clients appreciate when you educate them rather than just saying yes.', isPremium: true },
              { letter: 'C', text: 'Tell them the photo is unrealistic and they should pick something else', feedback: '❌ Dismissing their inspiration feels condescending. The goal is adaptation, not rejection.', isPremium: false },
              { letter: 'D', text: 'Do the cut silently and let them discover the mismatch in the mirror', feedback: '❌ Silence is not professionalism. Clients deserve to understand the process and give informed consent.', isPremium: false },
            ],
            correctAnswer: 'B',
            proTip: 'Luxury service means guiding clients to the best version of their vision — not blindly executing it or dismissing it.',
          },
        ],
      },

      // Section 6: Ergonomics & Body Mechanics
      {
        type: 'contentBlock',
        id: 'client-chair',
        title: 'Client Chair Position',
        content: 'Adjust chair height so client\'s head is at your elbow level. Use a chair that raises/lowers easily throughout the cut. Position client so you don\'t have to bend or reach.',
        highlight: 'head is at your elbow level',
      },
      {
        type: 'contentBlock',
        id: 'your-position',
        title: 'Your Body Position',
        content: 'Keep feet shoulder-width apart for stability. Stand close to the client — don\'t overreach. Move your feet instead of twisting your back.',
        highlight: 'Move your feet',
      },
      {
        type: 'featureGrid',
        id: 'common-injuries',
        title: 'Common Barbering Injuries to Prevent',
        features: [
          {
            icon: 'AlertTriangle',
            title: 'Carpal Tunnel',
            description: 'From repetitive clipper and shear use. Take breaks, stretch wrists, use ergonomic tools.',
          },
          {
            icon: 'AlertTriangle',
            title: 'Lower Back Pain',
            description: 'From poor posture and bending. Maintain neutral spine, use anti-fatigue mats.',
          },
          {
            icon: 'AlertTriangle',
            title: 'Shoulder/Neck Strain',
            description: 'From holding arms up. Lower chair, adjust position, strengthen shoulder muscles.',
          },
        ],
      },
      {
        type: 'featureGrid',
        id: 'equipment-ergonomics',
        title: 'Equipment Ergonomics',
        features: [
          {
            icon: 'Scissors',
            title: 'Lightweight Tools',
            description: 'Choose clippers and shears that reduce hand fatigue.',
          },
          {
            icon: 'Square',
            title: 'Anti-Fatigue Mats',
            description: 'Cushioned flooring reduces leg and back strain.',
          },
          {
            icon: 'Lightbulb',
            title: 'Proper Lighting',
            description: 'Good lighting prevents leaning in and eye strain.',
          },
          {
            icon: 'MoveHorizontal',
            title: 'Adjustable Stations',
            description: 'Everything within easy reach prevents overreaching.',
          },
        ],
      },

      // 💎 INTERACTIVE: Confidence Builder
      {
        type: 'confidenceBuilder',
        id: 'client-confidence',
        title: '💎 Confidence Builder: Client Trust Moments',
        subtitle: 'Choose the response that builds lasting client relationships',
        cards: [
          {
            situation: 'A client is clearly unhappy with their haircut but has not said anything. They are staring at the mirror with a disappointed expression.',
            question: 'How do you respond?',
            responses: [
              { text: 'Pretend not to notice and finish the service normally', isProfessional: false, feedback: 'Ignoring client discomfort signals indifference. Clients remember when you did not care.' },
              { text: 'Ask directly: "I want to make sure you love this. Is there anything you\'d like me to adjust?"', isProfessional: true, feedback: 'Proactive concern shows confidence and integrity. Clients trust barbers who invite feedback.' },
              { text: 'Wait for them to complain, then offer a discount', isProfessional: false, feedback: 'Waiting for complaints puts the burden on the client. Discounts do not fix disappointment.' },
              { text: 'Tell them it looks great and they will get used to it', isProfessional: false, feedback: 'Dismissing client feelings destroys trust. Never gaslight a client about their own appearance.' },
            ],
            insight: 'Elite barbers read discomfort before words are spoken. Addressing concerns proactively transforms potential complaints into loyalty.',
          },
          {
            situation: 'A client arrives 20 minutes late for their appointment. You have another client in 30 minutes.',
            question: 'What is the most professional approach?',
            responses: [
              { text: 'Refuse to serve them — lateness shows disrespect', isProfessional: false, feedback: 'Rigid policies alienate good clients who had genuine delays. Flexibility builds loyalty.' },
              { text: 'Politely acknowledge the delay, confirm what they need, and deliver the best version of that service within the remaining time', isProfessional: true, feedback: 'Professional grace under pressure demonstrates maturity. Clients remember how you handled the situation, not just the cut.' },
              { text: 'Rush through the cut to stay on schedule', isProfessional: false, feedback: 'Rushed work damages your reputation. Quality should never be sacrificed for speed.' },
              { text: 'Make them wait until your next opening', isProfessional: false, feedback: 'Passive-aggressive scheduling punishes the client and wastes your own time.' },
            ],
            insight: 'Time management is a professional skill. The best barbers balance respect for their schedule with grace for their clients.',
          },
        ],
      },

      // Section 7: Communication & Human Relations (Tabbed)
      {
        type: 'tabbed',
        id: 'communication',
        title: 'Communication & Human Relations',
        subtitle: 'Technical skill gets clients in the chair — people skills keep them coming back',
        tabs: [
          {
            id: 'consultation',
            label: 'Consultation',
            title: 'The Art of Consultation',
            bullets: [
              { label: '1. Greet Warmly', description: 'Make eye contact, smile, use their name.' },
              { label: '2. Ask Open Questions', description: '"What are we doing today?" "How do you want to look?"' },
              { label: '3. Assess Hair & Face', description: 'Explain what will work with their hair type and face shape.' },
              { label: '4. Confirm Understanding', description: 'Repeat back what you heard — "So you want..."' },
            ],
          },
          {
            id: 'active-listening',
            label: 'Listening',
            title: 'Active Listening Skills',
            bullets: [
              { label: 'What Active Listening Looks Like', description: 'Maintain appropriate eye contact. Nod and give verbal acknowledgments. Don\'t interrupt — let them finish. Ask clarifying questions.' },
              { label: 'Reading Non-Verbal Cues', description: 'Facial expressions show satisfaction or concern. Fidgeting might indicate discomfort. Watching the mirror closely = they care about details.' },
            ],
          },
          {
            id: 'difficult-situations',
            label: 'Difficult Clients',
            title: 'Handling Difficult Situations',
            bullets: [
              { label: 'The Unhappy Client', description: 'Stay calm, listen without defending, apologize sincerely, and offer a solution. "I\'m sorry you\'re not happy. Let me fix this for you right now."' },
              { label: 'The Talkative Client', description: 'Engage politely but keep working. Use brief responses and redirect to the cut: "That\'s interesting — tilt your head down for me."' },
              { label: 'The Silent Client', description: 'Respect their quiet. Some people want peace during their cut. A simple "Comfortable?" check-in is enough.' },
            ],
          },
          {
            id: 'building-loyalty',
            label: 'Building Loyalty',
            title: 'Building Client Loyalty',
            bullets: [
              { label: 'Remember the Details', description: 'Take notes if needed — their kids\' names, their job, their last vacation. Bringing up past conversations shows you see them as a person, not just a paycheck.' },
              { label: 'Be Consistent', description: 'Deliver the same quality every time. Reliability builds trust faster than anything else.' },
              { label: 'Go the Extra Mile', description: 'Offer a hot towel at the end. Remember their preferred products. Send birthday messages. Recommend products that actually help. Thank them sincerely every time.' },
            ],
          },
        ],
      },

      // Section 8: Social Media Professionalism
      {
        type: 'contentBlock',
        id: 'showcasing-work',
        title: 'Showcasing Your Work',
        content: 'Social media is a powerful marketing tool. Post before/after photos, showcase your best cuts, and demonstrate your skills. This builds your brand and attracts new clients. Best practices: Use good lighting for photos. Get client permission before posting. Post consistently, not sporadically. Use relevant hashtags. Engage with comments professionally.',
        highlight: 'Get client permission before posting',
      },
      {
        type: 'contentBlock',
        id: 'what-to-avoid',
        title: 'What to Avoid',
        content: 'One unprofessional post can damage your reputation. Remember: clients, employers, and potential business partners can see everything you post. Red flags: Complaining about clients or coworkers. Posting while under the influence. Sharing controversial opinions. Inappropriate language or content. Posting client photos without consent.',
        highlight: 'One unprofessional post can damage your reputation',
      },
      {
        type: 'featureGrid',
        id: 'social-guidelines',
        title: 'Professional Social Media Guidelines',
        features: [
          {
            icon: 'UserCircle',
            title: 'Separate Accounts',
            description: 'Consider keeping personal and professional accounts separate. What your friends find funny, clients might find unprofessional.',
          },
          {
            icon: 'Lock',
            title: 'Privacy Settings',
            description: 'Review your privacy settings regularly. Assume anything you post could become public.',
          },
          {
            icon: 'MessageSquare',
            title: 'Think Before Posting',
            description: 'Ask: "Would I want my grandmother, my boss, and my best client to see this?" If no, don\'t post it.',
          },
        ],
      },

      // ============================================================
      // NEW SECTION 9: Posture & Body Alignment
      // ============================================================
      {
        type: 'contentBlock',
        id: 'posture-intro',
        title: 'Posture: The Foundation of Longevity',
        content: "Your posture determines how long your career lasts. Poor alignment doesn't just cause pain — it shortens careers. The textbook identifies four common posture problems that barbers develop over time: hunchback (rounded upper back), swayback (excessive lower back curve), flat back (loss of natural curves), and combined hunchback-swayback. Recognizing these patterns early and correcting them through awareness and exercise is essential for a sustainable career.",
        highlight: 'Your posture determines how long your career lasts',
      },
      {
        type: 'tabbed',
        id: 'posture-guidelines',
        title: 'Proper Posture Guidelines',
        subtitle: 'Standing and sitting alignment for barbers',
        tabs: [
          {
            id: 'standing-posture',
            label: 'Standing',
            title: 'Standing Posture Checklist',
            bullets: [
              { label: 'Head Position', description: 'Keep head up with chin parallel to the floor. Avoid jutting the chin forward or looking down for extended periods.' },
              { label: 'Neck Alignment', description: 'Neck elongated and balanced directly above shoulders. Imagine a string pulling the crown of your head toward the ceiling.' },
              { label: 'Upper Body', description: 'Chest up and out — no slouching. Upper body lifted with shoulders level and relaxed, not hunched toward the ears.' },
              { label: 'Spine Straight', description: 'Maintain the natural curves of your spine. Avoid excessive arching or flattening of the lower back.' },
            ],
          },
          {
            id: 'sitting-posture',
            label: 'Sitting',
            title: 'Sitting Posture for Barbering',
            bullets: [
              { label: 'Hips Level', description: 'Hips level and horizontal — not tilted forward or backward. Both sitting bones should bear equal weight.' },
              { label: 'Knee Position', description: 'Knees flexed slightly, positioned directly over the feet. Avoid crossing legs for extended periods.' },
              { label: 'Feet Placement', description: 'Soles of feet flat on the floor directly under knees. Seat height should be even with knees to create a 90-degree angle.' },
              { label: 'Weight Distribution', description: 'Torso weight on thigh bones, not the tailbone or spine. Back straight with torso kept erect.' },
              { label: 'Arm Angle', description: 'Desk or work surface height should allow a 90-degree arm angle when writing or working with tools.' },
            ],
          },
        ],
      },
      {
        type: 'infoCards',
        id: 'common-posture-problems',
        title: 'Common Posture Problems to Avoid',
        cards: [
          {
            icon: 'AlertTriangle',
            title: 'Hunchback (Rounded Back)',
            text: 'Shoulders roll forward, upper back rounds. Caused by leaning over clients and looking down. Leads to neck pain, headaches, and restricted breathing.',
          },
          {
            icon: 'AlertTriangle',
            title: 'Swayback (Excessive Arch)',
            text: 'Lower back arches excessively, pelvis tilts forward. Caused by standing with weight shifted back. Leads to lower back pain and hip issues.',
          },
          {
            icon: 'AlertTriangle',
            title: 'Flat Back (Lost Curves)',
            text: 'Natural spinal curves flatten. Caused by rigid standing posture. Leads to stiffness, reduced shock absorption, and spinal compression.',
          },
          {
            icon: 'AlertTriangle',
            title: 'Combined Hunchback-Swayback',
            text: 'Upper back rounds while lower back over-arches. The most common barber posture problem. Leads to pain in both upper and lower back.',
          },
        ],
      },

      // 💎 INTERACTIVE: Pro Tips
      {
        type: 'proTip',
        id: 'luxury-tips',
        title: '💎 Luxury Standards: Pro Tips',
        subtitle: 'Expand for elite insights from master barbers',
        items: [
          {
            category: 'Attention to Detail',
            tips: [
              'Check your client\'s neck and ears for stray hairs before they leave the chair — every time',
              'Wipe the mirror clean between clients. A smudged mirror undermines an otherwise perfect cut',
              'Align the cape so the logo (if any) faces the client, not backward',
              'Offer a handheld mirror for the back-of-head inspection — never assume they trust what they cannot see',
            ],
          },
          {
            category: 'Consistency',
            tips: [
              'Document each client\'s preferences: guard numbers, product choices, conversation style. Review before they arrive',
              'Perform your setup ritual identically for every client. Consistency signals professionalism',
              'Use the same greeting, consultation structure, and closing for every client until it becomes muscle memory',
              'If you run late, communicate proactively. Silence breeds anxiety',
            ],
          },
          {
            category: 'Client Trust',
            tips: [
              'Remember names — not just the client\'s, but their family members\' names too',
              'Take notes after each cut: "Prefers quiet," "Loves talking sports," "Sensitive about recession." Review before their next visit',
              'Never discuss other clients while a client is in your chair. Confidentiality is sacred',
              'If you make a mistake, own it immediately. "I need to fix this" builds more trust than pretending it is fine',
            ],
          },
          {
            category: 'Reputation Building',
            tips: [
              'Your social media should look like a portfolio, not a personal diary. Curate every post',
              'Respond to every review — positive and negative — within 24 hours',
              'Thank clients for referrals with a handwritten note or a complimentary service upgrade',
              'Invest in continuing education. The best barbers never stop learning',
            ],
          },
        ],
      },

      // ============================================================
      // NEW SECTION 10: Stress-Relief Exercises
      // ============================================================
      {
        type: 'contentBlock',
        id: 'stress-relief-intro',
        title: 'Daily Stress-Relief Exercises for Barbers',
        content: 'Repetitive motions and sustained positions create cumulative stress on your body. The textbook recommends specific exercises targeting the areas most affected by barbering: wrists, fingers, and shoulders. These exercises take less than 5 minutes and should be performed between clients or during breaks. Prevention is always easier than recovery.',
        highlight: 'Prevention is always easier than recovery',
      },
      {
        type: 'tabbed',
        id: 'stress-relief-exercises',
        title: 'Targeted Stress-Relief Exercises',
        subtitle: 'Simple movements that prevent repetitive strain injuries',
        tabs: [
          {
            id: 'wrist-exercises',
            label: 'Wrists',
            title: 'Wrist Flexor & Extensor Stretches',
            bullets: [
              { label: 'Starting Position', description: 'Stand straight with arms extended out in front of you, palms facing down.' },
              { label: 'Upward Bend', description: 'Bend wrists upward, pulling fingers back gently. Hold for 5 seconds. Feel the stretch along the underside of the forearm.' },
              { label: 'Downward Bend', description: 'Turn hands so palms face up, then bend wrists downward. Hold for 5 seconds. Feel the stretch along the top of the forearm.' },
              { label: 'Repeat', description: 'Perform 5 complete cycles of upward and downward bends. Do this between every 2-3 clients.' },
            ],
          },
          {
            id: 'finger-exercises',
            label: 'Fingers',
            title: 'Finger Grip Strengthening & Release',
            bullets: [
              { label: 'Grip & Release', description: 'Squeeze a tennis ball or tension ball tightly for 5 counts, then release completely.' },
              { label: 'Repeat', description: 'Perform 5 repetitions per hand. This strengthens grip while promoting blood flow.' },
              { label: 'Finger Spreads', description: 'Spread fingers wide apart, hold for 5 seconds, then relax. Repeat 5 times to counteract the closed grip of holding clippers.' },
            ],
          },
          {
            id: 'shoulder-exercises',
            label: 'Shoulders',
            title: 'Shoulder Rolls & Shrugs',
            bullets: [
              { label: 'Shrug Up', description: 'Lift shoulders up toward ears. Hold for 5 counts.' },
              { label: 'Roll Back', description: 'Roll shoulders backward in a circular motion. Hold for 5 counts at the rearmost position.' },
              { label: 'Roll Forward', description: 'Roll shoulders forward in a circular motion. Hold for 5 counts at the frontmost position.' },
              { label: 'Repeat', description: 'Perform 5 complete cycles. Do this hourly to release tension from holding arms raised during cuts.' },
            ],
          },
        ],
      },

      // ============================================================
      // NEW SECTION 11: Good Manners & Professional Mannerisms
      // ============================================================
      {
        type: 'contentBlock',
        id: 'manners-intro',
        title: 'Good Manners: The Invisible Professional Edge',
        content: "Good manners reflect thoughtfulness, respect, and tolerance toward others. In barbering, they include exercising care of others' property, being considerate of coworkers, and showing courtesy to every person who enters the shop. Mannerisms — your habitual behaviors and gestures — either reinforce your professional image or undermine it. The textbook specifically warns against gum chewing, nervous habits, and negative body language that clients notice instantly.",
        highlight: 'Mannerisms either reinforce your image or undermine it',
      },
      {
        type: 'featureGrid',
        id: 'mannerisms-do-dont',
        title: 'Mannerisms: Do\'s and Don\'ts',
        features: [
          {
            icon: 'CheckCircle',
            title: 'DO: Conceal Disruptions',
            description: 'If you need to yawn, cough, or sneeze, turn away from the client and cover with your hand or elbow. Excuse yourself briefly if needed.',
          },
          {
            icon: 'CheckCircle',
            title: 'DO: Exhibit Pleasant Gestures',
            description: 'Use open, welcoming body language. Smile genuinely. Maintain appropriate eye contact. These small signals make clients feel valued.',
          },
          {
            icon: 'XCircle',
            title: 'DON\'T: Chew Gum',
            description: 'Gum chewing is universally unprofessional in service industries. It distracts clients, affects speech clarity, and looks careless.',
          },
          {
            icon: 'XCircle',
            title: 'DON\'T: Display Nervous Habits',
            description: 'Tapping feet, playing with hair, fidgeting with tools, or other nervous habits signal anxiety and distract from your professionalism.',
          },
        ],
      },
      {
        type: 'checklist',
        id: 'good-manners-checklist',
        title: 'Daily Good Manners Checklist',
        items: [
          { text: 'Greeted every client and coworker with a warm, genuine welcome' },
          { text: 'Respected others\' personal space and property' },
          { text: 'Avoided gum chewing and nervous habits during services' },
          { text: 'Concealed yawns, coughs, and sneezes appropriately' },
          { text: 'Used please, thank you, and excuse me consistently' },
          { text: 'Showed tolerance and respect for different viewpoints and backgrounds' },
        ],
      },

      // ============================================================
      // NEW SECTION 12: Communication Framework
      // ============================================================
      {
        type: 'contentBlock',
        id: 'communication-framework-intro',
        title: 'The Three-Step Communication Framework',
        content: 'Effective communication in barbering follows a simple but powerful framework: Organize, Clarify, Repeat. This three-step process ensures you fully understand what the client wants before you pick up any tool. Miscommunication is the leading cause of client dissatisfaction, and this framework eliminates most misunderstandings before they become problems.',
        highlight: 'Organize, Clarify, Repeat',
      },
      {
        type: 'milestoneList',
        id: 'communication-steps',
        title: 'The Communication Process',
        milestones: [
          { year: 'Step 1', title: 'Organize Your Thoughts', description: 'Before speaking with the client, determine what information you need. What questions will clarify their desired outcome? What terminology might be ambiguous? For example, when a client says "trim," do they mean a light cleanup or a significant length reduction?' },
          { year: 'Step 2', title: 'Clarify Terminology', description: 'Ensure you understand the client\'s specific terminology. When they say "over the ears," do they mean covering the tops of the ears or cut around the ears? Ask follow-up questions until you can visualize exactly what they want. Never assume you know what they mean.' },
          { year: 'Step 3', title: 'Repeat for Confirmation', description: 'Restate your interpretation to the client for confirmation. "So you want a fade starting at a #1 on the sides, blended up to finger length on top, with the neckline tapered — is that right?" This gives the client a chance to correct any misunderstanding before you begin.' },
        ],
      },
      {
        type: 'contentBlock',
        id: 'communication-pro-tip',
        title: 'Pro Tip: The Power of Visual References',
        content: 'Words alone are often insufficient for describing hairstyles. Keep a portfolio of your work or reference photos on your phone. When a client describes what they want, show them a similar style and ask, "Is this the direction you\'re thinking?" Visual confirmation eliminates the gap between what the client imagines and what you plan to deliver.',
        highlight: 'Visual confirmation eliminates the gap',
      },

      // 💎 INTERACTIVE: Reflection Blocks
      {
        type: 'reflectionBlock',
        id: 'professional-reflections',
        title: '🪞 Professional Reflections',
        subtitle: 'Reflect on your approach to build deeper professional awareness',
        questions: [
          {
            question: 'Think about your last difficult client interaction. What could you have done differently to turn the situation into a trust-building moment?',
            placeholder: 'Describe the situation and your revised approach...',
            insight: 'Elite barbers view difficult interactions as opportunities, not obstacles. Every challenge handled well creates a more loyal client than one who never had a problem.',
          },
          {
            question: 'What is one aspect of your professional image that you have been neglecting? Why has it been overlooked, and what is your plan to address it?',
            placeholder: 'Be honest with yourself — this reflection is private...',
            insight: 'Self-awareness is the foundation of growth. The barbers who improve fastest are those who can honestly assess their own gaps without defensiveness.',
          },
          {
            question: 'How would you want a client to describe you to their friend? What three words would you hope they use?',
            placeholder: 'Choose three words and explain why they matter to you...',
            insight: 'Your reputation is built one client at a time. Defining how you want to be remembered helps you make intentional choices in every interaction.',
          },
        ],
      },

      // ============================================================
      // NEW SECTION 13: Conversation Guidelines & Confidentiality
      // ============================================================
      {
        type: 'contentBlock',
        id: 'conversation-intro',
        title: 'Conversation Topics: What to Discuss and What to Avoid',
        content: "The barber chair is a place of trust. Clients share their lives with you, and how you handle that trust defines your professionalism. The textbook specifically identifies topics that should never be discussed in the barbershop: religion, politics, personal problems, and gossip about other clients or coworkers. These topics create division, discomfort, and can damage the welcoming atmosphere every shop needs.",
        highlight: 'The barber chair is a place of trust',
      },
      {
        type: 'infoCards',
        id: 'conversation-topics',
        title: 'Conversation Guidelines',
        cards: [
          {
            icon: 'MessageCircle',
            title: 'Safe Topics',
            text: 'Sports, local events, hobbies, travel, movies, music, food recommendations, and light personal updates ("How was your vacation?"). These build rapport without risk.',
          },
          {
            icon: 'AlertTriangle',
            title: 'Topics to Avoid',
            text: 'Religion, politics, personal problems, other people\'s business, gossip about clients or coworkers, and controversial social issues. These create division and discomfort.',
          },
          {
            icon: 'Lock',
            title: 'Confidentiality Rule',
            text: 'Never discuss personal wages, tips, rent, or tax information with coworkers. Never repeat what one client tells you to another person. What happens in the chair stays in the chair.',
          },
          {
            icon: 'Heart',
            title: 'Reading the Room',
            text: 'Some clients want conversation; others want quiet. Pay attention to cues. A client who gives short answers and closes their eyes probably wants peace. Respect their preference.',
          },
        ],
      },
      {
        type: 'checklist',
        id: 'confidentiality-checklist',
        title: 'Confidentiality & Professional Boundaries Checklist',
        items: [
          { text: 'Never gossip about other clients or coworkers' },
          { text: 'Never discuss religion or politics in the shop' },
          { text: 'Never share personal financial information (wages, tips, rent)' },
          { text: 'Respect client privacy — what they share stays with you' },
          { text: 'Read client cues and adapt conversation to their preference' },
          { text: 'Address disputes and differences in private, not in front of others' },
        ],
      },

      // ============================================================
      // NEW SECTION 14: Social Media Best Practices
      // ============================================================
      {
        type: 'contentBlock',
        id: 'social-media-expanded',
        title: 'Social Media: Building Your Brand the Right Way',
        content: "Social media is one of the most powerful tools for building your barbering career — but it's also one of the fastest ways to damage it. The textbook emphasizes that maintaining a professional online image is a daily process that requires intention. Your social media presence should reflect the same standards you maintain in the shop: professionalism, positivity, and respect.",
        highlight: 'Maintaining a professional online image is a daily process',
      },
      {
        type: 'tabbed',
        id: 'social-media-dos-donts',
        title: 'Social Media DO\'s and DON\'Ts',
        subtitle: 'Rules for maintaining professional image online',
        tabs: [
          {
            id: 'social-dos',
            label: 'DO\'s',
            title: 'Social Media Best Practices',
            bullets: [
              { label: 'Manage Your Pages', description: 'Regularly review and curate your personal and professional pages. Remove content that no longer reflects your brand.' },
              { label: 'Post Helpful Content', description: 'Share tips, before/after photos (with permission), product recommendations, and educational content that helps clients and peers.' },
              { label: 'Engage Professionally', description: 'Respond to comments and messages promptly and professionally. Thank clients for positive reviews and address concerns privately.' },
              { label: 'Build Community', description: 'Use social media to connect with peers, mentors, and potential clients. Networking online can lead to real-world opportunities.' },
            ],
          },
          {
            id: 'social-donts',
            label: 'DON\'Ts',
            title: 'Social Media Pitfalls to Avoid',
            bullets: [
              { label: 'No Profanity', description: 'Profane language diminishes your professional image instantly. Keep all public communication clean and respectful.' },
              { label: 'No Online Arguments', description: 'Never participate in or entertain arguments online. If someone posts something negative, respond calmly or not at all.' },
              { label: 'No Embarrassing Photos', description: 'Never post rude, embarrassing, or unprofessional photographs. This includes photos of clients without permission.' },
              { label: 'No Spam', description: 'Don\'t forward chain messages, spam, or irrelevant content. Your feed should be valuable, not cluttered.' },
            ],
          },
        ],
      },
      {
        type: 'featureGrid',
        id: 'social-media-activities',
        title: 'Communication Activities for Barber Success',
        features: [
          {
            icon: 'Phone',
            title: 'Telephone & Booking',
            description: 'Answer calls promptly, speak clearly, confirm appointments, and handle rescheduling professionally. Your phone voice is part of your image.',
          },
          {
            icon: 'Users',
            title: 'Networking & Contacts',
            description: 'Build relationships with other barbers, shop owners, product vendors, and industry professionals. Your network is your net worth.',
          },
          {
            icon: 'TrendingUp',
            title: 'Self-Promotion',
            description: 'Share your work, skills, and creativity online. A strong personal brand attracts clients who value what you offer.',
          },
          {
            icon: 'ShoppingBag',
            title: 'Product Recommendations',
            description: 'Recommend products that genuinely help clients. Ethical product suggestions build trust and can create additional income streams.',
          },
        ],
      },
      {
        type: 'quote',
        id: 'ch3-closing-quote',
        quote: 'Maintaining a professional image is a daily process. The time you invest in your image today will have long-term returns for your business tomorrow. Your image is your brand — make it your best.',
      },

      // 💎 INTERACTIVE: Final Professional Challenge
      {
        type: 'proScenario',
        id: 'final-professional-scenarios',
        title: '👑 The Professional Excellence Challenge',
        subtitle: 'Master these final scenarios to earn your Professional Image certification',
        scenarios: [
          {
            situation: 'A well-known local influencer sits in your chair. During the cut, they start recording a video for their social media without asking your permission. You are visible in the background and your station is identifiable.',
            context: 'Your professional image and the shop\'s reputation are at stake. How you handle this sets a precedent for all future clients.',
            options: [
              { letter: 'A', text: 'Say nothing — the exposure is good for business', feedback: '❌ Uncontrolled exposure can backfire. Your work, station, and shop are being represented without your input. What if the video goes viral for the wrong reasons?', isPremium: false },
              { letter: 'B', text: 'Politely pause and say: "I\'m happy to be part of your content, but could we quickly discuss what you\'re recording so I can make sure my station looks its best?"', feedback: '✅ Correct! Professional assertiveness protects your image while respecting the client. You are not saying no — you are saying "let\'s do this right."', isPremium: true },
              { letter: 'C', text: 'Ask them to stop recording immediately', feedback: '❌ A hard stop feels confrontational and may damage the relationship. There is a middle ground between silence and refusal.', isPremium: false },
              { letter: 'D', text: 'Make a funny face in the background to "go viral"', feedback: '❌ Unprofessional behavior in someone else\'s content reflects poorly on you. Your brand is not a joke.', isPremium: false },
            ],
            correctAnswer: 'B',
            proTip: 'Elite professionals control their narrative. When others represent you, ensure it aligns with your standards — graciously but firmly.',
          },
          {
            situation: 'You overhear a coworker making inappropriate comments about a client\'s appearance after they left. Other coworkers are laughing. The client is a regular who tips well.',
            context: 'Workplace culture is shaped by what is tolerated, not just what is said. Your response matters.',
            options: [
              { letter: 'A', text: 'Laugh along — it is just shop banter', feedback: '❌ Tolerance becomes complicity. Every time you laugh, you signal that disrespect is acceptable in your shop.', isPremium: false },
              { letter: 'B', text: 'Stay silent but feel uncomfortable', feedback: '❌ Silence implies consent. Your discomfort is a signal that your professional standards are being violated.', isPremium: false },
              { letter: 'C', text: 'Say: "That is not how we talk about clients here. They trust us."', feedback: '✅ Correct! Courageous professionalism sets the standard. One person speaking up shifts the culture. Clients deserve your respect even when they cannot hear it.', isPremium: true },
              { letter: 'D', text: 'Report it to the owner later', feedback: '❌ Reporting is appropriate for repeated violations, but addressing it in the moment is more effective and shows leadership.', isPremium: false },
            ],
            correctAnswer: 'C',
            proTip: 'Luxury service culture is built on respect — for clients, for coworkers, and for yourself. Never compromise on this.',
          },
        ],
      },
    ],
  },
  'ch-4': chapter4PremiumContent,
  'ch-5': chapter5PremiumContent,
  'ch-6': chapter6PremiumContent,
  'ch-7': chapter7PremiumContent,
  'ch-8': chapter8PremiumContent,
  'ch-9': chapter9PremiumContent,
  'ch-10': chapter10PremiumContent,
  'ch-11': chapter11PremiumContent,
  'ch-12': chapter12PremiumContent,
  'ch-13': chapter13PremiumContent,
  'ch-14': chapter14PremiumContent,
  'ch-15': chapter15PremiumContent,
  'ch-16': chapter16PremiumContent,
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
