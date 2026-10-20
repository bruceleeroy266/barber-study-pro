import { describe, expect, it } from 'vitest'

describe('publisher marker detection regression', () => {
  const publisherWord = /\b(?:Milady|Cengage)\b/i

  it('detects explicit publisher branding', () => {
    expect(publisherWord.test('Milady Standard Barbering')).toBe(true)
    expect(publisherWord.test('Powered by Cengage')).toBe(true)
    expect(publisherWord.test('Unrelated original teaching text')).toBe(false)
  })
})
