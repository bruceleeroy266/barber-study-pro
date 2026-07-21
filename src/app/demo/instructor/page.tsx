'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { generateStudentReportHtml, generateClassReportHtml } from './reports'
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Plus,
  Save,
  Search,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'

// ───────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────

type Note = {
  id: string
  text: string
  type: string
  followUp: string
  date: string
}

type Student = {
  id: string
  name: string
  program: string
  readiness: number
  lastActive: string
  weakestTopic: string
  riskStatus: string
  recentActivity: string
  quizzesTaken: number
  avgScore: number
  confidenceTrend: number[]
  topicMastery: { topic: string; score: number }[]
  quizHistory: { chapter: string; score: number; date: string }[]
  recommendedAction: string
  riskFactors: string[]
  notes: Note[]
}

type HeatmapTopic = {
  topic: string
  classAvg: number
  weight: string
}

// ───────────────────────────────────────────────
// DEMO DATA — Static sample data for board presentation
// No auth. No database. No API.
// ────────────────────────────────────────────

const sampleStudents: Student[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    program: 'Barbering',
    readiness: 89,
    lastActive: '2 hours ago',
    weakestTopic: 'Chemical Texture',
    riskStatus: 'low',
    recentActivity: 'Completed Chapter 12 quiz — 92%',
    quizzesTaken: 24,
    avgScore: 88,
    confidenceTrend: [72, 75, 78, 82, 85, 89],
    topicMastery: [
      { topic: 'Infection Control', score: 94 },
      { topic: 'Anatomy & Physiology', score: 91 },
      { topic: 'Chemical Services', score: 76 },
      { topic: 'Hair & Scalp', score: 88 },
      { topic: 'Skin Care', score: 85 },
      { topic: 'Nail Care', score: 90 },
    ],
    quizHistory: [
      { chapter: 'Ch. 12 — Chemical Texture', score: 92, date: 'Jul 8' },
      { chapter: 'Ch. 11 — Haircolor', score: 85, date: 'Jul 6' },
      { chapter: 'Ch. 9 — Skin Disorders', score: 90, date: 'Jul 3' },
    ],
    recommendedAction: 'Continue weekly review of chemical texture processing times.',
    riskFactors: ['Weak topic mastery in Chemical Services'],
    notes: [],
  },
  {
    id: '2',
    name: 'Maria Garcia',
    program: 'Cosmetology',
    readiness: 64,
    lastActive: '1 day ago',
    weakestTopic: 'State Rules & Laws',
    riskStatus: 'medium',
    recentActivity: 'Missed Chapter 8 quiz — 58%',
    quizzesTaken: 18,
    avgScore: 71,
    confidenceTrend: [68, 66, 64, 62, 65, 64],
    topicMastery: [
      { topic: 'Infection Control', score: 78 },
      { topic: 'Anatomy & Physiology', score: 82 },
      { topic: 'Chemical Services', score: 69 },
      { topic: 'Hair & Scalp', score: 74 },
      { topic: 'Skin Care', score: 80 },
      { topic: 'Nail Care', score: 77 },
    ],
    quizHistory: [
      { chapter: 'Ch. 8 — State Rules', score: 58, date: 'Jul 7' },
      { chapter: 'Ch. 7 — Electricity', score: 72, date: 'Jul 5' },
      { chapter: 'Ch. 6 — Anatomy', score: 79, date: 'Jul 1' },
    ],
    recommendedAction: 'Schedule 1:1 review of state rules and sanitation protocols.',
    riskFactors: ['Low readiness score (64%)', 'Weak topic mastery in State Rules & Laws', 'Declining confidence trend'],
    notes: [],
  },
  {
    id: '3',
    name: 'Jordan Smith',
    program: 'Barbering',
    readiness: 42,
    lastActive: '5 days ago',
    weakestTopic: 'Infection Control',
    riskStatus: 'high',
    recentActivity: 'Inactive — no study in 5 days',
    quizzesTaken: 12,
    avgScore: 55,
    confidenceTrend: [58, 55, 50, 48, 45, 42],
    topicMastery: [
      { topic: 'Infection Control', score: 45 },
      { topic: 'Anatomy & Physiology', score: 52 },
      { topic: 'Chemical Services', score: 48 },
      { topic: 'Hair & Scalp', score: 61 },
      { topic: 'Skin Care', score: 55 },
      { topic: 'Nail Care', score: 50 },
    ],
    quizHistory: [
      { chapter: 'Ch. 5 — Infection Control', score: 45, date: 'Jun 28' },
      { chapter: 'Ch. 4 — Disorders', score: 52, date: 'Jun 25' },
      { chapter: 'Ch. 3 — Professionalism', score: 68, date: 'Jun 20' },
    ],
    recommendedAction: 'Immediate intervention: review infection control fundamentals and set daily study goal.',
    riskFactors: ['Low readiness score (42%)', 'Inactivity — no study in 5 days', 'Repeated quiz failures', 'Declining confidence trend', 'Weak topic mastery in Infection Control'],
    notes: [],
  },
  {
    id: '4',
    name: 'Taylor Williams',
    program: 'Barbering',
    readiness: 76,
    lastActive: '3 hours ago',
    weakestTopic: 'Hair & Scalp Disorders',
    riskStatus: 'low',
    recentActivity: 'Completed flashcard review — 45 cards',
    quizzesTaken: 21,
    avgScore: 79,
    confidenceTrend: [68, 70, 73, 75, 74, 76],
    topicMastery: [
      { topic: 'Infection Control', score: 88 },
      { topic: 'Anatomy & Physiology', score: 85 },
      { topic: 'Chemical Services', score: 78 },
      { topic: 'Hair & Scalp', score: 68 },
      { topic: 'Skin Care', score: 82 },
      { topic: 'Nail Care', score: 80 },
    ],
    quizHistory: [
      { chapter: 'Ch. 10 — Hair & Scalp', score: 71, date: 'Jul 8' },
      { chapter: 'Ch. 9 — Skin Disorders', score: 84, date: 'Jul 6' },
      { chapter: 'Ch. 8 — State Rules', score: 82, date: 'Jul 4' },
    ],
    recommendedAction: 'Focus on identifying contagious scalp conditions using flashcards.',
    riskFactors: ['Weak topic mastery in Hair & Scalp Disorders'],
    notes: [],
  },
  {
    id: '5',
    name: 'Riley Brown',
    program: 'Cosmetology',
    readiness: 55,
    lastActive: '2 days ago',
    weakestTopic: 'Chemical Services',
    riskStatus: 'medium',
    recentActivity: 'Retested Chapter 11 — improved from 48% to 62%',
    quizzesTaken: 16,
    avgScore: 63,
    confidenceTrend: [45, 48, 52, 55, 58, 55],
    topicMastery: [
      { topic: 'Infection Control', score: 72 },
      { topic: 'Anatomy & Physiology', score: 68 },
      { topic: 'Chemical Services', score: 52 },
      { topic: 'Hair & Scalp', score: 65 },
      { topic: 'Skin Care', score: 70 },
      { topic: 'Nail Care', score: 64 },
    ],
    quizHistory: [
      { chapter: 'Ch. 11 — Haircolor Retest', score: 62, date: 'Jul 7' },
      { chapter: 'Ch. 11 — Haircolor', score: 48, date: 'Jul 2' },
      { chapter: 'Ch. 10 — Hair & Scalp', score: 65, date: 'Jun 29' },
    ],
    recommendedAction: 'Continue retest loop on chemical services until score reaches 80%.',
    riskFactors: ['Low readiness score (55%)', 'Repeated quiz failures in Chemical Services', 'Weak topic mastery in Chemical Services'],
    notes: [],
  },
  {
    id: '6',
    name: 'Morgan Lee',
    program: 'Barbering',
    readiness: 81,
    lastActive: '1 hour ago',
    weakestTopic: 'Nail Care',
    riskStatus: 'low',
    recentActivity: 'Completed diagnostic exam — 83%',
    quizzesTaken: 23,
    avgScore: 82,
    confidenceTrend: [74, 76, 78, 79, 80, 81],
    topicMastery: [
      { topic: 'Infection Control', score: 90 },
      { topic: 'Anatomy & Physiology', score: 88 },
      { topic: 'Chemical Services', score: 83 },
      { topic: 'Hair & Scalp', score: 86 },
      { topic: 'Skin Care', score: 84 },
      { topic: 'Nail Care', score: 68 },
    ],
    quizHistory: [
      { chapter: 'Full Diagnostic', score: 83, date: 'Jul 9' },
      { chapter: 'Ch. 13 — Nail Structure', score: 70, date: 'Jul 7' },
      { chapter: 'Ch. 12 — Chemical Texture', score: 88, date: 'Jul 5' },
    ],
    recommendedAction: 'Light review of nail disorders and anatomy.',
    riskFactors: ['Weak topic mastery in Nail Care'],
    notes: [],
  },
]

const heatmapTopics: HeatmapTopic[] = [
  { topic: 'Infection Control', classAvg: 74, weight: 'High' },
  { topic: 'Anatomy & Physiology', classAvg: 79, weight: 'Medium' },
  { topic: 'Chemical Services', classAvg: 62, weight: 'High' },
  { topic: 'Hair & Scalp', classAvg: 71, weight: 'High' },
  { topic: 'Skin Care', classAvg: 77, weight: 'Medium' },
  { topic: 'Nail Care', classAvg: 69, weight: 'Low' },
]

const recentActivity = [
  { student: 'Alex Johnson', action: 'Completed Chapter 12 quiz', time: '2 hours ago', score: 92 },
  { student: 'Morgan Lee', action: 'Completed diagnostic exam', time: '1 hour ago', score: 83 },
  { student: 'Taylor Williams', action: 'Reviewed 45 flashcards', time: '3 hours ago' },
  { student: 'Maria Garcia', action: 'Missed Chapter 8 quiz', time: '1 day ago', score: 58 },
  { student: 'Riley Brown', action: 'Retested Chapter 11', time: '2 days ago', score: 62 },
]

// ───────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────

function lastConfidence(student: Student): number {
  return student.confidenceTrend[student.confidenceTrend.length - 1] ?? 0
}

function isInactive(student: Student): boolean {
  if (student.lastActive.toLowerCase().includes('inactive')) return true
  const match = student.lastActive.match(/(\d+)\s*(day|days)/i)
  if (match) {
    const days = parseInt(match[1], 10)
    return days >= 7
  }
  return false
}

function classActionForTopic(topic: string): string {
  const actions: Record<string, string> = {
    'Chemical Services': 'Schedule a group review of chemical processing steps, timing, and safety protocols; assign targeted practice quizzes.',
    'Nail Care': 'Run a hands-on nail anatomy and disorder identification workshop; reinforce with flashcards.',
    'Hair & Scalp': 'Host a case-study session on contagious scalp conditions and treatment contraindications.',
    'Infection Control': 'Mandate an infection-control refresher and sanitation walkthrough; retest within 48 hours.',
    'Anatomy & Physiology': 'Review body systems with visual aids and peer-teaching rounds.',
    'Skin Care': 'Clarify skin disorders and product ingredients with demo videos and comprehension checks.',
  }
  return actions[topic] || `Provide targeted review and practice for ${topic}.`
}

function studentsBelowTopicTarget(students: Student[], topicName: string): number {
  return students.filter((s) => {
    const topic = s.topicMastery.find((t) => t.topic === topicName)
    return (topic && topic.score < 70) || s.readiness < 70
  }).length
}

function RiskBadge({ status }: { status: string }) {
  const styles = {
    high: 'bg-red-500/10 text-red-400 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    low: 'bg-green-500/10 text-green-400 border-green-500/20',
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)} Risk
    </span>
  )
}

function ProgressBar({ value, color = '#D4AF37' }: { value: number; color?: string }) {
  return (
    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
      />
    </div>
  )
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#D4AF37' : '#f87171'
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeDasharray={`${score * 2.26} 226`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-lg font-bold text-white">{score}%</span>
    </div>
  )
}

function FilterButton({
  value,
  label,
  currentFilter,
  onChange,
}: {
  value: 'all' | 'on-track' | 'needs-attention' | 'inactive'
  label: string
  currentFilter: string
  onChange: (value: 'all' | 'on-track' | 'needs-attention' | 'inactive') => void
}) {
  return (
    <button
      onClick={() => onChange(value)}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        currentFilter === value
          ? 'bg-[#D4AF37] text-[#0a0a0a]'
          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
      }`}
    >
      {label}
    </button>
  )
}

function openReport(title: string, html: string) {
  const win = window.open('', '_blank')
  if (!win) {
    alert('Please allow popups to view the report.')
    return
  }
  win.document.write(html)
  win.document.close()
  win.focus()
  // Open the browser print preview for a premium presentation experience
  win.addEventListener('load', () => {
    setTimeout(() => win.print(), 400)
  })
}

function downloadCsv(students: Student[]) {
  const headers = ['Name', 'Program', 'Readiness', 'Confidence', 'Recent Quiz Score', 'Last Active', 'Weakest Topic', 'Risk Status', 'Quizzes Taken', 'Average Score', 'Recommended Action']
  const rows = students.map((s) => [
    s.name,
    s.program,
    `${s.readiness}%`,
    `${lastConfidence(s)}%`,
    `${s.avgScore}%`,
    s.lastActive,
    s.weakestTopic,
    s.riskStatus,
    s.quizzesTaken.toString(),
    `${s.avgScore}%`,
    s.recommendedAction,
  ])
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'ascyn-pro-demo-roster.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ───────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────

export default function InstructorDemoPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [rosterFilter, setRosterFilter] = useState<'all' | 'on-track' | 'needs-attention' | 'inactive'>('all')
  const [students, setStudents] = useState<Student[]>(sampleStudents)
  const [noteText, setNoteText] = useState('')
  const [noteType, setNoteType] = useState('General')
  const [noteFollowUp, setNoteFollowUp] = useState('This week')
  const [showAddNote, setShowAddNote] = useState(false)
  const [noteSaved, setNoteSaved] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Dashboard calculations
  const totalStudents = students.length
  const onTrackStudents = students.filter((s) => s.riskStatus === 'low' && !isInactive(s))
  const needsAttentionStudents = students.filter((s) => s.riskStatus === 'medium' || s.riskStatus === 'high')
  const inactiveStudents = students.filter((s) => isInactive(s))
  const averageReadiness = Math.round(students.reduce((acc, s) => acc + s.readiness, 0) / students.length)
  const averageConfidence = Math.round(students.reduce((acc, s) => acc + lastConfidence(s), 0) / students.length)
  const averageQuizScore = Math.round(students.reduce((acc, s) => acc + s.avgScore, 0) / students.length)

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase())
    let matchesFilter = true
    if (rosterFilter === 'on-track') matchesFilter = s.riskStatus === 'low' && !isInactive(s)
    if (rosterFilter === 'needs-attention') matchesFilter = s.riskStatus === 'medium' || s.riskStatus === 'high'
    if (rosterFilter === 'inactive') matchesFilter = isInactive(s)
    return matchesSearch && matchesFilter
  })

  const sortedNeedsAttention = [...needsAttentionStudents].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return (order[a.riskStatus as keyof typeof order] ?? 99) - (order[b.riskStatus as keyof typeof order] ?? 99)
  })

  const topWeakAreas = [...heatmapTopics].sort((a, b) => a.classAvg - b.classAvg).slice(0, 3)

  const openStudent = (student: Student) => {
    setSelectedStudent(student)
    setNoteText('')
    setNoteSaved(false)
    setShowAddNote(false)
  }

  const closeModal = () => {
    setSelectedStudent(null)
  }

  useEffect(() => {
    if (selectedStudent) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedStudent])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal()
    }
    if (selectedStudent) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedStudent])

  const addNote = () => {
    if (!selectedStudent || !noteText.trim()) return
    const updated = students.map((s) => {
      if (s.id !== selectedStudent.id) return s
      return {
        ...s,
        notes: [
          ...s.notes,
          {
            id: Date.now().toString(),
            text: noteText,
            type: noteType,
            followUp: noteFollowUp,
            date: new Date().toLocaleDateString(),
          },
        ],
      }
    })
    setStudents(updated)
    setSelectedStudent(updated.find((s) => s.id === selectedStudent.id) || null)
    setNoteText('')
    setNoteSaved(true)
    setShowAddNote(false)
    setTimeout(() => setNoteSaved(false), 4000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="ASCYN PRO" className="h-7 w-auto" />
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/demo"
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                Demo Home
              </Link>
              <Link
                href="/demo/student"
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                Student Demo
              </Link>
              <Link
                href="/pilot"
                className="px-4 py-2 text-sm font-semibold bg-[#D4AF37] text-[#0a0a0a] rounded-lg hover:bg-[#F4E4A6] transition-colors"
              >
                Request Pilot Access
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Banner */}
      <div className="relative sm:fixed top-auto sm:top-16 left-0 right-0 z-30 bg-[#D4AF37]/10 border-b border-[#D4AF37]/20 px-4 py-3 pb-4 sm:py-2 sm:pb-2 mt-16 sm:mt-0 mb-6 sm:mb-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold rounded">PRESENTATION DEMO</span>
              <span className="text-gray-300 text-sm">This demonstration uses sample student data and does not contain real student records.</span>
            </div>
          </div>
          <p className="text-xs text-[#D4AF37]/80 mt-1">
            Start with <span className="font-semibold">Students Needing Attention</span>, open a student profile, review the risk explanation, and add an intervention note.
          </p>
        </div>
      </div>

      {/* Header */}
      <header className="pt-8 sm:pt-40 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="text-[#D4AF37] font-semibold text-sm mb-2">INSTRUCTOR PORTAL — DEMO</div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Class Readiness Dashboard</h1>
              <p className="text-gray-400 mt-2">Demo Academy • Summer 2026 Cohort</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => openReport('Class Report', generateClassReportHtml(students, heatmapTopics))}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Class Report
              </button>
              <button
                onClick={() => downloadCsv(students)}
                className="px-4 py-2 bg-[#D4AF37] text-[#0a0a0a] rounded-lg text-sm font-bold hover:bg-[#F4E4A6] transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        {/* 1. Dashboard Overview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Dashboard Overview</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-[#111111] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-gray-500 text-xs uppercase tracking-wider font-medium">Total Students</div>
                <Users className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="text-2xl font-bold text-white">{totalStudents}</div>
              <div className="text-xs text-gray-500 mt-1">Across 2 programs</div>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-gray-500 text-xs uppercase tracking-wider font-medium">On Track</div>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{onTrackStudents.length}</div>
              <div className="text-xs text-gray-500 mt-1">Low risk & active</div>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-gray-500 text-xs uppercase tracking-wider font-medium">Needs Attention</div>
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-white">{needsAttentionStudents.length}</div>
              <div className="text-xs text-gray-500 mt-1">Medium or high risk</div>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-gray-500 text-xs uppercase tracking-wider font-medium">Inactive</div>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-white">{inactiveStudents.length}</div>
              <div className="text-xs text-gray-500 mt-1">No activity 7+ days</div>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-gray-500 text-xs uppercase tracking-wider font-medium">Avg Readiness</div>
                <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="text-2xl font-bold text-white">{averageReadiness}%</div>
              <ProgressBar value={averageReadiness} />
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-gray-500 text-xs uppercase tracking-wider font-medium">Avg Confidence</div>
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="text-2xl font-bold text-white">{averageConfidence}%</div>
              <ProgressBar value={averageConfidence} />
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-gray-500 text-xs uppercase tracking-wider font-medium">Avg Quiz Score</div>
                <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="text-2xl font-bold text-white">{averageQuizScore}%</div>
              <ProgressBar value={averageQuizScore} />
            </div>
          </div>
        </section>

        {/* 2. Priority Action Panel */}
        <section className="bg-gradient-to-br from-red-500/5 to-[#111111] border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h2 className="text-xl font-bold text-white">Students Needing Attention</h2>
            <span className="ml-2 px-2 py-0.5 bg-red-500/10 text-red-400 text-xs font-bold rounded-full border border-red-500/20">
              {sortedNeedsAttention.length}
            </span>
          </div>

          {sortedNeedsAttention.length === 0 ? (
            <p className="text-gray-400 text-sm">All students are currently on track.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedNeedsAttention.map((student) => {
                const weakTopics = student.topicMastery.filter((t) => t.score < 70)
                const explanations: string[] = []
                if (student.readiness < 70) explanations.push(`Readiness score is ${student.readiness}%, below the 70% target.`)
                if (isInactive(student)) explanations.push(`Inactive recently (${student.lastActive}).`)
                if (student.avgScore < 70) explanations.push(`Recent quiz average is ${student.avgScore}%, suggesting knowledge gaps.`)
                const confidenceFirst = student.confidenceTrend[0] ?? 0
                const confidenceLast = lastConfidence(student)
                if (confidenceLast < confidenceFirst) explanations.push(`Confidence has dropped from ${confidenceFirst}% to ${confidenceLast}%.`)
                if (weakTopics.length > 0) explanations.push(`Weak areas include ${weakTopics.map((t) => t.topic).join(', ')}.`)

                return (
                  <div
                    key={student.id}
                    className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 hover:border-red-500/30 transition-colors flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold">{student.name}</h3>
                        <p className="text-gray-500 text-xs">{student.program} • {student.lastActive}</p>
                      </div>
                      <RiskBadge status={student.riskStatus} />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-[#111111] border border-white/10 rounded-lg p-3">
                        <div className="text-gray-500 text-xs mb-1">Readiness</div>
                        <div className={`text-lg font-bold ${student.readiness >= 80 ? 'text-green-400' : student.readiness >= 60 ? 'text-[#D4AF37]' : 'text-red-400'}`}>
                          {student.readiness}%
                        </div>
                      </div>
                      <div className="bg-[#111111] border border-white/10 rounded-lg p-3">
                        <div className="text-gray-500 text-xs mb-1">Weak Topic</div>
                        <div className="text-sm font-medium text-white truncate">{student.weakestTopic}</div>
                      </div>
                    </div>

                    <div className="mb-4 flex-1">
                      <div className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-2">Risk Explanation</div>
                      <ul className="space-y-1.5">
                        {explanations.slice(0, 3).map((explanation, idx) => (
                          <li key={idx} className="text-red-400/90 text-xs flex items-start gap-1.5">
                            <span className="mt-0.5">•</span>
                            {explanation}
                          </li>
                        ))}
                        {explanations.length > 3 && (
                          <li className="text-red-400/70 text-xs">+{explanations.length - 3} more flags</li>
                        )}
                      </ul>
                    </div>

                    <div className="bg-[#111111] border border-white/10 rounded-lg p-3 mb-4">
                      <div className="text-[#D4AF37] text-xs uppercase tracking-wider font-medium mb-1">Recommended Instructor Action</div>
                      <p className="text-gray-300 text-sm leading-snug">{student.recommendedAction}</p>
                    </div>

                    <button
                      onClick={() => openStudent(student)}
                      className="w-full px-4 py-2 bg-[#D4AF37] text-[#0a0a0a] rounded-lg text-sm font-bold hover:bg-[#F4E4A6] transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Review Student
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* 3. Student Roster */}
        <section className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Student Roster</h2>
                <p className="text-gray-500 text-sm mt-1">Tap a student to view their detailed readiness profile</p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <FilterButton value="all" label="All" currentFilter={rosterFilter} onChange={setRosterFilter} />
                  <FilterButton value="on-track" label="On track" currentFilter={rosterFilter} onChange={setRosterFilter} />
                  <FilterButton value="needs-attention" label="Needs attention" currentFilter={rosterFilter} onChange={setRosterFilter} />
                  <FilterButton value="inactive" label="Inactive" currentFilter={rosterFilter} onChange={setRosterFilter} />
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 w-full sm:w-48"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden">
            {filteredStudents.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No students match your search.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => openStudent(student)}
                    className="w-full text-left p-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-semibold text-sm shrink-0">
                          {student.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <div className="text-white font-medium truncate">{student.name}</div>
                          <div className="text-gray-500 text-xs truncate">{student.program}</div>
                        </div>
                      </div>
                      <RiskBadge status={student.riskStatus} />
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <div className="text-gray-500 text-xs">Readiness</div>
                        <div className="text-white font-semibold text-sm">{student.readiness}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">Confidence</div>
                        <div className="text-white font-semibold text-sm">{lastConfidence(student)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs">Quiz Avg</div>
                        <div className="text-white font-semibold text-sm">{student.avgScore}%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-gray-500 text-xs">Last active: {student.lastActive}</div>
                      <span className="inline-flex items-center gap-1 text-[#D4AF37] text-xs font-medium">
                        View <Eye className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs text-gray-500 uppercase">
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Program</th>
                  <th className="px-4 py-3 font-medium">Readiness</th>
                  <th className="px-4 py-3 font-medium">Confidence</th>
                  <th className="px-4 py-3 font-medium">Recent Quiz</th>
                  <th className="px-4 py-3 font-medium">Last Active</th>
                  <th className="px-4 py-3 font-medium">Risk Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                    onClick={() => openStudent(student)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-semibold text-sm">
                          {student.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-white font-medium text-sm">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{student.program}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm w-8">{student.readiness}%</span>
                        <ProgressBar
                          value={student.readiness}
                          color={student.readiness >= 80 ? '#4ade80' : student.readiness >= 60 ? '#D4AF37' : '#f87171'}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white text-sm font-medium">{lastConfidence(student)}%</td>
                    <td className="px-4 py-3 text-white text-sm font-medium">{student.avgScore}%</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{student.lastActive}</td>
                    <td className="px-4 py-3">
                      <RiskBadge status={student.riskStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openStudent(student)
                        }}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 4. Class Weak-Area Summary */}
          <section className="lg:col-span-2 bg-[#111111] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-xl font-bold text-white">Class Weak-Area Summary</h2>
            </div>
            <div className="space-y-4">
              {topWeakAreas.map((topic) => {
                const belowTarget = studentsBelowTopicTarget(students, topic.topic)
                return (
                  <div key={topic.topic} className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-semibold">{topic.topic}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                          topic.weight === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20'
                        }`}>
                          {topic.weight} Weight
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white">{topic.classAvg}%</div>
                    </div>
                    <div className="mb-3">
                      <ProgressBar value={topic.classAvg} color={topic.classAvg < 65 ? '#f87171' : topic.classAvg < 80 ? '#D4AF37' : '#4ade80'} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                      <span className="text-red-400">
                        {belowTarget} student{belowTarget === 1 ? '' : 's'} below target
                      </span>
                      <span className="text-gray-400">{classActionForTopic(topic.topic)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 5. Recent Activity */}
          <section className="bg-[#111111] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-lg font-bold text-white">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2" />
                  <div>
                    <p className="text-white text-sm font-medium">{activity.student}</p>
                    <p className="text-gray-500 text-xs">{activity.action}</p>
                    <p className="text-gray-600 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 6. Reporting */}
        <section className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Reports</h2>
              <p className="text-gray-400 text-sm mt-1">Generate shareable readiness reports for students or administrators.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => openReport('Class Report', generateClassReportHtml(students, heatmapTopics))}
                className="px-5 py-3 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                View Class Report
              </button>
              <button
                onClick={() => downloadCsv(students)}
                className="px-5 py-3 bg-[#D4AF37] text-[#0a0a0a] rounded-lg text-sm font-bold hover:bg-[#F4E4A6] transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Individual Student Modal + 8. Intervention Notes */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal()
          }}
        >
          <div
            ref={modalRef}
            className="bg-[#111111] border border-white/10 rounded-none sm:rounded-2xl w-full max-w-4xl max-h-none sm:max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#111111] border-b border-white/10 p-4 sm:p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold text-sm sm:text-lg shrink-0">
                  {selectedStudent.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-white truncate">{selectedStudent.name}</h2>
                  <p className="text-gray-500 text-xs sm:text-sm truncate">{selectedStudent.program} • {selectedStudent.quizzesTaken} quizzes</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Top Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 text-center">
                  <div className="text-gray-500 text-sm mb-3">Overall Readiness</div>
                  <div className="flex justify-center mb-3">
                    <ScoreRing score={selectedStudent.readiness} />
                  </div>
                  <RiskBadge status={selectedStudent.riskStatus} />
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
                  <div className="text-gray-500 text-sm mb-3">Confidence Level</div>
                  <div className="text-3xl font-bold text-white mb-2">{lastConfidence(selectedStudent)}%</div>
                  <ProgressBar value={lastConfidence(selectedStudent)} color={lastConfidence(selectedStudent) >= 80 ? '#4ade80' : lastConfidence(selectedStudent) >= 60 ? '#D4AF37' : '#f87171'} />
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
                  <div className="text-gray-500 text-sm mb-3">Recent Quiz Performance</div>
                  <div className="text-3xl font-bold text-white mb-2">{selectedStudent.avgScore}%</div>
                  <ProgressBar value={selectedStudent.avgScore} color={selectedStudent.avgScore >= 80 ? '#4ade80' : selectedStudent.avgScore >= 60 ? '#D4AF37' : '#f87171'} />
                  <div className="text-xs text-gray-500 mt-2">{selectedStudent.quizzesTaken} quizzes taken</div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
                  <div className="text-gray-500 text-sm mb-3">Last Activity</div>
                  <div className="text-xl font-bold text-white mb-2">{selectedStudent.lastActive}</div>
                  <p className="text-gray-400 text-sm leading-relaxed">{selectedStudent.recentActivity}</p>
                </div>
              </div>

              {/* Recommended Instructor Action */}
              <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl p-5">
                <h3 className="text-sm font-bold text-[#D4AF37] mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Recommended Instructor Action
                </h3>
                <p className="text-white text-sm leading-relaxed">{selectedStudent.recommendedAction}</p>
              </div>

              {/* Risk Explanations */}
              {selectedStudent.riskStatus !== 'low' && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Why This Student Was Flagged
                  </h3>
                  <ul className="space-y-2">
                    {selectedStudent.riskFactors.map((factor, idx) => (
                      <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">•</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Strong & Weak Topics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Strong Topics <span className="text-sm font-normal text-gray-500">(≥75%)</span></h3>
                  <div className="space-y-3">
                    {selectedStudent.topicMastery.filter((t) => t.score >= 80).length === 0 ? (
                      <p className="text-gray-500 text-sm">No topics above 75% yet.</p>
                    ) : (
                      selectedStudent.topicMastery
                        .filter((t) => t.score >= 80)
                        .map((topic) => (
                          <div key={topic.topic} className="bg-[#0a0a0a] border border-white/10 rounded-lg p-3">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-300">{topic.topic}</span>
                              <span className="text-green-400 font-medium">{topic.score}%</span>
                            </div>
                            <ProgressBar value={topic.score} color="#4ade80" />
                          </div>
                        ))
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Weak Topics <span className="text-sm font-normal text-gray-500">(&lt;70%)</span></h3>
                  <div className="space-y-3">
                    {selectedStudent.topicMastery.filter((t) => t.score < 70).length === 0 ? (
                      <p className="text-gray-500 text-sm">No topics below 70% — great work!</p>
                    ) : (
                      selectedStudent.topicMastery
                        .filter((t) => t.score < 70)
                        .map((topic) => (
                          <div key={topic.topic} className="bg-[#0a0a0a] border border-white/10 rounded-lg p-3">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-300">{topic.topic}</span>
                              <span className="text-red-400 font-medium">{topic.score}%</span>
                            </div>
                            <ProgressBar value={topic.score} color="#f87171" />
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>

              {/* Topic Mastery */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">All Topic Mastery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedStudent.topicMastery.map((topic) => (
                    <div key={topic.topic} className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">{topic.topic}</span>
                        <span className="text-white font-medium">{topic.score}%</span>
                      </div>
                      <ProgressBar
                        value={topic.score}
                        color={topic.score >= 80 ? '#4ade80' : topic.score >= 60 ? '#D4AF37' : '#f87171'}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiz History */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Quiz History</h3>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-xs text-gray-500 uppercase">
                        <th className="px-4 py-3">Chapter</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.quizHistory.map((quiz, idx) => (
                        <tr key={idx} className="border-b border-white/5">
                          <td className="px-4 py-3 text-white text-sm">{quiz.chapter}</td>
                          <td className="px-4 py-3 text-gray-500 text-sm">{quiz.date}</td>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-medium ${quiz.score >= 80 ? 'text-green-400' : quiz.score >= 60 ? 'text-[#D4AF37]' : 'text-red-400'}`}>
                              {quiz.score}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reporting buttons inside modal */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => openReport('Student Report', generateStudentReportHtml(selectedStudent))}
                  className="px-5 py-3 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  View Student Report
                </button>
                <button
                  onClick={() => downloadCsv([selectedStudent])}
                  className="px-5 py-3 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export This Student
                </button>
              </div>

              {/* Intervention Notes */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Instructor Notes</h3>
                  <button
                    onClick={() => setShowAddNote(!showAddNote)}
                    className="px-3 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37]/20 transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Add Note
                  </button>
                </div>

                <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-lg p-3 mb-4">
                  <p className="text-[#D4AF37] text-sm flex items-start gap-2">
                    <span className="font-bold">Demo:</span>
                    Notes are saved in your browser session and will reset when the page refreshes.
                  </p>
                </div>

                {noteSaved && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Note saved successfully.</span>
                  </div>
                )}

                {showAddNote && (
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 mb-4">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Enter intervention note..."
                      rows={3}
                      className="w-full px-4 py-3 bg-[#111111] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 resize-none mb-4"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Intervention Type</label>
                        <select
                          value={noteType}
                          onChange={(e) => setNoteType(e.target.value)}
                          className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                        >
                          <option>General</option>
                          <option>1:1 Meeting</option>
                          <option>Extra Practice</option>
                          <option>Parent Contact</option>
                          <option>Academic Referral</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-2">Follow-Up</label>
                        <select
                          value={noteFollowUp}
                          onChange={(e) => setNoteFollowUp(e.target.value)}
                          className="w-full px-3 py-2 bg-[#111111] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
                        >
                          <option>This week</option>
                          <option>Next week</option>
                          <option>Before exam</option>
                          <option>Ongoing</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowAddNote(false)}
                        className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addNote}
                        disabled={!noteText.trim()}
                        className="px-4 py-2 bg-[#D4AF37] text-[#0a0a0a] rounded-lg text-sm font-bold hover:bg-[#F4E4A6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        Save Note
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {selectedStudent.notes.length === 0 ? (
                    <p className="text-gray-500 text-sm">No notes yet. Add an intervention note to track follow-up.</p>
                  ) : (
                    selectedStudent.notes.map((note: Note) => (
                      <div key={note.id} className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[#D4AF37] text-xs font-medium px-2 py-0.5 bg-[#D4AF37]/10 rounded">{note.type}</span>
                            <span className="text-gray-500 text-xs">Follow-up: {note.followUp}</span>
                          </div>
                          <span className="text-gray-600 text-xs">{note.date}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{note.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <img src="/logo.svg" alt="ASCYN PRO" className="h-6 w-auto" />
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 ASCYN PRO. Built for future licensed professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
