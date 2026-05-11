import { useState } from 'react'

export default function WelcomeScreen({ onDone }) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      icon: '✦',
      heading: 'Welcome to your Manifestation Journal',
      body: `This is a space that belongs entirely to you. No notifications pulling you away, no audience, no performance. Just you and the page.`,
    },
    {
      icon: '🖊',
      heading: 'Why this journal exists',
      body: `Manifestation isn't wishful thinking — it's directed attention. When you write your intentions in the past tense, as if they have already happened, your brain's reticular activating system begins filtering your world to find evidence that confirms them. You start noticing what you once missed.`,
    },
    {
      icon: '🟡',
      heading: 'Why yellow and red?',
      body: `Yellow is the colour the human eye processes fastest. It signals warmth, safety, and open thinking. Red ink activates focus and commitment — studies show we take goals more seriously when written in red. Together they create an environment your brain associates with important, intentional work.`,
    },
    {
      icon: '🌅',
      heading: 'How to use it',
      body: `Each morning, open your journal and write freely — as if your dream life is already real. Describe how it feels, what you see, who you are. Then seal the entry. Come back tomorrow and do it again. The ritual is the practice.`,
    },
  ]

  const current = steps[step]
  const isLast = step === steps.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 paper-texture">
      {/* Full page warm bg */}
      <div className="absolute inset-0 bg-paper" />

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-6 h-2 bg-ink'
                  : i < step
                  ? 'w-2 h-2 bg-ink/40'
                  : 'w-2 h-2 bg-ink/15'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-paper border-2 border-ink/15 rounded-2xl p-8 shadow-lg text-center">
          <div className="text-5xl mb-5">{current.icon}</div>
          <h2 className="font-journal font-bold text-xl text-ink mb-4 leading-snug">
            {current.heading}
          </h2>
          <p className="font-journal text-sm text-ink/75 leading-relaxed mb-8">
            {current.body}
          </p>

          <button
            onClick={() => isLast ? onDone() : setStep(s => s + 1)}
            className="w-full py-3 rounded-full bg-ink text-paper font-journal text-base
                       hover:bg-ink-dark transition-all duration-200 shadow-md"
          >
            {isLast ? 'Begin writing ✦' : 'Continue'}
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
