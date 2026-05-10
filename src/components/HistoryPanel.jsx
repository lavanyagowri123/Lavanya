import { getSortedDateKeys, getEntry, formatDateDisplay } from '../utils/storage'
import { exportEntries } from '../utils/exportPdf'
import { useState } from 'react'

export default function HistoryPanel({ onClose, onSelectEntry, currentDateKey }) {
  const dateKeys = getSortedDateKeys()
  const [exporting, setExporting] = useState(false)

  async function handleExportAll() {
    setExporting(true)
    const entries = dateKeys.map(k => [k, getEntry(k)]).filter(([, e]) => e.text.trim())
    await exportEntries(entries, 'manifestation-journal-all.pdf')
    setExporting(false)
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-dark/20 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="history-panel relative z-50 w-80 max-w-full h-full bg-paper border-l-2 border-ink/20
                      flex flex-col shadow-2xl paper-texture">
        <div className="flex items-center justify-between p-5 border-b border-ink/15">
          <h2 className="font-journal text-xl text-ink font-bold">Past Entries</h2>
          <button onClick={onClose} className="text-ink/60 hover:text-ink text-2xl leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {dateKeys.length === 0 && (
            <p className="font-journal text-ink/50 text-center mt-10 text-sm">
              No entries yet. Start writing today!
            </p>
          )}
          {dateKeys.map(dateKey => {
            const entry = getEntry(dateKey)
            const preview = entry.text.slice(0, 80).trim()
            const isToday = dateKey === currentDateKey

            return (
              <button
                key={dateKey}
                onClick={() => { onSelectEntry(dateKey); onClose() }}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-150
                  ${isToday
                    ? 'border-ink/40 bg-ink/8'
                    : 'border-ink/15 hover:border-ink/35 hover:bg-ink/5'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-journal text-sm font-bold text-ink">
                    {formatDateDisplay(dateKey)}
                  </span>
                  {entry.sealed && <span className="text-xs">🔒</span>}
                  {isToday && (
                    <span className="ml-auto text-xs font-journal text-ink/50">today</span>
                  )}
                </div>
                {preview && (
                  <p className="font-journal text-xs text-ink/55 mt-1 line-clamp-2">
                    {preview}{entry.text.length > 80 ? '…' : ''}
                  </p>
                )}
                {!preview && (
                  <p className="font-journal text-xs text-ink/35 mt-1 italic">empty</p>
                )}
              </button>
            )
          })}
        </div>

        {dateKeys.length > 0 && (
          <div className="p-4 border-t border-ink/15">
            <button
              onClick={handleExportAll}
              disabled={exporting}
              className="w-full py-2 rounded-full border-2 border-ink text-ink font-journal text-sm
                         hover:bg-ink hover:text-paper transition-all duration-200 disabled:opacity-50"
            >
              {exporting ? 'Exporting…' : '📄 Export All as PDF'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
