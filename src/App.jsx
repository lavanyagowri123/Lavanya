import { useState } from 'react'
import JournalMenu from './components/JournalMenu'
import JournalPage from './components/JournalPage'
import GratitudeJournal from './components/GratitudeJournal'
import WhyLadder from './components/WhyLadder'
import BrainDump from './components/BrainDump'
import DailyReflection from './components/DailyReflection'
import ReframeJournal from './components/ReframeJournal'

export default function App() {
  const [journalType, setJournalType] = useState(null)
  const back = () => setJournalType(null)

  if (!journalType) return <JournalMenu onSelect={setJournalType} />

  const map = {
    scripting: <JournalPage onBack={back} />,
    gratitude: <GratitudeJournal onBack={back} />,
    ladder:    <WhyLadder onBack={back} />,
    dump:      <BrainDump onBack={back} />,
    reflect:   <DailyReflection onBack={back} />,
    reframe:   <ReframeJournal onBack={back} />,
  }
  return map[journalType] ?? <JournalMenu onSelect={setJournalType} />
}
