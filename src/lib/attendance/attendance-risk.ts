/**
 * ATTENDANCE RISK & CONCERN DETECTION
 * ASCYN PRO / ASCYN PRO V2
 */

import { AttendanceConcern, AttendanceRecord, AttendanceSummary, Profile } from '@/types'
import { calculateAttendanceSummary } from './attendance-summary'

export const ATTENDANCE_RISK_THRESHOLD = 80
export const ABSENCE_CONCERN_THRESHOLD = 3
export const TARDY_CONCERN_THRESHOLD = 3

export function evaluateAttendanceRisk(
  summary: AttendanceSummary
): { isAtRisk: boolean; riskReason: string | null } {
  if (summary.attendancePercentage < ATTENDANCE_RISK_THRESHOLD) {
    return {
      isAtRisk: true,
      riskReason: `Attendance ${summary.attendancePercentage}% is below ${ATTENDANCE_RISK_THRESHOLD}% target`,
    }
  }

  if (summary.absentDays >= ABSENCE_CONCERN_THRESHOLD) {
    return {
      isAtRisk: true,
      riskReason: `${summary.absentDays} absences recorded`,
    }
  }

  if (summary.tardyDays >= TARDY_CONCERN_THRESHOLD) {
    return {
      isAtRisk: true,
      riskReason: `${summary.tardyDays} tardies recorded`,
    }
  }

  return { isAtRisk: false, riskReason: null }
}

export function getAttendanceConcerns(
  students: Profile[],
  records: AttendanceRecord[],
  options: {
    attendanceThreshold?: number
    absenceThreshold?: number
    tardyThreshold?: number
    lookbackDays?: number
  } = {}
): AttendanceConcern[] {
  const {
    attendanceThreshold = ATTENDANCE_RISK_THRESHOLD,
    absenceThreshold = ABSENCE_CONCERN_THRESHOLD,
    tardyThreshold = TARDY_CONCERN_THRESHOLD,
  } = options

  const concerns: AttendanceConcern[] = []

  for (const student of students) {
    const summary = calculateAttendanceSummary(student.id, records, attendanceThreshold)

    if (!summary.isAtRisk) continue

    let concernType: AttendanceConcern['concernType'] = 'low_attendance'
    let description = summary.riskReason || 'Attendance concern'

    if (summary.absentDays >= absenceThreshold) {
      concernType = 'absent'
      description = `${summary.absentDays} absences in the last ${summary.totalDays} school days`
    } else if (summary.tardyDays >= tardyThreshold) {
      concernType = 'tardy'
      description = `${summary.tardyDays} tardies in the last ${summary.totalDays} school days`
    }

    concerns.push({
      userId: student.id,
      fullName: student.full_name,
      attendancePercentage: summary.attendancePercentage,
      concernType,
      description,
      lastAttendanceDate: summary.lastAttendanceDate,
    })
  }

  return concerns.sort((a, b) => a.attendancePercentage - b.attendancePercentage)
}

export function getStudentsNeedingAttention(
  students: Profile[],
  records: AttendanceRecord[],
  options: {
    attendanceThreshold?: number
    absenceThreshold?: number
    tardyThreshold?: number
  } = {}
): Profile[] {
  const concerns = getAttendanceConcerns(students, records, options)
  const concernedIds = new Set(concerns.map((c) => c.userId))
  return students.filter((s) => concernedIds.has(s.id))
}
