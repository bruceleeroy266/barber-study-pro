import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us — ASCYN PRO',
  description: 'Get in touch with ASCYN PRO about partnerships, pilots, or questions.',
}

export default function ContactPage() {
  return <ContactForm />
}
