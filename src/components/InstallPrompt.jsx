import { useState, useEffect } from 'react'

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

  // iOS Safari: no beforeinstallprompt — show manual instructions
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
  const showIosHint = isIos && !isInStandaloneMode && !dismissed

  if (isInStandaloneMode) return null

  if (showIosHint) {
    return (
      <div className="fixed bottom-0 inset-x-0 z-50 p-4 flex justify-center animate-fade-in">
        <div className="bg-paper border-2 border-ink/25 rounded-2xl shadow-xl p-4 max-w-sm w-full font-journal">
          <div className="flex justify-between items-start mb-2">
            <span className="text-ink font-bold text-sm">Add to Home Screen</span>
            <button onClick={handleDismiss} className="text-ink/40 hover:text-ink text-xl leading-none">×</button>
          </div>
          <p className="text-ink/70 text-xs leading-relaxed">
            Tap <span className="font-bold">Share</span> then <span className="font-bold">"Add to Home Screen"</span> to install your journal as an app.
          </p>
          <div className="mt-3 flex justify-center">
            <span className="text-2xl">⬆️ 📲</span>
          </div>
        </div>
      </div>
    )
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 flex justify-center animate-fade-in">
      <div className="bg-paper border-2 border-ink/25 rounded-2xl shadow-xl p-4 max-w-sm w-full font-journal">
        <div className="flex justify-between items-start mb-2">
          <span className="text-ink font-bold text-sm">Install Journal App</span>
          <button onClick={handleDismiss} className="text-ink/40 hover:text-ink text-xl leading-none">×</button>
        </div>
        <p className="text-ink/70 text-xs mb-3">
          Add to your home screen for a full-screen, offline experience.
        </p>
        <button
          onClick={handleInstall}
          className="w-full py-2 rounded-full bg-ink text-paper text-sm hover:bg-ink-dark transition-all"
        >
          📲 Install App
        </button>
      </div>
    </div>
  )
}
