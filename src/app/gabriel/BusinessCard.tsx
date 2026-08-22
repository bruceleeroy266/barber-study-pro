'use client'

import { useCallback, useEffect, useState } from 'react'
import { Logo } from '@/components/brand'
import { trackEvent } from '@/lib/analytics/events'
import { downloadVCard } from '@/lib/vcard'

const CARD_DATA = {
  firstName: 'Gabriel',
  middleName: 'O.',
  lastName: 'Arcaina',
  fullName: 'Gabriel O. Arcaina',
  title: 'Founder / CEO',
  organization: 'ASCYN PRO',
  phone: '(904) 480-9422',
  phoneRaw: '9044809422',
  email: 'Gabriel@ascynpro.com',
  website: 'ascynpro.com',
  websiteUrl: 'https://ascynpro.com',
  tagline: 'Elevate. Learn. Succeed.',
  mission: 'EMPOWERING INSTRUCTORS. DEVELOPING CONFIDENCE. CLOSING GAPS. RAISING STANDARDS.',
  photoUrl: '/images/team/gabriel-headshot.jpg',
  cardUrl: 'https://ascynpro.com/gabriel',
}

function track(action: string) {
  trackEvent(`business_card_${action}`, { page: 'gabriel' })
}

export default function BusinessCard() {
  const [canShare, setCanShare] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator)
    track('page_view')
  }, [])

  const handleCall = useCallback(() => {
    track('call_click')
    window.location.href = `tel:+1${CARD_DATA.phoneRaw}`
  }, [])

  const handleEmail = useCallback(() => {
    track('email_click')
    window.location.href = `mailto:${CARD_DATA.email}`
  }, [])

  const handleWebsite = useCallback(() => {
    track('website_click')
    window.open(CARD_DATA.websiteUrl, '_blank', 'noopener,noreferrer')
  }, [])

  const handleSaveContact = useCallback(() => {
    track('save_contact_click')
    downloadVCard(
      {
        firstName: CARD_DATA.firstName,
        middleName: CARD_DATA.middleName,
        lastName: CARD_DATA.lastName,
        title: CARD_DATA.title,
        organization: CARD_DATA.organization,
        phone: CARD_DATA.phoneRaw,
        email: CARD_DATA.email,
        website: CARD_DATA.websiteUrl,
        photoUrl: `https://ascynpro.com${CARD_DATA.photoUrl}`,
      },
      'Gabriel-O-Arcaina-ASCYN-PRO'
    )
  }, [])

  const handleShare = useCallback(async () => {
    track('share_click')
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${CARD_DATA.fullName} | ${CARD_DATA.title} — ${CARD_DATA.organization}`,
          text: `Connect with ${CARD_DATA.fullName}, ${CARD_DATA.title} of ${CARD_DATA.organization}.`,
          url: CARD_DATA.cardUrl,
        })
      } catch (err) {
        // User cancelled or share failed — silent fallback
        if (err instanceof Error && err.name !== 'AbortError') {
          // eslint-disable-next-line no-console
          console.error('Share failed:', err)
        }
      }
    }
  }, [])

  const handleCopyLink = useCallback(async () => {
    track('copy_link_click')
    try {
      await navigator.clipboard.writeText(CARD_DATA.cardUrl)
      alert('Link copied to clipboard!')
    } catch {
      // Fallback for browsers without clipboard API
      const input = document.createElement('input')
      input.value = CARD_DATA.cardUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      alert('Link copied to clipboard!')
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Main Card Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Logo & Tagline */}
          <div className="text-center mb-6">
            <Logo variant="horizontal" theme="gold" size="lg" className="mx-auto mb-3" />
            <p className="text-xs tracking-[0.2em] text-[var(--color-brand-gold)] font-medium uppercase">
              {CARD_DATA.tagline}
            </p>
          </div>

          {/* Portrait */}
          <div className="relative mb-6 mx-auto w-48 h-48 sm:w-56 sm:h-56">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-brand-gold)]/20 to-transparent" />
            <div className="absolute inset-1 rounded-full overflow-hidden border-2 border-[var(--color-brand-gold)]/40">
              {!imageError ? (
                <img
                  src={CARD_DATA.photoUrl}
                  alt={CARD_DATA.fullName}
                  className="w-full h-full object-cover object-top"
                  onError={() => setImageError(true)}
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full bg-[var(--color-brand-charcoal)] flex items-center justify-center">
                  <span className="text-4xl font-bold text-[var(--color-brand-gold)]">
                    {CARD_DATA.firstName[0]}{CARD_DATA.lastName[0]}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name & Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-gold)] tracking-tight mb-1">
              {CARD_DATA.fullName}
            </h1>
            <p className="text-base sm:text-lg text-white/90 font-medium mb-1">
              {CARD_DATA.title}
            </p>
            <p className="text-sm text-[var(--color-brand-silver-gray)]">
              {CARD_DATA.organization}
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 mb-8 max-w-xs mx-auto">
            <a
              href={`tel:+1${CARD_DATA.phoneRaw}`}
              onClick={(e) => {
                e.preventDefault()
                handleCall()
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-brand-charcoal)] border border-white/10 hover:border-[var(--color-brand-gold)]/40 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-gold)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-brand-gold)]/20 transition-colors">
                <svg className="w-5 h-5 text-[var(--color-brand-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[var(--color-brand-silver-gray)] uppercase tracking-wider">Phone</p>
                <p className="text-sm sm:text-base text-white font-medium truncate">{CARD_DATA.phone}</p>
              </div>
            </a>

            <a
              href={`mailto:${CARD_DATA.email}`}
              onClick={(e) => {
                e.preventDefault()
                handleEmail()
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-brand-charcoal)] border border-white/10 hover:border-[var(--color-brand-gold)]/40 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-gold)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-brand-gold)]/20 transition-colors">
                <svg className="w-5 h-5 text-[var(--color-brand-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[var(--color-brand-silver-gray)] uppercase tracking-wider">Email</p>
                <p className="text-sm sm:text-base text-white font-medium truncate">{CARD_DATA.email}</p>
              </div>
            </a>

            <a
              href={CARD_DATA.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault()
                handleWebsite()
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-brand-charcoal)] border border-white/10 hover:border-[var(--color-brand-gold)]/40 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-gold)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-brand-gold)]/20 transition-colors">
                <svg className="w-5 h-5 text-[var(--color-brand-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.959 11.959 0 013.598 6.747" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[var(--color-brand-silver-gray)] uppercase tracking-wider">Website</p>
                <p className="text-sm sm:text-base text-white font-medium truncate">{CARD_DATA.website}</p>
              </div>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleCall}
              className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl bg-[var(--color-brand-charcoal)] border border-white/10 hover:border-[var(--color-brand-gold)]/40 hover:bg-[var(--color-brand-gold)]/5 active:scale-[0.98] transition-all touch-manipulation"
              aria-label="Call Gabriel O. Arcaina"
            >
              <svg className="w-6 h-6 text-[var(--color-brand-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span className="text-sm font-semibold text-white">Call</span>
              <span className="text-[10px] text-[var(--color-brand-silver-gray)] truncate max-w-full">{CARD_DATA.phone}</span>
            </button>

            <button
              onClick={handleEmail}
              className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl bg-[var(--color-brand-charcoal)] border border-white/10 hover:border-[var(--color-brand-gold)]/40 hover:bg-[var(--color-brand-gold)]/5 active:scale-[0.98] transition-all touch-manipulation"
              aria-label="Email Gabriel O. Arcaina"
            >
              <svg className="w-6 h-6 text-[var(--color-brand-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span className="text-sm font-semibold text-white">Email</span>
              <span className="text-[10px] text-[var(--color-brand-silver-gray)] truncate max-w-full">{CARD_DATA.email}</span>
            </button>

            <button
              onClick={handleWebsite}
              className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl bg-[var(--color-brand-charcoal)] border border-white/10 hover:border-[var(--color-brand-gold)]/40 hover:bg-[var(--color-brand-gold)]/5 active:scale-[0.98] transition-all touch-manipulation"
              aria-label="Visit ASCYN PRO website"
            >
              <svg className="w-6 h-6 text-[var(--color-brand-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.959 11.959 0 013.598 6.747" />
              </svg>
              <span className="text-sm font-semibold text-white">Website</span>
              <span className="text-[10px] text-[var(--color-brand-silver-gray)] truncate max-w-full">{CARD_DATA.website}</span>
            </button>

            <button
              onClick={handleSaveContact}
              className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl bg-[var(--color-brand-charcoal)] border border-white/10 hover:border-[var(--color-brand-gold)]/40 hover:bg-[var(--color-brand-gold)]/5 active:scale-[0.98] transition-all touch-manipulation"
              aria-label="Save Gabriel O. Arcaina to contacts"
            >
              <svg className="w-6 h-6 text-[var(--color-brand-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span className="text-sm font-semibold text-white">Save Contact</span>
              <span className="text-[10px] text-[var(--color-brand-silver-gray)]">Download vCard</span>
            </button>
          </div>

          {/* Share Button */}
          {canShare ? (
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-[var(--color-brand-gold)]/10 border border-[var(--color-brand-gold)]/30 hover:bg-[var(--color-brand-gold)]/20 active:scale-[0.98] transition-all touch-manipulation mb-6"
              aria-label="Share business card"
            >
              <svg className="w-5 h-5 text-[var(--color-brand-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              <span className="text-sm font-semibold text-[var(--color-brand-gold)]">Share My Card</span>
            </button>
          ) : (
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-[var(--color-brand-gold)]/10 border border-[var(--color-brand-gold)]/30 hover:bg-[var(--color-brand-gold)]/20 active:scale-[0.98] transition-all touch-manipulation mb-6"
              aria-label="Copy card link"
            >
              <svg className="w-5 h-5 text-[var(--color-brand-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              <span className="text-sm font-semibold text-[var(--color-brand-gold)]">Copy Link</span>
            </button>
          )}

          {/* Mission Statement */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-brand-gold)]/10 mb-3">
              <svg className="w-5 h-5 text-[var(--color-brand-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6.75c-.59.314-.598 1.133-.017 1.45a9.971 9.971 0 0010.836 0c.582-.317.573-1.136-.017-1.45a11.959 11.959 0 01-6.002 0zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[10px] sm:text-xs tracking-[0.15em] text-[var(--color-brand-silver-gray)] uppercase leading-relaxed">
              {CARD_DATA.mission}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center border-t border-white/5">
        <p className="text-[10px] text-[var(--color-brand-silver-gray)]">
          © {new Date().getFullYear()} {CARD_DATA.organization}. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
