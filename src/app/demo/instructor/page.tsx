'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Menu,
  Plus,
  Save,
  Search,
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
  riskFactors: string[]
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
    recommendedAction: 'Continue retest loop on chemical services until score reaches 75%.',
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
// HELPERS
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

function generateStudentReportHtml(student: Student): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>ASCYN PRO — Student Readiness Report</title>
        <style>
          body { font-family: Inter, system-ui, sans-serif; color: #1a1a1a; background: #fff; padding: 40px; line-height: 1.5; }
          .header { border-bottom: 3px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 700; color: #0a0a0a; }
          .subtitle { color: #666; font-size: 14px; margin-top: 4px; }
          h1 { font-size: 28px; margin: 0 0 8px; }
          h2 { font-size: 18px; margin: 30px 0 12px; color: #0a0a0a; border-bottom: 1px solid #eee; padding-bottom: 8px; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 20px 0; }
          .card { border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; }
          .label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
          .value { font-size: 24px; font-weight: 700; }
          .risk-high { color: #ef4444; }
          .risk-medium { color: #eab308; }
          .risk-low { color: #22c55e; }
          .topic { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .bar { height: 8px; background: #f3f3f3; border-radius: 4px; margin-top: 4px; }
          .bar-fill { height: 100%; border-radius: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { text-align: left; padding: 10px; border-bottom: 1px solid #eee; }
          th { font-size: 12px; text-transform: uppercase; color: #666; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">ASCYN PRO</div>
          <div class="subtitle">Student Readiness Report — Presentation Demo</div>
        </div>
        <h1>${student.name}</h1>
        <p>${student.program} • Demo Barber Academy</p>
        <div class="grid">
          <div class="card">
            <div class="label">Board Readiness</div>
            <div class="value ${student.readiness >= 75 ? 'risk-low' : student.readiness >= 60 ? 'risk-medium' : 'risk-high'}">${student.readiness}%</div>
          </div>
          <div class="card">
            <div class="label">Average Quiz Score</div>
            <div class="value">${student.avgScore}%</div>
          </div>
          <div class="card">
            <div class="label">Risk Level</div>
            <div class="value ${student.riskStatus === 'high' ? 'risk-high' : student.riskStatus === 'medium' ? 'risk-medium' : 'risk-low'}">${student.riskStatus.toUpperCase()}</div>
          </div>
        </div>
        <h2>Topic Mastery</h2>
        ${student.topicMastery.map(t => {
          const color = t.score >= 75 ? '#22c55e' : t.score >= 60 ? '#D4AF37' : '#ef4444'
          return `
            <div style="margin-bottom: 12px;">
              <div class="topic"><span>${t.topic}</span><span>${t.score}%</span></div>
              <div class="bar"><div class="bar-fill" style="width: ${t.score}%; background: ${color};"></div></div>
            </div>
          `
        }).join('')}
        <h2>Quiz History</h2>
        <table>
          <thead><tr><th>Chapter</th><th>Date</th><th>Score</th></tr></thead>
          <tbody>
            ${student.quizHistory.map(q => `<tr><td>${q.chapter}</td><td>${q.date}</td><td>${q.score}%</td></tr>`).join('')}
          </tbody>
        </table>
        <h2>Recommended Action</h2>
        <p>${student.recommendedAction}</p>
        <div class="footer">
          Generated by ASCYN PRO demonstration environment. Data is simulated and does not contain real student records.
        </div>
      </body>
    </html>
  `
}

function generateClassReportHtml(students: Student[]): string {
  const classAverage = Math.round(students.reduce((acc, s) => acc + s.readiness, 0) / students.length)
  const atRiskCount = students.filter(s => s.riskStatus !== 'low').length
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>ASCYN PRO — Class Readiness Report</title>
        <style>
          body { font-family: Inter, system-ui, sans-serif; color: #1a1a1a; background: #fff; padding: 40px; line-height: 1.5; }
          .header { border-bottom: 3px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 700; color: #0a0a0a; }
          .subtitle { color: #666; font-size: 14px; margin-top: 4px; }
          h1 { font-size: 28px; margin: 0 0 8px; }
          h2 { font-size: 18px; margin: 30px 0 12px; color: #0a0a0a; border-bottom: 1px solid #eee; padding-bottom: 8px; }
          .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
          .card { border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; }
          .label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
          .value { font-size: 24px; font-weight: 700; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { text-align: left; padding: 10px; border-bottom: 1px solid #eee; }
          th { font-size: 12px; text-transform: uppercase; color: #666; }
          .risk-high { color: #ef4444; font-weight: 600; }
          .risk-medium { color: #eab308; font-weight: 600; }
          .risk-low { color: #22c55e; font-weight: 600; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">ASCYN PRO</div>
          <div class="subtitle">Class Readiness Report — Presentation Demo</div>
        </div>
        <h1>Demo Barber Academy</h1>
        <p>Summer 2026 Cohort</p>
        <div class="grid">
          <div class="card"><div class="label">Total Students</div><div class="value">${students.length}</div></div>
          <div class="card"><div class="label">Class Average</div><div class="value">${classAverage}%</div></div>
          <div class="card"><div class="label">At Risk</div><div class="value" style="color: ${atRiskCount > 0 ? '#ef4444' : '#22c55e'};">${atRiskCount}</div></div>
          <div class="card"><div class="label">Programs</div><div class="value">2</div></div>
        </div>
        <h2>Student Roster</h2>
        <table>
          <thead>
            <tr><th>Student</th><th>Program</th><th>Readiness</th><th>Weakest Topic</th><th>Risk</th></tr>
          </thead>
          <tbody>
            ${students.map(s => `
              <tr>
                <td>${s.name}</td>
                <td>${s.program}</td>
                <td>${s.readiness}%</td>
                <td>${s.weakestTopic}</td>
                <td class="${s.riskStatus === 'high' ? 'risk-high' : s.riskStatus === 'medium' ? 'risk-medium' : 'risk-low'}">${s.riskStatus.toUpperCase()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <h2>Class Weak Areas</h2>
        <table>
          <thead><tr><th>Topic</th><th>Class Average</th><th>Exam Weight</th></tr></thead>
          <tbody>
            ${heatmapTopics.map(t => `<tr><td>${t.topic}</td><td>${t.classAvg}%</td><td>${t.weight}</td></tr>`).join('')}
          </tbody>
        </table>
        <div class="footer">
          Generated by ASCYN PRO demonstration environment. Data is simulated and does not contain real student records.
        </div>
      </body>
    </html>
  `
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
}

function downloadCsv(students: Student[]) {
  const headers = ['Name', 'Program', 'Readiness', 'Weakest Topic', 'Risk Status', 'Quizzes Taken', 'Average Score', 'Recommended Action']
  const rows = students.map(s => [
    s.name,
    s.program,
    `${s.readiness}%`,
    s.weakestTopic,
    s.riskStatus,
    s.quizzesTaken.toString(),
    `${s.avgScore}%`,
    s.recommendedAction,
  ])
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
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
  const [riskFilter, setRiskFilter] = useState('all')
  const [students, setStudents] = useState<Student[]>(sampleStudents)
  const [noteText, setNoteText] = useState('')
  const [noteType, setNoteType] = useState('General')
  const [noteFollowUp, setNoteFollowUp] = useState('This week')
  const [showAddNote, setShowAddNote] = useState(false)
  const [noteSaved, setNoteSaved] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRisk = riskFilter === 'all' || s.riskStatus === riskFilter
    return matchesSearch && matchesRisk
  })

  const atRiskStudents = students.filter((s) => s.riskStatus !== 'low')
  const classAverage = Math.round(students.reduce((acc, s) => acc + s.readiness, 0) / students.length)
  const activeStudents = students.filter((s) => {
    if (s.lastActive.includes('hour')) return true
    if (s.lastActive.includes('day')) {
      const days = parseInt(s.lastActive.match(/\d+/)?.[0] || '0')
      return days < 4
    }
    return false
  }).length

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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
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
      <div className="fixed top-16 left-0 right-0 z-30 bg-[#D4AF37]/10 border-b border-[#D4AF37]/20 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold rounded">PRESENTATION DEMO</span>
            <span className="text-gray-300 text-sm">This demonstration uses sample student data and does not contain real student records.</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="pt-36 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="text-[#D4AF37] font-semibold text-sm mb-2">INSTRUCTOR PORTAL — DEMO</div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Class Readiness Dashboard</h1>
              <p className="text-gray-400 mt-2">Demo Academy • Summer 2026 Cohort</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => openReport('Class Report', generateClassReportHtml(students))}
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
            {heatmapTopics.map((topic) => (
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
            ))}
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
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 w-full sm:w-auto"
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
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{student.name}</span>
                        <RiskBadge status={student.riskStatus} />
                      </div>
                      <p className="text-gray-500 text-sm mb-2">{student.recentActivity}</p>
                      <div className="space-y-1">
                        {student.riskFactors.slice(0, 2).map((factor, idx) => (
                          <p key={idx} className="text-red-400 text-xs flex items-start gap-1.5">
                            <span className="mt-0.5">•</span>
                            {factor}
                          </p>
                        ))}
                        {student.riskFactors.length > 2 && (
                          <p className="text-red-400/70 text-xs">+{student.riskFactors.length - 2} more flags</p>
                        )}
                      </div>
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
              <button
                onClick={() => openReport('Class Report', generateClassReportHtml(students))}
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

      {/* 5. Individual Student Modal + 6. Intervention Notes */}
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                        className="flex-1 rounded-t min-w-[4px]"
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

              {/* Risk Factors */}
              {selectedStudent.riskFactors.length > 0 && (
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
