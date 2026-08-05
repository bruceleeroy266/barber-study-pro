/**
 * PingOS Bootstrap Runner — Document Loader
 *
 * Loads and validates PingOS documentation files.
 * Reuses existing documentation rather than duplicating logic.
 */

import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

// ============================================================================
// DOCUMENT PATHS
// ============================================================================

export const DOCS_PING_DIR = 'docs/ping'

export const REQUIRED_DOCUMENTS = [
  'BOOTSTRAP_PROTOCOL.md',
  'STARTUP_CHECKLIST.md',
  'KNOWN_ISSUES.md',
  'BOOTSTRAP_REPORT_TEMPLATE.md',
  'RECOVERY.md',
  'CURRENT_STATE.md',
  'SESSION_MANAGEMENT.md',
] as const

export const OPTIONAL_DOCUMENTS = [
  'PROJECT_UNDERSTANDING.md',
  'OPERATING_PROCEDURES.md',
  'DECISION_FRAMEWORK.md',
  'VERIFICATION_PROTOCOL.md',
  'QUALITY_STANDARDS.md',
  'ENVIRONMENT_REFERENCE.md',
  'GLOSSARY.md',
] as const

// ============================================================================
// DOCUMENT LOADER
// ============================================================================

export class DocumentLoader {
  private readonly basePath: string

  constructor(basePath: string = process.cwd()) {
    this.basePath = basePath
  }

  /**
   * Get the full path to a document
   */
  getDocumentPath(filename: string): string {
    return join(this.basePath, DOCS_PING_DIR, filename)
  }

  /**
   * Check if a document exists
   */
  documentExists(filename: string): boolean {
    const path = this.getDocumentPath(filename)
    return existsSync(path)
  }

  /**
   * Load a document's content
   */
  async loadDocument(filename: string): Promise<string> {
    const path = this.getDocumentPath(filename)

    if (!existsSync(path)) {
      throw new Error(`Document not found: ${filename} (expected at ${path})`)
    }

    try {
      const content = await readFile(path, 'utf-8')
      return content
    } catch (error) {
      throw new Error(
        `Failed to load document ${filename}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * Load all required documents
   */
  async loadRequiredDocuments(): Promise<Map<string, string>> {
    const documents = new Map<string, string>()

    for (const filename of REQUIRED_DOCUMENTS) {
      try {
        const content = await this.loadDocument(filename)
        documents.set(filename, content)
      } catch (error) {
        throw new Error(
          `Failed to load required document ${filename}: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    }

    return documents
  }

  /**
   * Load optional documents (don't fail if missing)
   */
  async loadOptionalDocuments(): Promise<Map<string, string>> {
    const documents = new Map<string, string>()

    for (const filename of OPTIONAL_DOCUMENTS) {
      if (this.documentExists(filename)) {
        try {
          const content = await this.loadDocument(filename)
          documents.set(filename, content)
        } catch (error) {
          // Log but don't fail for optional documents
          console.warn(
            `Failed to load optional document ${filename}: ${error instanceof Error ? error.message : String(error)}`
          )
        }
      }
    }

    return documents
  }

  /**
   * Verify all required documents exist
   */
  verifyRequiredDocuments(): { valid: boolean; missing: string[] } {
    const missing: string[] = []

    for (const filename of REQUIRED_DOCUMENTS) {
      if (!this.documentExists(filename)) {
        missing.push(filename)
      }
    }

    return {
      valid: missing.length === 0,
      missing,
    }
  }

  /**
   * Extract open issues count from KNOWN_ISSUES.md
   */
  extractOpenIssuesCount(content: string): number {
    // Count issues with Status: Open
    const openIssues = content.match(/- \*\*Status:\*\* Open/g)
    return openIssues ? openIssues.length : 0
  }

  /**
   * Extract current state summary from CURRENT_STATE.md
   */
  extractCurrentStateSummary(content: string): string {
    // Extract the first paragraph after the title
    const lines = content.split('\n')
    let inSummary = false
    let summary = ''

    for (const line of lines) {
      if (line.startsWith('# ')) {
        inSummary = true
        continue
      }
      if (inSummary && line.trim() && !line.startsWith('#')) {
        summary += line.trim() + ' '
      }
      if (inSummary && line.startsWith('##')) {
        break
      }
    }

    return summary.trim() || 'No summary available'
  }
}
