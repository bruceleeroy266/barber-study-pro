'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function getMinimumPilotStartDate() {
  const date = new Date()
  let businessDays = 0

  while (businessDays < 10) {
    date.setDate(date.getDate() + 1)
    const day = date.getDay()
    if (day !== 0 && day !== 6) businessDays += 1
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function PilotStartDateGuard() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/pilot') return

    const input = document.querySelector<HTMLInputElement>('input#startDate[name="startDate"]')
    if (!input) return

    const minimumDate = getMinimumPilotStartDate()
    input.min = minimumDate

    if (input.value && input.value < minimumDate) {
      input.value = ''
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }

    const helperId = 'pilot-start-date-guidance'
    if (!document.getElementById(helperId)) {
      const helper = document.createElement('p')
      helper.id = helperId
      helper.className = 'mt-2 text-sm text-silver-gray leading-relaxed'
      helper.textContent = 'Please select your preferred start date. Pilot launches require approximately 10 business days for review, setup, and onboarding. Your requested date is not confirmed until the ASCYN PRO team contacts you.'
      input.insertAdjacentElement('afterend', helper)
    }

    input.setAttribute('aria-describedby', helperId)
  }, [pathname])

  return null
}
