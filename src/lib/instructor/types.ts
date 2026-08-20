import type { AppRole, Profile } from '@/types'
import type { ChapterId, ConceptId } from '@/lib/reassessment/types'
import type { InstructorEscalation, InstructorEscalationEvent } from '@/lib/escalation/types'

export interface InstructorProfileContext {
  id: string
  role: AppRole
  schoolId: string
  fullName: string
}

export interface StudentSummary {
  id: string
  fullName: string
  email: string
  role: AppRole
}

export interface EscalationListItem {
  id: string
  student: StudentSummary
  conceptId: ConceptId
  chapterId: ChapterId
  status: InstructorEscalation['status']
  unsuccessfulCycleCount: number
  createdAt: string
  acknowledgedBy: string | null
  acknowledgedAt: string | null
  acknowledgedByName: string | null
}

export interface EscalationDetail extends EscalationListItem {
  triggeringCycleIds: string[]
  instructorNotes: string | null
  interventionPlan: string | null
  resolutionSummary: string | null
  followUpRequired: boolean | null
  events: InstructorEscalationEvent[]
}

export interface InterventionHistoryItem {
  cycleId: string
  conceptId: ConceptId
  chapterId: ChapterId
  status: string
  outcome: string | null
  targetedAt: string
  reviewCompletedAt: string | null
  reassessmentCompletedAt: string | null
  evaluatedAt: string | null
  detectionSummary: string
  evaluationSummary: string | null
  escalation: {
    id: string
    status: string
    acknowledgedByName: string | null
    acknowledgedAt: string | null
  } | null
  events: Array<{
    type: string
    timestamp: string
    summary: string
  }>
}

export interface IInstructorDatabaseClient {
  getProfileById(userId: string): Promise<Profile | null>
  getStudentById(studentId: string): Promise<Profile | null>
  listEscalationsForSchool(schoolId: string): Promise<Array<InstructorEscalation & { student: Profile; acknowledgedByProfile?: Profile | null }>>
  getEscalationForSchool(escalationId: string, schoolId: string): Promise<(InstructorEscalation & { student: Profile; acknowledgedByProfile?: Profile | null }) | null>
  acknowledgeEscalationForSchool(escalationId: string, schoolId: string, instructorId: string): Promise<{ success: boolean; error?: string; alreadyAcknowledged?: boolean }>
  getInterventionHistoryForStudent(studentId: string, schoolId: string): Promise<InterventionHistoryItem[]>
}
