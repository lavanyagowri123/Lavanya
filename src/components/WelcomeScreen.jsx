import { useState } from 'react'
import { getDailyAffirmation } from '../utils/affirmations'
import { formatDateDisplay, getTodayKey } from '../utils/storage'

const STEPS = [
  {
    icon: '✦',
    heading: 'Welcome to your Manifestation Journal',
    body: `This is a space that belongs entirely to you. No notifications pulling you away, no audience, no performance. Just you, your intentions, and the page.`,
  },
  {
    icon: '🖊',
    heading: 'Why this journal exists',
    body: `When you write your intentions in the past tense — as if they have already happened — your brain's reticular activating system begins filtering your world to find evidence that confirms them. You start noticing what you once missed. The writing is the practice.`,
  },
]

export default function WelcomeScreen({ onDone }) {
  const [step, setStep] = useState(0)
  const showAffirmation = step === STEPS.length
  const affirmation = getDailyAffirmation()
  const today = formatDateDisplay(getTodayKey())

  if (showAffirmation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-ink-dark/15 backdrop-blur-sm" />
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
            onClick={onDone}
            className="w-full py-3 rounded-full bg-ink text-paper font-journal text-base
                       hover:bg-ink-dark transition-all duration-200 shadow-md"
          >
            Begin journalling ✦
          </button>
        </div>
      </div>
    )
  }

  const current = STEPS[step]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 paper-texture">
      <div className="absolute inset-0 bg-paper" />
      <div className="relative z-10 w-full max-w-sm animate-fade-in">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[...STEPS, 'affirmation'].map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === step ? 'w-6 h-2 bg-ink' : i < step ? 'w-2 h-2 bg-ink/40' : 'w-2 h-2 bg-ink/15'
              }`}
            />
          ))}
        </div>

        <div className="bg-paper border-2 border-ink/15 rounded-2xl p-8 shadow-lg text-center">
          <div className="text-5xl mb-5">{current.icon}</div>
          <h2 className="font-journal font-bold text-xl text-ink mb-4 leading-snug">
            {current.heading}
          </h2>
          <p className="font-journal text-sm text-ink/75 leading-relaxed mb-8">
            {current.body}
          </p>
          <button
            onClick={() => setStep(s => s + 1)}
            className="w-full py-3 rounded-full bg-ink text-paper font-journal text-base
                       hover:bg-ink-dark transition-all duration-200 shadow-md"
          >
            Continue
          </button>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="mt-3 w-full py-2 font-journal text-sm text-ink/40 hover:text-ink transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
