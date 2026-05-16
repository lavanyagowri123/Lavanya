import { getTypedSortedKeys, getTypedEntry, formatDateDisplay, getTodayKey } from '../utils/storage'

export default function TypedHistoryPanel({ type, previewFn, onSelect, onClose }) {
  const keys = getTypedSortedKeys(type)
  const today = getTodayKey()

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(44,31,20,0.15)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', zIndex: 50, width: 300, maxWidth: '90vw', height: '100%', background: '#faf5ef', borderLeft: '1px solid rgba(44,31,20,0.12)', display: 'flex', flexDirection: 'column', fontFamily: "Georgia, 'Times New Roman', serif" }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid rgba(44,31,20,0.08)' }}>
          <span style={{ fontSize: '0.9rem', color: '#2c1f14', letterSpacing: '0.04em' }}>Past entries</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.4rem', color: 'rgba(44,31,20,0.4)', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>
          {keys.length === 0 && (
            <p style={{ textAlign: 'center', marginTop: 40, fontSize: '0.82rem', color: 'rgba(44,31,20,0.4)', fontStyle: 'italic' }}>No past entries yet.</p>
          )}
          {keys.map(k => {
            const entry = getTypedEntry(type, k)
            const isToday = k === today
            const preview = previewFn(entry)
            return (
              <button key={k} onClick={() => { onSelect(k, entry); onClose() }}
                style={{ width: '100%', textAlign: 'left', background: isToday ? 'rgba(44,31,20,0.04)' : 'none', border: '1px solid', borderColor: isToday ? 'rgba(44,31,20,0.2)' : 'rgba(44,31,20,0.08)', borderRadius: 12, padding: '12px 14px', marginBottom: 8, cursor: 'pointer', fontFamily: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.78rem', color: '#2c1f14' }}>{formatDateDisplay(k)}</span>
                  {isToday && <span style={{ fontSize: '0.6rem', color: '#a89070', letterSpacing: '0.1em', textTransform: 'uppercase' }}>today</span>}
                </div>
                {preview && <p style={{ fontSize: '0.72rem', color: 'rgba(44,31,20,0.5)', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{preview}</p>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
