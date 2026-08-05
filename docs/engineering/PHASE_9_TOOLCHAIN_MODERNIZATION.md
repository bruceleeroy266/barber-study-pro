# Phase 9 — Toolchain Modernization

**Status:** Backlog  
**Priority:** Medium  
**Created:** 2026-08-05  
**Source:** Phase 8A Security Hardening

---

## Objective

Modernize the engineering tools directory to align with the project's ESM/TypeScript standards and eliminate legacy lint issues.

---

## Background

During Phase 8A (Security Hardening), six files were converted from hardcoded credentials to environment variables. While these six files now pass all lint checks, the broader `tools/` directory contains 223 pre-existing lint issues that were not addressed to avoid scope creep.

---

## Current State

### Lint Summary (as of 2026-08-05)

| Category | Count | Severity |
|----------|-------|----------|
| `no-require-imports` | 98 | Error |
| `no-unused-vars` | 97 | Warning |
| `no-explicit-any` | 7 | Error |
| Other | 21 | Mixed |
| **Total** | **223** | |

### Affected Directories

- `tools/auth/` — Multiple files with `require()` imports
- `tools/database/` — Multiple files with `require()` imports
- `tools/investigation/` — Multiple files with `require()` imports
- `tools/verification/` — Multiple files with `require()` imports
- `tools/scripts/` — Mixed ESM/CommonJS issues

---

## Scope

### In Scope

1. **CommonJS → ESM Migration**
   - Convert all `.js` files in `tools/` from `require()` to `import`
   - Update file extensions if needed (`.js` → `.mjs` or add `"type": "module"` to package.json)

2. **Tool Lint Cleanup**
   - Fix all `no-unused-vars` warnings
   - Remove or properly type all `any` usage
   - Address `prefer-const` violations

3. **Strict Typing**
   - Add proper TypeScript types to all tool scripts
   - Replace `any` with specific types or `unknown`

4. **Legacy Code Removal**
   - Remove unused imports (`fs`, `path` where not needed)
   - Clean up dead code

### Out of Scope

- Business logic changes
- Application source code changes (`src/`)
- Test file changes (unless directly related to tools)

---

## Acceptance Criteria

- [ ] All files in `tools/` pass ESLint with zero errors
- [ ] All files in `tools/` use ESM imports (no `require()`)
- [ ] No `any` types without explicit justification
- [ ] All unused variables removed or prefixed with `_`
- [ ] `npm run lint` passes for entire repository
- [ ] `npm run typecheck` passes for entire repository
- [ ] `npm run build` passes
- [ ] `npm test` passes

---

## Implementation Notes

### Files Already Modernized (Phase 8A)

These six files were converted to ESM and environment variables during Phase 8A:

- `tools/auth/create-test-accounts.js`
- `tools/auth/fix-instructor-password.js`
- `tools/auth/restore-admin.js`
- `tools/scripts/auth/login-failure-investigation.js`
- `tools/auth/fix-instructor-account.js`
- `tools/database/cleanup-users-pg.js`

### Recommended Approach

1. **Batch by directory** — Convert one directory at a time
2. **Test after each batch** — Run lint to verify progress
3. **Preserve functionality** — These are utility scripts; behavior must not change
4. **Document breaking changes** — If any script's CLI interface changes, update README

---

## Dependencies

- None (this is a standalone maintenance task)

---

## Risks

| Risk | Mitigation |
|------|------------|
| Breaking utility scripts | Test each script after conversion |
| Merge conflicts | Coordinate with active development |
| Time investment | Batch work in small increments |

---

## References

- Phase 8A Security Hardening (2026-08-05)
- `tools/README.md` — Environment variable documentation
- ESLint configuration: `eslint.config.mjs`

---

**Next Action:** Schedule when engineering bandwidth allows. Not blocking production.
