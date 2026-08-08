import { SchoolConfiguration } from '@/types'

export interface ValidationErrors {
  [key: string]: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_REGEX = /^https?:\/\/.+\..+/
const ZIP_REGEX = /^\d{5}(-\d{4})?$/
const PHONE_REGEX = /^[\d\s\-\+\(\)]+$/
const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

export function validateSchoolConfiguration(config: SchoolConfiguration): ValidationErrors {
  const errors: ValidationErrors = {}

  // ============================================================================
  // SCHOOL PROFILE
  // ============================================================================

  if (!config.school.name.trim()) {
    errors.schoolName = 'School name is required.'
  }

  if (config.school.contact_email && !EMAIL_REGEX.test(config.school.contact_email)) {
    errors.schoolEmail = 'Please enter a valid email address.'
  }

  if (config.school.contact_phone && !PHONE_REGEX.test(config.school.contact_phone)) {
    errors.schoolPhone = 'Please enter a valid phone number.'
  }

  if (config.school.website && !URL_REGEX.test(config.school.website)) {
    errors.schoolWebsite = 'Please enter a valid URL (e.g., https://example.com).'
  }

  if (config.school.postal_code && !ZIP_REGEX.test(config.school.postal_code)) {
    errors.schoolZip = 'Please enter a valid ZIP code (e.g., 73102 or 73102-1234).'
  }

  // ============================================================================
  // BRANDING
  // ============================================================================

  if (!HEX_COLOR_REGEX.test(config.branding.primaryColor)) {
    errors.brandingPrimaryColor = 'Please enter a valid hex color (e.g., #D4AF37).'
  }

  if (!HEX_COLOR_REGEX.test(config.branding.secondaryColor)) {
    errors.brandingSecondaryColor = 'Please enter a valid hex color (e.g., #1F2937).'
  }

  // ============================================================================
  // PROGRAMS
  // ============================================================================

  if (config.programs.length === 0) {
    errors.programs = 'At least one program is required.'
  }

  config.programs.forEach((program, index) => {
    if (!program.name.trim()) {
      errors[`program_${index}_name`] = 'Program name is required.'
    }
    if (program.requiredHours < 0) {
      errors[`program_${index}_hours`] = 'Required hours cannot be negative.'
    }
    if (program.requiredAssessments < 0) {
      errors[`program_${index}_assessments`] = 'Required assessments cannot be negative.'
    }
    if (program.requiredPracticals < 0) {
      errors[`program_${index}_practicals`] = 'Required practicals cannot be negative.'
    }
  })

  // ============================================================================
  // ATTENDANCE POLICY
  // ============================================================================

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

  // ============================================================================
  // HOURS POLICY
  // ============================================================================

  const requiredHours = config.hoursPolicy.requiredHours
  if (Number.isNaN(requiredHours) || requiredHours < 0) {
    errors.requiredHours = 'Required hours cannot be negative.'
  }

  // ============================================================================
  // GRADEBOOK CONFIG
  // ============================================================================

  const gradePassing = config.gradebookConfig.passingPercentage
  if (Number.isNaN(gradePassing) || gradePassing < 0 || gradePassing > 100) {
    errors.gradebookPassing = 'Passing percentage must be between 0 and 100.'
  }

  // ============================================================================
  // ASSESSMENT DEFAULTS
  // ============================================================================

  const assessmentPassing = config.assessmentDefaults.passingPercentage
  if (Number.isNaN(assessmentPassing) || assessmentPassing < 0 || assessmentPassing > 100) {
    errors.assessmentPassing = 'Passing percentage must be between 0 and 100.'
  }

  // ============================================================================
  // STUDENT DEFAULTS
  // ============================================================================

  const studentPassing = config.studentDefaults.passingPercentage
  if (Number.isNaN(studentPassing) || studentPassing < 0 || studentPassing > 100) {
    errors.studentPassing = 'Passing percentage must be between 0 and 100.'
  }

  const maxAttempts = config.studentDefaults.maxQuizAttempts
  if (Number.isNaN(maxAttempts) || maxAttempts < 1) {
    errors.maxQuizAttempts = 'Max quiz attempts must be at least 1.'
  }

  const requiredAttendance = config.studentDefaults.requiredAttendancePercentage
  if (Number.isNaN(requiredAttendance) || requiredAttendance < 0 || requiredAttendance > 100) {
    errors.requiredAttendance = 'Required attendance must be between 0 and 100.'
  }

  return errors
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0
}
