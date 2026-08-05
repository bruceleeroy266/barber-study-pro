/**
 * PingOS Bootstrap Runner — Unit Tests
 *
 * Comprehensive test suite covering:
 * - Successful bootstrap
 * - Failed bootstrap step
 * - Missing document
 * - Repository with uncommitted changes
 * - Clean repository
 *
 * Run with: npx tsx --test src/lib/bootstrap/bootstrap-runner.test.ts
 */

import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { BootstrapRunner } from './bootstrap-runner'
import { DocumentLoader } from './document-loader'
import { EnvironmentInspector } from './environment-inspector'
import { BootstrapPhase, StepStatus, ConfidenceLevel } from './types'
import { mkdir, writeFile, rm } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

// ============================================================================
// TEST FIXTURES
// ============================================================================

/**
 * Create a temporary directory with required documents
 */
async function createTestEnvironment(options: {
  missingDocuments?: string[]
  uncommittedChanges?: boolean
}): Promise<string> {
  const testDir = join(tmpdir(), `bootstrap-test-${Date.now()}`)
  const docsDir = join(testDir, 'docs', 'ping')

  // Create docs/ping directory
  await mkdir(docsDir, { recursive: true })

  // Create required documents
  const requiredDocs = [
    'BOOTSTRAP_PROTOCOL.md',
    'STARTUP_CHECKLIST.md',
    'KNOWN_ISSUES.md',
    'BOOTSTRAP_REPORT_TEMPLATE.md',
    'RECOVERY.md',
    'CURRENT_STATE.md',
    'SESSION_MANAGEMENT.md',
  ]

  for (const doc of requiredDocs) {
    if (!options.missingDocuments?.includes(doc)) {
      await writeFile(join(docsDir, doc), `# ${doc}\n\nTest content`)
    }
  }

  // Initialize Git repository
  const { exec } = await import('child_process')
  const { promisify } = await import('util')
  const execAsync = promisify(exec)

  await execAsync('git init', { cwd: testDir })
  await execAsync('git config user.email "test@example.com"', { cwd: testDir })
  await execAsync('git config user.name "Test User"', { cwd: testDir })

  // Create initial commit
  await writeFile(join(testDir, 'README.md'), '# Test Repo')
  await execAsync('git add README.md', { cwd: testDir })
  await execAsync('git commit -m "Initial commit"', { cwd: testDir })

  // Commit docs directory
  await execAsync('git add docs/', { cwd: testDir })
  await execAsync('git commit -m "Add docs"', { cwd: testDir })

  // Create uncommitted changes if requested
  if (options.uncommittedChanges) {
    await writeFile(join(testDir, 'uncommitted.txt'), 'Uncommitted changes')
  }

  return testDir
}

/**
 * Clean up test environment
 */
async function cleanupTestEnvironment(testDir: string): Promise<void> {
  try {
    await rm(testDir, { recursive: true, force: true })
  } catch {
    // Ignore cleanup errors
  }
}

// ============================================================================
// TESTS
// ============================================================================

describe('BootstrapRunner', () => {
  let testDir: string
  let originalVerifyRepositoryRoot: typeof EnvironmentInspector.prototype.verifyRepositoryRoot
  let originalGetBuildState: typeof EnvironmentInspector.prototype.getBuildState
  let originalGetNodeVersion: typeof EnvironmentInspector.prototype.getNodeVersion

  beforeEach(async () => {
    // Clean up any previous test directory
    if (testDir) {
      await cleanupTestEnvironment(testDir)
    }

    // Save original methods
    originalVerifyRepositoryRoot = EnvironmentInspector.prototype.verifyRepositoryRoot
    originalGetBuildState = EnvironmentInspector.prototype.getBuildState
    originalGetNodeVersion = EnvironmentInspector.prototype.getNodeVersion

    // Mock verifyRepositoryRoot to always return true in tests
    EnvironmentInspector.prototype.verifyRepositoryRoot = async () => true

    // Mock getBuildState to always return success in tests
    EnvironmentInspector.prototype.getBuildState = async () => ({
      buildPassed: true,
      buildExitCode: 0,
      lintPassed: true,
      lintExitCode: 0,
      lintErrorCount: 0,
      lintWarningCount: 0,
      typescriptPassed: true,
      typescriptExitCode: 0,
      verified: true,
    })
  })

  afterEach(async () => {
    // Restore original methods
    EnvironmentInspector.prototype.verifyRepositoryRoot = originalVerifyRepositoryRoot
    EnvironmentInspector.prototype.getBuildState = originalGetBuildState
    EnvironmentInspector.prototype.getNodeVersion = originalGetNodeVersion
  })

  describe('Successful Bootstrap', () => {
    it('should complete all phases successfully', async () => {
      testDir = await createTestEnvironment({})
      const runner = new BootstrapRunner(testDir)

      const result = await runner.execute()

      assert.strictEqual(result.success, true)
      assert.strictEqual(result.currentPhase, BootstrapPhase.SUCCESS_CRITERIA)
      assert.strictEqual(result.steps.length > 0, true)
      assert.strictEqual(result.failedStep, undefined)
      assert.strictEqual(result.report !== undefined, true)
      assert.strictEqual(result.report?.confidence, ConfidenceLevel.HIGH)
      assert.strictEqual(result.report?.ready, true)

      await cleanupTestEnvironment(testDir)
    })

    it('should mark all steps as completed', async () => {
      testDir = await createTestEnvironment({})
      const runner = new BootstrapRunner(testDir)

      const result = await runner.execute()

      const completedSteps = result.steps.filter((s) => s.status === StepStatus.COMPLETED)
      assert.strictEqual(completedSteps.length, result.steps.length)

      await cleanupTestEnvironment(testDir)
    })

    it('should generate a bootstrap report', async () => {
      testDir = await createTestEnvironment({})
      const runner = new BootstrapRunner(testDir)

      const result = await runner.execute()

      assert.strictEqual(result.report !== undefined, true)
      assert.strictEqual(result.report?.timestamp instanceof Date, true)
      assert.strictEqual(typeof result.report?.sessionId, 'string')
      assert.strictEqual(result.report?.identity.pingIdentity, true)
      assert.strictEqual(result.report?.identity.engineeringPrinciples, true)

      await cleanupTestEnvironment(testDir)
    })
  })

  describe('Failed Bootstrap Step', () => {
    it('should stop on first failed step', async () => {
      testDir = await createTestEnvironment({})
      const runner = new BootstrapRunner(testDir)

      // Mock a failure in the environment inspector
      EnvironmentInspector.prototype.getNodeVersion = async () => {
        throw new Error('Simulated Node.js version check failure')
      }

      const result = await runner.execute()

      assert.strictEqual(result.success, false)
      assert.strictEqual(result.failedStep !== undefined, true)
      assert.strictEqual(result.failedStep?.status, StepStatus.FAILED)
      assert.strictEqual(result.failedStep?.error, 'Simulated Node.js version check failure')

      await cleanupTestEnvironment(testDir)
    })

    it('should not execute steps after failure', async () => {
      testDir = await createTestEnvironment({})
      const runner = new BootstrapRunner(testDir)

      // Mock a failure in phase 3
      EnvironmentInspector.prototype.getNodeVersion = async () => {
        throw new Error('Simulated failure')
      }

      const result = await runner.execute()

      // Should have steps from phases 1, 2, and the failed step from phase 3
      const phase1Steps = result.steps.filter((s) => s.phase === BootstrapPhase.IDENTITY_RECOVERY)
      const phase2Steps = result.steps.filter((s) => s.phase === BootstrapPhase.REPOSITORY_RECOVERY)
      const phase3Steps = result.steps.filter((s) => s.phase === BootstrapPhase.ENVIRONMENT_VERIFICATION)

      assert.strictEqual(phase1Steps.length > 0, true)
      assert.strictEqual(phase2Steps.length > 0, true)
      assert.strictEqual(phase3Steps.length > 0, true)

      // Should not have steps from phases 4, 5, 6
      const phase4Steps = result.steps.filter((s) => s.phase === BootstrapPhase.SESSION_RECOVERY)
      const phase5Steps = result.steps.filter((s) => s.phase === BootstrapPhase.TASK_INITIALIZATION)
      const phase6Steps = result.steps.filter((s) => s.phase === BootstrapPhase.SUCCESS_CRITERIA)

      assert.strictEqual(phase4Steps.length, 0)
      assert.strictEqual(phase5Steps.length, 0)
      assert.strictEqual(phase6Steps.length, 0)

      await cleanupTestEnvironment(testDir)
    })
  })

  describe('Missing Document', () => {
    it('should fail when required document is missing', async () => {
      testDir = await createTestEnvironment({
        missingDocuments: ['BOOTSTRAP_PROTOCOL.md'],
      })
      const runner = new BootstrapRunner(testDir)

      const result = await runner.execute()

      assert.strictEqual(result.success, false)
      assert.strictEqual(result.failedStep !== undefined, true)
      assert.strictEqual(result.failedStep?.error?.includes('Missing required documents'), true)
      assert.strictEqual(result.failedStep?.error?.includes('BOOTSTRAP_PROTOCOL.md'), true)

      await cleanupTestEnvironment(testDir)
    })

    it('should list all missing documents', async () => {
      testDir = await createTestEnvironment({
        missingDocuments: ['BOOTSTRAP_PROTOCOL.md', 'STARTUP_CHECKLIST.md', 'KNOWN_ISSUES.md'],
      })
      const runner = new BootstrapRunner(testDir)

      const result = await runner.execute()

      assert.strictEqual(result.success, false)
      assert.strictEqual(result.failedStep?.error?.includes('BOOTSTRAP_PROTOCOL.md'), true)
      assert.strictEqual(result.failedStep?.error?.includes('STARTUP_CHECKLIST.md'), true)
      assert.strictEqual(result.failedStep?.error?.includes('KNOWN_ISSUES.md'), true)

      await cleanupTestEnvironment(testDir)
    })
  })

  describe('Repository with Uncommitted Changes', () => {
    it('should detect uncommitted changes', async () => {
      testDir = await createTestEnvironment({
        uncommittedChanges: true,
      })
      const runner = new BootstrapRunner(testDir)

      const result = await runner.execute()

      assert.strictEqual(result.success, true)
      assert.strictEqual(result.report?.session.uncommittedChanges, true)
      assert.strictEqual(result.report?.risks.length > 0, true)
      assert.strictEqual(
        result.report?.risks.some((r) => r.description.includes('Uncommitted changes')),
        true
      )
      assert.strictEqual(
        result.report?.recommendations.some((r) => r.includes('Commit or stash')),
        true
      )

      await cleanupTestEnvironment(testDir)
    })
  })

  describe('Clean Repository', () => {
    it('should not detect uncommitted changes in clean repository', async () => {
      testDir = await createTestEnvironment({
        uncommittedChanges: false,
      })
      const runner = new BootstrapRunner(testDir)

      const result = await runner.execute()

      assert.strictEqual(result.success, true)
      assert.strictEqual(result.report?.session.uncommittedChanges, false)
      assert.strictEqual(
        result.report?.risks.some((r) => r.description.includes('Uncommitted changes')),
        false
      )

      await cleanupTestEnvironment(testDir)
    })
  })

  describe('DocumentLoader', () => {
    it('should verify required documents exist', async () => {
      testDir = await createTestEnvironment({})
      const loader = new DocumentLoader(testDir)

      const verification = loader.verifyRequiredDocuments()

      assert.strictEqual(verification.valid, true)
      assert.strictEqual(verification.missing.length, 0)

      await cleanupTestEnvironment(testDir)
    })

    it('should detect missing required documents', async () => {
      testDir = await createTestEnvironment({
        missingDocuments: ['BOOTSTRAP_PROTOCOL.md'],
      })
      const loader = new DocumentLoader(testDir)

      const verification = loader.verifyRequiredDocuments()

      assert.strictEqual(verification.valid, false)
      assert.strictEqual(verification.missing.length, 1)
      assert.strictEqual(verification.missing[0], 'BOOTSTRAP_PROTOCOL.md')

      await cleanupTestEnvironment(testDir)
    })

    it('should load all required documents', async () => {
      testDir = await createTestEnvironment({})
      const loader = new DocumentLoader(testDir)

      const documents = await loader.loadRequiredDocuments()

      assert.strictEqual(documents.size, 7)
      assert.strictEqual(documents.has('BOOTSTRAP_PROTOCOL.md'), true)
      assert.strictEqual(documents.has('STARTUP_CHECKLIST.md'), true)
      assert.strictEqual(documents.has('KNOWN_ISSUES.md'), true)
      assert.strictEqual(documents.has('BOOTSTRAP_REPORT_TEMPLATE.md'), true)
      assert.strictEqual(documents.has('RECOVERY.md'), true)
      assert.strictEqual(documents.has('CURRENT_STATE.md'), true)
      assert.strictEqual(documents.has('SESSION_MANAGEMENT.md'), true)

      await cleanupTestEnvironment(testDir)
    })

    it('should throw error when loading missing document', async () => {
      testDir = await createTestEnvironment({})
      const loader = new DocumentLoader(testDir)

      await assert.rejects(
        async () => await loader.loadDocument('NONEXISTENT.md'),
        /Document not found/
      )

      await cleanupTestEnvironment(testDir)
    })
  })

  describe('EnvironmentInspector', () => {
    it('should get current Git branch', async () => {
      testDir = await createTestEnvironment({})
      const inspector = new EnvironmentInspector(testDir)

      const branch = await inspector.getCurrentBranch()

      assert.strictEqual(typeof branch, 'string')
      assert.strictEqual(branch.length > 0, true)

      await cleanupTestEnvironment(testDir)
    })

    it('should get Git status', async () => {
      testDir = await createTestEnvironment({})
      const inspector = new EnvironmentInspector(testDir)

      const status = await inspector.getGitStatus()

      assert.strictEqual(typeof status.branch, 'string')
      assert.strictEqual(typeof status.modifiedFiles, 'number')
      assert.strictEqual(typeof status.untrackedFiles, 'number')
      assert.strictEqual(typeof status.stagedFiles, 'number')
      assert.strictEqual(typeof status.mergeConflicts, 'boolean')
      assert.strictEqual(status.verified, true)

      await cleanupTestEnvironment(testDir)
    })

    it('should detect uncommitted changes', async () => {
      testDir = await createTestEnvironment({
        uncommittedChanges: true,
      })
      const inspector = new EnvironmentInspector(testDir)

      const status = await inspector.getGitStatus()

      assert.strictEqual(status.untrackedFiles > 0, true)

      await cleanupTestEnvironment(testDir)
    })

    it('should get Node.js version', async () => {
      testDir = await createTestEnvironment({})
      const inspector = new EnvironmentInspector(testDir)

      const version = await inspector.getNodeVersion()

      assert.strictEqual(typeof version, 'string')
      assert.strictEqual(version.startsWith('v'), true)

      await cleanupTestEnvironment(testDir)
    })

    it('should verify Node.js version', async () => {
      testDir = await createTestEnvironment({})
      const inspector = new EnvironmentInspector(testDir)

      assert.strictEqual(inspector.verifyNodeVersion('v24.18.0'), true)
      assert.strictEqual(inspector.verifyNodeVersion('v23.0.0'), false)
      assert.strictEqual(inspector.verifyNodeVersion('v25.0.0'), false)

      await cleanupTestEnvironment(testDir)
    })

    it('should get npm version', async () => {
      testDir = await createTestEnvironment({})
      const inspector = new EnvironmentInspector(testDir)

      const version = await inspector.getNpmVersion()

      assert.strictEqual(typeof version, 'string')
      assert.strictEqual(/^\d+\.\d+\.\d+/.test(version), true)

      await cleanupTestEnvironment(testDir)
    })

    it('should verify npm version', async () => {
      testDir = await createTestEnvironment({})
      const inspector = new EnvironmentInspector(testDir)

      assert.strictEqual(inspector.verifyNpmVersion('11.16.0'), true)
      assert.strictEqual(inspector.verifyNpmVersion('10.0.0'), false)
      assert.strictEqual(inspector.verifyNpmVersion('12.0.0'), false)

      await cleanupTestEnvironment(testDir)
    })
  })
})
