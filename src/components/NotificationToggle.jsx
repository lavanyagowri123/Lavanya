import { useState } from 'react'
import {
  isNotificationsEnabled,
  requestAndEnableNotifications,
  disableNotifications,
  getNotifHour,
} from '../utils/notifications'

export default function NotificationToggle() {
  const [enabled, setEnabled] = useState(isNotificationsEnabled)
  const [hour, setHour] = useState(getNotifHour)
  const [ringing, setRinging] = useState(false)
  const supported = 'Notification' in window

  async function toggle() {
    if (enabled) {
      disableNotifications()
      setEnabled(false)
    } else {
      const ok = await requestAndEnableNotifications(hour)
      setEnabled(ok)
      if (ok) { setRinging(true); setTimeout(() => setRinging(false), 700) }
    }
  }

  if (!supported) return null

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        title={enabled ? 'Disable morning reminder' : 'Enable morning reminder'}
        className={`text-xl transition-all duration-200 hover:scale-110 ${ringing ? 'bell-ring' : ''}`}
      >
        {enabled ? '🔔' : '🔕'}
      </button>
      {enabled && (
        <select
          value={hour}
          onChange={e => {
            const h = Number(e.target.value)
            setHour(h)
            requestAndEnableNotifications(h)
          }}
          className="text-xs font-journal text-ink bg-transparent border border-ink/30
                     rounded px-1 py-0.5 cursor-pointer outline-none"
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>
              {String(i).padStart(2, '0')}:00
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
