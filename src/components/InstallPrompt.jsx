import { useState, useEffect } from 'react'

const S = {
  wrap: { position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, padding: 16, display: 'flex', justifyContent: 'center' },
  card: { background: '#fdf5e6', border: '1px solid rgba(196,149,106,0.28)', borderRadius: 20, boxShadow: '0 4px 24px rgba(44,31,20,0.1)', padding: '16px 18px', maxWidth: 380, width: '100%', fontFamily: "Georgia, 'Times New Roman', serif" },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  title: { fontSize: '0.82rem', letterSpacing: '0.06em', color: '#6b4c2a' },
  dismiss: { background: 'none', border: 'none', fontSize: '1.1rem', color: 'rgba(44,31,20,0.3)', cursor: 'pointer', lineHeight: 1, padding: '0 0 0 8px' },
  body: { fontSize: '0.72rem', lineHeight: 1.65, color: '#a89070' },
  icons: { marginTop: 10, textAlign: 'center', fontSize: '1.4rem' },
  btn: { marginTop: 12, width: '100%', padding: '11px', background: 'none', border: '1px solid rgba(44,31,20,0.2)', borderRadius: 40, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(44,31,20,0.5)', cursor: 'pointer', WebkitAppearance: 'none' },
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('pwa_install_dismissed') === 'true'
  )

  useEffect(() => {
    function handler(e) {
      e.preventDefault()
      setDeferredPrompt(e)
      if (!dismissed) setShowBanner(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [dismissed])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShowBanner(false)
    setDeferredPrompt(null)
  }

  function handleDismiss() {
    setShowBanner(false)
    setDismissed(true)
    localStorage.setItem('pwa_install_dismissed', 'true')
  }

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
  const showIosHint = isIos && !isInStandaloneMode && !dismissed

  if (isInStandaloneMode) return null

  if (showIosHint) {
    return (
      <div style={S.wrap}>
        <div style={S.card}>
          <div style={S.row}>
            <span style={S.title}>Add to Home Screen</span>
            <button onClick={handleDismiss} style={S.dismiss}>×</button>
          </div>
          <p style={S.body}>
            Tap <strong style={{ color: '#6b4c2a' }}>Share</strong> then <strong style={{ color: '#6b4c2a' }}>"Add to Home Screen"</strong> to install as an app.
          </p>
          <div style={S.icons}>⬆️ 📲</div>
        </div>
      </div>
    )
  }

  if (!showBanner) return null

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.row}>
          <span style={S.title}>Install Still Space</span>
          <button onClick={handleDismiss} style={S.dismiss}>×</button>
        </div>
        <p style={S.body}>Add to your home screen for a full-screen experience.</p>
        <button onClick={handleInstall} style={S.btn}>📲 Install app</button>
      </div>
    </div>
  )
}
