import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { examReadyQuestions, assertExamReadyBankIntegrity, findExamReadyIdCollisions } from './index'

const ROOT = process.cwd()
const SCAN_ROOTS = ['src', 'content-library', 'migrated-content']
const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'coverage'])
const UPSTREAM_PATH = 'src/lib/exam-ready-import/'

// Fail closed if the source directories disappear or the scanner finds nothing.
// Scan structured id properties in the existing question/content source, not every
// arbitrary token (which would incorrectly classify option letters as question IDs).
function existingIds(): { ids: Set<string>; files: number } {
  const ids = new Set<string>()
  let files = 0
  function walk(directory: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (SKIP_DIRS.has(entry.name)) continue
      const absolute = join(directory, entry.name)
      const path = relative(ROOT, absolute).replaceAll('\\', '/')
      if (entry.isDirectory()) {
        if (!path.startsWith(UPSTREAM_PATH.slice(0, -1))) walk(absolute)
      } else if (entry.isFile() && /\.(?:ts|tsx|js|jsx|json|md|mdx|sql)$/.test(entry.name)) {
        if (path.startsWith(UPSTREAM_PATH)) continue
        files++
        const body = readFileSync(absolute, 'utf8')
        // Capture literal object-property IDs, including JSON and TS object data.
        for (const match of body.matchAll(/(?:["']?\bid["']?)\s*:\s*["'`]([^"'`\r\n]+)["'`]/g)) {
          ids.add(match[1])
        }
      }
    }
  }
  for (const root of SCAN_ROOTS) {
    const dir = join(ROOT, root)
    try { walk(dir) } catch (error) {
      throw new Error(`Exam Ready ID scan failed in ${root}: ${String(error)}`)
    }
  }
  if (files === 0 || ids.size === 0) throw new Error('Exam Ready ID scan returned no existing content')
  return { ids, files }
}

describe('Exam Ready cross-namespace CI certification', () => {
  it('scans existing ASCYN PRO content and rejects overlapping IDs', () => {
    const { ids, files } = existingIds()
    expect(files).toBeGreaterThan(0)
    expect(ids.size).toBeGreaterThan(0)
    const collisions = findExamReadyIdCollisions(ids)
    expect(collisions, `Existing ASCYN PRO question ID collisions: ${collisions.join(', ')}`).toEqual([])
    expect(() => assertExamReadyBankIntegrity(ids)).not.toThrow()
  })

  it('certifies source option and explanation integrity', () => {
    expect(examReadyQuestions).toHaveLength(573)
    for (const q of examReadyQuestions) {
      expect(q.options, q.id).toHaveLength(4)
      const normalized = q.options.map(o => o.text.trim().toLowerCase().replace(/\s+/g, ' '))
      expect(new Set(normalized).size, q.id).toBe(4)
      expect(q.options.filter(o => o.id === q.correctOptionId), q.id).toHaveLength(1)
      expect(q.explanation.trim().length, q.id).toBeGreaterThan(0)
      expect(q.sourceBasis.length, q.id).toBeGreaterThan(0)
    }
  })
})
