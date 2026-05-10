const ENTRIES_KEY = 'manifestation_journal_entries'

export function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

export function formatDateDisplay(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', {
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
  entries[dateKey] = {
    text,
    sealed,
    savedAt: new Date().toISOString(),
  }
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
}

export function getSortedDateKeys() {
  const entries = getAllEntries()
  return Object.keys(entries).sort((a, b) => b.localeCompare(a))
}

export function wordCount(text) {
  if (!text.trim()) return 0
  return text.trim().split(/\s+/).length
}
