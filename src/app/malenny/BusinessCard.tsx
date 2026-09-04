'use client'

import { useCallback, useEffect, useState } from 'react'
import { Logo } from '@/components/brand'
import { trackEvent } from '@/lib/analytics/events'
import { downloadVCard } from '@/lib/vcard'

const CARD_DATA = {
  firstName: 'Malenny',
  lastName: 'Saenz',
  fullName: 'Malenny Saenz',
  title: 'ASCYN PRO',
  organization: 'ASCYN PRO',
  phone: '(405) 985-0600',
  phoneRaw: '4059850600',
  email: 'malenny@ascynpro.com',
  website: 'ascynpro.com',
  websiteUrl: 'https://ascynpro.com',
  tagline: 'Elevate. Learn. Succeed.',
  photoUrl: '/images/team/malenny-headshot.jpg',
  cardUrl: 'https://ascynpro.com/malenny',
}

function track(action: string) { trackEvent(`business_card_${action}`, { page: 'malenny' }) }

export default function BusinessCard() {
  const [canShare, setCanShare] = useState(false)
  const [imageError, setImageError] = useState(false)
  useEffect(() => { setCanShare(typeof navigator !== 'undefined' && 'share' in navigator); track('page_view') }, [])

  const call = useCallback(() => { track('call_click'); window.location.href = `tel:+1${CARD_DATA.phoneRaw}` }, [])
  const email = useCallback(() => { track('email_click'); window.location.href = `mailto:${CARD_DATA.email}` }, [])
  const website = useCallback(() => { track('website_click'); window.open(CARD_DATA.websiteUrl, '_blank', 'noopener,noreferrer') }, [])
  const save = useCallback(() => {
    track('save_contact_click')
    downloadVCard({ firstName: CARD_DATA.firstName, lastName: CARD_DATA.lastName, title: CARD_DATA.title, organization: CARD_DATA.organization, phone: CARD_DATA.phoneRaw, email: CARD_DATA.email, website: CARD_DATA.websiteUrl }, 'Malenny-Saenz-ASCYN-PRO')
  }, [])
  const share = useCallback(async () => {
    track('share_click')
    if (navigator.share) await navigator.share({ title: `${CARD_DATA.fullName} | ${CARD_DATA.organization}`, text: `Connect with ${CARD_DATA.fullName} of ${CARD_DATA.organization}.`, url: CARD_DATA.cardUrl }).catch(() => {})
  }, [])

  const actionClass = 'flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl bg-[var(--color-brand-charcoal)] border border-white/10 hover:border-[var(--color-brand-gold)]/40 hover:bg-[var(--color-brand-gold)]/5 active:scale-[0.98] transition-all'

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-6">
            <Logo variant="horizontal" theme="gold" size="lg" className="mx-auto mb-3" />
            <p className="text-xs tracking-[0.2em] text-[var(--color-brand-gold)] font-medium uppercase">{CARD_DATA.tagline}</p>
          </div>

          <div className="relative mb-6 mx-auto w-48 h-48 sm:w-56 sm:h-56">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-brand-gold)]/20 to-transparent" />
            <div className="absolute inset-1 rounded-full overflow-hidden border-2 border-[var(--color-brand-gold)]/40">
              {!imageError ? <img src={CARD_DATA.photoUrl} alt={CARD_DATA.fullName} className="w-full h-full object-cover object-top" onError={() => setImageError(true)} /> :
                <div className="w-full h-full bg-[var(--color-brand-charcoal)] flex items-center justify-center"><span className="text-4xl font-bold text-[var(--color-brand-gold)]">MS</span></div>}
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-gold)] tracking-tight mb-1">{CARD_DATA.fullName}</h1>
            <p className="text-base sm:text-lg text-white/90 font-medium">{CARD_DATA.title}</p>
          </div>

          <div className="space-y-3 mb-8 max-w-xs mx-auto">
            <a href={`tel:+1${CARD_DATA.phoneRaw}`} className="block p-3 rounded-xl bg-[var(--color-brand-charcoal)] border border-white/10"><span className="text-xs text-[var(--color-brand-silver-gray)] uppercase tracking-wider">Phone</span><p className="font-medium">{CARD_DATA.phone}</p></a>
            <a href={`mailto:${CARD_DATA.email}`} className="block p-3 rounded-xl bg-[var(--color-brand-charcoal)] border border-white/10"><span className="text-xs text-[var(--color-brand-silver-gray)] uppercase tracking-wider">Email</span><p className="font-medium">{CARD_DATA.email}</p></a>
            <a href={CARD_DATA.websiteUrl} className="block p-3 rounded-xl bg-[var(--color-brand-charcoal)] border border-white/10"><span className="text-xs text-[var(--color-brand-silver-gray)] uppercase tracking-wider">Website</span><p className="font-medium">{CARD_DATA.website}</p></a>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={call} className={actionClass}><span className="text-xl">☎</span><span className="text-sm font-semibold">Call</span></button>
            <button onClick={email} className={actionClass}><span className="text-xl">✉</span><span className="text-sm font-semibold">Email</span></button>
            <button onClick={website} className={actionClass}><span className="text-xl">◎</span><span className="text-sm font-semibold">Website</span></button>
            <button onClick={save} className={actionClass}><span className="text-xl">＋</span><span className="text-sm font-semibold">Save Contact</span></button>
          </div>
          {canShare && <button onClick={share} className="w-full p-3 rounded-xl border border-[var(--color-brand-gold)]/40 text-[var(--color-brand-gold)] font-semibold">Share Malenny's Card</button>}
        </div>
      </main>
    </div>
  )
}
