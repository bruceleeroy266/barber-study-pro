import type { Metadata } from 'next'
import BusinessCard from './BusinessCard'

export const metadata: Metadata = {
  title: 'Malenny Saenz | ASCYN PRO',
  description: 'Connect with Malenny Saenz of ASCYN PRO.',
  keywords: ['Malenny Saenz', 'ASCYN PRO', 'digital business card'],
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
    title: 'Malenny Saenz | ASCYN PRO',
    description: 'Connect with Malenny Saenz of ASCYN PRO.',
    images: [{ url: '/brand/og-image.svg', width: 1200, height: 630, alt: 'Malenny Saenz | ASCYN PRO' }],
    firstName: 'Malenny',
    lastName: 'Saenz',
    username: 'malenny',
  },
  robots: { index: true, follow: true },
}

export default function MalennyPage() {
  return <BusinessCard />
}
