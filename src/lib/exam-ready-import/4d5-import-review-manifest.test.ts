import { describe,expect,it } from 'vitest'
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
  })
})
