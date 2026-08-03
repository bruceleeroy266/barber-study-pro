# ASCYN PRO - Production Operations Runbook

**Version:** 1.0  
**Date:** 2026-08-03  
**Baseline:** `pilot-ready-2026-08`

---

## Quick Reference

| Item | Value |
|---|---|
| Production URL | https://ascynpro.com |
| Vercel Dashboard | https://vercel.com/gabebot24-5010s-projects/barber-study-pro |
| Supabase Dashboard | https://supabase.com/dashboard/project/hgyznydxepjsvbjsirpv |
| GitHub Repository | https://github.com/bruceleeroy266/barber-study-pro |
| Current Deployment | `dpl_8cWNbzYvNvZ25zgZ2siuHbdapkzt` |
| Current Commit | `7ca3158fc589963582c45b640458c4d3ba3d01fa` |

---

## 1. Deployment Operations

### 1.1 Standard Deployment

**Trigger:** Push to `main` branch (auto-deploy)

**Manual Deployment:**
```bash
cd C:\Users\gabeb\Projects\barber-study-pro
npx vercel --prod --yes
```

**Verification:**
```bash
npx vercel ls --prod
npx vercel inspect <deployment-url>
```

### 1.2 Rollback Procedure

**Immediate Rollback (Vercel):**
```bash
# List recent deployments
npx vercel ls --prod

# Inspect previous deployment
npx vercel inspect <previous-deployment-url>

# Promote previous deployment to production
npx vercel promote <previous-deployment-url>
```

**Git Rollback:**
```bash
# Revert last commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-sha>
git push origin main --force
```

### 1.3 Deployment Verification Checklist

- [ ] Build completes without errors
- [ ] All routes in manifest
- [ ] Authentication works
- [ ] Key pages load (/, /login, /dashboard, /instructor, /admin)
- [ ] No console errors
- [ ] No 404s on expected routes

---

## 2. Database Operations

### 2.1 Supabase Access

**Dashboard:** https://supabase.com/dashboard/project/hgyznydxepjsvbjsirpv

**Key Operations:**
- Table Editor: Browse data
- SQL Editor: Run queries
- Authentication: Manage users
- Policies: Review RLS

### 2.2 Common Queries

**Check user roles:**
```sql
SELECT id, email, role, approval_status, school_id 
FROM profiles 
ORDER BY created_at DESC;
```

**Check school assignments:**
```sql
SELECT p.email, p.role, s.name as school_name
FROM profiles p
LEFT JOIN schools s ON p.school_id = s.id;
```

**Verify RLS policies:**
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

### 2.3 Backup Procedures

**Automated:** Supabase performs automated backups

**Manual Backup:**
```bash
# Via Supabase CLI (if installed)
supabase db dump -f backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql

# Via pg_dump (if direct access)
pg_dump -h db.hgyznydxepjsvbjsirpv.supabase.co -U postgres -d postgres > backup.sql
```

---

## 3. User Management

### 3.1 QA Accounts

| Role | Email | Password | Purpose |
|---|---|---|---|
| Admin | admin@ascyn-smoke.test | SmokeTest123! | Admin testing |
| Instructor | instructor@ascyn-smoke.test | SmokeTest123! | Instructor testing |
| Student | student@ascyn-smoke.test | SmokeTest123! | Student testing |

### 3.2 Pilot Accounts

| Role | Name | Email | Status |
|---|---|---|---|
| Instructor | Tessa Myers | [Contact for credentials] | Active |
| Student | Patty Pineda | patty.pineda.drl@gmail.com | Active |

### 3.3 Create Test Account

**Via Supabase Dashboard:**
1. Authentication → Users → Add User
2. Enter email and password
3. Confirm email (if required)
4. Update profile in Table Editor:
   ```sql
   UPDATE profiles 
   SET role = 'student', approval_status = 'approved', school_id = '<school-id>'
   WHERE id = '<user-id>';
   ```

---

## 4. Monitoring & Debugging

### 4.1 Vercel Logs

**View Logs:**
```bash
npx vercel logs <deployment-url>
```

**Real-time Logs:**
```bash
npx vercel logs --follow
```

### 4.2 Supabase Logs

**Dashboard:** Logs → Postgres Logs / Auth Logs / API Logs

### 4.3 Common Issues

**Issue: 404 on protected route**
- Check middleware.ts is deployed
- Verify route exists in build manifest
- Check RLS policies allow access

**Issue: Authentication loop**
- Clear browser cookies
- Verify Supabase URL and keys
- Check middleware redirect logic

**Issue: 403 on API calls**
- Review RLS policies
- Verify user role and school_id
- Check service role key usage

---

## 5. Security Operations

### 5.1 Access Control

**Vercel Team:** gabebot24-5010s-projects  
**Supabase Organization:** jxclbwknnlkeontyeizw

### 5.2 Environment Variables

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Rotation Procedure:**
1. Generate new key in Supabase Dashboard
2. Update Vercel environment variables
3. Redeploy application
4. Verify functionality

### 5.3 Audit Logs

**Location:** Supabase Dashboard → Table Editor → audit_logs

**Review:**
```sql
SELECT * FROM audit_logs 
ORDER BY created_at DESC 
LIMIT 100;
```

---

## 6. Maintenance Procedures

### 6.1 Enable Maintenance Mode

**Via Database:**
```sql
UPDATE system_settings 
SET maintenance_mode = true, 
    maintenance_message = 'Scheduled maintenance in progress'
WHERE id = 1;
```

**Via Admin Portal:**
1. Login as admin
2. Navigate to /admin/maintenance
3. Toggle maintenance mode

### 6.2 Disable Maintenance Mode

```sql
UPDATE system_settings 
SET maintenance_mode = false 
WHERE id = 1;
```

---

## 7. Emergency Procedures

### 7.1 Site Down

1. Check Vercel status: https://www.vercel-status.com/
2. Check Supabase status: https://status.supabase.com/
3. Review recent deployments
4. Rollback if necessary
5. Contact support if platform issue

### 7.2 Database Issues

1. Check Supabase status
2. Review connection pool
3. Check RLS policies
4. Verify environment variables
5. Contact Supabase support if needed

### 7.3 Security Incident

1. Disable affected user accounts
2. Review audit logs
3. Rotate API keys if compromised
4. Document incident
5. Notify stakeholders

---

## 8. Contact Information

| Role | Responsibility | Contact |
|---|---|---|
| Project Owner | Final decisions | Gabriel Arcaina |
| Technical Lead | Development, Deployment | Ping (AI) |
| Vercel Support | Platform issues | https://vercel.com/support |
| Supabase Support | Database issues | https://supabase.com/support |

---

## 9. Change Management

### 9.1 Branch Protection

**Main Branch:** Protected, requires review

**Feature Branches:** 
- Create from `main`
- Prefix with `feature/`, `fix/`, or `chore/`
- Merge only after pilot review

### 9.2 Release Process

1. Develop in feature branch
2. Test locally
3. Create pull request
4. Review and approve
5. Merge to `main`
6. Auto-deploy to production
7. Verify deployment
8. Tag release if milestone

---

## 10. Documentation Links

| Document | Location |
|---|---|
| Production Baseline | `PRODUCTION_BASELINE.md` |
| Pilot Certification | `PILOT_READINESS_CERTIFICATION.md` |
| Technical Debt | `TECHNICAL_DEBT_REGISTER.md` |
| SITREP | `SITREP.md` |
| README | `README.md` |

---

**End of Operations Runbook**
