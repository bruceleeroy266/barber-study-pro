'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Role = 'student' | 'instructor' | 'apprentice'

interface SchoolOption {
  id: string
  name: string
}

export default function SignupPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [schoolName, setSchoolName] = useState('')
  const [schools, setSchools] = useState<SchoolOption[]>([])
  const [selectedSchoolId, setSelectedSchoolId] = useState('')
  const [barberShopName, setBarberShopName] = useState('')
  const [mentorName, setMentorName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Load existing schools for student selection
  useEffect(() => {
    async function loadSchools() {
      try {
        const { data, error } = await supabase
          .from('schools')
          .select('id, name')
          .order('name', { ascending: true })

        if (!error && data) {
          setSchools(data)
        }
      } catch {
        // Silently fail — demo mode or missing table
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

    if (role === 'student' && !schoolName.trim() && !selectedSchoolId) {
      setError('Please select or enter your school')
      setLoading(false)
      return
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

        if (role === 'instructor') {
          const { data: schoolData, error: schoolError } = await supabase
            .from('schools')
            .insert({
              name: schoolName.trim(),
              created_by: signUpData.user.id,
            })
            .select('id')
            .single()

          if (!schoolError && schoolData) {
            schoolId = schoolData.id
          }
        } else if (role === 'student') {
          if (selectedSchoolId) {
            schoolId = selectedSchoolId
          } else if (schoolName.trim()) {
            const { data: existing } = await supabase
              .from('schools')
              .select('id')
              .eq('name', schoolName.trim())
              .single()

            if (existing) {
              schoolId = existing.id
            } else {
              const { data: newSchool } = await supabase
                .from('schools')
                .insert({ name: schoolName.trim() })
                .select('id')
                .single()
              if (newSchool) schoolId = newSchool.id
            }
          }
        }
        // Apprentice: schoolId stays null unless they picked one

        await supabase.from('profiles').upsert({
          id: signUpData.user.id,
          email: signUpData.user.email,
          full_name: fullName || signUpData.user.email,
          role,
          school_id: schoolId,
          barber_shop_name: barberShopName.trim() || null,
          mentor_name: mentorName.trim() || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
        })
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  if (success) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-white mb-4">Account Created!</h1>
        <p className="text-gray-400 mb-6">
          {isDemoMode
            ? 'Your account is ready. Start studying right away!'
            : 'Please check your email to verify your account. Once verified, you can sign in.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isDemoMode && (
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
        <p className="text-gray-400">Start your barbering education journey</p>
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
                setBarberShopName('')
                setMentorName('')
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
                setRole('instructor')
                setSchoolName('')
                setSelectedSchoolId('')
                setBarberShopName('')
                setMentorName('')
              }}
              className={`px-3 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                role === 'instructor'
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                  : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
              }`}
            >
              Instructor
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('apprentice')
                setSchoolName('')
                setSelectedSchoolId('')
                setBarberShopName('')
                setMentorName('')
              }}
              className={`px-3 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                role === 'apprentice'
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                  : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
              }`}
            >
              Apprentice
            </button>
          </div>
          {role === 'apprentice' && (
            <p className="text-xs text-gray-500 mt-2">
              Independent apprentices and barber-shop learners can sign up without a school.
            </p>
          )}
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

        {/* School / Apprentice Fields */}
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
        ) : role === 'student' ? (
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
        ) : (
          /* Apprentice fields */
          <div className="space-y-4">
            <div>
              <label htmlFor="schoolSelectApprentice" className="block text-sm font-medium text-gray-300 mb-2">
                School <span className="text-gray-500">(optional)</span>
              </label>
              <select
                id="schoolSelectApprentice"
                value={selectedSchoolId}
                onChange={(e) => {
                  setSelectedSchoolId(e.target.value)
                  if (e.target.value) setSchoolName('')
                }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
              >
                <option value="">-- Optional: select a school --</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="barberShopName" className="block text-sm font-medium text-gray-300 mb-2">
                Barber Shop Name <span className="text-gray-500">(optional)</span>
              </label>
              <input
                id="barberShopName"
                type="text"
                value={barberShopName}
                onChange={(e) => setBarberShopName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                placeholder="e.g., Razor Kings"
              />
            </div>
            <div>
              <label htmlFor="mentorName" className="block text-sm font-medium text-gray-300 mb-2">
                Mentor / Instructor Name <span className="text-gray-500">(optional)</span>
              </label>
              <input
                id="mentorName"
                type="text"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                placeholder="e.g., Malenny"
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
