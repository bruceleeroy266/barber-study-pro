/**
 * ATTENDANCE SUMMARY CALCULATIONS
 * ASCYN PRO / Barber Study Pro V2
 */

import { AttendanceRecord, AttendanceSummary, AttendanceStatus } from '@/types'

export function calculateAttendanceSummary(
  userId: string,
  records: AttendanceRecord[],
  targetAttendancePercentage = 80
): AttendanceSummary {
  const userRecords = records
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const totalDays = userRecords.length
  const presentDays = userRecords.filter((r) => r.status === 'Present').length
  const absentDays = userRecords.filter((r) => r.status === 'Absent').length
  const tardyDays = userRecords.filter((r) => r.status === 'Tardy').length
  const excusedDays = userRecords.filter((r) => r.status === 'Excused').length
  const clockedInDays = userRecords.filter(
    (r) => r.status === 'Clocked In' || r.status === 'Present' || r.status === 'Tardy'
  ).length

  const countableDays = totalDays - excusedDays
  const attendancePercentage = countableDays > 0
    ? Math.round((presentDays / countableDays) * 100)
    : 0

  const tardyRate = countableDays > 0
    ? Math.round((tardyDays / countableDays) * 100)
    : 0

  const absentRate = countableDays > 0
    ? Math.round((absentDays / countableDays) * 100)
    : 0

  const presentRecords = userRecords.filter(
    (r) => r.minutesPresent !== null && r.minutesPresent !== undefined
  )
  const averageMinutesPerDay = presentRecords.length > 0
    ? Math.round(presentRecords.reduce((sum, r) => sum + (r.minutesPresent || 0), 0) / presentRecords.length)
    : null

  const currentRecord = userRecords[0] || null
  const currentStatus = currentRecord?.status || null
  const lastAttendanceDate = currentRecord?.date || null

  const isAtRisk = attendancePercentage < targetAttendancePercentage || absentDays >= 3 || tardyDays >= 3

  let riskReason: string | null = null
  if (attendancePercentage < targetAttendancePercentage) {
    riskReason = `Attendance is ${attendancePercentage}%, below the ${targetAttendancePercentage}% target`
  } else if (absentDays >= 3) {
    riskReason = `${absentDays} absences in the last ${totalDays} school days`
  } else if (tardyDays >= 3) {
    riskReason = `${tardyDays} tardies in the last ${totalDays} school days`
  }

  return {
    userId,
    totalDays,
    presentDays,
    absentDays,
    tardyDays,
    excusedDays,
    clockedInDays,
    attendancePercentage,
    tardyRate,
    absentRate,
    averageMinutesPerDay,
    currentStatus,
    lastAttendanceDate,
    isAtRisk,
    riskReason,
  }
}

export function getAttendanceForDate(
  records: AttendanceRecord[],
  userId: string,
  date: string
): AttendanceRecord | undefined {
  return records.find((r) => r.userId === userId && r.date === date)
}

export function getRecentAttendance(
  records: AttendanceRecord[],
  userId: string,
  days = 14
): AttendanceRecord[] {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  return records
    .filter((r) => r.userId === userId && new Date(r.date) >= cutoff)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Derives an attendance grade score from an attendance summary.
 * This can be used to populate the ATTENDANCE grade category in the gradebook.
 */
export function calculateAttendanceGrade(summary: AttendanceSummary): number {
  return Math.max(0, Math.min(100, summary.attendancePercentage))
}

export function getAttendanceTrend(
  records: AttendanceRecord[],
  userId: string,
  days = 7
): 'improving' | 'stable' | 'declining' {
  const recent = getRecentAttendance(records, userId, days)
  if (recent.length < 3) return 'stable'

  const firstHalf = recent.slice(Math.ceil(recent.length / 2))
  const secondHalf = recent.slice(0, Math.floor(recent.length / 2))

  const score = (records: AttendanceRecord[]) => {
    return records.reduce((sum, r) => {
      if (r.status === 'Present') return sum + 2
      if (r.status === 'Tardy') return sum + 1
      if (r.status === 'Excused') return sum + 1
      if (r.status === 'Clocked In') return sum + 1
      return sum
    }, 0)
  }

  const firstScore = score(firstHalf)
  const secondScore = score(secondHalf)

  if (secondScore > firstScore) return 'improving'
  if (secondScore < firstScore) return 'declining'
  return 'stable'
}
