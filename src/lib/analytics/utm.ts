/**
 * UTM parameter capture for ASCYN PRO marketing tracking.
 *
 * Reads standard UTM parameters from the current URL and stores them in
 * sessionStorage so they persist across page navigation without using cookies.
 * Only the parameter values are stored; no personal information is collected.
 */

export interface UtmParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

const STORAGE_KEY = 'ascyn_utm_params'

export function getUtmParamsFromUrl(): UtmParams {
  if (typeof window === 'undefined') return {}

  const search = new URLSearchParams(window.location.search)
  const params: UtmParams = {}

  const source = search.get('utm_source')
  const medium = search.get('utm_medium')
  const campaign = search.get('utm_campaign')
  const term = search.get('utm_term')
  const content = search.get('utm_content')

  if (source) params.utm_source = source
  if (medium) params.utm_medium = medium
  if (campaign) params.utm_campaign = campaign
  if (term) params.utm_term = term
  if (content) params.utm_content = content

  return params
}

export function storeUtmParams(params?: UtmParams): void {
  if (typeof window === 'undefined') return
  const utm = params ?? getUtmParamsFromUrl()
  if (Object.keys(utm).length > 0) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm))
    } catch {
      // sessionStorage may be unavailable in some contexts; ignore gracefully.
    }
  }
}

export function getStoredUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UtmParams) : {}
  } catch {
    return {}
  }
}

export function clearStoredUtmParams(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore.
  }
}

/**
 * Returns the current UTM context, preferring values in the URL and falling
 * back to stored values from the session.
 */
export function getCurrentUtmContext(): UtmParams {
  const fromUrl = getUtmParamsFromUrl()
  const fromStorage = getStoredUtmParams()
  return { ...fromStorage, ...fromUrl }
}
