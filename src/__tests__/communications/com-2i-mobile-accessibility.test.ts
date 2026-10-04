import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const CENTER = path.join(
  process.cwd(),
  'src/components/messaging/ProductionMessageCenter.tsx'
)

describe('COM-2I mobile and accessibility hardening', () => {
  let center = ''

  beforeAll(() => {
    center = fs.readFileSync(CENTER, 'utf-8')
  })

  it('uses a one-screen-at-a-time mobile messaging flow', () => {
    expect(center).toContain("isComposing || selectedThread ? 'hidden xl:flex' : 'flex'")
    expect(center).toContain("isComposing || selectedThread ? 'flex' : 'hidden xl:flex'")
    expect(center).toContain('Back to conversations')
  })

  it('preserves the desktop two-column layout', () => {
    expect(center).toContain('xl:grid-cols-[340px_minmax(0,1fr)]')
    expect(center).toContain('xl:min-h-[620px]')
  })

  it('keeps touch targets at least 44px high for compact controls', () => {
    expect(center).toContain('min-h-11')
    expect(center).not.toContain('min-h-10 items-center')
  })

  it('uses complete tab semantics for conversation filters', () => {
    expect(center).toContain('role="tablist"')
    expect(center).toContain('aria-controls="conversation-filter-panel"')
    expect(center).toContain('id="conversation-filter-panel"')
    expect(center).toContain('role="tabpanel"')
    expect(center).toContain('aria-labelledby={`conversation-filter-${filter}`}')
  })

  it('keeps live status and errors accessible', () => {
    expect(center).toContain('aria-live="polite"')
    expect(center).toContain('aria-atomic="true"')
    expect(center).toContain('role="alert"')
  })

  it('keeps labels and focus-visible affordances on messaging inputs and controls', () => {
    expect(center).toContain('htmlFor="message-counterpart"')
    expect(center).toContain('htmlFor="new-message-body"')
    expect(center).toContain('htmlFor="production-message-reply"')
    expect(center).toContain('focus-visible:ring-2')
  })

  it('does not alter messaging permissions or Bulletin behavior', () => {
    expect(center.toLowerCase()).not.toContain('bulletin')
    expect(center).toContain('availableCounterparts')
  })
})
