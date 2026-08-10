import { SchoolConfiguration, MessagingPreferences } from '@/types'

interface Props {
  config: SchoolConfiguration
  onChange: (prefs: MessagingPreferences) => void
}

export default function MessagingPreferencesSection({ config, onChange }: Props) {
  const { messagingPreferences } = config

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Messaging Preferences</h2>
        <p className="text-sm text-silver">School-wide messaging controls</p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center justify-between bg-black border border-graphite rounded-lg p-4">
          <div>
            <p className="text-white font-medium">Student-to-Student Messaging</p>
            <p className="text-sm text-silver">Allow students to message each other</p>
          </div>
          <input
            type="checkbox"
            checked={messagingPreferences.allowStudentToStudent}
            onChange={(e) =>
              onChange({ ...messagingPreferences, allowStudentToStudent: e.target.checked })
            }
            className="w-5 h-5 accent-[var(--color-brand-gold)]"
          />
        </label>

        <label className="flex items-center justify-between bg-black border border-graphite rounded-lg p-4">
          <div>
            <p className="text-white font-medium">Require Moderation</p>
            <p className="text-sm text-silver">Flag messages for review before delivery</p>
          </div>
          <input
            type="checkbox"
            checked={messagingPreferences.requireModeration}
            onChange={(e) =>
              onChange({ ...messagingPreferences, requireModeration: e.target.checked })
            }
            className="w-5 h-5 accent-[var(--color-brand-gold)]"
          />
        </label>

        <label className="flex items-center justify-between bg-black border border-graphite rounded-lg p-4">
          <div>
            <p className="text-white font-medium">Auto-Reply Enabled</p>
            <p className="text-sm text-silver">Send automatic replies outside school hours</p>
          </div>
          <input
            type="checkbox"
            checked={messagingPreferences.autoReplyEnabled}
            onChange={(e) =>
              onChange({ ...messagingPreferences, autoReplyEnabled: e.target.checked })
            }
            className="w-5 h-5 accent-[var(--color-brand-gold)]"
          />
        </label>
      </div>
    </div>
  )
}
