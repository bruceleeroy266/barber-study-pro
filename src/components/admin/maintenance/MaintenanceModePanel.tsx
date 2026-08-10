'use client'

import { useState } from 'react'
import type { MaintenanceModeState } from '@/lib/maintenance/maintenance-mode'

interface MaintenanceModePanelProps {
  initialState: MaintenanceModeState
}

export default function MaintenanceModePanel({ initialState }: MaintenanceModePanelProps) {
  const [state, setState] = useState(initialState)
  const [message, setMessage] = useState(initialState.message)
  const [allowedRoles, setAllowedRoles] = useState(initialState.allowed_roles.join(', '))
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleToggle(enabled: boolean) {
    setBusy(true)
    setFeedback(null)

    const roles = allowedRoles
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean)

    const { toggleMaintenanceMode } = await import('@/app/admin/maintenance/actions')
    const result = await toggleMaintenanceMode(enabled, message, roles)

    setBusy(false)
    if (result.success) {
      setState((s) => ({
        ...s,
        enabled,
        message,
        allowed_roles: roles,
        updated_at: new Date().toISOString(),
      }))
      setFeedback({ type: 'success', message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}.` })
    } else {
      setFeedback({ type: 'error', message: result.error ?? 'Failed to update maintenance mode.' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Maintenance Mode</h1>
          <p className="text-silver mt-1">
            Updated {new Date(state.updated_at).toLocaleString()}
          </p>
        </div>
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            state.enabled
              ? 'bg-silver/10 text-silver border border-silver/20'
              : 'bg-gold/10 text-gold border border-gold/20'
          }`}
        >
          {state.enabled ? 'Enabled' : 'Disabled'}
        </div>
      </div>

      <div className="bg-charcoal border border-graphite rounded-xl p-6 space-y-6">
        <div>
          <label htmlFor="message" className="block text-sm text-silver mb-2">
            Maintenance Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-4 py-3 text-white"
          />
        </div>

        <div>
          <label htmlFor="allowedRoles" className="block text-sm text-silver mb-2">
            Allowed Roles (comma-separated)
          </label>
          <input
            id="allowedRoles"
            type="text"
            value={allowedRoles}
            onChange={(e) => setAllowedRoles(e.target.value)}
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-4 py-3 text-white"
          />
          <p className="text-xs text-silver-gray mt-2">
            Users with these roles can still access the platform during maintenance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleToggle(true)}
            disabled={busy || state.enabled}
            className="px-5 py-2.5 bg-silver text-white font-semibold rounded-lg hover:bg-silver disabled:opacity-50"
          >
            {busy && !state.enabled ? 'Enabling...' : 'Enable Maintenance Mode'}
          </button>
          <button
            onClick={() => handleToggle(false)}
            disabled={busy || !state.enabled}
            className="px-5 py-2.5 bg-gold text-white font-semibold rounded-lg hover:bg-gold disabled:opacity-50"
          >
            {busy && state.enabled ? 'Disabling...' : 'Disable Maintenance Mode'}
          </button>
        </div>

        {feedback && (
          <div
            className={`rounded-lg p-4 ${
              feedback.type === 'success'
                ? 'bg-gold/10 border border-gold/20 text-gold'
                : 'bg-silver/10 border border-silver/20 text-silver'
            }`}
          >
            {feedback.message}
          </div>
        )}
      </div>

      <div className="bg-charcoal border border-graphite rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">How it works</h2>
        <ul className="list-disc list-inside text-silver space-y-1 text-sm">
          <li>When enabled, non-admin users and admins without the allowed role are redirected.</li>
          <li>Platform Super Admins (or roles listed above) retain full access.</li>
          <li>The maintenance message is displayed to blocked users.</li>
          <li>This setting is enforced by the Next.js middleware.</li>
        </ul>
      </div>
    </div>
  )
}
