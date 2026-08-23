/**
 * Debug test to verify environment loading
 */

import { test, expect } from 'vitest'

test('environment variables are loaded', () => {
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('ASCYN_TEST_ENVIRONMENT:', process.env.ASCYN_TEST_ENVIRONMENT)
  console.log('TEST_SCHOOL_A_ID:', process.env.TEST_SCHOOL_A_ID)
  
  expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined()
  expect(process.env.ASCYN_TEST_ENVIRONMENT).toBe('true')
})
