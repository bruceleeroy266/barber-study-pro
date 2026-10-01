import {
  isTLSPublicSnapshotForAudience,
  type TLSInstructorPublicSnapshot,
  type TLSStudentPublicSnapshot,
} from '@/lib/tls/public'
import {
  mapCertifiedDiagnosticSummaryToTLS,
  type CertifiedChapterDiagnosticSummary,
  type CertifiedDiagnosticIntegrationState,
} from './certified-diagnostic-summary-mapper'

export interface TLSCertifiedDiagnosticAudienceBundle {
  student: TLSStudentPublicSnapshot
  instructor: TLSInstructorPublicSnapshot
}

/**
 * TLS-1C.3 read-only audience snapshot bundle.
 *
 * Evaluates the same certified diagnostic summary for both supported audiences
 * through the TLS-1C.2 mapper. This keeps score/evidence authority singular
 * while preserving the certified student/instructor public-detail boundary.
 */
export function buildCertifiedDiagnosticAudienceBundle(input: {
  summary: CertifiedChapterDiagnosticSummary
  integrationState?: CertifiedDiagnosticIntegrationState
}): TLSCertifiedDiagnosticAudienceBundle {
  const student = mapCertifiedDiagnosticSummaryToTLS({
    audience: 'student',
    summary: input.summary,
    integrationState: input.integrationState,
  })

  const instructor = mapCertifiedDiagnosticSummaryToTLS({
    audience: 'instructor',
    summary: input.summary,
    integrationState: input.integrationState,
  })

  if (!isTLSPublicSnapshotForAudience(student, 'student')) {
    throw new Error('TLS student snapshot audience mismatch')
  }

  if (!isTLSPublicSnapshotForAudience(instructor, 'instructor')) {
    throw new Error('TLS instructor snapshot audience mismatch')
  }

  return {
    student,
    instructor,
  }
}
