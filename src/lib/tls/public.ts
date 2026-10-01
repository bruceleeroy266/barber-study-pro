export { evaluateTLSPublicSnapshot } from './public-evaluation'

export type { TLSPublicEvaluationRequest } from './public-evaluation'

export {
  TLS_PUBLIC_CONTRACT_VERSION,
  isTLSPublicSnapshotForAudience,
} from './public-contract'

export type {
  TLSPublicAction,
  TLSPublicSnapshot,
  TLSPublicStatus,
  TLSInstructorPublicSnapshot,
  TLSStudentPublicSnapshot,
} from './public-contract'

/**
 * TLS-1B.7 certified consumer boundary.
 *
 * Future UI/API consumers should import TLS through this module instead of
 * reaching directly into resolver, evidence-adapter, evaluation-pipeline,
 * presentation-model, or other internal TLS implementation files.
 */
