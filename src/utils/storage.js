const ENTRIES_KEY = 'manifestation_journal_entries'

export function getTodayKey() {
  return new Date().toLocaleDateString('sv', { timeZone: 'Australia/Melbourne' })
}

export function getMelbDate() {
  return new Date().toLocaleDateString('sv', { timeZone: 'Australia/Melbourne' })
}

export function getTodayDone() {
  const today = getMelbDate()
  try {
    const done = JSON.parse(localStorage.getItem('stillspace_done') || '{}')
    if (done.date !== today) return { move: false, meditate: false, mirror: false }
    return { move: !!done.move, meditate: !!done.meditate, mirror: !!done.mirror }
  } catch {
    return { move: false, meditate: false, mirror: false }
  }
}

function prevMelbDay(melbDateStr) {
  const d = new Date(melbDateStr + 'T12:00:00')
  d.setDate(d.getDate() - 1)
  return d.toLocaleDateString('sv', { timeZone: 'Australia/Melbourne' })
}

function _updateStreak(today) {
  try {
    const streak = JSON.parse(localStorage.getItem('stillspace_streak') || '{"count":0,"lastDate":""}')
    if (streak.lastDate === today) return
    const yesterday = prevMelbDay(today)
    const newCount = streak.lastDate === yesterday ? streak.count + 1 : 1
    localStorage.setItem('stillspace_streak', JSON.stringify({ count: newCount, lastDate: today }))
  } catch {}
}

export function markDone(type) {
  const today = getMelbDate()
  try {
    let done = JSON.parse(localStorage.getItem('stillspace_done') || '{}')
    if (done.date !== today) done = { date: today, move: false, meditate: false, mirror: false }
    done[type] = true
    localStorage.setItem('stillspace_done', JSON.stringify(done))
    if (done.move && done.meditate && done.mirror) _updateStreak(today)
  } catch {}
}

export function getStreakCount() {
  try {
    const today = getMelbDate()
    const streak = JSON.parse(localStorage.getItem('stillspace_streak') || '{"count":0,"lastDate":""}')
    if (!streak.count) return 0
    const yesterday = prevMelbDay(today)
    if (streak.lastDate === today || streak.lastDate === yesterday) return streak.count
    return 0
  } catch {
    return 0
  }
}

export function formatDateDisplay(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getAllEntries() {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getEntry(dateKey) {
  const entries = getAllEntries()
  return entries[dateKey] || { text: '', sealed: false, savedAt: null }
}

export function saveEntry(dateKey, text, sealed = false) {
  const entries = getAllEntries()
  entries[dateKey] = { text, sealed, savedAt: new Date().toISOString() }
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
  if (text.trim()) markDone('mirror')
}

export function getSortedDateKeys() {
  const entries = getAllEntries()
  return Object.keys(entries).sort((a, b) => b.localeCompare(a))
}

export function wordCount(text) {
  if (!text.trim()) return 0
  return text.trim().split(/\s+/).length
}

// Typed journal storage — each non-scripting journal type has its own namespace
export function getTypedEntries(type) {
  try {
    const raw = localStorage.getItem(`journal_${type}_entries`)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getTypedEntry(type, dateKey) {
  return getTypedEntries(type)[dateKey] || null
}

export function saveTypedEntry(type, dateKey, data) {
  const all = getTypedEntries(type)
  all[dateKey] = { ...data, savedAt: new Date().toISOString() }
  localStorage.setItem(`journal_${type}_entries`, JSON.stringify(all))
  markDone('mirror')
}

export function getTypedSortedKeys(type) {
  return Object.keys(getTypedEntries(type)).sort((a, b) => b.localeCompare(a))
}
