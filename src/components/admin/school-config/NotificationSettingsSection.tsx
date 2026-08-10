import { SchoolConfiguration, SchoolNotificationSetting, NotificationPriority } from '@/types'

interface Props {
  config: SchoolConfiguration
  onChange: (settings: SchoolNotificationSetting[]) => void
}

const priorityBadge = (priority: NotificationPriority) => {
  const map: Record<NotificationPriority, string> = {
    low: 'bg-silver/10 text-silver border-silver/20',
    medium: 'bg-warm-bronze/10 text-warm-bronze border-warm-bronze/20',
    high: 'bg-warm-bronze/10 text-warm-bronze border-warm-bronze/20',
    urgent: 'bg-silver/10 text-silver border-silver/20',
  }
  return map[priority]
}

function formatType(type: string) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function NotificationSettingsSection({ config, onChange }: Props) {
  const { notificationSettings } = config

  function toggle(setting: SchoolNotificationSetting) {
    onChange(
      notificationSettings.map((s) =>
        s.type === setting.type ? { ...s, enabled: !s.enabled } : s
      )
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">School-wide Notifications</h2>
        <p className="text-sm text-silver">Enable or disable notification types</p>
      </div>

      <div className="space-y-3">
        {notificationSettings.map((setting) => (
          <label
            key={setting.type}
            className="flex items-center justify-between bg-black border border-graphite rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-medium">{formatType(setting.type)}</span>
              <span
                className={`px-2 py-0.5 rounded text-xs border capitalize ${priorityBadge(
                  setting.priority
                )}`}
              >
                {setting.priority}
              </span>
            </div>
            <input
              type="checkbox"
              checked={setting.enabled}
              onChange={() => toggle(setting)}
              className="w-5 h-5 accent-[var(--color-brand-gold)]"
            />
          </label>
        ))}
      </div>
    </div>
  )
}
