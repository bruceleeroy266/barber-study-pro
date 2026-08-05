# MemoryStore Abstraction — API Changes

**Date:** 2026-07-29
**ADR:** Introduce a MemoryStore Abstraction (Option B — approved)
**Module:** `src/lib/memory-manager/`
**Status:** Implemented and verified

---

## Summary

Extracted the storage responsibility out of `MemoryManager` into a dedicated
`MemoryStore` abstraction with an `InMemoryStore` implementation, and extracted
ID generation into an `IdGenerator` strategy. This resolves the circular
dependency between `MemoryManager` and `AdmissionController`, and creates the
seam needed for future Supabase/SQLite persistence (Phase 3) and semantic/vector
memory (Phase 4).

All changes are **additive and backward compatible**. No existing public method
signatures were changed or removed.

---

## New Files

| File | Exports | Purpose |
|---|---|---|
| `id-generator.ts` | `IdGenerator` (interface), `SequentialIdGenerator`, `UuidIdGenerator` | Identity strategy for memory IDs. |
| `memory-store.ts` | `MemoryStore` (interface) | Storage seam. Extends `MemoryLookup` with write/lifecycle ops. |
| `in-memory-store.ts` | `InMemoryStore` | Default `MemoryStore` backed by a `Map`. |
| `API_CHANGES.md` | — | This document. |

## Modified Files

| File | Change |
|---|---|
| `manager.ts` | Delegates storage to a `MemoryStore`; added `store` option, `getStore()` accessor, and exported `AdmissionMetadata` interface. Removed private `Map` and `generateId()`. |
| `index.ts` | Added exports for `MemoryStore`, `InMemoryStore`, `IdGenerator`, `SequentialIdGenerator`, `UuidIdGenerator`, `AdmissionMetadata`. |
| `manager-integration.test.ts` | Rewired to share a single `InMemoryStore` between controller and manager; read-path tests seed via `createUnsafe`; typed `_admission` access via `admissionOf()` helper. |
| `admission-controller.test.ts` | Fixed a pre-existing test bug (`manager.create()` returns `CreateMemoryResult`, not `Memory`). |

---

## Public API Changes

### Additive (new)

- **`MemoryManagerOptions.store?: MemoryStore`** — optional storage backend.
  Defaults to a new `InMemoryStore()`. Provide a shared store when an
  `AdmissionController` must see the same memories the manager writes.
- **`MemoryManager.getStore(): MemoryStore`** — returns the underlying store.
  Useful for sharing with a controller and for tests.
- **`MemoryStore` interface** — `insert`, `update`, `delete`, `clear`,
  `generateId`, plus the `MemoryLookup` read operations (`findById`, `getAll`,
  `count`).
- **`InMemoryStore` class** — default implementation; constructor accepts an
  optional `IdGenerator`.
- **`IdGenerator` interface** + `SequentialIdGenerator` (default) and
  `UuidIdGenerator` implementations.
- **`AdmissionMetadata` interface** — typed shape of the `metadata._admission`
  record embedded on admission-created memories.

### Unchanged (preserved)

- All `MemoryManager` methods keep their signatures: `create`, `createUnsafe`,
  `findById`, `getById`, `getAll`, `getByCategory`, `getByType`, `getByTag`,
  `getVerified`, `getByConfidence`, `update`, `delete`, `classify`,
  `classifyBatch`, `reclassify`, `count`, `getStats`, `clear`.
- `MemoryManager` still implements `MemoryLookup` (delegates reads to the store),
  so existing code that passes a manager as a lookup continues to work.
- `AdmissionController` still depends only on the narrow `MemoryLookup`
  interface — unchanged.
- `memoryManager` singleton export — unchanged.

### Removed (internal only — not part of the public API)

- `MemoryManager`'s private `Map<string, Memory>` and `idCounter` field.
- `MemoryManager`'s private `generateId()` method (now `store.generateId()`).

No public symbols were removed.

---

## Recommended Wiring (new pattern)

The old two-step construction (which left the controller pointing at a different
store than the manager) is replaced by sharing a single store:

```ts
import {
  MemoryManager,
  AdmissionController,
  InMemoryStore,
} from '@/lib/memory-manager'

const store = new InMemoryStore()
const controller = new AdmissionController(store)      // reads via MemoryLookup
const manager = new MemoryManager({ store, admissionController: controller })
```

The legacy pattern (`new AdmissionController(manager)`) still works because
`MemoryManager` implements `MemoryLookup`, but sharing an explicit store is the
recommended, clearer approach.

---

## Bugs Fixed by This Refactor

The pre-existing circular wiring meant the `AdmissionController` could not see
memories written through a different `MemoryManager` instance, so duplicate
detection silently failed. Fixing the wiring fixed real bugs:

1. **Duplicate detection integration** (3 failing tests) — duplicates were being
   stored because the controller read from a different store than the writer.
2. **Pre-existing test bug** (1 failing test) — `admission-controller.test.ts`
   treated `manager.create()` (which returns `CreateMemoryResult`) as a `Memory`.

Several read-path tests were also unknowingly relying on the broken wiring to
store duplicate content; they now seed via `createUnsafe` to test reads/filters
independently of admission.

---

## Verification

| Check | Result |
|---|---|
| Test suite (`npx tsx --test src/lib/memory-manager/*.test.ts`) | **156/156 pass** (baseline was 153 pass / 3 fail) |
| TypeScript (`npx tsc --noEmit`) | **0 errors** in `memory-manager` |
| ESLint (`npx eslint src/lib/memory-manager/*.ts`) | **0 errors, 0 warnings** |

Baseline before refactor: 156 tests / 153 pass / 3 fail (plus 1 additional
pre-existing failure in `admission-controller.test.ts` and 13 pre-existing
type-strictness errors in the test file). All resolved.

---

## Future Work Enabled (not in scope here)

- **Phase 3 — Persistence:** implement `MemoryStore` against Supabase/Postgres
  or SQLite. `MemoryManager` and `AdmissionController` require no changes.
- **Phase 4 — Semantic memory:** a `SemanticMemoryStore` (or store + embedding
  index) plugs into the same seam the storage-agnostic `RetrievalEngine`
  already expects.
- **ID strategy:** swap `SequentialIdGenerator` for `UuidIdGenerator`, or let a
  database backend generate IDs, without touching `InMemoryStore` consumers.
