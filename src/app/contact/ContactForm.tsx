'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '@/components/brand'
import { Button, Input, Textarea, Card, Alert } from '@/components/ui'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    school: '',
    email: '',
    phone: '',
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
          formType: 'contact',
          contactName: formData.name,
          schoolName: formData.school,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          website: formData.website,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-brand-black)] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[var(--color-brand-black)]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Logo variant="compact" size="md" className="lg:hidden" />
              <Logo variant="full" size="3xl" className="hidden lg:block" />
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex text-light-gray hover:text-white transition-colors text-sm font-medium"
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
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-brand-gold)]/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="text-[var(--color-brand-gold)] font-semibold mb-4">CONTACT US</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            Let&apos;s Talk
          </h1>
          <p className="text-xl text-silver max-w-2xl mx-auto">
            Have a question about ASCYN PRO, partnership opportunities, or how we can help your school? 
            Send us a message and we&apos;ll respond within one business day.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <Card variant="outlined" padding="lg" className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-brand-gold)]/10 flex items-center justify-center text-3xl mx-auto mb-6">
                ✓
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Message Sent Successfully
              </h2>
              <p className="text-silver text-lg mb-8">
                Thank you. Your message has been received. We&apos;ll contact you within one business day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/demo">
                  <Button variant="primary" size="lg">
                    View Demo
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="secondary" size="lg">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card variant="outlined" padding="lg">
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
                  <Input
                    label="Name *"
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Jane Smith"
                  />

                  <Input
                    label="School"
                    type="text"
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={(e) => updateField('school', e.target.value)}
                    placeholder="Oklahoma Barber Academy"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Email Address *"
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="jane@school.edu"
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <Textarea
                  label="Message *"
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="Tell us how we can help your school or students."
                />

                {error && (
                  <Alert variant="error">
                    {error}
                  </Alert>
                )}

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>

                <p className="text-sm text-silver-gray text-center">
                  Submissions are sent directly to{' '}
                  <a href="mailto:hello@ascynpro.com" className="text-[var(--color-brand-gold)] hover:underline">
                    hello@ascynpro.com
                  </a>
                  . We never share your information.
                </p>
              </form>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Logo variant="full" size="md" />
            </div>
            <p className="text-silver-gray text-sm">
              © 2026 ASCYN PRO. Built for future licensed professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
