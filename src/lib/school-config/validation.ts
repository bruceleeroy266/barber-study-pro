import { SchoolConfiguration } from '@/types'

export interface ValidationErrors {
  [key: string]: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateSchoolConfiguration(config: SchoolConfiguration): ValidationErrors {
  const errors: ValidationErrors = {}

  // School profile
  if (!config.school.name.trim()) {
    errors.schoolName = 'School name is required.'
  }

  if (config.school.contact_email && !EMAIL_REGEX.test(config.school.contact_email)) {
    errors.schoolEmail = 'Please enter a valid email address.'
  }

  // Attendance policy
  const target = config.attendancePolicy.targetAttendancePercentage
  if (Number.isNaN(target) || target < 0 || target > 100) {
    errors.attendanceTarget = 'Target attendance must be between 0 and 100.'
  }

  const excuseLimit = config.attendancePolicy.autoExcuseLimit
  if (Number.isNaN(excuseLimit) || excuseLimit < 0) {
    errors.autoExcuseLimit = 'Auto-excuse limit cannot be negative.'
  }

  const tardyThreshold = config.attendancePolicy.tardyThresholdMinutes
  if (Number.isNaN(tardyThreshold) || tardyThreshold < 0) {
    errors.tardyThreshold = 'Tardy threshold cannot be negative.'
  }

  // Hours policy
  const requiredHours = config.hoursPolicy.requiredHours
  if (Number.isNaN(requiredHours) || requiredHours < 0) {
    errors.requiredHours = 'Required hours cannot be negative.'
  }

  // Gradebook config
  const gradePassing = config.gradebookConfig.passingPercentage
  if (Number.isNaN(gradePassing) || gradePassing < 0 || gradePassing > 100) {
    errors.gradebookPassing = 'Passing percentage must be between 0 and 100.'
  }

  // Assessment defaults
  const assessmentPassing = config.assessmentDefaults.passingPercentage
  if (Number.isNaN(assessmentPassing) || assessmentPassing < 0 || assessmentPassing > 100) {
    errors.assessmentPassing = 'Passing percentage must be between 0 and 100.'
  }

  return errors
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0
}
