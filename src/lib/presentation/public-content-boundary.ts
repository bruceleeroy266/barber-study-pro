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
