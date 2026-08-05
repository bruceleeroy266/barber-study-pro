/**
 * PingOS Bootstrap Runner — Core Types
 *
 * Defines the types for the BootstrapRunner system.
 * These types align with the PingOS documentation in docs/ping/.
 */

// ============================================================================
// BOOTSTRAP PHASES
// ============================================================================

/**
 * Bootstrap phases as defined in BOOTSTRAP_PROTOCOL.md
 */
export enum BootstrapPhase {
  IDENTITY_RECOVERY = 'identity_recovery',
  REPOSITORY_RECOVERY = 'repository_recovery',
  ENVIRONMENT_VERIFICATION = 'environment_verification',
  SESSION_RECOVERY = 'session_recovery',
  TASK_INITIALIZATION = 'task_initialization',
  SUCCESS_CRITERIA = 'success_criteria',
}

// ============================================================================
// BOOTSTRAP STEP STATUS
// ============================================================================

/**
 * Status of a single bootstrap step
 */
export enum StepStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
}

// ============================================================================
// BOOTSTRAP STEP
// ============================================================================

/**
 * A single step in the bootstrap process
 */
export interface BootstrapStep {
  /** Unique identifier for the step */
  id: string
  /** Human-readable name */
  name: string
  /** Phase this step belongs to */
  phase: BootstrapPhase
  /** Current status */
  status: StepStatus
  /** Error message if failed */
  error?: string
  /** Evidence/data collected during execution */
  evidence?: Record<string, unknown>
  /** Timestamp when step started */
  startedAt?: Date
  /** Timestamp when step completed */
  completedAt?: Date
}

// ============================================================================
// BOOTSTRAP RESULT
// ============================================================================

/**
 * Result of a bootstrap execution
 */
export interface BootstrapResult {
  /** Overall success status */
  success: boolean
  /** Current phase when bootstrap completed or failed */
  currentPhase: BootstrapPhase
  /** All steps executed */
  steps: BootstrapStep[]
  /** Failed step (if any) */
  failedStep?: BootstrapStep
  /** Timestamp when bootstrap started */
  startedAt: Date
  /** Timestamp when bootstrap completed */
  completedAt?: Date
  /** Duration in milliseconds */
  durationMs?: number
  /** Bootstrap report data */
  report?: BootstrapReportData
}

// ============================================================================
// BOOTSTRAP REPORT DATA
// ============================================================================

/**
 * Data for the Bootstrap Report as defined in BOOTSTRAP_REPORT_TEMPLATE.md
 */
export interface BootstrapReportData {
  /** Timestamp of the report */
  timestamp: Date
  /** Session ID */
  sessionId: string
  /** Operating mode */
  operatingMode: OperatingMode
  /** Identity recovery data */
  identity: IdentityData
  /** Repository recovery data */
  repository: RepositoryData
  /** Environment verification data */
  environment: EnvironmentData
  /** Session recovery data */
  session: SessionData
  /** Task initialization data */
  task: TaskData
  /** Overall confidence level */
  confidence: ConfidenceLevel
  /** Ready to execute */
  ready: boolean
  /** Risks identified */
  risks: Risk[]
  /** Recommendations */
  recommendations: string[]
}

// ============================================================================
// IDENTITY DATA
// ============================================================================

export interface IdentityData {
  /** Ping identity confirmed */
  pingIdentity: boolean
  /** Engineering principles confirmed */
  engineeringPrinciples: boolean
  /** Operating mode identified */
  operatingMode: OperatingMode
}

// ============================================================================
// OPERATING MODE
// ============================================================================

export enum OperatingMode {
  DEVELOPMENT = 'development',
  AUDIT = 'audit',
  PLANNING = 'planning',
  DOCUMENTATION = 'documentation',
  RECOVERY = 'recovery',
  MAINTENANCE = 'maintenance',
}

// ============================================================================
// REPOSITORY DATA
// ============================================================================

export interface RepositoryData {
  /** Documents read */
  documentsRead: string[]
  /** Memory files read */
  memoryFilesRead: string[]
  /** Current state summary */
  currentState?: string
  /** Recent work summary */
  recentWork?: string
  /** Next steps summary */
  nextSteps?: string
  /** Number of open issues */
  openIssues: number
}

// ============================================================================
// ENVIRONMENT DATA
// ============================================================================

export interface EnvironmentData {
  /** Repository root path */
  repositoryRoot: string
  /** Repository root verified */
  repositoryRootVerified: boolean
  /** Git status */
  git: GitStatus
  /** Node.js version */
  nodeVersion: string
  /** Node.js version verified */
  nodeVersionVerified: boolean
  /** npm version */
  npmVersion: string
  /** npm version verified */
  npmVersionVerified: boolean
  /** Build state */
  build: BuildState
  /** Optional tools */
  optionalTools: OptionalTools
}

// ============================================================================
// GIT STATUS
// ============================================================================

export interface GitStatus {
  /** Current branch */
  branch: string
  /** Number of modified files */
  modifiedFiles: number
  /** Number of untracked files */
  untrackedFiles: number
  /** Number of staged files */
  stagedFiles: number
  /** Merge conflicts present */
  mergeConflicts: boolean
  /** Git status verified */
  verified: boolean
}

// ============================================================================
// BUILD STATE
// ============================================================================

export interface BuildState {
  /** Build passed */
  buildPassed: boolean
  /** Build exit code */
  buildExitCode?: number
  /** Lint passed */
  lintPassed: boolean
  /** Lint exit code */
  lintExitCode?: number
  /** Lint error count */
  lintErrorCount?: number
  /** Lint warning count */
  lintWarningCount?: number
  /** TypeScript passed */
  typescriptPassed: boolean
  /** TypeScript exit code */
  typescriptExitCode?: number
  /** Build state verified */
  verified: boolean
}

// ============================================================================
// OPTIONAL TOOLS
// ============================================================================

export interface OptionalTools {
  /** Supabase CLI version */
  supabaseCli?: string
  /** Docker version */
  docker?: string
  /** Docker running */
  dockerRunning?: boolean
  /** Vercel CLI version */
  vercelCli?: string
  /** GitHub CLI version */
  githubCli?: string
}

// ============================================================================
// SESSION DATA
// ============================================================================

export interface SessionData {
  /** Uncommitted changes detected */
  uncommittedChanges: boolean
  /** Modified files list */
  modifiedFiles: string[]
  /** Decision on uncommitted changes */
  uncommittedChangesDecision?: string
  /** Checkpoints detected */
  checkpointsDetected: boolean
  /** Checkpoint files */
  checkpointFiles: string[]
  /** Interrupted tasks detected */
  interruptedTasksDetected: boolean
  /** Interrupted tasks */
  interruptedTasks: string[]
  /** Pending TODOs detected */
  pendingTodosDetected: boolean
  /** Pending TODOs */
  pendingTodos: string[]
}

// ============================================================================
// TASK DATA
// ============================================================================

export interface TaskData {
  /** Task type */
  taskType: TaskType
  /** Complexity */
  complexity: Complexity
  /** Estimated time */
  estimatedTime: string
  /** Should be divided */
  shouldBeDivided: boolean
  /** Division strategy */
  divisionStrategy?: DivisionStrategy
  /** Subtasks */
  subtasks: string[]
  /** Execution plan */
  executionPlan?: ExecutionPlan
}

// ============================================================================
// TASK TYPE
// ============================================================================

export enum TaskType {
  FEATURE = 'feature',
  BUG_FIX = 'bug_fix',
  REFACTOR = 'refactor',
  DOCUMENTATION = 'documentation',
  CONTENT = 'content',
  AUDIT = 'audit',
  MAINTENANCE = 'maintenance',
  INFRASTRUCTURE = 'infrastructure',
  PLANNING = 'planning',
  RESEARCH = 'research',
  DEVELOPMENT = 'development',
}

// ============================================================================
// COMPLEXITY
// ============================================================================

export enum Complexity {
  TRIVIAL = 'trivial',
  SIMPLE = 'simple',
  MODERATE = 'moderate',
  COMPLEX = 'complex',
  VERY_COMPLEX = 'very_complex',
}

// ============================================================================
// DIVISION STRATEGY
// ============================================================================

export enum DivisionStrategy {
  BY_PHASE = 'by_phase',
  BY_COMPONENT = 'by_component',
  BY_DELIVERABLE = 'by_deliverable',
  BY_RISK = 'by_risk',
}

// ============================================================================
// EXECUTION PLAN
// ============================================================================

export interface ExecutionPlan {
  /** Task name */
  taskName: string
  /** Task type */
  taskType: TaskType
  /** Complexity */
  complexity: Complexity
  /** Estimated time */
  estimatedTime: string
  /** Steps */
  steps: ExecutionStep[]
  /** Success criteria */
  successCriteria: string[]
  /** Risks */
  risks: Risk[]
  /** Dependencies */
  dependencies: string[]
}

// ============================================================================
// EXECUTION STEP
// ============================================================================

export interface ExecutionStep {
  /** Step name */
  name: string
  /** Description */
  description: string
  /** Estimated time */
  estimatedTime: string
  /** Sub-steps */
  subSteps: string[]
  /** Verification method */
  verification: string
}

// ============================================================================
// RISK
// ============================================================================

export interface Risk {
  /** Risk description */
  description: string
  /** Impact */
  impact: string
  /** Mitigation */
  mitigation: string
}

// ============================================================================
// CONFIDENCE LEVEL
// ============================================================================

export enum ConfidenceLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}
