# PingOS Memory Manager — Phase 1 + 2 + 3

## Overview

The PingOS Memory Manager is the central entry point for all memory operations in the ASCYN PRO ecosystem. It provides a unified schema, classification system, management API, retrieval engine, and admission controller for storing, organizing, finding, and gating memories across six categories.

**Phase 1 Scope:** Foundation — schema, classification, CRUD.
**Phase 2 Scope:** Retrieval Engine — filtering, sorting, pagination.
**Phase 3 Scope:** Admission Controller — memory gating, priority assignment, duplicate detection. No persistence, embeddings, vector search, or automatic learning.

## Architecture

```
src/lib/memory-manager/
├── types.ts                  # Core schema: Memory, MemoryCategory, MemoryType, ConfidenceLevel
├── categories.ts             # Category registry and type-to-category mapping
├── classifier.ts             # Rule-based classification and routing
├── manager.ts                # MemoryManager class — CRUD + classification API
├── retrieval-types.ts        # RetrievalQuery, RetrievalResult, SortOption, validation
├── retrieval-engine.ts       # RetrievalEngine class — filter, sort, paginate
├── admission-types.ts        # AdmissionDecision, Priority, AdmissionResult, AdmissionRule, config
├── admission-rules.ts        # Built-in admission rules (8 rules)
├── admission-controller.ts   # AdmissionController class — single gateway for memory admission
├── index.ts                  # Public API re-exports
├── retrieval-engine.test.ts      # Retrieval unit tests (53 tests)
├── admission-controller.test.ts  # Admission unit tests (64 tests)
└── README.md                 # This file
```

## Core Concepts

### Memory Object

The atomic unit of the system. Every memory conforms to the `Memory` interface:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `title` | `string` | Human-readable title |
| `type` | `MemoryType` | Specific type within a category |
| `category` | `MemoryCategory` | Top-level routing category |
| `tags` | `string[]` | Free-form tags for filtering |
| `createdAt` | `string` | ISO 8601 creation timestamp |
| `updatedAt` | `string` | ISO 8601 last-update timestamp |
| `confidence` | `ConfidenceLevel` | Accuracy confidence (high/medium/low/unverified) |
| `verified` | `boolean` | Explicitly verified flag |
| `source` | `MemorySource` | Origin and reference for traceability |
| `content` | `string` | The actual memory payload |
| `metadata` | `Record<string, unknown>` | Extensible category-specific fields |

### Memory Categories

Six top-level categories route memories to the correct subsystem:

| Category | Purpose | Example Types |
|----------|---------|---------------|
| **Identity** | Who Ping is, who Gabriel is | `persona`, `user_profile`, `preference` |
| **Project** | ASCYN PRO features and architecture | `project_overview`, `feature_spec`, `milestone` |
| **Engineering** | Technical decisions and code patterns | `code_pattern`, `bug_fix`, `security_hardening` |
| **Decision** | Strategic and tactical choices | `strategic_decision`, `tradeoff_analysis` |
| **Workspace** | File locations, tool configs, environment | `file_location`, `tool_config`, `dependency` |
| **Archive** | Historical and reference material | `historical_record`, `superseded_spec` |

### Memory Types

Fine-grained types within each category. The `TypeToCategoryMap` in `categories.ts` defines the canonical mapping. New types can be added by:

1. Adding the type to `MemoryType` enum in `types.ts`
2. Adding the mapping to `TypeToCategoryMap` in `categories.ts`
3. Optionally adding heuristic keywords to `classifier.ts`

### Classification

The classifier routes memories to categories using a priority-based rule system:

1. **Manual override** — explicit `category` field (confidence: 1.0)
2. **Type-based routing** — lookup from `TypeToCategoryMap` (confidence: 0.95)
3. **Tag-based heuristics** — keyword matching on tags (confidence: 0.7)
4. **Content-based heuristics** — keyword matching on title/content (confidence: 0.6)
5. **Fallback** — defaults to `Archive` (confidence: 0.1)

### Confidence Levels

| Level | Meaning | Use Case |
|-------|---------|----------|
| `high` | Directly verified | File exists and was read/executed |
| `medium` | Indirectly verified | File exists but not fully inspected |
| `low` | Circumstantial | Based on historical docs or inference |
| `unverified` | Not yet checked | Default for new memories |

## Retrieval Engine (Phase 2)

The RetrievalEngine is the single API responsible for finding memories. It accepts a `RetrievalQuery`, applies filters, sorts results, and paginates — all in a storage-agnostic way.

### Design Principles

- **Storage-agnostic** — Works with any `Memory[]` array; no coupling to storage backend
- **Stateless** — Each query is independent; no internal cache or state
- **Extensible** — New filters and sort options can be added without refactoring
- **Future-ready** — Semantic search, vector search, and knowledge graph capabilities will plug into this engine without major changes

### RetrievalQuery

All fields are optional. Omitted fields are not filtered on.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Filter by exact memory ID |
| `category` | `MemoryCategory` | Filter by memory category |
| `type` | `MemoryType` | Filter by memory type |
| `tags` | `string[]` | Filter by tags (AND logic — must have ALL tags) |
| `confidence` | `ConfidenceLevel` | Filter by exact confidence level |
| `minConfidence` | `ConfidenceLevel` | Filter by minimum confidence (inclusive) |
| `verified` | `boolean` | Filter by verified status |
| `sourceOrigin` | `string` | Filter by source origin (exact match) |
| `sourceReference` | `string` | Filter by source reference (exact match) |
| `createdAfter` | `string` | ISO 8601 — memories created on or after |
| `createdBefore` | `string` | ISO 8601 — memories created on or before |
| `updatedAfter` | `string` | ISO 8601 — memories updated on or after |
| `updatedBefore` | `string` | ISO 8601 — memories updated on or before |
| `priority` | `string` | Filter by `metadata.priority` value |
| `sort` | `SortOption` | Sort order (default: `NewestFirst`) |
| `limit` | `number` | Max results per page (default: 50, max: 1000) |
| `offset` | `number` | Number of results to skip (default: 0) |

### SortOption

| Option | Description |
|--------|-------------|
| `NewestFirst` | Most recently created first (default) |
| `OldestFirst` | Oldest created first |
| `HighestConfidence` | High → Medium → Low → Unverified |
| `AlphabeticalTitle` | A → Z by title |

### RetrievalResult

| Field | Type | Description |
|-------|------|-------------|
| `memories` | `Memory[]` | Matching memories (after filter, sort, pagination) |
| `totalResults` | `number` | Total matches before pagination |
| `appliedFilters` | `Partial<RetrievalQuery>` | Filters that were actually applied |
| `executionTimeMs` | `number` | Query execution time in milliseconds |
| `pagination` | `object` | Pagination metadata |
| `pagination.limit` | `number` | Applied limit |
| `pagination.offset` | `number` | Applied offset |
| `pagination.hasMore` | `boolean` | Whether more results exist |
| `pagination.totalPages` | `number` | Total pages with current limit |
| `pagination.currentPage` | `number` | Current page (1-indexed) |

### Retrieval Examples

```typescript
import {
  RetrievalEngine,
  SortOption,
  MemoryCategory,
  MemoryType,
  ConfidenceLevel,
} from '@/lib/memory-manager'

const engine = new RetrievalEngine()
const allMemories = manager.getAll() // or any Memory[] from any source

// ── Single Filter: by category ──
const projectMemories = engine.retrieve(allMemories, {
  category: MemoryCategory.Project,
})

// ── Single Filter: by tag ──
const supabaseMemories = engine.retrieve(allMemories, {
  tags: ['supabase'],
})

// ── Single Filter: verified only ──
const verifiedMemories = engine.retrieve(allMemories, {
  verified: true,
})

// ── Single Filter: by ID ──
const specific = engine.retrieve(allMemories, {
  id: 'mem_001',
})

// ── Single Filter: by date range ──
const recentMemories = engine.retrieve(allMemories, {
  createdAfter: '2026-07-01T00:00:00Z',
  createdBefore: '2026-07-31T23:59:59Z',
})

// ── Multi-Filter: project + supabase + verified + medium+ confidence ──
const filtered = engine.retrieve(allMemories, {
  category: MemoryCategory.Project,
  tags: ['supabase'],
  verified: true,
  minConfidence: ConfidenceLevel.Medium,
})

// ── Multi-Filter: engineering + security tag + high confidence ──
const securityPatterns = engine.retrieve(allMemories, {
  category: MemoryCategory.Engineering,
  tags: ['security'],
  confidence: ConfidenceLevel.High,
})

// ── Sorting: alphabetical ──
const alphabetical = engine.retrieve(allMemories, {
  sort: SortOption.AlphabeticalTitle,
})

// ── Sorting: highest confidence ──
const byConfidence = engine.retrieve(allMemories, {
  sort: SortOption.HighestConfidence,
})

// ── Pagination: first page ──
const page1 = engine.retrieve(allMemories, {
  limit: 20,
  offset: 0,
})
// page1.pagination.currentPage === 1
// page1.pagination.hasMore === true (if more than 20 results)

// ── Pagination: second page ──
const page2 = engine.retrieve(allMemories, {
  limit: 20,
  offset: 20,
})
// page2.pagination.currentPage === 2

// ── Combined: filters + sort + pagination ──
const combined = engine.retrieve(allMemories, {
  category: MemoryCategory.Engineering,
  verified: true,
  sort: SortOption.HighestConfidence,
  limit: 10,
  offset: 0,
})

// ── Filter by source ──
const codeReviewMemories = engine.retrieve(allMemories, {
  sourceOrigin: 'code-review',
})

// ── Filter by priority ──
const highPriority = engine.retrieve(allMemories, {
  priority: 'high',
})
```

### Error Handling

The engine validates all queries and throws `RetrievalQueryError` for invalid input:

```typescript
import { RetrievalQueryError } from '@/lib/memory-manager'

try {
  engine.retrieve(memories, { limit: -1 })
} catch (err) {
  if (err instanceof RetrievalQueryError) {
    console.error(`Invalid ${err.field}: ${err.value}`)
  }
}
```

Validation rules:
- `limit` must be a positive integer ≤ 1000
- `offset` must be a non-negative integer
- Date fields must be valid ISO 8601 strings
- `tags` must be an array of strings
- `sort` must be a valid `SortOption`

## Admission Controller (Phase 3)

The AdmissionController is the **single gateway** into PingOS memory. Every memory — manual, imported, AI-generated, or learned — must pass through this controller before being stored.

### Design Principles

- **Single entry point** — `admit(memory)` is the only public method
- **Modular rules** — New rules can be added without modifying existing logic
- **Configurable** — Limits, thresholds, and rule behavior are customizable
- **Audit trail** — Every decision includes the triggered rule and reasoning

### Admission Lifecycle

```
CreateMemoryInput
       │
       ▼
┌──────────────┐
│  Rule 1:     │  Required fields present?
│  required-   │  → Reject if missing
│  fields      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Rule 2:     │  Valid type & category?
│  schema-     │  → Reject if invalid
│  validation  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Rule 3:     │  Within size limits?
│  size-       │  → Reject if exceeded
│  limits      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Rule 4:     │  Transient/debug content?
│  transient-  │  → Reject or ArchiveImmediately
│  content     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Rule 5:     │  Duplicate of existing?
│  duplicate-  │  → Reject if duplicate
│  detection   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Rule 6:     │  Type/category consistent?
│  type-       │  → Warn or Reject (configurable)
│  category-   │
│  consistency │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Rule 7:     │  Meets confidence threshold?
│  confidence- │  → Reject if below minimum
│  threshold   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Rule 8:     │  Assign priority level
│  priority-   │  → Accept with P0-P4
│  assignment  │
└──────┬───────┘
       │
       ▼
  AdmissionResult
  (decision, priority, reason, warnings, normalizedMemory, triggeredRule)
```

### Priority Levels

| Priority | Name | Description | Retention |
|----------|------|-------------|-----------|
| **P0** | Permanent | Identity, mission, engineering principles | Never expire |
| **P1** | Long-term | Architecture, project decisions | Retain indefinitely |
| **P2** | Important | Engineering solutions, verified bugs | Extended period |
| **P3** | Temporary | Workspace, current sprint, active tasks | Short period |
| **P4** | Ephemeral | Debug output, logs, transient notes | Brief or discard |

### AdmissionDecision

| Decision | Meaning |
|----------|---------|
| `Accept` | Memory is accepted and should be stored |
| `Reject` | Memory is rejected and should NOT be stored |
| `ArchiveImmediately` | Memory is accepted but archived immediately (low long-term value) |

### AdmissionResult

| Field | Type | Description |
|-------|------|-------------|
| `decision` | `AdmissionDecision` | The admission decision |
| `priority` | `Priority` | Assigned priority (P0-P4) |
| `reason` | `string` | Human-readable explanation |
| `warnings` | `string[]` | Non-fatal issues detected |
| `normalizedMemory` | `CreateMemoryInput` | Normalized memory (if modified) |
| `triggeredRule` | `string` | Rule that triggered the decision |

### Rule Architecture

Rules are evaluated in order. The first rule that returns a non-undefined result short-circuits the pipeline.

| Order | Rule | Purpose | Decision |
|-------|------|---------|----------|
| 1 | `required-fields` | Validates required fields | Reject |
| 2 | `schema-validation` | Validates type/category enums | Reject |
| 3 | `size-limits` | Validates title/content/tags length | Reject |
| 4 | `transient-content` | Detects debug/logs/timestamps | Reject or Archive |
| 5 | `duplicate-detection` | Detects duplicates | Reject |
| 6 | `type-category-consistency` | Checks type→category mapping | Warn or Reject |
| 7 | `confidence-threshold` | Checks minimum confidence | Reject |
| 8 | `priority-assignment` | Assigns priority level | Accept or Archive |

### Admission Examples

```typescript
import {
  AdmissionController,
  AdmissionDecision,
  Priority,
  MemoryManager,
  MemoryType,
  MemoryCategory,
  ConfidenceLevel,
} from '@/lib/memory-manager'

const manager = new MemoryManager()
const controller = new AdmissionController(manager)

// ── Basic admission ──
const result = controller.admit({
  title: 'RBAC permissions pattern',
  type: MemoryType.CodePattern,
  category: MemoryCategory.Engineering,
  tags: ['security', 'rbac'],
  confidence: ConfidenceLevel.High,
  verified: true,
  source: { origin: 'code-review', reference: 'src/lib/security/permissions.ts' },
  content: 'All permissions are centralized in permissions.ts...',
})

if (result.decision === AdmissionDecision.Accept) {
  const memory = manager.create(result.normalizedMemory!)
  console.log(`Stored with priority: ${result.priority}`) // P2
}

// ── Rejected: empty title ──
const rejected = controller.admit({
  title: '',
  type: MemoryType.CodePattern,
  category: MemoryCategory.Engineering,
  source: { origin: 'test' },
  content: 'Some content',
})
// rejected.decision === AdmissionDecision.Reject
// rejected.reason === 'Missing or empty required fields: title is required...'
// rejected.triggeredRule === 'required-fields'

// ── Rejected: console log ──
const debugOutput = controller.admit({
  title: 'Debug session',
  type: MemoryType.CodePattern,
  category: MemoryCategory.Engineering,
  source: { origin: 'debug' },
  content: 'console.log("debug info"); console.error("stack");',
})
// debugOutput.decision === AdmissionDecision.Reject
// debugOutput.triggeredRule === 'transient-content'

// ── Rejected: duplicate ──
manager.create({
  title: 'Auth Pattern',
  type: MemoryType.CodePattern,
  category: MemoryCategory.Engineering,
  source: { origin: 'code-review', reference: 'src/lib/auth.ts' },
  content: 'Use JWT for stateless auth...',
})

const duplicate = controller.admit({
  title: 'Auth Pattern',
  type: MemoryType.CodePattern,
  category: MemoryCategory.Engineering,
  source: { origin: 'code-review', reference: 'src/lib/auth.ts' },
  content: 'Use JWT for stateless auth...',
})
// duplicate.decision === AdmissionDecision.Reject
// duplicate.triggeredRule === 'duplicate-detection'

// ── Archived: archive category ──
const archived = controller.admit({
  title: 'Old 2025 Spec',
  type: MemoryType.HistoricalRecord,
  category: MemoryCategory.Archive,
  source: { origin: 'import' },
  content: 'Legacy specification from 2025...',
})
// archived.decision === AdmissionDecision.ArchiveImmediately
// archived.priority === Priority.P4

// ── Custom configuration ──
const strictController = new AdmissionController(manager, {
  maxTitleLength: 100,
  maxContentLength: 10_000,
  minConfidenceForAcceptance: ConfidenceLevel.Medium,
  rejectOnTypeCategoryMismatch: true,
  rejectDuplicates: true,
  duplicateSimilarityThreshold: 0.8,
})

// ── Custom rules ──
const customRule = {
  id: 'no-test-memories',
  description: 'Rejects memories with "test" in title',
  evaluate: (context) => {
    if (context.memory.title.toLowerCase().includes('test')) {
      return {
        decision: AdmissionDecision.Reject,
        priority: Priority.P4,
        reason: 'Test memories not allowed',
        warnings: [],
        triggeredRule: 'no-test-memories',
      }
    }
    return undefined
  },
}

const customController = new AdmissionController(manager, {
  customRules: [customRule],
})
```

### Extension Guide

#### Adding a New Rule

1. Create a rule object implementing `AdmissionRule`:

```typescript
import { AdmissionRule, AdmissionDecision, Priority } from '@/lib/memory-manager'

const myRule: AdmissionRule = {
  id: 'my-custom-rule',
  description: 'Description of what this rule checks',
  evaluate: (context) => {
    const { memory, existingMemories } = context
    
    // Return AdmissionResult if rule triggers
    if (someCondition) {
      return {
        decision: AdmissionDecision.Reject,
        priority: Priority.P4,
        reason: 'Why this was rejected',
        warnings: [],
        triggeredRule: 'my-custom-rule',
      }
    }
    
    // Return undefined if rule does not apply
    return undefined
  },
}
```

2. Register via config:

```typescript
const controller = new AdmissionController(manager, {
  customRules: [myRule], // Prepended before default rules
  // OR
  postRules: [myRule],   // Appended after default rules
})
```

#### Rule Execution Order

- **customRules** run first (before all default rules)
- **Default rules** run in fixed order (required-fields → priority-assignment)
- **postRules** run last (after all default rules)

The first rule that returns a non-undefined result short-circuits the pipeline.

## Usage

### Basic Operations

```typescript
import { MemoryManager, MemoryType, MemoryCategory, ConfidenceLevel } from '@/lib/memory-manager'

const manager = new MemoryManager()

// Create
const memory = manager.create({
  title: 'RBAC permissions pattern',
  type: MemoryType.CodePattern,
  category: MemoryCategory.Engineering,
  tags: ['security', 'rbac', 'permissions'],
  confidence: ConfidenceLevel.High,
  verified: true,
  source: {
    origin: 'code-review',
    reference: 'src/lib/security/permissions.ts',
    description: 'Centralized RBAC implementation',
  },
  content: 'All permissions are centralized in permissions.ts with role-based mapping...',
})

// Read
const found = manager.getById(memory.id)
const engineeringMemories = manager.getByCategory(MemoryCategory.Engineering)
const securityMemories = manager.getByTag('security')

// Update
const updated = manager.update({
  id: memory.id,
  verified: true,
  confidence: ConfidenceLevel.High,
})

// Classify
const result = manager.classify({
  type: 'bug_fix',
  title: 'Fixed authentication redirect loop',
})
// result.category === MemoryCategory.Engineering
// result.confidence === 0.95

// Delete
manager.delete(memory.id)
```

### Batch Operations

```typescript
const results = manager.classifyBatch([
  { type: 'persona', title: 'Ping identity' },
  { tags: ['bug', 'fix'], title: 'Auth redirect fix' },
  { content: 'Old deprecated spec from 2025...' },
])
```

### Statistics

```typescript
const stats = manager.getStats()
// {
//   total: 42,
//   byCategory: { identity: 5, project: 12, engineering: 15, ... },
//   byType: { code_pattern: 8, bug_fix: 7, ... },
//   verified: 30,
//   unverified: 12,
// }
```

## Extensibility

### Adding a New Category

1. Add to `MemoryCategory` enum in `types.ts`
2. Add definition to `CategoryRegistry` in `categories.ts`
3. Add type mappings to `TypeToCategoryMap` in `categories.ts`
4. Add heuristic keywords to `classifier.ts` (optional)

### Adding a New Type

1. Add to `MemoryType` enum in `types.ts`
2. Add mapping to `TypeToCategoryMap` in `categories.ts`
3. Add heuristic keywords to `classifier.ts` (optional)

### Adding Category-Specific Fields

Use the `metadata` field on `Memory` for category-specific extensions:

```typescript
const memory = manager.create({
  // ... standard fields ...
  metadata: {
    filePath: 'src/lib/security/permissions.ts',
    lineCount: 150,
    lastReviewed: '2026-07-28',
  },
})
```

## Design Principles

1. **Single source of truth** — All memory operations go through `MemoryManager`
2. **Extensibility first** — New categories and types require minimal changes
3. **Traceability** — Every memory has a `source` and `confidence` level
4. **Type safety** — Full TypeScript with strict enums and type guards
5. **Separation of concerns** — Types, categories, classification, and management are separate modules
6. **Fail-safe defaults** — Unverified memories default to low confidence and Archive category

## Future Phases (Not Implemented)

- **Phase 3:** Persistent storage (Supabase/PostgreSQL)
- **Phase 4:** Embeddings and vector search
- **Phase 5:** AI-assisted classification and automatic learning
- **Phase 6:** Knowledge graph and relationship mapping
- **Phase 7:** Expiration, retention policies, and automatic archiving

## Verification

- [x] TypeScript compiles without errors
- [x] ESLint passes with zero errors
- [x] All modules export correctly
- [x] Classifier routes all types to correct categories
- [x] CRUD operations work as expected
- [x] Extensible metadata field supports arbitrary data
- [x] Retrieval engine filters by all supported fields
- [x] Retrieval engine combines multiple filters with AND logic
- [x] Retrieval engine sorts by all supported options
- [x] Retrieval engine paginates correctly
- [x] Retrieval engine validates queries and throws on invalid input
- [x] Retrieval engine returns empty results gracefully
- [x] 53 unit tests pass covering all query types
