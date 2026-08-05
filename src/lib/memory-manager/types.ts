/**
 * PingOS Memory Manager — Core Types
 *
 * Foundation schema for all memory objects in the PingOS ecosystem.
 * Designed for extensibility: new memory types, categories, and fields
 * can be added without breaking existing consumers.
 *
 * Phase 1: Foundation only — no retrieval, embeddings, or auto-learning.
 */

// ============================================================================
// MEMORY CATEGORIES
// ============================================================================

/**
 * Top-level memory categories that route memories to the correct
 * storage and retrieval subsystems.
 *
 * Extensible: add new categories here and in MemoryCategoryRegistry.
 */
export enum MemoryCategory {
  /** Core identity and persona memories — who Ping is, who Gabriel is. */
  Identity = 'identity',

  /** Project-specific memories — ASCYN PRO, features, architecture. */
  Project = 'project',

  /** Engineering memories — technical decisions, patterns, code standards. */
  Engineering = 'engineering',

  /** Decision memories — why choices were made, alternatives considered. */
  Decision = 'decision',

  /** Workspace memories — file locations, tool configs, environment state. */
  Workspace = 'workspace',

  /** Archive memories — historical, superseded, or reference-only content. */
  Archive = 'archive',
}

// ============================================================================
// MEMORY TYPES
// ============================================================================

/**
 * Specific memory types within each category. Types provide finer-grained
 * classification for routing and retrieval.
 *
 * Extensible: add new types here and in MemoryTypeRegistry.
 */
export enum MemoryType {
  // Identity types
  Persona = 'persona',
  UserProfile = 'user_profile',
  Relationship = 'relationship',
  Preference = 'preference',

  // Project types
  ProjectOverview = 'project_overview',
  FeatureSpec = 'feature_spec',
  ArchitectureDecision = 'architecture_decision',
  Milestone = 'milestone',

  // Engineering types
  CodePattern = 'code_pattern',
  BugFix = 'bug_fix',
  Refactor = 'refactor',
  PerformanceOptimization = 'performance_optimization',
  SecurityHardening = 'security_hardening',

  // Decision types
  StrategicDecision = 'strategic_decision',
  TacticalDecision = 'tactical_decision',
  TradeoffAnalysis = 'tradeoff_analysis',

  // Workspace types
  FileLocation = 'file_location',
  ToolConfig = 'tool_config',
  EnvironmentState = 'environment_state',
  Dependency = 'dependency',

  // Archive types
  HistoricalRecord = 'historical_record',
  SupersededSpec = 'superseded_spec',
  ReferenceMaterial = 'reference_material',
}

// ============================================================================
// CONFIDENCE LEVELS
// ============================================================================

/**
 * Confidence level for memory accuracy and reliability.
 * Used for prioritization and retrieval ranking.
 */
export enum ConfidenceLevel {
  /** Directly verified — file exists, was read, or was executed. */
  High = 'high',

  /** Indirectly verified — file exists but not fully inspected. */
  Medium = 'medium',

  /** Circumstantial — based on historical docs or inference. */
  Low = 'low',

  /** Unverified — not yet checked. */
  Unverified = 'unverified',
}

// ============================================================================
// MEMORY SOURCE
// ============================================================================

/**
 * Where the memory originated. Used for traceability and audit.
 */
export interface MemorySource {
  /** System or component that created the memory. */
  origin: string

  /** Specific file, conversation, or event that generated it. */
  reference?: string

  /** Human-readable description of the source. */
  description?: string
}

// ============================================================================
// MEMORY OBJECT
// ============================================================================

/**
 * Core memory object — the atomic unit of the PingOS Memory Manager.
 *
 * All memories, regardless of category or type, conform to this schema.
 * Additional fields can be added via the `metadata` record for
 * category-specific or type-specific extensions.
 */
export interface Memory {
  /** Unique identifier (UUID or ULID recommended). */
  id: string

  /** Human-readable title for display and search. */
  title: string

  /** Specific memory type within its category. */
  type: MemoryType

  /** Top-level category for routing and storage. */
  category: MemoryCategory

  /** Free-form tags for cross-cutting concerns and filtering. */
  tags: string[]

  /** ISO 8601 timestamp of creation. */
  createdAt: string

  /** ISO 8601 timestamp of last update. */
  updatedAt: string

  /** Confidence in the accuracy of this memory. */
  confidence: ConfidenceLevel

  /** Whether this memory has been explicitly verified. */
  verified: boolean

  /** Source of this memory for traceability. */
  source: MemorySource

  /** Free-form content — the actual memory payload. */
  content: string

  /** Extensible metadata for category-specific or type-specific fields. */
  metadata?: Record<string, unknown>
}

// ============================================================================
// MEMORY INPUT (for creation)
// ============================================================================

/**
 * Input shape for creating a new memory. Omits auto-generated fields
 * and provides sensible defaults where possible.
 */
export interface CreateMemoryInput {
  title: string
  type: MemoryType
  category: MemoryCategory
  tags?: string[]
  confidence?: ConfidenceLevel
  verified?: boolean
  source: MemorySource
  content: string
  metadata?: Record<string, unknown>
}

/**
 * Input shape for updating an existing memory. All fields optional
 * except the ID.
 */
export interface UpdateMemoryInput {
  id: string
  title?: string
  type?: MemoryType
  category?: MemoryCategory
  tags?: string[]
  confidence?: ConfidenceLevel
  verified?: boolean
  source?: MemorySource
  content?: string
  metadata?: Record<string, unknown>
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a value is a valid MemoryCategory.
 */
export function isMemoryCategory(value: unknown): value is MemoryCategory {
  return Object.values(MemoryCategory).includes(value as MemoryCategory)
}

/**
 * Type guard to check if a value is a valid MemoryType.
 */
export function isMemoryType(value: unknown): value is MemoryType {
  return Object.values(MemoryType).includes(value as MemoryType)
}

/**
 * Type guard to check if a value is a valid ConfidenceLevel.
 */
export function isConfidenceLevel(value: unknown): value is ConfidenceLevel {
  return Object.values(ConfidenceLevel).includes(value as ConfidenceLevel)
}
