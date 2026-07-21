'use client'

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { useRef, useState } from 'react'
import Modal from './Modal'

describe('Modal', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  afterEach(() => {
    cleanup()
  })

  it('renders children and title when open', async () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )

    expect(await screen.findByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
  })

  it('closes when the X button is clicked', async () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )

    const closeButton = await screen.findByLabelText('Close')
    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes when the Escape key is pressed', async () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )

    await screen.findByText('Test Modal')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes when the backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )

    await screen.findByText('Test Modal')
    const backdrop = document.querySelector('[role="presentation"]')
    fireEvent.click(backdrop!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when the panel content is clicked', async () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )

    const content = await screen.findByText('Modal content')
    fireEvent.click(content)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('restores focus to the trigger ref when closed', async () => {
    function TestModal() {
      const [open, setOpen] = useState(true)
      const triggerRef = useRef<HTMLButtonElement>(null)
      return (
        <>
          <button type="button" ref={triggerRef} onClick={() => setOpen(true)}>
            Open
          </button>
          <Modal isOpen={open} onClose={() => setOpen(false)} title="Focus Test" triggerRef={triggerRef}>
            <p>Modal content</p>
          </Modal>
        </>
      )
    }

    render(<TestModal />)
    expect(await screen.findByText('Modal content')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Close'))
    await vi.waitFor(() => expect(screen.queryByText('Modal content')).not.toBeInTheDocument())

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open' }))
  })

})
