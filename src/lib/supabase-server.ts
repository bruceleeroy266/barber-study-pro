import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import {
  demoUser,
  demoProfile,
  demoInstructorProfile,
  demoApprenticeProfile,
  demoStudents,
  demoStudentProgress,
  demoStudentQuizAttempts,
  demoInstructorNotes,
  demoHourLogs,
  demoSchool,
  demoChapters,
  demoAttendanceRecords,
  demoInstructorAttendanceNotes,
  getDemoFlashcards,
  getDemoQuiz,
  getDemoQuizQuestions,
  getDemoProgress,
  getDemoQuizAttempts,
} from './demo-data'

const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

// Check if Supabase is properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const isSupabaseConfigured =
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('example.supabase.co') &&
  supabaseKey.length > 20

// Demo user/session for server-side mock
const demoSession = {
  access_token: 'demo-server-token',
  refresh_token: 'demo-refresh-token',
  expires_at: Date.now() + 86400000,
  user: demoUser,
}

// Build a mock query result from data
function mockResult<T>(data: T, error: { message: string; code?: string } | null = null) {
  return Promise.resolve({ data, error })
}

type MockRow = Record<string, unknown>
type MockFilter = (item: MockRow) => boolean
type MockResolve = (value: { data: unknown; error: unknown }) => void

function asMockRows(data: unknown[]): MockRow[] {
  return data as MockRow[]
}

// Create a chainable mock query builder
function createMockQueryBuilder(tableName: string) {
  let currentData: MockRow[] = []
  const filters: MockFilter[] = []
  let singleMode = false
  let maybeSingleMode = false
  let orderField: string | null = null
  let orderAsc = true
  let limitCount: number | null = null

  // Load initial data based on table
  switch (tableName) {
    case 'profiles':
      currentData = asMockRows([demoProfile, demoInstructorProfile, demoApprenticeProfile, ...demoStudents])
      break
    case 'schools':
      currentData = asMockRows([demoSchool])
      break
    case 'chapters':
      currentData = asMockRows([...demoChapters])
      break
    case 'flashcards':
      // Will be filtered by chapter_id via .eq()
      currentData = []
      break
    case 'quizzes':
      currentData = asMockRows(Object.values(getDemoQuiz('ch-1') || {}).filter(Boolean))
      break
    case 'quiz_questions':
      currentData = []
      break
    case 'quiz_attempts':
      currentData = asMockRows([...getDemoQuizAttempts('demo-user'), ...demoStudentQuizAttempts])
      break
    case 'student_progress':
      currentData = asMockRows([...getDemoProgress('demo-user'), ...demoStudentProgress])
      break
    case 'weak_areas':
      currentData = []
      break
    case 'instructor_notes':
      currentData = asMockRows([...demoInstructorNotes])
      break
    case 'hour_logs':
      currentData = asMockRows([...demoHourLogs])
      break
    case 'attendance_records':
      currentData = asMockRows([...demoAttendanceRecords])
      break
    case 'attendance_notes':
      currentData = asMockRows([...demoInstructorAttendanceNotes])
      break
    case 'final_exam_attempts':
      currentData = []
      break
    default:
      currentData = []
  }

  const builder = {
    select: (columns?: string) => {
      void columns
      return builder
    },

    eq: (field: string, value: unknown) => {
      filters.push((item) => item[field] === value)
      return builder
    },

    neq: (field: string, value: unknown) => {
      filters.push((item) => item[field] !== value)
      return builder
    },

    gt: (field: string, value: unknown) => {
      filters.push((item) => (item[field] as number) > (value as number))
      return builder
    },

    gte: (field: string, value: unknown) => {
      filters.push((item) => (item[field] as number) >= (value as number))
      return builder
    },

    lt: (field: string, value: unknown) => {
      filters.push((item) => (item[field] as number) < (value as number))
      return builder
    },

    lte: (field: string, value: unknown) => {
      filters.push((item) => (item[field] as number) <= (value as number))
      return builder
    },

    in: (field: string, values: unknown[]) => {
      filters.push((item) => values.includes(item[field]))
      return builder
    },

    is: (field: string, value: unknown) => {
      filters.push((item) => item[field] === value)
      return builder
    },

    order: (field: string, { ascending = true } = {}) => {
      orderField = field
      orderAsc = ascending
      return builder
    },

    limit: (count: number) => {
      limitCount = count
      return builder
    },

    single: () => {
      singleMode = true
      return builder
    },

    maybeSingle: () => {
      maybeSingleMode = true
      return builder
    },

    // Execute and return result
    then: (resolve: MockResolve) => {
      let result = [...currentData]

      // Apply all filters
      for (const filter of filters) {
        result = result.filter(filter)
      }

      // Special handling for flashcards - load from demo data when chapter_id is filtered
      if (tableName === 'flashcards') {
        // Re-load from demo data if we have a chapter_id match
        if (result.length === 0) {
          // Try to find chapter_id from the eq filter pattern
          // This is a simplified approach - we scan demo data for matching chapter
          for (const ch of demoChapters) {
            const flashcards = getDemoFlashcards(ch.id)
            if (flashcards.length > 0) {
              // Check if any filter would match
              const testItem = flashcards[0] as unknown as MockRow
              const allMatch = filters.every((f) => f(testItem))
              if (allMatch) {
                result = flashcards as unknown as MockRow[]
                break
              }
            }
          }
        }
      }

      // Special handling for quizzes - load from demo data
      if (tableName === 'quizzes' && result.length === 0) {
        for (const ch of demoChapters) {
          const quiz = getDemoQuiz(ch.id)
          if (quiz) {
            const allMatch = filters.every((f) => f(quiz as unknown as MockRow))
            if (allMatch) {
              result = [quiz as unknown as MockRow]
              break
            }
          }
        }
      }

      // Special handling for quiz_questions - load from demo data
      if (tableName === 'quiz_questions' && result.length === 0) {
        for (const quizId of Object.keys(getDemoQuizQuestions('quiz-1') ? { 'quiz-1': true } : {})) {
          const questions = getDemoQuizQuestions(quizId)
          if (questions.length > 0) {
            const testItem = questions[0] as unknown as MockRow
            const allMatch = filters.every((f) => f(testItem))
            if (allMatch) {
              result = questions as unknown as MockRow[]
              break
            }
          }
        }
        // Fallback: try all quiz IDs
        if (result.length === 0) {
          const allQuestions: MockRow[] = []
          for (let i = 1; i <= 21; i++) {
            const q = getDemoQuizQuestions(`quiz-${i}`)
            if (q.length > 0) {
              const matched = (q as unknown as MockRow[]).filter((item) => filters.every((f) => f(item)))
              allQuestions.push(...matched)
            }
          }
          result = allQuestions
        }
      }

      // Apply ordering
      if (orderField && result.length > 0) {
        result.sort((a, b) => {
          const aVal = a[orderField!]
          const bVal = b[orderField!]
          if (aVal === null || aVal === undefined) return orderAsc ? -1 : 1
          if (bVal === null || bVal === undefined) return orderAsc ? 1 : -1
          if (aVal < bVal) return orderAsc ? -1 : 1
          if (aVal > bVal) return orderAsc ? 1 : -1
          return 0
        })
      }

      // Apply limit
      if (limitCount !== null) {
        result = result.slice(0, limitCount)
      }

      // Return single or array
      if (singleMode) {
        if (result.length === 0) {
          return resolve({ data: null, error: { message: 'No rows found', code: 'PGRST116' } })
        }
        return resolve({ data: result[0], error: null })
      }

      if (maybeSingleMode) {
        return resolve({ data: result[0] || null, error: null })
      }

      return resolve({ data: result, error: null })
    },

    // Insert mock
    insert: (values: unknown) => {
      void values
      return {
        select: () => ({
          single: () => mockResult(null, null),
        }),
        then: (resolve: MockResolve) => resolve({ data: null, error: null }),
      }
    },

    // Upsert mock
    upsert: (values: unknown, options?: unknown) => {
      void values
      void options
      return {
        select: () => ({
          single: () => mockResult(null, null),
        }),
        then: (resolve: MockResolve) => resolve({ data: null, error: null }),
      }
    },

    // Update mock
    update: (values: unknown) => {
      void values
      return {
        eq: () => ({
          then: (resolve: MockResolve) => resolve({ data: null, error: null }),
        }),
        then: (resolve: MockResolve) => resolve({ data: null, error: null }),
      }
    },

    // Delete mock
    delete: () => ({
      eq: () => ({
        then: (resolve: MockResolve) => resolve({ data: null, error: null }),
      }),
      then: (resolve: MockResolve) => resolve({ data: null, error: null }),
    }),
  }

  return builder
}

// Mock server Supabase client for demo mode
function createMockServerClient() {
  return {
    auth: {
      getUser: async () => ({
        data: { user: demoUser },
        error: null,
      }),
      getSession: async () => ({
        data: { session: demoSession },
        error: null,
      }),
      signInWithPassword: async () => ({
        data: { user: demoUser, session: demoSession },
        error: null,
      }),
      signUp: async () => ({
        data: { user: demoUser, session: demoSession },
        error: null,
      }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }),
    },
    from: (tableName: string) => createMockQueryBuilder(tableName),
  }
}

export async function createClient() {
  // Demo mode: return mock client only if explicitly enabled AND Supabase not configured
  if (demoMode && !isSupabaseConfigured) {
    console.warn('[Barber Study Pro] Server demo mode active — Supabase not configured')
    return createMockServerClient() as unknown as ReturnType<typeof createServerClient>
  }

  // Production: require real Supabase
  if (!isSupabaseConfigured) {
    console.error('[Barber Study Pro] Server ERROR: Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or enable demo mode.')
    // Return mock to prevent crashes during build/startup
    return createMockServerClient() as unknown as ReturnType<typeof createServerClient>
  }

  // Real mode: create actual Supabase server client
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
