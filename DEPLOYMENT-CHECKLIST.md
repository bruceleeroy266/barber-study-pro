# ASCYN PRO — Deployment Checklist

**Last updated:** 2026-07-13  
**Live site:** https://ascynpro.com  
**Repository:** `git@github.com:bruceleeroy266/barber-study-pro`  
**Branch:** `main`

## ✅ Completed Deployment Steps

- [x] Supabase production project created and connected
- [x] Database schema applied (`supabase-schema.sql` + migrations)
- [x] Environment variables configured in Vercel and local `.env.local`
- [x] GitHub repository connected to Vercel; auto-deploy from `main`
- [x] Custom domain `ascynpro.com` live and serving HTTPS
- [x] Pilot inquiries table created with required columns
- [x] Admin pilot-inquiry review page + in-app reply modal deployed
- [x] Vercel Analytics and Speed Insights enabled
- [x] `.env.local` in `.gitignore`; no secrets committed

## 🔧 Environment Variables (Vercel + local `.env.local`)

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_DEMO_MODE`

Admin / utility scripts (never expose):

- `SUPABASE_SERVICE_ROLE_KEY`
- `ASCYN_ADMIN_EMAIL`
- `ASCYN_ADMIN_PASSWORD`
- `ASCYN_ADMIN_FULL_NAME`

Pilot test accounts (utility scripts only):

- `ASCYN_STUDENT_EMAIL`
- `ASCYN_STUDENT_PASSWORD`
- `ASCYN_INSTRUCTOR_EMAIL`
- `ASCYN_INSTRUCTOR_PASSWORD`

Email (configured in Vercel or local env for Resend):

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `NOTIFICATION_FROM_EMAIL`
- `EMAIL_TO`

See `.env.example` in `02-work/app/` for the template.

## 🧪 Production Verification Checklist

- [x] Root URL returns 200
- [x] `/pilot` page loads and form submits
- [x] `/admin/pilot-inquiries` requires login and routes correctly
- [x] `/login`, `/signup`, `/auth/verify-email`, `/auth/update-password` render
- [x] Build passes (`npm run build`)
- [x] TypeScript passes (`npx tsc --noEmit`)

## 📋 Remaining Pre-Launch / Post-Launch Tasks

- [ ] Complete Beta Phase 1 QA end-to-end
- [ ] Migrate Chapters 17–21 into v2 platform
- [ ] Replace admin portal placeholders with real functionality
- [ ] Seed remaining quiz/content data as needed
- [ ] Set up automated backups
- [ ] Set up CI/CD (GitHub Actions: typecheck, lint, build)
- [ ] Payment/subscription integration
- [ ] Final legal review (privacy, terms, LLC)

## Notes

- The local `.env.local` must live in `02-work/app/` (the Next.js app directory).
- Do not place `.env.local` in the top-level `C:\AI\ACTIVE\ASCYN-PRO/` folder; it will not be loaded and creates a duplicate-secret risk.
