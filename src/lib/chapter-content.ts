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
// Chapter 2: Life Skills — Professional Growth Theme
// Navy blue / Steel blue / Amber-Gold
// ───────────────────────────────────────────────

export const chapter2Theme: ChapterTheme = {
  // Core: professional navy palette
  primary: '#4A90D9',           // Steel blue — trustworthy, professional
  primaryLight: '#7AB8E8',      // Light steel blue
  primaryDark: '#2E5A8C',       // Deep navy
  secondary: '#F5A623',         // Amber/Gold — success, achievement
  background: 'rgba(15, 30, 55, 0.85)',   // Deep navy
  backgroundAlt: 'rgba(25, 45, 75, 0.7)', // Lighter navy
  surface: '#0A1628',           // Very dark navy
  border: 'rgba(74, 144, 217, 0.25)',     // Steel blue border
  text: '#E8F0FE',              // Clean white-blue
  textMuted: '#8BA4C7',         // Soft blue-gray
  highlight: '#F5A623',         // Amber highlight
  // Timeline: professional navy feel
  timeline: {
    line: 'rgba(74, 144, 217, 0.3)',
    iconBg: '#0F1E37',
    iconBorder: '#4A90D9',
  },
  // Quote: elegant steel border
  quote: {
    border: 'rgba(74, 144, 217, 0.4)',
    icon: 'rgba(74, 144, 217, 0.3)',
    bg: 'rgba(15, 30, 55, 0.6)',
  },
  // Tabbed: corporate navy
  tabbed: {
    activeBg: 'rgba(74, 144, 217, 0.15)',
    activeBorder: 'rgba(74, 144, 217, 0.5)',
    activeText: '#7AB8E8',
    inactiveBg: 'rgba(15, 30, 55, 0.6)',
    inactiveBorder: 'rgba(74, 144, 217, 0.15)',
    inactiveText: '#8BA4C7',
    panelBg: 'rgba(15, 30, 55, 0.7)',
    panelBorder: 'rgba(74, 144, 217, 0.2)',
  },
  // Tool cards: steel and amber
  toolCard: {
    headerBg: 'rgba(245, 166, 35, 0.15)',
    headerText: '#F5A623',
    dot: 'rgba(74, 144, 217, 0.6)',
    line: 'rgba(74, 144, 217, 0.25)',
  },
  // Feature grid: professional steel
  featureGrid: {
    iconBg: 'rgba(74, 144, 217, 0.15)',
    iconColor: '#4A90D9',
    cardBorder: 'rgba(74, 144, 217, 0.2)',
  },
  // Milestones: amber accent
  milestone: {
    yearColor: '#F5A623',
    border: 'rgba(74, 144, 217, 0.2)',
  },
  // Checklist: professional
  checklist: {
    checkBorder: 'rgba(74, 144, 217, 0.4)',
    checkColor: '#4A90D9',
    bg: 'rgba(15, 30, 55, 0.6)',
  },
  // Content block: navy
  contentBlock: {
    bg: 'rgba(15, 30, 55, 0.6)',
    border: 'rgba(74, 144, 217, 0.2)',
    highlightColor: '#F5A623',
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
