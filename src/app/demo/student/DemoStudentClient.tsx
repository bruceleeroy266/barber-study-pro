'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Brain,
  ChevronRight,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Layers,
  Award,
  Menu,
  X,
  Maximize2,
  Minimize2,
  Presentation,
  Contrast,
  RotateCcw,
  Play,
  RotateCw,
  Lightbulb,
  AlertCircle,
  ChevronLeft,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Logo } from '@/components/brand'
import { Card, Button, Badge } from '@/components/ui'
import { getPrimaryDemoStudent, DEMO_TOPICS } from '@/lib/demo-environment-data'
import type { DemoStudentProfile } from '@/lib/demo-environment-data'

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────

type ViewMode = 'dashboard' | 'chapter' | 'quiz' | 'results' | 'study' | 'flashcards'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  topicId: string
  concept: string
}

interface QuizResult {
  questionId: string
  selectedIndex: number
  correct: boolean
  topicId: string
  concept: string
}

interface Flashcard {
  id: string
  front: string
  back: string
  category: string
}

// ───────────────────────────────────────────────
// Chapter 10 Quiz Questions — Scalp Disorders Focus
// ───────────────────────────────────────────────

const CHAPTER_10_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which type of alopecia is characterized by sudden patchy hair loss and is considered an autoimmune disorder?',
    options: [
      'Androgenic alopecia',
      'Alopecia areata',
      'Traction alopecia',
      'Postpartum alopecia',
    ],
    correctIndex: 1,
    explanation: 'Alopecia areata is an autoimmune disorder where the immune system attacks hair follicles, causing sudden patchy hair loss. It is one of the most frequently tested conditions on barber board exams.',
    topicId: 'scalp-disorders',
    concept: 'Alopecia Areata',
  },
  {
    id: 'q2',
    question: 'What is tinea capitis and why is it critical for barbers to recognize?',
    options: [
      'A bacterial infection requiring antibiotics',
      'A contagious fungal infection of the scalp (ringworm)',
      'A non-contagious form of dandruff',
      'Normal hair shedding in children',
    ],
    correctIndex: 1,
    explanation: 'Tinea capitis is a contagious fungal infection of the scalp (ringworm). Barbers must recognize it to refuse service and prevent spreading it to other clients.',
    topicId: 'scalp-disorders',
    concept: 'Tinea Capitis',
  },
  {
    id: 'q3',
    question: 'What is the difference between a furuncle and a carbuncle?',
    options: [
      'A furuncle is fungal; a carbuncle is bacterial',
      'A furuncle affects one follicle; a carbuncle involves multiple follicles',
      'A furuncle is painless; a carbuncle is painful',
      'There is no difference — they are the same condition',
    ],
    correctIndex: 1,
    explanation: 'A furuncle (boil) is an acute bacterial infection of a single hair follicle. A carbuncle is a larger, deep-seated infection involving multiple follicles. Both require medical referral.',
    topicId: 'scalp-disorders',
    concept: 'Furuncles and Carbuncles',
  },
  {
    id: 'q4',
    question: 'Which condition is characterized by an acute bacterial infection of a hair follicle that produces constant pain and a pustule?',
    options: [
      'Tinea capitis',
      'Pityriasis capitis simplex',
      'Furuncle',
      'Alopecia areata',
    ],
    correctIndex: 2,
    explanation: 'A furuncle (boil) is an acute bacterial infection of a hair follicle that produces constant pain and a pustule. Barbers must refer clients because it is contagious and requires medical treatment.',
    topicId: 'scalp-disorders',
    concept: 'Furuncle Identification',
  },
  {
    id: 'q5',
    question: 'What is pediculosis capitis?',
    options: [
      'A fungal infection of the scalp',
      'Head lice infestation',
      'Excessive dandruff production',
      'Hair loss from chemical damage',
    ],
    correctIndex: 1,
    explanation: 'Pediculosis capitis is head lice infestation. It is highly contagious and requires immediate referral. Barbers must not perform services on clients with lice.',
    topicId: 'scalp-disorders',
    concept: 'Pediculosis Capitis',
  },
]

// ───────────────────────────────────────────────
// Chapter 15 Demo Content — Men's Hair Replacement
// ───────────────────────────────────────────────

const CHAPTER_15_STUDY_CONTENT = {
  title: "Men's Hair Replacement",
  chapterNumber: 15,
  learningObjectives: [
    'Identify different types of hair replacement systems',
    'Understand proper fitting and attachment techniques',
    'Learn client consultation skills for hair loss solutions',
    'Recognize maintenance and care requirements for hair systems',
  ],
  sections: [
    {
      title: 'Introduction to Hair Replacement',
      content: 'Hair replacement systems offer non-surgical solutions for clients experiencing hair loss. Modern systems use natural human hair or high-quality synthetic fibers attached to a base that blends with the client\'s natural hair and scalp.',
    },
    {
      title: 'Types of Hair Systems',
      content: 'Common types include full cap systems, partial systems (toupees), and integration systems. Each type serves different patterns of hair loss and client preferences. Understanding the differences helps barbers recommend appropriate solutions.',
    },
    {
      title: 'Client Consultation',
      content: 'Successful hair replacement begins with thorough consultation. Assess the client\'s hair loss pattern, lifestyle, maintenance preferences, and budget. Discuss realistic expectations and commitment requirements.',
    },
  ],
}

const CHAPTER_15_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc1',
    front: 'What is a full cap hair system?',
    back: 'A full cap hair system covers the entire scalp, used for clients with extensive hair loss or complete baldness. It provides full coverage and is attached using adhesives or clips.',
    category: 'Hair Systems',
  },
  {
    id: 'fc2',
    front: 'What is the difference between a toupee and a full cap system?',
    back: 'A toupee (partial system) covers only the top or crown area where hair loss is most visible, blending with existing hair. A full cap covers the entire scalp.',
    category: 'Hair Systems',
  },
  {
    id: 'fc3',
    front: 'What are the main attachment methods for hair systems?',
    back: 'The main attachment methods are: 1) Adhesive tapes and glues, 2) Clips and combs, 3) Weaving or integration with natural hair, and 4) Vacuum seal systems.',
    category: 'Attachment',
  },
  {
    id: 'fc4',
    front: 'Why is client consultation important before hair replacement?',
    back: 'Consultation ensures the client understands maintenance requirements, costs, and realistic outcomes. It helps match the right system type to their lifestyle, hair loss pattern, and commitment level.',
    category: 'Consultation',
  },
  {
    id: 'fc5',
    front: 'How often should hair systems typically be maintained?',
    back: 'Most hair systems require professional maintenance every 2-4 weeks. Daily care includes gentle brushing, proper cleaning, and avoiding excessive heat or chemicals.',
    category: 'Maintenance',
  },
]

const CHAPTER_15_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'ch15-q1',
    question: 'What is the primary purpose of a client consultation before hair replacement?',
    options: [
      'To sell the most expensive system',
      'To assess hair loss pattern and match appropriate solutions',
      'To schedule the first appointment',
      'To collect payment information',
    ],
    correctIndex: 1,
    explanation: 'Client consultation assesses the hair loss pattern, lifestyle, and preferences to recommend the most appropriate hair replacement solution.',
    topicId: 'hair-replacement',
    concept: 'Client Consultation',
  },
  {
    id: 'ch15-q2',
    question: 'Which attachment method uses adhesives to secure the hair system?',
    options: [
      'Clip-in attachment',
      'Tape and glue attachment',
      'Weaving attachment',
      'Vacuum seal attachment',
    ],
    correctIndex: 1,
    explanation: 'Tape and glue attachment uses medical-grade adhesives to bond the hair system base directly to the scalp for a secure, natural look.',
    topicId: 'hair-replacement',
    concept: 'Attachment Methods',
  },
  {
    id: 'ch15-q3',
    question: 'What is the typical professional maintenance schedule for hair systems?',
    options: [
      'Every 6 months',
      'Every 2-4 weeks',
      'Once a year',
      'Only when damaged',
    ],
    correctIndex: 1,
    explanation: 'Hair systems typically require professional maintenance every 2-4 weeks to ensure proper fit, cleanliness, and appearance.',
    topicId: 'hair-replacement',
    concept: 'Maintenance Schedule',
  },
]

// ───────────────────────────────────────────────
// Helper Functions
// ───────────────────────────────────────────────

function getTopicName(topicId: string): string {
  const topic = DEMO_TOPICS.find((t) => t.id === topicId)
  return topic?.name || topicId
}

function getTopicScore(student: DemoStudentProfile, topicId: string): number {
  const mastery = student.topicMastery.find((t) => t.topicId === topicId)
  return mastery?.score || 0
}

// ───────────────────────────────────────────────
// Sub-Components
// ───────────────────────────────────────────────

function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  variant = 'default',
}: {
  label: string
  value: string | number
  subtext?: string
  icon: React.ElementType
  trend?: 'improving' | 'stable' | 'declining'
  variant?: 'default' | 'success' | 'warning'
}) {
  const variantStyles = {
    default: 'text-[var(--color-brand-gold)]',
    success: 'text-gold',
    warning: 'text-warm-bronze',
  }

  return (
    <Card variant="default" padding="md" className="bg-[var(--color-brand-black)] border-white/10">
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-3xl font-bold ${variantStyles[variant]}`}>{value}</div>
          <div className="text-sm text-silver mt-1">{label}</div>
          {subtext && <div className="text-xs text-silver-gray mt-1">{subtext}</div>}
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp className={`w-3 h-3 ${trend === 'improving' ? 'text-gold' : 'text-silver'}`} />
              <span className={trend === 'improving' ? 'text-gold' : 'text-silver'}>
                {trend.charAt(0).toUpperCase() + trend.slice(1)}
              </span>
            </div>
          )}
        </div>
        <div className={`${variantStyles[variant]} opacity-50`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  )
}

function TopicProgressBar({
  name,
  score,
  isPrimaryGap = false,
}: {
  name: string
  score: number
  isPrimaryGap?: boolean
}) {
  const barColor = score >= 80 ? 'bg-gold' : score >= 70 ? 'bg-warm-bronze' : 'bg-silver'
  
  return (
    <div className={`p-4 rounded-lg border ${isPrimaryGap ? 'border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/5' : 'border-white/10 bg-white/5'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white font-medium">{name}</span>
        <span className={`text-lg font-bold ${score >= 80 ? 'text-gold' : score >= 70 ? 'text-warm-bronze' : 'text-silver'}`}>
          {score}%
        </span>
      </div>
      <div className="w-full bg-graphite rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      {isPrimaryGap && (
        <p className="text-xs text-[var(--color-brand-gold)] mt-2">
          Recommended focus area
        </p>
      )}
    </div>
  )
}

// ───────────────────────────────────────────────
// Main Component
// ───────────────────────────────────────────────

export default function DemoStudentClient() {
  const student = getPrimaryDemoStudent()
  
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  
  // Chapter 15 demo state
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false)
  const [chapter15QuizMode, setChapter15QuizMode] = useState(false)
  
  // Presentation mode state
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Get primary learning gap info
  const primaryGapTopic = student.primaryLearningGap ? getTopicName(student.primaryLearningGap) : null
  const primaryGapScore = student.primaryLearningGap ? getTopicScore(student, student.primaryLearningGap) : 0

  // Get current quiz questions based on mode
  const currentQuizQuestions = chapter15QuizMode ? CHAPTER_15_QUIZ_QUESTIONS : CHAPTER_10_QUIZ_QUESTIONS
  const currentQuizTitle = chapter15QuizMode ? 'Chapter 15 Quiz' : 'Chapter 10 Review'
  const currentQuizSubtitle = chapter15QuizMode ? "Men's Hair Replacement" : 'Scalp Disorders & Infections'

  // Quiz handlers
  const startQuiz = useCallback((isChapter15 = false) => {
    setChapter15QuizMode(isChapter15)
    setViewMode('quiz')
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setQuizResults([])
  }, [])

  const handleAnswerSelect = useCallback((index: number) => {
    if (showExplanation) return
    setSelectedAnswer(index)
  }, [showExplanation])

  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswer === null) return
    
    const question = currentQuizQuestions[currentQuestionIndex]
    const isCorrect = selectedAnswer === question.correctIndex
    
    setQuizResults((prev) => [
      ...prev,
      {
        questionId: question.id,
        selectedIndex: selectedAnswer,
        correct: isCorrect,
        topicId: question.topicId,
        concept: question.concept,
      },
    ])
    setShowExplanation(true)
  }, [selectedAnswer, currentQuestionIndex, currentQuizQuestions])

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < currentQuizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setViewMode('results')
    }
  }, [currentQuestionIndex, currentQuizQuestions.length])

  const resetQuiz = useCallback(() => {
    setViewMode('dashboard')
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setQuizResults([])
    setChapter15QuizMode(false)
  }, [])

  // Flashcard handlers
  const nextFlashcard = useCallback(() => {
    if (currentFlashcardIndex < CHAPTER_15_FLASHCARDS.length - 1) {
      setCurrentFlashcardIndex((prev) => prev + 1)
      setShowFlashcardAnswer(false)
    }
  }, [currentFlashcardIndex])

  const prevFlashcard = useCallback(() => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex((prev) => prev - 1)
      setShowFlashcardAnswer(false)
    }
  }, [currentFlashcardIndex])

  // Presentation mode handlers
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }, [])

  const resetDemo = useCallback(() => {
    resetQuiz()
    setViewMode('dashboard')
    setCurrentFlashcardIndex(0)
    setShowFlashcardAnswer(false)
  }, [resetQuiz])

  // Keyboard navigation for presentation mode
  useEffect(() => {
    if (!isPresentationMode) return

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          if (viewMode === 'quiz' && !showExplanation && selectedAnswer !== null) {
            handleSubmitAnswer()
          } else if (viewMode === 'quiz' && showExplanation) {
            handleNextQuestion()
          } else if (viewMode === 'flashcards') {
            if (!showFlashcardAnswer) {
              setShowFlashcardAnswer(true)
            } else {
              nextFlashcard()
            }
          }
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (viewMode === 'quiz' && currentQuestionIndex > 0 && !showExplanation) {
            setCurrentQuestionIndex((prev) => prev - 1)
            setSelectedAnswer(null)
          } else if (viewMode === 'flashcards') {
            prevFlashcard()
          }
          break
        case 'f':
        case 'F':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'h':
        case 'H':
          e.preventDefault()
          setHighContrast((v) => !v)
          break
        case 'r':
        case 'R':
          e.preventDefault()
          resetDemo()
          break
        case 'Escape':
          e.preventDefault()
          setIsPresentationMode(false)
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {})
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPresentationMode, viewMode, showExplanation, selectedAnswer, currentQuestionIndex, showFlashcardAnswer, handleSubmitAnswer, handleNextQuestion, nextFlashcard, prevFlashcard, toggleFullscreen, resetDemo])

  // Listen for fullscreen changes
  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Calculate quiz score
  const correctAnswers = quizResults.filter((r) => r.correct).length
  const quizScore = quizResults.length > 0 ? Math.round((correctAnswers / quizResults.length) * 100) : 0

  // Get missed concepts for recommendations
  const missedConcepts = quizResults
    .filter((r) => !r.correct)
    .map((r) => r.concept)
    .filter((value, index, self) => self.indexOf(value) === index)

  // ───────────────────────────────────────────────
  // Render: Dashboard View
  // ───────────────────────────────────────────────

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome back, {student.name.split(' ')[0]}
          </h1>
          <p className="text-silver mt-1">{student.program} Program</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-silver">
          <Clock className="w-4 h-4" />
          <span>Last active: Today</span>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Overall Progress"
          value={`${student.overallProgress}%`}
          subtext={`${student.chaptersCompleted} of ${student.totalChapters} chapters`}
          icon={BookOpen}
        />
        <MetricCard
          label="Quiz Average"
          value={`${student.avgQuizScore}%`}
          subtext={`${student.quizzesTaken} quizzes taken`}
          icon={Target}
        />
        <MetricCard
          label="Board Readiness"
          value={student.readinessScore}
          subtext={student.readinessLevel}
          icon={Brain}
          trend={student.readinessTrend}
          variant={student.readinessScore >= 80 ? 'success' : 'default'}
        />
        <MetricCard
          label="Current Chapter"
          value={student.currentChapter}
          subtext="Men's Hair Replacement"
          icon={GraduationCap}
        />
      </div>

      {/* Continue Learning CTA */}
      <Card variant="default" padding="lg" className="bg-gradient-to-r from-[var(--color-brand-gold)]/10 to-transparent border-[var(--color-brand-gold)]/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Continue Learning</h2>
            <p className="text-silver">
              Chapter {student.currentChapter} — Men&apos;s Hair Replacement
            </p>
          </div>
          <Button
            onClick={() => setViewMode('chapter')}
            className="bg-[var(--color-brand-gold)] text-[var(--color-background-primary)] hover:bg-[var(--color-brand-gold-light)] font-bold px-6 py-3 text-lg"
          >
            Continue Chapter
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Card>

      {/* Two Column Layout: Weak Areas + Strong Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Areas to Improve */}
        <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-[var(--color-brand-gold)]" />
            <h2 className="text-lg font-bold text-white">Areas to Improve</h2>
          </div>
          <p className="text-sm text-silver mb-4">
            Focusing on these areas can help strengthen your licensing exam readiness.
          </p>
          <div className="space-y-3">
            {student.weakAreas.map((topicId) => (
              <TopicProgressBar
                key={topicId}
                name={getTopicName(topicId)}
                score={getTopicScore(student, topicId)}
                isPrimaryGap={topicId === student.primaryLearningGap}
              />
            ))}
          </div>
          
          {/* Study Recommendation */}
          {primaryGapTopic && (
            <div className="mt-6 p-4 bg-[var(--color-brand-gold)]/10 border border-[var(--color-brand-gold)]/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-[var(--color-brand-gold)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Recommended Study</h3>
                  <p className="text-sm text-silver mb-3">
                    Review {primaryGapTopic} to improve your understanding of contagious conditions and board exam readiness.
                  </p>
                  <Button
                    onClick={() => startQuiz(false)}
                    variant="outline"
                    className="border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Review
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Strong Areas */}
        <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-gold" />
            <h2 className="text-lg font-bold text-white">Strong Areas</h2>
          </div>
          <p className="text-sm text-silver mb-4">
            You&apos;ve demonstrated solid understanding in these topics.
          </p>
          <div className="space-y-3">
            {student.strongAreas.map((topicId) => (
              <TopicProgressBar
                key={topicId}
                name={getTopicName(topicId)}
                score={getTopicScore(student, topicId)}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-silver" />
          <h2 className="text-lg font-bold text-white">Recent Activity</h2>
        </div>
        <div className="space-y-3">
          {student.recentActivity.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'quiz' ? 'bg-gold' :
                activity.type === 'flashcard' ? 'bg-[var(--color-brand-gold)]' :
                'bg-silver'
              }`} />
              <span className="text-silver flex-1">{activity.description}</span>
              <span className="text-xs text-silver-gray">
                {new Date(activity.timestamp).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  // ───────────────────────────────────────────────
  // Render: Chapter View
  // ───────────────────────────────────────────────

  const renderChapter = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setViewMode('dashboard')}
          variant="ghost"
          className="text-silver hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-brand-gold)]/10 border border-[var(--color-brand-gold)]/20 rounded-full text-[var(--color-brand-gold)] text-sm font-medium mb-6">
          <BookOpen className="w-4 h-4" />
          Chapter {student.currentChapter}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Men&apos;s Hair Replacement
        </h1>
        <p className="text-xl text-silver mb-8">
          Learn about hair replacement systems, fitting techniques, and client consultation for hair loss solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Study Material Card */}
        <button
          onClick={() => setViewMode('study')}
          className="text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)] rounded-xl transition-transform hover:scale-[1.02]"
        >
          <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10 text-center h-full cursor-pointer hover:border-[var(--color-brand-gold)]/50 transition-colors">
            <BookOpen className="w-10 h-10 text-[var(--color-brand-gold)] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Study Material</h3>
            <p className="text-sm text-silver mb-4">
              Review chapter content and learning objectives
            </p>
            <Badge variant="gold" className="border-[var(--color-brand-gold)]/30 text-[var(--color-brand-gold)]">
              Demo Available
            </Badge>
          </Card>
        </button>

        {/* Flashcards Card */}
        <button
          onClick={() => setViewMode('flashcards')}
          className="text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)] rounded-xl transition-transform hover:scale-[1.02]"
        >
          <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10 text-center h-full cursor-pointer hover:border-[var(--color-brand-gold)]/50 transition-colors">
            <Layers className="w-10 h-10 text-[var(--color-brand-gold)] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Flashcards</h3>
            <p className="text-sm text-silver mb-4">
              Practice key terms and concepts
            </p>
            <Badge variant="gold" className="border-[var(--color-brand-gold)]/30 text-[var(--color-brand-gold)]">
              {CHAPTER_15_FLASHCARDS.length} Demo Cards
            </Badge>
          </Card>
        </button>

        {/* Chapter Quiz Card */}
        <button
          onClick={() => startQuiz(true)}
          className="text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)] rounded-xl transition-transform hover:scale-[1.02]"
        >
          <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10 text-center h-full cursor-pointer hover:border-[var(--color-brand-gold)]/50 transition-colors">
            <Target className="w-10 h-10 text-[var(--color-brand-gold)] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Chapter Quiz</h3>
            <p className="text-sm text-silver mb-4">
              Test your understanding
            </p>
            <Badge variant="gold" className="border-[var(--color-brand-gold)]/30 text-[var(--color-brand-gold)]">
              {CHAPTER_15_QUIZ_QUESTIONS.length} Demo Questions
            </Badge>
          </Card>
        </button>
      </div>

      <div className="text-center">
        <Button
          onClick={() => setViewMode('dashboard')}
          variant="outline"
          className="border-white/20 text-silver hover:bg-white/5"
        >
          Continue Later
        </Button>
      </div>
    </div>
  )

  // ───────────────────────────────────────────────
  // Render: Study Material View
  // ───────────────────────────────────────────────

  const renderStudy = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setViewMode('chapter')}
          variant="ghost"
          className="text-silver hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Chapter
        </Button>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-brand-gold)]/10 border border-[var(--color-brand-gold)]/20 rounded-full text-[var(--color-brand-gold)] text-sm font-medium mb-6">
          <BookOpen className="w-4 h-4" />
          Chapter {CHAPTER_15_STUDY_CONTENT.chapterNumber} Study Material
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          {CHAPTER_15_STUDY_CONTENT.title}
        </h1>
      </div>

      {/* Learning Objectives */}
      <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-[var(--color-brand-gold)]" />
          Learning Objectives
        </h2>
        <ul className="space-y-3">
          {CHAPTER_15_STUDY_CONTENT.learningObjectives.map((objective, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[var(--color-brand-gold)] shrink-0 mt-0.5" />
              <span className="text-silver">{objective}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Study Content */}
      {CHAPTER_15_STUDY_CONTENT.sections.map((section, index) => (
        <Card key={index} variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
          <h3 className="text-lg font-bold text-white mb-3">{section.title}</h3>
          <p className="text-silver leading-relaxed">{section.content}</p>
        </Card>
      ))}

      {/* Demo Notice */}
      <Card variant="default" padding="md" className="bg-[var(--color-brand-gold)]/5 border-[var(--color-brand-gold)]/20">
        <p className="text-sm text-silver text-center">
          This is a demonstration preview. The full chapter includes additional sections, interactive elements, and comprehensive study materials.
        </p>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => setViewMode('chapter')}
          variant="outline"
          className="border-white/20 text-silver hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Chapter
        </Button>
        <Button
          onClick={() => setViewMode('flashcards')}
          className="bg-[var(--color-brand-gold)] text-[var(--color-background-primary)] hover:bg-[var(--color-brand-gold-light)]"
        >
          <Layers className="w-4 h-4 mr-2" />
          Try Flashcards
        </Button>
      </div>
    </div>
  )

  // ───────────────────────────────────────────────
  // Render: Flashcards View
  // ───────────────────────────────────────────────

  const renderFlashcards = () => {
    const currentCard = CHAPTER_15_FLASHCARDS[currentFlashcardIndex]
    const progress = ((currentFlashcardIndex + 1) / CHAPTER_15_FLASHCARDS.length) * 100

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setViewMode('chapter')}
            variant="ghost"
            className="text-silver hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chapter
          </Button>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-brand-gold)]/10 border border-[var(--color-brand-gold)]/20 rounded-full text-[var(--color-brand-gold)] text-sm font-medium mb-4">
            <Layers className="w-4 h-4" />
            Chapter 15 Flashcards
          </div>
          <p className="text-silver">
            Card {currentFlashcardIndex + 1} of {CHAPTER_15_FLASHCARDS.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-graphite rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-[var(--color-brand-gold)] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Flashcard */}
        <Card 
          variant="default" 
          padding="lg" 
          className="bg-[var(--color-brand-black)] border-white/10 min-h-[300px] flex flex-col cursor-pointer"
          onClick={() => setShowFlashcardAnswer(!showFlashcardAnswer)}
        >
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <Badge variant="default" className="mb-4 border-silver/30 text-silver">
              {currentCard.category}
            </Badge>
            
            {!showFlashcardAnswer ? (
              <>
                <p className="text-sm text-silver-gray mb-2">Question</p>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {currentCard.front}
                </h3>
                <p className="text-sm text-silver-gray mt-6 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Click to reveal answer
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-silver-gray mb-2">Answer</p>
                <p className="text-lg text-silver leading-relaxed">
                  {currentCard.back}
                </p>
                <p className="text-sm text-silver-gray mt-6 flex items-center gap-2">
                  <EyeOff className="w-4 h-4" />
                  Click to hide answer
                </p>
              </>
            )}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={prevFlashcard}
            disabled={currentFlashcardIndex === 0}
            variant="outline"
            className="border-white/20 text-silver hover:bg-white/5 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={() => setShowFlashcardAnswer(!showFlashcardAnswer)}
            className="bg-[var(--color-brand-gold)] text-[var(--color-background-primary)] hover:bg-[var(--color-brand-gold-light)]"
          >
            {showFlashcardAnswer ? 'Hide Answer' : 'Show Answer'}
          </Button>
          
          <Button
            onClick={nextFlashcard}
            disabled={currentFlashcardIndex === CHAPTER_15_FLASHCARDS.length - 1}
            variant="outline"
            className="border-white/20 text-silver hover:bg-white/5 disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Demo Notice */}
        <p className="text-center text-sm text-silver-gray">
          Demo deck with {CHAPTER_15_FLASHCARDS.length} representative cards. Full chapter includes complete flashcard set.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <Button
            onClick={() => setViewMode('chapter')}
            variant="outline"
            className="border-white/20 text-silver hover:bg-white/5"
          >
            Back to Chapter
          </Button>
          <Button
            onClick={() => startQuiz(true)}
            className="bg-[var(--color-brand-gold)] text-[var(--color-background-primary)] hover:bg-[var(--color-brand-gold-light)]"
          >
            <Target className="w-4 h-4 mr-2" />
            Take Quiz
          </Button>
        </div>
      </div>
    )
  }

  // ───────────────────────────────────────────────
  // Render: Quiz View
  // ───────────────────────────────────────────────

  const renderQuiz = () => {
    const question = currentQuizQuestions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / currentQuizQuestions.length) * 100

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Quiz Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{currentQuizTitle}</h2>
            <p className="text-sm text-silver">{currentQuizSubtitle}</p>
          </div>
          <div className="text-sm text-silver">
            Question {currentQuestionIndex + 1} of {currentQuizQuestions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-graphite rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-[var(--color-brand-gold)] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === question.correctIndex
              const showResult = showExplanation
              
              let buttonClass = 'w-full text-left p-4 rounded-lg border transition-all '
              if (showResult) {
                if (isCorrect) {
                  buttonClass += 'border-gold bg-gold/10 text-white'
                } else if (isSelected && !isCorrect) {
                  buttonClass += 'border-silver bg-silver/10 text-silver'
                } else {
                  buttonClass += 'border-white/10 bg-white/5 text-silver'
                }
              } else {
                if (isSelected) {
                  buttonClass += 'border-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10 text-white'
                } else {
                  buttonClass += 'border-white/10 bg-white/5 text-silver hover:border-white/20 hover:bg-white/10'
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      showResult && isCorrect ? 'bg-gold text-black' :
                      showResult && isSelected && !isCorrect ? 'bg-silver text-black' :
                      isSelected ? 'bg-[var(--color-brand-gold)] text-black' :
                      'bg-white/10 text-silver'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showResult && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-gold" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`mt-6 p-4 rounded-lg ${
              selectedAnswer === question.correctIndex
                ? 'bg-gold/10 border border-gold/30'
                : 'bg-silver/10 border border-silver/30'
            }`}>
              <div className="flex items-start gap-3">
                {selectedAnswer === question.correctIndex ? (
                  <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-silver shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-semibold mb-1 ${
                    selectedAnswer === question.correctIndex ? 'text-gold' : 'text-silver'
                  }`}>
                    {selectedAnswer === question.correctIndex ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p className="text-silver text-sm">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            {!showExplanation ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="bg-[var(--color-brand-gold)] text-[var(--color-background-primary)] hover:bg-[var(--color-brand-gold-light)] disabled:opacity-50"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-[var(--color-brand-gold)] text-[var(--color-background-primary)] hover:bg-[var(--color-brand-gold-light)]"
              >
                {currentQuestionIndex < currentQuizQuestions.length - 1 ? 'Next Question' : 'See Results'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    )
  }

  // ───────────────────────────────────────────────
  // Render: Results View
  // ───────────────────────────────────────────────

  const renderResults = () => {
    const percentage = quizScore
    const isStrongPerformance = percentage >= 80
    const topicName = chapter15QuizMode ? "Men's Hair Replacement" : 'Scalp Disorders & Infections'
    const historicalScore = chapter15QuizMode ? 0 : primaryGapScore // Chapter 15 has no historical score

    return (
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Score Card */}
        <Card variant="default" padding="lg" className={`text-center ${
          isStrongPerformance ? 'bg-gold/10 border-gold/30' : 'bg-[var(--color-brand-black)] border-white/10'
        }`}>
          <div className={`text-6xl font-bold mb-2 ${isStrongPerformance ? 'text-gold' : 'text-white'}`}>
            {percentage}%
          </div>
          <p className="text-xl text-silver mb-4">
            {correctAnswers} of {quizResults.length} correct
          </p>
          <Badge
            variant={isStrongPerformance ? 'gold' : 'default'}
            className={isStrongPerformance ? 'bg-gold text-black' : 'border-silver text-silver'}
          >
            {isStrongPerformance ? 'Review Passed' : 'Additional Review Recommended'}
          </Badge>
        </Card>

        {/* Historical vs Current Performance (for Chapter 10 only) */}
        {!chapter15QuizMode && historicalScore > 0 && (
          <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 text-center">Performance Comparison</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-silver mb-1">Topic Performance</p>
                <p className="text-3xl font-bold text-silver">{historicalScore}%</p>
                <p className="text-xs text-silver-gray mt-1">Historical Mastery</p>
              </div>
              <div className="text-center p-4 bg-[var(--color-brand-gold)]/10 rounded-lg border border-[var(--color-brand-gold)]/30">
                <p className="text-sm text-silver mb-1">Today&apos;s Review</p>
                <p className="text-3xl font-bold text-[var(--color-brand-gold)]">{percentage}%</p>
                <p className="text-xs text-[var(--color-brand-gold)] mt-1 flex items-center justify-center gap-1">
                  {percentage > historicalScore ? (
                    <>
                      <TrendingUp className="w-3 h-3" />
                      Improving
                    </>
                  ) : (
                    'Session Result'
                  )}
                </p>
              </div>
            </div>
            {isStrongPerformance && percentage > historicalScore && (
              <div className="mt-4 p-4 bg-[var(--color-brand-gold)]/5 rounded-lg border border-[var(--color-brand-gold)]/20">
                <p className="text-center text-silver">
                  <span className="font-semibold text-white">You&apos;re improving in {topicName}.</span>{' '}
                  Your recent performance shows improvement. Based on your previous activity, this remains a recommended focus area as you continue building exam readiness.
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Missed Concepts Recommendations */}
        {missedConcepts.length > 0 && (
          <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-brand-gold)]/20 flex items-center justify-center shrink-0">
                <Lightbulb className="w-6 h-6 text-[var(--color-brand-gold)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">
                  Recommended Next Steps
                </h3>
                <p className="text-silver mb-4">
                  Focus on these concepts to strengthen your understanding:
                </p>
                <div className="space-y-3">
                  {missedConcepts.map((concept, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="font-semibold text-white">Review: {concept}</p>
                      <p className="text-sm text-silver mt-1">
                        {chapter15QuizMode 
                          ? 'This concept is covered in Chapter 15 study materials.'
                          : 'This concept is covered in Chapter 10 curriculum content.'}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Button
                    onClick={() => startQuiz(chapter15QuizMode)}
                    variant="outline"
                    className="border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10"
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    Retake Review
                  </Button>
                  <Button
                    onClick={() => setViewMode(chapter15QuizMode ? 'study' : 'chapter')}
                    className="bg-[var(--color-brand-gold)] text-[var(--color-background-primary)] hover:bg-[var(--color-brand-gold-light)]"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {chapter15QuizMode ? 'Study Chapter 15' : 'Study Chapter 10'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Question Breakdown */}
        <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">Question Breakdown</h3>
          <div className="space-y-3">
            {quizResults.map((result, index) => {
              const question = currentQuizQuestions.find((q) => q.id === result.questionId)
              return (
                <div
                  key={result.questionId}
                  className={`p-4 rounded-lg border ${
                    result.correct
                      ? 'border-gold/30 bg-gold/5'
                      : 'border-silver/30 bg-silver/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      result.correct ? 'bg-gold text-black' : 'bg-silver text-black'
                    }`}>
                      {result.correct ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-medium">
                          Question {index + 1}
                        </p>
                        {!result.correct && (
                          <Badge variant="default" className="border-[var(--color-brand-gold)]/30 text-[var(--color-brand-gold)] text-xs">
                            Review: {result.concept}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-silver line-clamp-2">
                        {question?.question}
                      </p>
                      {!result.correct && question && (
                        <p className="text-sm text-silver-gray mt-2">
                          <span className="text-gold">Correct answer:</span> {question.options[question.correctIndex]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={resetQuiz}
            variant="outline"
            className="border-white/20 text-silver hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // ───────────────────────────────────────────────
  // Main Render
  // ───────────────────────────────────────────────

  return (
    <main className={`min-h-screen text-white ${
      highContrast ? 'bg-black' : 'bg-[var(--color-background-primary)]'
    } ${isPresentationMode ? 'presentation-mode' : ''}`}>
      {/* Presentation Mode Controls */}
      {isPresentationMode && (
        <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 bg-black/80 backdrop-blur-md rounded-xl p-3 shadow-2xl">
          <button
            onClick={() => setViewMode('dashboard')}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-white/50 text-sm px-2">
            {viewMode === 'dashboard' ? 'Dashboard' :
             viewMode === 'chapter' ? 'Chapter' :
             viewMode === 'study' ? 'Study' :
             viewMode === 'flashcards' ? `Card ${currentFlashcardIndex + 1}/${CHAPTER_15_FLASHCARDS.length}` :
             viewMode === 'quiz' ? `Q${currentQuestionIndex + 1}/${currentQuizQuestions.length}` :
             'Results'}
          </span>
          <button
            onClick={() => {
              if (viewMode === 'dashboard') setViewMode('chapter')
              else if (viewMode === 'chapter') setViewMode('study')
              else if (viewMode === 'study') setViewMode('flashcards')
              else if (viewMode === 'flashcards') {
                if (!showFlashcardAnswer) setShowFlashcardAnswer(true)
                else nextFlashcard()
              }
              else if (viewMode === 'quiz' && !showExplanation && selectedAnswer !== null) handleSubmitAnswer()
              else if (viewMode === 'quiz' && showExplanation) handleNextQuestion()
            }}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Next (→)"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <button
            onClick={toggleFullscreen}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Toggle fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setHighContrast((v) => !v)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Toggle high contrast (H)"
          >
            <Contrast className="w-5 h-5" />
          </button>
          <button
            onClick={resetDemo}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Reset demo (R)"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <button
            onClick={() => setIsPresentationMode(false)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Exit presentation (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Presentation Mode Toggle */}
      {!isPresentationMode && (
        <button
          onClick={() => setIsPresentationMode(true)}
          className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 bg-[var(--color-brand-gold)] text-white font-semibold rounded-xl shadow-lg hover:bg-[var(--color-brand-gold-light)] transition-colors"
          title="Enter presentation mode"
        >
          <Presentation className="w-5 h-5" />
          <span className="hidden sm:inline">Present</span>
        </button>
      )}

      {/* Demo Banner - Single consolidated disclosure */}
      {!isPresentationMode && (
        <div className="bg-[var(--color-brand-gold)]/10 border-b border-[var(--color-brand-gold)]/20 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <span className="text-[var(--color-brand-gold)] text-sm font-medium">
              STUDENT DEMO · Fictional Data
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      {!isPresentationMode && (
        <nav className="sticky top-0 z-50 bg-[var(--color-background-primary)]/95 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo variant="icon" theme="gold" size="sm" />
              <span className="font-semibold tracking-tight text-sm text-white">
                ASCYN PRO
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`px-3 py-1.5 text-xs transition-colors rounded-md ${
                  viewMode === 'dashboard'
                    ? 'text-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10'
                    : 'text-silver hover:text-white hover:bg-white/5'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setViewMode('chapter')}
                className={`px-3 py-1.5 text-xs transition-colors rounded-md ${
                  viewMode === 'chapter'
                    ? 'text-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10'
                    : 'text-silver hover:text-white hover:bg-white/5'
                }`}
              >
                Chapters
              </button>
              <button
                onClick={() => startQuiz(false)}
                className={`px-3 py-1.5 text-xs transition-colors rounded-md ${
                  viewMode === 'quiz' || viewMode === 'results'
                    ? 'text-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10'
                    : 'text-silver hover:text-white hover:bg-white/5'
                }`}
              >
                Review Quiz
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/demo"
                className="hidden sm:inline-flex items-center gap-1 text-xs uppercase tracking-widest text-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold-light)] transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                Demo Home
              </Link>
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileNavOpen((v) => !v)}
                className="lg:hidden p-2 rounded-md hover:bg-white/5"
                aria-label="Toggle menu"
              >
                {mobileNavOpen ? (
                  <X className="w-5 h-5 text-silver" />
                ) : (
                  <Menu className="w-5 h-5 text-silver" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile nav dropdown */}
          {mobileNavOpen && (
            <div className="lg:hidden border-t border-white/10 bg-[var(--color-background-primary)]/95 backdrop-blur-md px-4 pb-4">
              <div className="flex flex-col gap-1 pt-2">
                <button
                  onClick={() => {
                    setViewMode('dashboard')
                    setMobileNavOpen(false)
                  }}
                  className="text-left px-3 py-2.5 text-sm text-silver hover:text-white transition-colors rounded-md hover:bg-white/5"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setViewMode('chapter')
                    setMobileNavOpen(false)
                  }}
                  className="text-left px-3 py-2.5 text-sm text-silver hover:text-white transition-colors rounded-md hover:bg-white/5"
                >
                  Chapters
                </button>
                <button
                  onClick={() => {
                    startQuiz(false)
                    setMobileNavOpen(false)
                  }}
                  className="text-left px-3 py-2.5 text-sm text-silver hover:text-white transition-colors rounded-md hover:bg-white/5"
                >
                  Review Quiz
                </button>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {viewMode === 'dashboard' && renderDashboard()}
        {viewMode === 'chapter' && renderChapter()}
        {viewMode === 'study' && renderStudy()}
        {viewMode === 'flashcards' && renderFlashcards()}
        {viewMode === 'quiz' && renderQuiz()}
        {viewMode === 'results' && renderResults()}
      </div>

      {/* Footer */}
      {!isPresentationMode && (
        <footer className="border-t border-white/10 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Logo variant="horizontal" theme="dark" size="sm" />
              <p className="text-silver-gray text-sm">
                © 2026 ASCYN PRO. Built for future licensed professionals.
              </p>
            </div>
          </div>
        </footer>
      )}
    </main>
  )
}
