/**
 * PingOS Bootstrap Runner — Environment Inspector
 *
 * Inspects the environment (Git, Node.js, npm, build state, optional tools).
 * Executes commands and collects evidence.
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import {
  GitStatus,
  BuildState,
  OptionalTools,
} from './types'

const execAsync = promisify(exec)

// ============================================================================
// ENVIRONMENT INSPECTOR
// ============================================================================

export class EnvironmentInspector {
  private readonly cwd: string

  constructor(cwd: string = process.cwd()) {
    this.cwd = cwd
  }

  /**
   * Execute a command and return stdout
   */
  private async executeCommand(
    command: string
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    try {
      const { stdout, stderr } = await execAsync(command, { cwd: this.cwd })
      return { stdout: stdout.trim(), stderr: stderr.trim(), exitCode: 0 }
    } catch (error: unknown) {
      const err = error as { stdout?: string; stderr?: string; code?: number }
      return {
        stdout: err.stdout?.trim() || '',
        stderr: err.stderr?.trim() || '',
        exitCode: err.code || 1,
      }
    }
  }

  /**
   * Get current Git branch
   */
  async getCurrentBranch(): Promise<string> {
    const { stdout, exitCode } = await this.executeCommand('git branch --show-current')
    if (exitCode !== 0) {
      throw new Error('Failed to get current Git branch')
    }
    return stdout
  }

  /**
   * Get Git status
   */
  async getGitStatus(): Promise<GitStatus> {
    const branch = await this.getCurrentBranch()
    const { stdout, exitCode } = await this.executeCommand('git status --short')

    if (exitCode !== 0) {
      throw new Error('Failed to get Git status')
    }

    const lines = stdout.split('\n').filter((line) => line.trim())
    let modifiedFiles = 0
    let untrackedFiles = 0
    let stagedFiles = 0
    let mergeConflicts = false

    for (const line of lines) {
      const status = line.substring(0, 2)
      if (status.includes('M')) modifiedFiles++
      if (status.includes('?')) untrackedFiles++
      if (status.includes('A')) stagedFiles++
      if (status.includes('U') || status.includes('D')) mergeConflicts = true
    }

    return {
      branch,
      modifiedFiles,
      untrackedFiles,
      stagedFiles,
      mergeConflicts,
      verified: true,
    }
  }

  /**
   * Get Node.js version
   */
  async getNodeVersion(): Promise<string> {
    const { stdout, exitCode } = await this.executeCommand('node --version')
    if (exitCode !== 0) {
      throw new Error('Failed to get Node.js version')
    }
    return stdout
  }

  /**
   * Verify Node.js version (expect v24.x)
   */
  verifyNodeVersion(version: string): boolean {
    return version.startsWith('v24.')
  }

  /**
   * Get npm version
   */
  async getNpmVersion(): Promise<string> {
    const { stdout, exitCode } = await this.executeCommand('npm --version')
    if (exitCode !== 0) {
      throw new Error('Failed to get npm version')
    }
    return stdout
  }

  /**
   * Verify npm version (expect v11.x)
   */
  verifyNpmVersion(version: string): boolean {
    return version.startsWith('11.')
  }

  /**
   * Get build state
   */
  async getBuildState(): Promise<BuildState> {
    // Check build
    const buildResult = await this.executeCommand('npm run build')
    const buildPassed = buildResult.exitCode === 0

    // Check lint
    const lintResult = await this.executeCommand('npm run lint')
    const lintPassed = lintResult.exitCode === 0

    // Parse lint output for errors and warnings
    let lintErrorCount = 0
    let lintWarningCount = 0
    const lintOutput = lintResult.stdout + lintResult.stderr
    const errorMatch = lintOutput.match(/(\d+) error/)
    const warningMatch = lintOutput.match(/(\d+) warning/)
    if (errorMatch) lintErrorCount = parseInt(errorMatch[1], 10)
    if (warningMatch) lintWarningCount = parseInt(warningMatch[1], 10)

    // Check TypeScript
    const tsResult = await this.executeCommand('npx tsc --noEmit')
    const typescriptPassed = tsResult.exitCode === 0

    return {
      buildPassed,
      buildExitCode: buildResult.exitCode,
      lintPassed,
      lintExitCode: lintResult.exitCode,
      lintErrorCount,
      lintWarningCount,
      typescriptPassed,
      typescriptExitCode: tsResult.exitCode,
      verified: true,
    }
  }

  /**
   * Get optional tools status
   */
  async getOptionalTools(): Promise<OptionalTools> {
    const tools: OptionalTools = {}

    // Supabase CLI
    const supabaseResult = await this.executeCommand('supabase --version')
    if (supabaseResult.exitCode === 0) {
      tools.supabaseCli = supabaseResult.stdout
    }

    // Docker
    const dockerResult = await this.executeCommand('docker --version')
    if (dockerResult.exitCode === 0) {
      tools.docker = dockerResult.stdout
      // Check if Docker is running
      const dockerPsResult = await this.executeCommand('docker ps')
      tools.dockerRunning = dockerPsResult.exitCode === 0
    }

    // Vercel CLI
    const vercelResult = await this.executeCommand('vercel --version')
    if (vercelResult.exitCode === 0) {
      tools.vercelCli = vercelResult.stdout
    }

    // GitHub CLI
    const ghResult = await this.executeCommand('gh --version')
    if (ghResult.exitCode === 0) {
      tools.githubCli = ghResult.stdout
    }

    return tools
  }

  /**
   * Verify repository root
   */
  async verifyRepositoryRoot(expectedPath: string): Promise<boolean> {
    const { stdout, exitCode } = await this.executeCommand('pwd')
    if (exitCode !== 0) {
      return false
    }
    // Normalize paths for comparison
    const normalizedCwd = stdout.replace(/\\/g, '/').toLowerCase()
    const normalizedExpected = expectedPath.replace(/\\/g, '/').toLowerCase()
    return normalizedCwd === normalizedExpected
  }
}
