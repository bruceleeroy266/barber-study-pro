/**
 * Test Actor Definitions for Phase 7A Slice 7 Integration Tests
 * 
 * These actors are deterministic and reproducible across test runs.
 * They are created via Supabase Auth Admin API during test setup.
 */

export type AppRole = 'admin' | 'school_admin' | 'instructor' | 'student'

export interface TestActor {
  id: string
  email: string
  password: string
  fullName: string
  role: AppRole
  schoolId: string | null
  profileId: string
  domainId?: string // student_id or instructor_id
}

export interface TestSchool {
  id: string
  name: string
  slug: string
}

export interface TestProgram {
  id: string
  schoolId: string
  name: string
}

// ============================================================================
// TEST SCHOOLS
// ============================================================================

export const TEST_SCHOOLS: Record<string, TestSchool> = {
  SCHOOL_A: {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Test Academy Alpha',
    slug: 'test-academy-alpha',
  },
  SCHOOL_B: {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'Test Academy Beta',
    slug: 'test-academy-beta',
  },
} as const

// ============================================================================
// TEST PROGRAMS
// ============================================================================

export const TEST_PROGRAMS: Record<string, TestProgram> = {
  PROGRAM_A: {
    id: 'aaaaaaaa-1111-1111-1111-111111111111',
    schoolId: TEST_SCHOOLS.SCHOOL_A.id,
    name: 'Barbering Alpha',
  },
  PROGRAM_B: {
    id: 'bbbbbbbb-1111-1111-1111-111111111111',
    schoolId: TEST_SCHOOLS.SCHOOL_B.id,
    name: 'Barbering Beta',
  },
} as const

// ============================================================================
// TEST ACTORS
// ============================================================================

export const TEST_ACTORS: Record<string, TestActor> = {
  PLATFORM_ADMIN: {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'platform-admin@ascyn-test.local',
    password: 'Test1234!',
    fullName: 'Platform Admin',
    role: 'admin',
    schoolId: null,
    profileId: '00000000-0000-0000-0000-000000000001',
  },
  SCHOOL_ADMIN_A: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'school-admin-a@ascyn-test.local',
    password: 'Test1234!',
    fullName: 'School Admin A',
    role: 'school_admin',
    schoolId: TEST_SCHOOLS.SCHOOL_A.id,
    profileId: '11111111-1111-1111-1111-111111111111',
  },
  INSTRUCTOR_A: {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'instructor-a@ascyn-test.local',
    password: 'Test1234!',
    fullName: 'Instructor A',
    role: 'instructor',
    schoolId: TEST_SCHOOLS.SCHOOL_A.id,
    profileId: '22222222-2222-2222-2222-222222222222',
    domainId: '22222222-2222-2222-2222-222222222222',
  },
  STUDENT_A: {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'student-a@ascyn-test.local',
    password: 'Test1234!',
    fullName: 'Student A',
    role: 'student',
    schoolId: TEST_SCHOOLS.SCHOOL_A.id,
    profileId: '33333333-3333-3333-3333-333333333333',
    domainId: '33333333-3333-3333-3333-333333333333',
  },
  SCHOOL_ADMIN_B: {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'school-admin-b@ascyn-test.local',
    password: 'Test1234!',
    fullName: 'School Admin B',
    role: 'school_admin',
    schoolId: TEST_SCHOOLS.SCHOOL_B.id,
    profileId: '44444444-4444-4444-4444-444444444444',
  },
  INSTRUCTOR_B: {
    id: '55555555-5555-5555-5555-555555555555',
    email: 'instructor-b@ascyn-test.local',
    password: 'Test1234!',
    fullName: 'Instructor B',
    role: 'instructor',
    schoolId: TEST_SCHOOLS.SCHOOL_B.id,
    profileId: '55555555-5555-5555-5555-555555555555',
    domainId: '55555555-5555-5555-5555-555555555555',
  },
  STUDENT_B: {
    id: '66666666-6666-6666-6666-666666666666',
    email: 'student-b@ascyn-test.local',
    password: 'Test1234!',
    fullName: 'Student B',
    role: 'student',
    schoolId: TEST_SCHOOLS.SCHOOL_B.id,
    profileId: '66666666-6666-6666-6666-666666666666',
    domainId: '66666666-6666-6666-6666-666666666666',
  },
} as const

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getActorsBySchool(schoolId: string): TestActor[] {
  return Object.values(TEST_ACTORS).filter(actor => actor.schoolId === schoolId)
}

export function getActorsByRole(role: AppRole): TestActor[] {
  return Object.values(TEST_ACTORS).filter(actor => actor.role === role)
}

export function getSchoolAActors(): TestActor[] {
  return getActorsBySchool(TEST_SCHOOLS.SCHOOL_A.id)
}

export function getSchoolBActors(): TestActor[] {
  return getActorsBySchool(TEST_SCHOOLS.SCHOOL_B.id)
}

export function getCrossSchoolPairs(): Array<{ attacker: TestActor; targetSchool: TestSchool }> {
  const pairs: Array<{ attacker: TestActor; targetSchool: TestSchool }> = []
  
  // School A actors attacking School B
  for (const actor of getSchoolAActors()) {
    pairs.push({ attacker: actor, targetSchool: TEST_SCHOOLS.SCHOOL_B })
  }
  
  // School B actors attacking School A
  for (const actor of getSchoolBActors()) {
    pairs.push({ attacker: actor, targetSchool: TEST_SCHOOLS.SCHOOL_A })
  }
  
  return pairs
}
