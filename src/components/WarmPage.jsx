// Shared layout shell for all non-scripting journal types
const S = {
  page:    { minHeight: '100vh', background: '#faf5ef', color: '#2c1f14', fontFamily: "Georgia, 'Times New Roman', serif", display: 'flex', flexDirection: 'column', WebkitFontSmoothing: 'antialiased' },
  header:  { display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px 16px', borderBottom: '1px solid rgba(44,31,20,0.08)', flexShrink: 0, background: '#faf5ef' },
  btnBack: { background: 'none', border: '1px solid rgba(44,31,20,0.15)', color: 'rgba(44,31,20,0.4)', borderRadius: '50%', width: 36, height: 36, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, WebkitAppearance: 'none', lineHeight: 1 },
  meta:    { flex: 1, minWidth: 0 },
  tag:     { fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#a89070' },
  title:   { fontSize: '0.9rem', fontWeight: 'normal', letterSpacing: '0.04em', marginTop: 2 },
  histBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'rgba(44,31,20,0.45)', letterSpacing: '0.04em', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 4, WebkitAppearance: 'none' },
  main:    { flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '28px 20px 24px' },
  footer:  { flexShrink: 0, borderTop: '1px solid rgba(44,31,20,0.07)', padding: '12px 20px', background: '#faf5ef' },
}

export default function WarmPage({ title, tag, onBack, onHistory, children, footer }) {
  return (
    <div style={S.page}>
      <header style={S.header}>
        <button onClick={onBack} style={S.btnBack}>←</button>
        <div style={S.meta}>
          <div style={S.tag}>{tag}</div>
          <div style={S.title}>{title}</div>
        </div>
        {onHistory && (
          <button onClick={onHistory} style={S.histBtn}>📖 History</button>
        )}
      </header>
      <main style={S.main}>{children}</main>
      {footer && <div style={S.footer}>{footer}</div>}
    </div>
  )
}
