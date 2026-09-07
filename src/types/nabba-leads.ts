/**
 * NABBA Lead Capture System Types
 * Event: NABBA 2026
 */

export type LeadTemperature = 'HOT' | 'WARM' | 'CONTACT'
export type LeadStatus = 'NEW' | 'CONTACTED' | 'RESPONDED' | 'MEETING' | 'PILOT' | 'CLOSED'
export type LeadRole =
  | 'Student'
  | 'Instructor'
  | 'School Owner / Administrator'
  | 'Board / Regulator'
  | 'Industry'
  | 'Other'

export type LeadFollowUp =
  | 'Send Information'
  | 'Schedule Demo'
  | 'Discuss Pilot'
  | 'Call'
  | 'No Action Yet'

export type LeadInterest =
  | 'ASCYN PRO Demo'
  | '90-Day Pilot'
  | 'School Adoption'
  | 'Partnership'
  | 'General Information'

export interface NabbaLead {
  id: string
  event: string
  name: string
  organization: string
  role: LeadRole
  email: string
  phone: string | null
  state: string | null
  interests: LeadInterest[]
  temperature: LeadTemperature
  notes: string | null
  follow_up_action: LeadFollowUp
  status: LeadStatus
  captured_by: string
  captured_by_email: string | null
  created_at: string
  updated_at: string
}

export interface LeadFormData {
  name: string
  organization: string
  role: LeadRole
  email: string
  phone: string
  state: string
  interests: LeadInterest[]
  temperature: LeadTemperature
  notes: string
  follow_up_action: LeadFollowUp
}

export interface LeadMetrics {
  total: number
  hot: number
  warm: number
  contact: number
  pilotInterest: number
  demoRequests: number
}

export interface LeadFilters {
  temperature?: LeadTemperature | 'all'
  status?: LeadStatus | 'all'
  role?: LeadRole | 'all'
  interest?: LeadInterest | 'all'
  search?: string
}

export const LEAD_ROLE_OPTIONS: LeadRole[] = [
  'Student',
  'Instructor',
  'School Owner / Administrator',
  'Board / Regulator',
  'Industry',
  'Other',
]

export const LEAD_INTEREST_OPTIONS: LeadInterest[] = [
  'ASCYN PRO Demo',
  '90-Day Pilot',
  'School Adoption',
  'Partnership',
  'General Information',
]

export const LEAD_TEMPERATURE_OPTIONS: LeadTemperature[] = ['HOT', 'WARM', 'CONTACT']

export const LEAD_STATUS_OPTIONS: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'RESPONDED',
  'MEETING',
  'PILOT',
  'CLOSED',
]

export const LEAD_FOLLOW_UP_OPTIONS: LeadFollowUp[] = [
  'Send Information',
  'Schedule Demo',
  'Discuss Pilot',
  'Call',
  'No Action Yet',
]

export const TEMPERATURE_LABELS: Record<LeadTemperature, { label: string; description: string; color: string }> = {
  HOT: {
    label: 'HOT',
    description: 'Clear next-step intent such as requesting a pilot, meeting, follow-up demonstration, or adoption discussion.',
    color: 'text-red-400 bg-red-400/10 border-red-400/20',
  },
  WARM: {
    label: 'WARM',
    description: 'Genuine interest and contact information provided, but no concrete next step yet.',
    color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  },
  CONTACT: {
    label: 'CONTACT',
    description: 'Networking or informational contact without current pilot/adoption intent.',
    color: 'text-silver bg-silver/10 border-silver/20',
  },
}

export const STATUS_LABELS: Record<LeadStatus, { label: string; color: string }> = {
  NEW: { label: 'New', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  CONTACTED: { label: 'Contacted', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  RESPONDED: { label: 'Responded', color: 'text-teal-400 bg-teal-400/10 border-teal-400/20' },
  MEETING: { label: 'Meeting', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  PILOT: { label: 'Pilot', color: 'text-gold bg-gold/10 border-gold/20' },
  CLOSED: { label: 'Closed', color: 'text-gray-400 bg-gray-400/10 border-gray-400/20' },
}
