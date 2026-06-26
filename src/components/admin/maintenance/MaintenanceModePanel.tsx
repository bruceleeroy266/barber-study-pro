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
          <p className="text-gray-400 mt-1">
            Updated {new Date(state.updated_at).toLocaleString()}
          </p>
        </div>
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            state.enabled
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : 'bg-green-500/10 text-green-400 border border-green-500/20'
          }`}
        >
          {state.enabled ? 'Enabled' : 'Disabled'}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
        <div>
          <label htmlFor="message" className="block text-sm text-gray-400 mb-2">
            Maintenance Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white"
          />
        </div>

        <div>
          <label htmlFor="allowedRoles" className="block text-sm text-gray-400 mb-2">
            Allowed Roles (comma-separated)
          </label>
          <input
            id="allowedRoles"
            type="text"
            value={allowedRoles}
            onChange={(e) => setAllowedRoles(e.target.value)}
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white"
          />
          <p className="text-xs text-gray-500 mt-2">
            Users with these roles can still access the platform during maintenance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleToggle(true)}
            disabled={busy || state.enabled}
            className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 disabled:opacity-50"
          >
            {busy && !state.enabled ? 'Enabling...' : 'Enable Maintenance Mode'}
          </button>
          <button
            onClick={() => handleToggle(false)}
            disabled={busy || !state.enabled}
            className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 disabled:opacity-50"
          >
            {busy && state.enabled ? 'Disabling...' : 'Disable Maintenance Mode'}
          </button>
        </div>

        {feedback && (
          <div
            className={`rounded-lg p-4 ${
              feedback.type === 'success'
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {feedback.message}
          </div>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">How it works</h2>
        <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
          <li>When enabled, non-admin users and admins without the allowed role are redirected.</li>
          <li>Platform Super Admins (or roles listed above) retain full access.</li>
          <li>The maintenance message is displayed to blocked users.</li>
          <li>This setting is enforced by the Next.js middleware.</li>
        </ul>
      </div>
    </div>
  )
}
