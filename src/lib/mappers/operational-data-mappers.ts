/**
 * Operational Data Mappers
 * ASCYN PRO / ASCYN PRO V2
 *
 * Converts between Supabase snake_case database rows and app-friendly
 * TypeScript objects. These mappers replace unsafe `as unknown as Type` casts
 * for production data fetched from the operational tables created in Phase 13E.1A.
 */

import {
  AttendanceRecord,
  AttendanceCorrection,
  AttendanceAuditEntry,
  InstructorAttendanceNote,
  Grade,
  GradeCategory,
  Assessment,
  AssessmentRubric,
  HourLog,
  InstructorNote,
  AttendanceStatus,
  HourCategory,
  HourStatus,
  GradeCategoryType,
  AssessmentType,
  ScoringType,
  QualitativeResult,
} from '@/types'

// ============================================================================
// Helpers
// ============================================================================

function toString(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
}

function toOptionalString(value: unknown): string | null {
  if (value === null || value === undefined) return null
  return String(value)
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return parseFloat(value) || 0
  return 0
}

function toOptionalNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null
  return toNumber(value)
}


function toIsoString(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
}

function toOptionalIsoString(value: unknown): string | null {
  if (value === null || value === undefined) return null
  return String(value)
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// ============================================================================
// Attendance Records
// ============================================================================

export interface AttendanceRecordDbRow {
  id: string
  school_id: string
  user_id: string
  date: string
  status: string
  clocked_in_at: string | null
  clocked_out_at: string | null
  minutes_present: number | null
  note: string | null
  verified_by: string | null
  created_at: string
  updated_at: string
}

export function mapAttendanceRecordFromDb(row: unknown): AttendanceRecord {
  const r = isObject(row) ? (row as unknown as AttendanceRecordDbRow) : ({} as AttendanceRecordDbRow)
  return {
    id: toString(r.id),
    userId: toString(r.user_id),
    schoolId: toOptionalString(r.school_id),
    date: toString(r.date),
    status: (r.status as AttendanceStatus) || 'Present',
    clockedInAt: toOptionalIsoString(r.clocked_in_at),
    clockedOutAt: toOptionalIsoString(r.clocked_out_at),
    minutesPresent: toOptionalNumber(r.minutes_present),
    note: toOptionalString(r.note),
    verifiedBy: toOptionalString(r.verified_by),
    createdAt: toIsoString(r.created_at),
    updatedAt: toIsoString(r.updated_at),
  }
}

export function mapAttendanceRecordsFromDb(rows: unknown[]): AttendanceRecord[] {
  return rows.map(mapAttendanceRecordFromDb)
}

export function mapAttendanceRecordToDb(
  record: Partial<AttendanceRecord>
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (record.userId !== undefined) payload.user_id = record.userId
  if (record.schoolId !== undefined) payload.school_id = record.schoolId
  if (record.date !== undefined) payload.date = record.date
  if (record.status !== undefined) payload.status = record.status
  if (record.clockedInAt !== undefined) payload.clocked_in_at = record.clockedInAt
  if (record.clockedOutAt !== undefined) payload.clocked_out_at = record.clockedOutAt
  if (record.minutesPresent !== undefined) payload.minutes_present = record.minutesPresent
  if (record.note !== undefined) payload.note = record.note
  if (record.verifiedBy !== undefined) payload.verified_by = record.verifiedBy
  return payload
}

// ============================================================================
// Attendance Notes
// ============================================================================

export interface AttendanceNoteDbRow {
  id: string
  school_id: string
  student_id: string
  instructor_id: string
  instructor_name: string
  date: string
  note: string
  created_at: string
  updated_at: string
}

export function mapAttendanceNoteFromDb(row: unknown): InstructorAttendanceNote {
  const r = isObject(row) ? (row as unknown as AttendanceNoteDbRow) : ({} as AttendanceNoteDbRow)
  return {
    id: toString(r.id),
    studentId: toString(r.student_id),
    instructorId: toString(r.instructor_id),
    instructorName: toString(r.instructor_name),
    date: toString(r.date),
    note: toString(r.note),
    createdAt: toIsoString(r.created_at),
  }
}

export function mapAttendanceNotesFromDb(rows: unknown[]): InstructorAttendanceNote[] {
  return rows.map(mapAttendanceNoteFromDb)
}

export function mapAttendanceNoteToDb(
  note: Partial<InstructorAttendanceNote>
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (note.studentId !== undefined) payload.student_id = note.studentId
  if (note.instructorId !== undefined) payload.instructor_id = note.instructorId
  if (note.instructorName !== undefined) payload.instructor_name = note.instructorName
  if (note.date !== undefined) payload.date = note.date
  if (note.note !== undefined) payload.note = note.note
  return payload
}

// ============================================================================
// Attendance Corrections
// ============================================================================

export interface AttendanceCorrectionDbRow {
  id: string
  school_id: string
  attendance_record_id: string
  original_status: string
  new_status: string
  reason: string
  corrected_by: string
  corrected_at: string
  approved_by: string | null
  approved_at: string | null
  created_at: string
  updated_at: string
}

export function mapAttendanceCorrectionFromDb(row: unknown): AttendanceCorrection {
  const r = isObject(row) ? (row as unknown as AttendanceCorrectionDbRow) : ({} as AttendanceCorrectionDbRow)
  return {
    id: toString(r.id),
    attendanceRecordId: toString(r.attendance_record_id),
    originalStatus: (r.original_status as AttendanceStatus) || 'Present',
    newStatus: (r.new_status as AttendanceStatus) || 'Present',
    reason: toString(r.reason),
    correctedBy: toString(r.corrected_by),
    correctedAt: toIsoString(r.corrected_at),
    approvedBy: toOptionalString(r.approved_by),
    approvedAt: toOptionalIsoString(r.approved_at),
  }
}

export function mapAttendanceCorrectionsFromDb(rows: unknown[]): AttendanceCorrection[] {
  return rows.map(mapAttendanceCorrectionFromDb)
}

export function mapAttendanceCorrectionToDb(
  correction: Partial<AttendanceCorrection>
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (correction.attendanceRecordId !== undefined)
    payload.attendance_record_id = correction.attendanceRecordId
  if (correction.originalStatus !== undefined) payload.original_status = correction.originalStatus
  if (correction.newStatus !== undefined) payload.new_status = correction.newStatus
  if (correction.reason !== undefined) payload.reason = correction.reason
  if (correction.correctedBy !== undefined) payload.corrected_by = correction.correctedBy
  if (correction.correctedAt !== undefined) payload.corrected_at = correction.correctedAt
  if (correction.approvedBy !== undefined) payload.approved_by = correction.approvedBy
  if (correction.approvedAt !== undefined) payload.approved_at = correction.approvedAt
  return payload
}

// ============================================================================
// Attendance Audit Log
// ============================================================================

export interface AttendanceAuditEntryDbRow {
  id: string
  school_id: string | null
  record_id: string
  action: string
  changed_fields: Record<string, { old: unknown; new: unknown }>
  user_id: string
  user_name: string
  timestamp: string
  reason: string | null
  created_at: string
}

export function mapAttendanceAuditEntryFromDb(row: unknown): AttendanceAuditEntry {
  const r = isObject(row) ? (row as unknown as AttendanceAuditEntryDbRow) : ({} as AttendanceAuditEntryDbRow)
  return {
    id: toString(r.id),
    recordId: toString(r.record_id),
    action: (r.action as AttendanceAuditEntry['action']) || 'update',
    changedFields: r.changed_fields || {},
    userId: toString(r.user_id),
    userName: toString(r.user_name),
    timestamp: toIsoString(r.timestamp),
    reason: toOptionalString(r.reason),
  }
}

export function mapAttendanceAuditEntriesFromDb(rows: unknown[]): AttendanceAuditEntry[] {
  return rows.map(mapAttendanceAuditEntryFromDb)
}

export function mapAttendanceAuditEntryToDb(
  entry: Partial<AttendanceAuditEntry>
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (entry.recordId !== undefined) payload.record_id = entry.recordId
  if (entry.action !== undefined) payload.action = entry.action
  if (entry.changedFields !== undefined) payload.changed_fields = entry.changedFields
  if (entry.userId !== undefined) payload.user_id = entry.userId
  if (entry.userName !== undefined) payload.user_name = entry.userName
  if (entry.timestamp !== undefined) payload.timestamp = entry.timestamp
  if (entry.reason !== undefined) payload.reason = entry.reason
  return payload
}

// ============================================================================
// Grade Categories
// ============================================================================

export interface GradeCategoryDbRow {
  id: string
  school_id: string | null
  course_id: string | null
  name: string
  type: string
  weight: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export function mapGradeCategoryFromDb(row: unknown): GradeCategory {
  const r = isObject(row) ? (row as unknown as GradeCategoryDbRow) : ({} as GradeCategoryDbRow)
  return {
    id: toString(r.id),
    name: toString(r.name),
    type: (r.type as GradeCategoryType) || 'QUIZ',
    weight: toNumber(r.weight),
    schoolId: toOptionalString(r.school_id),
    courseId: toOptionalString(r.course_id),
    isActive: r.is_active ?? true,
  }
}

export function mapGradeCategoriesFromDb(rows: unknown[]): GradeCategory[] {
  return rows.map(mapGradeCategoryFromDb)
}

export function mapGradeCategoryToDb(
  category: Partial<GradeCategory>
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (category.name !== undefined) payload.name = category.name
  if (category.type !== undefined) payload.type = category.type
  if (category.weight !== undefined) payload.weight = category.weight
  if (category.schoolId !== undefined) payload.school_id = category.schoolId
  if (category.courseId !== undefined) payload.course_id = category.courseId
  if (category.isActive !== undefined) payload.is_active = category.isActive
  return payload
}

// ============================================================================
// Grades
// ============================================================================

export interface GradeDbRow {
  id: string
  school_id: string
  student_id: string
  category_id: string
  category_type: string
  score: number
  max_score: number
  percentage: number
  weight: number
  date_entered: string
  date_modified: string | null
  instructor_id: string
  instructor_name: string
  notes: string | null
  is_excused: boolean
  created_at: string
  updated_at: string
}

export function mapGradeFromDb(row: unknown): Grade {
  const r = isObject(row) ? (row as unknown as GradeDbRow) : ({} as GradeDbRow)
  return {
    id: toString(r.id),
    studentId: toString(r.student_id),
    categoryId: toString(r.category_id),
    categoryType: (r.category_type as GradeCategoryType) || 'QUIZ',
    score: toNumber(r.score),
    maxScore: toNumber(r.max_score),
    percentage: toNumber(r.percentage),
    weight: toNumber(r.weight),
    dateEntered: toIsoString(r.date_entered),
    dateModified: toOptionalIsoString(r.date_modified),
    instructorId: toString(r.instructor_id),
    instructorName: toString(r.instructor_name),
    notes: toOptionalString(r.notes),
    isExcused: r.is_excused ?? false,
  }
}

export function mapGradesFromDb(rows: unknown[]): Grade[] {
  return rows.map(mapGradeFromDb)
}

export function mapGradeToDb(grade: Partial<Grade>): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (grade.studentId !== undefined) payload.student_id = grade.studentId
  if (grade.categoryId !== undefined) payload.category_id = grade.categoryId
  if (grade.categoryType !== undefined) payload.category_type = grade.categoryType
  if (grade.score !== undefined) payload.score = grade.score
  if (grade.maxScore !== undefined) payload.max_score = grade.maxScore
  if (grade.percentage !== undefined) payload.percentage = grade.percentage
  if (grade.weight !== undefined) payload.weight = grade.weight
  if (grade.dateEntered !== undefined) payload.date_entered = grade.dateEntered
  if (grade.dateModified !== undefined) payload.date_modified = grade.dateModified
  if (grade.instructorId !== undefined) payload.instructor_id = grade.instructorId
  if (grade.instructorName !== undefined) payload.instructor_name = grade.instructorName
  if (grade.notes !== undefined) payload.notes = grade.notes
  if (grade.isExcused !== undefined) payload.is_excused = grade.isExcused
  return payload
}

// ============================================================================
// Assessment Rubrics
// ============================================================================

export interface AssessmentRubricDbRow {
  id: string
  school_id: string | null
  assessment_type: string
  criteria: RubricCriterionDbItem[]
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface RubricCriterionDbItem {
  id: string
  name: string
  description: string
  max_score: number
  weight: number
}

export function mapAssessmentRubricFromDb(row: unknown): AssessmentRubric {
  const r = isObject(row) ? (row as unknown as AssessmentRubricDbRow) : ({} as AssessmentRubricDbRow)
  return {
    id: toString(r.id),
    assessmentType: (r.assessment_type as AssessmentType) || 'HAIRCUT',
    criteria: Array.isArray(r.criteria)
      ? r.criteria.map((c) => ({
          id: toString(c.id),
          name: toString(c.name),
          description: toString(c.description),
          maxScore: toNumber(c.max_score),
          weight: toNumber(c.weight),
        }))
      : [],
    schoolId: toOptionalString(r.school_id),
    isActive: r.is_active ?? true,
    createdBy: toString(r.created_by),
    createdAt: toIsoString(r.created_at),
  }
}

export function mapAssessmentRubricsFromDb(rows: unknown[]): AssessmentRubric[] {
  return rows.map(mapAssessmentRubricFromDb)
}

export function mapAssessmentRubricToDb(
  rubric: Partial<AssessmentRubric>
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (rubric.assessmentType !== undefined) payload.assessment_type = rubric.assessmentType
  if (rubric.criteria !== undefined)
    payload.criteria = rubric.criteria.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      max_score: c.maxScore,
      weight: c.weight,
    }))
  if (rubric.schoolId !== undefined) payload.school_id = rubric.schoolId
  if (rubric.isActive !== undefined) payload.is_active = rubric.isActive
  if (rubric.createdBy !== undefined) payload.created_by = rubric.createdBy
  return payload
}

// ============================================================================
// Assessments
// ============================================================================

export interface AssessmentDbRow {
  id: string
  school_id: string
  student_id: string
  assessment_type: string
  score: number | null
  scoring_type: string
  qualitative_result: string | null
  feedback: string | null
  assessment_date: string
  evaluator_id: string
  evaluator_name: string
  rubric_id: string | null
  is_passed: boolean
  created_at: string
  updated_at: string
}

export function mapAssessmentFromDb(row: unknown): Assessment {
  const r = isObject(row) ? (row as unknown as AssessmentDbRow) : ({} as AssessmentDbRow)
  return {
    id: toString(r.id),
    studentId: toString(r.student_id),
    assessmentType: (r.assessment_type as AssessmentType) || 'HAIRCUT',
    score: toNumber(r.score),
    scoringType: (r.scoring_type as ScoringType) || 'NUMERIC',
    qualitativeResult: toOptionalString(r.qualitative_result) as QualitativeResult | null,
    feedback: toOptionalString(r.feedback) || '',
    assessmentDate: toIsoString(r.assessment_date),
    evaluatorId: toString(r.evaluator_id),
    evaluatorName: toString(r.evaluator_name),
    rubricId: toOptionalString(r.rubric_id) || '',
    isPassed: r.is_passed ?? false,
  }
}

export function mapAssessmentsFromDb(rows: unknown[]): Assessment[] {
  return rows.map(mapAssessmentFromDb)
}

export function mapAssessmentToDb(
  assessment: Partial<Assessment>
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (assessment.studentId !== undefined) payload.student_id = assessment.studentId
  if (assessment.assessmentType !== undefined) payload.assessment_type = assessment.assessmentType
  if (assessment.score !== undefined) payload.score = assessment.score
  if (assessment.scoringType !== undefined) payload.scoring_type = assessment.scoringType
  if (assessment.qualitativeResult !== undefined)
    payload.qualitative_result = assessment.qualitativeResult
  if (assessment.feedback !== undefined) payload.feedback = assessment.feedback
  if (assessment.assessmentDate !== undefined) payload.assessment_date = assessment.assessmentDate
  if (assessment.evaluatorId !== undefined) payload.evaluator_id = assessment.evaluatorId
  if (assessment.evaluatorName !== undefined) payload.evaluator_name = assessment.evaluatorName
  if (assessment.rubricId !== undefined) payload.rubric_id = assessment.rubricId
  if (assessment.isPassed !== undefined) payload.is_passed = assessment.isPassed
  return payload
}

// ============================================================================
// Hour Logs
// DB columns already align with the HourLog interface; these functions provide
// runtime type safety instead of unsafe casts.
// ============================================================================

export interface HourLogDbRow {
  id: string
  school_id: string
  user_id: string
  date: string
  category: string
  minutes: number
  status: string
  notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

export function mapHourLogFromDb(row: unknown): HourLog {
  const r = isObject(row) ? (row as unknown as HourLogDbRow) : ({} as HourLogDbRow)
  return {
    id: toString(r.id),
    user_id: toString(r.user_id),
    date: toString(r.date),
    category: (r.category as HourCategory) || 'Other',
    minutes: toNumber(r.minutes),
    status: (r.status as HourStatus) || 'pending',
    notes: toOptionalString(r.notes),
    created_at: toIsoString(r.created_at),
    updated_at: toIsoString(r.updated_at),
  }
}

export function mapHourLogsFromDb(rows: unknown[]): HourLog[] {
  return rows.map(mapHourLogFromDb)
}

export function mapHourLogToDb(log: Partial<HourLog>): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (log.user_id !== undefined) payload.user_id = log.user_id
  if (log.date !== undefined) payload.date = log.date
  if (log.category !== undefined) payload.category = log.category
  if (log.minutes !== undefined) payload.minutes = log.minutes
  if (log.status !== undefined) payload.status = log.status
  if (log.notes !== undefined) payload.notes = log.notes
  return payload
}

// ============================================================================
// Instructor Notes
// DB columns already align with the InstructorNote interface; these functions
// provide runtime type safety instead of unsafe casts.
// ============================================================================

export interface InstructorNoteDbRow {
  id: string
  school_id: string
  student_id: string
  instructor_id: string
  instructor_name: string
  note_type: string
  note_text: string
  created_at: string
  updated_at: string
}

export function mapInstructorNoteFromDb(row: unknown): InstructorNote {
  const r = isObject(row) ? (row as unknown as InstructorNoteDbRow) : ({} as InstructorNoteDbRow)
  return {
    id: toString(r.id),
    student_id: toString(r.student_id),
    instructor_id: toString(r.instructor_id),
    instructor_name: toString(r.instructor_name),
    note_type: (r.note_type as InstructorNote['note_type']) || 'general',
    note_text: toString(r.note_text),
    created_at: toIsoString(r.created_at),
  }
}

export function mapInstructorNotesFromDb(rows: unknown[]): InstructorNote[] {
  return rows.map(mapInstructorNoteFromDb)
}

export function mapInstructorNoteToDb(
  note: Partial<InstructorNote>
): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (note.student_id !== undefined) payload.student_id = note.student_id
  if (note.instructor_id !== undefined) payload.instructor_id = note.instructor_id
  if (note.instructor_name !== undefined) payload.instructor_name = note.instructor_name
  if (note.note_type !== undefined) payload.note_type = note.note_type
  if (note.note_text !== undefined) payload.note_text = note.note_text
  return payload
}
