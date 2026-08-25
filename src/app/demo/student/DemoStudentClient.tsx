'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
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
  Presentation,
  Play,
  RotateCw,
  Lightbulb,
  AlertCircle,
  ChevronLeft,
  Eye,
  EyeOff,
  Users,
} from 'lucide-react'
import { Logo } from '@/components/brand'
import { Card, Button, Badge } from '@/components/ui'
import { getPrimaryDemoStudent, DEMO_TOPICS } from '@/lib/demo-environment-data'
import type { DemoStudentProfile } from '@/lib/demo-environment-data'
import { DemoPresentationProvider, useDemoPresentation, PresentationControls } from '../DemoPresentationContext'

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────

type ViewMode = 'dashboard' | 'chapter' | 'quiz' | 'results' | 'study' | 'flashcards' | 'targeted-review'

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

// Targeted Review State
interface TargetedReviewState {
  topicId: string
  topicName: string
  historicalScore: number
  sessionScore: number | null
  currentQuestionIndex: number
  selectedAnswer: number | null
  showExplanation: boolean
  results: QuizResult[]
  stage: 'intro' | 'content' | 'quiz' | 'results'
}

// ───────────────────────────────────────────────
// Targeted Review Content — Scalp Disorders & Infections
// ───────────────────────────────────────────────

const TARGETED_REVIEW_CONTENT = {
  topicId: 'scalp-disorders',
  topicName: 'Scalp Disorders & Infections',
  chapterNumber: 10,
  introduction: {
    title: 'Targeted Review: Scalp Disorders & Infections',
    description: 'This focused review addresses your identified learning gap in recognizing contagious scalp conditions — a critical safety topic for the board exam.',
    historicalContext: 'Your Chapter 10 quiz showed difficulty identifying contagious scalp conditions. This review will strengthen your understanding of when to stop service and refer clients.',
  },
  keyConcepts: [
    {
      title: 'Tinea Capitis (Ringworm of the Scalp)',
      content: 'A highly contagious fungal infection causing scaly, itchy patches with hair loss. The hair often breaks off at the scalp, leaving black dots. Barbers must refuse service and refer to a physician.',
      keyPoint: 'CONTAGIOUS — Stop service immediately',
    },
    {
      title: 'Tinea Barbae (Barber\'s Itch)',
      content: 'A fungal infection of the beard area causing red, inflamed pustules around hair follicles. Often spread through contaminated razors or towels. Requires medical treatment.',
      keyPoint: 'CONTAGIOUS — Stop service immediately',
    },
    {
      title: 'Scabies',
      content: 'A parasitic infestation caused by mites burrowing under the skin. Causes intense itching, especially at night. Visible as thin, wavy lines on the skin. Highly contagious through skin-to-skin contact.',
      keyPoint: 'CONTAGIOUS — Stop service immediately',
    },
    {
      title: 'Pediculosis Capitis (Head Lice)',
      content: 'An infestation of head lice causing itching and visible nits (eggs) attached to hair shafts. Spreads through close contact and shared tools. Requires medicated treatment.',
      keyPoint: 'CONTAGIOUS — Stop service immediately',
    },
    {
      title: 'Folliculitis vs. Pseudofolliculitis',
      content: 'Folliculitis is a bacterial infection of hair follicles (pustules). Pseudofolliculitis (razor bumps) is inflammation from ingrown hairs, not infection. Only folliculitis requires referral.',
      keyPoint: 'Folliculitis: CONTAGIOUS | Pseudofolliculitis: NOT contagious',
    },
  ],
}

const TARGETED_REVIEW_QUESTIONS: QuizQuestion[] = [
  {
    id: 'tr-q1',
    question: 'Which scalp condition is characterized by scaly patches with broken hair leaving black dots, and requires immediate service refusal?',
    options: [
      'Alopecia areata',
      'Tinea capitis',
      'Pityriasis capitis simplex',
      'Pseudofolliculitis barbae',
    ],
    correctIndex: 1,
    explanation: 'Tinea capitis (ringworm of the scalp) presents as scaly patches with hair broken at the scalp level, leaving characteristic black dots. It is highly contagious and requires immediate service refusal and medical referral.',
    topicId: 'scalp-disorders',
    concept: 'Tinea Capitis Identification',
  },
  {
    id: 'tr-q2',
    question: 'What is the key difference between folliculitis and pseudofolliculitis?',
    options: [
      'Folliculitis is fungal; pseudofolliculitis is bacterial',
      'Folliculitis is a contagious infection; pseudofolliculitis is non-contagious inflammation from ingrown hairs',
      'Folliculitis only affects the scalp; pseudofolliculitis only affects the beard',
      'There is no difference — both require medical referral',
    ],
    correctIndex: 1,
    explanation: 'Folliculitis is a bacterial infection of hair follicles that is contagious and requires referral. Pseudofolliculitis (razor bumps) is inflammation from ingrown hairs and is NOT contagious — it can be managed with proper shaving technique.',
    topicId: 'scalp-disorders',
    concept: 'Folliculitis vs. Pseudofolliculitis',
  },
  {
    id: 'tr-q3',
    question: 'A client presents with intense itching and thin, wavy lines on the scalp and neck. What condition should you suspect?',
    options: [
      'Tinea barbae',
      'Scabies',
      'Furuncle',
      'Seborrheic dermatitis',
    ],
    correctIndex: 1,
    explanation: 'Scabies presents with intense itching (especially at night) and characteristic thin, wavy lines where mites have burrowed under the skin. It is highly contagious through skin-to-skin contact and requires immediate service refusal.',
    topicId: 'scalp-disorders',
    concept: 'Scabies Recognition',
  },
  {
    id: 'tr-q4',
    question: 'Which condition is commonly called "barber\'s itch" and affects the beard area with inflamed pustules?',
    options: [
      'Tinea capitis',
      'Tinea barbae',
      'Pediculosis capitis',
      'Carbuncle',
    ],
    correctIndex: 1,
    explanation: 'Tinea barbae (barber\'s itch) is a fungal infection of the beard area causing red, inflamed pustules around hair follicles. It is often spread through contaminated razors or towels and requires medical treatment.',
    topicId: 'scalp-disorders',
    concept: 'Tinea Barbae',
  },
  {
    id: 'tr-q5',
    question: 'When examining a client, you notice small white specks attached firmly to hair shafts near the scalp. What should you do?',
    options: [
      'Proceed with service — this is just dandruff',
      'Stop service immediately — this indicates pediculosis capitis (head lice)',
      'Apply medicated shampoo and continue',
      'Recommend a different hairstyle',
    ],
    correctIndex: 1,
    explanation: 'White specks (nits) firmly attached to hair shafts indicate pediculosis capitis (head lice). Unlike dandruff which brushes off easily, nits are glued to the hair. This is highly contagious and requires immediate service refusal and referral for medicated treatment.',
    topicId: 'scalp-disorders',
    concept: 'Pediculosis Capitis Protocol',
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
// Main Component (wrapped with provider)
// ───────────────────────────────────────────────

export default function DemoStudentClient() {
  return (
    <DemoPresentationProvider>
      <DemoStudentContent />
    </DemoPresentationProvider>
  )
}

// ───────────────────────────────────────────────
// Student Demo Content
// ───────────────────────────────────────────────

function DemoStudentContent() {
  const student = getPrimaryDemoStudent()
  const {
    setPerspective,
    isPresentationMode,
    setIsPresentationMode,
    toggleFullscreen,
    highContrast,
    setHighContrast,
    resetTrigger,
    setGuidedStep,
  } = useDemoPresentation()
  
  // Set perspective on mount
  useEffect(() => {
    setPerspective('student')
  }, [setPerspective])
  
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
  
  // Targeted review state
  const [targetedReview, setTargetedReview] = useState<TargetedReviewState | null>(null)
  
  // Mobile nav state
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Get primary learning gap info
  const primaryGapTopic = student.primaryLearningGap ? getTopicName(student.primaryLearningGap) : null
  const primaryGapScore = student.primaryLearningGap ? getTopicScore(student, student.primaryLearningGap) : 0

  // Get current quiz questions based on mode
  const currentQuizQuestions = useMemo(() => {
    return chapter15QuizMode ? CHAPTER_15_QUIZ_QUESTIONS : TARGETED_REVIEW_QUESTIONS
  }, [chapter15QuizMode])
  const currentQuizTitle = chapter15QuizMode ? 'Chapter 15 Quiz' : 'Targeted Review Quiz'
  const currentQuizSubtitle = chapter15QuizMode ? "Men's Hair Replacement" : 'Scalp Disorders & Infections'

  // Quiz handlers
  const startQuiz = useCallback((isChapter15 = false) => {
    setChapter15QuizMode(isChapter15)
    setViewMode('quiz')
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setQuizResults([])
  }, [setChapter15QuizMode, setViewMode, setCurrentQuestionIndex, setSelectedAnswer, setShowExplanation, setQuizResults])

  // Start targeted review for primary learning gap
  const startTargetedReview = useCallback(() => {
    if (!student.primaryLearningGap) return
    
    const gapScore = getTopicScore(student, student.primaryLearningGap)
    setTargetedReview({
      topicId: student.primaryLearningGap,
      topicName: getTopicName(student.primaryLearningGap),
      historicalScore: gapScore,
      sessionScore: null,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showExplanation: false,
      results: [],
      stage: 'intro',
    })
    setViewMode('targeted-review')
  }, [student, setTargetedReview, setViewMode])

  const handleAnswerSelect = useCallback((index: number) => {
    if (showExplanation) return
    setSelectedAnswer(index)
  }, [showExplanation, setSelectedAnswer])

  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswer === null) return
    
    const question = currentQuizQuestions[currentQuestionIndex]
    const isCorrect = selectedAnswer === question.correctIndex
    
    const result: QuizResult = {
      questionId: question.id,
      selectedIndex: selectedAnswer,
      correct: isCorrect,
      topicId: question.topicId,
      concept: question.concept,
    }
    
    if (targetedReview) {
      // Update targeted review state
      setTargetedReview(prev => prev ? {
        ...prev,
        results: [...prev.results, result],
        showExplanation: true,
      } : null)
    } else {
      setQuizResults((prev) => [...prev, result])
      setShowExplanation(true)
    }
  }, [selectedAnswer, currentQuestionIndex, currentQuizQuestions, targetedReview, setTargetedReview, setQuizResults, setShowExplanation])

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < currentQuizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      
      if (targetedReview) {
        setTargetedReview(prev => prev ? {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          selectedAnswer: null,
          showExplanation: false,
        } : null)
      }
    } else {
      // Calculate final score for targeted review
      if (targetedReview) {
        const correct = targetedReview.results.filter(r => r.correct).length
        const score = Math.round((correct / targetedReview.results.length) * 100)
        setTargetedReview(prev => prev ? {
          ...prev,
          sessionScore: score,
          stage: 'results',
        } : null)
      }
      setViewMode('results')
    }
  }, [currentQuestionIndex, currentQuizQuestions.length, targetedReview, setCurrentQuestionIndex, setSelectedAnswer, setShowExplanation, setTargetedReview, setViewMode])

  const resetQuiz = useCallback(() => {
    setViewMode('dashboard')
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setQuizResults([])
    setChapter15QuizMode(false)
    setTargetedReview(null)
  }, [setViewMode, setCurrentQuestionIndex, setSelectedAnswer, setShowExplanation, setQuizResults, setChapter15QuizMode, setTargetedReview])

  // Flashcard handlers
  const nextFlashcard = useCallback(() => {
    if (currentFlashcardIndex < CHAPTER_15_FLASHCARDS.length - 1) {
      setCurrentFlashcardIndex((prev) => prev + 1)
      setShowFlashcardAnswer(false)
    }
  }, [currentFlashcardIndex, setCurrentFlashcardIndex, setShowFlashcardAnswer])

  const prevFlashcard = useCallback(() => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex((prev) => prev - 1)
      setShowFlashcardAnswer(false)
    }
  }, [currentFlashcardIndex, setCurrentFlashcardIndex, setShowFlashcardAnswer])

  // Reset demo state
  const resetDemo = useCallback(() => {
    setViewMode('dashboard')
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setQuizResults([])
    setChapter15QuizMode(false)
    setTargetedReview(null)
    setCurrentFlashcardIndex(0)
    setShowFlashcardAnswer(false)
    setGuidedStep('Dashboard')
  }, [setGuidedStep, setViewMode, setCurrentQuestionIndex, setSelectedAnswer, setShowExplanation, setQuizResults, setChapter15QuizMode, setTargetedReview, setCurrentFlashcardIndex, setShowFlashcardAnswer])

  // Handle external reset trigger
  const prevResetTrigger = useRef(0)
  useEffect(() => {
    if (resetTrigger > prevResetTrigger.current) {
      prevResetTrigger.current = resetTrigger
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => resetDemo(), 0)
    }
  }, [resetTrigger, resetDemo])

  // Update guided step based on view mode
  useEffect(() => {
    const stepMap: Record<ViewMode, string> = {
      dashboard: 'Dashboard',
      chapter: 'Chapter',
      study: 'Study Material',
      flashcards: 'Flashcards',
      quiz: 'Review Quiz',
      results: 'Results',
      'targeted-review': 'Targeted Review',
    }
    setGuidedStep(stepMap[viewMode])
  }, [viewMode, setGuidedStep])

  // Keyboard navigation for presentation mode
  useEffect(() => {
    if (!isPresentationMode) return

    function handleKeyDown(e: KeyboardEvent) {
      // Skip if user is typing in an input, textarea, select, or editable element
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return
      }

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          if (viewMode === 'quiz' && !showExplanation && selectedAnswer !== null) {
            handleSubmitAnswer()
          } else if (viewMode === 'quiz' && showExplanation) {
            handleNextQuestion()
          } else if (viewMode === 'targeted-review' && targetedReview?.stage === 'quiz' && !targetedReview.showExplanation && targetedReview.selectedAnswer !== null) {
            handleSubmitAnswer()
          } else if (viewMode === 'targeted-review' && targetedReview?.stage === 'quiz' && targetedReview.showExplanation) {
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
          } else if (viewMode === 'targeted-review' && targetedReview && targetedReview.currentQuestionIndex > 0 && !targetedReview.showExplanation) {
            setTargetedReview(prev => prev ? {
              ...prev,
              currentQuestionIndex: prev.currentQuestionIndex - 1,
              selectedAnswer: null,
            } : null)
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
          setHighContrast(!highContrast)
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
  }, [isPresentationMode, viewMode, showExplanation, selectedAnswer, currentQuestionIndex, showFlashcardAnswer, targetedReview, handleSubmitAnswer, handleNextQuestion, nextFlashcard, prevFlashcard, toggleFullscreen, resetDemo, highContrast, setHighContrast, setIsPresentationMode])

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
                    onClick={startTargetedReview}
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
    // Guard: If no quiz questions are available, return to dashboard
    if (currentQuizQuestions.length === 0) {
      // Use setTimeout to avoid state update during render
      setTimeout(() => setViewMode('dashboard'), 0)
      return (
        <div className="max-w-3xl mx-auto text-center py-12">
          <p className="text-silver">Loading quiz...</p>
        </div>
      )
    }

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
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={resetQuiz}
            variant="outline"
            className="border-white/20 text-silver hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          {/* View Instructor Perspective — Demo Transition */}
          <Link href="/demo/instructor">
            <Button
              variant="outline"
              className="border-[var(--color-brand-gold)]/30 text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10 w-full sm:w-auto"
            >
              <Users className="w-4 h-4 mr-2" />
              View Instructor Perspective
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // ───────────────────────────────────────────────
  // Render: Targeted Review View
  // ───────────────────────────────────────────────

  const renderTargetedReview = () => {
    if (!targetedReview) return null

    // Stage: Introduction
    if (targetedReview.stage === 'intro') {
      return (
        <div className="max-w-3xl mx-auto space-y-8">
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

          <Card variant="default" padding="lg" className="bg-[var(--color-brand-gold)]/5 border-[var(--color-brand-gold)]/30">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-brand-gold)]/10 border border-[var(--color-brand-gold)]/20 rounded-full text-[var(--color-brand-gold)] text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                Targeted Review
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {TARGETED_REVIEW_CONTENT.introduction.title}
              </h1>
              <p className="text-xl text-silver mb-6">
                {TARGETED_REVIEW_CONTENT.introduction.description}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg mb-6">
                <span className="text-silver">Historical Topic Performance:</span>
                <span className="text-2xl font-bold text-warm-bronze">{targetedReview.historicalScore}%</span>
              </div>
              <p className="text-silver text-sm">
                {TARGETED_REVIEW_CONTENT.introduction.historicalContext}
              </p>
            </div>
          </Card>

          <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Key Concepts to Review</h2>
            <div className="space-y-4">
              {TARGETED_REVIEW_CONTENT.keyConcepts.map((concept, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-white">{concept.title}</h3>
                    <Badge variant="default" className="border-[var(--color-brand-gold)]/30 text-[var(--color-brand-gold)] text-xs shrink-0">
                      {concept.keyPoint}
                    </Badge>
                  </div>
                  <p className="text-sm text-silver">{concept.content}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-center">
            <Button
              onClick={() => setTargetedReview(prev => prev ? { ...prev, stage: 'quiz' } : null)}
              className="bg-[var(--color-brand-gold)] text-[var(--color-background-primary)] hover:bg-[var(--color-brand-gold-light)] font-bold px-8 py-4 text-lg"
            >
              Start Knowledge Check
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )
    }

    // Stage: Quiz
    if (targetedReview.stage === 'quiz') {
      const question = TARGETED_REVIEW_QUESTIONS[targetedReview.currentQuestionIndex]
      const showResult = targetedReview.showExplanation
      const isCorrect = targetedReview.selectedAnswer === question.correctIndex

      return (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setTargetedReview(prev => prev ? { ...prev, stage: 'intro', currentQuestionIndex: 0, selectedAnswer: null, showExplanation: false, results: [] } : null)}
              variant="ghost"
              className="text-silver hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Review
            </Button>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between text-sm text-silver">
            <span>Question {targetedReview.currentQuestionIndex + 1} of {TARGETED_REVIEW_QUESTIONS.length}</span>
            <span>{targetedReview.topicName}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-[var(--color-brand-gold)] rounded-full transition-all duration-300"
              style={{ width: `${((targetedReview.currentQuestionIndex + 1) / TARGETED_REVIEW_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = targetedReview.selectedAnswer === index
                let buttonClass = 'w-full text-left p-4 rounded-lg border transition-all '
                
                if (showResult) {
                  if (index === question.correctIndex) {
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
                    onClick={() => !showResult && setTargetedReview(prev => prev ? { ...prev, selectedAnswer: index } : null)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        showResult && index === question.correctIndex ? 'bg-gold text-black' :
                        showResult && isSelected && !isCorrect ? 'bg-silver text-black' :
                        isSelected ? 'bg-[var(--color-brand-gold)] text-black' :
                        'bg-white/10 text-silver'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showResult && index === question.correctIndex && (
                        <CheckCircle className="w-5 h-5 text-gold" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {showResult && (
              <div className={`mt-6 p-4 rounded-lg ${
                isCorrect ? 'bg-gold/10 border border-gold/30' : 'bg-silver/10 border border-silver/30'
              }`}>
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-silver shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-semibold mb-1 ${isCorrect ? 'text-gold' : 'text-silver'}`}>
                      {isCorrect ? 'Correct!' : 'Incorrect'}
                    </p>
                    <p className="text-silver text-sm">{question.explanation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              {!showResult ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={targetedReview.selectedAnswer === null}
                  className="bg-[var(--color-brand-gold)] text-[var(--color-background-primary)] hover:bg-[var(--color-brand-gold-light)] disabled:opacity-50"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="bg-[var(--color-brand-gold)] text-[var(--color-background-primary)] hover:bg-[var(--color-brand-gold-light)]"
                >
                  {targetedReview.currentQuestionIndex < TARGETED_REVIEW_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      )
    }

    // Stage: Results
    if (targetedReview.stage === 'results') {
      const correctCount = targetedReview.results.filter(r => r.correct).length
      const sessionScore = targetedReview.sessionScore || 0
      const isImproved = sessionScore > targetedReview.historicalScore
      const missedConcepts = targetedReview.results
        .filter(r => !r.correct)
        .map(r => r.concept)
        .filter((value, index, self) => self.indexOf(value) === index)

      return (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Score Card */}
          <Card variant="default" padding="lg" className={`text-center ${
            sessionScore >= 80 ? 'bg-gold/10 border-gold/30' : 'bg-[var(--color-brand-black)] border-white/10'
          }`}>
            <div className={`text-6xl font-bold mb-2 ${sessionScore >= 80 ? 'text-gold' : 'text-white'}`}>
              {sessionScore}%
            </div>
            <p className="text-xl text-silver mb-4">
              {correctCount} of {targetedReview.results.length} correct
            </p>
            <Badge
              variant={sessionScore >= 80 ? 'gold' : 'default'}
              className={sessionScore >= 80 ? 'bg-gold text-black' : 'border-silver text-silver'}
            >
              {sessionScore >= 80 ? 'Review Passed' : 'Additional Review Recommended'}
            </Badge>
          </Card>

          {/* Performance Comparison */}
          <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 text-center">Performance Comparison</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-silver mb-1">Historical Topic Performance</p>
                <p className="text-3xl font-bold text-silver">{targetedReview.historicalScore}%</p>
                <p className="text-xs text-silver-gray mt-1">Chapter 10 Quiz</p>
              </div>
              <div className="text-center p-4 bg-[var(--color-brand-gold)]/10 rounded-lg border border-[var(--color-brand-gold)]/30">
                <p className="text-sm text-silver mb-1">Today&apos;s Review</p>
                <p className="text-3xl font-bold text-[var(--color-brand-gold)]">{sessionScore}%</p>
                <p className="text-xs text-[var(--color-brand-gold)] mt-1 flex items-center justify-center gap-1">
                  {isImproved ? (
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
            {isImproved && (
              <div className="mt-4 p-4 bg-[var(--color-brand-gold)]/5 rounded-lg border border-[var(--color-brand-gold)]/20">
                <p className="text-center text-silver">
                  <span className="font-semibold text-white">You&apos;re improving in {targetedReview.topicName}.</span>{' '}
                  Your targeted review shows progress. Continue practicing to maintain this improvement for the board exam.
                </p>
              </div>
            )}
          </Card>

          {/* Missed Concepts */}
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
                          This concept is covered in Chapter 10 curriculum content.
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Button
                      onClick={() => setTargetedReview(prev => prev ? { ...prev, stage: 'quiz', currentQuestionIndex: 0, selectedAnswer: null, showExplanation: false, results: [] } : null)}
                      variant="outline"
                      className="border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10"
                    >
                      <RotateCw className="w-4 h-4 mr-2" />
                      Retake Review
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={resetQuiz}
              variant="outline"
              className="border-white/20 text-silver hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            {/* View Instructor Perspective — Demo Transition */}
            <Link href="/demo/instructor">
              <Button
                variant="outline"
                className="border-[var(--color-brand-gold)]/30 text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10 w-full sm:w-auto"
              >
                <Users className="w-4 h-4 mr-2" />
                View Instructor Perspective
              </Button>
            </Link>
          </div>
        </div>
      )
    }

    return null
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
        <PresentationControls
          viewLabel={
            viewMode === 'dashboard' ? 'Dashboard' :
            viewMode === 'chapter' ? 'Chapter' :
            viewMode === 'study' ? 'Study' :
            viewMode === 'flashcards' ? `Card ${currentFlashcardIndex + 1}/${CHAPTER_15_FLASHCARDS.length}` :
            viewMode === 'quiz' ? `Q${currentQuestionIndex + 1}/${currentQuizQuestions.length}` :
            viewMode === 'targeted-review' ? 'Targeted Review' :
            'Results'
          }
          onBack={() => {
            if (viewMode === 'chapter') setViewMode('dashboard')
            else if (viewMode === 'study') setViewMode('chapter')
            else if (viewMode === 'flashcards') setViewMode('chapter')
            else if (viewMode === 'quiz') setViewMode('dashboard')
            else if (viewMode === 'results') setViewMode('dashboard')
            else if (viewMode === 'targeted-review') {
              setTargetedReview(null)
              setViewMode('dashboard')
            }
          }}
          onNext={() => {
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
          canGoBack={viewMode !== 'dashboard'}
          canGoNext={viewMode !== 'results' && viewMode !== 'targeted-review'}
          showPerspectiveSwitch={true}
          perspectiveSwitchLabel="View Instructor Perspective"
          perspectiveSwitchHref="/demo/instructor"
          onReset={resetDemo}
          onExit={() => setIsPresentationMode(false)}
        />
      )}

      {/* Presentation Mode Toggle */}
      {!isPresentationMode && (
        <button
          onClick={() => setIsPresentationMode(true)}
          className="fixed bottom-20 right-4 z-[100] flex items-center gap-2 px-4 py-3 bg-[var(--color-brand-gold)] text-white font-semibold rounded-xl shadow-lg hover:bg-[var(--color-brand-gold-light)] transition-colors"
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
              <Logo variant="compact" size="md" className="sm:hidden" />
              <Logo variant="compact" size="lg" className="hidden sm:block md:hidden" />
              <Logo variant="full" size="3xl" className="hidden md:block" />
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
              {/* View Instructor Perspective — subtle demo transition */}
              <Link
                href="/demo/instructor"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-silver hover:text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/5 rounded-md transition-colors"
                title="Switch to Instructor Demo"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Instructor View</span>
              </Link>
              
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
        {viewMode === 'targeted-review' && renderTargetedReview()}
      </div>

      {/* Footer */}
      {!isPresentationMode && (
        <footer className="border-t border-white/10 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
