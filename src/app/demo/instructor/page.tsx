'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  FileText,
  Filter,
  GraduationCap,
  LayoutDashboard,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  TrendingDown,
  TrendingUp,
  User,
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
  notes: Note[]
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
    recommendedAction: 'Schedule 1:1 review of Oklahoma state rules and sanitation protocols.',
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
    recommendedAction: 'Continue retest loop on chemical services until score reaches 75%.',
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
    notes: [],
  },
]

const heatmapTopics = [
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
// COMPONENTS
// ────────────────────────────────────────────

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
  const color = score >= 75 ? '#4ade80' : score >= 60 ? '#D4AF37' : '#f87171'
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

export default function InstructorDemoPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')
  const [students, setStudents] = useState(sampleStudents)
  const [noteText, setNoteText] = useState('')
  const [noteType, setNoteType] = useState('General')
  const [noteFollowUp, setNoteFollowUp] = useState('This week')
  const [showAddNote, setShowAddNote] = useState(false)

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRisk = riskFilter === 'all' || s.riskStatus === riskFilter
    return matchesSearch && matchesRisk
  })

  const atRiskStudents = students.filter((s) => s.riskStatus !== 'low')
  const classAverage = Math.round(students.reduce((acc, s) => acc + s.readiness, 0) / students.length)
  const activeStudents = students.filter((s) => !s.lastActive.includes('days ago') || parseInt(s.lastActive) < 4).length

  const openStudent = (student: Student) => {
    setSelectedStudent(student)
    setNoteText('')
    setShowAddNote(false)
  }

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
    setShowAddNote(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-sm">
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
                href="/pilot"
                className="px-4 py-2 text-sm font-semibold bg-[#D4AF37] text-[#0a0a0a] rounded-lg hover:bg-[#F4E4A6] transition-colors"
              >
                Request Pilot Access
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-28 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="text-[#D4AF37] font-semibold text-sm mb-2">INSTRUCTOR PORTAL — DEMO</div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Class Readiness Dashboard</h1>
              <p className="text-gray-400 mt-2">Demo Barber Academy • Summer 2026 Cohort</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </button>
              <button className="px-4 py-2 bg-[#D4AF37] text-[#0a0a0a] rounded-lg text-sm font-bold hover:bg-[#F4E4A6] transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Class Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        {/* 1. Class Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-500 text-sm">Total Students</div>
              <Users className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="text-3xl font-bold text-white">{students.length}</div>
            <div className="text-xs text-gray-500 mt-1">Across 2 programs</div>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-500 text-sm">Active This Week</div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white">{activeStudents}</div>
            <div className="text-xs text-gray-500 mt-1">{Math.round((activeStudents / students.length) * 100)}% engagement</div>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-500 text-sm">Students At Risk</div>
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-white">{atRiskStudents.length}</div>
            <div className="text-xs text-gray-500 mt-1">Need intervention</div>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-500 text-sm">Avg Readiness</div>
              <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div className="text-3xl font-bold text-white">{classAverage}%</div>
            <ProgressBar value={classAverage} />
          </div>
        </section>

        {/* 4. Weak-Area Heat Map */}
        <section className="bg-[#111111] border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Class Weak-Area Heat Map</h2>
              <p className="text-gray-500 text-sm mt-1">Average class performance by topic</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-red-500/40" />
                <span className="text-gray-400">At Risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#D4AF37]/60" />
                <span className="text-gray-400">Developing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-green-500/40" />
                <span className="text-gray-400">Strong</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {heatmapTopics.map((topic) => {
              const color = topic.classAvg < 65 ? 'rgba(248,113,113,0.4)' : topic.classAvg < 80 ? 'rgba(212,175,39,0.6)' : 'rgba(74,222,128,0.4)'
              return (
                <div key={topic.topic} className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium">{topic.topic}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      topic.weight === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20'
                    }`}>
                      {topic.weight} Weight
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-white">{topic.classAvg}%</div>
                    <div className="flex-1">
                      <ProgressBar value={topic.classAvg} color={topic.classAvg < 65 ? '#f87171' : topic.classAvg < 80 ? '#D4AF37' : '#4ade80'} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 2. Student Roster */}
          <section className="lg:col-span-2 bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Student Roster</h2>
                  <p className="text-gray-500 text-sm mt-1">Tap a student to view detailed readiness profile</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50"
                    />
                  </div>
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#D4AF37]/50"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="high">High Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="low">Low Risk</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs text-gray-500 uppercase">
                    <th className="px-6 py-3 font-medium">Student</th>
                    <th className="px-6 py-3 font-medium">Program</th>
                    <th className="px-6 py-3 font-medium">Readiness</th>
                    <th className="px-6 py-3 font-medium">Weakest Topic</th>
                    <th className="px-6 py-3 font-medium">Risk</th>
                    <th className="px-6 py-3 font-medium">Recent Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      onClick={() => openStudent(student)}
                      className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-semibold text-sm">
                            {student.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span className="text-white font-medium">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{student.program}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-semibold w-9">{student.readiness}%</span>
                          <ProgressBar
                            value={student.readiness}
                            color={student.readiness >= 75 ? '#4ade80' : student.readiness >= 60 ? '#D4AF37' : '#f87171'}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{student.weakestTopic}</td>
                      <td className="px-6 py-4">
                        <RiskBadge status={student.riskStatus} />
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{student.recentActivity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. At-Risk Alerts + Recent Activity */}
          <div className="space-y-8">
            <section className="bg-[#111111] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h2 className="text-lg font-bold text-white">At-Risk Alerts</h2>
              </div>
              <div className="space-y-3">
                {atRiskStudents.length === 0 ? (
                  <p className="text-gray-500 text-sm">No students currently at risk.</p>
                ) : (
                  atRiskStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => openStudent(student)}
                      className="w-full text-left p-4 bg-[#0a0a0a] border border-white/10 rounded-lg hover:border-red-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-medium">{student.name}</span>
                        <RiskBadge status={student.riskStatus} />
                      </div>
                      <p className="text-gray-500 text-sm">{student.recentActivity}</p>
                      <p className="text-red-400 text-xs mt-2">Risk factor: {student.readiness < 50 ? 'Low readiness score' : student.lastActive.includes('5 days') ? 'Inactivity' : 'Repeated weak area'}</p>
                    </button>
                  ))
                )}
              </div>
            </section>

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
        </div>

        {/* 7. Reporting */}
        <section className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Reports</h2>
              <p className="text-gray-400 text-sm mt-1">Generate shareable readiness reports for students or administrators.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-5 py-3 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                <User className="w-4 h-4" />
                View Student Report
              </button>
              <button className="px-5 py-3 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                <Users className="w-4 h-4" />
                View Class Report
              </button>
              <button className="px-5 py-3 bg-[#D4AF37] text-[#0a0a0a] rounded-lg text-sm font-bold hover:bg-[#F4E4A6] transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 5. Individual Student Modal + 6. Intervention Notes */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#111111] border-b border-white/10 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold text-lg">
                  {selectedStudent.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedStudent.name}</h2>
                  <p className="text-gray-500 text-sm">{selectedStudent.program} • {selectedStudent.quizzesTaken} quizzes taken</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 text-center">
                  <div className="text-gray-500 text-sm mb-3">Overall Readiness</div>
                  <div className="flex justify-center mb-3">
                    <ScoreRing score={selectedStudent.readiness} />
                  </div>
                  <RiskBadge status={selectedStudent.riskStatus} />
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
                  <div className="text-gray-500 text-sm mb-3">Confidence Trend</div>
                  <div className="flex items-end gap-1 h-16">
                    {selectedStudent.confidenceTrend.map((score, idx) => (
                      <div
                        key={idx}
                        className="flex-1 rounded-t"
                        style={{
                          height: `${score}%`,
                          backgroundColor: score >= 75 ? '#4ade80' : score >= 60 ? '#D4AF37' : '#f87171',
                          opacity: 0.8,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>Jun</span>
                    <span>Jul</span>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
                  <div className="text-gray-500 text-sm mb-3">Recommended Action</div>
                  <p className="text-white text-sm leading-relaxed">{selectedStudent.recommendedAction}</p>
                </div>
              </div>

              {/* Topic Mastery */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Topic Mastery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedStudent.topicMastery.map((topic) => (
                    <div key={topic.topic} className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">{topic.topic}</span>
                        <span className="text-white font-medium">{topic.score}%</span>
                      </div>
                      <ProgressBar
                        value={topic.score}
                        color={topic.score >= 75 ? '#4ade80' : topic.score >= 60 ? '#D4AF37' : '#f87171'}
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
                            <span className={`text-sm font-medium ${quiz.score >= 75 ? 'text-green-400' : quiz.score >= 60 ? 'text-[#D4AF37]' : 'text-red-400'}`}>
                              {quiz.score}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
    </div>
  )
}
