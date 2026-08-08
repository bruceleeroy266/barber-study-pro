# ASCYN PRO — Next Actions

**Last Updated:** 2026-08-05  
**Updated By:** Ping (CTO/CPO)  
**Priority Framework:** Critical → High → Medium → Low

---

## Immediate Actions (This Week)

### 1. Commit Phase 10 Sprint 1 — School Settings

| Field | Value |
|-------|-------|
| **Priority** | 🔴 Critical |
| **Owner** | Ping |
| **Due** | 2026-08-06 |
| **Status** | ✅ **READY — All verification passed** |
| **Risk** | Uncommitted work could be lost |

**What:** Commit the Phase 10 Sprint 1 School Settings module to `main`.

**Verification Results (2026-08-05):**
- [x] `npm run typecheck` passes (exit 0)
- [x] `npm run build` passes (exit 0, 40+ pages)
- [x] `npm run test` passes (385/385 tests, 43 files)
- [x] `npx eslint src/` — 0 errors, 70 warnings (all pre-existing)
- [x] No secrets or sensitive data in commit
- [x] Migration file is idempotent
- [x] No temporary files in working tree

**Files to Commit:**
- 13 modified files (school config components, validation, types, demo data, docs)
- 5 new files (BrandingSection, InstructorDefaultsSection, StudentDefaultsSection, migration, implementation doc)

**Command:**
```bash
git add -A
git commit -m "feat(phase-10): school settings module — complete configuration system

- School profile management (name, contact, address, license, accreditation)
- Branding customization (colors, logo upload)
- Programs CRUD with quick templates
- Gradebook configuration with category management
- Student defaults (passing %, quiz attempts, attendance)
- Instructor defaults (permissions)
- Extended RLS policies for school_admin role
- Comprehensive validation (client + server)

Migration: 20260805000000_extend_school_settings_phase10.sql"
```

---

### 2. Deploy Phase 10 to Production

| Field | Value |
|-------|-------|
| **Priority** | 🔴 Critical |
| **Owner** | Ping |
| **Due** | 2026-08-07 |
| **Status** | Blocked on Action 1 |
| **Risk** | Pilot users cannot access new school settings |

**What:** Deploy the committed Phase 10 code to production.

**Steps:**
1. Push to `origin/main`
2. Verify Vercel auto-deployment
3. Run production smoke tests
4. Verify school settings accessible at `/admin/school/configuration`

**Verification:**
- [ ] Production URL returns 200
- [ ] School settings page loads without errors
- [ ] Database migration applied successfully
- [ ] RLS policies working correctly

---

### 3. Execute Phase 10 QA Checklist

| Field | Value |
|-------|-------|
| **Priority** | 🟡 High |
| **Owner** | Ping |
| **Due** | 2026-08-08 |
| **Status** | Blocked on Action 2 |
| **Risk** | Undiscovered bugs in production |

**What:** Execute the manual QA checklist from `PHASE_10_SPRINT_1_SCHOOL_SETTINGS.md`.

**Test Areas:**
- [ ] Authentication & authorization (6 tests)
- [ ] School Profile (8 tests)
- [ ] Branding (8 tests)
- [ ] Programs (7 tests)
- [ ] Gradebook (6 tests)
- [ ] Student Defaults (3 tests)
- [ ] Instructor Defaults (1 test)
- [ ] Persistence (6 tests)
- [ ] Navigation (4 tests)

**Total:** 49 manual tests

---

## Short Term Actions (Next 2 Weeks)

### 4. Pilot Monitoring & Support

| Field | Value |
|-------|-------|
| **Priority** | 🟡 High |
| **Owner** | Ping + Gabriel |
| **Due** | Ongoing |
| **Status** | Active |

**What:** Monitor pilot operations and provide support.

**Daily Tasks:**
- [ ] Check `pilot/DAILY_LOG.md` for activity
- [ ] Monitor production for errors
- [ ] Respond to user feedback
- [ ] Update `pilot/EXECUTIVE_DASHBOARD.md`

**Weekly Tasks:**
- [ ] Compile weekly summary
- [ ] Review metrics
- [ ] Identify trends
- [ ] Plan improvements

---

### 5. Fix Chapter 6 Flashcards

| Field | Value |
|-------|-------|
| **Priority** | 🟡 High |
| **Owner** | Ping |
| **Due** | 2026-08-15 |
| **Status** | Open |
| **Risk** | Incomplete curriculum |

**What:** Create premium flashcards for Chapter 6 (General Anatomy & Physiology).

**Current State:** Chapter 6 uses enhanced fallback flashcards.

**Target State:** Premium flashcards matching the quality of other chapters.

**Deliverable:** `src/lib/chapter-6-premium-flashcards.ts`

---

### 6. Fix Lint Errors

| Field | Value |
|-------|-------|
| **Priority** | 🟢 Medium |
| **Owner** | Ping |
| **Due** | 2026-08-15 |
| **Status** | Open |
| **Risk** | Code quality gate failing |

**What:** Fix all lint errors to achieve `npm run lint` exit 0.

**Current State:**
- `src/`: 1 error (unescaped apostrophe), 71 warnings
- `tools/`: 103 errors (mostly `require()` imports), 48 warnings

**Target State:** 0 errors, 0 warnings

**Approach:**
1. Fix `src/` error (trivial)
2. Convert `tools/` scripts to ES6 imports or add ESLint override
3. Fix unused variable warnings

---

## Medium Term Actions (Post-Pilot, 2–4 Weeks)

### 7. Email Service Integration

| Field | Value |
|-------|-------|
| **Priority** | 🟡 High |
| **Owner** | Ping |
| **Due** | TBD |
| **Status** | Not started |
| **Risk** | No automated notifications |

**What:** Configure email service for transactional emails.

**Options:**
- Resend (recommended)
- SendGrid
- AWS SES

**Deliverable:** Email service configured and tested

---

### 8. Messaging System Implementation

| Field | Value |
|-------|-------|
| **Priority** | 🟡 High |
| **Owner** | Ping |
| **Due** | TBD |
| **Status** | Placeholder |
| **Risk** | Users cannot communicate in-app |

**What:** Implement in-app messaging between instructors and students.

**Current State:** Placeholder page with "coming soon" message.

**Target State:** Full messaging system with threads, notifications, and moderation.

---

### 9. Supabase Storage for Logo Uploads

| Field | Value |
|-------|-------|
| **Priority** | 🟢 Medium |
| **Owner** | Ping |
| **Due** | TBD |
| **Status** | Not started |
| **Risk** | Logo uploads not persistent |

**What:** Integrate Supabase Storage for persistent logo uploads.

**Current State:** Logo upload uses object URL (temporary).

**Target State:** Logo uploads stored in Supabase Storage with CDN delivery.

---

## Long Term Actions (1–3 Months)

### 10. NABBA Booth Preparation

| Field | Value |
|-------|-------|
| **Priority** | 🟡 High |
| **Owner** | Gabriel + Ping |
| **Due** | 2026-09-20 |
| **Status** | Planning |
| **Risk** | Hard deadline |

**What:** Prepare for NABBA booth launch.

**Deliverables:**
- [ ] Booth materials (backdrop, banners, tablecloth, floor mat)
- [ ] Promo video
- [ ] Brochures (Student / Instructor / School Owner editions)
- [ ] Branded apparel
- [ ] Lead capture system
- [ ] Demo scripts (30s, 3min, 10min)
- [ ] FAQ document
- [ ] Business cards

---

### 11. Commercial Release Preparation

| Field | Value |
|-------|-------|
| **Priority** | 🟢 Medium |
| **Owner** | Gabriel + Ping |
| **Due** | TBD |
| **Status** | Not started |
| **Risk** | Blocked on business/legal readiness |

**What:** Prepare for commercial launch.

**Deliverables:**
- [ ] Payment integration (Stripe / Paddle)
- [ ] Legal docs (privacy policy, terms of service)
- [ ] Multi-program curriculum expansion plan
- [ ] Customer support playbook
- [ ] White-label and multi-tenant support

---

## Blocked Actions

### Oklahoma Board Presentation Package

| Field | Value |
|-------|-------|
| **Priority** | ⏸️ Deferred |
| **Owner** | Gabriel |
| **Status** | Not located in repo |
| **Blocker** | Package not found in current repository |

**What:** Oklahoma Board presentation package was identified as top priority in roadmap but materials are not located in the current repository.

**Action Needed:** Locate or recreate presentation materials.

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| Uncommitted Phase 10 work lost | Low | High | Commit immediately | Ping |
| Pilot users encounter bugs | Medium | Medium | Monitor daily; quick fixes | Ping |
| Email service absence | High | Medium | Manual communication | Gabriel |
| RLS policy gaps | Medium | Low | Monitor feedback; adjust | Ping |
| NABBA deadline missed | Low | High | Start prep early | Gabriel |

---

## Success Metrics

### This Week

| Metric | Target | Current |
|--------|--------|---------|
| Phase 10 committed | ✅ | ⏳ Pending |
| Phase 10 deployed | ✅ | ⏳ Pending |
| Phase 10 QA passed | 49/49 | ⏳ Pending |
| Zero critical bugs | 0 | 0 |

### This Month

| Metric | Target | Current |
|--------|--------|---------|
| Pilot user satisfaction | TBD | TBD |
| Chapter completion rate | TBD | TBD |
| Quiz pass rate | TBD | TBD |
| Zero production incidents | 0 | 0 |

---

## Cross-References

- **[02_MASTER_ROADMAP.md](02_MASTER_ROADMAP.md)** — Master roadmap and phase status
- **[01_PROJECT_STATUS.md](01_PROJECT_STATUS.md)** — Current project status
- **[11_KNOWN_ISSUES.md](11_KNOWN_ISSUES.md)** — Known issues and workarounds
- **[15_PILOT_STATUS.md](15_PILOT_STATUS.md)** — Pilot operations status

---

*This document is a living document. Update it as actions complete, priorities shift, and new information becomes available.*
