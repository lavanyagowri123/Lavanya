import { useEffect, useState } from 'react'
import JournalPage from './components/JournalPage'
import InstallPrompt from './components/InstallPrompt'
import WelcomeScreen from './components/WelcomeScreen'
import DailyAffirmation from './components/DailyAffirmation'
import { initNotifications } from './utils/notifications'
import { getTodayKey } from './utils/storage'

const ONBOARDED_KEY = 'journal_onboarded'
const LAST_AFFIRMATION_KEY = 'journal_last_affirmation'

export default function App() {
  const [screen, setScreen] = useState(null) // 'welcome' | 'affirmation' | null

  useEffect(() => {
    initNotifications()

    const onboarded = localStorage.getItem(ONBOARDED_KEY)
    if (!onboarded) {
      setScreen('welcome')
      return
    }

    const lastSeen = localStorage.getItem(LAST_AFFIRMATION_KEY)
    if (lastSeen !== getTodayKey()) {
      setScreen('affirmation')
    }
  }, [])

  function handleWelcomeDone() {
    localStorage.setItem(ONBOARDED_KEY, 'true')
    localStorage.setItem(LAST_AFFIRMATION_KEY, getTodayKey())
    setScreen(null)
  }

  function handleAffirmationClose() {
    localStorage.setItem(LAST_AFFIRMATION_KEY, getTodayKey())
    setScreen(null)
  }

  return (
    <>
      <JournalPage />
      <InstallPrompt />
      {screen === 'welcome' && <WelcomeScreen onDone={handleWelcomeDone} />}
      {screen === 'affirmation' && <DailyAffirmation onClose={handleAffirmationClose} />}
    </>
  )
}
