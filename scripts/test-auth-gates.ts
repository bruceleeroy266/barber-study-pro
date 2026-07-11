import { readFileSync } from 'fs'
import { join } from 'path'
import { getRoleBasedRedirect, validateLoginAccess } from '@/lib/auth-access'

const srcDir = join(process.cwd(), 'src')

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`)
    process.exitCode = 1
  } else {
    console.log(`✅ PASS: ${message}`)
  }
}

console.log('=== Authentication Gate Tests ===\n')

// 1. Public signup form must not exist in /signup page.
const signupPage = readFileSync(join(srcDir, 'app/(auth)/signup/page.tsx'), 'utf-8')
assert(!signupPage.includes('handleSignup'), 'Signup page has no registration handler')
assert(!signupPage.includes('signUp'), 'Signup page does not call Supabase signUp')
assert(signupPage.includes('Pilot Access Only'), 'Signup page shows invite-only message')
assert(signupPage.includes('/pilot'), 'Signup page links to pilot request')

// 2. Login page must not advertise public signup.
const loginPage = readFileSync(join(srcDir, 'app/(auth)/login/page.tsx'), 'utf-8')
assert(!loginPage.includes('href="/signup"'), 'Login page does not link to public signup')
assert(loginPage.includes('Pilot Login'), 'Login page uses pilot branding')
assert(loginPage.includes('validateLoginAccess'), 'Login page validates approval/disabled status')
assert(loginPage.includes('getRoleBasedRedirect'), 'Login page redirects by role')

// 3. Home page must use Pilot Login and footer link.
const homePage = readFileSync(join(srcDir, 'app/page.tsx'), 'utf-8')
assert(homePage.includes('Pilot Login'), 'Homepage shows Pilot Login link')
assert(homePage.includes('Request Pilot Access'), 'Homepage shows Request Pilot Access link')

// 4. Middleware must protect /dashboard, /instructor, /admin and enforce approval.
const middleware = readFileSync(join(srcDir, 'middleware.ts'), 'utf-8')
assert(middleware.includes("'/dashboard'"), 'Middleware protects /dashboard')
assert(middleware.includes("'/instructor'"), 'Middleware protects /instructor')
assert(middleware.includes("'/admin'"), 'Middleware protects /admin')
assert(middleware.includes('validateLoginAccess'), 'Middleware validates login access')
assert(middleware.includes('getRoleBasedRedirect'), 'Middleware redirects by role')

// 5. Role-based redirect logic.
assert(getRoleBasedRedirect('admin') === '/admin', 'Admin redirects to /admin')
assert(getRoleBasedRedirect('instructor') === '/instructor', 'Instructor redirects to /instructor')
assert(getRoleBasedRedirect('student') === '/dashboard', 'Student redirects to /dashboard')
assert(getRoleBasedRedirect('apprentice') === '/dashboard', 'Apprentice redirects to /dashboard')

// 6. Access validation logic.
assert(
  validateLoginAccess({ role: 'admin', approval_status: 'approved', is_disabled: false }).ok,
  'Approved admin can log in'
)
assert(
  !validateLoginAccess({ role: 'student', approval_status: 'pending', is_disabled: false }).ok,
  'Pending user cannot log in'
)
assert(
  !validateLoginAccess({ role: 'student', approval_status: 'rejected', is_disabled: false }).ok,
  'Rejected user cannot log in'
)
assert(
  !validateLoginAccess({ role: 'student', approval_status: 'approved', is_disabled: true }).ok,
  'Disabled user cannot log in'
)
assert(
  !validateLoginAccess(null).ok,
  'Missing profile cannot log in'
)

// 7. Admin creation script must read credentials from environment variables only.
const adminScript = readFileSync(join(process.cwd(), 'scripts/create-admin-user.ts'), 'utf-8')
assert(
  adminScript.includes('process.env.ASCYN_ADMIN_EMAIL') &&
    adminScript.includes('process.env.ASCYN_ADMIN_PASSWORD') &&
    adminScript.includes('process.env.SUPABASE_SERVICE_ROLE_KEY'),
  'Admin script reads credentials from environment variables'
)
assert(
  !adminScript.match(/['"][A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}['"]/) &&
    !adminScript.match(/password['"]\s*[:=]\s*['"]/) &&
    !adminScript.includes('admin@ascynpro.com'),
  'Admin script does not hardcode credentials'
)

console.log('\n=== Auth Gate Tests Complete ===')
if (process.exitCode === 1) {
  console.log('One or more tests failed.')
} else {
  console.log('All tests passed.')
}
