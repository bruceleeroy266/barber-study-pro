# Code Flow Analysis - Instructor Authentication

**Date:** 2026-08-01  
**Purpose:** Document the exact code paths for instructor authentication before verification

---

## Complete Authentication Flow

### Step 1: Login Page (`src/app/(auth)/login/page.tsx`)

```typescript
// User submits credentials
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

// After successful authentication:
if (data.user) {
  // 1. Check email verification
  if (data.user.email_confirmed_at === null) {
    await supabase.auth.signOut()
    router.push(`/auth/verify-email?email=...`)
    return
  }

  // 2. Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single()

  // 3. Validate access
  const access = validateLoginAccess(profile)
  if (!access.ok) {
    await supabase.auth.signOut()
    setError(access.errorKey)
    return
  }

  // 4. Check password change requirement
  if (profile.requires_password_change) {
    router.push('/update-password?reason=required')
    return
  }

  // 5. Determine redirect
  const roleRedirect = getRoleBasedRedirect(profile.role)
  // instructor → '/instructor'
  // admin → '/admin'
  // student/apprentice → '/dashboard'
  
  const target = redirect && redirect !== '/dashboard' && canAccessRoute(profile.role, redirect)
    ? redirect
    : roleRedirect

  // 6. Full page reload to target
  window.location.href = target
}
```

### Step 2: Middleware (`src/middleware.ts`)

```typescript
// For protected routes (/instructor, /dashboard, /admin, /school):
if (isProtected && user) {
  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, approval_status, is_disabled, requires_password_change')
    .eq('id', user.id)
    .single()

  // Validate access
  const access = validateLoginAccess(profile)
  if (!access.ok) {
    // Redirect to /login with error
    return NextResponse.redirect('/login?error=...')
  }

  // Check role-based access
  if (isInstructorRoute(pathname)) {
    if (!isInstructorOrAdmin(profile.role)) {
      return NextResponse.redirect(getRoleBasedRedirect(profile.role))
    }
  }
}
```

### Step 3: Instructor Page (`src/app/instructor/page.tsx`)

```typescript
// On page load:
const { data: profile } = await supabase
  .from('profiles')
  .select('role, school_id, full_name, schools(*)')
  .eq('id', user.id)
  .single()

// CRITICAL CHECK:
if (!profile || !isInstructorOrAdmin(profile.role)) {
  redirect('/dashboard')  // Not an instructor
}

if (!profile.school_id) {
  redirect('/dashboard')  // No school assigned
}

// If we get here, render instructor dashboard
```

### Step 4: Pending Approval Page (`src/app/pending-approval/page.tsx`)

```typescript
// On page load:
const { data: profile } = await supabase
  .from('profiles')
  .select('role, school_id')
  .eq('id', user.id)
  .single()

// Only instructors can be pending
if (!profile || profile.role !== 'instructor') {
  redirect('/dashboard')
}

// Check school status
let schoolActive = false
if (profile.school_id) {
  const { data: school } = await supabase
    .from('schools')
    .select('is_active')
    .eq('id', profile.school_id)
    .single()
  schoolActive = school?.is_active ?? false
}

// If school is active, redirect to instructor
if (schoolActive) {
  redirect('/instructor')
}

// Otherwise, show pending approval page
```

---

## Possible Navigation Sequences

### Sequence 1: Happy Path (Instructor with Active School)

```
POST /auth/v1/token?grant_type=password
  ↓ 200 OK
GET /instructor
  ↓ 200 OK (renders instructor dashboard)
```

**Conditions:**
- `profiles.role = 'instructor'`
- `profiles.approval_status = 'approved'`
- `profiles.is_disabled = false`
- `profiles.school_id = <valid-uuid>`
- `schools.is_active = true`

### Sequence 2: Pending Approval (No School or Inactive School)

```
POST /auth/v1/token?grant_type=password
  ↓ 200 OK
GET /instructor
  ↓ 302 Found
GET /dashboard
  ↓ 200 OK (or another redirect)
```

Wait - let me re-check. The login page redirects to `/instructor`, but the instructor page redirects to `/dashboard` if no school_id. So:

```
POST /auth/v1/token?grant_type=password
  ↓ 200 OK
GET /instructor
  ↓ 302 Found (redirect to /dashboard because no school_id)
GET /dashboard
  ↓ 200 OK
```

**But wait** - the `/pending-approval` page exists. How does the user get there?

Looking at the code again... I don't see any code that redirects TO `/pending-approval`. The pending-approval page only redirects AWAY (to `/dashboard` or `/instructor`).

**This means:** The user must be navigating directly to `/pending-approval`, OR there's a redirect I haven't found.

Let me search for references to `/pending-approval`:

### Sequence 3: Direct Navigation to Pending Approval

If the user navigates directly to `/pending-approval`:

```
GET /pending-approval
  ↓ 200 OK (if school_id is NULL or schools.is_active = false)
  OR
  ↓ 302 Found → /instructor (if school is active)
  OR
  ↓ 302 Found → /dashboard (if not an instructor)
```

---

## Key Finding: Dashboard Redirects to /pending-approval

**File:** `src/app/(dashboard)/dashboard/page.tsx` (lines 55-68)

```typescript
// Route users to the correct home based on role and school approval state.
if (profile.role === 'instructor') {
  if (profile.school_id) {
    const { data: school } = await supabase
      .from('schools')
      .select('is_active')
      .eq('id', profile.school_id)
      .single()
    if (school && !school.is_active) {
      redirect('/pending-approval')  // <-- HERE!
    }
  } else {
    // Instructor with no school cannot access the instructor dashboard yet.
    redirect('/pending-approval')  // <-- AND HERE!
  }
}
```

**This is the missing link!** The dashboard page redirects instructors to `/pending-approval` when:
1. `profile.school_id` is NULL, OR
2. `schools.is_active` is false

---

## Complete Navigation Sequences

### Sequence 1: Happy Path (Instructor with Active School)

```
POST /auth/v1/token?grant_type=password
  ↓ 200 OK
GET /instructor
  ↓ 200 OK (renders instructor dashboard)
```

**Conditions:**
- `profiles.role = 'instructor'`
- `profiles.approval_status = 'approved'`
- `profiles.is_disabled = false`
- `profiles.school_id = <valid-uuid>`
- `schools.is_active = true`

### Sequence 2: Pending Approval (No School or Inactive School)

```
POST /auth/v1/token?grant_type=password
  ↓ 200 OK
GET /instructor
  ↓ 302 Found (redirect to /dashboard by middleware? No...)
```

Wait - let me trace this more carefully. The login page redirects to `/instructor`, not `/dashboard`. So:

```
POST /auth/v1/token?grant_type=password
  ↓ 200 OK
GET /instructor
  ↓ 302 Found (instructor page redirects to /dashboard if no school_id)
GET /dashboard
  ↓ 302 Found (dashboard page redirects to /pending-approval if instructor with no school)
GET /pending-approval
  ↓ 200 OK (renders pending approval page)
```

**OR** if the middleware redirects first:

```
POST /auth/v1/token?grant_type=password
  ↓ 200 OK
GET /instructor
  ↓ 302 Found (middleware redirects to /dashboard? No, middleware allows instructors)
```

Actually, looking at the middleware again:
- Middleware allows instructors to access `/instructor`
- The instructor page redirects to `/dashboard` if no `school_id`
- The dashboard page redirects to `/pending-approval` if instructor with no school

So the full sequence is:

```
POST /auth/v1/token?grant_type=password
  ↓ 200 OK
GET /instructor
  ↓ 302 Found → /dashboard (instructor page: no school_id)
GET /dashboard
  ↓ 302 Found → /pending-approval (dashboard page: instructor with no school)
GET /pending-approval
  ↓ 200 OK (renders pending approval page)
```

**Conditions:**
- `profiles.role = 'instructor'`
- `profiles.approval_status = 'approved'`
- `profiles.is_disabled = false`
- `profiles.school_id = NULL` OR `schools.is_active = false`

### Sequence 3: Student/Apprentice

```
POST /auth/v1/token?grant_type=password
  ↓ 200 OK
GET /dashboard
  ↓ 200 OK (renders student dashboard)
```

**Conditions:**
- `profiles.role = 'student'` OR `'apprentice'`
- `profiles.approval_status = 'approved'`
- `profiles.is_disabled = false`

---
