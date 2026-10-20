/**
 * Allowlist-only projection of concept material before it reaches student or
 * instructor presentation. Internal provenance must never cross this boundary.
 *
 * This is not a copyright originality assessment; it only limits metadata
 * exposure and rejects publisher references accidentally placed in visible text.
 */
const publisherMarker = /\b(?:milady|cengage)\b/i

export function publicDisplayText(text: string, fallback = 'Content under review'): string {
  return publisherMarker.test(text) ? fallback : text
}

export function publicConceptDetails<T extends { name: string; description: string }>(
  concept: T,
): { name: string; description: string } {
  return {
    name: publicDisplayText(concept.name),
    description: publicDisplayText(concept.description),
  }
}

/**
 * Safe public projection for flat school report tables and downloads.
 * Drop audit-only source fields and reject nested objects rather than
 * implicitly stringifying internal metadata into CSV or HTML.
 * Upstream report generation must still enforce its own explicit DTO schema.
 */
export function publicReportRows(rows: ReadonlyArray<Record<string, unknown>>): Record<string, string | number | boolean | null>[] {
  const internalField = /(?:source[_-]?(?:basis|provenance)|provenance|publisher|citation|restrictedAuditMetadata)/i
  return rows.map((row) => Object.fromEntries(
    Object.entries(row)
      .filter(([key]) => !internalField.test(key) && !/(?:milady|cengage)/i.test(key))
      .map(([key, value]) => {
        if (typeof value === 'string') return [key, publicDisplayText(value)]
        if (typeof value === 'number' && Number.isFinite(value)) return [key, value]
        if (typeof value === 'boolean' || value === null) return [key, value]
        return [key, 'Content under review']
      }),
  ))
}
