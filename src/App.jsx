import { useEffect } from 'react'
import JournalPage from './components/JournalPage'
import InstallPrompt from './components/InstallPrompt'
import { initNotifications } from './utils/notifications'

export default function App() {
  useEffect(() => {
    initNotifications()
  }, [])

  return (
    <>
      <JournalPage />
      <InstallPrompt />
    </>
  )
}
