import type { Metadata } from 'next'
import BusinessCardPrivate from './BusinessCardPrivate'

export const metadata: Metadata = {
  title: 'Gabriel O. Arcaina | Founder & CEO — ASCYN PRO',
  description: 'Connect with Gabriel O. Arcaina, Founder & CEO of ASCYN PRO.',
  keywords: ['Gabriel O. Arcaina', 'ASCYN PRO', 'Founder', 'CEO', 'digital business card'],
  authors: [{ name: 'Gabriel O. Arcaina' }],
  creator: 'ASCYN PRO',
  publisher: 'ASCYN PRO',
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL('https://ascynpro.com'),
  alternates: { canonical: '/gabriel' },
  openGraph: {
    type: 'profile', locale: 'en_US', url: 'https://ascynpro.com/gabriel', siteName: 'ASCYN PRO',
    title: 'Gabriel O. Arcaina | Founder & CEO — ASCYN PRO',
    description: 'Connect with Gabriel O. Arcaina, Founder & CEO of ASCYN PRO.',
    images: [{ url: '/brand/og-image.svg', width: 1200, height: 630, alt: 'Gabriel O. Arcaina | Founder & CEO — ASCYN PRO' }],
    firstName: 'Gabriel', lastName: 'Arcaina', username: 'gabriel',
  },
  twitter: { card: 'summary_large_image', title: 'Gabriel O. Arcaina | Founder & CEO — ASCYN PRO', description: 'Connect with Gabriel O. Arcaina, Founder & CEO of ASCYN PRO.', images: ['/brand/og-image.svg'] },
  robots: { index: true, follow: true },
}

export default function GabrielPage() {
  return <BusinessCardPrivate />
}
