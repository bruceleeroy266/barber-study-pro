'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { trackEvent, trackPageView } from '@/lib/analytics/events'
import { storeUtmParams } from '@/lib/analytics/utm'

export default function PilotPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    storeUtmParams()
    trackPageView('pilot')
  }, [])

  const [formData, setFormData] = useState({
    schoolName: '',
    contactName: '',
    email: '',
    phone: '',
    programType: '',
    cohortSize: '',
    startDate: '',
    message: '',
    website: '', // honeypot
  })

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'pilot',
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }

      trackEvent('pilot_form_submitted', {
        program_type: formData.programType,
        has_message: formData.message.trim().length > 0,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="ASCYN PRO" className="h-7 w-auto" />
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                onClick={() => trackEvent('pilot_login_clicked')}
                className="hidden sm:inline-flex text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/demo"
                onClick={() => trackEvent('demo_clicked')}
                className="px-4 py-2 text-sm font-semibold text-white border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="text-[#D4AF37] font-semibold mb-4">SCHOOL PILOT PROGRAM</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            Partner With ASCYN PRO
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join a small group of Oklahoma schools piloting ASCYN PRO for the upcoming semester. 
            No financial commitment. Full support included.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <div className="bg-[#111111] border border-[#D4AF37]/30 rounded-2xl p-8 md:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-3xl mx-auto mb-6">
                ✓
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Thank You!
              </h2>
              {formData.programType === 'Barbering' ? (
                <p className="text-gray-400 text-lg mb-8">
                  Your Barbering pilot request has been received successfully.
                  <br /><br />
                  Our team will review your request and contact you within 10 business days.
                </p>
              ) : (
                <p className="text-gray-400 text-lg mb-8">
                  Your request has been added to our Early Access list.
                  <br /><br />
                  We&apos;ll notify you as soon as your selected program becomes available.
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/demo"
                  onClick={() => trackEvent('demo_clicked')}
                  className="px-8 py-4 bg-[#D4AF37] text-[#0a0a0a] font-bold rounded-xl hover:bg-[#F4E4A6] transition-all"
                >
                  View Demo
                </Link>
                <Link
                  href="/"
                  className="px-8 py-4 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition-all border border-white/10"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="schoolName" className="block text-sm font-medium text-gray-300 mb-2">
                      School Name *
                    </label>
                    <input
                      type="text"
                      id="schoolName"
                      name="schoolName"
                      required
                      value={formData.schoolName}
                      onChange={(e) => updateField('schoolName', e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
                      placeholder="Oklahoma Barber Academy"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-300 mb-2">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      required
                      value={formData.contactName}
                      onChange={(e) => updateField('contactName', e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
                      placeholder="Jane Smith"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
                      placeholder="jane@school.edu"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Program availability banner */}
                <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-xl p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <div>
                      <h3 className="text-[#D4AF37] font-semibold mb-1">Currently Piloting Barbering</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        ASCYN PRO is currently accepting pilot partners for Barbering only.
                        Cosmetology, Esthetics, Nail Technology, and Instructor Training are actively being developed.
                        You are welcome to request early access and we&apos;ll notify you as soon as your selected program becomes available.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="programType" className="block text-sm font-medium text-gray-300 mb-2">
                      Program Type *
                    </label>
                    <select
                      id="programType"
                      name="programType"
                      required
                      value={formData.programType}
                      onChange={(e) => updateField('programType', e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
                    >
                      <option value="">Select a program</option>
                      <option value="Barbering">✅ Barbering — Available Now</option>
                      <option value="Cosmetology">🟡 Cosmetology — Coming Soon</option>
                      <option value="Esthetics">🟡 Esthetics — Coming Soon</option>
                      <option value="Nail Technology">🟡 Nail Technology — Coming Soon</option>
                      <option value="Instructor Training">🟡 Instructor Training — Coming Soon</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="cohortSize" className="block text-sm font-medium text-gray-300 mb-2">
                      Estimated Cohort Size
                    </label>
                    <input
                      type="number"
                      id="cohortSize"
                      name="cohortSize"
                      min="1"
                      value={formData.cohortSize}
                      onChange={(e) => updateField('cohortSize', e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={(e) => updateField('startDate', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message / Notes
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors resize-none"
                    placeholder="Tell us about your school, your current challenges, or any questions you have about the pilot."
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={() => trackEvent('pilot_request_clicked')}
                    className="w-full px-8 py-4 bg-[#D4AF37] text-[#0a0a0a] font-bold rounded-xl hover:bg-[#F4E4A6] transition-all shadow-lg shadow-[#D4AF37]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Submit Pilot Inquiry'}
                  </button>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  Submissions are sent directly to{' '}
                  <a
                    href="mailto:hello@ascynpro.com"
                    onClick={() => trackEvent('pilot_contact_clicked')}
                    className="text-[#D4AF37] hover:underline"
                  >
                    hello@ascynpro.com
                  </a>
                  . We never share your information.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <img src="/logo.svg" alt="ASCYN PRO" className="h-6 w-auto" />
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 ASCYN PRO. Built for future licensed professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
