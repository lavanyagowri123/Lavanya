const NOTIF_KEY = 'manifestation_notif_enabled'
const NOTIF_HOUR_KEY = 'manifestation_notif_hour'

export function isNotificationsEnabled() {
  return localStorage.getItem(NOTIF_KEY) === 'true'
}

export function getNotifHour() {
  return parseInt(localStorage.getItem(NOTIF_HOUR_KEY) || '8', 10)
}

export async function requestAndEnableNotifications(hour = 8) {
  if (!('Notification' in window)) return false
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return false
  localStorage.setItem(NOTIF_KEY, 'true')
  localStorage.setItem(NOTIF_HOUR_KEY, String(hour))
  scheduleNotification(hour)
  return true
}

export function disableNotifications() {
  localStorage.setItem(NOTIF_KEY, 'false')
}

function scheduleNotification(hour) {
  const now = new Date()
  const next = new Date()
  next.setHours(hour, 0, 0, 0)
  if (next <= now) next.setDate(next.getDate() + 1)
  const delay = next - now
  // Cap at 24h so it doesn't run if tab closes; use Service Worker for production
  if (delay < 86_400_000) {
    setTimeout(() => {
      if (isNotificationsEnabled()) {
        new Notification('Your journal awaits ✨', {
          body: 'Take a moment to write as if it has already happened…',
          icon: '/favicon.svg',
        })
      }
    }, delay)
  }
}

export function initNotifications() {
  if (isNotificationsEnabled() && Notification.permission === 'granted') {
    scheduleNotification(getNotifHour())
  }
}
