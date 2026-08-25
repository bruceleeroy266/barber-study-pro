'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Plus,
  Save,
  Search,
  Users,
  X,
  ArrowLeft,
  BookOpen,
  Target,
  Brain,
  Award,
  Lightbulb,
  ChevronRight,
  Menu,
  Presentation,
  GraduationCap,
} from 'lucide-react'
import { Logo } from '@/components/brand'
import { Card, Button, Badge } from '@/components/ui'
import {
  getDemoClassStudents,
  getStudentsNeedingAttention,
  getClassTopicAverages,
  getClassOverview,
  getTopicName,
  getPrimaryLearningGap,
  ISABELLA_LEARNING_GAP,
  DEMO_CLASS_NAME,
} from '@/lib/demo-environment-data'
import type { DemoStudentProfile } from '@/lib/demo-environment-data'
import { DemoPresentationProvider, useDemoPresentation, PresentationControls } from '../DemoPresentationContext'

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────

type ViewMode = 'dashboard' | 'student-detail'

interface InterventionNote {
  id: string
  studentId: string
  text: string
  type: string
  followUp: string
  date: string
}

// ───────────────────────────────────────────────
// Helper Components
// ───────────────────────────────────────────────

function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'default',
}: {
  label: string
  value: string | number
  subtext?: string
  icon: React.ElementType
  variant?: 'default' | 'success' | 'warning' | 'danger'
}) {
  const variantStyles = {
    default: 'text-[var(--color-brand-gold)]',
    success: 'text-gold',
    warning: 'text-warm-bronze',
    danger: 'text-silver',
  }

  return (
    <Card variant="default" padding="md" className="bg-[var(--color-brand-black)] border-white/10">
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-3xl font-bold ${variantStyles[variant]}`}>{value}</div>
          <div className="text-sm text-silver mt-1">{label}</div>
          {subtext && <div className="text-xs text-silver-gray mt-1">{subtext}</div>}
        </div>
        <div className={`${variantStyles[variant]} opacity-50`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  )
}

function RiskBadge({ status }: { status: 'low' | 'medium' | 'high' }) {
  const styles = {
    high: 'bg-silver/10 text-silver border-silver/20',
    medium: 'bg-warm-bronze/10 text-warm-bronze border-warm-bronze/20',
    low: 'bg-gold/10 text-gold border-gold/20',
  }
  const labels = {
    high: 'Needs Attention',
    medium: 'Monitor',
    low: 'On Track',
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

function ProgressBar({ value, color = 'var(--color-brand-gold)' }: { value: number; color?: string }) {
  return (
    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
      />
    </div>
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
          Primary learning gap
        </p>
      )}
    </div>
  )
}

// ───────────────────────────────────────────────
// Main Component (wrapped with provider)
// ───────────────────────────────────────────────

export default function DemoInstructorClient() {
  return (
    <DemoPresentationProvider>
      <DemoInstructorContent />
    </DemoPresentationProvider>
  )
}

// ───────────────────────────────────────────────
// Instructor Demo Content
// ───────────────────────────────────────────────

function DemoInstructorContent() {
  const students = getDemoClassStudents()
  const classOverview = getClassOverview()
  const classTopicAverages = getClassTopicAverages()
  const studentsNeedingAttention = getStudentsNeedingAttention()
  
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
    setPerspective('instructor')
  }, [setPerspective])
  
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [selectedStudent, setSelectedStudent] = useState<DemoStudentProfile | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [rosterFilter, setRosterFilter] = useState<'all' | 'on-track' | 'needs-attention'>('all')
  
  // Intervention notes state (session-only)
  const [interventionNotes, setInterventionNotes] = useState<InterventionNote[]>([
    {
      id: 'note-isabella-1',
      studentId: 'demo-student-isabella',
      text: 'Recommended Chapter 10 review after lower performance in scalp disorder identification.',
      type: 'Academic',
      followUp: 'This week',
      date: 'Aug 11',
    },
  ])
  const [noteText, setNoteText] = useState('')
  const [noteType, setNoteType] = useState('General')
  const [noteFollowUp, setNoteFollowUp] = useState('This week')
  const [showAddNote, setShowAddNote] = useState(false)
  const [noteSaved, setNoteSaved] = useState(false)
  
  // Mobile nav state
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Filter students based on search and filter
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase())
    let matchesFilter = true
    if (rosterFilter === 'on-track') matchesFilter = s.riskStatus === 'low'
    if (rosterFilter === 'needs-attention') matchesFilter = s.riskStatus === 'medium' || s.riskStatus === 'high'
    return matchesSearch && matchesFilter
  })

  // Sort students needing attention by risk level
  const sortedNeedsAttention = [...studentsNeedingAttention].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.riskStatus] - order[b.riskStatus]
  })

  // Get top learning gaps (lowest class averages)
  const topLearningGaps = [...classTopicAverages]
    .sort((a, b) => a.classAvg - b.classAvg)
    .slice(0, 5)

  // Get student notes
  const getStudentNotes = (studentId: string) => {
    return interventionNotes.filter((n) => n.studentId === studentId)
  }

  // Generate "Why This Student Needs Attention" explanation from centralized data
  const getAttentionExplanation = (student: DemoStudentProfile): string => {
    const parts: string[] = []
    
    // Progress concern
    if (student.overallProgress < 40) {
      parts.push(`has completed ${student.overallProgress}% of the program`)
    } else if (student.overallProgress < 60) {
      parts.push(`is at ${student.overallProgress}% progress`)
    }
    
    // Readiness concern
    if (student.readinessScore < 50) {
      parts.push(`board readiness is ${student.readinessScore}`)
    } else if (student.readinessScore < 70) {
      parts.push(`readiness score is ${student.readinessScore}`)
    }
    
    // Inactivity
    if (student.daysSinceActive >= 5) {
      parts.push(`has been inactive for ${student.daysSinceActive} days`)
    } else if (student.daysSinceActive >= 3) {
      parts.push(`last active ${student.daysSinceActive} days ago`)
    }
    
    // Recent quiz performance
    const recentQuiz = student.quizHistory[0]
    if (recentQuiz && !recentQuiz.passed) {
      parts.push(`recent quiz performance was ${recentQuiz.percentage}%`)
    }
    
    // Weak topics
    const weakTopicsWithScores = student.weakAreas
      .map(topicId => {
        const mastery = student.topicMastery.find(t => t.topicId === topicId)
        return { name: getTopicName(topicId), score: mastery?.score || 0 }
      })
      .filter(t => t.score > 0)
      .sort((a, b) => a.score - b.score)
    
    if (weakTopicsWithScores.length >= 2) {
      const [first, second] = weakTopicsWithScores
      parts.push(`priority review areas are ${first.name} (${first.score}%) and ${second.name} (${second.score}%)`)
    } else if (weakTopicsWithScores.length === 1) {
      parts.push(`${weakTopicsWithScores[0].name} (${weakTopicsWithScores[0].score}%) needs review`)
    }
    
    // Build sentence
    if (parts.length === 0) {
      return `${student.name} is being monitored for additional support.`
    }
    
    const name = student.name.split(' ')[0]
    if (parts.length === 1) {
      return `${name} ${parts[0]}.`
    }
    
    const lastPart = parts.pop()
    return `${name} ${parts.join(', ')}, and ${lastPart}.`
  }

  // Open student detail
  const openStudent = (student: DemoStudentProfile) => {
    setSelectedStudent(student)
    setViewMode('student-detail')
    setNoteText('')
    setNoteSaved(false)
    setShowAddNote(false)
  }

  // Close student detail
  const closeStudentDetail = () => {
    setSelectedStudent(null)
    setViewMode('dashboard')
  }

  // Add intervention note
  const addNote = () => {
    if (!selectedStudent || !noteText.trim()) return
    const newNote: InterventionNote = {
      id: `note-${Date.now()}`,
      studentId: selectedStudent.id,
      text: noteText,
      type: noteType,
      followUp: noteFollowUp,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }
    setInterventionNotes((prev) => [...prev, newNote])
    setNoteText('')
    setNoteSaved(true)
    setShowAddNote(false)
    setTimeout(() => setNoteSaved(false), 4000)
  }

  // Reset demo
  const resetDemo = useCallback(() => {
    setViewMode('dashboard')
    setSelectedStudent(null)
    setSearchQuery('')
    setRosterFilter('all')
    setInterventionNotes([
      {
        id: 'note-isabella-1',
        studentId: 'demo-student-isabella',
        text: 'Recommended Chapter 10 review after lower performance in scalp disorder identification.',
        type: 'Academic',
        followUp: 'This week',
        date: 'Aug 11',
      },
    ])
    setNoteText('')
    setShowAddNote(false)
    setGuidedStep('Dashboard')
  }, [setGuidedStep])

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
    if (viewMode === 'dashboard') {
      setGuidedStep('Dashboard')
    } else if (selectedStudent) {
      setGuidedStep(selectedStudent.name.split(' ')[0])
    }
  }, [viewMode, selectedStudent, setGuidedStep])

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
        case 'Escape':
          e.preventDefault()
          if (viewMode === 'student-detail') {
            closeStudentDetail()
          } else {
            setIsPresentationMode(false)
            if (document.fullscreenElement) {
              document.exitFullscreen().catch(() => {})
            }
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
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPresentationMode, viewMode, toggleFullscreen, resetDemo, highContrast, setHighContrast, setIsPresentationMode])

  // CSV Export
  const downloadCsv = () => {
    const headers = ['Name', 'Program', 'Progress', 'Quiz Average', 'Readiness', 'Risk Status', 'Primary Gap', 'Last Active']
    const rows = students.map((s) => {
      const primaryGap = getPrimaryLearningGap(s)
      return [
        s.name,
        s.program,
        `${s.overallProgress}%`,
        `${s.avgQuizScore}%`,
        `${s.readinessScore}`,
        s.riskStatus,
        primaryGap ? getTopicName(primaryGap) : 'None',
        s.lastActivityDescription,
      ]
    })
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ascyn-pro-demo-class-2026.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // ───────────────────────────────────────────────
  // Render: Dashboard View
  // ───────────────────────────────────────────────

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Class Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {DEMO_CLASS_NAME}
          </h1>
          <p className="text-silver mt-1">{classOverview.totalStudents} Students</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={downloadCsv}
            variant="outline"
            className="border-white/20 text-silver hover:bg-white/5"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Class Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          label="Total Students"
          value={classOverview.totalStudents}
          icon={Users}
        />
        <MetricCard
          label="Avg Progress"
          value={`${classOverview.avgProgress}%`}
          icon={BookOpen}
        />
        <MetricCard
          label="Avg Quiz Score"
          value={`${classOverview.avgQuizScore}%`}
          icon={Target}
        />
        <MetricCard
          label="Avg Readiness"
          value={classOverview.avgReadiness}
          icon={Brain}
        />
        <MetricCard
          label="Need Attention"
          value={classOverview.studentsNeedingAttention}
          icon={AlertTriangle}
          variant={classOverview.studentsNeedingAttention > 0 ? 'warning' : 'success'}
        />
      </div>

      {/* Students Needing Attention */}
      <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warm-bronze" />
          <h2 className="text-lg font-bold text-white">Students Needing Attention</h2>
          <Badge variant="default" className="border-warm-bronze/30 text-warm-bronze">
            {sortedNeedsAttention.length}
          </Badge>
        </div>
        <p className="text-sm text-silver mb-4">
          Students with medium or high risk status who may benefit from additional support.
        </p>
        
        {sortedNeedsAttention.length === 0 ? (
          <p className="text-silver text-sm">All students are currently on track.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedNeedsAttention.map((student) => {
              const weakTopics = student.weakAreas.slice(0, 2)
              return (
                <button
                  key={student.id}
                  onClick={() => openStudent(student)}
                  className="text-left p-4 rounded-lg border border-white/10 bg-white/5 hover:border-[var(--color-brand-gold)]/30 hover:bg-[var(--color-brand-gold)]/5 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{student.name}</h3>
                      <p className="text-xs text-silver-gray">{student.program}</p>
                    </div>
                    <RiskBadge status={student.riskStatus} />
                  </div>
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-silver">Progress</span>
                      <span className="text-white font-medium">{student.overallProgress}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-silver">Readiness</span>
                      <span className={`font-medium ${student.readinessScore >= 70 ? 'text-gold' : 'text-silver'}`}>
                        {student.readinessScore}
                      </span>
                    </div>
                    {weakTopics.length > 0 && (
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-silver-gray mb-1">Areas to improve:</p>
                        <p className="text-xs text-silver">
                          {weakTopics.map((t) => getTopicName(t)).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </Card>

      {/* Class Learning Gaps */}
      <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-[var(--color-brand-gold)]" />
          <h2 className="text-lg font-bold text-white">Class Learning Gaps</h2>
        </div>
        <p className="text-sm text-silver mb-4">
          Topics where the class needs the most review, based on average mastery scores.
        </p>
        <div className="space-y-3">
          {topLearningGaps.map((topic) => (
            <div key={topic.topicId} className="p-4 rounded-lg border border-white/10 bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{topic.topicName}</span>
                <span className={`text-lg font-bold ${topic.classAvg >= 80 ? 'text-gold' : topic.classAvg >= 70 ? 'text-warm-bronze' : 'text-silver'}`}>
                  {topic.classAvg}%
                </span>
              </div>
              <ProgressBar value={topic.classAvg} />
              <p className="text-xs text-silver-gray mt-2">
                {topic.studentCount} students with scores
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Student Roster */}
      <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--color-brand-gold)]" />
            <h2 className="text-lg font-bold text-white">Student Roster</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-gray" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)]/50 w-48"
              />
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setRosterFilter('all')}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  rosterFilter === 'all'
                    ? 'bg-[var(--color-brand-gold)] text-[var(--color-background-primary)]'
                    : 'bg-white/5 text-silver hover:bg-white/10'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setRosterFilter('on-track')}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  rosterFilter === 'on-track'
                    ? 'bg-[var(--color-brand-gold)] text-[var(--color-background-primary)]'
                    : 'bg-white/5 text-silver hover:bg-white/10'
                }`}
              >
                On Track
              </button>
              <button
                onClick={() => setRosterFilter('needs-attention')}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  rosterFilter === 'needs-attention'
                    ? 'bg-[var(--color-brand-gold)] text-[var(--color-background-primary)]'
                    : 'bg-white/5 text-silver hover:bg-white/10'
                }`}
              >
                Needs Attention
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs font-medium text-silver-gray uppercase tracking-wider">Student</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-silver-gray uppercase tracking-wider">Progress</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-silver-gray uppercase tracking-wider">Quiz Avg</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-silver-gray uppercase tracking-wider">Readiness</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-silver-gray uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-silver-gray uppercase tracking-wider">Primary Gap</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-silver-gray uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-white font-medium">{student.name}</p>
                      <p className="text-xs text-silver-gray">{student.program}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white">{student.overallProgress}%</span>
                      <div className="w-16">
                        <ProgressBar value={student.overallProgress} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white">{student.avgQuizScore}%</td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${student.readinessScore >= 80 ? 'text-gold' : student.readinessScore >= 60 ? 'text-warm-bronze' : 'text-silver'}`}>
                      {student.readinessScore}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge status={student.riskStatus} />
                  </td>
                  <td className="py-3 px-4">
                    {(() => {
                      const primaryGap = getPrimaryLearningGap(student)
                      return primaryGap ? (
                        <span className="text-sm text-silver">{getTopicName(primaryGap)}</span>
                      ) : (
                        <span className="text-sm text-silver-gray">—</span>
                      )
                    })()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      onClick={() => openStudent(student)}
                      variant="outline"
                      size="sm"
                      className="border-[var(--color-brand-gold)]/30 text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10"
                    >
                      View
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )

  // ───────────────────────────────────────────────
  // Render: Student Detail View
  // ───────────────────────────────────────────────

  const renderStudentDetail = () => {
    if (!selectedStudent) return null

    const studentNotes = getStudentNotes(selectedStudent.id)
    const isIsabella = selectedStudent.id === 'demo-student-isabella'
    const learningGap = isIsabella ? ISABELLA_LEARNING_GAP : null

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            onClick={closeStudentDetail}
            variant="ghost"
            className="text-silver hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Student Header */}
        <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{selectedStudent.name}</h1>
              <p className="text-silver mt-1">{selectedStudent.program} Program</p>
              <div className="flex items-center gap-2 mt-2">
                <RiskBadge status={selectedStudent.riskStatus} />
                <span className="text-sm text-silver-gray">
                  Last active: {selectedStudent.lastActivityDescription}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--color-brand-gold)]">{selectedStudent.overallProgress}%</p>
                <p className="text-xs text-silver-gray">Progress</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{selectedStudent.avgQuizScore}%</p>
                <p className="text-xs text-silver-gray">Quiz Avg</p>
              </div>
              <div className="text-center">
                <p className={`text-3xl font-bold ${selectedStudent.readinessScore >= 80 ? 'text-gold' : selectedStudent.readinessScore >= 60 ? 'text-warm-bronze' : 'text-silver'}`}>
                  {selectedStudent.readinessScore}
                </p>
                <p className="text-xs text-silver-gray">Readiness</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Learning Gap Alert (for Isabella) */}
        {learningGap && (
          <Card variant="default" padding="lg" className="bg-[var(--color-brand-gold)]/5 border-[var(--color-brand-gold)]/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-brand-gold)]/20 flex items-center justify-center shrink-0">
                <Lightbulb className="w-6 h-6 text-[var(--color-brand-gold)]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Learning Gap Identified</h3>
                <p className="text-silver mb-3">
                  <span className="font-semibold text-white">{learningGap.topicName}</span> — {learningGap.quizScore}%
                </p>
                <p className="text-silver text-sm mb-4">
                  {learningGap.instructorViewSummary}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="gold" className="border-[var(--color-brand-gold)]/30 text-[var(--color-brand-gold)]">
                    Chapter {learningGap.chapterNumber}
                  </Badge>
                  <Badge variant="default" className="border-silver/30 text-silver">
                    Class Avg: {learningGap.classAverage}%
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Why This Student Needs Attention (for medium/high risk) */}
        {(selectedStudent.riskStatus === 'medium' || selectedStudent.riskStatus === 'high') && (
          <Card variant="default" padding="lg" className="bg-warm-bronze/5 border-warm-bronze/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-warm-bronze/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-warm-bronze" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Why This Student Needs Attention</h3>
                <p className="text-silver text-sm">
                  {getAttentionExplanation(selectedStudent)}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Areas to Improve */}
          <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-[var(--color-brand-gold)]" />
              <h2 className="text-lg font-bold text-white">Areas to Improve</h2>
            </div>
            <div className="space-y-3">
              {selectedStudent.weakAreas.map((topicId) => {
                const mastery = selectedStudent.topicMastery.find((t) => t.topicId === topicId)
                return (
                  <TopicProgressBar
                    key={topicId}
                    name={getTopicName(topicId)}
                    score={mastery?.score || 0}
                    isPrimaryGap={topicId === selectedStudent.primaryLearningGap}
                  />
                )
              })}
            </div>
          </Card>

          {/* Strong Areas */}
          <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-bold text-white">Strong Areas</h2>
            </div>
            <div className="space-y-3">
              {selectedStudent.strongAreas.map((topicId) => {
                const mastery = selectedStudent.topicMastery.find((t) => t.topicId === topicId)
                return (
                  <TopicProgressBar
                    key={topicId}
                    name={getTopicName(topicId)}
                    score={mastery?.score || 0}
                  />
                )
              })}
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
            {selectedStudent.recentActivity.slice(0, 5).map((activity) => (
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

        {/* Intervention Notes */}
        <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--color-brand-gold)]" />
              <h2 className="text-lg font-bold text-white">Intervention Notes</h2>
            </div>
            <Button
              onClick={() => setShowAddNote(!showAddNote)}
              variant="outline"
              size="sm"
              className="border-[var(--color-brand-gold)]/30 text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Note
            </Button>
          </div>

          {noteSaved && (
            <div className="mb-4 p-3 bg-gold/10 border border-gold/30 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm">Note saved successfully</span>
            </div>
          )}

          {showAddNote && (
            <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter intervention note..."
                className="w-full px-3 py-2 bg-[var(--color-brand-black)] border border-white/10 rounded-lg text-white text-sm placeholder:text-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)]/50 min-h-[100px]"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-silver-gray mb-2">Type</label>
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--color-brand-black)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-brand-gold)]/50"
                  >
                    <option>General</option>
                    <option>Academic</option>
                    <option>1:1 Meeting</option>
                    <option>Extra Practice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-silver-gray mb-2">Follow-Up</label>
                  <select
                    value={noteFollowUp}
                    onChange={(e) => setNoteFollowUp(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--color-brand-black)] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-brand-gold)]/50"
                  >
                    <option>This week</option>
                    <option>Next week</option>
                    <option>Before exam</option>
                    <option>Ongoing</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setShowAddNote(false)}
                  variant="ghost"
                  className="text-silver hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addNote}
                  disabled={!noteText.trim()}
                  className="bg-[var(--color-brand-gold)] text-[var(--color-background-primary)] hover:bg-[var(--color-brand-gold-light)] disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Note
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {studentNotes.length === 0 ? (
              <p className="text-silver-gray text-sm">No intervention notes yet.</p>
            ) : (
              studentNotes.map((note) => (
                <div key={note.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="gold" className="border-[var(--color-brand-gold)]/30 text-[var(--color-brand-gold)] text-xs">
                        {note.type}
                      </Badge>
                      <span className="text-xs text-silver-gray">Follow-up: {note.followUp}</span>
                    </div>
                    <span className="text-xs text-silver-gray">{note.date}</span>
                  </div>
                  <p className="text-silver text-sm">{note.text}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recommended Action */}
        <Card variant="default" padding="lg" className="bg-[var(--color-brand-black)] border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[var(--color-brand-gold)]" />
            <h2 className="text-lg font-bold text-white">Recommended Action</h2>
          </div>
          <p className="text-silver">{selectedStudent.recommendedAction}</p>
        </Card>
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
        <PresentationControls
          viewLabel={viewMode === 'dashboard' ? 'Dashboard' : selectedStudent?.name.split(' ')[0] || 'Student'}
          onBack={() => {
            if (viewMode === 'student-detail') {
              closeStudentDetail()
            }
          }}
          onNext={() => {
            // Could add guided navigation here
          }}
          canGoBack={viewMode === 'student-detail'}
          canGoNext={false}
          showPerspectiveSwitch={true}
          perspectiveSwitchLabel="View Student Perspective"
          perspectiveSwitchHref="/demo/student"
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

      {/* Demo Banner */}
      {!isPresentationMode && (
        <div className="bg-[var(--color-brand-gold)]/10 border-b border-[var(--color-brand-gold)]/20 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <span className="text-[var(--color-brand-gold)] text-sm font-medium">
              INSTRUCTOR DEMO · Fictional Data
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      {!isPresentationMode && (
        <nav className="sticky top-0 z-50 bg-[var(--color-background-primary)]/95 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo variant="compact" size="md" className="lg:hidden" />
              <Logo variant="full" size="lg" className="hidden lg:block" />
              <span className="font-semibold tracking-tight text-sm text-white lg:hidden">
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
              <Link
                href="/demo/student"
                className="px-3 py-1.5 text-xs text-silver hover:text-white hover:bg-white/5 rounded-md transition-colors"
              >
                Student View
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {/* View Student Perspective — subtle demo transition */}
              <Link
                href="/demo/student"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-silver hover:text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/5 rounded-md transition-colors"
                title="Switch to Student Demo"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student View</span>
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
                <Link
                  href="/demo/student"
                  className="text-left px-3 py-2.5 text-sm text-silver hover:text-white transition-colors rounded-md hover:bg-white/5"
                >
                  Student View
                </Link>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {viewMode === 'dashboard' && renderDashboard()}
        {viewMode === 'student-detail' && renderStudentDetail()}
      </div>

      {/* Footer */}
      {!isPresentationMode && (
        <footer className="border-t border-white/10 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Logo variant="full" size="md" />
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
