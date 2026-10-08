import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAccessibleMobileMenu } from '@/hooks/useAccessibleMobileMenu'

function Harness() {
  const [open, setOpen] = useState(false)
  const { triggerRef, panelRef } = useAccessibleMobileMenu(open, setOpen)

  return (
    <div>
      <button ref={triggerRef} onClick={() => setOpen(true)}>Open menu</button>
      {open && (
        <div ref={panelRef} tabIndex={-1} aria-label="Menu">
          <a href="/first">First</a>
          <button type="button">Last</button>
        </div>
      )}
    </div>
  )
}

afterEach(() => vi.restoreAllMocks())

describe('useAccessibleMobileMenu', () => {
  it('moves focus into the menu, traps focus, closes on Escape, and restores trigger focus', async () => {
    render(<Harness />)

    const trigger = screen.getByRole('button', { name: 'Open menu' })
    trigger.focus()
    fireEvent.click(trigger)

    const first = await screen.findByRole('link', { name: 'First' })
    const last = screen.getByRole('button', { name: 'Last' })

    // jsdom provides no layout rectangles; simulate visible menu controls.
    vi.spyOn(first, 'getClientRects').mockReturnValue([{} as DOMRect] as unknown as DOMRectList)
    vi.spyOn(last, 'getClientRects').mockReturnValue([{} as DOMRect] as unknown as DOMRectList)

    await waitFor(() => expect(first).toHaveFocus())
    expect(document.body.style.overflow).toBe('hidden')

    last.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(first).toHaveFocus()

    first.focus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(last).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('link', { name: 'First' })).not.toBeInTheDocument()
      expect(trigger).toHaveFocus()
    })
    expect(document.body.style.overflow).toBe('')
  })
})
