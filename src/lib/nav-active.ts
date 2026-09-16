/**
 * Dashboard sidebar active-route matching.
 *
 * Rules:
 *   - '/dashboard' (the sidebar root) is active only on an exact match —
 *     prefix-matching the root would light it up for every dashboard page.
 *   - Every other destination is active on an exact match or on its own
 *     sub-routes (segment-boundary prefix: '/dashboard/chapters' matches
 *     '/dashboard/chapters/3' but NOT '/dashboard/chaptersx').
 *
 * With distinct sibling hrefs this guarantees at most one nav item is active
 * for any pathname, so two sidebar entries can never appear active at once.
 */
export function isDashboardNavItemActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') {
    return pathname === href
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}
