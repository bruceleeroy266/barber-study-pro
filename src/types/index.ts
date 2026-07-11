export type AppRole = 'student' | 'instructor' | 'apprentice' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: AppRole
  school_id: string | null
  barber_shop_name: string | null
  mentor_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface School {
  id: string
  name: string
  address: string | null
  contact_email: string | null
  subscription_status: 'active' | 'inactive' | 'trial'
  created_at: string
}

export interface Chapter {
  id: string
  chapter_number: number
  title: string
  description: string | null
  content: string | null
  order_index: number
  is_active: boolean
}

export interface Flashcard {
  id: string
  chapter_id: string
  front: string
  back: string
  category: string | null
  difficulty: 'easy' | 'medium' | 'hard' | null
  order_index: number
  is_active: boolean
  competency_id?: string
}

export interface Quiz {
  id: string
  chapter_id: string
  title: string
  description: string | null
  is_active: boolean
  passing_score?: number
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correct_answer: 'a' | 'b' | 'c' | 'd'
  explanation: string | null
  difficulty: 'easy' | 'medium' | 'hard'
  order_index: number
  competency_id?: string
}

export interface QuizAttempt {
  id: string
  user_id: string
  quiz_id: string
  score: number
  total_questions: number
  percentage: number
  answers_json: Record<string, string>
  completed_at: string
}

export interface StudentProgress {
  id: string
  user_id: string
  chapter_id: string
  flashcards_completed: boolean
  quiz_completed: boolean
  best_quiz_score: number | null
  last_studied_at: string | null
  progress_percentage: number
}

export interface ChapterWithProgress extends Chapter {
  progress?: StudentProgress
  flashcardCount?: number
  quizQuestionCount?: number
}

export interface InstructorNote {
  id: string
  student_id: string
  instructor_id: string
  instructor_name: string
  note_type: 'coaching' | 'remediation' | 'readiness' | 'general'
  note_text: string
  created_at: string
}

export type HourCategory = 'Theory' | 'Practical' | 'Clinic' | 'Sanitation' | 'Makeup Hours' | 'Other'
export type HourStatus = 'pending' | 'approved' | 'rejected'

export interface HourLog {
  id: string
  user_id: string
  date: string
  category: HourCategory
  minutes: number
  status: HourStatus
  notes: string | null
  created_at: string
  updated_at: string
}

// ============================================================================
// PHASE 5 — BOARD READINESS, ANALYTICS, AND MISSED QUESTIONS
// ============================================================================

export type ReadinessLevel = 'Ready' | 'Nearly Ready' | 'Needs Review' | 'At Risk'

export interface BoardReadiness {
  userId: string
  score: number
  level: ReadinessLevel
  quizAverage: number
  quizCompletionRate: number
  chapterCompletionRate: number
  flashcardEngagementRate: number
  consistencyScore: number
  improvementTrend: 'improving' | 'stable' | 'declining'
  totalQuestionsAnswered: number
  chaptersCompleted: number
  totalChapters: number
  recommendedStudyMinutes: number
  updatedAt: string
}

export interface AreaPerformance {
  id: string
  name: string
  chapterNumber: number | null
  category: string
  score: number
  attempts: number
  trend: 'improving' | 'stable' | 'declining'
  lastAttemptAt: string | null
}

export interface StudyRecommendation {
  id: string
  type: 'study' | 'review' | 'practice'
  title: string
  description: string
  chapterNumber: number | null
  priority: 'critical' | 'high' | 'medium' | 'low'
  estimatedMinutes: number
}

export interface MissedQuestion {
  id: string
  userId: string
  questionId: string
  question: string
  correctAnswer: string
  studentAnswer: string
  explanation: string | null
  chapterId: string
  chapterNumber: number
  category: string
  quizId: string
  missedAt: string
  retakenAt: string | null
  timesMissed: number
}

export interface StudentAnalyticsSummary {
  userId: string
  totalQuestionsAnswered: number
  totalCorrect: number
  totalIncorrect: number
  averageScore: number
  quizzesCompleted: number
  flashcardsReviewed: number
  chaptersCompleted: number
  totalChapters: number
  streakDays: number
  lastStudyAt: string | null
  readiness: BoardReadiness
  weakAreas: AreaPerformance[]
  strongAreas: AreaPerformance[]
  recommendations: StudyRecommendation[]
  missedQuestions: MissedQuestion[]
}

export interface InstructorReadinessOverview {
  userId: string
  fullName: string
  email: string
  role: string
  readinessScore: number
  readinessLevel: ReadinessLevel
  weakestCategory: string | null
  lastActivityAt: string | null
}

// ============================================================================
// PHASE 6 — ATTENDANCE & CLOCK-IN FOUNDATION
// ============================================================================

export type AttendanceStatus =
  | 'Present'
  | 'Absent'
  | 'Tardy'
  | 'Excused'
  | 'Clocked In'
  | 'Clocked Out'

export interface ClockEvent {
  id: string
  attendanceRecordId: string
  eventType: 'in' | 'out'
  timestamp: string
  note?: string | null
}

export interface AttendanceRecord {
  id: string
  userId: string
  schoolId: string | null
  date: string
  status: AttendanceStatus
  clockedInAt: string | null
  clockedOutAt: string | null
  minutesPresent: number | null
  note: string | null
  verifiedBy: string | null
  createdAt: string
  updatedAt: string
  clockEvents?: ClockEvent[]
}

export interface AttendanceSummary {
  userId: string
  totalDays: number
  presentDays: number
  absentDays: number
  tardyDays: number
  excusedDays: number
  clockedInDays: number
  attendancePercentage: number
  tardyRate: number
  absentRate: number
  averageMinutesPerDay: number | null
  currentStatus: AttendanceStatus | null
  lastAttendanceDate: string | null
  isAtRisk: boolean
  riskReason: string | null
}

export interface AttendanceConcern {
  userId: string
  fullName: string
  attendancePercentage: number
  concernType: 'low_attendance' | 'absent' | 'tardy' | 'no_show'
  description: string
  lastAttendanceDate: string | null
}

export interface InstructorAttendanceNote {
  id: string
  studentId: string
  instructorId: string
  instructorName: string
  date: string
  note: string
  createdAt: string
}

// ============================================================================
// PHASE 7 — INSTRUCTOR ATTENDANCE MANAGEMENT & REPORTING
// ============================================================================

export interface AttendanceCorrection {
  id: string
  attendanceRecordId: string
  originalStatus: AttendanceStatus
  newStatus: AttendanceStatus
  reason: string
  correctedBy: string
  correctedAt: string
  approvedBy?: string | null
  approvedAt?: string | null
}

export interface AttendanceAuditEntry {
  id: string
  recordId: string
  action: 'create' | 'update' | 'correct'
  changedFields: Record<string, { old: unknown; new: unknown }>
  userId: string
  userName: string
  timestamp: string
  reason?: string | null
}

export interface AttendanceFilterState {
  dateFrom?: string | null
  dateTo?: string | null
  studentIds?: string[]
  statuses?: AttendanceStatus[]
  searchQuery?: string | null
}

// ============================================================================
// PHASE 8A — INTERNAL MESSAGING CENTER
// ============================================================================

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export type MessageStatus = 'draft' | 'sent' | 'delivered' | 'read'

export interface MessageRecipient {
  id: string
  userId: string
  name: string
  role: 'student' | 'instructor' | 'apprentice' | 'admin'
  readAt?: string | null
}

export interface Message {
  id: string
  threadId: string
  senderId: string
  senderName: string
  senderRole: 'student' | 'instructor' | 'apprentice' | 'admin'
  recipientIds: string[]
  subject: string
  body: string
  status: MessageStatus
  priority: NotificationPriority
  sentAt: string
  readAt?: string | null
}

export interface MessageThread {
  id: string
  subject: string
  participants: MessageRecipient[]
  lastMessageAt: string
  lastMessagePreview: string
  unreadCount: number
  isGroup: boolean
  groupName?: string | null
}

export type NotificationType =
  | 'attendance_alert'
  | 'attendance_risk'
  | 'board_readiness'
  | 'missing_hours'
  | 'missed_assessment'
  | 'upcoming_exam'
  | 'announcement'
  | 'message'
  | 'general'
  // Phase 13D enterprise notification types
  | 'system'
  | 'security'
  | 'compliance'
  | 'attendance'
  | 'grades'
  | 'assessments'
  | 'school_approval'
  | 'account_approval'
  | 'maintenance'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  priority: NotificationPriority
  read: boolean
  createdAt: string
  actionUrl?: string | null
}

export interface Announcement {
  id: string
  schoolId: string
  title: string
  body: string
  authorId: string
  authorName: string
  priority: NotificationPriority
  expiresAt?: string | null
  createdAt: string
}

// ============================================================================
// PHASE 9 — GRADEBOOK & ASSESSMENTS SUITE
// ============================================================================

export type GradeCategoryType =
  | 'WRITTEN_EXAM'
  | 'PRACTICAL_EXAM'
  | 'QUIZ'
  | 'HOMEWORK'
  | 'PARTICIPATION'
  | 'ATTENDANCE'

export type AssessmentType = 'HAIRCUT' | 'COLOR' | 'CHEMICAL' | 'SANITATION' | 'CONSULTATION'

export type QualitativeResult = 'PASS' | 'NEEDS_IMPROVEMENT' | 'FAIL'

export type ScoringType = 'NUMERIC' | 'QUALITATIVE'

export interface Grade {
  id: string
  studentId: string
  categoryId: string
  categoryType: GradeCategoryType
  score: number
  maxScore: number
  percentage: number
  weight: number
  dateEntered: string
  dateModified?: string | null
  instructorId: string
  instructorName: string
  notes?: string | null
  isExcused: boolean
}

export interface GradeCategory {
  id: string
  name: string
  type: GradeCategoryType
  weight: number
  schoolId?: string | null
  courseId?: string | null
  isActive: boolean
}

export interface RubricCriterion {
  id: string
  name: string
  description: string
  maxScore: number
  weight: number
}

export interface AssessmentRubric {
  id: string
  assessmentType: AssessmentType
  criteria: RubricCriterion[]
  schoolId?: string | null
  isActive: boolean
  createdBy: string
  createdAt: string
}

export interface Assessment {
  id: string
  studentId: string
  assessmentType: AssessmentType
  score: number
  scoringType: ScoringType
  qualitativeResult?: QualitativeResult | null
  feedback: string
  assessmentDate: string
  evaluatorId: string
  evaluatorName: string
  rubricId: string
  isPassed: boolean
}

export interface GradeHistory {
  id: string
  gradeId: string
  previousScore: number
  newScore: number
  previousPercentage: number
  newPercentage: number
  changedBy: string
  changedAt: string
  reason?: string | null
}

export interface GradeBreakdown {
  categoryId: string
  categoryName: string
  categoryType: GradeCategoryType
  weight: number
  averagePercentage: number
  weightedContribution: number
  gradeCount: number
}

export interface StudentGradePerformance {
  studentId: string
  overallGrade: number
  gradeBreakdown: GradeBreakdown[]
  trendDirection: 'improving' | 'stable' | 'declining'
  isAtRisk: boolean
  missingAssignments: number
  recentAssessments: Assessment[]
}

// ============================================================================
// PHASE 10 — SCHOOL OWNER / SCHOOL ADMINISTRATOR DASHBOARD
// ============================================================================

export type SchoolAlertType =
  | 'low_attendance'
  | 'low_readiness'
  | 'missing_hours'
  | 'failed_assessment'
  | 'unread_notification'

export interface SchoolOwnerAlert {
  id: string
  type: SchoolAlertType
  title: string
  description: string
  studentId?: string | null
  studentName?: string | null
  priority: NotificationPriority
  createdAt: string
  actionUrl?: string | null
}

export interface SchoolOverviewMetrics {
  totalStudents: number
  activeStudents: number
  graduatedStudents: number
  atRiskStudents: number
  averageAttendance: number
  averageReadiness: number
  averageGrade: number
  completedHours: number
  remainingHours: number
  assessmentCompletionRate: number
}

export interface StudentPerformanceRow {
  studentId: string
  fullName: string
  attendancePercentage: number
  readinessScore: number
  overallGrade: number
  completedHours: number
  requiredHours: number
  assessmentPassRate: number
  isAtRisk: boolean
  riskReasons: string[]
}

export interface InstructorPerformanceRow {
  instructorId: string
  fullName: string
  studentsAssigned: number
  averageAttendance: number
  averageReadiness: number
  averageGrade: number
  assessmentsCompleted: number
  messagesSent: number
  successIndicator: 'high' | 'medium' | 'low'
}

export interface SchoolHealthScore {
  score: number
  label: string
  colorClass: string
  componentScores: {
    attendance: number
    readiness: number
    grades: number
    assessmentCompletion: number
    hoursCompletion: number
  }
}

export interface TrendPoint {
  date: string
  value: number
}

export interface SchoolAnalyticsSnapshot {
  attendanceTrend: TrendPoint[]
  readinessTrend: TrendPoint[]
  gradeDistribution: { label: string; count: number; colorClass: string }[]
  assessmentCompletionTrend: TrendPoint[]
  hoursCompletionTrend: TrendPoint[]
  riskDistribution: { label: string; count: number; colorClass: string }[]
}

export type SchoolReportType =
  | 'attendance'
  | 'readiness'
  | 'grade'
  | 'hours'
  | 'assessment'
  | 'school_summary'

export interface SchoolReport {
  type: SchoolReportType
  title: string
  generatedAt: string
  summary: string
  rows: Record<string, string | number>[]
}

// ============================================================================
// PHASE 11 — STATE BOARD COMPLIANCE SUITE
// ============================================================================

export type ComplianceStatus = 'met' | 'partial' | 'missing' | 'at_risk'

export type BoardEligibilityStatus = 'eligible' | 'near_eligible' | 'not_eligible'

export type ComplianceAlertType =
  | 'low_attendance'
  | 'missing_hours'
  | 'missing_assessments'
  | 'missing_practicals'
  | 'low_readiness'
  | 'graduation_risk'
  | 'board_eligible'
  | 'low_grade'

export interface ComplianceRequirement {
  id: string
  name: string
  category: 'attendance' | 'hours' | 'assessments' | 'practicals' | 'readiness' | 'grades'
  requiredValue: number
  actualValue: number
  unit: string
  status: ComplianceStatus
  weight: number
  description: string
}

export interface ComplianceScore {
  score: number
  label: string
  colorClass: string
  requirements: ComplianceRequirement[]
  componentScores: {
    attendance: number
    hours: number
    assessments: number
    practicals: number
    readiness: number
    grades: number
  }
}

export interface BoardEligibilityResult {
  status: BoardEligibilityStatus
  label: string
  colorClass: string
  reasons: string[]
  missingRequirements: string[]
  estimatedCompletionDate?: string | null
}

export interface GraduationReadiness {
  studentId: string
  fullName: string
  percentage: number
  completedHours: number
  requiredHours: number
  completedAssessments: number
  requiredAssessments: number
  completedPracticals: number
  requiredPracticals: number
  overallGrade: number
  attendancePercentage: number
  readinessScore: number
  isReady: boolean
  remainingItems: string[]
}

export interface ComplianceAlert {
  id: string
  type: ComplianceAlertType
  title: string
  description: string
  studentId?: string | null
  studentName?: string | null
  priority: NotificationPriority
  createdAt: string
}

export type ComplianceReportType =
  | 'student_compliance'
  | 'graduation_readiness'
  | 'board_eligibility'
  | 'instructor_compliance'
  | 'school_compliance'

export interface ComplianceReport {
  type: ComplianceReportType
  title: string
  generatedAt: string
  summary: string
  rows: Record<string, string | number>[]
}

// ============================================================================
// PHASE 12 — ADMINISTRATIVE & SCHOOL CONFIGURATION
// ============================================================================

export interface SchoolBranding {
  primaryColor: string
  logoUrl: string | null
  faviconUrl: string | null
}

export interface AcademicProgram {
  id: string
  name: string
  requiredHours: number
  requiredAssessments: number
  requiredPracticals: number
  active: boolean
}

export interface AttendancePolicy {
  targetAttendancePercentage: number
  autoExcuseLimit: number
  tardyThresholdMinutes: number
  trackClockEvents: boolean
}

export interface HoursPolicy {
  requiredHours: number
  categories: HourCategory[]
  requireInstructorApproval: boolean
}

export interface GradebookConfig {
  passingPercentage: number
  gradingScale: 'percentage' | 'letter'
  categories: GradeCategory[]
}

export interface AssessmentDefaults {
  passingPercentage: number
  defaultRubricId: string | null
  allowedTypes: AssessmentType[]
}

export interface MessagingPreferences {
  allowStudentToStudent: boolean
  requireModeration: boolean
  autoReplyEnabled: boolean
}

export interface SchoolNotificationSetting {
  type: NotificationType
  enabled: boolean
  priority: NotificationPriority
}

export interface RolePermission {
  role: AppRole
  permissions: Permission[]
}

export type Permission =
  | 'view_dashboard'
  | 'manage_students'
  | 'manage_instructors'
  | 'manage_attendance'
  | 'manage_gradebook'
  | 'manage_assessments'
  | 'manage_compliance'
  | 'manage_messaging'
  | 'manage_settings'
  | 'view_reports'
  | 'export_data'

export interface SchoolConfiguration {
  school: School
  branding: SchoolBranding
  programs: AcademicProgram[]
  instructors: Profile[]
  enrollment: {
    openEnrollment: boolean
    allowSelfRegistration: boolean
    defaultProgramId: string | null
  }
  attendancePolicy: AttendancePolicy
  hoursPolicy: HoursPolicy
  gradebookConfig: GradebookConfig
  assessmentDefaults: AssessmentDefaults
  messagingPreferences: MessagingPreferences
  notificationSettings: SchoolNotificationSetting[]
  rolePermissions: RolePermission[]
  updatedAt: string
}
