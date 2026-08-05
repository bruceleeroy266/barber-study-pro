/**
 * Task Planner — Planning Template Engine
 *
 * Deterministic engine that maps a PlanningStrategyRecommendation to a
 * PlanningTemplate via a centralized lookup table. No branching, no AI, no
 * repository inspection.
 *
 * The engine:
 * - does NOT execute templates or change planning behavior.
 * - is deterministic — the same strategy always produces the same template.
 *
 * Milestone 5.1.1: template selection only.
 */

import { PlanningStrategy, PlanningStrategyRecommendation } from './planning-strategy'
import { PlanningTemplate } from './planning-template'

// ============================================================================
// TEMPLATE DEFINITION
// ============================================================================

/**
 * A registered planning template.
 */
interface TemplateDefinition {
  readonly templateId: string
  readonly templateName: string
  readonly templateVersion: string
}

// ============================================================================
// TEMPLATE MAPPING TABLE
// ============================================================================

/**
 * Centralized mapping from PlanningStrategy to template definition.
 * Single source of truth — no branching beyond this table.
 */
const STRATEGY_TO_TEMPLATE: Readonly<Record<PlanningStrategy, TemplateDefinition>> = {
  [PlanningStrategy.Generic]: {
    templateId: 'generic-template',
    templateName: 'Generic Planning Template',
    templateVersion: '1.0.0',
  },
  [PlanningStrategy.CodeChange]: {
    templateId: 'code-change-template',
    templateName: 'Code Change Planning Template',
    templateVersion: '1.0.0',
  },
  [PlanningStrategy.BugFix]: {
    templateId: 'bug-fix-template',
    templateName: 'Bug Fix Planning Template',
    templateVersion: '1.0.0',
  },
  [PlanningStrategy.Refactor]: {
    templateId: 'refactor-template',
    templateName: 'Refactor Planning Template',
    templateVersion: '1.0.0',
  },
  [PlanningStrategy.Testing]: {
    templateId: 'testing-template',
    templateName: 'Testing Planning Template',
    templateVersion: '1.0.0',
  },
  [PlanningStrategy.Documentation]: {
    templateId: 'documentation-template',
    templateName: 'Documentation Planning Template',
    templateVersion: '1.0.0',
  },
  [PlanningStrategy.Configuration]: {
    templateId: 'configuration-template',
    templateName: 'Configuration Planning Template',
    templateVersion: '1.0.0',
  },
  [PlanningStrategy.Database]: {
    templateId: 'database-template',
    templateName: 'Database Planning Template',
    templateVersion: '1.0.0',
  },
  [PlanningStrategy.Deployment]: {
    templateId: 'deployment-template',
    templateName: 'Deployment Planning Template',
    templateVersion: '1.0.0',
  },
}

// ============================================================================
// PLANNING TEMPLATE ENGINE
// ============================================================================

export class PlanningTemplateEngine {
  /**
   * Selects a planning template from the given strategy recommendation.
   *
   * @param recommendation - The planning strategy recommendation to map.
   * @returns An immutable PlanningTemplate.
   */
  select(recommendation: PlanningStrategyRecommendation): PlanningTemplate {
    const template = STRATEGY_TO_TEMPLATE[recommendation.strategy]

    return {
      templateId: template.templateId,
      templateName: template.templateName,
      planningStrategy: recommendation.strategy,
      templateVersion: template.templateVersion,
      rationale:
        `Planning strategy ${recommendation.strategy} maps to ` +
        `template ${template.templateId} (v${template.templateVersion}).`,
      metadata: {
        engineVersion: 'planning-template-engine@5.1.1',
      },
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default template engine instance. Stateless and safe to share.
 */
export const planningTemplateEngine = new PlanningTemplateEngine()
