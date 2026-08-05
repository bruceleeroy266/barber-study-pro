/**
 * Task Planner — Task Classification Engine
 *
 * Deterministic engine that classifies the type of work described by an
 * ExecutionAssessment using keyword matching against the task description.
 *
 * The engine:
 * - uses ONLY information already available in the ExecutionAssessment.
 * - does NOT inspect repositories, parse code, or analyze files.
 * - is deterministic — the same assessment always produces the same
 *   classification.
 *
 * Milestone 1.5.1: classification only.
 */

import { ExecutionAssessment } from '../execution-budget/execution-assessment'
import {
  TaskClassification,
  TaskType,
} from './task-classification'

// ============================================================================
// CLASSIFICATION RULE
// ============================================================================

/**
 * A deterministic classification rule based on keyword matching.
 */
interface ClassificationRule {
  /** Stable identifier for the rule. */
  readonly id: string

  /** The task type this rule assigns. */
  readonly taskType: TaskType

  /** Keywords that trigger this rule (case-insensitive). */
  readonly keywords: readonly string[]

  /** Human-readable description of the rule. */
  readonly description: string
}

// ============================================================================
// DEFAULT CLASSIFICATION RULES
// ============================================================================

/**
 * Centralized default classification rules, evaluated in order.
 * The first matching rule wins.
 */
const DEFAULT_CLASSIFICATION_RULES: readonly ClassificationRule[] = [
  {
    id: 'bug-fix',
    taskType: TaskType.BugFix,
    keywords: ['bug', 'fix'],
    description: 'Task description contains bug or fix keywords.',
  },
  {
    id: 'test',
    taskType: TaskType.Test,
    keywords: ['test', 'unit'],
    description: 'Task description contains test or unit keywords.',
  },
  {
    id: 'documentation',
    taskType: TaskType.Documentation,
    keywords: ['document', 'readme'],
    description: 'Task description contains document or readme keywords.',
  },
  {
    id: 'database',
    taskType: TaskType.Database,
    keywords: ['migration', 'database'],
    description: 'Task description contains migration or database keywords.',
  },
  {
    id: 'deployment',
    taskType: TaskType.Deployment,
    keywords: ['deploy', 'release'],
    description: 'Task description contains deploy or release keywords.',
  },
  {
    id: 'configuration',
    taskType: TaskType.Configuration,
    keywords: ['config', 'environment'],
    description: 'Task description contains config or environment keywords.',
  },
  {
    id: 'refactor',
    taskType: TaskType.Refactor,
    keywords: ['refactor', 'cleanup'],
    description: 'Task description contains refactor or cleanup keywords.',
  },
]

// ============================================================================
// TASK CLASSIFICATION ENGINE
// ============================================================================

export class TaskClassificationEngine {
  private readonly rules: readonly ClassificationRule[]

  /**
   * @param rules - The classification rules to evaluate, in order.
   *   Defaults to DEFAULT_CLASSIFICATION_RULES. Injected for testability.
   */
  constructor(rules: readonly ClassificationRule[] = DEFAULT_CLASSIFICATION_RULES) {
    this.rules = rules
  }

  /**
   * Classifies the task described by the given assessment.
   *
   * @param assessment - The execution assessment to classify.
   * @returns An immutable TaskClassification result.
   */
  classify(assessment: ExecutionAssessment): TaskClassification {
    const description = assessment.complexityReport.metadata.taskDescription.toLowerCase()

    for (const rule of this.rules) {
      const matchedKeywords = rule.keywords.filter((keyword) =>
        description.includes(keyword.toLowerCase())
      )

      if (matchedKeywords.length > 0) {
        return {
          taskType: rule.taskType,
          confidence: this.calculateConfidence(matchedKeywords.length, rule.keywords.length),
          matchedRules: [
            {
              ruleId: rule.id,
              matchedKeywords,
            },
          ],
          rationale: this.buildRationale(rule, matchedKeywords),
          metadata: {
            engineVersion: 'task-classification-engine@1.5.1',
          },
        }
      }
    }

    // No rule matched
    return {
      taskType: TaskType.Unknown,
      confidence: 0,
      matchedRules: [],
      rationale: 'No classification rules matched the task description.',
      metadata: {
        engineVersion: 'task-classification-engine@1.5.1',
      },
    }
  }

  /**
   * Calculates confidence based on keyword match ratio.
   */
  private calculateConfidence(matchedCount: number, totalKeywords: number): number {
    if (totalKeywords === 0) return 0
    return Math.round((matchedCount / totalKeywords) * 100)
  }

  /**
   * Builds a human-readable rationale for the classification.
   */
  private buildRationale(rule: ClassificationRule, matchedKeywords: readonly string[]): string {
    return (
      `Classified as ${rule.taskType}: ${rule.description} ` +
      `Matched keywords: ${matchedKeywords.join(', ')}.`
    )
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default classification engine using default rules. Stateless and safe to share.
 */
export const taskClassificationEngine = new TaskClassificationEngine()
