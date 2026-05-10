import { useState, useEffect, useRef, useCallback } from 'react'
import {
  getTodayKey,
  formatDateDisplay,
  getEntry,
  saveEntry,
  wordCount,
} from '../utils/storage'
import { exportEntries } from '../utils/exportPdf'
import SealButton from './SealButton'
import HistoryPanel from './HistoryPanel'
import NotificationToggle from './NotificationToggle'

const PROMPT = 'Write as if it has already happened…'
const AUTOSAVE_DELAY = 1200

export default function JournalPage() {
  const todayKey = getTodayKey()
  const [activeDate, setActiveDate] = useState(todayKey)
  const [text, setText] = useState('')
  const [sealed, setSealed] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [saved, setSaved] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [sealVisible, setSealVisible] = useState(false)
  const textareaRef = useRef(null)
  const autosaveRef = useRef(null)

  const isToday = activeDate === todayKey

  // Load entry when activeDate changes
  useEffect(() => {
    const entry = getEntry(activeDate)
    setText(entry.text)
    setSealed(entry.sealed)
    setSaved(true)
    setSealVisible(entry.sealed)
  }, [activeDate])

  // Autosave
  const scheduleAutosave = useCallback(
    (newText) => {
      setSaved(false)
      clearTimeout(autosaveRef.current)
      autosaveRef.current = setTimeout(() => {
        saveEntry(activeDate, newText, sealed)
        setSaved(true)
      }, AUTOSAVE_DELAY)
    },
    [activeDate, sealed]
  )

  function handleTextChange(e) {
    const val = e.target.value
    setText(val)
    scheduleAutosave(val)
  }

  function handleSeal() {
    saveEntry(activeDate, text, true)
    setSealed(true)
    setSaved(true)
    setSealVisible(true)
  }

  function handleUnseal() {
    saveEntry(activeDate, text, false)
    setSealed(false)
    setSealVisible(false)
  }

  async function handleExportSingle() {
    setExporting(true)
    const entry = getEntry(activeDate)
    await exportEntries([[activeDate, entry]], `journal-${activeDate}.pdf`)
    setExporting(false)
  }

  const wc = wordCount(text)
  const displayDate = formatDateDisplay(activeDate)

  return (
    <div className="min-h-screen paper-texture flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-ink/10">
        <div className="flex items-center gap-3">
          <span className="font-journal text-2xl font-bold text-ink tracking-wide">
            ✦ Manifestation Journal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <NotificationToggle />
          <button
            onClick={() => setShowHistory(true)}
            className="font-journal text-sm text-ink/70 hover:text-ink transition-colors flex items-center gap-1"
            title="Browse past entries"
          >
            <span>📖</span> History
          </button>
        </div>
      </header>

      {/* Journal area */}
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {/* Date header */}
          <div className="text-center animate-fade-in">
            <h1 className="font-journal text-2xl font-bold text-ink">
              {displayDate}
            </h1>
            {!isToday && (
              <button
                onClick={() => setActiveDate(todayKey)}
                className="mt-1 font-journal text-xs text-ink/50 hover:text-ink underline underline-offset-2"
              >
                ← Back to today
              </button>
            )}
          </div>

          {/* Prompt */}
          <p className="font-journal text-center text-ink/50 italic text-base">
            {PROMPT}
          </p>

          {/* Writing area */}
          <div className="relative rounded-lg border border-ink/15 shadow-sm overflow-hidden"
               style={{ minHeight: '60vh' }}>
            <div className="journal-lines p-6 min-h-[60vh]">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                disabled={sealed}
                placeholder="I am so grateful that…"
                className="journal-textarea min-h-[55vh]"
                style={{ height: 'auto' }}
                onInput={e => {
                  e.target.style.height = 'auto'
                  e.target.style.height = e.target.scrollHeight + 'px'
                }}
              />
            </div>

            {/* Sealed overlay */}
            {sealVisible && (
              <div className="sealed-overlay">
                <div className="seal-stamp flex flex-col items-center gap-2 select-none">
                  <div className="w-28 h-28 rounded-full border-4 border-ink/30 flex items-center justify-center
                                  bg-paper shadow-inner">
                    <div className="text-center">
                      <div className="text-3xl">🔒</div>
                      <div className="font-journal text-xs text-ink/50 mt-1">SEALED</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Word count + save status */}
            <div className="flex items-center gap-4">
              <span className="font-journal text-xs text-ink/45">
                {wc} {wc === 1 ? 'word' : 'words'}
              </span>
              <span className={`font-journal text-xs transition-opacity duration-500 ${saved ? 'opacity-40' : 'opacity-80'}`}>
                {saved ? '✓ saved' : '…saving'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportSingle}
                disabled={exporting || !text.trim()}
                className="font-journal text-xs text-ink/60 hover:text-ink transition-colors disabled:opacity-30"
                title="Export this entry as PDF"
              >
                {exporting ? 'Exporting…' : '📄 Export'}
              </button>

              {isToday && (
                <SealButton sealed={sealed} onSeal={handleSeal} onUnseal={handleUnseal} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* History panel */}
      {showHistory && (
        <HistoryPanel
          onClose={() => setShowHistory(false)}
          onSelectEntry={setActiveDate}
          currentDateKey={activeDate}
        />
      )}
    </div>
  )
}
