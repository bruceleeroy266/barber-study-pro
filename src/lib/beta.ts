export const BETA_AGREEMENT_VERSION = 'v1.0'
export const BETA_AGREEMENT_STORAGE_KEY = 'ascyn_beta_agreement_v1'

export interface BetaAgreementStorage {
  name: string
  email: string
  version: string
  acceptedAt: string
  userId: string | null
}
