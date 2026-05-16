import { getDailyAffirmation } from '../utils/affirmations'
import { formatDateDisplay, getTodayKey } from '../utils/storage'

export default function DailyAffirmation({ onClose }) {
  const affirmation = getDailyAffirmation()
  const today = formatDateDisplay(getTodayKey())

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-ink-dark/15 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-sm animate-fade-in text-center">
        <p className="font-journal text-sm text-ink/50 mb-6">{today}</p>

        <div className="bg-paper border-2 border-ink/15 rounded-2xl px-8 py-10 shadow-xl paper-texture mb-5">
          <div className="text-3xl mb-4">✦</div>
          <p className="font-journal text-sm text-ink/50 italic mb-6">
            This space is yours. Take a breath and begin.
          </p>
          <p className="font-journal text-lg font-bold text-ink leading-relaxed">
            "{affirmation}"
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-ink text-paper font-journal text-base
                     hover:bg-ink-dark transition-all duration-200 shadow-md"
        >
          Open my journal
        </button>

        <p className="font-journal text-xs text-ink/30 mt-4">tap anywhere to close</p>
      </div>
    </div>
  )
}
