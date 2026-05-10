import { useState } from 'react'

export default function SealButton({ sealed, onSeal, onUnseal }) {
  const [animating, setAnimating] = useState(false)

  function handleSeal() {
    setAnimating(true)
    setTimeout(() => {
      setAnimating(false)
      onSeal()
    }, 700)
  }

  if (sealed) {
    return (
      <button
        onClick={onUnseal}
        className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-ink text-ink font-journal text-sm
                   hover:bg-ink hover:text-paper transition-all duration-200"
        title="Unseal this entry to edit again"
      >
        <span>🔓</span> Unseal
      </button>
    )
  }

  return (
    <button
      onClick={handleSeal}
      disabled={animating}
      className={`flex items-center gap-2 px-5 py-2 rounded-full bg-ink text-paper font-journal text-sm
                  hover:bg-ink-dark transition-all duration-200 shadow-md
                  ${animating ? 'animate-seal-pulse' : ''}`}
      title="Seal today's entry"
    >
      <span>{animating ? '✨' : '🔒'}</span>
      {animating ? 'Sealing…' : 'Seal Entry'}
    </button>
  )
}
