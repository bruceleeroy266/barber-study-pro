# Barber Study Pro V2 — Deployment Checklist

## ✅ COMPLETED CHANGES (2026-05-18)

### Environment Configuration
- [x] `.env.local` updated with clear documentation
- [x] `NEXT_PUBLIC_DEMO_MODE` set to `false` (production default)
- [x] Supabase variables left empty (must be filled for production)

### Auth & Middleware
- [x] `src/middleware.ts` — Conditional auth bypass (demo only when unconfigured)
- [x] `src/lib/supabase.ts` — Browser client with proper config validation
- [x] `src/lib/supabase-server.ts` — Server client with proper config validation

### Data Safety
- [x] All demo data files preserved (`flashcards-data.ts`, `quiz-data.ts`, `demo-data.ts`, `orphaned-flashcards.ts`)
- [x] Seed SQL created for Supabase import

---

## 🔧 REQUIRED BEFORE PRODUCTION DEPLOYMENT

### 1. Supabase Project Setup

**Create Supabase project:**
1. Go to https://supabase.com
2. Create new project
3. Note the project URL and anon key

**Required Tables:**
| Table | Purpose | Status |
|-------|---------|--------|
| `schools` | Multi-tenant schools | Schema ready |
| `profiles` | User profiles (extends auth.users) | Schema ready |
| `chapters` | 21 barber chapters | Schema ready |
| `flashcards` | 967 study cards | Needs seed data |
| `quizzes` | One per chapter | Needs seed data |
| `quiz_questions` | Quiz questions (50+ currently) | Needs seed data |
| `student_progress` | User progress tracking | Schema ready |
| `quiz_attempts` | Quiz score history | Schema ready |

**Run SQL:**
1. Execute `supabase-schema.sql` in Supabase SQL Editor
2. Execute `supabase-seed-data.sql` for chapters
3. Use seed script for flashcards/quiz questions (or manual CSV import)

### 2. Environment Variables (Vercel)

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (anon/public key) | ✅ Yes |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | ✅ Yes |
| `NEXT_PUBLIC_DEMO_MODE` | `false` | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (service role) | ⚠️ Admin only |

**DO NOT commit these to GitHub.**

### 3. GitHub Safety Check

Before pushing:
- [ ] `.env.local` is in `.gitignore` (✅ confirmed)
- [ ] No secrets in committed files
- [ ] `npm run build` passes
- [ ] TypeScript is clean

### 4. Vercel Deployment Steps

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables (see above)
4. Deploy
5. Verify build succeeds

---

## 🧪 TESTING CHECKLIST

### Demo Mode (Development)
- [ ] Set `NEXT_PUBLIC_DEMO_MODE=true`
- [ ] Clear Supabase URL/key
- [ ] Verify app loads with mock data
- [ ] Verify flashcards display
- [ ] Verify quizzes work

### Production Mode
- [ ] Set `NEXT_PUBLIC_DEMO_MODE=false`
- [ ] Add real Supabase credentials
- [ ] Verify login works
- [ ] Verify signup works
- [ ] Verify protected routes require auth
- [ ] Verify flashcards load from Supabase
- [ ] Verify quizzes load from Supabase
- [ ] Verify progress persists

---

## 📋 CURRENT STATUS

| Component | Status |
|-----------|--------|
| Demo mode | ✅ Available as fallback |
| Production auth | ✅ Ready (middleware enforces) |
| Supabase schema | ✅ SQL files ready |
| Seed data | ⚠️ Needs import script |
| Build | ✅ Passes |
| GitHub push | ✅ Safe (.env in .gitignore) |
| Vercel deploy | ⚠️ Needs env vars + Supabase project |

---

## 🎯 BLOCKERS FOR FULL LAUNCH

1. **Supabase project creation** — Need active project with tables
2. **Data migration** — 967 flashcards + 50+ quiz questions need bulk import
3. **Quiz completion** — Only Ch 1-2 have quizzes (19 chapters need 25 questions each)
4. **Chapter content** — All chapters have `content: null` (no long-form study material)
5. **Payment/subscription** — No Stripe or payment integration yet

---

*Last updated: 2026-05-18*
