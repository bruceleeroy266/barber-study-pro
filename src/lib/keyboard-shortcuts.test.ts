import { describe, it, expect } from 'vitest'
import { isTypingTarget } from './keyboard-shortcuts'

describe('isTypingTarget', () => {
  it('returns true for input elements', () => {
    const input = document.createElement('input')
    expect(isTypingTarget(input)).toBe(true)
  })

  it('returns true for textarea elements', () => {
    const textarea = document.createElement('textarea')
    expect(isTypingTarget(textarea)).toBe(true)
  })

  it('returns true for select elements', () => {
    const select = document.createElement('select')
    expect(isTypingTarget(select)).toBe(true)
  })

  it('returns true for contenteditable elements', () => {
    const div = document.createElement('div')
    div.contentEditable = 'true'
    expect(isTypingTarget(div)).toBe(true)
  })

  it('returns false for div and body elements', () => {
    expect(isTypingTarget(document.createElement('div'))).toBe(false)
    expect(isTypingTarget(document.body)).toBe(false)
  })

  it('returns false for null target', () => {
    expect(isTypingTarget(null)).toBe(false)
  })
})
