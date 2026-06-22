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
  demoSchool,
  demoChapters,
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
function mockResult(data: any, error: any = null) {
  return Promise.resolve({ data, error })
}

// Create a chainable mock query builder
function createMockQueryBuilder(tableName: string) {
  let currentData: any[] = []
  let filters: Array<(item: any) => boolean> = []
  let singleMode = false
  let maybeSingleMode = false
  let orderField: string | null = null
  let orderAsc = true
  let limitCount: number | null = null

  // Load initial data based on table
  switch (tableName) {
    case 'profiles':
      currentData = [demoProfile, demoInstructorProfile, demoApprenticeProfile, ...demoStudents]
      break
    case 'schools':
      currentData = [demoSchool]
      break
    case 'chapters':
      currentData = [...demoChapters]
      break
    case 'flashcards':
      // Will be filtered by chapter_id via .eq()
      currentData = []
      break
    case 'quizzes':
      currentData = Object.values(getDemoQuiz('ch-1') || {}).filter(Boolean)
      break
    case 'quiz_questions':
      currentData = []
      break
    case 'quiz_attempts':
      currentData = [...getDemoQuizAttempts('demo-user'), ...demoStudentQuizAttempts]
      break
    case 'student_progress':
      currentData = [...getDemoProgress('demo-user'), ...demoStudentProgress]
      break
    case 'weak_areas':
      currentData = []
      break
    case 'instructor_notes':
      currentData = [...demoInstructorNotes]
      break
    case 'final_exam_attempts':
      currentData = []
      break
    default:
      currentData = []
  }

  const builder = {
    select: (_columns?: string) => builder,

    eq: (field: string, value: any) => {
      filters.push((item) => item[field] === value)
      return builder
    },

    neq: (field: string, value: any) => {
      filters.push((item) => item[field] !== value)
      return builder
    },

    gt: (field: string, value: any) => {
      filters.push((item) => item[field] > value)
      return builder
    },

    gte: (field: string, value: any) => {
      filters.push((item) => item[field] >= value)
      return builder
    },

    lt: (field: string, value: any) => {
      filters.push((item) => item[field] < value)
      return builder
    },

    lte: (field: string, value: any) => {
      filters.push((item) => item[field] <= value)
      return builder
    },

    in: (field: string, values: any[]) => {
      filters.push((item) => values.includes(item[field]))
      return builder
    },

    is: (field: string, value: any) => {
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
    then: (resolve: any) => {
      let result = [...currentData]

      // Apply all filters
      for (const filter of filters) {
        result = result.filter(filter)
      }

      // Special handling for flashcards - load from demo data when chapter_id is filtered
      if (tableName === 'flashcards') {
        const chapterFilter = filters.find(
          () => true // We need to capture chapter_id from eq call
        )
        // Re-load from demo data if we have a chapter_id match
        const chapterIdEq = currentData.length === 0 ? null : currentData[0]?.chapter_id
        if (result.length === 0) {
          // Try to find chapter_id from the eq filter pattern
          // This is a simplified approach - we scan demo data for matching chapter
          for (const ch of demoChapters) {
            const flashcards = getDemoFlashcards(ch.id)
            if (flashcards.length > 0) {
              // Check if any filter would match
              const testItem = flashcards[0]
              const allMatch = filters.every((f) => f(testItem))
              if (allMatch) {
                result = flashcards
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
            const allMatch = filters.every((f) => f(quiz))
            if (allMatch) {
              result = [quiz]
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
            const testItem = questions[0]
            const allMatch = filters.every((f) => f(testItem))
            if (allMatch) {
              result = questions
              break
            }
          }
        }
        // Fallback: try all quiz IDs
        if (result.length === 0) {
          const allQuestions: any[] = []
          for (let i = 1; i <= 21; i++) {
            const q = getDemoQuizQuestions(`quiz-${i}`)
            if (q.length > 0) {
              const matched = q.filter((item) => filters.every((f) => f(item)))
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
    insert: (_values: any) => ({
      select: () => ({
        single: () => mockResult(null, null),
      }),
      then: (resolve: any) => resolve({ data: null, error: null }),
    }),

    // Upsert mock
    upsert: (_values: any, _options?: any) => ({
      select: () => ({
        single: () => mockResult(null, null),
      }),
      then: (resolve: any) => resolve({ data: null, error: null }),
    }),

    // Update mock
    update: (_values: any) => ({
      eq: () => ({
        then: (resolve: any) => resolve({ data: null, error: null }),
      }),
      then: (resolve: any) => resolve({ data: null, error: null }),
    }),

    // Delete mock
    delete: () => ({
      eq: () => ({
        then: (resolve: any) => resolve({ data: null, error: null }),
      }),
      then: (resolve: any) => resolve({ data: null, error: null }),
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
    return createMockServerClient() as any
  }

  // Production: require real Supabase
  if (!isSupabaseConfigured) {
    console.error('[Barber Study Pro] Server ERROR: Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or enable demo mode.')
    // Return mock to prevent crashes during build/startup
    return createMockServerClient() as any
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
