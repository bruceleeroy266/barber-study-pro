/**
 * Task Planner — Test Fixtures
 *
 * Deterministic test data for unit tests. No filesystem, no network, no AI.
 */

import { ComplexityLevel } from '../../../src/lib/complexity-model/complexity-level'
import { ComplexityReport } from '../../../src/lib/complexity-model/complexity-report'
import { ConfidenceLevel } from '../../../src/lib/complexity-model/complexity-confidence'
import { ExecutionBudgetEvaluation, BudgetCategory } from '../../../src/lib/execution-budget/execution-budget-evaluator'
import { BudgetDecision, BudgetDecisionType } from '../../../src/lib/execution-budget/budget-decision'
import { ExecutionReadiness, ExecutionReadinessStatus } from '../../../src/lib/execution-budget/execution-readiness'
import { TaskPlannerRequest } from '../../../src/lib/task-planner/task-planner-request'

// ============================================================================
// FIXTURES
// ============================================================================

export const mockComplexityReport: ComplexityReport = {
  level: ComplexityLevel.Medium,
  totalScore: 50,
  breakdown: [],
  estimatedFileCount: 5,
  estimatedRuntime: 60,
  confidence: {
    score: 80,
    level: ConfidenceLevel.High,
    explanations: ['Test confidence'],
    assumptions: [],
    missingInformation: [],
  },
  metadata: {
    taskDescription: 'Test task',
    repositoryIndexed: false,
    generatedAt: '2026-07-29T00:00:00.000Z',
    calculatorVersion: '1.0.0',
  },
}

export const mockBudgetEvaluation: ExecutionBudgetEvaluation = {
  passed: true,
  violations: [],
  remainingCapacity: {
    [BudgetCategory.Files]: 5,
    [BudgetCategory.EstimatedRuntime]: 60,
    [BudgetCategory.ComplexityScore]: 50,
    [BudgetCategory.ConfidenceScore]: 20,
  },
}

export const mockBudgetDecision: BudgetDecision = {
  decision: BudgetDecisionType.Allow,
  explanation: 'Test decision',
  triggeredViolations: [],
  evaluationSummary: {
    passed: true,
    violationCount: 0,
  },
}

export const mockExecutionReadiness: ExecutionReadiness = {
  status: ExecutionReadinessStatus.Ready,
  requirements: [],
  failedRequirements: [],
  summary: 'Test readiness',
}

export const mockTaskPlannerRequest: TaskPlannerRequest = {
  taskDescription: 'Implement user authentication\nwith OAuth2 support',
  complexityReport: mockComplexityReport,
  budgetEvaluation: mockBudgetEvaluation,
  budgetDecision: mockBudgetDecision,
  executionReadiness: mockExecutionReadiness,
  metadata: {
    testFixture: true,
  },
}

export const mockTaskPlannerRequestSingleLine: TaskPlannerRequest = {
  ...mockTaskPlannerRequest,
  taskDescription: 'Fix login bug',
}
