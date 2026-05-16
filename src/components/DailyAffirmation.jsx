import { getDailyAffirmation } from '../utils/affirmations'
import { formatDateDisplay, getTodayKey } from '../utils/storage'

export default function DailyAffirmation({ onClose }) {
  const affirmation = getDailyAffirmation()
  const today = formatDateDisplay(getTodayKey())

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(250,245,239,0.88)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ position: 'relative', width: '100%', maxWidth: 360, textAlign: 'center', fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        <p style={{ fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#a89070', marginBottom: 24 }}>{today}</p>

        <div style={{ background: '#fdf5e6', border: '1px solid rgba(196,149,106,0.25)', borderRadius: 20, padding: '36px 28px', marginBottom: 20 }}>
          <div style={{ fontSize: '1.4rem', color: '#c4956a', marginBottom: 18, opacity: 0.7 }}>✦</div>
          <p style={{ fontSize: '0.78rem', lineHeight: 1.7, color: '#a89070', fontStyle: 'italic', marginBottom: 20 }}>
            This space is yours. Take a breath and begin.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.85, color: '#6b4c2a' }}>
            "{affirmation}"
          </p>
        </div>

        <button
          onClick={onClose}
          style={{ width: '100%', padding: '14px', background: 'none', border: '1px solid rgba(44,31,20,0.2)', borderRadius: 40, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '0.78rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(44,31,20,0.5)', cursor: 'pointer', WebkitAppearance: 'none', transition: 'border-color 0.2s, color 0.2s' }}
        >
          Open my journal
        </button>

        <p style={{ fontSize: '0.62rem', color: 'rgba(44,31,20,0.28)', marginTop: 14, letterSpacing: '0.08em' }}>tap anywhere to close</p>
      </div>
    </div>
  )
}
