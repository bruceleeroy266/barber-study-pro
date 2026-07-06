'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'

type Role = 'student' | 'instructor' | 'apprentice'

interface SchoolOption {
  id: string
  name: string
}

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [schoolName, setSchoolName] = useState('')
  const [schools, setSchools] = useState<SchoolOption[]>([])
  const [selectedSchoolId, setSelectedSchoolId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [pendingSchool, setPendingSchool] = useState(false)

  // Load existing active schools for student selection.
  // Phase 13C.1: pending/inactive schools must not accept student registrations.
  useEffect(() => {
    async function loadSchools() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'not-set'
        console.log('[Signup] Loading active schools from:', supabaseUrl)

        const { data, error } = await supabase
          .from('schools')
          .select('id, name')
          .eq('is_active', true)
          .order('name', { ascending: true })

        if (error) {
          console.warn('[Signup] Schools query error:', error.message)
          return
        }

        console.log('[Signup] Active schools loaded:', data?.length ?? 0, data)
        setSchools(data || [])
      } catch (err) {
        console.warn('[Signup] Failed to load schools:', err)
      }
    }
    loadSchools()
  }, [])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (role === 'instructor' && !schoolName.trim()) {
      setError('Please enter your school name')
      setLoading(false)
      return
    }

    if ((role === 'student' || role === 'apprentice') && !schoolName.trim() && !selectedSchoolId) {
      setError('Please select or enter your school')
      setLoading(false)
      return
    }

    if ((role === 'student' || role === 'apprentice') && schoolName.trim() && !selectedSchoolId) {
      // We will attempt to match the school name on submit. If no match is
      // found, an error is shown after the lookup.
    }

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      })

      if (signUpError) throw signUpError

      if (signUpData.user) {
        let schoolId: string | null = null
        let instructorSchoolPending = false

        if (role === 'instructor') {
          const demoMode = isExplicitDemoMode()
          const supabaseConfigured = isSupabaseConfigured()

          if (demoMode && !supabaseConfigured) {
            // Safe local demo: create an active school immediately.
            const { data: schoolData, error: schoolError } = await supabase
              .from('schools')
              .insert({
                name: schoolName.trim(),
                created_by: signUpData.user.id,
                is_active: true,
              })
              .select('id')
              .single()

            if (!schoolError && schoolData) {
              schoolId = schoolData.id
            }
          } else {
            // Production (or misconfigured demo + real Supabase): create the
            // school in a pending/inactive state pending admin approval.
            const { data: schoolData, error: schoolError } = await supabase
              .from('schools')
              .insert({
                name: schoolName.trim(),
                created_by: signUpData.user.id,
                is_active: false,
              })
              .select('id')
              .single()

            if (!schoolError && schoolData) {
              schoolId = schoolData.id
              instructorSchoolPending = true
            }
          }
        } else if (role === 'student' || role === 'apprentice') {
          // Students and apprentices must select an existing school; they cannot create schools
          // during self-registration to prevent unauthorized school sprawl.
          if (selectedSchoolId) {
            schoolId = selectedSchoolId
          } else if (schoolName.trim()) {
            const { data: existing } = await supabase
              .from('schools')
              .select('id')
              .eq('name', schoolName.trim())
              .eq('is_active', true)
              .single()

            if (existing) {
              schoolId = existing.id
            }
            // If no existing school matches, schoolId remains null and the
            // signup flow will surface an error below.
          }
        }

        // Defensive validation: students and apprentices must belong to a school.
        if ((role === 'student' || role === 'apprentice') && !schoolId) {
          setError('We could not find a matching school. Please select a school from the list or contact your administrator.')
          setLoading(false)
          return
        }

        await supabase.from('profiles').upsert({
          id: signUpData.user.id,
          email: signUpData.user.email,
          full_name: fullName || signUpData.user.email,
          role,
          school_id: schoolId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
        })

        setPendingSchool(instructorSchoolPending)
        setSuccess(true)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  const isDemoMode = isExplicitDemoMode()

  if (success) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-white mb-4">
          {pendingSchool ? 'Account Created — Pending Approval' : 'Account Created!'}
        </h1>
        <p className="text-gray-400 mb-6">
          {pendingSchool
            ? 'Your school has been submitted for administrator approval. You will receive an email once your school is activated.'
            : isDemoMode
            ? 'Your account is ready. Start studying right away!'
            : 'Please check your email to verify your account. Once verified, you can sign in.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isDemoMode && !pendingSchool && (
            <Link
              href="/dashboard"
              className="inline-block py-3 px-6 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-gray-950 font-semibold rounded-lg hover:from-[#F4E4A6] hover:to-[#D4AF37] transition-all duration-200"
            >
              Start Studying →
            </Link>
          )}
          <Link
            href="/login"
            className="inline-block py-3 px-6 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-200 border border-gray-600"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">✂️</div>
        <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-gray-400">Start your professional education journey</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-5">
        {/* Role Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            I am a...
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                setRole('student')
                setSchoolName('')
                setSelectedSchoolId('')
              }}
              className={`px-3 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                role === 'student'
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                  : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('apprentice')
                setSchoolName('')
                setSelectedSchoolId('')
              }}
              className={`px-3 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                role === 'apprentice'
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                  : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
              }`}
            >
              Apprentice
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('instructor')
                setSchoolName('')
                setSelectedSchoolId('')
              }}
              className={`px-3 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                role === 'instructor'
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                  : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
              }`}
            >
              Instructor
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
            placeholder="you@example.com"
          />
        </div>

        {/* School / Student Fields */}
        {role === 'instructor' ? (
          <div>
            <label htmlFor="schoolName" className="block text-sm font-medium text-gray-300 mb-2">
              School Name <span className="text-gray-500">(create or designate your school)</span>
            </label>
            <input
              id="schoolName"
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
              placeholder="e.g., Oklahoma Barber Academy"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label htmlFor="schoolSelect" className="block text-sm font-medium text-gray-300 mb-2">
                Select Your School
              </label>
              <select
                id="schoolSelect"
                value={selectedSchoolId}
                onChange={(e) => {
                  setSelectedSchoolId(e.target.value)
                  if (e.target.value) setSchoolName('')
                }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
              >
                <option value="">-- Select a school --</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gray-900 text-gray-500">or enter manually</span>
              </div>
            </div>
            <div>
              <input
                id="schoolName"
                type="text"
                value={schoolName}
                onChange={(e) => {
                  setSchoolName(e.target.value)
                  if (e.target.value) setSelectedSchoolId('')
                }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                placeholder="Enter your school name"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
            placeholder="••••••••"
          />
          <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-gray-950 font-semibold rounded-lg hover:from-[#F4E4A6] hover:to-[#D4AF37] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#D4AF37]/20"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-[#D4AF37] hover:text-[#F4E4A6] font-medium transition-colors">
          Sign in
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800 text-center">
        <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
