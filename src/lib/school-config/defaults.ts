import {
  SchoolConfiguration,
  School,
  AcademicProgram,
  AttendancePolicy,
  HoursPolicy,
  GradebookConfig,
  AssessmentDefaults,
  MessagingPreferences,
  SchoolNotificationSetting,
  RolePermission,
  HourCategory,
  AssessmentType,
  NotificationPriority,
  NotificationType,
  Permission,
  AppRole,
} from '@/types'

/**
 * Phase 13C — Creates a production-safe default school configuration from a
 * School record. Used when no school_settings row exists yet.
 *
 * This is NOT the demo configuration; it uses the actual school data and
 * neutral policy defaults.
 */
export function createDefaultSchoolConfiguration(school: School): SchoolConfiguration {
  const now = new Date().toISOString()

  const defaultProgram: AcademicProgram = {
    id: 'default-program',
    name: 'Barbering Program',
    requiredHours: 1500,
    requiredAssessments: 10,
    requiredPracticals: 20,
    active: true,
  }

  const defaultAttendancePolicy: AttendancePolicy = {
    targetAttendancePercentage: 90,
    autoExcuseLimit: 3,
    tardyThresholdMinutes: 15,
    trackClockEvents: true,
  }

  const defaultHoursPolicy: HoursPolicy = {
    requiredHours: 1500,
    categories: ['Theory', 'Practical', 'Clinic', 'Sanitation', 'Other'] as HourCategory[],
    requireInstructorApproval: true,
  }

  const defaultGradebookConfig: GradebookConfig = {
    passingPercentage: 75,
    gradingScale: 'percentage',
    categories: [],
  }

  const defaultAssessmentDefaults: AssessmentDefaults = {
    passingPercentage: 70,
    defaultRubricId: null,
    allowedTypes: ['HAIRCUT', 'COLOR', 'CHEMICAL', 'SANITATION', 'CONSULTATION'] as AssessmentType[],
  }

  const defaultMessagingPreferences: MessagingPreferences = {
    allowStudentToStudent: false,
    requireModeration: true,
    autoReplyEnabled: false,
  }

  const defaultNotificationSettings: SchoolNotificationSetting[] = (
    [
      { type: 'attendance_alert', enabled: true, priority: 'high' },
      { type: 'attendance_risk', enabled: true, priority: 'medium' },
      { type: 'missing_hours', enabled: true, priority: 'medium' },
      { type: 'missed_assessment', enabled: true, priority: 'high' },
      { type: 'upcoming_exam', enabled: true, priority: 'low' },
      { type: 'announcement', enabled: true, priority: 'medium' },
      { type: 'message', enabled: true, priority: 'medium' },
      { type: 'general', enabled: false, priority: 'low' },
    ] as { type: NotificationType; enabled: boolean; priority: NotificationPriority }[]
  ).map((s) => s as SchoolNotificationSetting)

  const defaultRolePermissions: RolePermission[] = (
    [
      { role: 'student', permissions: ['view_dashboard'] },
      { role: 'apprentice', permissions: ['view_dashboard'] },
      {
        role: 'instructor',
        permissions: [
          'view_dashboard',
          'manage_students',
          'manage_attendance',
          'manage_gradebook',
          'manage_assessments',
        ],
      },
      {
        role: 'admin',
        permissions: [
          'view_dashboard',
          'manage_students',
          'manage_instructors',
          'manage_attendance',
          'manage_gradebook',
          'manage_assessments',
          'manage_compliance',
          'manage_messaging',
          'manage_settings',
          'view_reports',
          'export_data',
        ],
      },
    ] as { role: AppRole; permissions: Permission[] }[]
  ).map((r) => r as RolePermission)

  return {
    school: {
      ...school,
      address: school.address ?? '',
      contact_email: school.contact_email ?? '',
      subscription_status: school.subscription_status ?? 'trial',
    },
    branding: {
      primaryColor: '#D4AF37',
      logoUrl: null,
      faviconUrl: null,
    },
    programs: [defaultProgram],
    instructors: [],
    enrollment: {
      openEnrollment: false,
      allowSelfRegistration: false,
      defaultProgramId: defaultProgram.id,
    },
    attendancePolicy: defaultAttendancePolicy,
    hoursPolicy: defaultHoursPolicy,
    gradebookConfig: defaultGradebookConfig,
    assessmentDefaults: defaultAssessmentDefaults,
    messagingPreferences: defaultMessagingPreferences,
    notificationSettings: defaultNotificationSettings,
    rolePermissions: defaultRolePermissions,
    updatedAt: now,
  }
}
