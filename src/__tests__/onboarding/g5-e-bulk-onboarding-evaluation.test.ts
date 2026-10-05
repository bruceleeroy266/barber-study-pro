import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf-8')

describe('G5-E bulk onboarding evaluation', () => {
  it('documents bulk onboarding as deferred by evidence', () => {
    const doc = read('docs/engineering/G5-E-BULK-ONBOARDING-EVALUATION.md')

    expect(doc).toContain('Bulk onboarding is DEFERRED')
    expect(doc).toContain('G5-E is **GREEN / DEFERRED BY EVIDENCE**')
    expect(doc).toContain('No product code is required for this slice.')
  })

  it('locks explicit reopen criteria before bulk work is authorized', () => {
    const doc = read('docs/engineering/G5-E-BULK-ONBOARDING-EVALUATION.md')

    expect(doc).toContain('Reopen criteria')
    expect(doc).toContain('20–30 learners')
    expect(doc).toContain('material duplicate, enrollment, or assignment errors')
    expect(doc).toContain('Aaron Valles test')
  })

  it('preserves certified existing onboarding mutation paths', () => {
    const doc = read('docs/engineering/G5-E-BULK-ONBOARDING-EVALUATION.md')

    expect(doc).toContain('Do not introduce new account, enrollment, or assignment data models.')
    expect(doc).toContain('using existing invite/create-user mutations')
  })
})
