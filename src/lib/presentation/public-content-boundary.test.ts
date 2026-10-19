import { describe, expect, it } from 'vitest'
import { convertRowsToCSV } from '@/lib/export-utils'
import { publicConceptDetails, publicDisplayText, publicReportRows } from './public-content-boundary'

describe('publisher-safe presentation boundary', () => {
  it('keeps ordinary student-facing terminology intact', () => {
    expect(publicDisplayText('Hair shaft structure')).toBe('Hair shaft structure')
  })
  it('blocks publisher markers in rendered text regardless of case', () => {
    expect(publicDisplayText('Milady Chapter 5')).toBe('Content under review')
    expect(publicDisplayText('A CENGAGE citation')).toBe('Content under review')
  })
  it('projects allowlisted fields, excluding internal provenance', () => {
    const source = {
      name: 'Barbering anatomy',
      description: 'Identify the muscle',
      sourceBasis: 'Milady Standard Barbering p. 10',
      sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
      restrictedAuditMetadata: { publisher: 'Milady' },
    }
    const projected = publicConceptDetails(source)
    expect(projected).toEqual({ name: 'Barbering anatomy', description: 'Identify the muscle' })
    expect(JSON.stringify(projected)).not.toMatch(/milady|cengage|sourceBasis|sourceProvenance/i)
  })
  it('fails closed if display fields accidentally contain a publisher reference', () => {
    const projected = publicConceptDetails({ name: 'Milady chapter', description: 'Cengage content' })
    expect(projected).toEqual({ name: 'Content under review', description: 'Content under review' })
  })
})

describe('publisher-safe school report projection', () => {
  it('removes provenance and unsafe nested metadata from exported rows', () => {
    const rows = publicReportRows([{
      Student: 'Test Student',
      Score: 87,
      sourceBasis: 'Milady chapter 5',
      sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
      restrictedAuditMetadata: { source: 'Milady' },
      Notes: 'Cengage textbook exercise',
      safe: true,
    }])
    expect(rows).toEqual([{ Student: 'Test Student', Score: 87, Notes: 'Content under review', safe: true }])
    expect(JSON.stringify(rows)).not.toMatch(/milady|cengage|sourceBasis|sourceProvenance|restrictedAuditMetadata/i)
  })
})

describe('captured report CSV bytes — school-owner and compliance fixtures', () => {
  const hidden = {
    sourceBasis: 'Milady Chapter 5',
    sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
    publisher: 'Cengage',
    restrictedAuditMetadata: { textbook: 'Milady' },
  }

  for (const surface of ['school-owner', 'compliance']) {
    it(`${surface} CSV contains no internal metadata in actual UTF-8 output`, () => {
      const rows = publicReportRows([
        { Student: 'ASCYN Fixture', Score: 82, Notes: 'Milady publisher quotation', ...hidden },
        { Student: 'Second Fixture', Score: 91, Notes: 'Safe academic progress', ...hidden },
      ])
      const downloadedBytes = Buffer.from('\uFEFF' + convertRowsToCSV(rows), 'utf8')
      const output = downloadedBytes.toString('utf8')
      expect(downloadedBytes.subarray(0, 3)).toEqual(Buffer.from([0xef, 0xbb, 0xbf]))
      expect(output).toContain('ASCYN Fixture')
      expect(output).toContain('Second Fixture')
      expect(output).toContain('Content under review')
      expect(output).not.toMatch(/milady|cengage|sourceBasis|sourceProvenance|restrictedAuditMetadata|publisher/i)
    })
  }

  it('blocks accidental provenance in a simulated JSON serialization boundary', () => {
    const serialized = Buffer.from(JSON.stringify({ rows: publicReportRows([{
      Student: 'ASCYN Fixture', score: 93, ...hidden,
    }]) }), 'utf8').toString('utf8')
    expect(serialized).not.toMatch(/milady|cengage|sourceBasis|sourceProvenance|restrictedAuditMetadata|publisher/i)
  })
})
