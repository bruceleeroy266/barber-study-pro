import { getOfficialMinutes } from '@/lib/hours/reporting'
import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Profile, StudentProgress, QuizAttempt, InstructorNote, HourLog, HourStatus, AttendanceRecord, InstructorAttendanceNote } from '@/types'
import { localChapters, getLocalQuiz } from '@/lib/local-data'
import { allQuizQuestions } from '@/lib/quiz-data'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { demoStudents, demoStudentProgress, demoStudentQuizAttempts, demoInstructorNotes, demoHourLogs, demoAttendanceRecords, demoInstructorAttendanceNotes, demoAcademicPrograms, demoSchool } from '@/lib/demo-data'
import { isDemoDataAllowed } from '@/lib/demo-helpers'
import { defaultProgramRequirements, resolveSchoolState, resolveStudentProgramRequirements } from '@/lib/programs/requirements'
import DemoDataBanner from '@/components/DemoDataBanner'
import { getDemoMissedQuestionsForUser } from '@/lib/demo-analytics'
import { calculateBoardReadiness } from '@/lib/readiness'
import { analyzePerformance } from '@/lib/analytics'
import { generateStudyPlan } from '@/lib/recommendations'
import { calculateAttendanceSummary, getRecentAttendance, getStatusColorClass } from '@/lib/attendance'
import BoardReadinessCard from '@/components/BoardReadinessCard'
import WeakAreaAnalytics from '@/components/WeakAreaAnalytics'
import StudyRecommendations from '@/components/StudyRecommendations'
import AnalyticsCharts from '@/components/AnalyticsCharts'
import MissedQuestionBank from '@/components/MissedQuestionBank'
import StudentIdentity from '@/components/StudentIdentity'
import { AddNoteForm } from './AddNoteForm'
import { PrintButton } from './PrintButton'
import ProgressReportModal from './ProgressReportModal'
import ChapterAccordionGroup, { ChapterAccordionChevron } from './ChapterAccordionGroup'
import BackButton from '@/components/ui/BackButton'
import { getInstructorNotes } from './actions'
import { type Chapter1MicroCheckAttemptRow } from '@/lib/chapter-1-concepts/micro-check-persistence'
import {
  buildChapter1InstructorDiagnostics,
  type Chapter1InstructorQuizAttempt,
} from '@/lib/chapter-1-concepts/instructor-diagnostics'
import { type Chapter2MicroCheckAttemptRow } from '@/lib/chapter-2-concepts/micro-check-persistence'
import {
  buildChapter2InstructorDiagnostics,
  type Chapter2InstructorQuizAttempt,
} from '@/lib/chapter-2-concepts/instructor-diagnostics'
import { type Chapter3MicroCheckAttemptRow } from '@/lib/chapter-3-concepts/micro-check-persistence'
import {
  buildChapter3InstructorDiagnostics,
  type Chapter3InstructorQuizAttempt,
} from '@/lib/chapter-3-concepts/instructor-diagnostics'
import { type Chapter4MicroCheckAttemptRow } from '@/lib/chapter-4-concepts/micro-check-persistence'
import {
  buildChapter4InstructorDiagnostics,
  type Chapter4InstructorQuizAttempt,
} from '@/lib/chapter-4-concepts/instructor-diagnostics'
import { type Chapter5MicroCheckAttemptRow } from '@/lib/chapter-5-concepts/micro-check-persistence'
import {
  buildChapter5InstructorDiagnostics,
  type Chapter5InstructorQuizAttempt,
} from '@/lib/chapter-5-concepts/instructor-diagnostics'
import { type Chapter6MicroCheckAttemptRow } from '@/lib/chapter-6-concepts/micro-check-persistence'
import {
  buildChapter6InstructorDiagnostics,
  type Chapter6InstructorQuizAttempt,
} from '@/lib/chapter-6-concepts/instructor-diagnostics'
import { type Chapter7MicroCheckAttemptRow } from '@/lib/chapter-7-concepts/micro-check-persistence'
import {
  buildChapter7InstructorDiagnostics,
  type Chapter7InstructorQuizAttempt,
  type Chapter7InstructorRemediationCycle,
} from '@/lib/chapter-7-concepts/instructor-diagnostics'
import { type Chapter8MicroCheckAttemptRow } from '@/lib/chapter-8-concepts/micro-check-persistence'
import {
  buildChapter8InstructorDiagnostics,
  type Chapter8InstructorQuizAttempt,
} from '@/lib/chapter-8-concepts/instructor-diagnostics'
import { type Chapter9MicroCheckAttemptRow } from '@/lib/chapter-9-concepts/micro-check-persistence'
import {
  buildChapter9InstructorDiagnostics,
  type Chapter9InstructorQuizAttempt,
} from '@/lib/chapter-9-concepts/instructor-diagnostics'
import { type Chapter10MicroCheckAttemptRow } from '@/lib/chapter-10-concepts/micro-check-persistence'
import {
  buildChapter10InstructorDiagnostics,
  type Chapter10InstructorQuizAttempt,
} from '@/lib/chapter-10-concepts/instructor-diagnostics'
import { type Chapter11MicroCheckAttemptRow } from '@/lib/chapter-11-concepts/micro-check-persistence'
import {
  buildChapter11InstructorDiagnostics,
  type Chapter11InstructorQuizAttempt,
} from '@/lib/chapter-11-concepts/instructor-diagnostics'
import { type Chapter12MicroCheckAttemptRow } from '@/lib/chapter-12-concepts/micro-check-persistence'
import {
  buildChapter12InstructorDiagnostics,
  type Chapter12InstructorQuizAttempt,
} from '@/lib/chapter-12-concepts/instructor-diagnostics'
import { type Chapter13MicroCheckAttemptRow } from '@/lib/chapter-13-concepts/micro-check-persistence'
import {
  buildChapter13InstructorDiagnostics,
  type Chapter13InstructorQuizAttempt,
} from '@/lib/chapter-13-concepts/instructor-diagnostics'
import { type Chapter14MicroCheckAttemptRow } from '@/lib/chapter-14-concepts/micro-check-persistence'
import {
  buildChapter14InstructorDiagnostics,
  type Chapter14InstructorQuizAttempt,
} from '@/lib/chapter-14-concepts/instructor-diagnostics'
import { type Chapter15MicroCheckAttemptRow } from '@/lib/chapter-15-concepts/micro-check-persistence'
import {
  buildChapter15InstructorDiagnostics,
  type Chapter15InstructorQuizAttempt,
} from '@/lib/chapter-15-concepts/instructor-diagnostics'
import { type Chapter16MicroCheckAttemptRow } from '@/lib/chapter-16-concepts/micro-check-persistence'
import {
  buildChapter16InstructorDiagnostics,
  type Chapter16InstructorQuizAttempt,
} from '@/lib/chapter-16-concepts/instructor-diagnostics'
import { type Chapter17MicroCheckAttemptRow } from '@/lib/chapter-17-concepts/micro-check-persistence'
import {
  buildChapter17InstructorDiagnostics,
  type Chapter17InstructorQuizAttempt,
} from '@/lib/chapter-17-concepts/instructor-diagnostics'
import { type Chapter18MicroCheckAttemptRow } from '@/lib/chapter-18-concepts/micro-check-persistence'
import {
  buildChapter18InstructorDiagnostics,
  type Chapter18InstructorQuizAttempt,
} from '@/lib/chapter-18-concepts/instructor-diagnostics'
import { type Chapter19MicroCheckAttemptRow } from '@/lib/chapter-19-concepts/micro-check-persistence'
import {
  buildChapter19InstructorDiagnostics,
  type Chapter19InstructorQuizAttempt,
} from '@/lib/chapter-19-concepts/instructor-diagnostics'
import { type Chapter20MicroCheckAttemptRow } from '@/lib/chapter-20-concepts/micro-check-persistence'
import {
  buildChapter20InstructorDiagnostics,
  type Chapter20InstructorQuizAttempt,
} from '@/lib/chapter-20-concepts/instructor-diagnostics'
import { type Chapter21MicroCheckAttemptRow } from '@/lib/chapter-21-concepts/micro-check-persistence'
import {
  buildChapter21InstructorDiagnostics,
  type Chapter21InstructorQuizAttempt,
} from '@/lib/chapter-21-concepts/instructor-diagnostics'
import { mapHourLogsFromDb, mapAttendanceRecordsFromDb, mapAttendanceNotesFromDb } from '@/lib/mappers/operational-data-mappers'
import { getLastSignInAtMap } from '@/lib/instructor/last-login'
import { buildLiveInstructorChapterGrade, type LiveInstructorActivityEvidenceRow } from '@/lib/concept-mastery/live-instructor-grade'

interface StudentDetailPageProps {
  params: Promise<{
    studentId: string
  }>
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${h}h ${m}m`
}

function statusBadgeClasses(status: HourStatus): string {
  switch (status) {
    case 'approved':
      return 'bg-gold/20 text-gold border-gold/30'
    case 'pending':
      return 'bg-warm-bronze/20 text-warm-bronze border-warm-bronze/30'
    case 'rejected':
      return 'bg-silver/20 text-silver border-silver/30'
    default:
      return 'bg-[var(--color-border-secondary)] text-light-gray border-silver-gray'
  }
}

function formatDaysAgo(dateString: string | null): string {
  if (!dateString) return 'Never'
  const days = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

function getReadinessEstimate(overallProgress: number, avgQuizScore: number): {
  label: string
  score: number
  color: string
} {
  // Weighted readiness score: 50% chapter completion + 50% quiz performance
  const score = Math.round(overallProgress * 0.5 + avgQuizScore * 0.5)

  if (score >= 85) return { label: 'Board Ready', score, color: 'text-gold' }
  if (score >= 70) return { label: 'Almost Ready', score, color: 'text-silver' }
  if (score >= 50) return { label: 'On Track', score, color: 'text-warm-bronze' }
  if (score >= 25) return { label: 'Needs Review', score, color: 'text-warm-bronze' }
  return { label: 'Getting Started', score, color: 'text-silver' }
}

interface ChapterScore {
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  score: number
  attempted: boolean
  passingScore: number
}

function getPassingScoreByQuizId(quizId: string): number {
  const chapterId = quizId.replace('quiz-', 'ch-')
  return getLocalQuiz(chapterId)?.passing_score ?? 80
}

function computeChapterScores(
  chapters: { id: string; chapter_number: number; title: string }[],
  progressRecords: StudentProgress[]
): ChapterScore[] {
  return chapters.map((chapter) => {
    const progress = progressRecords.find((p) => p.chapter_id === chapter.id)
    const score = progress?.best_quiz_score ?? 0
    const quiz = getLocalQuiz(chapter.id)
    return {
      chapterId: chapter.id,
      chapterNumber: chapter.chapter_number,
      chapterTitle: chapter.title,
      score,
      attempted: score > 0,
      passingScore: quiz?.passing_score ?? 80,
    }
  })
}

function getBoardRisk(attemptedChapters: ChapterScore[]): {
  label: string
  color: string
  description: string
} {
  if (attemptedChapters.length === 0) {
    return {
      label: 'No Data',
      color: 'text-silver',
      description: 'Not enough quiz data to assess board readiness risk.',
    }
  }

  const anyCritical = attemptedChapters.some((c) => c.score < 60)
  const passingCount = attemptedChapters.filter((c) => c.score >= c.passingScore).length
  const passingRate = passingCount / attemptedChapters.length

  if (anyCritical || passingRate < 0.5) {
    return {
      label: 'High Risk',
      color: 'text-silver',
      description: 'Multiple weak areas may affect board exam performance.',
    }
  }

  if (passingRate < 0.8 || attemptedChapters.some((c) => c.score < c.passingScore)) {
    return {
      label: 'Moderate Risk',
      color: 'text-warm-bronze',
      description: 'Some topics need additional review before the board exam.',
    }
  }

  return {
    label: 'Low Risk',
    color: 'text-gold',
    description: 'Strong quiz performance across attempted chapters.',
  }
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { studentId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify instructor or admin
  const { data: instructorProfile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  // ── INSTRUCTOR ACCESS ENFORCEMENT (server component layer) ──
  // Defense-in-depth: verify the current user is an instructor or admin
  // before exposing any student detail data.
  if (!instructorProfile || !isInstructorOrAdmin(instructorProfile.role)) {
    redirect('/dashboard')
  }

  // Get student — must belong to same school and be a learner role
  const { data: student } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', studentId)
    .eq('school_id', instructorProfile.school_id)
    .in('role', ['student', 'apprentice'])
    .single()

  const typedStudent = student as Profile | null

  // Demo fallback: if real data is unavailable, check demo students.
  // Phase 6B-1 R-3: demo data is NEVER substituted in production.
  const demoAllowed = isDemoDataAllowed()
  let usingDemoData = false
  let resolvedStudent: Profile | null = typedStudent
  if (!resolvedStudent && demoAllowed) {
    resolvedStudent = demoStudents.find(
      (s) =>
        s.id === studentId &&
        (s.school_id === instructorProfile.school_id || !instructorProfile.school_id)
    ) || null
    if (resolvedStudent) usingDemoData = true
  }

  if (!resolvedStudent) {
    notFound()
  }

  // Last Login signal (server-side only): auth.users.last_sign_in_at for this
  // verified roster student. Skipped for demo students (fictional IDs have no
  // Auth accounts); an unavailable lookup renders as absent.
  const lastSignInMap = usingDemoData ? {} : await getLastSignInAtMap([studentId])
  const lastLoginAt = lastSignInMap[studentId] ?? null

  // Resolve the student's program requirements (programs.required_hours) and the
  // school's configured state, so hour tracking and the Board Hours Summary use
  // school-configured values instead of hard-coded single-state assumptions.
  // Fallback chain: active enrollment's program → school's active program →
  // default 1500 (matches the programs table schema default); missing state → '—'.
  const [programRequirements, schoolState] = await Promise.all([
    instructorProfile.school_id
      ? resolveStudentProgramRequirements(supabase, instructorProfile.school_id, studentId)
      : Promise.resolve(defaultProgramRequirements()),
    instructorProfile.school_id
      ? resolveSchoolState(supabase, instructorProfile.school_id)
      : Promise.resolve(null),
  ])

  // Use local chapters (not Supabase)
  const chapters = localChapters

  // Get student progress
  const { data: progress } = await supabase
    .from('student_progress')
    .select('*')
    .eq('user_id', studentId)

  // Get quiz attempts
  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', studentId)
    .order('completed_at', { ascending: false })

  // Chapters 1–10 share one immutable micro-check evidence read for this student.
  // The same rows feed the same diagnostics whether the authorized viewer is an
  // instructor or school admin; role changes authorization, never calculations.
  const { data: chapterMicroCheckRows } = await supabase
    .from('chapter_micro_check_attempts')
    .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
    .eq('user_id', studentId)
    .in('chapter_id', ['ch-1','ch-2','ch-3','ch-4','ch-5','ch-6','ch-7','ch-8','ch-9','ch-10','ch-11','ch-12','ch-13','ch-14','ch-15','ch-16','ch-17','ch-18','ch-19','ch-20','ch-21'])
    .order('answered_at', { ascending: true })

  type SharedChapterMicroCheckRow = {
    id: string
    user_id: string
    chapter_id: string
    check_id: string
    question_id: string
    concept_id: string
    difficulty: 'understanding' | 'application' | 'scenario'
    selected_answer: 'a' | 'b' | 'c' | 'd'
    is_correct: boolean
    answered_at: string
    created_at: string
  }

  const { data: chapterActivityEvidenceRows } = await supabase
    .from('chapter_activity_evidence')
    .select('chapter_id,source,item_id,is_correct,answered_at')
    .eq('user_id', studentId)
    .in('chapter_id', ['ch-1','ch-2','ch-3','ch-4','ch-5','ch-6','ch-7','ch-8','ch-9','ch-10','ch-11','ch-12','ch-13','ch-14','ch-15','ch-16','ch-17','ch-18','ch-19','ch-20','ch-21'])
    .order('answered_at', { ascending: true })

  const liveActivityRows = (chapterActivityEvidenceRows ?? []) as LiveInstructorActivityEvidenceRow[]

  const sharedChapterMicroCheckRows = (chapterMicroCheckRows ?? []) as SharedChapterMicroCheckRow[]
  const chapter1MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-1') as Chapter1MicroCheckAttemptRow[]
  const chapter2MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-2') as Chapter2MicroCheckAttemptRow[]
  const chapter3MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-3') as Chapter3MicroCheckAttemptRow[]
  const chapter4MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-4') as Chapter4MicroCheckAttemptRow[]
  const chapter5MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-5') as Chapter5MicroCheckAttemptRow[]
  const chapter6MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-6') as Chapter6MicroCheckAttemptRow[]
  const chapter7MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-7') as Chapter7MicroCheckAttemptRow[]
  const chapter8MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-8') as Chapter8MicroCheckAttemptRow[]
  const chapter9MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-9') as Chapter9MicroCheckAttemptRow[]
  const chapter10MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-10') as Chapter10MicroCheckAttemptRow[]
  const chapter11MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-11') as Chapter11MicroCheckAttemptRow[]
  const chapter12MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-12') as Chapter12MicroCheckAttemptRow[]
  const chapter13MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-13') as Chapter13MicroCheckAttemptRow[]
  const chapter14MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-14') as Chapter14MicroCheckAttemptRow[]
  const chapter15MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-15') as Chapter15MicroCheckAttemptRow[]
  const chapter16MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-16') as Chapter16MicroCheckAttemptRow[]
  const chapter17MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-17') as Chapter17MicroCheckAttemptRow[]
  const chapter18MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-18') as Chapter18MicroCheckAttemptRow[]
  const chapter19MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-19') as Chapter19MicroCheckAttemptRow[]
  const chapter20MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-20') as Chapter20MicroCheckAttemptRow[]
  const chapter21MicroCheckRows = sharedChapterMicroCheckRows.filter((row) => row.chapter_id === 'ch-21') as Chapter21MicroCheckAttemptRow[]

  const { data: chapter7RemediationCycles } = await supabase
    .from('remediation_cycles')
    .select('concept_id,status,outcome,reassessment_completed_at,created_at')
    .eq('user_id', studentId)
    .eq('chapter_id', 'ch-7')
    .order('created_at', { ascending: true })

  // Get instructor notes
  const notesResult = await getInstructorNotes(studentId, instructorProfile.school_id)
  let noteRecords: InstructorNote[] = notesResult.success ? notesResult.data : []
  const notesError: string | null = notesResult.success ? null : notesResult.message

  // Demo fallback for progress, attempts, and notes
  let progressRecords: StudentProgress[] = (progress as StudentProgress[]) || []
  let attemptRecords: QuizAttempt[] = (attempts as QuizAttempt[]) || []
  if (progressRecords.length === 0 && attemptRecords.length === 0 && demoAllowed) {
    progressRecords = demoStudentProgress.filter((p) => p.user_id === studentId)
    attemptRecords = demoStudentQuizAttempts.filter((a) => a.user_id === studentId)
    attemptRecords.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
  }
  if (noteRecords.length === 0 && !notesError && demoAllowed) {
    noteRecords = demoInstructorNotes.filter((n) => n.student_id === studentId)
  }

  // Get hour logs
  const { data: hourLogs } = await supabase
    .from('effective_hour_logs')
    .select('*')
    .eq('school_id', instructorProfile.school_id)
    .eq('user_id', studentId)
    .order('date', { ascending: false })

  let hourLogRecords: HourLog[] = mapHourLogsFromDb(hourLogs || []) || []
  if (hourLogRecords.length === 0 && demoAllowed) {
    hourLogRecords = demoHourLogs.filter((h) => h.user_id === studentId)
    hourLogRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Get attendance records
  const { data: attendance } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('school_id', instructorProfile.school_id)
    .eq('user_id', studentId)
    .order('date', { ascending: false })

  const { data: attendanceNotes } = await supabase
    .from('attendance_notes')
    .select('*')
    .eq('school_id', instructorProfile.school_id)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  let attendanceRecords: AttendanceRecord[] = mapAttendanceRecordsFromDb(attendance || []) || []
  let attendanceNoteRecords: InstructorAttendanceNote[] = mapAttendanceNotesFromDb(attendanceNotes || []) || []
  if (attendanceRecords.length === 0 && demoAllowed) {
    attendanceRecords = demoAttendanceRecords.filter((a) => a.userId === studentId)
  }
  if (attendanceNoteRecords.length === 0 && demoAllowed) {
    attendanceNoteRecords = demoInstructorAttendanceNotes.filter((n) => n.studentId === studentId)
  }

  const attendanceSummary = calculateAttendanceSummary(studentId, attendanceRecords)
  const recentAttendance = getRecentAttendance(attendanceRecords, studentId, 14)

  // Demo-mode cosmetic fallback: the fictional demo school's configured values.
  const demoProgram = demoAcademicPrograms.find((p) => p.active) ?? demoAcademicPrograms[0]
  const programName = programRequirements.programName ?? (usingDemoData ? demoProgram?.name ?? null : null) ?? '—'
  const boardState = schoolState ?? (usingDemoData ? demoSchool.state : null) ?? '—'

  const REQUIRED_MINUTES = programRequirements.requiredHours * 60
  const approvedMinutes = hourLogRecords.reduce(
    (sum, h) => sum + getOfficialMinutes(h),
    0,
  )
  const pendingMinutes = hourLogRecords
    .filter((h) => h.status === 'pending')
    .reduce((sum, h) => sum + h.minutes, 0)
  const remainingMinutes = Math.max(0, REQUIRED_MINUTES - approvedMinutes)
  const completionPercentage = REQUIRED_MINUTES > 0
    ? Math.round((approvedMinutes / REQUIRED_MINUTES) * 100)
    : 0

  const totalChapters = chapters?.length || 0
  const completedChapters = progressRecords.filter((p) => p.progress_percentage === 100).length
  const overallProgress = totalChapters > 0
    ? Math.round(progressRecords.reduce((sum, p) => sum + p.progress_percentage, 0) / totalChapters)
    : 0
  const flashcardsCompleted = progressRecords.filter((p) => p.flashcards_completed).length
  const quizzesCompleted = progressRecords.filter((p) => p.quiz_completed).length
  const avgQuizScore = attemptRecords.length > 0
    ? Math.round(attemptRecords.reduce((sum, a) => sum + a.percentage, 0) / attemptRecords.length)
    : 0

  const chapter1MicroCheckAttempts = (chapter1MicroCheckRows ?? []) as Chapter1MicroCheckAttemptRow[]
  const chapter1Progress = progressRecords.find((record) => record.chapter_id === 'ch-1')
  const chapter1Diagnostics = buildChapter1InstructorDiagnostics({
    studentId,
    completionPercent: chapter1Progress?.progress_percentage ?? 0,
    microCheckRows: chapter1MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-1' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch1-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter1InstructorQuizAttempt[],
    referenceTime: new Date().toISOString(),
  })

  const chapter2MicroCheckAttempts = (chapter2MicroCheckRows ?? []) as Chapter2MicroCheckAttemptRow[]
  const chapter2Progress = progressRecords.find((record) => record.chapter_id === 'ch-2')
  const chapter2Diagnostics = buildChapter2InstructorDiagnostics({
    studentId,
    completionPercent: chapter2Progress?.progress_percentage ?? 0,
    microCheckRows: chapter2MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-2' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('C-2-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter2InstructorQuizAttempt[],
    referenceTime: new Date().toISOString(),
  })

  const chapter3MicroCheckAttempts = (chapter3MicroCheckRows ?? []) as Chapter3MicroCheckAttemptRow[]
  const chapter3Progress = progressRecords.find((record) => record.chapter_id === 'ch-3')
  const chapter3Diagnostics = buildChapter3InstructorDiagnostics({
    studentId,
    completionPercent: chapter3Progress?.progress_percentage ?? 0,
    microCheckRows: chapter3MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-3' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch3-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter3InstructorQuizAttempt[],
    referenceTime: new Date().toISOString(),
  })

  const chapter4MicroCheckAttempts = (chapter4MicroCheckRows ?? []) as Chapter4MicroCheckAttemptRow[]
  const chapter4Progress = progressRecords.find((record) => record.chapter_id === 'ch-4')
  const chapter4Diagnostics = buildChapter4InstructorDiagnostics({
    studentId,
    completionPercent: chapter4Progress?.progress_percentage ?? 0,
    microCheckRows: chapter4MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-4' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch4-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter4InstructorQuizAttempt[],
    referenceTime: new Date().toISOString(),
  })

  const chapter5MicroCheckAttempts = (chapter5MicroCheckRows ?? []) as Chapter5MicroCheckAttemptRow[]
  const chapter5Progress = progressRecords.find((record) => record.chapter_id === 'ch-5')
  const chapter5Diagnostics = buildChapter5InstructorDiagnostics({
    studentId,
    completionPercent: chapter5Progress?.progress_percentage ?? 0,
    microCheckRows: chapter5MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-5' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch5-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter5InstructorQuizAttempt[],
    referenceTime: new Date().toISOString(),
  })

  const chapter6MicroCheckAttempts = (chapter6MicroCheckRows ?? []) as Chapter6MicroCheckAttemptRow[]
  const chapter6Progress = progressRecords.find((record) => record.chapter_id === 'ch-6')
  const chapter6Diagnostics = buildChapter6InstructorDiagnostics({
    studentId,
    completionPercent: chapter6Progress?.progress_percentage ?? 0,
    microCheckRows: chapter6MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-6' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch6-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter6InstructorQuizAttempt[],
    referenceTime: new Date().toISOString(),
  })

  const chapter7MicroCheckAttempts = (chapter7MicroCheckRows ?? []) as Chapter7MicroCheckAttemptRow[]
  const chapter7Progress = progressRecords.find((record) => record.chapter_id === 'ch-7')
  const chapter7Diagnostics = buildChapter7InstructorDiagnostics({
    studentId,
    completionPercent: chapter7Progress?.progress_percentage ?? 0,
    microCheckRows: chapter7MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-7' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch7-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter7InstructorQuizAttempt[],
    remediationCycles: (chapter7RemediationCycles ?? []) as Chapter7InstructorRemediationCycle[],
    referenceTime: new Date().toISOString(),
  })

  const chapter8MicroCheckAttempts = (chapter8MicroCheckRows ?? []) as Chapter8MicroCheckAttemptRow[]
  const chapter8Progress = progressRecords.find((record) => record.chapter_id === 'ch-8')
  const chapter8Diagnostics = buildChapter8InstructorDiagnostics({
    studentId,
    completionPercent: chapter8Progress?.progress_percentage ?? 0,
    microCheckRows: chapter8MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-8' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch8-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter8InstructorQuizAttempt[],
    referenceTime: new Date().toISOString(),
  })

  const chapter9MicroCheckAttempts = (chapter9MicroCheckRows ?? []) as Chapter9MicroCheckAttemptRow[]
  const chapter9Progress = progressRecords.find((record) => record.chapter_id === 'ch-9')
  const chapter9Diagnostics = buildChapter9InstructorDiagnostics({
    studentId,
    completionPercent: chapter9Progress?.progress_percentage ?? 0,
    microCheckRows: chapter9MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-9' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch9-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter9InstructorQuizAttempt[],
    referenceTime: new Date().toISOString(),
  })

  const chapter10MicroCheckAttempts = (chapter10MicroCheckRows ?? []) as Chapter10MicroCheckAttemptRow[]
  const chapter10Progress = progressRecords.find((record) => record.chapter_id === 'ch-10')
  const chapter10Diagnostics = buildChapter10InstructorDiagnostics({
    studentId,
    completionPercent: chapter10Progress?.progress_percentage ?? 0,
    microCheckRows: chapter10MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-10' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch10-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter10InstructorQuizAttempt[],
    referenceTime: new Date().toISOString(),
  })

  const chapter11MicroCheckAttempts = (chapter11MicroCheckRows ?? []) as Chapter11MicroCheckAttemptRow[]
  const chapter11Progress = progressRecords.find((record) => record.chapter_id === 'ch-11')
  const chapter11Diagnostics = buildChapter11InstructorDiagnostics({
    studentId,
    completionPercent: chapter11Progress?.progress_percentage ?? 0,
    microCheckRows: chapter11MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-11' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch11-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter11InstructorQuizAttempt[],
    referenceTime: new Date().toISOString(),
  })

  const chapter12MicroCheckAttempts = (chapter12MicroCheckRows ?? []) as Chapter12MicroCheckAttemptRow[]
  const chapter12Progress = progressRecords.find((record) => record.chapter_id === 'ch-12')
  const chapter12Diagnostics = buildChapter12InstructorDiagnostics({
    studentId,
    completionPercent: chapter12Progress?.progress_percentage ?? 0,
    microCheckRows: chapter12MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-12' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch12-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter12InstructorQuizAttempt[],
    referenceTime: new Date().toISOString(),
  })

  const chapter13MicroCheckAttempts = (chapter13MicroCheckRows ?? []) as Chapter13MicroCheckAttemptRow[]
  const chapter13Progress = progressRecords.find((record) => record.chapter_id === 'ch-13')
  const chapter13Diagnostics = buildChapter13InstructorDiagnostics({
    studentId,
    completionPercent: chapter13Progress?.progress_percentage ?? 0,
    microCheckRows: chapter13MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-13' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch13-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter13InstructorQuizAttempt[],
    referenceTime: new Date().toISOString(),
  })

  const chapter14MicroCheckAttempts = (chapter14MicroCheckRows ?? []) as Chapter14MicroCheckAttemptRow[]
  const chapter14Progress = progressRecords.find((record) => record.chapter_id === 'ch-14')
  const chapter14Diagnostics = buildChapter14InstructorDiagnostics({
    studentId,
    completionPercent: chapter14Progress?.progress_percentage ?? 0,
    microCheckRows: chapter14MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-14' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch14-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter14InstructorQuizAttempt[],
    referenceTime: new Date().toISOString(),
  })

  const chapter15MicroCheckAttempts = (chapter15MicroCheckRows ?? []) as Chapter15MicroCheckAttemptRow[]
  const chapter15Progress = progressRecords.find((record) => record.chapter_id === 'ch-15')
  const chapter15Diagnostics = buildChapter15InstructorDiagnostics({
    studentId,
    completionPercent: chapter15Progress?.progress_percentage ?? 0,
    microCheckRows: chapter15MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-15' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch15-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter15InstructorQuizAttempt[],
    referenceTime: new Date().toISOString(),
  })

  const chapter16MicroCheckAttempts = (chapter16MicroCheckRows ?? []) as Chapter16MicroCheckAttemptRow[]
  const chapter16Progress = progressRecords.find((record) => record.chapter_id === 'ch-16')
  const chapter16Diagnostics = buildChapter16InstructorDiagnostics({
    studentId,
    completionPercent: chapter16Progress?.progress_percentage ?? 0,
    microCheckRows: chapter16MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-16' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch16-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter16InstructorQuizAttempt[],
    referenceTime: new Date().toISOString(),
  })

  const buildLiveGrade = (
    chapterId: string,
    diagnostics: {
      microCheckPercent: number | null
      chapterAssessmentPercent: number | null
      remediationReassessmentPercent: number | null
    },
  ) => buildLiveInstructorChapterGrade({
    chapterId,
    microCheckPercent: diagnostics.microCheckPercent,
    chapterAssessmentPercent: diagnostics.chapterAssessmentPercent,
    remediationReassessmentPercent: diagnostics.remediationReassessmentPercent,
    activityRows: liveActivityRows,
  })

  const chapter1LiveGrade = buildLiveGrade('ch-1', chapter1Diagnostics)
  const chapter2LiveGrade = buildLiveGrade('ch-2', chapter2Diagnostics)
  const chapter3LiveGrade = buildLiveGrade('ch-3', chapter3Diagnostics)
  const chapter4LiveGrade = buildLiveGrade('ch-4', chapter4Diagnostics)
  const chapter5LiveGrade = buildLiveGrade('ch-5', chapter5Diagnostics)
  const chapter6LiveGrade = buildLiveGrade('ch-6', chapter6Diagnostics)
  const chapter7LiveGrade = buildLiveGrade('ch-7', chapter7Diagnostics)
  const chapter8LiveGrade = buildLiveGrade('ch-8', chapter8Diagnostics)
  const chapter9LiveGrade = buildLiveGrade('ch-9', chapter9Diagnostics)
  const chapter10LiveGrade = buildLiveGrade('ch-10', chapter10Diagnostics)
  const chapter11LiveGrade = buildLiveGrade('ch-11', chapter11Diagnostics)
  const chapter12LiveGrade = buildLiveGrade('ch-12', chapter12Diagnostics)
  const chapter13LiveGrade = buildLiveGrade('ch-13', chapter13Diagnostics)
  const chapter14LiveGrade = buildLiveGrade('ch-14', chapter14Diagnostics)
  const chapter15LiveGrade = buildLiveGrade('ch-15', chapter15Diagnostics)
  const chapter16LiveGrade = buildLiveGrade('ch-16', chapter16Diagnostics)
  const chapter17MicroCheckAttempts = (chapter17MicroCheckRows ?? []) as Chapter17MicroCheckAttemptRow[]
  const chapter17Progress = progressRecords.find((record) => record.chapter_id === 'ch-17')
  const chapter17Diagnostics = buildChapter17InstructorDiagnostics({
    studentId,
    completionPercent: chapter17Progress?.progress_percentage ?? 0,
    microCheckRows: chapter17MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-17' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch17-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter17InstructorQuizAttempt[],
    activityRows: liveActivityRows.filter((row) => row.chapter_id === 'ch-17'),
    referenceTime: new Date().toISOString(),
  })
  const chapter17LiveGrade = buildLiveGrade('ch-17', chapter17Diagnostics)

  const chapter18MicroCheckAttempts = (chapter18MicroCheckRows ?? []) as Chapter18MicroCheckAttemptRow[]
  const chapter18Progress = progressRecords.find((record) => record.chapter_id === 'ch-18')
  const chapter18Diagnostics = buildChapter18InstructorDiagnostics({
    studentId,
    completionPercent: chapter18Progress?.progress_percentage ?? 0,
    microCheckRows: chapter18MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-18' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch18-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter18InstructorQuizAttempt[],
    activityRows: liveActivityRows.filter((row) => row.chapter_id === 'ch-18'),
    referenceTime: new Date().toISOString(),
  })
  const chapter18LiveGrade = buildLiveGrade('ch-18', chapter18Diagnostics)

  const chapter19MicroCheckAttempts = (chapter19MicroCheckRows ?? []) as Chapter19MicroCheckAttemptRow[]
  const chapter19Progress = progressRecords.find((record) => record.chapter_id === 'ch-19')
  const chapter19Diagnostics = buildChapter19InstructorDiagnostics({
    studentId,
    completionPercent: chapter19Progress?.progress_percentage ?? 0,
    microCheckRows: chapter19MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-19' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch19-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter19InstructorQuizAttempt[],
    activityRows: liveActivityRows.filter((row) => row.chapter_id === 'ch-19'),
    referenceTime: new Date().toISOString(),
  })
  const chapter19LiveGrade = buildLiveGrade('ch-19', chapter19Diagnostics)

  const chapter20MicroCheckAttempts = (chapter20MicroCheckRows ?? []) as Chapter20MicroCheckAttemptRow[]
  const chapter20Progress = progressRecords.find((record) => record.chapter_id === 'ch-20')
  const chapter20Diagnostics = buildChapter20InstructorDiagnostics({
    studentId,
    completionPercent: chapter20Progress?.progress_percentage ?? 0,
    microCheckRows: chapter20MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-20' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch20-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter20InstructorQuizAttempt[],
    activityRows: liveActivityRows.filter((row) => row.chapter_id === 'ch-20'),
    referenceTime: new Date().toISOString(),
  })
  const chapter20LiveGrade = buildLiveGrade('ch-20', chapter20Diagnostics)

  const chapter21MicroCheckAttempts = (chapter21MicroCheckRows ?? []) as Chapter21MicroCheckAttemptRow[]
  const chapter21Progress = progressRecords.find((record) => record.chapter_id === 'ch-21')
  const chapter21Diagnostics = buildChapter21InstructorDiagnostics({
    studentId,
    completionPercent: chapter21Progress?.progress_percentage ?? 0,
    microCheckRows: chapter21MicroCheckAttempts,
    quizAttempts: attemptRecords
      .filter(
        (attempt) =>
          attempt.quiz_id === 'quiz-21' ||
          (attempt.is_reassessment && attempt.target_concept_id?.startsWith('ch21-')),
      )
      .map((attempt) => ({
        quiz_id: attempt.quiz_id,
        percentage: attempt.percentage,
        answers_json: (attempt.answers_json ?? null) as Record<string, unknown> | null,
        completed_at: attempt.completed_at,
        is_reassessment: attempt.is_reassessment ?? false,
        target_concept_id: attempt.target_concept_id ?? null,
        remediation_cycle_id: attempt.remediation_cycle_id ?? null,
      })) as Chapter21InstructorQuizAttempt[],
    activityRows: liveActivityRows.filter((row) => row.chapter_id === 'ch-21'),
    referenceTime: new Date().toISOString(),
  })
  const chapter21LiveGrade = buildLiveGrade('ch-21', chapter21Diagnostics)

  // Last activity across all progress records
  const lastStudiedDates = progressRecords
    .map((p) => p.last_studied_at)
    .filter((d): d is string => !!d)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  const lastActivityAt = lastStudiedDates[0] || null

  const readiness = getReadinessEstimate(overallProgress, avgQuizScore)

  // Phase 5 analytics
  const questions = Object.values(allQuizQuestions).flat()
  const analytics = analyzePerformance({
    userId: studentId,
    attempts: attemptRecords,
    progress: progressRecords,
    chapters,
    questions,
  })

  const boardReadiness = calculateBoardReadiness({
    userId: studentId,
    attempts: attemptRecords,
    progress: progressRecords,
    totalChapters,
  })

  const { buildMissedQuestions } = await import('@/lib/analytics')
  let missedQuestions = buildMissedQuestions({
    userId: studentId,
    attempts: attemptRecords,
    progress: progressRecords,
    chapters,
    questions,
  })
  if (missedQuestions.length === 0 && demoAllowed) {
    missedQuestions = getDemoMissedQuestionsForUser(studentId)
  }

  const recommendations = generateStudyPlan({
    userId: studentId,
    readiness: boardReadiness,
    weakAreas: analytics.weakAreas,
    strongAreas: analytics.strongAreas,
    missedQuestions,
    totalChapters,
  })

  // Weak area analytics (legacy)
  const chapterScores = computeChapterScores(chapters, progressRecords)
  const attemptedChapters = chapterScores.filter((c) => c.attempted)
  const hasEnoughQuizData = attemptedChapters.length >= 2

  const sortedByScoreAsc = [...attemptedChapters].sort((a, b) => a.score - b.score)
  const sortedByScoreDesc = [...attemptedChapters].sort((a, b) => b.score - a.score)

  // Weak areas: bottom performers (relative weak areas)
  const weakAreaCount = Math.min(3, Math.floor(attemptedChapters.length / 2) + 1)
  const weakAreas = sortedByScoreAsc.slice(0, weakAreaCount)

  // Strong areas: top performers with score >= 80%
  const strongAreas = sortedByScoreDesc.filter((c) => c.score >= 80).slice(0, 3)

  const boardRisk = getBoardRisk(attemptedChapters)

  return (
    <div className="min-h-screen bg-black p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {usingDemoData && <DemoDataBanner />}
        {/* Back navigation */}
        <BackButton fallbackHref="/instructor" label="Back to roster" />

        {/* Student Summary Card */}
        <div className="bg-charcoal border border-graphite rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-brand-gold)]/20 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-[var(--color-brand-gold)]">
                {resolvedStudent.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="break-words text-3xl font-bold leading-tight text-white">
                {resolvedStudent.full_name}
              </h1>
              <p className="break-all text-silver">{resolvedStudent.email}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                <span className="px-2 py-0.5 bg-graphite text-light-gray rounded capitalize">
                  {resolvedStudent.role}
                </span>
                <span className="text-silver-gray">
                  Joined {formatDate(resolvedStudent.created_at)}
                </span>
                {lastActivityAt && (
                  <span className="text-silver-gray">
                    Last learning activity {formatDaysAgo(lastActivityAt)}
                  </span>
                )}
                {lastLoginAt && (
                  <span className="text-silver-gray">
                    Last login {formatDaysAgo(lastLoginAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Student Progress Report (modal popup) */}
        <ProgressReportModal
          student={resolvedStudent}
          lastActivityAt={lastActivityAt}
          lastLoginAt={lastLoginAt}
          overallProgress={overallProgress}
          avgQuizScore={avgQuizScore}
          readiness={readiness}
          boardRisk={boardRisk}
          chapters={chapters}
          progressRecords={progressRecords}
          attemptRecords={attemptRecords}
          hasEnoughQuizData={hasEnoughQuizData}
          weakAreas={weakAreas}
          noteRecords={noteRecords}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-charcoal border border-graphite rounded-xl p-5">
            <div className={`text-2xl font-bold ${
              overallProgress >= 80 ? 'text-gold' :
              overallProgress >= 50 ? 'text-warm-bronze' : 'text-silver'
            }`}>
              {overallProgress}%
            </div>
            <div className="text-xs text-silver mt-1">Overall Progress</div>
          </div>

          <div className="bg-charcoal border border-graphite rounded-xl p-5">
            <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{completedChapters}</div>
            <div className="text-xs text-silver mt-1">Chapters Done</div>
          </div>

          <div className="bg-charcoal border border-graphite rounded-xl p-5">
            <div className="text-2xl font-bold text-silver">{flashcardsCompleted}</div>
            <div className="text-xs text-silver mt-1">Flashcards Done</div>
          </div>

          <div className="bg-charcoal border border-graphite rounded-xl p-5">
            <div className="text-2xl font-bold text-silver">{quizzesCompleted}</div>
            <div className="text-xs text-silver mt-1">Quizzes Passed</div>
          </div>

          <div className="bg-charcoal border border-graphite rounded-xl p-5">
            <div className={`text-2xl font-bold ${avgQuizScore >= 80 ? 'text-gold' : avgQuizScore >= 60 ? 'text-warm-bronze' : avgQuizScore > 0 ? 'text-silver' : 'text-silver-gray'}`}>
              {avgQuizScore > 0 ? `${avgQuizScore}%` : '—'}
            </div>
            <div className="text-xs text-silver mt-1">Quiz Average</div>
          </div>

          <div className="bg-charcoal border border-graphite rounded-xl p-5">
            <div className={`text-2xl font-bold ${readiness.color}`}>{readiness.score}</div>
            <div className="text-xs text-silver mt-1">{readiness.label}</div>
          </div>
        </div>

        <ChapterAccordionGroup>
        {/* Chapter 1 shared mastery diagnostics */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 1 — {chapters.find((chapter) => chapter.chapter_number === 1)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter1LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter1Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter1Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter1Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
              Chapter 1 — History of Barbering
            </p>
            <h2 className="text-xl font-semibold text-white mt-1">Mastery & Learning-Gap Diagnostics</h2>
            <p className="text-sm text-silver mt-1">
              Shared grading keeps completion separate and combines micro-check, flashcard/study, chapter assessment, scenario/application, and formal remediation evidence without erasing original misses.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{chapter1LiveGrade.grade.finalGrade}%</div>
                <div className="text-xs text-silver mt-1">Chapter Grade</div>
                <div className="text-[10px] text-silver-gray mt-1">
                  {chapter1LiveGrade.evidenceComplete
                    ? 'Final live 20/10/40/15/15 evidence'
                    : 'Provisional — required evidence still incomplete'}
                </div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-white">{chapter1Diagnostics.overallMastery}%</div>
                <div className="text-xs text-silver mt-1">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-lg font-bold text-white capitalize">{chapter1Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-xs text-silver mt-1">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-white">{chapter1Progress?.progress_percentage ?? 0}%</div>
                <div className="text-xs text-silver mt-1">Completion</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 text-sm">
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Micro Checks</p>
                <p className="text-white font-semibold mt-1">{chapter1Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter1Diagnostics.microCheckPercent}%`}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Chapter Assessment</p>
                <p className="text-white font-semibold mt-1">{chapter1Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter1Diagnostics.chapterAssessmentPercent}%`}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Remediation Status</p>
                <p className="text-white font-semibold mt-1">{chapter1Diagnostics.remediationStatus}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Latest Reassessment</p>
                <p className="text-white font-semibold mt-1">{chapter1Diagnostics.latestReassessment}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter1Diagnostics.strongestConcepts.length > 0 ? chapter1Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptFamilyId} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} · {concept.observations} observations</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 1 evidence yet.</p>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter1Diagnostics.weakestConcepts.length > 0 ? chapter1Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptFamilyId} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} · {concept.observations} observations · {concept.initialMisses} initial misses{concept.reassessmentCorrect > 0 ? ` · ${concept.reassessmentCorrect} reassessment correct` : ''}</p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 1 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 text-xs text-silver-gray">
            Chapter 1 now uses the shared mastery weights. Formal recovery will only apply after five unique reassessment questions are completed for the target concept.
          </div>
                  </section>
        </details>

        {/* Chapter 2 shared mastery diagnostics */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 2 — {chapters.find((chapter) => chapter.chapter_number === 2)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter2LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter2Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter2Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter2Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
              Chapter 2 — Life Skills
            </p>
            <h2 className="text-xl font-semibold text-white mt-1">Mastery & Learning-Gap Diagnostics</h2>
            <p className="text-sm text-silver mt-1">
              Shared grading keeps completion separate and combines micro-check, flashcard/study, chapter assessment, scenario/application, and formal remediation evidence without erasing original misses.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{chapter2LiveGrade.grade.finalGrade}%</div>
                <div className="text-xs text-silver mt-1">Chapter Grade</div>
                <div className="text-[10px] text-silver-gray mt-1">
                  {chapter2LiveGrade.evidenceComplete
                    ? 'Final live 20/10/40/15/15 evidence'
                    : 'Provisional — required evidence still incomplete'}
                </div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-white">{chapter2Diagnostics.overallMastery}%</div>
                <div className="text-xs text-silver mt-1">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-lg font-bold text-white capitalize">{chapter2Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-xs text-silver mt-1">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-white">{chapter2Progress?.progress_percentage ?? 0}%</div>
                <div className="text-xs text-silver mt-1">Completion</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 text-sm">
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Micro Checks</p>
                <p className="text-white font-semibold mt-1">{chapter2Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter2Diagnostics.microCheckPercent}%`}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Chapter Assessment</p>
                <p className="text-white font-semibold mt-1">{chapter2Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter2Diagnostics.chapterAssessmentPercent}%`}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Remediation Status</p>
                <p className="text-white font-semibold mt-1">{chapter2Diagnostics.remediationStatus}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Latest Reassessment</p>
                <p className="text-white font-semibold mt-1">{chapter2Diagnostics.latestReassessment}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter2Diagnostics.strongestConcepts.length > 0 ? chapter2Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptId} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} · {concept.observations} observations</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 2 evidence yet.</p>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter2Diagnostics.weakestConcepts.length > 0 ? chapter2Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptId} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} · {concept.observations} observations · {concept.initialMisses} initial misses{concept.reassessmentCorrect > 0 ? ` · ${concept.reassessmentCorrect} reassessment correct` : ''}</p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 2 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 text-xs text-silver-gray">
            Chapter 2 now uses the shared mastery weights. Formal recovery will only apply after five unique reassessment questions are completed for the target concept.
          </div>
                  </section>
        </details>

        {/* Chapter 3 shared mastery diagnostics */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 3 — {chapters.find((chapter) => chapter.chapter_number === 3)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter3LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter3Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter3Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter3Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
              Chapter 3 — Professional Image
            </p>
            <h2 className="text-xl font-semibold text-white mt-1">Mastery & Learning-Gap Diagnostics</h2>
            <p className="text-sm text-silver mt-1">
              Shared grading keeps completion separate and combines micro-check, flashcard/study, chapter assessment, scenario/application, and formal remediation evidence without erasing original misses.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{chapter3LiveGrade.grade.finalGrade}%</div>
                <div className="text-xs text-silver mt-1">Chapter Grade</div>
                <div className="text-[10px] text-silver-gray mt-1">
                  {chapter3LiveGrade.evidenceComplete
                    ? 'Final live 20/10/40/15/15 evidence'
                    : 'Provisional — required evidence still incomplete'}
                </div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-white">{chapter3Diagnostics.overallMastery}%</div>
                <div className="text-xs text-silver mt-1">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-lg font-bold text-white capitalize">{chapter3Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-xs text-silver mt-1">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-white">{chapter3Progress?.progress_percentage ?? 0}%</div>
                <div className="text-xs text-silver mt-1">Completion</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 text-sm">
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Micro Checks</p>
                <p className="text-white font-semibold mt-1">{chapter3Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter3Diagnostics.microCheckPercent}%`}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Chapter Assessment</p>
                <p className="text-white font-semibold mt-1">{chapter3Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter3Diagnostics.chapterAssessmentPercent}%`}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Remediation Status</p>
                <p className="text-white font-semibold mt-1">{chapter3Diagnostics.remediationStatus}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Latest Reassessment</p>
                <p className="text-white font-semibold mt-1">{chapter3Diagnostics.latestReassessment}</p>
              </div>
            </div>
          </div>

          {chapter3Diagnostics.safetyIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className="rounded-lg border border-red-400/50 bg-red-950/20 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-red-300">urgent safety intervention</span>
                  {chapter3Diagnostics.safetyIntervention.requiresFormalSafetyReassessment && <span className="text-xs text-silver">100% recovery required</span>}
                </div>
                <p className="text-sm text-light-gray mt-2">{chapter3Diagnostics.safetyIntervention.instructorReason}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter3Diagnostics.strongestConcepts.length > 0 ? chapter3Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptFamilyId} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} · {concept.observations} observations</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 3 evidence yet.</p>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter3Diagnostics.weakestConcepts.length > 0 ? chapter3Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptFamilyId} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} · {concept.observations} observations · {concept.initialMisses} initial misses{concept.reassessmentCorrect > 0 ? ` · ${concept.reassessmentCorrect} reassessment correct` : ''}</p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 3 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 text-xs text-silver-gray">
            Chapter 3 now uses the shared mastery weights. Formal recovery will only apply after five unique reassessment questions are completed for the target concept.
          </div>
                  </section>
        </details>

        {/* Chapter 4 shared mastery diagnostics */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 4 — {chapters.find((chapter) => chapter.chapter_number === 4)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter4LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter4Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter4Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter4Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
              Chapter 4 — Infection Control
            </p>
            <h2 className="text-xl font-semibold text-white mt-1">Mastery & Learning-Gap Diagnostics</h2>
            <p className="text-sm text-silver mt-1">
              Shared grading keeps completion separate and combines micro-check, flashcard/study, chapter assessment, scenario/application, and formal remediation evidence without erasing original misses.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{chapter4LiveGrade.grade.finalGrade}%</div>
                <div className="text-xs text-silver mt-1">Chapter Grade</div>
                <div className="text-[10px] text-silver-gray mt-1">
                  {chapter4LiveGrade.evidenceComplete
                    ? 'Final live 20/10/40/15/15 evidence'
                    : 'Provisional — required evidence still incomplete'}
                </div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-white">{chapter4Diagnostics.overallMastery}%</div>
                <div className="text-xs text-silver mt-1">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-lg font-bold text-white capitalize">{chapter4Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-xs text-silver mt-1">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-white">{chapter4Progress?.progress_percentage ?? 0}%</div>
                <div className="text-xs text-silver mt-1">Completion</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 text-sm">
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Micro Checks</p>
                <p className="text-white font-semibold mt-1">{chapter4Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter4Diagnostics.microCheckPercent}%`}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Chapter Assessment</p>
                <p className="text-white font-semibold mt-1">{chapter4Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter4Diagnostics.chapterAssessmentPercent}%`}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Remediation Status</p>
                <p className="text-white font-semibold mt-1">{chapter4Diagnostics.remediationStatus}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Latest Reassessment</p>
                <p className="text-white font-semibold mt-1">{chapter4Diagnostics.latestReassessment}</p>
              </div>
            </div>
          </div>

          {chapter4Diagnostics.safetyIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className="rounded-lg border border-red-400/50 bg-red-950/20 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-red-300">urgent safety intervention</span>
                  {chapter4Diagnostics.safetyIntervention.requiresFormalSafetyReassessment && <span className="text-xs text-silver">100% recovery required</span>}
                </div>
                <p className="text-sm text-light-gray mt-2">{chapter4Diagnostics.safetyIntervention.instructorReason}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter4Diagnostics.strongestConcepts.length > 0 ? chapter4Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptFamilyId} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} · {concept.observations} observations</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 4 evidence yet.</p>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter4Diagnostics.weakestConcepts.length > 0 ? chapter4Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptFamilyId} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} · {concept.observations} observations · {concept.initialMisses} initial misses{concept.reassessmentCorrect > 0 ? ` · ${concept.reassessmentCorrect} reassessment correct` : ''}</p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 4 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 text-xs text-silver-gray">
            Chapter 4 now uses the shared mastery weights. Formal recovery will only apply after five unique reassessment questions are completed for the target concept.
          </div>
                  </section>
        </details>

        {/* Chapter 5 shared mastery diagnostics */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 5 — {chapters.find((chapter) => chapter.chapter_number === 5)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter5LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter5Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter5Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter5Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
              Chapter 5 — Implements, Tools & Equipment
            </p>
            <h2 className="text-xl font-semibold text-white mt-1">Mastery & Learning-Gap Diagnostics</h2>
            <p className="text-sm text-silver mt-1">
              Shared grading keeps completion separate and combines micro-check, flashcard/study, chapter assessment, scenario/application, and formal remediation evidence without erasing original misses.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{chapter5LiveGrade.grade.finalGrade}%</div>
                <div className="text-xs text-silver mt-1">Chapter Grade</div>
                <div className="text-[10px] text-silver-gray mt-1">
                  {chapter5LiveGrade.evidenceComplete
                    ? 'Final live 20/10/40/15/15 evidence'
                    : 'Provisional — required evidence still incomplete'}
                </div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-white">{chapter5Diagnostics.overallMastery}%</div>
                <div className="text-xs text-silver mt-1">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-lg font-bold text-white capitalize">{chapter5Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-xs text-silver mt-1">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-white">{chapter5Progress?.progress_percentage ?? 0}%</div>
                <div className="text-xs text-silver mt-1">Completion</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 text-sm">
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Micro Checks</p>
                <p className="text-white font-semibold mt-1">{chapter5Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter5Diagnostics.microCheckPercent}%`}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Chapter Assessment</p>
                <p className="text-white font-semibold mt-1">{chapter5Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter5Diagnostics.chapterAssessmentPercent}%`}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Remediation Status</p>
                <p className="text-white font-semibold mt-1">{chapter5Diagnostics.remediationStatus}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Latest Reassessment</p>
                <p className="text-white font-semibold mt-1">{chapter5Diagnostics.latestReassessment}</p>
              </div>
            </div>
          </div>

          {chapter5Diagnostics.safetyIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className="rounded-lg border border-red-400/50 bg-red-950/20 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-red-300">urgent safety intervention</span>
                  {chapter5Diagnostics.safetyIntervention.requiresFormalSafetyReassessment && <span className="text-xs text-silver">100% recovery required</span>}
                </div>
                <p className="text-sm text-light-gray mt-2">{chapter5Diagnostics.safetyIntervention.instructorReason}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter5Diagnostics.strongestConcepts.length > 0 ? chapter5Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptFamilyId} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} · {concept.observations} observations</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 5 evidence yet.</p>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter5Diagnostics.weakestConcepts.length > 0 ? chapter5Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptFamilyId} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} · {concept.observations} observations · {concept.initialMisses} initial misses{concept.reassessmentCorrect > 0 ? ` · ${concept.reassessmentCorrect} reassessment correct` : ''}</p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 5 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 text-xs text-silver-gray">
            Chapter 5 now uses the shared mastery weights. Formal recovery will only apply after five unique reassessment questions are completed for the target concept.
          </div>
                  </section>
        </details>

        {/* Chapter 6 shared mastery diagnostics */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 6 — {chapters.find((chapter) => chapter.chapter_number === 6)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter6LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter6Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter6Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter6Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
              Chapter 6 — Anatomy & Physiology
            </p>
            <h2 className="text-xl font-semibold text-white mt-1">Mastery & Learning-Gap Diagnostics</h2>
            <p className="text-sm text-silver mt-1">
              Shared grading keeps completion separate and combines micro-check, flashcard/study, chapter assessment, scenario/application, and formal remediation evidence without erasing original misses.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{chapter6LiveGrade.grade.finalGrade}%</div>
                <div className="text-xs text-silver mt-1">Chapter Grade</div>
                <div className="text-[10px] text-silver-gray mt-1">
                  {chapter6LiveGrade.evidenceComplete
                    ? 'Final live 20/10/40/15/15 evidence'
                    : 'Provisional — required evidence still incomplete'}
                </div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-white">{chapter6Diagnostics.overallMastery}%</div>
                <div className="text-xs text-silver mt-1">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-lg font-bold text-white capitalize">{chapter6Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-xs text-silver mt-1">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black p-4">
                <div className="text-2xl font-bold text-white">{chapter6Progress?.progress_percentage ?? 0}%</div>
                <div className="text-xs text-silver mt-1">Completion</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 text-sm">
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Micro Checks</p>
                <p className="text-white font-semibold mt-1">{chapter6Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter6Diagnostics.microCheckPercent}%`}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Chapter Assessment</p>
                <p className="text-white font-semibold mt-1">{chapter6Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter6Diagnostics.chapterAssessmentPercent}%`}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Remediation Status</p>
                <p className="text-white font-semibold mt-1">{chapter6Diagnostics.remediationStatus}</p>
              </div>
              <div className="rounded-lg border border-graphite p-3">
                <p className="text-silver-gray">Latest Reassessment</p>
                <p className="text-white font-semibold mt-1">{chapter6Diagnostics.latestReassessment}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter6Diagnostics.strongestConcepts.length > 0 ? chapter6Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptFamilyId} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} · {concept.observations} observations</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 6 evidence yet.</p>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter6Diagnostics.weakestConcepts.length > 0 ? chapter6Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptFamilyId} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} · {concept.observations} observations · {concept.initialMisses} initial misses{concept.reassessmentCorrect > 0 ? ` · ${concept.reassessmentCorrect} reassessment correct` : ''}</p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 6 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 text-xs text-silver-gray">
            Chapter 6 now uses the shared mastery weights. Formal recovery will only apply after five unique reassessment questions are completed for the target concept.
          </div>
                  </section>
        </details>

        {/* Chapter 7 diagnostic & intervention presentation */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 7 — {chapters.find((chapter) => chapter.chapter_number === 7)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter7LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter7Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter7Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter7Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 7 — Basics of Chemistry
                </p>
                <h2 className="text-xl font-semibold text-white mt-1">Mastery & Intervention Diagnostics</h2>
                <p className="text-sm text-silver mt-1">
                  Completion, grade, mastery, confidence, and intervention signals are shown separately.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-[var(--color-brand-gold)]">
                    {chapter7LiveGrade.grade.finalGrade}%
                  </div>
                  <div className="text-xs text-silver mt-1">Chapter Grade</div>
                <div className="text-[10px] text-silver-gray mt-1">
                  {chapter7LiveGrade.evidenceComplete
                    ? 'Final live 20/10/40/15/15 evidence'
                    : 'Provisional — required evidence still incomplete'}
                </div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter7Diagnostics.overallMastery}%</div>
                  <div className="text-xs text-silver mt-1">Overall Mastery</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-lg font-bold text-white capitalize">
                    {chapter7Diagnostics.overallConfidence.replaceAll('_', ' ')}
                  </div>
                  <div className="text-xs text-silver mt-1">Mastery Confidence</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">
                    {chapter7Progress?.progress_percentage ?? 0}%
                  </div>
                  <div className="text-xs text-silver mt-1">Completion</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Micro Checks</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter7Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter7Diagnostics.microCheckPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Chapter Assessment</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter7Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter7Diagnostics.chapterAssessmentPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Remediation Status</p>
                  <p className="text-white font-semibold mt-1">{chapter7Diagnostics.remediationStatus}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Latest Reassessment</p>
                  <p className="text-white font-semibold mt-1">{chapter7Diagnostics.latestReassessment}</p>
                </div>
              </div>
            </div>
          </div>

          {chapter7Diagnostics.interventionFlags.length > 0 && (
            <div className="p-6 border-b border-graphite">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Active Intervention Signals</h3>
              <div className="grid gap-3 mt-3">
                {chapter7Diagnostics.interventionFlags.map((flag) => (
                  <div
                    key={flag.key}
                    className={`rounded-lg border p-4 ${
                      flag.severity === 'urgent'
                        ? 'border-red-400/50 bg-red-950/20'
                        : flag.severity === 'priority'
                          ? 'border-warm-bronze/50 bg-warm-bronze/10'
                          : 'border-graphite bg-black'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-silver">
                        {flag.severity}
                      </span>
                      {flag.conceptName && (
                        <span className="text-sm font-semibold text-white">{flag.conceptName}</span>
                      )}
                    </div>
                    <p className="text-sm text-light-gray mt-2">{flag.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter7Diagnostics.strongestConcepts.length > 0 ? chapter7Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 7 evidence yet.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter7Diagnostics.weakestConcepts.length > 0 ? chapter7Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 7 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Concept Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {chapter7Diagnostics.concepts.map((concept) => (
                <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{concept.conceptName}</h4>
                      <p className="text-xs text-silver mt-1">
                        {concept.observations > 0
                          ? `${concept.observations} observations · ${concept.initialMisses} initial misses`
                          : 'No graded evidence yet'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">
                      {concept.observations > 0 ? `${concept.mastery}%` : '—'}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-silver-gray capitalize">
                    Confidence: {concept.confidence.replaceAll('_', ' ')}
                    {concept.reassessmentCorrect > 0 && ` · ${concept.reassessmentCorrect} reassessment correct`}
                  </div>
                  <div className="mt-1 text-xs text-silver-gray">
                    Latest evidence: {concept.mostRecentEvidenceAt ? formatDate(concept.mostRecentEvidenceAt) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 text-xs text-silver-gray">
            Grade hierarchy remains locked: micro checks 20%, flashcards 10%, chapter assessment 40%, scenario/application 15%, remediation/reassessment recovery 15%. Missing grade components are not replaced by completion activity.
          </div>
                  </section>
        </details>

        {/* Chapter 8 mastery, safety, remediation & instructor visibility */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 8 — {chapters.find((chapter) => chapter.chapter_number === 8)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter8LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter8Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter8Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter8Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 8 — Basics of Electricity
                </p>
                <h2 className="text-xl font-semibold text-white mt-1">Mastery & Intervention Diagnostics</h2>
                <p className="text-sm text-silver mt-1">
                  First-attempt evidence, electrical/light safety escalation, targeted remediation, and five-question reassessment recovery are shown from the same student evidence.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-[var(--color-brand-gold)]">
                    {chapter8LiveGrade.grade.finalGrade}%
                  </div>
                  <div className="text-xs text-silver mt-1">Chapter Grade</div>
                <div className="text-[10px] text-silver-gray mt-1">
                  {chapter8LiveGrade.evidenceComplete
                    ? 'Final live 20/10/40/15/15 evidence'
                    : 'Provisional — required evidence still incomplete'}
                </div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter8Diagnostics.overallMastery}%</div>
                  <div className="text-xs text-silver mt-1">Overall Mastery</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-lg font-bold text-white capitalize">
                    {chapter8Diagnostics.overallConfidence.replaceAll('_', ' ')}
                  </div>
                  <div className="text-xs text-silver mt-1">Mastery Confidence</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">
                    {chapter8Progress?.progress_percentage ?? 0}%
                  </div>
                  <div className="text-xs text-silver mt-1">Completion</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Micro Checks</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter8Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter8Diagnostics.microCheckPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Chapter Assessment</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter8Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter8Diagnostics.chapterAssessmentPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Remediation Status</p>
                  <p className="text-white font-semibold mt-1">{chapter8Diagnostics.remediationStatus}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Latest Reassessment</p>
                  <p className="text-white font-semibold mt-1">{chapter8Diagnostics.latestReassessment}</p>
                </div>
              </div>
            </div>
          </div>

          {chapter8Diagnostics.highestSafetyLevel !== 'clear' && (
            <div className="p-6 border-b border-graphite">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Electrical / Light Safety Signals</h3>
              <div className="grid gap-3 mt-3">
                {chapter8Diagnostics.safetyEscalations
                  .filter((item) => item.level !== 'clear')
                  .map((item) => (
                    <div
                      key={item.conceptFamilyId}
                      className={`rounded-lg border p-4 ${
                        item.level === 'urgent'
                          ? 'border-red-400/50 bg-red-950/20'
                          : 'border-warm-bronze/50 bg-warm-bronze/10'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-silver">
                          {item.level} safety intervention
                        </span>
                        {item.requiresFormalReassessment && (
                          <span className="text-xs font-semibold text-white">
                            5-question reassessment · 100% required
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-white mt-2">
                        {chapter8Diagnostics.concepts.find((concept) => concept.conceptFamilyId === item.conceptFamilyId)?.conceptName}
                      </p>
                      <p className="text-sm text-light-gray mt-1">{item.reason}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter8Diagnostics.strongestConcepts.length > 0 ? chapter8Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptFamilyId} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 8 evidence yet.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter8Diagnostics.weakestConcepts.length > 0 ? chapter8Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptFamilyId} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 8 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Concept Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {chapter8Diagnostics.concepts.map((concept) => (
                <div key={concept.conceptFamilyId} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{concept.conceptName}</h4>
                      <p className="text-xs text-silver mt-1">
                        {concept.observations > 0
                          ? `${concept.observations} observations · ${concept.initialMisses} initial misses`
                          : 'No graded evidence yet'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">
                      {concept.observations > 0 ? `${concept.mastery}%` : '—'}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-silver-gray capitalize">
                    Confidence: {concept.confidence.replaceAll('_', ' ')}
                    {concept.reassessmentCorrect > 0 && ` · ${concept.reassessmentCorrect} reassessment correct`}
                  </div>
                  <div className="mt-1 text-xs text-silver-gray">
                    Latest evidence: {concept.mostRecentEvidenceAt ? formatDate(concept.mostRecentEvidenceAt) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 text-xs text-silver-gray">
            Chapter 8 preserves first-attempt misses after recovery. Formal reassessment is five fresh questions; critical electrical/light safety concepts require 100% when safety escalation requires reassessment.
          </div>
                  </section>
        </details>

        {/* Chapter 9 mastery, safety, remediation & instructor visibility */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 9 — {chapters.find((chapter) => chapter.chapter_number === 9)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter9LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter9Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter9Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter9Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 9 — The Skin: Structure, Disorders, and Diseases
                </p>
                <h2 className="text-xl font-semibold text-white mt-1">Mastery & Intervention Diagnostics</h2>
                <p className="text-sm text-silver mt-1">
                  First-attempt evidence, learning gaps, safety escalation, remediation, and reassessment recovery are shown without exposing internal IDs.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-[var(--color-brand-gold)]">
                    {chapter9LiveGrade.grade.finalGrade}%
                  </div>
                  <div className="text-xs text-silver mt-1">Chapter Grade</div>
                <div className="text-[10px] text-silver-gray mt-1">
                  {chapter9LiveGrade.evidenceComplete
                    ? 'Final live 20/10/40/15/15 evidence'
                    : 'Provisional — required evidence still incomplete'}
                </div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter9Diagnostics.overallMastery}%</div>
                  <div className="text-xs text-silver mt-1">Overall Mastery</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-lg font-bold text-white capitalize">
                    {chapter9Diagnostics.overallConfidence.replaceAll('_', ' ')}
                  </div>
                  <div className="text-xs text-silver mt-1">Mastery Confidence</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">
                    {chapter9Progress?.progress_percentage ?? 0}%
                  </div>
                  <div className="text-xs text-silver mt-1">Completion</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Micro Checks</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter9Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter9Diagnostics.microCheckPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Chapter Assessment</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter9Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter9Diagnostics.chapterAssessmentPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Remediation Status</p>
                  <p className="text-white font-semibold mt-1">{chapter9Diagnostics.remediationStatus}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Latest Reassessment</p>
                  <p className="text-white font-semibold mt-1">{chapter9Diagnostics.latestReassessment}</p>
                </div>
              </div>
            </div>
          </div>

          {chapter9Diagnostics.safetyIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className={`rounded-lg border p-4 ${
                chapter9Diagnostics.safetyIntervention.level === 'urgent'
                  ? 'border-red-400/50 bg-red-950/20'
                  : 'border-warm-bronze/50 bg-warm-bronze/10'
              }`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-silver">
                    {chapter9Diagnostics.safetyIntervention.level} safety / scope intervention
                  </span>
                  {chapter9Diagnostics.safetyIntervention.requiresFormalSafetyReassessment && (
                    <span className="text-xs font-semibold text-white">
                      5-question reassessment · 100% required
                    </span>
                  )}
                </div>
                <p className="text-sm text-light-gray mt-2">
                  {chapter9Diagnostics.safetyIntervention.instructorReason}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter9Diagnostics.strongestConcepts.length > 0 ? chapter9Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 9 evidence yet.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter9Diagnostics.weakestConcepts.length > 0 ? chapter9Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 9 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Concept Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {chapter9Diagnostics.concepts.map((concept) => (
                <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{concept.conceptName}</h4>
                      <p className="text-xs text-silver mt-1">
                        {concept.observations > 0
                          ? `${concept.observations} observations · ${concept.initialMisses} initial misses`
                          : 'No graded evidence yet'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">
                      {concept.observations > 0 ? `${concept.mastery}%` : '—'}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-silver-gray capitalize">
                    Confidence: {concept.confidence.replaceAll('_', ' ')}
                    {concept.reassessmentCorrect > 0 && ` · ${concept.reassessmentCorrect} reassessment correct`}
                  </div>
                  <div className="mt-1 text-xs text-silver-gray">
                    Latest evidence: {concept.mostRecentEvidenceAt ? formatDate(concept.mostRecentEvidenceAt) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 text-xs text-silver-gray">
            Initial misses remain historical evidence after recovery. Chapter 9 uses the shared mastery hierarchy: micro checks 20%, flashcards 10%, chapter assessment 40%, scenario/application 15%, and remediation/reassessment recovery 15%.
          </div>
                  </section>
        </details>

        {/* Chapter 10 mastery, safety, remediation & instructor visibility */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 10 — {chapters.find((chapter) => chapter.chapter_number === 10)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter10LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter10Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter10Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter10Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 10 — Properties and Disorders of the Hair and Scalp
                </p>
                <h2 className="text-xl font-semibold text-white mt-1">Mastery & Intervention Diagnostics</h2>
                <p className="text-sm text-silver mt-1">
                  First-attempt evidence, learning gaps, safety escalation, remediation, and reassessment recovery are shown without exposing internal IDs.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-[var(--color-brand-gold)]">
                    {chapter10LiveGrade.grade.finalGrade}%
                  </div>
                  <div className="text-xs text-silver mt-1">Chapter Grade</div>
                <div className="text-[10px] text-silver-gray mt-1">
                  {chapter10LiveGrade.evidenceComplete
                    ? 'Final live 20/10/40/15/15 evidence'
                    : 'Provisional — required evidence still incomplete'}
                </div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter10Diagnostics.overallMastery}%</div>
                  <div className="text-xs text-silver mt-1">Overall Mastery</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-lg font-bold text-white capitalize">
                    {chapter10Diagnostics.overallConfidence.replaceAll('_', ' ')}
                  </div>
                  <div className="text-xs text-silver mt-1">Mastery Confidence</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">
                    {chapter10Progress?.progress_percentage ?? 0}%
                  </div>
                  <div className="text-xs text-silver mt-1">Completion</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Micro Checks</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter10Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter10Diagnostics.microCheckPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Chapter Assessment</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter10Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter10Diagnostics.chapterAssessmentPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Remediation Status</p>
                  <p className="text-white font-semibold mt-1">{chapter10Diagnostics.remediationStatus}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Latest Reassessment</p>
                  <p className="text-white font-semibold mt-1">{chapter10Diagnostics.latestReassessment}</p>
                </div>
              </div>
            </div>
          </div>

          {chapter10Diagnostics.safetyIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className={`rounded-lg border p-4 ${
                chapter10Diagnostics.safetyIntervention.level === 'urgent'
                  ? 'border-red-400/50 bg-red-950/20'
                  : 'border-warm-bronze/50 bg-warm-bronze/10'
              }`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-silver">
                    {chapter10Diagnostics.safetyIntervention.level} safety / scope intervention
                  </span>
                  {chapter10Diagnostics.safetyIntervention.requiresFormalSafetyReassessment && (
                    <span className="text-xs font-semibold text-white">
                      5-question reassessment · 100% required
                    </span>
                  )}
                </div>
                <p className="text-sm text-light-gray mt-2">
                  {chapter10Diagnostics.safetyIntervention.instructorReason}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter10Diagnostics.strongestConcepts.length > 0 ? chapter10Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 10 evidence yet.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter10Diagnostics.weakestConcepts.length > 0 ? chapter10Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 10 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Concept Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {chapter10Diagnostics.concepts.map((concept) => (
                <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{concept.conceptName}</h4>
                      <p className="text-xs text-silver mt-1">
                        {concept.observations > 0
                          ? `${concept.observations} observations · ${concept.initialMisses} initial misses`
                          : 'No graded evidence yet'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">
                      {concept.observations > 0 ? `${concept.mastery}%` : '—'}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-silver-gray capitalize">
                    Confidence: {concept.confidence.replaceAll('_', ' ')}
                    {concept.reassessmentCorrect > 0 && ` · ${concept.reassessmentCorrect} reassessment correct`}
                  </div>
                  <div className="mt-1 text-xs text-silver-gray">
                    Latest evidence: {concept.mostRecentEvidenceAt ? formatDate(concept.mostRecentEvidenceAt) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 text-xs text-silver-gray">
            Initial misses remain historical evidence after recovery. Chapter 10 uses the shared mastery hierarchy: micro checks 20%, flashcards 10%, chapter assessment 40%, scenario/application 15%, and remediation/reassessment recovery 15%.
          </div>
                  </section>
        </details>

        {/* Chapter 11 mastery, safety, remediation & instructor visibility */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 11 — {chapters.find((chapter) => chapter.chapter_number === 11)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter11LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter11Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter11Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter11Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 11 — Treatment of the Hair and Scalp
                </p>
                <h2 className="text-xl font-semibold text-white mt-1">Mastery & Intervention Diagnostics</h2>
                <p className="text-sm text-silver mt-1">
                  First-attempt evidence, learning gaps, safety escalation, remediation, and reassessment recovery are shown without exposing internal IDs.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-[var(--color-brand-gold)]">
                    {chapter11LiveGrade.grade.finalGrade}%
                  </div>
                  <div className="text-xs text-silver mt-1">Chapter Grade</div>
                <div className="text-[10px] text-silver-gray mt-1">
                  {chapter11LiveGrade.evidenceComplete
                    ? 'Final live 20/10/40/15/15 evidence'
                    : 'Provisional — required evidence still incomplete'}
                </div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter11Diagnostics.overallMastery}%</div>
                  <div className="text-xs text-silver mt-1">Overall Mastery</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-lg font-bold text-white capitalize">
                    {chapter11Diagnostics.overallConfidence.replaceAll('_', ' ')}
                  </div>
                  <div className="text-xs text-silver mt-1">Mastery Confidence</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">
                    {chapter11Progress?.progress_percentage ?? 0}%
                  </div>
                  <div className="text-xs text-silver mt-1">Completion</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Micro Checks</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter11Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter11Diagnostics.microCheckPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Chapter Assessment</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter11Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter11Diagnostics.chapterAssessmentPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Remediation Status</p>
                  <p className="text-white font-semibold mt-1">{chapter11Diagnostics.remediationStatus}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Latest Reassessment</p>
                  <p className="text-white font-semibold mt-1">{chapter11Diagnostics.latestReassessment}</p>
                </div>
              </div>
            </div>
          </div>

          {chapter11Diagnostics.safetyIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className={`rounded-lg border p-4 ${
                chapter11Diagnostics.safetyIntervention.level === 'urgent'
                  ? 'border-red-400/50 bg-red-950/20'
                  : 'border-warm-bronze/50 bg-warm-bronze/10'
              }`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-silver">
                    {chapter11Diagnostics.safetyIntervention.level} safety / scope intervention
                  </span>
                  {chapter11Diagnostics.safetyIntervention.requiresFormalSafetyReassessment && (
                    <span className="text-xs font-semibold text-white">
                      5-question reassessment · 100% required
                    </span>
                  )}
                </div>
                <p className="text-sm text-light-gray mt-2">
                  {chapter11Diagnostics.safetyIntervention.instructorReason}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter11Diagnostics.strongestConcepts.length > 0 ? chapter11Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 11 evidence yet.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter11Diagnostics.weakestConcepts.length > 0 ? chapter11Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 11 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Concept Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {chapter11Diagnostics.concepts.map((concept) => (
                <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{concept.conceptName}</h4>
                      <p className="text-xs text-silver mt-1">
                        {concept.observations > 0
                          ? `${concept.observations} observations · ${concept.initialMisses} initial misses`
                          : 'No graded evidence yet'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">
                      {concept.observations > 0 ? `${concept.mastery}%` : '—'}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-silver-gray capitalize">
                    Confidence: {concept.confidence.replaceAll('_', ' ')}
                    {concept.reassessmentCorrect > 0 && ` · ${concept.reassessmentCorrect} reassessment correct`}
                  </div>
                  <div className="mt-1 text-xs text-silver-gray">
                    Latest evidence: {concept.mostRecentEvidenceAt ? formatDate(concept.mostRecentEvidenceAt) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 text-xs text-silver-gray">
            Initial misses remain historical evidence after recovery. Chapter 11 uses the shared mastery hierarchy: micro checks 20%, flashcards 10%, chapter assessment 40%, scenario/application 15%, and remediation/reassessment recovery 15%.
          </div>
                  </section>
        </details>

        {/* Chapter 12 mastery, safety, remediation & instructor visibility */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 12 — {chapters.find((chapter) => chapter.chapter_number === 12)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter12LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter12Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter12Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter12Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 12 — Men&apos;s Facial Massage and Treatments
                </p>
                <h2 className="text-xl font-semibold text-white mt-1">Mastery & Intervention Diagnostics</h2>
                <p className="text-sm text-silver mt-1">
                  First-attempt evidence, learning gaps, safety escalation, remediation, and reassessment recovery are shown without exposing internal IDs.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-[var(--color-brand-gold)]">
                    {chapter12LiveGrade.grade.finalGrade}%
                  </div>
                  <div className="text-xs text-silver mt-1">Chapter Grade</div>
                <div className="text-[10px] text-silver-gray mt-1">
                  {chapter12LiveGrade.evidenceComplete
                    ? 'Final live 20/10/40/15/15 evidence'
                    : 'Provisional — required evidence still incomplete'}
                </div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter12Diagnostics.overallMastery}%</div>
                  <div className="text-xs text-silver mt-1">Overall Mastery</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-lg font-bold text-white capitalize">
                    {chapter12Diagnostics.overallConfidence.replaceAll('_', ' ')}
                  </div>
                  <div className="text-xs text-silver mt-1">Mastery Confidence</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">
                    {chapter12Progress?.progress_percentage ?? 0}%
                  </div>
                  <div className="text-xs text-silver mt-1">Completion</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Micro Checks</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter12Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter12Diagnostics.microCheckPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Chapter Assessment</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter12Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter12Diagnostics.chapterAssessmentPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Remediation Status</p>
                  <p className="text-white font-semibold mt-1">{chapter12Diagnostics.remediationStatus}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Latest Reassessment</p>
                  <p className="text-white font-semibold mt-1">{chapter12Diagnostics.latestReassessment}</p>
                </div>
              </div>
            </div>
          </div>

          {chapter12Diagnostics.safetyIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className={`rounded-lg border p-4 ${
                chapter12Diagnostics.safetyIntervention.level === 'urgent'
                  ? 'border-red-400/50 bg-red-950/20'
                  : 'border-warm-bronze/50 bg-warm-bronze/10'
              }`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-silver">
                    {chapter12Diagnostics.safetyIntervention.level} safety / scope intervention
                  </span>
                  {chapter12Diagnostics.safetyIntervention.requiresFormalSafetyReassessment && (
                    <span className="text-xs font-semibold text-white">
                      5-question reassessment · 100% required
                    </span>
                  )}
                </div>
                <p className="text-sm text-light-gray mt-2">
                  {chapter12Diagnostics.safetyIntervention.instructorReason}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter12Diagnostics.strongestConcepts.length > 0 ? chapter12Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 12 evidence yet.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter12Diagnostics.weakestConcepts.length > 0 ? chapter12Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 12 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Concept Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {chapter12Diagnostics.concepts.map((concept) => (
                <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{concept.conceptName}</h4>
                      <p className="text-xs text-silver mt-1">
                        {concept.observations > 0
                          ? `${concept.observations} observations · ${concept.initialMisses} initial misses`
                          : 'No graded evidence yet'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">
                      {concept.observations > 0 ? `${concept.mastery}%` : '—'}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-silver-gray capitalize">
                    Confidence: {concept.confidence.replaceAll('_', ' ')}
                    {concept.reassessmentCorrect > 0 && ` · ${concept.reassessmentCorrect} reassessment correct`}
                  </div>
                  <div className="mt-1 text-xs text-silver-gray">
                    Latest evidence: {concept.mostRecentEvidenceAt ? formatDate(concept.mostRecentEvidenceAt) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 text-xs text-silver-gray">
            Initial misses remain historical evidence after recovery. Chapter 12 uses the shared mastery hierarchy: micro checks 20%, flashcards 10%, chapter assessment 40%, scenario/application 15%, and remediation/reassessment recovery 15%.
          </div>
                  </section>
        </details>

        {/* Chapter 13 mastery, safety, remediation & instructor visibility */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 13 — {chapters.find((chapter) => chapter.chapter_number === 13)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter13LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter13Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter13Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter13Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 13 — Shaving and Facial-Hair Design
                </p>
                <h2 className="text-xl font-semibold text-white mt-1">Mastery & Intervention Diagnostics</h2>
                <p className="text-sm text-silver mt-1">
                  First-attempt evidence, learning gaps, safety escalation, remediation, and reassessment recovery are shown without exposing internal IDs.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-[var(--color-brand-gold)]">
                    {chapter13LiveGrade.grade.finalGrade}%
                  </div>
                  <div className="text-xs text-silver mt-1">Chapter Grade</div>
                <div className="text-[10px] text-silver-gray mt-1">
                  {chapter13LiveGrade.evidenceComplete
                    ? 'Final live 20/10/40/15/15 evidence'
                    : 'Provisional — required evidence still incomplete'}
                </div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter13Diagnostics.overallMastery}%</div>
                  <div className="text-xs text-silver mt-1">Overall Mastery</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-lg font-bold text-white capitalize">
                    {chapter13Diagnostics.overallConfidence.replaceAll('_', ' ')}
                  </div>
                  <div className="text-xs text-silver mt-1">Mastery Confidence</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">
                    {chapter13Progress?.progress_percentage ?? 0}%
                  </div>
                  <div className="text-xs text-silver mt-1">Completion</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Micro Checks</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter13Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter13Diagnostics.microCheckPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Chapter Assessment</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter13Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter13Diagnostics.chapterAssessmentPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Remediation Status</p>
                  <p className="text-white font-semibold mt-1">{chapter13Diagnostics.remediationStatus}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Latest Reassessment</p>
                  <p className="text-white font-semibold mt-1">{chapter13Diagnostics.latestReassessment}</p>
                </div>
              </div>
            </div>
          </div>

          {chapter13Diagnostics.safetyIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className={`rounded-lg border p-4 ${
                chapter13Diagnostics.safetyIntervention.level === 'urgent'
                  ? 'border-red-400/50 bg-red-950/20'
                  : 'border-warm-bronze/50 bg-warm-bronze/10'
              }`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-silver">
                    {chapter13Diagnostics.safetyIntervention.level} safety / scope intervention
                  </span>
                  {chapter13Diagnostics.safetyIntervention.requiresFormalSafetyReassessment && (
                    <span className="text-xs font-semibold text-white">
                      5-question reassessment · 100% required
                    </span>
                  )}
                </div>
                <p className="text-sm text-light-gray mt-2">
                  {chapter13Diagnostics.safetyIntervention.instructorReason}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter13Diagnostics.strongestConcepts.length > 0 ? chapter13Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 13 evidence yet.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter13Diagnostics.weakestConcepts.length > 0 ? chapter13Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 13 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Concept Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {chapter13Diagnostics.concepts.map((concept) => (
                <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{concept.conceptName}</h4>
                      <p className="text-xs text-silver mt-1">
                        {concept.observations > 0
                          ? `${concept.observations} observations · ${concept.initialMisses} initial misses`
                          : 'No graded evidence yet'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">
                      {concept.observations > 0 ? `${concept.mastery}%` : '—'}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-silver-gray capitalize">
                    Confidence: {concept.confidence.replaceAll('_', ' ')}
                    {concept.reassessmentCorrect > 0 && ` · ${concept.reassessmentCorrect} reassessment correct`}
                  </div>
                  <div className="mt-1 text-xs text-silver-gray">
                    Latest evidence: {concept.mostRecentEvidenceAt ? formatDate(concept.mostRecentEvidenceAt) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 text-xs text-silver-gray">
            Initial misses remain historical evidence after recovery. Chapter 13 uses the shared mastery hierarchy: micro checks 20%, flashcards 10%, chapter assessment 40%, scenario/application 15%, and remediation/reassessment recovery 15%.
          </div>
                  </section>
        </details>

        {/* Chapter 14 mastery, safety, remediation & instructor visibility */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 14 — {chapters.find((chapter) => chapter.chapter_number === 14)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter14LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter14Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter14Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter14Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 14 — Men’s Haircutting and Styling
                </p>
                <h2 className="text-xl font-semibold text-white mt-1">Mastery & Intervention Diagnostics</h2>
                <p className="text-sm text-silver mt-1">
                  First-attempt evidence, learning gaps, safety escalation, remediation, and reassessment recovery are shown without exposing internal IDs.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-[var(--color-brand-gold)]">
                    {chapter14LiveGrade.grade.finalGrade}%
                  </div>
                  <div className="text-xs text-silver mt-1">Chapter Grade</div>
                <div className="text-[10px] text-silver-gray mt-1">
                  {chapter14LiveGrade.evidenceComplete
                    ? 'Final live 20/10/40/15/15 evidence'
                    : 'Provisional — required evidence still incomplete'}
                </div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter14Diagnostics.overallMastery}%</div>
                  <div className="text-xs text-silver mt-1">Overall Mastery</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-lg font-bold text-white capitalize">
                    {chapter14Diagnostics.overallConfidence.replaceAll('_', ' ')}
                  </div>
                  <div className="text-xs text-silver mt-1">Mastery Confidence</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">
                    {chapter14Progress?.progress_percentage ?? 0}%
                  </div>
                  <div className="text-xs text-silver mt-1">Completion</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Micro Checks</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter14Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter14Diagnostics.microCheckPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Chapter Assessment</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter14Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter14Diagnostics.chapterAssessmentPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Remediation Status</p>
                  <p className="text-white font-semibold mt-1">{chapter14Diagnostics.remediationStatus}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Latest Reassessment</p>
                  <p className="text-white font-semibold mt-1">{chapter14Diagnostics.latestReassessment}</p>
                </div>
              </div>
            </div>
          </div>

          {chapter14Diagnostics.safetyIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className={`rounded-lg border p-4 ${
                chapter14Diagnostics.safetyIntervention.level === 'urgent'
                  ? 'border-red-400/50 bg-red-950/20'
                  : 'border-warm-bronze/50 bg-warm-bronze/10'
              }`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-silver">
                    {chapter14Diagnostics.safetyIntervention.level} safety / scope intervention
                  </span>
                  {chapter14Diagnostics.safetyIntervention.requiresFormalSafetyReassessment && (
                    <span className="text-xs font-semibold text-white">
                      5-question reassessment · 100% required
                    </span>
                  )}
                </div>
                <p className="text-sm text-light-gray mt-2">
                  {chapter14Diagnostics.safetyIntervention.instructorReason}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter14Diagnostics.strongestConcepts.length > 0 ? chapter14Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 14 evidence yet.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter14Diagnostics.weakestConcepts.length > 0 ? chapter14Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 14 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Concept Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {chapter14Diagnostics.concepts.map((concept) => (
                <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{concept.conceptName}</h4>
                      <p className="text-xs text-silver mt-1">
                        {concept.observations > 0
                          ? `${concept.observations} observations · ${concept.initialMisses} initial misses`
                          : 'No graded evidence yet'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">
                      {concept.observations > 0 ? `${concept.mastery}%` : '—'}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-silver-gray capitalize">
                    Confidence: {concept.confidence.replaceAll('_', ' ')}
                    {concept.reassessmentCorrect > 0 && ` · ${concept.reassessmentCorrect} reassessment correct`}
                  </div>
                  <div className="mt-1 text-xs text-silver-gray">
                    Latest evidence: {concept.mostRecentEvidenceAt ? formatDate(concept.mostRecentEvidenceAt) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 text-xs text-silver-gray">
            Initial misses remain historical evidence after recovery. Chapter 14 uses the shared mastery hierarchy: micro checks 20%, flashcards 10%, chapter assessment 40%, scenario/application 15%, and remediation/reassessment recovery 15%.
          </div>
                  </section>
        </details>


        {/* Chapter 15 mastery, safety, remediation & instructor visibility */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 15 — {chapters.find((chapter) => chapter.chapter_number === 15)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter15LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter15Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter15Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter15Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 15 — Men’s Hair Replacement
                </p>
                <h2 className="text-xl font-semibold text-white mt-1">Mastery & Intervention Diagnostics</h2>
                <p className="text-sm text-silver mt-1">
                  First-attempt evidence, learning gaps, safety escalation, remediation, and reassessment recovery are shown without exposing internal IDs.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-[var(--color-brand-gold)]">
                    {chapter15LiveGrade.grade.finalGrade}%
                  </div>
                  <div className="text-xs text-silver mt-1">Chapter Grade</div>
                <div className="text-[10px] text-silver-gray mt-1">
                  {chapter15LiveGrade.evidenceComplete
                    ? 'Final live 20/10/40/15/15 evidence'
                    : 'Provisional — required evidence still incomplete'}
                </div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter15Diagnostics.overallMastery}%</div>
                  <div className="text-xs text-silver mt-1">Overall Mastery</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-lg font-bold text-white capitalize">
                    {chapter15Diagnostics.overallConfidence.replaceAll('_', ' ')}
                  </div>
                  <div className="text-xs text-silver mt-1">Mastery Confidence</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">
                    {chapter15Progress?.progress_percentage ?? 0}%
                  </div>
                  <div className="text-xs text-silver mt-1">Completion</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Micro Checks</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter15Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter15Diagnostics.microCheckPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Chapter Assessment</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter15Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter15Diagnostics.chapterAssessmentPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Remediation Status</p>
                  <p className="text-white font-semibold mt-1">{chapter15Diagnostics.remediationStatus}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Latest Reassessment</p>
                  <p className="text-white font-semibold mt-1">{chapter15Diagnostics.latestReassessment}</p>
                </div>
              </div>
            </div>
          </div>

          {chapter15Diagnostics.safetyIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className={`rounded-lg border p-4 ${
                chapter15Diagnostics.safetyIntervention.level === 'urgent'
                  ? 'border-red-400/50 bg-red-950/20'
                  : 'border-warm-bronze/50 bg-warm-bronze/10'
              }`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-silver">
                    {chapter15Diagnostics.safetyIntervention.level} safety / scope intervention
                  </span>
                  {chapter15Diagnostics.safetyIntervention.requiresFormalSafetyReassessment && (
                    <span className="text-xs font-semibold text-white">
                      5-question reassessment · 100% required
                    </span>
                  )}
                </div>
                <p className="text-sm text-light-gray mt-2">
                  {chapter15Diagnostics.safetyIntervention.instructorReason}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter15Diagnostics.strongestConcepts.length > 0 ? chapter15Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 15 evidence yet.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter15Diagnostics.weakestConcepts.length > 0 ? chapter15Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 15 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Concept Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {chapter15Diagnostics.concepts.map((concept) => (
                <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{concept.conceptName}</h4>
                      <p className="text-xs text-silver mt-1">
                        {concept.observations > 0
                          ? `${concept.observations} observations · ${concept.initialMisses} initial misses`
                          : 'No graded evidence yet'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">
                      {concept.observations > 0 ? `${concept.mastery}%` : '—'}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-silver-gray capitalize">
                    Confidence: {concept.confidence.replaceAll('_', ' ')}
                    {concept.reassessmentCorrect > 0 && ` · ${concept.reassessmentCorrect} reassessment correct`}
                  </div>
                  <div className="mt-1 text-xs text-silver-gray">
                    Latest evidence: {concept.mostRecentEvidenceAt ? formatDate(concept.mostRecentEvidenceAt) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 text-xs text-silver-gray">
            Initial misses remain historical evidence after recovery. Chapter 15 uses the shared mastery hierarchy: micro checks 20%, flashcards 10%, chapter assessment 40%, scenario/application 15%, and remediation/reassessment recovery 15%.
          </div>
                  </section>
        </details>

        {/* Chapter 16 mastery, safety, remediation & instructor visibility */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 16 — {chapters.find((chapter) => chapter.chapter_number === 16)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter16LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter16Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter16Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter16Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 16 — Women&apos;s Haircutting & Styling
                </p>
                <h2 className="text-xl font-semibold text-white mt-1">Mastery & Intervention Diagnostics</h2>
                <p className="text-sm text-silver mt-1">
                  First-attempt evidence, learning gaps, safety escalation, remediation, and reassessment recovery are shown without exposing internal IDs.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-[var(--color-brand-gold)]">
                    {chapter16LiveGrade.grade.finalGrade}%
                  </div>
                  <div className="text-xs text-silver mt-1">Chapter Grade</div>
                <div className="text-[10px] text-silver-gray mt-1">
                  {chapter16LiveGrade.evidenceComplete
                    ? 'Final live 20/10/40/15/15 evidence'
                    : 'Provisional — required evidence still incomplete'}
                </div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter16Diagnostics.overallMastery}%</div>
                  <div className="text-xs text-silver mt-1">Overall Mastery</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-lg font-bold text-white capitalize">
                    {chapter16Diagnostics.overallConfidence.replaceAll('_', ' ')}
                  </div>
                  <div className="text-xs text-silver mt-1">Mastery Confidence</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">
                    {chapter16Progress?.progress_percentage ?? 0}%
                  </div>
                  <div className="text-xs text-silver mt-1">Completion</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Micro Checks</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter16Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter16Diagnostics.microCheckPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Chapter Assessment</p>
                  <p className="text-white font-semibold mt-1">
                    {chapter16Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter16Diagnostics.chapterAssessmentPercent}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Remediation Status</p>
                  <p className="text-white font-semibold mt-1">{chapter16Diagnostics.remediationStatus}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Latest Reassessment</p>
                  <p className="text-white font-semibold mt-1">{chapter16Diagnostics.latestReassessment}</p>
                </div>
              </div>
            </div>
          </div>

          {chapter16Diagnostics.safetyIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className={`rounded-lg border p-4 ${
                chapter16Diagnostics.safetyIntervention.level === 'urgent'
                  ? 'border-red-400/50 bg-red-950/20'
                  : 'border-warm-bronze/50 bg-warm-bronze/10'
              }`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-silver">
                    {chapter16Diagnostics.safetyIntervention.level} safety intervention
                  </span>
                  {chapter16Diagnostics.safetyIntervention.requiresFormalSafetyReassessment && (
                    <span className="text-xs font-semibold text-white">
                      5-question reassessment · 100% required
                    </span>
                  )}
                </div>
                <p className="text-sm text-light-gray mt-2">
                  {chapter16Diagnostics.safetyIntervention.instructorReason}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter16Diagnostics.strongestConcepts.length > 0 ? chapter16Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 16 evidence yet.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter16Diagnostics.weakestConcepts.length > 0 ? chapter16Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">
                        {concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 16 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Concept Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {chapter16Diagnostics.concepts.map((concept) => (
                <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{concept.conceptName}</h4>
                      <p className="text-xs text-silver mt-1">
                        {concept.observations > 0
                          ? `${concept.observations} observations · ${concept.initialMisses} initial misses`
                          : 'No graded evidence yet'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">
                      {concept.observations > 0 ? `${concept.mastery}%` : '—'}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-silver-gray capitalize">
                    Confidence: {concept.confidence.replaceAll('_', ' ')}
                    {concept.reassessmentCorrect > 0 && ` · ${concept.reassessmentCorrect} reassessment correct`}
                  </div>
                  <div className="mt-1 text-xs text-silver-gray">
                    Latest evidence: {concept.mostRecentEvidenceAt ? formatDate(concept.mostRecentEvidenceAt) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 text-xs text-silver-gray">
            Initial misses remain historical evidence after recovery. Chapter 16 uses the shared mastery hierarchy: micro checks 20%, flashcards 10%, chapter assessment 40%, scenario/application 15%, and remediation/reassessment recovery 15%.
          </div>
                  </section>
        </details>

        {/* Chapter 17 mastery, chemical safety, remediation & instructor visibility */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 17 — {chapters.find((chapter) => chapter.chapter_number === 17)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter17LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter17Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter17Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter17Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 17 — Chemical Texture Services
                </p>
                <h2 className="text-xl font-semibold text-white mt-1">Mastery & Chemical-Safety Diagnostics</h2>
                <p className="text-sm text-silver mt-1">
                  First-attempt evidence, scenario application, learning gaps, chemical-safety escalation, remediation, and reassessment recovery are shown without exposing internal IDs or raw answer payloads.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{chapter17LiveGrade.grade.finalGrade}%</div>
                  <div className="text-xs text-silver mt-1">Chapter Grade</div>
                  <div className="text-[10px] text-silver-gray mt-1">
                    {chapter17LiveGrade.evidenceComplete ? 'Final live 20/10/40/15/15 evidence' : 'Provisional — required evidence still incomplete'}
                  </div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter17Diagnostics.overallMastery}%</div>
                  <div className="text-xs text-silver mt-1">Overall Mastery</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-lg font-bold text-white capitalize">{chapter17Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                  <div className="text-xs text-silver mt-1">Mastery Confidence</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter17Progress?.progress_percentage ?? 0}%</div>
                  <div className="text-xs text-silver mt-1">Completion</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Micro Checks</p>
                  <p className="text-white font-semibold mt-1">{chapter17Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter17Diagnostics.microCheckPercent}%`}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Chapter Assessment</p>
                  <p className="text-white font-semibold mt-1">{chapter17Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter17Diagnostics.chapterAssessmentPercent}%`}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Remediation Status</p>
                  <p className="text-white font-semibold mt-1">{chapter17Diagnostics.remediationStatus}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Latest Reassessment</p>
                  <p className="text-white font-semibold mt-1">{chapter17Diagnostics.latestReassessment}</p>
                </div>
              </div>
            </div>
          </div>

          {chapter17Diagnostics.safetyIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className={`rounded-lg border p-4 ${chapter17Diagnostics.safetyIntervention.level === 'urgent' ? 'border-red-400/50 bg-red-950/20' : 'border-warm-bronze/50 bg-warm-bronze/10'}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-silver">
                    {chapter17Diagnostics.safetyIntervention.level} chemical-safety intervention
                  </span>
                  {chapter17Diagnostics.safetyIntervention.requiresFormalSafetyReassessment && (
                    <span className="text-xs font-semibold text-white">5-question reassessment · 100% required</span>
                  )}
                </div>
                <p className="text-sm text-light-gray mt-2">{chapter17Diagnostics.safetyIntervention.instructorReason}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter17Diagnostics.strongestConcepts.length > 0 ? chapter17Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 17 evidence yet.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter17Diagnostics.weakestConcepts.length > 0 ? chapter17Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations</p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 17 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Concept Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {chapter17Diagnostics.concepts.map((concept) => (
                <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{concept.conceptName}</h4>
                      <p className="text-xs text-silver mt-1">
                        {concept.observations > 0 ? `${concept.observations} observations · ${concept.initialMisses} initial misses` : 'No graded evidence yet'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.observations > 0 ? `${concept.mastery}%` : '—'}</span>
                  </div>
                  <div className="mt-3 text-xs text-silver-gray capitalize">
                    Confidence: {concept.confidence.replaceAll('_', ' ')}
                    {concept.reassessmentCorrect > 0 && ` · ${concept.reassessmentCorrect} reassessment correct`}
                  </div>
                  <div className="mt-1 text-xs text-silver-gray">
                    Latest evidence: {concept.mostRecentEvidenceAt ? formatDate(concept.mostRecentEvidenceAt) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 text-xs text-silver-gray">
            Initial misses remain historical evidence after recovery. Chapter 17 uses the shared mastery hierarchy: micro checks 20%, flashcards 10%, chapter assessment 40%, scenario/application 15%, and remediation/reassessment recovery 15%.
          </div>
                  </section>
        </details>

        {/* Chapter 18 mastery, haircolor/lightener safety, remediation & instructor visibility */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 18 — {chapters.find((chapter) => chapter.chapter_number === 18)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter18LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter18Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter18Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter18Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 18 — Haircoloring and Lightening
                </p>
                <h2 className="text-xl font-semibold text-white mt-1">Mastery & Haircolor & Lightener Safety Diagnostics</h2>
                <p className="text-sm text-silver mt-1">
                  First-attempt evidence, scenario application, learning gaps, haircolor/lightener safety escalation, remediation, and reassessment recovery are shown without exposing internal IDs or raw answer payloads.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{chapter18LiveGrade.grade.finalGrade}%</div>
                  <div className="text-xs text-silver mt-1">Chapter Grade</div>
                  <div className="text-[10px] text-silver-gray mt-1">
                    {chapter18LiveGrade.evidenceComplete ? 'Final live 20/10/40/15/15 evidence' : 'Provisional — required evidence still incomplete'}
                  </div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter18Diagnostics.overallMastery}%</div>
                  <div className="text-xs text-silver mt-1">Overall Mastery</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-lg font-bold text-white capitalize">{chapter18Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                  <div className="text-xs text-silver mt-1">Mastery Confidence</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter18Progress?.progress_percentage ?? 0}%</div>
                  <div className="text-xs text-silver mt-1">Completion</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Micro Checks</p>
                  <p className="text-white font-semibold mt-1">{chapter18Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter18Diagnostics.microCheckPercent}%`}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Chapter Assessment</p>
                  <p className="text-white font-semibold mt-1">{chapter18Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter18Diagnostics.chapterAssessmentPercent}%`}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Remediation Status</p>
                  <p className="text-white font-semibold mt-1">{chapter18Diagnostics.remediationStatus}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Latest Reassessment</p>
                  <p className="text-white font-semibold mt-1">{chapter18Diagnostics.latestReassessment}</p>
                </div>
              </div>
            </div>
          </div>

          {chapter18Diagnostics.safetyIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className={`rounded-lg border p-4 ${chapter18Diagnostics.safetyIntervention.level === 'urgent' ? 'border-red-400/50 bg-red-950/20' : 'border-warm-bronze/50 bg-warm-bronze/10'}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-silver">
                    {chapter18Diagnostics.safetyIntervention.level} haircolor/lightener safety intervention
                  </span>
                  {chapter18Diagnostics.safetyIntervention.requiresFormalSafetyReassessment && (
                    <span className="text-xs font-semibold text-white">5-question reassessment · 100% required</span>
                  )}
                </div>
                <p className="text-sm text-light-gray mt-2">{chapter18Diagnostics.safetyIntervention.instructorReason}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter18Diagnostics.strongestConcepts.length > 0 ? chapter18Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 18 evidence yet.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter18Diagnostics.weakestConcepts.length > 0 ? chapter18Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations</p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 18 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Concept Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {chapter18Diagnostics.concepts.map((concept) => (
                <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{concept.conceptName}</h4>
                      <p className="text-xs text-silver mt-1">
                        {concept.observations > 0 ? `${concept.observations} observations · ${concept.initialMisses} initial misses` : 'No graded evidence yet'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.observations > 0 ? `${concept.mastery}%` : '—'}</span>
                  </div>
                  <div className="mt-3 text-xs text-silver-gray capitalize">
                    Confidence: {concept.confidence.replaceAll('_', ' ')}
                    {concept.reassessmentCorrect > 0 && ` · ${concept.reassessmentCorrect} reassessment correct`}
                  </div>
                  <div className="mt-1 text-xs text-silver-gray">
                    Latest evidence: {concept.mostRecentEvidenceAt ? formatDate(concept.mostRecentEvidenceAt) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 text-xs text-silver-gray">
            Initial misses remain historical evidence after recovery. Chapter 18 uses the shared mastery hierarchy: micro checks 20%, flashcards 10%, chapter assessment 40%, scenario/application 15%, and remediation/reassessment recovery 15%.
          </div>
                  </section>
        </details>

        {/* Chapter 19 mastery, licensing/compliance, safety, remediation & instructor visibility */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 19 — {chapters.find((chapter) => chapter.chapter_number === 19)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter19LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter19Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter19Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter19Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 19 — Preparing for Licensure and Employment
                </p>
                <h2 className="text-xl font-semibold text-white mt-1">Mastery, Safety & Compliance Diagnostics</h2>
                <p className="text-sm text-silver mt-1">
                  Preserved first-attempt evidence, weak concepts, practical-safety escalation, licensing/employment-law compliance, targeted remediation, and reassessment recovery are shown without exposing internal IDs or raw answer payloads.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{chapter19LiveGrade.grade.finalGrade}%</div>
                  <div className="text-xs text-silver mt-1">Chapter Grade</div>
                  <div className="text-[10px] text-silver-gray mt-1">
                    {chapter19LiveGrade.evidenceComplete ? 'Final live 20/10/40/15/15 evidence' : 'Provisional — required evidence still incomplete'}
                  </div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter19Diagnostics.overallMastery}%</div>
                  <div className="text-xs text-silver mt-1">Overall Mastery</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-lg font-bold text-white capitalize">{chapter19Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                  <div className="text-xs text-silver mt-1">Mastery Confidence</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter19Progress?.progress_percentage ?? 0}%</div>
                  <div className="text-xs text-silver mt-1">Completion</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Micro Checks</p>
                  <p className="text-white font-semibold mt-1">{chapter19Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter19Diagnostics.microCheckPercent}%`}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Chapter Assessment</p>
                  <p className="text-white font-semibold mt-1">{chapter19Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter19Diagnostics.chapterAssessmentPercent}%`}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Remediation Status</p>
                  <p className="text-white font-semibold mt-1">{chapter19Diagnostics.remediationStatus}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Latest Reassessment</p>
                  <p className="text-white font-semibold mt-1">{chapter19Diagnostics.latestReassessment}</p>
                </div>
              </div>
            </div>
          </div>

          {chapter19Diagnostics.safetyIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className={`rounded-lg border p-4 ${chapter19Diagnostics.safetyIntervention.level === 'urgent' ? 'border-red-400/50 bg-red-950/20' : 'border-warm-bronze/50 bg-warm-bronze/10'}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-silver">
                    {chapter19Diagnostics.safetyIntervention.level} practical-safety intervention
                  </span>
                  {chapter19Diagnostics.safetyIntervention.requiresFormalSafetyReassessment && (
                    <span className="text-xs font-semibold text-white">5-question reassessment · 100% required</span>
                  )}
                </div>
                <p className="text-sm text-light-gray mt-2">{chapter19Diagnostics.safetyIntervention.instructorReason}</p>
              </div>
            </div>
          )}

          {chapter19Diagnostics.complianceIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className="rounded-lg border border-silver/30 bg-silver/5 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-silver">
                    {chapter19Diagnostics.complianceIntervention.level} licensing / employment-law compliance review
                  </span>
                  {chapter19Diagnostics.complianceIntervention.requiresFormalReassessment && (
                    <span className="text-xs font-semibold text-white">5-question reassessment · 80% required</span>
                  )}
                </div>
                <p className="text-sm text-light-gray mt-2">{chapter19Diagnostics.complianceIntervention.instructorReason}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter19Diagnostics.strongestConcepts.length > 0 ? chapter19Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 19 evidence yet.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter19Diagnostics.weakestConcepts.length > 0 ? chapter19Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations</p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 19 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Concept Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {chapter19Diagnostics.concepts.map((concept) => (
                <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{concept.conceptName}</h4>
                      <p className="text-xs text-silver mt-1">
                        {concept.observations > 0 ? `${concept.observations} observations · ${concept.initialMisses} initial misses` : 'No graded evidence yet'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.observations > 0 ? `${concept.mastery}%` : '—'}</span>
                  </div>
                  <div className="mt-3 text-xs text-silver-gray capitalize">
                    Confidence: {concept.confidence.replaceAll('_', ' ')}
                    {concept.reassessmentCorrect > 0 && ` · ${concept.reassessmentCorrect} reassessment correct`}
                  </div>
                  <div className="mt-1 text-xs text-silver-gray">
                    Latest evidence: {concept.mostRecentEvidenceAt ? formatDate(concept.mostRecentEvidenceAt) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 text-xs text-silver-gray">
            Initial misses remain historical evidence after recovery. Chapter 19 keeps practical bodily-safety escalation distinct from licensing and employment-law compliance review and uses the shared 20/10/40/15/15 mastery hierarchy.
          </div>
                  </section>
        </details>

        {/* Chapter 20 mastery, compliance, remediation & instructor visibility */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 20 — {chapters.find((chapter) => chapter.chapter_number === 20)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter20LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter20Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter20Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter20Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 20 — Working Behind the Chair
                </p>
                <h2 className="text-xl font-semibold text-white mt-1">Mastery & Compliance Diagnostics</h2>
                <p className="text-sm text-silver mt-1">
                  Preserved first-attempt evidence, weak concepts, classification/tax/privacy compliance state, targeted remediation, and reassessment recovery are shown without exposing internal IDs or raw answer payloads.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{chapter20LiveGrade.grade.finalGrade}%</div>
                  <div className="text-xs text-silver mt-1">Chapter Grade</div>
                  <div className="text-[10px] text-silver-gray mt-1">
                    {chapter20LiveGrade.evidenceComplete ? 'Final live 20/10/40/15/15 evidence' : 'Provisional — required evidence still incomplete'}
                  </div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter20Diagnostics.overallMastery}%</div>
                  <div className="text-xs text-silver mt-1">Overall Mastery</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-lg font-bold text-white capitalize">{chapter20Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                  <div className="text-xs text-silver mt-1">Mastery Confidence</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter20Progress?.progress_percentage ?? 0}%</div>
                  <div className="text-xs text-silver mt-1">Completion</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Micro Checks</p>
                  <p className="text-white font-semibold mt-1">{chapter20Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter20Diagnostics.microCheckPercent}%`}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Chapter Assessment</p>
                  <p className="text-white font-semibold mt-1">{chapter20Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter20Diagnostics.chapterAssessmentPercent}%`}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Remediation Status</p>
                  <p className="text-white font-semibold mt-1">{chapter20Diagnostics.remediationStatus}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Latest Reassessment</p>
                  <p className="text-white font-semibold mt-1">{chapter20Diagnostics.latestReassessment}</p>
                </div>
              </div>
            </div>
          </div>

          {chapter20Diagnostics.complianceIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className="rounded-lg border border-silver/30 bg-silver/5 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-silver">
                    {chapter20Diagnostics.complianceIntervention.level} classification / tax / privacy compliance review
                  </span>
                  {chapter20Diagnostics.complianceIntervention.requiresFormalReassessment && (
                    <span className="text-xs font-semibold text-white">5-question reassessment · 80% required</span>
                  )}
                </div>
                <p className="text-sm text-light-gray mt-2">{chapter20Diagnostics.complianceIntervention.instructorReason}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter20Diagnostics.strongestConcepts.length > 0 ? chapter20Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 20 evidence yet.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter20Diagnostics.weakestConcepts.length > 0 ? chapter20Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations</p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 20 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Concept Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {chapter20Diagnostics.concepts.map((concept) => (
                <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{concept.conceptName}</h4>
                      <p className="text-xs text-silver mt-1">
                        {concept.observations > 0 ? `${concept.observations} observations · ${concept.initialMisses} initial misses` : 'No graded evidence yet'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.observations > 0 ? `${concept.mastery}%` : '—'}</span>
                  </div>
                  <div className="mt-3 text-xs text-silver-gray capitalize">
                    Confidence: {concept.confidence.replaceAll('_', ' ')}
                    {concept.reassessmentCorrect > 0 && ` · ${concept.reassessmentCorrect} reassessment correct`}
                  </div>
                  <div className="mt-1 text-xs text-silver-gray">
                    Latest evidence: {concept.mostRecentEvidenceAt ? formatDate(concept.mostRecentEvidenceAt) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 text-xs text-silver-gray">
            Preserved initial misses: {chapter20Diagnostics.preservedInitialMissCount}. Chapter 20 compliance review stays separate from bodily-safety escalation; successful 80% reassessment can raise mastery without deleting the original diagnostic record.
          </div>
                  </section>
        </details>

        {/* Chapter 21 mastery, business/legal compliance, remediation & instructor visibility */}
        <details data-chapter-accordion className="group bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 21 — {chapters.find((chapter) => chapter.chapter_number === 21)?.title ?? ''}
                </p>
                <p className="mt-1 text-sm text-silver-gray">Select to view full mastery and learning-gap diagnostics.</p>
              </div>
              <ChapterAccordionChevron />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-[var(--color-brand-gold)]">{chapter21LiveGrade.grade.finalGrade}%</div>
                <div className="text-[11px] text-silver">Chapter Grade</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter21Diagnostics.overallMastery}%</div>
                <div className="text-[11px] text-silver">Overall Mastery</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="truncate text-sm font-bold capitalize text-white">{chapter21Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                <div className="text-[11px] text-silver">Confidence</div>
              </div>
              <div className="rounded-lg border border-graphite bg-black px-3 py-2">
                <div className="text-lg font-bold text-white">{chapter21Progress?.progress_percentage ?? 0}%</div>
                <div className="text-[11px] text-silver">Completion</div>
              </div>
            </div>
          </summary>
          <section className="border-t border-graphite">
          <div className="p-6 border-b border-graphite">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
                  Chapter 21 — The Business of Barbering
                </p>
                <h2 className="text-xl font-semibold text-white mt-1">Mastery & Compliance Diagnostics</h2>
                <p className="text-sm text-silver mt-1">
                  Preserved first-attempt evidence, weak concepts, business/legal/tax/privacy compliance state, targeted remediation, and reassessment recovery are shown without exposing internal IDs or raw answer payloads.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{chapter21LiveGrade.grade.finalGrade}%</div>
                  <div className="text-xs text-silver mt-1">Chapter Grade</div>
                  <div className="text-[10px] text-silver-gray mt-1">
                    {chapter21LiveGrade.evidenceComplete ? 'Final live 20/10/40/15/15 evidence' : 'Provisional — required evidence still incomplete'}
                  </div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter21Diagnostics.overallMastery}%</div>
                  <div className="text-xs text-silver mt-1">Overall Mastery</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-lg font-bold text-white capitalize">{chapter21Diagnostics.overallConfidence.replaceAll('_', ' ')}</div>
                  <div className="text-xs text-silver mt-1">Mastery Confidence</div>
                </div>
                <div className="rounded-lg border border-graphite bg-black p-4">
                  <div className="text-2xl font-bold text-white">{chapter21Progress?.progress_percentage ?? 0}%</div>
                  <div className="text-xs text-silver mt-1">Completion</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Micro Checks</p>
                  <p className="text-white font-semibold mt-1">{chapter21Diagnostics.microCheckPercent === null ? 'No evidence' : `${chapter21Diagnostics.microCheckPercent}%`}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Chapter Assessment</p>
                  <p className="text-white font-semibold mt-1">{chapter21Diagnostics.chapterAssessmentPercent === null ? 'Not attempted' : `${chapter21Diagnostics.chapterAssessmentPercent}%`}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Remediation Status</p>
                  <p className="text-white font-semibold mt-1">{chapter21Diagnostics.remediationStatus}</p>
                </div>
                <div className="rounded-lg border border-graphite p-3">
                  <p className="text-silver-gray">Latest Reassessment</p>
                  <p className="text-white font-semibold mt-1">{chapter21Diagnostics.latestReassessment}</p>
                </div>
              </div>
            </div>
          </div>

          {chapter21Diagnostics.complianceIntervention.requiresInstructorReview && (
            <div className="p-6 border-b border-graphite">
              <div className="rounded-lg border border-silver/30 bg-silver/5 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-silver">
                    {chapter21Diagnostics.complianceIntervention.level} business / legal / tax / privacy compliance review
                  </span>
                  {chapter21Diagnostics.complianceIntervention.requiresFormalReassessment && (
                    <span className="text-xs font-semibold text-white">5-question reassessment · 80% required</span>
                  )}
                </div>
                <p className="text-sm text-light-gray mt-2">{chapter21Diagnostics.complianceIntervention.instructorReason}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-graphite">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Strongest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter21Diagnostics.strongestConcepts.length > 0 ? chapter21Diagnostics.strongestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 21 evidence yet.</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Weakest Concepts</h3>
              <div className="space-y-2 mt-3">
                {chapter21Diagnostics.weakestConcepts.length > 0 ? chapter21Diagnostics.weakestConcepts.map((concept) => (
                  <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{concept.conceptName}</p>
                      <p className="text-xs text-silver mt-1 capitalize">{concept.confidence.replaceAll('_', ' ')} confidence · {concept.observations} observations</p>
                    </div>
                    <span className="text-sm font-semibold text-warm-bronze">{concept.mastery}%</span>
                  </div>
                )) : <p className="text-sm text-silver">Not enough Chapter 21 evidence yet.</p>}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Concept Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {chapter21Diagnostics.concepts.map((concept) => (
                <div key={concept.conceptName} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{concept.conceptName}</h4>
                      <p className="text-xs text-silver mt-1">
                        {concept.observations > 0 ? `${concept.observations} observations · ${concept.initialMisses} initial misses` : 'No graded evidence yet'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-brand-gold)]">{concept.observations > 0 ? `${concept.mastery}%` : '—'}</span>
                  </div>
                  <div className="mt-3 text-xs text-silver-gray capitalize">
                    Confidence: {concept.confidence.replaceAll('_', ' ')}
                    {concept.reassessmentCorrect > 0 && ` · ${concept.reassessmentCorrect} reassessment correct`}
                  </div>
                  <div className="mt-1 text-xs text-silver-gray">
                    Latest evidence: {concept.mostRecentEvidenceAt ? formatDate(concept.mostRecentEvidenceAt) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 text-xs text-silver-gray">
            Preserved initial misses: {chapter21Diagnostics.preservedInitialMissCount}. Chapter 21 compliance review stays separate from bodily-safety escalation; successful 80% reassessment can raise mastery without deleting the original diagnostic record.
          </div>
                  </section>
        </details>
        </ChapterAccordionGroup>

        {/* Phase 5 — Board Readiness & Analytics */}
        <BoardReadinessCard readiness={boardReadiness} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <WeakAreaAnalytics weakAreas={analytics.weakAreas} strongAreas={analytics.strongAreas} />
          </div>
          <div>
            <StudyRecommendations recommendations={recommendations} studentId={studentId} instructorView />
          </div>
        </div>

        <AnalyticsCharts
          readinessScore={boardReadiness.score}
          categoryPerformance={analytics.categoryPerformance}
          chapterPerformance={analytics.chapterPerformance}
          missedQuestionTrend={analytics.missedQuestionTrend}
        />

        {/* Missed Question Statistics */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Missed Question Bank</h2>
              <p className="text-sm text-silver mt-1">
                {missedQuestions.length} missed question{missedQuestions.length === 1 ? '' : 's'} recorded
              </p>
            </div>
            <Link
              href={`/instructor/student/${studentId}`}
              className="text-sm text-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold-light)] font-medium"
            >
              View full report →
            </Link>
          </div>
          <div className="p-6">
            {missedQuestions.length > 0 ? (
              <MissedQuestionBank questions={missedQuestions.slice(0, 10)} instructorView />
            ) : (
              <div className="text-center text-silver py-8">
                No missed questions yet.
              </div>
            )}
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="bg-charcoal border border-graphite rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Overall Course Progress</h2>
            <span className={`text-2xl font-bold ${
              overallProgress >= 80 ? 'text-gold' :
              overallProgress >= 50 ? 'text-warm-bronze' : 'text-silver'
            }`}>
              {overallProgress}%
            </span>
          </div>
          <div className="bg-graphite rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                overallProgress >= 80 ? 'bg-gold' :
                overallProgress >= 50 ? 'bg-warm-bronze' : 'bg-silver'
              }`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-sm text-silver-gray mt-3">
            {completedChapters} of {totalChapters} chapters completed
            {quizzesCompleted > 0 && ` • ${quizzesCompleted} quizzes passed`}
            {flashcardsCompleted > 0 && ` • ${flashcardsCompleted} flashcard decks completed`}
          </p>
        </div>

        {/* Chapter Progress */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite">
            <h2 className="text-xl font-semibold text-white">Chapter-by-Chapter Progress</h2>
          </div>
          {chapters && chapters.length > 0 ? (
            <div className="divide-y divide-graphite">
              {chapters.map((chapter) => {
                const chapterProgress = progressRecords.find((p) => p.chapter_id === chapter.id)
                const pct = chapterProgress?.progress_percentage || 0
                const flashDone = chapterProgress?.flashcards_completed
                const quizDone = chapterProgress?.quiz_completed
                const bestScore = chapterProgress?.best_quiz_score
                const chapterPassingScore = getLocalQuiz(chapter.id)?.passing_score ?? 80

                return (
                  <div key={chapter.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg font-bold text-[var(--color-brand-gold)] w-8 shrink-0">
                        {String(chapter.chapter_number).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{chapter.title}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-silver mt-1">
                          <span className={flashDone ? 'text-gold' : ''}>
                            {flashDone ? '✓ Flashcards' : '○ Flashcards'}
                          </span>
                          <span className={quizDone ? 'text-gold' : ''}>
                            {quizDone ? '✓ Quiz' : '○ Quiz'}
                          </span>
                          {bestScore !== null && bestScore !== undefined && (
                            <span className={bestScore >= chapterPassingScore ? 'text-gold' : 'text-warm-bronze'}>
                              Best: {bestScore}% (pass: {chapterPassingScore}%)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-56">
                      <div className="flex-1 bg-graphite rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            pct >= chapterPassingScore ? 'bg-gold' :
                            pct >= 50 ? 'bg-warm-bronze' :
                            pct > 0 ? 'bg-[var(--color-brand-gold)]' : 'bg-[var(--color-border-secondary)]'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm text-silver w-10 text-right">{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-silver">No chapters available.</div>
          )}
        </div>

        {/* Flashcard Completion Summary */}
        <div className="bg-charcoal border border-graphite rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Flashcard Completion</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-graphite rounded-full h-3">
              <div
                className="bg-silver h-3 rounded-full transition-all"
                style={{ width: `${totalChapters > 0 ? (flashcardsCompleted / totalChapters) * 100 : 0}%` }}
              />
            </div>
            <span className="text-white font-semibold w-24 text-right">
              {flashcardsCompleted} / {totalChapters}
            </span>
          </div>
          <p className="text-sm text-silver-gray mt-3">
            {flashcardsCompleted === 0
              ? 'No flashcard decks completed yet.'
              : flashcardsCompleted === totalChapters
              ? 'All flashcard decks completed.'
              : `${totalChapters - flashcardsCompleted} decks remaining.`}
          </p>
        </div>

        {/* Recent Quiz Attempts */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Quiz Attempts</h2>
            <span className="text-sm text-silver-gray">{attemptRecords.length} total</span>
          </div>
          {attemptRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-silver border-b border-graphite">
                    <th className="p-4">Quiz</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Percentage</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {attemptRecords.map((attempt) => {
                    const attemptPassingScore = getPassingScoreByQuizId(attempt.quiz_id)
                    return (
                      <tr key={attempt.id} className="border-b border-graphite/50">
                        <td className="p-4 text-white">{attempt.quiz_id}</td>
                        <td className="p-4 text-light-gray">
                          {attempt.score} / {attempt.total_questions}
                        </td>
                        <td className="p-4">
                          <span
                            className={`font-semibold ${
                              attempt.percentage >= attemptPassingScore ? 'text-gold' : 'text-warm-bronze'
                            }`}
                          >
                            {attempt.percentage}%
                          </span>
                        </td>
                        <td className="p-4 text-silver">
                          {formatDate(attempt.completed_at)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-silver">No quiz attempts yet.</div>
          )}
        </div>

        {/* Weak Areas */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite">
            <h2 className="text-xl font-semibold text-white">Weak Areas & Study Focus</h2>
          </div>

          {!hasEnoughQuizData ? (
            <div className="p-8 text-center text-silver">
              <p className="font-medium">Not enough quiz data yet</p>
              <p className="text-sm text-silver-gray mt-2">
                This student needs at least two completed chapter quizzes before weak-area analytics can be generated.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-graphite">
              {/* Board Risk Summary */}
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="text-sm text-silver">Board Exam Risk:</div>
                  <div className={`text-lg font-bold ${boardRisk.color}`}>{boardRisk.label}</div>
                </div>
                <p className="text-sm text-silver-gray mt-2">{boardRisk.description}</p>
              </div>

              {/* Weak Areas List */}
              {weakAreas.length > 0 && (
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-silver uppercase tracking-wide mb-4">
                    Weakest Areas
                  </h3>
                  <div className="space-y-3">
                    {weakAreas.map((area) => (
                      <div
                        key={area.chapterId}
                        className="flex items-center justify-between p-3 bg-charcoal/20 border border-silver/30 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium">
                            Ch.{area.chapterNumber} — {area.chapterTitle}
                          </p>
                          <p className="text-xs text-silver-gray">
                            {area.score < area.passingScore ? `Below passing threshold (${area.passingScore}%)` : area.score < 80 ? 'Needs polish' : 'Lowest relative score'}
                          </p>
                        </div>
                        <div className={`text-xl font-bold ${
                          area.score >= area.passingScore ? 'text-warm-bronze' :
                          area.score >= 60 ? 'text-warm-bronze' : 'text-silver'
                        }`}>
                          {area.score}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strong Areas List */}
              {strongAreas.length > 0 && (
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gold-light uppercase tracking-wide mb-4">
                    Strongest Areas
                  </h3>
                  <div className="space-y-3">
                    {strongAreas.map((area) => (
                      <div
                        key={area.chapterId}
                        className="flex items-center justify-between p-3 bg-charcoal/20 border border-gold/30 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium">
                            Ch.{area.chapterNumber} — {area.chapterTitle}
                          </p>
                          <p className="text-xs text-silver-gray">Strong performance</p>
                        </div>
                        <div className="text-xl font-bold text-gold">{area.score}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Study Focus */}
              {weakAreas.length > 0 && (
                <div className="p-6 bg-[var(--color-brand-gold)]/5">
                  <h3 className="text-sm font-semibold text-[var(--color-brand-gold)] uppercase tracking-wide mb-3">
                    Recommended Study Focus
                  </h3>
                  <p className="text-sm text-silver mb-3">
                    Prioritize review in these areas to improve board readiness:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-light-gray">
                    {weakAreas.slice(0, 3).map((area) => (
                      <li key={area.chapterId}>
                        <span className="font-medium text-white">
                          Chapter {area.chapterNumber} — {area.chapterTitle}
                        </span>
                        <span className="text-silver-gray ml-2">(current best: {area.score}%)</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {weakAreas.length === 0 && (
                <div className="p-8 text-center text-silver">
                  No weak areas found — all attempted chapters are performing strongly.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Attendance Summary */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite">
            <h2 className="text-xl font-semibold text-white">Attendance Summary</h2>
            <p className="text-sm text-silver mt-1">Last 11 school days</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border-b border-graphite">
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className={`text-xl font-bold ${attendanceSummary.attendancePercentage >= 80 ? 'text-gold' : attendanceSummary.attendancePercentage >= 70 ? 'text-warm-bronze' : 'text-silver'}`}>
                {attendanceSummary.attendancePercentage}%
              </div>
              <div className="text-xs text-silver mt-1">Attendance Rate</div>
            </div>
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-gold">{attendanceSummary.presentDays}</div>
              <div className="text-xs text-silver mt-1">Present</div>
            </div>
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-silver">{attendanceSummary.absentDays}</div>
              <div className="text-xs text-silver mt-1">Absent</div>
            </div>
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-warm-bronze">{attendanceSummary.tardyDays}</div>
              <div className="text-xs text-silver mt-1">Tardy</div>
            </div>
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-silver">{attendanceSummary.excusedDays}</div>
              <div className="text-xs text-silver mt-1">Excused</div>
            </div>
          </div>

          {attendanceSummary.isAtRisk && (
            <div className="p-4 bg-charcoal/20 border-b border-silver/30">
              <div className="flex items-start gap-3">
                <span className="text-silver text-lg">⚠️</span>
                <div>
                  <h3 className="text-sm font-semibold text-silver">Attendance Concern</h3>
                  <p className="text-sm text-light-gray">{attendanceSummary.riskReason}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 border-b border-graphite">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Recent History</h3>
            {recentAttendance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-silver border-b border-graphite">
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Clock In</th>
                      <th className="p-3">Clock Out</th>
                      <th className="p-3">Minutes</th>
                      <th className="p-3">Note</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {recentAttendance.slice(0, 10).map((record) => (
                      <tr key={record.id} className="border-b border-graphite last:border-0">
                        <td className="p-3 text-light-gray">{formatDate(record.date)}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColorClass(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="p-3 text-silver">
                          {record.clockedInAt ? new Date(record.clockedInAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td className="p-3 text-silver">
                          {record.clockedOutAt ? new Date(record.clockedOutAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td className="p-3 text-silver">
                          {record.minutesPresent !== null ? `${record.minutesPresent} min` : '—'}
                        </td>
                        <td className="p-3 text-silver truncate max-w-[200px]">
                          {record.note || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-silver text-sm">No attendance records found.</p>
            )}
          </div>

          {attendanceNoteRecords.length > 0 && (
            <div className="p-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Attendance Notes</h3>
              <div className="space-y-3">
                {attendanceNoteRecords.map((note) => (
                  <div key={note.id} className="p-3 bg-black border border-graphite rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-silver-gray">{formatDate(note.date)}</span>
                      <span className="text-xs text-silver-gray">by {note.instructorName}</span>
                    </div>
                    <p className="text-sm text-light-gray">{note.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Instructor Notes */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite">
            <h2 className="text-xl font-semibold text-white">Instructor Notes</h2>
          </div>

          {notesError && (
            <div className="mx-6 mt-6 bg-charcoal/30 border border-silver/50 text-silver rounded-lg p-4">
              {notesError}
            </div>
          )}

          <div className="p-6">
            <AddNoteForm studentId={studentId} />
          </div>

          {noteRecords.length > 0 ? (
            <div className="divide-y divide-graphite">
              {noteRecords.map((note) => (
                <div key={note.id} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                        note.note_type === 'coaching' ? 'bg-silver/20 text-silver border border-silver/30' :
                        note.note_type === 'remediation' ? 'bg-silver/20 text-silver border border-silver/30' :
                        note.note_type === 'readiness' ? 'bg-gold/20 text-gold border border-gold/30' :
                        'bg-[var(--color-border-secondary)] text-light-gray border border-silver-gray'
                      }`}>
                        {note.note_type}
                      </span>
                      <span className="text-sm text-silver">by {note.instructor_name}</span>
                    </div>
                    <span className="text-xs text-silver-gray">{formatDate(note.created_at)}</span>
                  </div>
                  <p className="text-light-gray text-sm whitespace-pre-wrap">{note.note_text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-silver">
              No instructor notes yet.
              <p className="text-sm text-silver-gray mt-2">
                Use the form above to add coaching, remediation, readiness, or general notes.
              </p>
            </div>
          )}
        </div>

        {/* Hour Tracker */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite">
            <h2 className="text-xl font-semibold text-white">Hour Tracker</h2>
            <p className="text-sm text-silver mt-1">
              Only instructor-approved hours count toward official completed hours.
            </p>
          </div>

          {/* Hour Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border-b border-graphite">
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-gold">{formatMinutes(approvedMinutes)}</div>
              <div className="text-xs text-silver mt-1">Approved Hours</div>
            </div>
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-warm-bronze">{formatMinutes(pendingMinutes)}</div>
              <div className="text-xs text-silver mt-1">Pending Approval</div>
            </div>
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-[var(--color-brand-gold)]">{formatMinutes(REQUIRED_MINUTES)}</div>
              <div className="text-xs text-silver mt-1">Required Hours</div>
            </div>
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-silver">{formatMinutes(remainingMinutes)}</div>
              <div className="text-xs text-silver mt-1">Remaining Hours</div>
            </div>
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-silver">{completionPercentage}%</div>
              <div className="text-xs text-silver mt-1">Completion</div>
            </div>
          </div>

          {/* Daily Hour Log */}
          <div className="p-6 border-b border-graphite">
            <h3 className="text-lg font-semibold text-white mb-4">Daily Hour Log</h3>
            {hourLogRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-silver border-b border-graphite">
                      <th className="p-4">Date</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Minutes</th>
                      <th className="p-4">Display</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {hourLogRecords.map((log) => (
                      <tr key={log.id} className="border-b border-graphite/50">
                        <td className="p-4 text-white">{formatDate(log.date)}</td>
                        <td className="p-4 text-light-gray">{log.category}</td>
                        <td className="p-4 text-light-gray">{log.minutes}</td>
                        <td className="p-4 text-white font-medium">{formatMinutes(log.minutes)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase border ${statusBadgeClasses(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-4 text-silver-gray">{log.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-silver">
                No hour logs yet.
                <p className="text-sm text-silver-gray mt-2">Daily logs will appear here once submitted.</p>
              </div>
            )}
          </div>

          {/* Rejected Logs */}
          {hourLogRecords.some((h) => h.status === 'rejected') && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Rejected Logs</h3>
              <p className="text-sm text-silver-gray mb-3">
                These logs do not count toward official hours and may need to be resubmitted.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-silver border-b border-graphite">
                      <th className="p-4">Date</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Hours</th>
                      <th className="p-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {hourLogRecords
                      .filter((h) => h.status === 'rejected')
                      .map((log) => (
                        <tr key={log.id} className="border-b border-graphite/50">
                          <td className="p-4 text-white">{formatDate(log.date)}</td>
                          <td className="p-4 text-light-gray">{log.category}</td>
                          <td className="p-4 text-white">{formatMinutes(log.minutes)}</td>
                          <td className="p-4 text-silver-gray">{log.notes || '—'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Board Hours Summary Report */}
        <section id="board-hours-report" className="report-hours-section bg-white text-black rounded-xl p-8 shadow-lg print:shadow-none">
          <style>{`
            @media print {
              body * { visibility: hidden; }
              .report-hours-section, .report-hours-section * { visibility: visible; }
              .report-hours-section { position: absolute; left: 0; top: 0; width: 100%; padding: 0.5in !important; }
              .report-hours-section button { display: none !important; }
            }
          `}</style>

          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Board Hours Summary Report</h2>
              <p className="text-sm text-silver-gray">Generated {new Date().toLocaleDateString()}</p>
            </div>
            <PrintButton />
          </div>

          {/* Student Info */}
          <div className="mb-6">
            <StudentIdentity student={resolvedStudent} variant="light" showRole />
            <p className="text-sm text-silver-gray mt-2">Program: {programName}</p>
            <p className="text-sm text-silver-gray">State: {boardState}</p>
          </div>

          {/* Official Hour Totals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{formatMinutes(REQUIRED_MINUTES)}</div>
              <div className="text-xs text-silver-gray">Required Hours</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gold">{formatMinutes(approvedMinutes)}</div>
              <div className="text-xs text-silver-gray">Approved Hours</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-silver">{formatMinutes(remainingMinutes)}</div>
              <div className="text-xs text-silver-gray">Remaining Hours</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-silver">{completionPercentage}%</div>
              <div className="text-xs text-silver-gray">Completion</div>
            </div>
          </div>

          {/* Approved Daily Logs */}
          <div className="mb-6 print-break-inside">
            <h3 className="text-lg font-bold text-white mb-3">Approved Daily Hour Logs</h3>
            {hourLogRecords.filter((h) => h.status === 'approved').length > 0 ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Hours</th>
                    <th className="py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {hourLogRecords
                    .filter((h) => h.status === 'approved')
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((log) => (
                      <tr key={log.id} className="border-b border-gray-100">
                        <td className="py-2 pr-4">{formatDate(log.date)}</td>
                        <td className="py-2 pr-4">{log.category}</td>
                        <td className="py-2 pr-4">{formatMinutes(log.minutes)}</td>
                        <td className="py-2">{log.notes || '—'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p className="text-silver-gray">No approved hours yet.</p>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-off-white border border-warm-bronze rounded-lg p-4 mb-6">
            <p className="text-sm text-warm-bronze">
              <span className="font-semibold">Disclaimer:</span> Verify state-specific submission requirements before submitting to a licensing board. This report is a summary of approved hours only and is not an official state board form.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-silver mt-8 pt-4 border-t border-gray-200">
            ASCYN PRO — Board Hours Summary Report
          </div>
        </section>
      </div>
    </div>
  )
}
