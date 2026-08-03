# ASCYN PRO - Production Baseline Report

**Document Version:** 1.0  
**Created:** 2026-08-03  
**Baseline Tag:** `pilot-ready-2026-08`  
**Status:** Certified for Pilot Operations

---

## 1. Production Snapshot

| Item | Value |
|---|---|
| Production URL | https://ascynpro.com |
| Deployment ID | `dpl_8cWNbzYvNvZ25zgZ2siuHbdapkzt` |
| Deployment URL | https://barber-study-n2hp5ro95-gabebot24-5010s-projects.vercel.app |
| Git Commit SHA | `7ca3158fc589963582c45b640458c4d3ba3d01fa` |
| Git Branch | `main` |
| Production Timestamp | 2026-08-03 18:09:14 GMT-0500 (CDT) |
| Commit Timestamp | 2026-08-02 14:19:46 -0500 |
| Supabase Project | `ascyn-pro` (ref: `hgyznydxepjsvbjsirpv`) |
| Supabase Region | West US (Oregon) |
| Vercel Project | `gabebot24-5010s-projects/barber-study-pro` |
| Vercel Team | `gabebot24-5010s-projects` |

---

## 2. Architecture Baseline

### 2.1 Application Architecture

| Component | Version/Implementation |
|---|---|
| Framework | Next.js 16.2.6 (Turbopack) |
| React | 19.2.4 |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS 4.x |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase SSR (cookie-based) |
| Authorization | Role-Based Access Control (RBAC) |
| Deployment | Vercel (Edge + Serverless) |
| Middleware | Next.js Edge Middleware |

### 2.2 Authentication Implementation

**Type:** Supabase SSR with cookie-based sessions

**Key Files:**
- `src/middleware.ts` — Edge middleware for route protection
- `src/lib/supabase-server.ts` — Server-side Supabase client
- `src/lib/supabase.ts` — Client-side Supabase client
- `src/lib/auth-helpers.ts` — Role validation utilities
- `src/lib/auth-access.ts` — Access control logic

**Session Management:**
- Cookie name: `sb-hgyznydxepjsvbjsirpv-auth-token`
- Storage: HTTP-only cookies (SSR)
- Refresh: Automatic via Supabase SDK
- Logout: Clears all storage + cookies + server session

### 2.3 Middleware Behavior

**Protected Routes:**
- `/dashboard/*` — Student portal
- `/instructor/*` — Instructor portal
- `/admin/*` — Admin portal
- `/school/*` — School admin portal

**Middleware Actions:**
1. Check Supabase configuration
2. Validate session cookie
3. Load user profile
4. Check approval status
5. Enforce role-based access
6. Redirect unauthorized users

**Redirect Logic:**
- Unauthenticated → `/login?redirect=<original-path>`
- Wrong role → Role-based dashboard
- Pending approval → `/pending-approval`
- Password change required → `/update-password`

### 2.4 User Roles

| Role | Description | Access Level |
|---|---|---|
| `student` | Barbering students | Dashboard, chapters, progress |
| `apprentice` | Apprentice students | Same as student |
| `instructor` | Program instructors | Instructor portal + student data |
| `admin` | System administrators | Full access |
| `school_admin` | School administrators | School dashboard + limited admin |

### 2.5 Protected Routes by Role

**Student Routes:**
- `/dashboard` — Main dashboard
- `/dashboard/chapters` — Chapter list
- `/dashboard/chapters/[id]` — Chapter detail
- `/dashboard/missed-questions` — Question bank
- `/dashboard/progress` — Progress tracking
- `/dashboard/grades` — Grade view
- `/dashboard/assessments` — Assessment view
- `/dashboard/compliance` — Compliance tracking
- `/dashboard/messages` — Messages
- `/dashboard/profile` — Profile management
- `/dashboard/beta-checklist` — Beta tester checklist

**Instructor Routes:**
- `/instructor` — Instructor dashboard
- `/instructor/students` — Student roster
- `/instructor/attendance` — Attendance tracking
- `/instructor/gradebook` — Grade management
- `/instructor/assessments` — Practical assessments
- `/instructor/compliance` — Compliance monitoring
- `/instructor/messages` — Messaging
- `/instructor/rubrics` — Assessment rubrics
- `/instructor/student/[id]` — Individual student view

**Admin Routes:**
- `/admin` — Admin dashboard
- `/admin/users` — User management
- `/admin/school` — School management
- `/admin/school/configuration` — School settings
- `/admin/audit` — Audit logs
- `/admin/health` — System health
- `/admin/maintenance` — Maintenance mode
- `/admin/pilot-inquiries` — Pilot program inquiries

**School Admin Routes:**
- `/school` — School dashboard

---

## 3. Database Baseline

### 3.1 Supabase Configuration

| Setting | Value |
|---|---|
| Project Reference | `hgyznydxepjsvbjsirpv` |
| URL | `https://hgyznydxepjsvbjsirpv.supabase.co` |
| Region | West US (Oregon) |
| Auth | Enabled |
| RLS | Enabled on all tables |

### 3.2 Key Tables

| Table | Purpose | RLS Enabled |
|---|---|---|
| `profiles` | User profiles and roles | ✅ |
| `schools` | School information | ✅ |
| `student_progress` | Chapter progress tracking | ✅ |
| `quiz_attempts` | Quiz results | ✅ |
| `grades` | Grade records | ✅ |
| `grade_categories` | Grade categories | ✅ |
| `assessments` | Practical assessments | ✅ |
| `assessment_rubrics` | Assessment criteria | ✅ |
| `attendance_records` | Attendance tracking | ✅ |
| `beta_agreements` | Beta tester agreements | ✅ |
| `audit_logs` | Security audit trail | ✅ |

### 3.3 Database Version

**Migration Status:** All migrations applied as of commit `7ca3158`

**Migration Location:** `supabase/migrations/`

---

## 4. Deployment Identifiers

### 4.1 Current Production

| Identifier | Value |
|---|---|
| Vercel Deployment ID | `dpl_8cWNbzYvNvZ25zgZ2siuHbdapkzt` |
| Vercel Deployment URL | https://barber-study-n2hp5ro95-gabebot24-5010s-projects.vercel.app |
| Production Alias | https://ascynpro.com |
| Build Time | 2026-08-03 18:09:14 GMT-0500 |
| Build Duration | ~1 minute |
| Build Region | iad1 (Washington, D.C.) |

### 4.2 Build Output

| Metric | Value |
|---|---|
| Total Routes | 50+ |
| Static Pages | 22 |
| Dynamic Pages | 28+ |
| Middleware Size | 124.89 KB |
| Index Bundle | 3.08 MB |

### 4.3 Route Manifest

**Key Routes Verified:**
- ✅ `/` — Landing page
- ✅ `/login` — Authentication
- ✅ `/dashboard` — Student portal
- ✅ `/instructor` — Instructor portal
- ✅ `/instructor/students` — Student roster
- ✅ `/admin` — Admin portal
- ✅ `/school` — School admin portal

---

## 5. Security Baseline

### 5.1 Authentication Security

| Feature | Status |
|---|---|
| SSR Cookie Sessions | ✅ Enabled |
| HTTP-Only Cookies | ✅ Enabled |
| Secure Cookies | ✅ Enabled (production) |
| SameSite | `Lax` |
| Session Refresh | ✅ Automatic |
| Logout Cleanup | ✅ Complete |

### 5.2 Authorization Security

| Feature | Status |
|---|---|
| RBAC | ✅ Enabled |
| Middleware Enforcement | ✅ Enabled |
| RLS Policies | ✅ Enabled |
| Service Role Isolation | ✅ Enabled |
| Audit Logging | ✅ Enabled |

### 5.3 Route Protection

| Protection | Status |
|---|---|
| Unauthenticated Redirect | ✅ `/login` |
| Role-Based Redirect | ✅ Enabled |
| Approval Status Check | ✅ Enabled |
| Disabled Account Check | ✅ Enabled |
| Password Change Enforcement | ✅ Enabled |

---

## 6. Feature Baseline

### 6.1 Student Features

| Feature | Status | Notes |
|---|---|---|
| Dashboard | ✅ Live | Progress overview, announcements |
| Chapters | ✅ Live | 21 chapters with lessons |
| Flashcards | ✅ Live | Via chapter study |
| Quizzes | ✅ Live | Chapter quizzes |
| Missed Questions | ✅ Live | Question bank with retest |
| Progress Tracking | ✅ Live | Visual progress indicators |
| Grades | ✅ Live | Grade view |
| Assessments | ✅ Live | Practical skill view |
| Compliance | ✅ Live | Board eligibility tracking |
| Messages | ✅ Live | Placeholder (coming soon) |
| Profile | ✅ Live | Account management |
| Beta Checklist | ✅ Live | Tester feedback |

### 6.2 Instructor Features

| Feature | Status | Notes |
|---|---|---|
| Dashboard | ✅ Live | Class overview |
| Student Roster | ✅ Live | Progress, readiness, at-risk |
| Attendance | ✅ Live | Track, correct, export |
| Gradebook | ✅ Live | Grade management |
| Assessments | ✅ Live | Practical evaluations |
| Compliance | ✅ Live | Risk monitoring |
| Messages | ✅ Live | Placeholder (coming soon) |
| Rubrics | ✅ Live | Assessment criteria |
| Student Detail | ✅ Live | Individual progress |

### 6.3 Admin Features

| Feature | Status | Notes |
|---|---|---|
| Dashboard | ✅ Live | System overview |
| User Management | ✅ Live | Create, edit, disable |
| School Management | ✅ Live | School settings |
| Audit Logs | ✅ Live | Security trail |
| System Health | ✅ Live | Status monitoring |
| Maintenance Mode | ✅ Live | System control |
| Pilot Inquiries | ✅ Live | Program management |

---

## 7. Integration Baseline

### 7.1 Supabase Integration

| Service | Status | Notes |
|---|---|---|
| Authentication | ✅ Live | SSR cookie-based |
| Database | ✅ Live | PostgreSQL with RLS |
| Realtime | ⚠️ Available | Not currently used |
| Storage | ⚠️ Available | Not currently used |
| Edge Functions | ⚠️ Available | Not currently used |

### 7.2 Vercel Integration

| Service | Status | Notes |
|---|---|---|
| Deployment | ✅ Live | Automatic from `main` |
| Edge Network | ✅ Live | Global CDN |
| Analytics | ⚠️ Available | Not configured |
| Speed Insights | ⚠️ Available | Not configured |

---

## 8. Environment Configuration

### 8.1 Required Environment Variables

| Variable | Purpose | Location |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Vercel |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Vercel |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role | Vercel (server-only) |

### 8.2 Optional Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_DEMO_MODE` | Enable demo mode | `false` |
| `NEXT_PUBLIC_BETA_MODE` | Enable beta features | `true` |

---

## 9. Known Limitations

| Limitation | Impact | Workaround |
|---|---|---|
| Messaging placeholder | Low | Use external communication |
| No email service | Medium | Manual notifications |
| No file uploads | Low | External storage |
| No realtime updates | Low | Manual refresh |

---

## 10. Change Management

### 10.1 Baseline Protection

**Main Branch Status:** Frozen except for critical bug fixes

**Feature Development:** All new features must use feature branches

**Merge Policy:** No merges to `main` without pilot feedback review

### 10.2 Rollback Procedure

**Immediate Rollback:**
```bash
# Via Vercel CLI
npx vercel rollback <previous-deployment-id>

# Via Vercel Dashboard
# Deployments → Select previous → Promote to Production
```

**Git Rollback:**
```bash
git revert <commit-sha>
git push origin main
# Vercel auto-deploys
```

### 10.3 Emergency Contacts

| Role | Responsibility |
|---|---|
| Project Owner | Final approval |
| Technical Lead | Deployment decisions |
| Database Admin | Supabase access |

---

## 11. Certification

**This baseline is certified as the reference point for ASCYN PRO pilot operations.**

**Certified By:** Ping (AI Development Partner)  
**Certification Date:** 2026-08-03  
**Baseline Tag:** `pilot-ready-2026-08`  
**Next Review:** Post-pilot feedback cycle

---

## Appendix A: Verification Evidence

### A.1 PAT Results

| Phase | Status | Date |
|---|---|---|
| Production Deployment | ✅ PASS | 2026-08-03 |
| Authentication Stabilization | ✅ PASS | 2026-08-03 |
| Administrator PAT | ✅ PASS | 2026-08-03 |
| Instructor PAT | ✅ PASS | 2026-08-03 |
| Student PAT | ✅ PASS | 2026-08-03 |

### A.2 Route Verification

All routes verified via authenticated Playwright testing on 2026-08-03.

### A.3 Security Verification

- ✅ Middleware enforcement verified
- ✅ RBAC verified
- ✅ Session management verified
- ✅ Logout protection verified
- ✅ Browser back protection verified

---

**End of Production Baseline Report**
