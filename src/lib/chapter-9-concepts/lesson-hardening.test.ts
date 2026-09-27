import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const lesson = readFileSync(join(root, 'src/lib/chapter-9-premium.ts'), 'utf-8')

describe('C9-2 source-grounded Chapter 9 lesson hardening', () => {
  it('removes unsupported board-exam certainty and volatile medical statistics', () => {
    const banned = [
      'BOARD EXAM ALERT',
      'every board exam',
      'every test',
      '100% fatal',
      '99% survival',
      '27%',
      'approximately 80% of all skin cancers',
      'about 20% of cases',
      '16 million Americans',
      "HALF THE BODY'S BLOOD SUPPLY",
      'license suspension',
    ]

    for (const phrase of banned) {
      expect(lesson.toLowerCase()).not.toContain(phrase.toLowerCase())
    }
  })

  it('removes medical-style credentialing and diagnostic overreach', () => {
    const banned = [
      'Dermatology Authority',
      'diagnostic tools',
      'professional negligence',
      'frontline health observer',
      'read the skin like a medical chart',
      'Skin Safety Officer Certification',
    ]

    for (const phrase of banned) {
      expect(lesson.toLowerCase()).not.toContain(phrase.toLowerCase())
    }
  })

  it('keeps scope-safe observation and referral language explicit', () => {
    expect(lesson).toContain('not a medical professional')
    expect(lesson).toContain('without naming a diagnosis')
    expect(lesson).toContain('recommend medical evaluation')
    expect(lesson).toContain('school and state sanitation requirements')
    expect(lesson).toContain('OBSERVE CAREFULLY — STAY IN SCOPE — PROTECT CLIENT SAFETY')
  })

  it('uses neutral study framing instead of claiming universal exam frequency', () => {
    expect(lesson).toContain('KEY STUDY POINTS')
    expect(lesson).toContain('COMMON CONFUSIONS — CHECK YOUR REASONING')
    expect(lesson).toContain('Core Chapter 9 facts to review')
  })

  it('preserves the established Chapter 9 lesson concept structure', () => {
    for (const id of [
      "id: 'skin-divisions'",
      "id: 'skin-functions'",
      "id: 'primary-lesions'",
      "id: 'secondary-lesions'",
      "id: 'sebaceous-disorders'",
      "id: 'sudoriferous-disorders'",
      "id: 'inflammations'",
      "id: 'skin-cancer'",
      "id: 'referral-caution'",
    ]) {
      expect(lesson).toContain(id)
    }
  })

  it('keeps melanoma education observational rather than diagnostic', () => {
    expect(lesson).toContain('THE ABCDE MELANOMA OBSERVATION GUIDE')
    expect(lesson).toContain('requires medical diagnosis and treatment')
    expect(lesson).toContain('prognosis worsens after the cancer spreads')
    expect(lesson).toContain('recommend evaluation by a qualified medical professional')
  })
})
