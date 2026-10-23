import { describe,expect,it } from 'vitest'
import { createHash } from 'node:crypto'
import { examReadyQuestions } from './index'
import { prepareImportReviewManifest } from './4d5-import-review-manifest'

describe('4D-5 offline real-bank review manifest',()=>{
  it('creates deterministic digest and domain inventory without database writes',()=>{
    const first=prepareImportReviewManifest()
    const second=prepareImportReviewManifest()
    expect(first).toEqual(second)
    expect(first.sourceCount).toBe(573)
    expect(first.sourceDigestSha256).toMatch(/^[a-f0-9]{64}$/)
    expect(first.sqlCompatibleDigestSha256).toMatch(/^[a-f0-9]{64}$/)
    expect(first.sqlCompatibleDigestSha256).toBe(second.sqlCompatibleDigestSha256)
    expect(new Set(first.sourceIds).size).toBe(573)
    expect(first.domainCounts).toEqual({scientific_concepts:274,implements_equipment:56,hair_care_services:173,facial_hair_skin_care_services:70})
    expect(first.draftConfig.status).toBe('draft')
    // Independent source-to-digest reconstruction, without calling registry adapter.
    const domainMap: Record<string,string> = {
      'Scientific Concepts':'scientific_concepts',
      'Implements & Equipment':'implements_equipment',
      'Hair Care Services':'hair_care_services',
      'Facial Hair & Skin Care':'facial_hair_skin_care_services',
    }
    const fs = String.fromCharCode(31), rs = String.fromCharCode(30)
    const independentlyMapped = examReadyQuestions.map(q => {
      const options = Object.fromEntries(q.options.map(o => [o.id,o.text]))
      return [`exam-ready:${q.id}`,domainMap[q.domain],q.prompt,options.a,options.b,options.c,options.d,q.correctOptionId,q.explanation,'exam-ready-573-v1']
    }).sort((a,b) => a[0].localeCompare(b[0]))
    expect(independentlyMapped).toHaveLength(573)
    expect(independentlyMapped.every(fields => fields.every(value => typeof value === 'string'))).toBe(true)
    const independentDigest = createHash('sha256').update(independentlyMapped.map(fields => fields.join(fs)).join(rs)).digest('hex')
    expect(first.sqlCompatibleDigestSha256).toBe(independentDigest)
  })
})
