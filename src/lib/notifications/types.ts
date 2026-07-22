export type OwnerNotificationType =
  | 'pilot_request'
  | 'contact_submission'
  | 'demo_request'
  | 'student_registration'
  | 'instructor_registration'
  | 'school_approval'
  | 'email_delivery_failure'
  | 'system_error'

export type OwnerNotificationStatus = 'unread' | 'read' | 'archived'
export type EmailStatus = 'pending' | 'sent' | 'failed'

export interface OwnerNotificationPayload {
  timeSubmitted: string
  schoolName?: string | null
  contactName?: string | null
  email?: string | null
  phone?: string | null
  studentCount?: string | null
  state?: string | null
  message?: string | null
  programType?: string | null
  [key: string]: unknown
}

export interface OwnerNotification {
  id: string
  type: OwnerNotificationType
  status: OwnerNotificationStatus
  source_type: string | null
  source_id: string | null
  payload: OwnerNotificationPayload
  dedup_hash: string
  recipient_email: string
  email_status: EmailStatus
  email_error: string | null
  email_sent_at: string | null
  created_at: string
  updated_at: string
}

export interface NotificationResult {
  success: boolean
  notificationId?: string
  error?: string
  duplicate?: boolean
}
