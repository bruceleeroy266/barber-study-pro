/**
 * ASCYN PRO — KeyTermsPanel Tests (Phase 2B)
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import KeyTermsPanel from './KeyTermsPanel'
import { chapter2KeyTerms } from '@/lib/chapter-2-key-terms'
import { getChapterContent } from '@/lib/chapter-content'

const ch2Theme = getChapterContent(2)?.theme

describe('KeyTermsPanel — Chapter 2', () => {
  it('renders the panel header with the term count', () => {
    render(<KeyTermsPanel terms={chapter2KeyTerms} theme={ch2Theme} />)
    expect(screen.getByText('Key Terms')).toBeInTheDocument()
    expect(screen.getByText(/37 essential terms/i)).toBeInTheDocument()
  })

  it('makes all 37 terms accessible with their definitions', () => {
    render(<KeyTermsPanel terms={chapter2KeyTerms} theme={ch2Theme} />)
    for (const kt of chapter2KeyTerms) {
      // Term names may coincide with a concept group heading — allow both.
      expect(screen.getAllByText(kt.term).length).toBeGreaterThan(0)
      expect(screen.getByText(kt.definition)).toBeInTheDocument()
    }
  })

  it('renders concept group headings in curriculum order', () => {
    render(<KeyTermsPanel terms={chapter2KeyTerms} theme={ch2Theme} />)
    expect(screen.getByText('Life Skills Foundations')).toBeInTheDocument()
    expect(screen.getByText('Financial Literacy for Barbers')).toBeInTheDocument()
    expect(screen.getByText('Leadership & Mentorship')).toBeInTheDocument()
    expect(screen.getByText('Workplace Professionalism & Shop Etiquette')).toBeInTheDocument()
  })

  it('does not expose internal provenance labels or board-exam framing to students', () => {
    const { container } = render(<KeyTermsPanel terms={chapter2KeyTerms} theme={ch2Theme} />)
    const text = container.textContent ?? ''
    expect(text).not.toMatch(/TEXTBOOK_DERIVED|MILADY_SUPPORTED|ASCYN_ORIGINAL|ASCYN ENRICHMENT|DIRECT MILADY/i)
    expect(text).not.toMatch(/board exam|state board/i)
    expect(text).not.toMatch(/\bCORE\b|\bSUPPORTING\b|\bENRICHMENT\b/)
  })

  it('uses a mobile-safe fluid structure (no fixed pixel widths)', () => {
    const { container } = render(<KeyTermsPanel terms={chapter2KeyTerms} theme={ch2Theme} />)
    const html = container.innerHTML
    // No Tailwind arbitrary fixed-width utilities in class attributes
    expect(html).not.toMatch(/class="[^"]*\bw-\[\d+px\]/)
    expect(html).not.toMatch(/class="[^"]*\bmin-w-\[\d+px\]/)
    // No inline fixed LAYOUT widths (border-width is not a layout width)
    const styleAttrs = html.match(/style="[^"]*"/g) ?? []
    for (const attr of styleAttrs) {
      const body = attr.slice(7, -1)
      expect(body).not.toMatch(/(^|;)\s*width:\s*\d+px/)
      expect(body).not.toMatch(/(^|;)\s*min-width:\s*\d+px/)
    }
  })

  it('renders nothing when given no terms', () => {
    const { container } = render(<KeyTermsPanel terms={[]} theme={ch2Theme} />)
    expect(container.firstChild).toBeNull()
  })
})
