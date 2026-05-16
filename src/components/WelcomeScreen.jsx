import { useState } from 'react'
import { getDailyAffirmation } from '../utils/affirmations'
import { formatDateDisplay, getTodayKey } from '../utils/storage'

const STEPS = [
  {
    icon: '✦',
    heading: 'Welcome to Still Space',
    body: 'This is a space that belongs entirely to you. No notifications pulling you away, no audience, no performance. Just you, your intentions, and the page.',
  },
  {
    icon: '◈',
    heading: 'Three practices, one morning',
    body: 'Move your body, settle your mind, and write what matters. Each one takes less than ten minutes. Together they change how you carry the day.',
  },
]

const S = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24,
    background: '#faf5ef',
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  dot: (active, done) => ({
    borderRadius: 9999,
    transition: 'all 0.3s',
    width: active ? 24 : 8, height: 8,
    background: active ? '#c4956a' : done ? 'rgba(196,149,106,0.4)' : 'rgba(44,31,20,0.12)',
  }),
  card: {
    background: '#fdf5e6',
    border: '1px solid rgba(196,149,106,0.22)',
    borderRadius: 20,
    padding: '36px 28px',
    textAlign: 'center',
    marginBottom: 16,
  },
  icon: { fontSize: '2.2rem', color: '#c4956a', marginBottom: 20, opacity: 0.75 },
  heading: { fontSize: '1.15rem', fontWeight: 'normal', letterSpacing: '0.04em', color: '#6b4c2a', marginBottom: 14, lineHeight: 1.4 },
  body: { fontSize: '0.82rem', lineHeight: 1.8, color: '#a89070' },
  btnPrimary: {
    width: '100%', padding: '14px', background: 'none',
    border: '1px solid rgba(44,31,20,0.22)', borderRadius: 40,
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: '0.78rem', letterSpacing: '0.16em', textTransform: 'uppercase',
    color: 'rgba(44,31,20,0.55)', cursor: 'pointer', WebkitAppearance: 'none',
    transition: 'border-color 0.2s, color 0.2s',
  },
  btnBack: {
    marginTop: 10, width: '100%', padding: '10px', background: 'none', border: 'none',
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: '0.72rem', letterSpacing: '0.1em', color: 'rgba(44,31,20,0.3)', cursor: 'pointer', WebkitAppearance: 'none',
  },
}

export default function WelcomeScreen({ onDone }) {
  const [step, setStep] = useState(0)
  const showAffirmation = step === STEPS.length
  const affirmation = getDailyAffirmation()
  const today = formatDateDisplay(getTodayKey())
  const totalSteps = STEPS.length + 1

  if (showAffirmation) {
    return (
      <div style={S.overlay}>
        <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
          <p style={{ fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#a89070', marginBottom: 24 }}>{today}</p>

          <div style={S.card}>
            <div style={S.icon}>✦</div>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.7, color: '#a89070', fontStyle: 'italic', marginBottom: 20 }}>
              This space is yours. Take a breath and begin.
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.85, color: '#6b4c2a' }}>
              "{affirmation}"
            </p>
          </div>

          <button onClick={onDone} style={S.btnPrimary}>
            Begin ✦
          </button>
        </div>
      </div>
    )
  }

  const current = STEPS[step]

  return (
    <div style={S.overlay}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={S.dot(i === step, i < step)} />
          ))}
        </div>

        <div style={S.card}>
          <div style={S.icon}>{current.icon}</div>
          <h2 style={S.heading}>{current.heading}</h2>
          <p style={S.body}>{current.body}</p>
        </div>

        <button onClick={() => setStep(s => s + 1)} style={S.btnPrimary}>
          Continue
        </button>

        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={S.btnBack}>
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}
