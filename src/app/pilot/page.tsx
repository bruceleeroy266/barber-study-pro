'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function PilotPage() {
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setSubmitted(params.get('submitted') === 'true')
    }
  }, [])

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
                className="hidden sm:inline-flex text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/demo"
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
                Thank You for Your Interest
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                We have received your pilot inquiry and will be in touch within 24–48 hours to discuss 
                next steps and confirm your school&apos;s fit for the program.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/demo"
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
              <form
                action="https://formsubmit.co/contact@ascynpro.com"
                method="POST"
                className="space-y-6"
              >
                <input type="hidden" name="_subject" value="New ASCYN PRO Pilot Inquiry" />
                <input type="hidden" name="_next" value="https://ascynpro.com/pilot?submitted=true" />
                <input type="hidden" name="_template" value="table" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="schoolName" className="block text-sm font-medium text-gray-300 mb-2">
                      School Name *
                    </label>
                    <input
                      type="text"
                      id="schoolName"
                      name="School Name"
                      required
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
                      name="Contact Name"
                      required
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
                      name="Email"
                      required
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
                      name="Phone"
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="programType" className="block text-sm font-medium text-gray-300 mb-2">
                      Program Type *
                    </label>
                    <select
                      id="programType"
                      name="Program Type"
                      required
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
                    >
                      <option value="">Select a program</option>
                      <option value="Barbering">Barbering</option>
                      <option value="Cosmetology">Cosmetology</option>
                      <option value="Esthetics">Esthetics</option>
                      <option value="Nail Technology">Nail Technology</option>
                      <option value="Instructor Training">Instructor Training</option>
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
                      name="Estimated Cohort Size"
                      min="1"
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
                    name="Preferred Start Date"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message / Notes
                  </label>
                  <textarea
                    id="message"
                    name="Message"
                    rows={4}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors resize-none"
                    placeholder="Tell us about your school, your current challenges, or any questions you have about the pilot."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-[#D4AF37] text-[#0a0a0a] font-bold rounded-xl hover:bg-[#F4E4A6] transition-all shadow-lg shadow-[#D4AF37]/20"
                  >
                    Submit Pilot Inquiry
                  </button>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  Submissions are sent directly to{' '}
                  <a href="mailto:contact@ascynpro.com" className="text-[#D4AF37] hover:underline">
                    contact@ascynpro.com
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
