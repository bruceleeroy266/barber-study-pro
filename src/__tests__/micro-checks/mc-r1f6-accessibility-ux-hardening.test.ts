import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf-8')

describe('MC-R1F.6 accessibility and UX hardening', () => {
  it('exposes answer-choice selection and disabled semantics', () => {
    const source = read('src/components/chapter/RandomizedMicroCheckChoices.tsx')

    expect(source).toContain('role="group"')
    expect(source).toContain('aria-label="Answer choices"')
    expect(source).toContain('aria-disabled={locked || disabled}')
    expect(source).toContain('aria-pressed={active}')
    expect(source).toContain('min-h-11')
    expect(source).toContain('focus-visible:ring-2')
  })

  it('moves focus into retry and completion states', () => {
    const source = read('src/components/chapter/MicroCheckRemediationPanel.tsx')

    expect(source).toContain('retryRegionRef.current?.focus()')
    expect(source).toContain('completionRef.current?.focus()')
    expect(source).toContain("snapshot.state === 'remediation_active'")
    expect(source).toContain("snapshot.state === 'remediation_complete'")
    expect(source).toContain('tabIndex={-1}')
  })

  it('announces loading, completion, and errors to assistive technology', () => {
    const source = read('src/components/chapter/MicroCheckRemediationPanel.tsx')

    expect(source).toContain('role="status"')
    expect(source).toContain('aria-live="polite"')
    expect(source).toContain('role="alert"')
    expect(source).toContain('aria-busy={saving}')
  })

  it('preserves hint context on retry actions', () => {
    const source = read('src/components/chapter/MicroCheckRemediationPanel.tsx')

    expect(source).toContain('micro-check-hint-')
    expect(source).toContain('aria-describedby=')
    expect(source).toContain('Try This Concept Again')
    expect(source).toContain("saving ? 'Saving…' : 'Lock Retry'")
  })

  it('does not change grading, evidence, or answer-key behavior', () => {
    const panel = read('src/components/chapter/MicroCheckRemediationPanel.tsx')
    const choices = read('src/components/chapter/RandomizedMicroCheckChoices.tsx')

    expect(panel).toContain("fetch('/api/micro-checks/remediation'")
    expect(panel).toContain("type: 'SUBMIT_REMEDIATION'")
    expect(choices).toContain('onSelect(choice.sourceKey)')
    expect(choices).not.toContain('correctAnswer')
    expect(choices).not.toContain('is_correct')
  })
})
