import { useEffect, useState } from 'react'
import JournalMenu from './components/JournalMenu'
import JournalPage from './components/JournalPage'
import GratitudeJournal from './components/GratitudeJournal'
import WhyLadder from './components/WhyLadder'
import BrainDump from './components/BrainDump'
import DailyReflection from './components/DailyReflection'
import ReframeJournal from './components/ReframeJournal'
import InstallPrompt from './components/InstallPrompt'
import WelcomeScreen from './components/WelcomeScreen'
import DailyAffirmation from './components/DailyAffirmation'
import { initNotifications } from './utils/notifications'
import { getTodayKey } from './utils/storage'

const ONBOARDED_KEY = 'journal_onboarded'
const LAST_AFFIRMATION_KEY = 'journal_last_affirmation'

export default function App() {
  const [screen, setScreen] = useState(null) // 'welcome' | 'affirmation' | null
  const [journalType, setJournalType] = useState(null)

  useEffect(() => {
    initNotifications()
    const onboarded = localStorage.getItem(ONBOARDED_KEY)
    if (!onboarded) {
      setScreen('welcome')
    } else if (localStorage.getItem(LAST_AFFIRMATION_KEY) !== getTodayKey()) {
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

  const back = () => setJournalType(null)

  let content
  if (!journalType) {
    content = <JournalMenu onSelect={setJournalType} />
  } else {
    const map = {
      scripting: <JournalPage onBack={back} />,
      gratitude: <GratitudeJournal onBack={back} />,
      ladder:    <WhyLadder onBack={back} />,
      dump:      <BrainDump onBack={back} />,
      reflect:   <DailyReflection onBack={back} />,
      reframe:   <ReframeJournal onBack={back} />,
    }
    content = map[journalType] ?? <JournalMenu onSelect={setJournalType} />
  }

  return (
    <>
      {content}
      <InstallPrompt />
      {screen === 'welcome' && <WelcomeScreen onDone={handleWelcomeDone} />}
      {screen === 'affirmation' && <DailyAffirmation onClose={handleAffirmationClose} />}
    </>
  )
}
