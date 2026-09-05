import type { Metadata } from 'next'
import BusinessCard from './BusinessCard'

export const metadata: Metadata = {
  title: 'Malenny Saenz | Co-Founder & Head of Marketing — ASCYN PRO',
  description: 'Connect with Malenny Saenz, Co-Founder & Head of Marketing at ASCYN PRO.',
  keywords: ['Malenny Saenz', 'ASCYN PRO', 'Co-Founder', 'Head of Marketing', 'digital business card'],
  authors: [{ name: 'Malenny Saenz' }],
  creator: 'ASCYN PRO',
  publisher: 'ASCYN PRO',
  metadataBase: new URL('https://ascynpro.com'),
  alternates: { canonical: '/malenny' },
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: 'https://ascynpro.com/malenny',
    siteName: 'ASCYN PRO',
    title: 'Malenny Saenz | Co-Founder & Head of Marketing — ASCYN PRO',
    description: 'Connect with Malenny Saenz, Co-Founder & Head of Marketing at ASCYN PRO.',
    images: [{ url: '/brand/og-image.svg', width: 1200, height: 630, alt: 'Malenny Saenz | Co-Founder & Head of Marketing — ASCYN PRO' }],
    firstName: 'Malenny',
    lastName: 'Saenz',
    username: 'malenny',
  },
  robots: { index: true, follow: true },
}

export default function MalennyPage() {
  return <BusinessCard />
}
