/**
 * vCard generation utility for ASCYN PRO digital business cards.
 * Generates standards-compliant vCard 3.0 text for download.
 */

export interface VCardData {
  firstName: string
  lastName: string
  middleName?: string
  title?: string
  organization?: string
  phone?: string
  email?: string
  website?: string
  photoUrl?: string
}

export function generateVCard(data: VCardData): string {
  const lines: string[] = []

  lines.push('BEGIN:VCARD')
  lines.push('VERSION:3.0')

  // Name
  const fn = [data.firstName, data.middleName, data.lastName]
    .filter(Boolean)
    .join(' ')
  const n = [data.lastName, data.firstName, data.middleName || '']
    .join(';')
  lines.push(`N:${n}`)
  lines.push(`FN:${fn}`)

  // Title / Organization
  if (data.title) {
    lines.push(`TITLE:${data.title}`)
  }
  if (data.organization) {
    lines.push(`ORG:${data.organization}`)
  }

  // Phone
  if (data.phone) {
    const cleaned = data.phone.replace(/\D/g, '')
    lines.push(`TEL;TYPE=CELL:${cleaned}`)
  }

  // Email
  if (data.email) {
    lines.push(`EMAIL;TYPE=WORK:${data.email}`)
  }

  // Website
  if (data.website) {
    const url = data.website.startsWith('http')
      ? data.website
      : `https://${data.website}`
    lines.push(`URL:${url}`)
  }

  // Photo (URL reference)
  if (data.photoUrl) {
    lines.push(`PHOTO;VALUE=URL:${data.photoUrl}`)
  }

  lines.push('END:VCARD')

  return lines.join('\r\n')
}

export function downloadVCard(data: VCardData, filename: string): void {
  const vcardText = generateVCard(data)
  const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.vcf') ? filename : `${filename}.vcf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
