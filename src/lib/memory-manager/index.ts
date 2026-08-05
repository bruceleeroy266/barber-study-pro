/**
 * PingOS Memory Manager — Public API
 *
 * Re-exports all public types, classes, and functions for convenient importing.
 *
 * Usage:
 *   import { MemoryManager, Memory, MemoryCategory, MemoryType } from '@/lib/memory-manager'
 */

// Types
export type {
  Memory,
  MemorySource,
  CreateMemoryInput,
  UpdateMemoryInput,
} from './types'

export {
  MemoryCategory,
  MemoryType,
  ConfidenceLevel,
  isMemoryCategory,
  isMemoryType,
  isConfidenceLevel,
} from './types'

// Categories
export type {
  CategoryDefinition,
} from './categories'

export {
  CategoryRegistry,
  TypeToCategoryMap,
  getTypesForCategory,
  getCategoryForType,
  getActiveCategories,
  getCategoryDefinition,
} from './categories'

// Classifier
export type {
  ClassificationResult,
} from './classifier'

export {
  classifyMemory,
  classifyMemories,
  validateTypeCategoryConsistency,
} from './classifier'

// Manager
export { MemoryManager, memoryManager } from './manager'
export type { CreateMemoryResult, MemoryManagerOptions, AdmissionMetadata } from './manager'

// Memory Lookup Interface
export type { MemoryLookup } from './memory-lookup'
export { isMemoryLookup } from './memory-lookup'

// Memory Store Abstraction
export type { MemoryStore } from './memory-store'
export { InMemoryStore } from './in-memory-store'

// ID Generation Strategy
export type { IdGenerator } from './id-generator'
export { SequentialIdGenerator, UuidIdGenerator } from './id-generator'

// Retrieval Engine
export type {
  RetrievalQuery,
  RetrievalResult,
} from './retrieval-types'

export {
  SortOption,
  RetrievalQueryError,
  validateRetrievalQuery,
} from './retrieval-types'

export { RetrievalEngine, retrievalEngine } from './retrieval-engine'

// Admission Controller
export type {
  AdmissionResult,
  AdmissionRule,
  AdmissionContext,
  AdmissionConfig,
} from './admission-types'

export {
  AdmissionDecision,
  Priority,
  DEFAULT_ADMISSION_CONFIG,
} from './admission-types'

export {
  requiredFieldsRule,
  schemaValidationRule,
  createSizeLimitsRule,
  transientContentRule,
  createDuplicateDetectionRule,
  createTypeCategoryConsistencyRule,
  createConfidenceThresholdRule,
  priorityAssignmentRule,
  getDefaultRules,
} from './admission-rules'

export { AdmissionController, createAdmissionController } from './admission-controller'
