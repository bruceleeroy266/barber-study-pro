import { Notification, NotificationPriority, AttendanceSummary, BoardReadiness, HourLog, StudentProgress, Grade, Assessment } from '@/types'

export interface NotificationInput {
  userId: string
  fullName: string
  attendanceSummary?: AttendanceSummary | null
  readiness?: BoardReadiness | null
  hourLogs?: HourLog[]
  progress?: StudentProgress[]
  grades?: Grade[]
  assessments?: Assessment[]
}

function buildNotification(
  userId: string,
  type: Notification['type'],
  title: string,
  body: string,
  priority: NotificationPriority,
  actionUrl?: string
): Notification {
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    userId,
    type,
    title,
    body,
    priority,
    read: false,
    createdAt: new Date().toISOString(),
    actionUrl: actionUrl || null,
  }
}

export function generateNotificationsFromAttendance(
  userId: string,
  summary: AttendanceSummary
): Notification[] {
  const notifications: Notification[] = []

  if (summary.attendancePercentage < 70) {
    notifications.push(
      buildNotification(
        userId,
        'attendance_alert',
        'Attendance Alert',
        `Your attendance is ${summary.attendancePercentage}%. Multiple absences detected. Contact your instructor immediately.`,
        'urgent',
        '/dashboard'
      )
    )
  } else if (summary.attendancePercentage < 80) {
    notifications.push(
      buildNotification(
        userId,
        'attendance_risk',
        'Attendance Risk',
        `Your attendance is ${summary.attendancePercentage}%. You are approaching the risk threshold.`,
        'high',
        '/dashboard'
      )
    )
  }

  if (summary.tardyRate > 0.15) {
    notifications.push(
      buildNotification(
        userId,
        'attendance_risk',
        'Tardy Pattern Detected',
        `You have been tardy ${Math.round(summary.tardyRate * 100)}% of the time. Arrive on time to stay on track.`,
        'medium',
        '/dashboard'
      )
    )
  }

  return notifications
}

export function generateNotificationsFromReadiness(
  userId: string,
  readiness: BoardReadiness
): Notification[] {
  const notifications: Notification[] = []

  if (readiness.score < 60) {
    notifications.push(
      buildNotification(
        userId,
        'board_readiness',
        'Board Readiness At Risk',
        `Your board readiness score is ${readiness.score}. Schedule remediation before the mock exam.`,
        'urgent',
        '/dashboard/progress'
      )
    )
  } else if (readiness.score < 80) {
    notifications.push(
      buildNotification(
        userId,
        'board_readiness',
        'Board Readiness Warning',
        `Your board readiness score is ${readiness.score}. Focus on your weakest categories.`,
        'high',
        '/dashboard/progress'
      )
    )
  } else if (readiness.score < 85) {
    notifications.push(
      buildNotification(
        userId,
        'board_readiness',
        'Board Readiness Update',
        `Your board readiness score is ${readiness.score}. Keep reviewing to reach the next level.`,
        'medium',
        '/dashboard/progress'
      )
    )
  }

  return notifications
}

export function generateNotificationsFromHours(
  userId: string,
  hourLogs: HourLog[]
): Notification[] {
  const notifications: Notification[] = []
  const approvedMinutes = hourLogs
    .filter((h) => h.status === 'approved')
    .reduce((sum, h) => sum + h.minutes, 0)
  const pendingMinutes = hourLogs
    .filter((h) => h.status === 'pending')
    .reduce((sum, h) => sum + h.minutes, 0)
  const requiredMinutes = 1500 * 60 // rough demo requirement: 1500 hours

  if (approvedMinutes < requiredMinutes * 0.5) {
    notifications.push(
      buildNotification(
        userId,
        'missing_hours',
        'Missing Hours',
        `You have logged ${Math.floor(approvedMinutes / 60)} approved hours. You are behind the program pace.`,
        'high',
        '/dashboard'
      )
    )
  }

  if (pendingMinutes > 0) {
    notifications.push(
      buildNotification(
        userId,
        'missing_hours',
        'Pending Hour Logs',
        `You have ${Math.floor(pendingMinutes / 60)} hours pending approval. Follow up with your supervisor.`,
        'medium',
        '/dashboard'
      )
    )
  }

  return notifications
}

export function generateNotificationsFromProgress(
  userId: string,
  progress: StudentProgress[]
): Notification[] {
  const notifications: Notification[] = []
  const incompleteChapters = progress.filter((p) => p.progress_percentage < 100)
  const overdue = incompleteChapters.filter((p) => p.best_quiz_score === null && p.progress_percentage > 0)

  if (overdue.length > 0) {
    notifications.push(
      buildNotification(
        userId,
        'missed_assessment',
        'Incomplete Chapter Assessments',
        `You have ${overdue.length} chapter${overdue.length === 1 ? '' : 's'} with unfinished quizzes.`,
        'medium',
        '/dashboard'
      )
    )
  }

  return notifications
}

export function generateNotificationsFromGrades(
  userId: string,
  grades: Grade[]
): Notification[] {
  const notifications: Notification[] = []
  if (grades.length === 0) return notifications

  const nonExcused = grades.filter((g) => !g.isExcused)
  const avg =
    nonExcused.length > 0
      ? Math.round((nonExcused.reduce((sum, g) => sum + g.percentage, 0) / nonExcused.length) * 10) / 10
      : 0

  if (avg < 60) {
    notifications.push(
      buildNotification(
        userId,
        'missed_assessment',
        'Grade Average Critical',
        `Your current grade average is ${avg}%. Schedule remediation with your instructor immediately.`,
        'urgent',
        '/dashboard/grades'
      )
    )
  } else if (avg < 70) {
    notifications.push(
      buildNotification(
        userId,
        'missed_assessment',
        'Grade Average Below Passing',
        `Your current grade average is ${avg}%. Focus on upcoming assignments to raise your score.`,
        'high',
        '/dashboard/grades'
      )
    )
  }

  const latestGrades = [...nonExcused]
    .sort((a, b) => new Date(b.dateEntered).getTime() - new Date(a.dateEntered).getTime())
    .slice(0, 3)

  const recentLowGrade = latestGrades.find((g) => g.percentage < 70)
  if (recentLowGrade && avg >= 70) {
    notifications.push(
      buildNotification(
        userId,
        'missed_assessment',
        'Low Grade Alert',
        `A recent grade (${recentLowGrade.percentage}%) was below passing. Review the material and consider a retake.`,
        'medium',
        '/dashboard/grades'
      )
    )
  }

  return notifications
}

export function generateNotificationsFromAssessments(
  userId: string,
  assessments: Assessment[]
): Notification[] {
  const notifications: Notification[] = []
  if (assessments.length === 0) return notifications

  const failed = assessments.filter((a) => !a.isPassed)
  const recentFailed = [...failed]
    .sort((a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime())
    .slice(0, 3)

  if (failed.length >= 2) {
    notifications.push(
      buildNotification(
        userId,
        'missed_assessment',
        'Multiple Failed Assessments',
        `You have ${failed.length} failed practical assessments. Additional practice is required before progressing.`,
        'urgent',
        '/dashboard/assessments'
      )
    )
  } else if (recentFailed.length > 0) {
    notifications.push(
      buildNotification(
        userId,
        'missed_assessment',
        'Assessment Retake Available',
        `Your ${recentFailed[0].assessmentType} assessment was not passed. Schedule a retake with your instructor.`,
        'high',
        '/dashboard/assessments'
      )
    )
  }

  return notifications
}

export function generateAllNotifications(input: NotificationInput): Notification[] {
  const notifications: Notification[] = []

  if (input.attendanceSummary) {
    notifications.push(...generateNotificationsFromAttendance(input.userId, input.attendanceSummary))
  }
  if (input.readiness) {
    notifications.push(...generateNotificationsFromReadiness(input.userId, input.readiness))
  }
  if (input.hourLogs && input.hourLogs.length > 0) {
    notifications.push(...generateNotificationsFromHours(input.userId, input.hourLogs))
  }
  if (input.progress && input.progress.length > 0) {
    notifications.push(...generateNotificationsFromProgress(input.userId, input.progress))
  }
  if (input.grades && input.grades.length > 0) {
    notifications.push(...generateNotificationsFromGrades(input.userId, input.grades))
  }
  if (input.assessments && input.assessments.length > 0) {
    notifications.push(...generateNotificationsFromAssessments(input.userId, input.assessments))
  }

  return notifications
}
